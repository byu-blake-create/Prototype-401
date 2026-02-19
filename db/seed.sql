-- Seed data for GYLT database
-- Inserts sample data into all tables

-- Insert sample users
INSERT INTO users (user_email, user_password, user_first_name, user_last_name) VALUES
('john.doe@example.com', '$2b$10$example_hashed_password_1', 'John', 'Doe'),
('jane.smith@example.com', '$2b$10$example_hashed_password_2', 'Jane', 'Smith'),
('bob.johnson@example.com', '$2b$10$example_hashed_password_3', 'Bob', 'Johnson')
ON CONFLICT (user_email) DO NOTHING;

-- Insert sample sections
INSERT INTO section (section_name) VALUES
('Section 1: Financial Foundations'),
('Section 2: Building Wealth'),
('Section 3: Advanced Planning')
ON CONFLICT DO NOTHING;

-- Insert sample lessons
INSERT INTO lessons (section_id, lesson_title, lesson_description, lesson_video, lesson_content) VALUES
(1, 'HYSA', 'A high-yield savings account pays more interest than a typical checking account and is ideal for short-term goals and emergency savings.', 'https://example.com/videos/hysa', 'A high-yield savings account pays more interest than a typical checking account and is ideal for short-term goals and emergency savings.'),
(1, 'Credit Cards', 'Credit cards are powerful tools. Key concept: The Grace Period. If you pay your statement balance in full, you won''t be charged interest. Treat it like a debit card.', 'https://example.com/videos/credit-cards', 'Credit cards are powerful tools. Key concept: The Grace Period. If you pay your statement balance in full, you won''t be charged interest. Treat it like a debit card.'),
(1, 'Budgeting', 'Budgeting gives every dollar a job. Track your spending, set limits by category, and review weekly so your plan stays realistic.', 'https://example.com/videos/budgeting', 'Budgeting gives every dollar a job. Track your spending, set limits by category, and review weekly so your plan stays realistic.'),
(2, 'Investing 101', 'Investing helps money grow through compounding. Start with diversified funds and keep a long-term mindset.', 'https://example.com/videos/investing-101', 'Investing helps money grow through compounding. Start with diversified funds and keep a long-term mindset.'),
(2, 'Retirement Accounts', 'Retirement accounts like 401(k)s and IRAs provide tax advantages that can accelerate long-term wealth building.', 'https://example.com/videos/retirement-accounts', 'Retirement accounts like 401(k)s and IRAs provide tax advantages that can accelerate long-term wealth building.'),
(3, 'Student Loans', 'Understand rates, terms, and repayment options. Extra payments to principal reduce total interest cost.', 'https://example.com/videos/student-loans', 'Understand rates, terms, and repayment options. Extra payments to principal reduce total interest cost.'),
(3, 'First Home', 'Prepare with a strong credit profile, savings for down payment/closing costs, and a realistic monthly housing budget.', 'https://example.com/videos/first-home', 'Prepare with a strong credit profile, savings for down payment/closing costs, and a realistic monthly housing budget.')
ON CONFLICT DO NOTHING;

-- Insert quizzes (one per section)
INSERT INTO quizzes (section_id, quiz_title) VALUES
(1, 'Quiz: Financial Foundations'),
(2, 'Quiz: Building Wealth'),
(3, 'Quiz: Advanced Planning')
ON CONFLICT DO NOTHING;

-- Insert quiz questions for Section 1 quiz (Financial Foundations)
INSERT INTO quiz_questions (quiz_id, prompt, options, correct_index) VALUES
(1, 'A good first savings goal is usually:', '["Emergency fund", "Luxury vacation", "Newest phone"]', 0),
(1, 'Which account is often best for emergency savings?', '["Checking with no interest", "HYSA", "Long lock-up CD only"]', 1),
(1, 'Automating transfers to savings helps by:', '["Reducing consistency", "Making saving predictable", "Increasing spending"]', 1),
(1, 'What is a credit card grace period?', '["Time to pay without interest if balance is paid in full", "The minimum payment deadline", "A promotional interest rate"]', 0),
(1, 'The best way to use a credit card is:', '["Pay statement balance in full", "Pay only the minimum", "Skip payments occasionally"]', 0),
(1, 'Credit cards should be treated like:', '["Debit cards", "Free money", "Something to max out"]', 0)
ON CONFLICT DO NOTHING;

