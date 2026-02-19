// API service functions for backend communication

const API_BASE_URL = '/api';

/**
 * Fetch all goals from the backend
 */
export async function fetchGoals() {
  try {
    const response = await fetch(`${API_BASE_URL}/goals`);
    if (!response.ok) {
      throw new Error('Failed to fetch goals');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
}

/**
 * Fetch all sections from the backend
 */
export async function fetchSections() {
  try {
    const response = await fetch(`${API_BASE_URL}/sections`);
    if (!response.ok) {
      throw new Error('Failed to fetch sections');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw error;
  }
}

/**
 * Fetch all lessons from the backend
 */
export async function fetchLessons() {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons`);
    if (!response.ok) {
      throw new Error('Failed to fetch lessons');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
}

/**
 * Fetch lessons by section ID
 */
export async function fetchLessonsBySection(sectionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/lessons`);
    if (!response.ok) {
      throw new Error('Failed to fetch lessons for section');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching lessons by section:', error);
    throw error;
  }
}

/**
 * Fetch all quizzes from the backend (with questions)
 */
export async function fetchQuizzes() {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes`);
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
}

/**
 * Fetch quizzes by section ID
 */
export async function fetchQuizzesBySection(sectionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/sections/${sectionId}/quizzes`);
    if (!response.ok) {
      throw new Error('Failed to fetch quiz for section');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz by section:', error);
    throw error;
  }
}

/**
 * Fetch a single quiz by ID (with questions)
 */
export async function fetchQuizById(quizId) {
  try {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch quiz');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
}

/** Fetch completed quizzes for a user (progress tracking). */
export async function fetchCompletedQuizzes(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/quizzes-completed`);
    if (!response.ok) {
      throw new Error('Failed to fetch completed quizzes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching completed quizzes:', error);
    throw error;
  }
}

/** Save quiz completion (aggregate score and total_questions). */
export async function saveQuizResult(userId, quizId, score, totalQuestions) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/quizzes-completed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quiz_id: quizId,
        score: score,
        total_questions: totalQuestions,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to save quiz result');
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
}

/**
 * Fetch user goals (for a specific user)
 */
export async function fetchUserGoals(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/goals`);
    if (!response.ok) {
      throw new Error('Failed to fetch user goals');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user goals:', error);
    throw error;
  }
}

/**
 * Update user goal completion status
 */
export async function updateUserGoal(userId, goalId, isCompleted) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/goals/${goalId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_completed: isCompleted,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update user goal');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user goal:', error);
    throw error;
  }
}

/**
 * Add a goal to a user
 */
export async function addUserGoal(userId, goalId, isCompleted = false) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal_id: goalId,
        is_completed: isCompleted,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to add user goal');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding user goal:', error);
    throw error;
  }
}
