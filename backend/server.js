import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 5057;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Root route - explain this is the API (so visiting in browser isn't blank)
app.get('/', (req, res) => {
  res.type('html');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>GYLT API</title></head>
      <body style="font-family: system-ui; max-width: 600px; margin: 2rem auto; padding: 0 1rem;">
        <h1>GYLT API</h1>
        <p>This is the <strong>backend API</strong> only. It returns JSON, not the app UI.</p>
        <p>To see the app:</p>
        <ol>
          <li>Open a new terminal and run: <code>cd frontend && npm run dev</code></li>
          <li>In your browser go to <strong>http://localhost:5173</strong></li>
        </ol>
        <p>Useful endpoints:</p>
        <ul>
          <li><a href="/api/health">/api/health</a> – server status</li>
          <li><a href="/api/users">/api/users</a> – list users</li>
          <li><a href="/api/goals">/api/goals</a> – list goals</li>
          <li><a href="/api/quizzes">/api/quizzes</a> – list quizzes</li>
        </ul>
      </body>
    </html>
  `);
});

// ==================== USER ROUTES ====================

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id, user_email, user_first_name, user_last_name, created_at FROM users ORDER BY user_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT user_id, user_email, user_first_name, user_last_name, created_at FROM users WHERE user_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { user_email, user_password, user_first_name, user_last_name } = req.body;
    
    const result = await pool.query(
      'INSERT INTO users (user_email, user_password, user_first_name, user_last_name) VALUES ($1, $2, $3, $4) RETURNING user_id, user_email, user_first_name, user_last_name',
      [user_email, user_password, user_first_name, user_last_name]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === '23505') { // Unique violation
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// ==================== PLAN ROUTES ====================

// Get all plans for a user
app.get('/api/users/:userId/plans', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM plans WHERE user_id = $1 ORDER BY plan_id',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new plan
app.post('/api/users/:userId/plans', async (req, res) => {
  try {
    const { userId } = req.params;
    const { plan_timeline } = req.body;
    
    const result = await pool.query(
      'INSERT INTO plans (user_id, plan_timeline) VALUES ($1, $2) RETURNING *',
      [userId, plan_timeline]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== SECTION ROUTES ====================

// Get all sections
app.get('/api/sections', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM section ORDER BY section_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== LESSON ROUTES ====================

// Get all lessons
app.get('/api/lessons', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT l.*, s.section_name FROM lessons l JOIN section s ON l.section_id = s.section_id ORDER BY l.lesson_id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lessons by section
app.get('/api/sections/:sectionId/lessons', async (req, res) => {
  try {
    const { sectionId } = req.params;
    const result = await pool.query(
      'SELECT l.*, s.section_name FROM lessons l JOIN section s ON l.section_id = s.section_id WHERE l.section_id = $1 ORDER BY l.lesson_id',
      [sectionId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single lesson by ID
app.get('/api/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT l.*, s.section_name FROM lessons l JOIN section s ON l.section_id = s.section_id WHERE l.lesson_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== LESSONS COMPLETED ROUTES ====================

// Get completed lessons for a user
app.get('/api/users/:userId/lessons-completed', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT lc.*, l.lesson_description, l.lesson_video, l.lesson_content, s.section_name
       FROM lessons_completed lc
       JOIN lessons l ON lc.lesson_id = l.lesson_id
       JOIN section s ON l.section_id = s.section_id
       WHERE lc.user_id = $1
       ORDER BY lc.completed_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching completed lessons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark a lesson as completed
app.post('/api/users/:userId/lessons-completed', async (req, res) => {
  try {
    const { userId } = req.params;
    const { lesson_id, lesson_rating } = req.body;
    
    const result = await pool.query(
      `INSERT INTO lessons_completed (user_id, lesson_id, lesson_rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, lesson_id) 
       DO UPDATE SET lesson_rating = $3, completed_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, lesson_id, lesson_rating]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error marking lesson as completed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== QUIZ ROUTES ====================

// Get all quizzes with their questions
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzesResult = await pool.query(
      'SELECT q.*, s.section_name FROM quizzes q JOIN section s ON q.section_id = s.section_id ORDER BY q.quiz_id'
    );
    
    // Fetch questions for each quiz
    const quizzes = await Promise.all(
      quizzesResult.rows.map(async (quiz) => {
        const questionsResult = await pool.query(
          'SELECT question_id, prompt, options, correct_index FROM quiz_questions WHERE quiz_id = $1 ORDER BY question_id',
          [quiz.quiz_id]
        );
        return {
          ...quiz,
          questions: questionsResult.rows.map(q => ({
            id: q.question_id,
            prompt: q.prompt,
            options: q.options, // Already JSON array
            correctIndex: q.correct_index,
          })),
        };
      })
    );
    
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quizzes by section
app.get('/api/sections/:sectionId/quizzes', async (req, res) => {
  try {
    const { sectionId } = req.params;
    const quizResult = await pool.query(
      'SELECT q.*, s.section_name FROM quizzes q JOIN section s ON q.section_id = s.section_id WHERE q.section_id = $1',
      [sectionId]
    );
    
    if (quizResult.rows.length === 0) {
      return res.json([]);
    }
    
    const quiz = quizResult.rows[0];
    const questionsResult = await pool.query(
      'SELECT question_id, prompt, options, correct_index FROM quiz_questions WHERE quiz_id = $1 ORDER BY question_id',
      [quiz.quiz_id]
    );
    
    res.json({
      ...quiz,
      questions: questionsResult.rows.map(q => ({
        id: q.question_id,
        prompt: q.prompt,
        options: q.options,
        correctIndex: q.correct_index,
      })),
    });
  } catch (error) {
    console.error('Error fetching quiz by section:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single quiz by ID with questions
app.get('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quizResult = await pool.query(
      'SELECT q.*, s.section_name FROM quizzes q JOIN section s ON q.section_id = s.section_id WHERE q.quiz_id = $1',
      [id]
    );
    
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    const quiz = quizResult.rows[0];
    const questionsResult = await pool.query(
      'SELECT question_id, prompt, options, correct_index FROM quiz_questions WHERE quiz_id = $1 ORDER BY question_id',
      [id]
    );
    
    res.json({
      ...quiz,
      questions: questionsResult.rows.map(q => ({
        id: q.question_id,
        prompt: q.prompt,
        options: q.options,
        correctIndex: q.correct_index,
      })),
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== QUIZZES COMPLETED ROUTES ====================

// Get completed quizzes for a user (with progress info)
app.get('/api/users/:userId/quizzes-completed', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT qc.*, q.quiz_title, q.section_id, s.section_name
       FROM quizzes_completed qc
       JOIN quizzes q ON qc.quiz_id = q.quiz_id
       JOIN section s ON q.section_id = s.section_id
       WHERE qc.user_id = $1
       ORDER BY qc.completed_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching completed quizzes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save quiz result (aggregate: score and total_questions)
app.post('/api/users/:userId/quizzes-completed', async (req, res) => {
  try {
    const { userId } = req.params;
    const { quiz_id, score, total_questions } = req.body;
    
    if (!quiz_id || score === undefined || !total_questions) {
      return res.status(400).json({ error: 'Missing required fields: quiz_id, score, total_questions' });
    }
    
    const result = await pool.query(
      `INSERT INTO quizzes_completed (user_id, quiz_id, score, total_questions)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, quiz_id)
       DO UPDATE SET score = $3, total_questions = $4, completed_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, quiz_id, score, total_questions]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== GOAL ROUTES ====================

// Get all goals
app.get('/api/goals', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM goals ORDER BY priority_level, goal_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single goal by ID
app.get('/api/goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM goals WHERE goal_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching goal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== USER GOALS ROUTES ====================

// Get user goals
app.get('/api/users/:userId/goals', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT ug.*, g.goal_description, g.priority_level
       FROM user_goals ug
       JOIN goals g ON ug.goal_id = g.goal_id
       WHERE ug.user_id = $1
       ORDER BY g.priority_level, ug.goal_id`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user goals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a goal to a user
app.post('/api/users/:userId/goals', async (req, res) => {
  try {
    const { userId } = req.params;
    const { goal_id, is_completed } = req.body;
    
    const result = await pool.query(
      `INSERT INTO user_goals (user_id, goal_id, is_completed)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, goal_id)
       DO UPDATE SET is_completed = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, goal_id, is_completed || false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding user goal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user goal completion status
app.patch('/api/users/:userId/goals/:goalId', async (req, res) => {
  try {
    const { userId, goalId } = req.params;
    const { is_completed } = req.body;
    
    const result = await pool.query(
      `UPDATE user_goals
       SET is_completed = $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2 AND goal_id = $3
       RETURNING *`,
      [is_completed, userId, goalId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User goal not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user goal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