-- Insert quiz questions for Section 2 quiz (Building Wealth)
INSERT INTO quiz_questions (quiz_id, prompt, options, correct_index) VALUES
(2, 'Investing helps money grow through:', '["Compounding", "Keeping cash under mattress", "Only buying individual stocks"]', 0),
(2, 'Roth IRA contributions are made with:', '["Pre-tax dollars", "After-tax dollars", "Employer-only dollars"]', 1),
(2, 'One key benefit of a Roth IRA in retirement is:', '["Tax-free qualified withdrawals", "Guaranteed returns", "No market risk"]', 0),
(2, 'Best long-term strategy for many investors is:', '["Frequent day trading", "Diversified, consistent contributions", "All cash holdings"]', 1),
(2, '401(k) accounts typically offer:', '["Tax advantages and employer matching", "No tax benefits", "Guaranteed high returns"]', 0)
ON CONFLICT DO NOTHING;

-- Insert quiz questions for Section 3 quiz (Advanced Planning)
INSERT INTO quiz_questions (quiz_id, prompt, options, correct_index) VALUES
(3, 'What does a down payment reduce?', '["Interest rate only", "Loan amount borrowed", "Property taxes"]', 1),
(3, 'A fixed-rate mortgage means:', '["Rate changes monthly", "Rate stays the same for the loan term", "No closing costs"]', 1),
(3, 'PMI is commonly required when down payment is:', '["Less than 20%", "More than 50%", "Exactly 30%"]', 0),
(3, 'Extra payments on student loans should go to:', '["The loan with lowest balance", "The loan with highest interest rate", "Spread evenly across all loans"]', 1),
(3, 'When preparing to buy a home, you should:', '["Check credit score and save for down payment", "Buy immediately without planning", "Ignore your credit history"]', 0)
ON CONFLICT DO NOTHING;

-- Insert sample goals
INSERT INTO goals (goal_description, priority_level) VALUES
('Buy a House', 1),
('Get a Credit Card', 2),
('Open Bank Account', 3),
('Pay Student Loans', 4),
('Emergency Fund', 5)
ON CONFLICT DO NOTHING;

-- Insert sample plans (associating users with plans)
INSERT INTO plans (user_id, plan_timeline) VALUES
(1, '6 months'),
(1, '1 year'),
(2, '3 months'),
(2, '2 years'),
(3, '1 year')
ON CONFLICT DO NOTHING;

-- Insert sample user goals (associating users with goals)
INSERT INTO user_goals (user_id, goal_id, is_completed) VALUES
(1, 1, FALSE),
(1, 2, TRUE),
(1, 5, FALSE),
(2, 3, TRUE),
(2, 4, FALSE),
(2, 5, TRUE),
(3, 1, FALSE),
(3, 2, FALSE)
ON CONFLICT (user_id, goal_id) DO NOTHING;

-- Insert sample lessons completed
INSERT INTO lessons_completed (user_id, lesson_id, lesson_rating) VALUES
(1, 1, 5),
(1, 2, 4),
(1, 3, 5),
(2, 1, 4),
(2, 4, 5),
(3, 1, 3),
(3, 2, 4)
ON CONFLICT (user_id, lesson_id) DO NOTHING;

-- Insert sample quizzes completed (aggregate results: score/total_questions)
INSERT INTO quizzes_completed (user_id, quiz_id, score, total_questions) VALUES
(1, 1, 5, 6),  -- User 1 completed Section 1 quiz: 5/6
(1, 2, 4, 5),  -- User 1 completed Section 2 quiz: 4/5
(2, 1, 6, 6),  -- User 2 completed Section 1 quiz: 6/6
(2, 2, 3, 5),  -- User 2 completed Section 2 quiz: 3/5
(3, 1, 4, 6)   -- User 3 completed Section 1 quiz: 4/6
ON CONFLICT (user_id, quiz_id) DO NOTHING;
