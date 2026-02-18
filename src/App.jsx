import React, { useMemo, useState } from "react";
import {
  House,
  ClipboardList,
  BookOpen,
  HelpCircle,
  UserRound,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Target,
  ArrowLeft,
  Trophy,
} from "lucide-react";

const GOALS = [
  {
    id: "house",
    title: "Buy a House",
    steps: ["Check Credit Score", "Save Down Payment", "Compare Mortgage Rates"],
  },
  {
    id: "credit-card",
    title: "Get a Credit Card",
    steps: ["Research Starter Cards", "Apply", "Set Autopay in Full"],
  },
  {
    id: "bank-account",
    title: "Open Bank Account",
    steps: ["Choose a Bank", "Bring ID Documents", "Set Up Direct Deposit"],
  },
  {
    id: "student-loans",
    title: "Pay Student Loans",
    steps: ["List All Loans", "Pick Repayment Plan", "Pay Extra on Highest Rate"],
  },
  {
    id: "emergency-fund",
    title: "Emergency Fund",
    steps: ["Open HYSA", "Set Monthly Savings Target", "Reach 3-6 Months Expenses"],
  },
];

const LESSON_SECTIONS = [
  {
    id: 1,
    title: "Section 1",
    lessons: [
      {
        id: 1,
        title: "Lesson 1: HYSA",
        content:
          "A high-yield savings account pays more interest than a typical checking account and is ideal for short-term goals and emergency savings.",
      },
      {
        id: 2,
        title: "Lesson 2: Credit Cards",
        content:
          "Credit cards are powerful tools. Key concept: The Grace Period. If you pay your statement balance in full, you won't be charged interest. Treat it like a debit card.",
      },
      {
        id: 3,
        title: "Lesson 3: Budgeting",
        content:
          "Budgeting gives every dollar a job. Track your spending, set limits by category, and review weekly so your plan stays realistic.",
      },
    ],
  },
  {
    id: 2,
    title: "Section 2",
    lessons: [
      {
        id: 4,
        title: "Lesson 4: Investing 101",
        content:
          "Investing helps money grow through compounding. Start with diversified funds and keep a long-term mindset.",
      },
      {
        id: 5,
        title: "Lesson 5: Retirement Accounts",
        content:
          "Retirement accounts like 401(k)s and IRAs provide tax advantages that can accelerate long-term wealth building.",
      },
    ],
  },
  {
    id: 3,
    title: "Section 3",
    lessons: [
      {
        id: 7,
        title: "Lesson 7: Student Loans",
        content:
          "Understand rates, terms, and repayment options. Extra payments to principal reduce total interest cost.",
      },
      {
        id: 8,
        title: "Lesson 8: First Home",
        content:
          "Prepare with a strong credit profile, savings for down payment/closing costs, and a realistic monthly housing budget.",
      },
    ],
  },
];

const QUIZZES = [
  {
    id: 4,
    title: "Quiz #4: Understanding Mortgages",
    questions: [
      {
        prompt: "What does a down payment reduce?",
        options: ["Interest rate only", "Loan amount borrowed", "Property taxes"],
        correctIndex: 1,
      },
      {
        prompt: "A fixed-rate mortgage means:",
        options: [
          "Rate changes monthly",
          "Rate stays the same for the loan term",
          "No closing costs",
        ],
        correctIndex: 1,
      },
      {
        prompt: "PMI is commonly required when down payment is:",
        options: ["Less than 20%", "More than 50%", "Exactly 30%"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 5,
    title: "Quiz #5: Begin Your Roth IRA",
    questions: [
      {
        prompt: "Roth IRA contributions are made with:",
        options: ["Pre-tax dollars", "After-tax dollars", "Employer-only dollars"],
        correctIndex: 1,
      },
      {
        prompt: "One key benefit of a Roth IRA in retirement is:",
        options: [
          "Tax-free qualified withdrawals",
          "Guaranteed returns",
          "No market risk",
        ],
        correctIndex: 0,
      },
      {
        prompt: "Best long-term strategy for many investors is:",
        options: [
          "Frequent day trading",
          "Diversified, consistent contributions",
          "All cash holdings",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 2,
    title: "Quiz #2: Managing Savings",
    needsReview: true,
    defaultScore: 78,
    questions: [
      {
        prompt: "A good first savings goal is usually:",
        options: ["Emergency fund", "Luxury vacation", "Newest phone"],
        correctIndex: 0,
      },
      {
        prompt: "Which account is often best for emergency savings?",
        options: ["Checking with no interest", "HYSA", "Long lock-up CD only"],
        correctIndex: 1,
      },
      {
        prompt: "Automating transfers to savings helps by:",
        options: [
          "Reducing consistency",
          "Making saving predictable",
          "Increasing spending",
        ],
        correctIndex: 1,
      },
    ],
  },
];

function CircularProgress({ value, label }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;

  return (
    <div className="glass-card p-4">
      <p className="mb-3 text-sm font-medium text-slate-600">{label}</p>
      <div className="flex items-center gap-4">
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 132 132">
            <circle
              cx="66"
              cy="66"
              r={radius}
              stroke="#BAE6FD"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="66"
              cy="66"
              r={radius}
              stroke="#0284C7"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-slate-800">
            {value}%
          </div>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-medium text-slate-800">You are building momentum.</p>
          <p>Keep checking off goals to raise your score.</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [goalChecks, setGoalChecks] = useState(() =>
    Object.fromEntries(GOALS.map((g) => [g.id, g.steps.map(() => false)]))
  );

  const [priorities, setPriorities] = useState([
    { goalId: "", actionPlan: "" },
    { goalId: "", actionPlan: "" },
    { goalId: "", actionPlan: "" },
    { goalId: "", actionPlan: "" },
    { goalId: "", actionPlan: "" },
  ]);

  const [openSections, setOpenSections] = useState([1]);
  const [readingLesson, setReadingLesson] = useState(null);

  const [quizSession, setQuizSession] = useState(null);
  const [quizResults, setQuizResults] = useState({});

  const totalSteps = useMemo(
    () => GOALS.reduce((sum, goal) => sum + goal.steps.length, 0),
    []
  );
  const completedSteps = useMemo(
    () =>
      GOALS.reduce(
        (sum, goal) => sum + (goalChecks[goal.id] || []).filter(Boolean).length,
        0
      ),
    [goalChecks]
  );
  const stabilityProgress = Math.round((completedSteps / totalSteps) * 100);
  const selectedGoal = GOALS.find((g) => g.id === selectedGoalId);
  const priorityOptions = GOALS.map((goal) => ({ id: goal.id, label: goal.title }));
  const rankLabels = ["1st", "2nd", "3rd", "4th", "5th"];
  const orderedPrioritiesCount = priorities.filter((p) => p.goalId).length;
  const actionPlansCount = priorities.filter((p) => p.actionPlan.trim()).length;

  const nav = [
    { id: "home", label: "Home", icon: House },
    { id: "plans", label: "Plans", icon: ClipboardList },
    { id: "lessons", label: "Lessons", icon: BookOpen },
    { id: "quizzes", label: "Quizzes", icon: HelpCircle },
    { id: "profile", label: "Profile", icon: UserRound },
  ];

  const currentQuiz = quizSession ? QUIZZES.find((q) => q.id === quizSession.quizId) : null;
  const currentQuestion =
    currentQuiz && quizSession && !quizSession.finished
      ? currentQuiz.questions[quizSession.currentIndex]
      : null;
  const answerIsCorrect =
    currentQuestion &&
    quizSession &&
    quizSession.selectedIndex === currentQuestion.correctIndex;

  const toggleGoalStep = (goalId, stepIndex) => {
    setGoalChecks((prev) => {
      const next = [...prev[goalId]];
      next[stepIndex] = !next[stepIndex];
      return { ...prev, [goalId]: next };
    });
  };

  const updatePriority = (index, key, value) => {
    setPriorities((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const toggleSection = (sectionId) => {
    setOpenSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const startQuiz = (quizId) => {
    setQuizSession({
      quizId,
      currentIndex: 0,
      score: 0,
      selectedIndex: null,
      finished: false,
    });
  };

  const chooseAnswer = (index) => {
    if (!quizSession || quizSession.selectedIndex !== null) return;
    const correct = currentQuestion && index === currentQuestion.correctIndex;
    setQuizSession((prev) => ({
      ...prev,
      selectedIndex: index,
      score: prev.score + (correct ? 1 : 0),
    }));
  };

  const goNextQuestion = () => {
    if (!quizSession || !currentQuiz) return;
    const isLast = quizSession.currentIndex === currentQuiz.questions.length - 1;

    if (isLast) {
      const percent = Math.round((quizSession.score / currentQuiz.questions.length) * 100);
      setQuizResults((prev) => ({
        ...prev,
        [currentQuiz.id]: {
          score: quizSession.score,
          total: currentQuiz.questions.length,
          percent,
        },
      }));
      setQuizSession((prev) => ({ ...prev, finished: true }));
      return;
    }

    setQuizSession((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
      selectedIndex: null,
    }));
  };

  return (
    <div className="app-shell relative min-h-screen overflow-hidden text-slate-800">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bubble bubble-one" />
        <div className="bubble bubble-two" />
        <div className="bubble bubble-three" />
        <div className="bubble bubble-four" />
      </div>

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-md pb-24">
        <header className="sticky top-0 z-20 mx-3 mt-3 rounded-3xl border border-white/70 bg-white/65 px-4 py-3 shadow-sm backdrop-blur-xl">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">GYLT</h1>
          <p className="text-xs text-sky-700">Get Your Life Together</p>
        </header>

        <main className="space-y-4 p-4">
          {activeTab === "home" && (
            <>
              <section className="glass-card p-4">
                <h2 className="text-lg font-semibold">Welcome to GYLT</h2>
                <p className="text-sm text-slate-600">
                  Track your money goals and level up your financial confidence.
                </p>
              </section>

              <CircularProgress value={stabilityProgress} label="Financial Stability" />

              <section>
                <div className="mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-sky-600" />
                  <h3 className="text-sm font-semibold">My Goals</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {GOALS.map((goal) => {
                    const done = goalChecks[goal.id].filter(Boolean).length;
                    const total = goal.steps.length;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => setSelectedGoalId(goal.id)}
                        className="bubble-card p-3 text-left transition-all duration-200 hover:-translate-y-1"
                      >
                        <p className="text-sm font-medium">{goal.title}</p>
                        <p className="mt-1 text-xs text-slate-600">
                          {done}/{total} completed
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {activeTab === "plans" && (
            <section className="glass-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-sky-600" />
                <h2 className="text-lg font-semibold">Rank My Top 5 Priorities</h2>
              </div>
              <p className="text-sm text-slate-600">
                Put your five priorities in order, then write what you will do to
                accomplish each one.
              </p>
              <div className="mt-3 rounded-xl bg-sky-50/90 p-3 ring-1 ring-sky-100">
                <p className="text-xs font-medium text-slate-700">
                  Ranked: {orderedPrioritiesCount}/5
                </p>
                <p className="text-xs font-medium text-slate-700">
                  Action plans written: {actionPlansCount}/5
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {priorities.map((item, idx) => (
                  <div key={idx} className="bubble-card p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                        {idx + 1}
                      </span>
                      <p className="text-sm font-semibold">{rankLabels[idx]} Priority</p>
                    </div>

                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Choose priority
                    </label>
                    <select
                      value={item.goalId}
                      onChange={(e) => updatePriority(idx, "goalId", e.target.value)}
                      className="input-bubble mb-2 w-full"
                    >
                      <option value="">Select a goal</option>
                      {priorityOptions.map((option) => {
                        const alreadyUsedInAnotherRank = priorities.some(
                          (priority, priorityIndex) =>
                            priorityIndex !== idx && priority.goalId === option.id
                        );
                        return (
                          <option
                            key={option.id}
                            value={option.id}
                            disabled={alreadyUsedInAnotherRank}
                          >
                            {option.label}
                            {alreadyUsedInAnotherRank ? " (Already selected)" : ""}
                          </option>
                        );
                      })}
                    </select>

                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      What will I do to accomplish this?
                    </label>
                    <textarea
                      value={item.actionPlan}
                      onChange={(e) => updatePriority(idx, "actionPlan", e.target.value)}
                      placeholder="Write your action steps..."
                      className="input-bubble min-h-20 w-full resize-none"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "lessons" && (
            <>
              {!readingLesson ? (
                <section className="glass-card p-3">
                  <h2 className="px-2 pb-2 text-lg font-semibold">Curriculum</h2>
                  <div className="space-y-2">
                    {LESSON_SECTIONS.map((section) => {
                      const isOpen = openSections.includes(section.id);
                      return (
                        <div
                          key={section.id}
                          className="overflow-hidden rounded-xl border border-sky-100"
                        >
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="flex w-full items-center justify-between bg-sky-50/80 px-3 py-2 text-left text-sm font-medium transition hover:bg-sky-100/90"
                          >
                            {section.title}
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="bg-white p-2">
                              {section.lessons.map((lesson) => (
                                <button
                                  key={lesson.id}
                                  onClick={() => setReadingLesson(lesson)}
                                  className="mb-1 w-full rounded-lg px-2 py-2 text-left text-sm transition hover:bg-sky-50/90"
                                >
                                  {lesson.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : (
                <section className="glass-card p-4">
                  <button
                    onClick={() => setReadingLesson(null)}
                    className="mb-3 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-slate-600 transition hover:bg-sky-50/90 hover:text-slate-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Lessons
                  </button>
                  <h3 className="mb-2 text-lg font-semibold">{readingLesson.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{readingLesson.content}</p>
                </section>
              )}
            </>
          )}

          {activeTab === "quizzes" && (
            <>
              {!quizSession ? (
                <>
                  <section className="glass-card p-4">
                    <h2 className="text-lg font-semibold">Your Progress: 80%</h2>
                    <p className="text-sm text-slate-600">
                      Play quizzes to reinforce each lesson.
                    </p>
                  </section>
                  <section className="space-y-3">
                    {QUIZZES.map((quiz) => {
                      const saved = quizResults[quiz.id];
                      const scoreText = saved
                        ? `${saved.percent}%`
                        : quiz.defaultScore
                          ? `${quiz.defaultScore}%`
                          : null;
                      return (
                        <button
                          key={quiz.id}
                          onClick={() => startQuiz(quiz.id)}
                          className="bubble-card w-full p-4 text-left transition-all duration-200 hover:-translate-y-1"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium">{quiz.title}</p>
                            {quiz.needsReview && (
                              <span className="rounded-full bg-sky-100 px-2 py-1 text-[10px] font-semibold text-sky-700">
                                NEEDS REVIEW
                              </span>
                            )}
                          </div>
                          {scoreText && (
                            <p className="mt-2 text-xs text-slate-600">Score: {scoreText}</p>
                          )}
                        </button>
                      );
                    })}
                  </section>
                </>
              ) : quizSession.finished ? (
                <section className="glass-card p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-sky-600" />
                    <h2 className="text-lg font-semibold">Quiz Complete</h2>
                  </div>
                  <p className="text-sm text-slate-700">
                    You scored <strong>{quizSession.score}</strong> out of{" "}
                    <strong>{currentQuiz.questions.length}</strong> (
                    {Math.round((quizSession.score / currentQuiz.questions.length) * 100)}%)
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => startQuiz(currentQuiz.id)}
                      className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500 hover:shadow-md"
                    >
                      Retry Quiz
                    </button>
                    <button
                      onClick={() => setQuizSession(null)}
                      className="rounded-lg border border-sky-200 bg-white/70 px-4 py-2 text-sm font-medium transition hover:bg-sky-50/90"
                    >
                      Back to Quiz List
                    </button>
                  </div>
                </section>
              ) : (
                <section className="glass-card p-4">
                  <p className="mb-1 text-xs text-slate-500">
                    Question {quizSession.currentIndex + 1} of {currentQuiz.questions.length}
                  </p>
                  <h3 className="mb-3 text-base font-semibold">{currentQuestion.prompt}</h3>

                  <div className="space-y-2">
                    {currentQuestion.options.map((option, i) => {
                      const selected = quizSession.selectedIndex === i;
                      const reveal = quizSession.selectedIndex !== null;
                      const correct = i === currentQuestion.correctIndex;

                      let stateClass = "border-sky-200 bg-white/70 hover:bg-sky-50/90";
                      if (reveal && correct) stateClass = "border-emerald-300 bg-emerald-50";
                      if (reveal && selected && !correct) {
                        stateClass = "border-rose-300 bg-rose-50";
                      }

                      return (
                        <button
                          key={option}
                          onClick={() => chooseAnswer(i)}
                          disabled={quizSession.selectedIndex !== null}
                          className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${stateClass}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {quizSession.selectedIndex !== null && (
                    <div className="mt-3 rounded-lg bg-sky-50/90 p-3">
                      <p
                        className={`text-sm font-semibold ${
                          answerIsCorrect ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {answerIsCorrect ? "Correct!" : "Incorrect"}
                      </p>
                      <button
                        onClick={goNextQuestion}
                        className="mt-2 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-sky-500 hover:shadow-md"
                      >
                        {quizSession.currentIndex === currentQuiz.questions.length - 1
                          ? "See Results"
                          : "Next Question"}
                      </button>
                    </div>
                  )}
                </section>
              )}
            </>
          )}

          {activeTab === "profile" && (
            <section className="glass-card p-4">
              <h2 className="text-lg font-semibold">Profile</h2>
              <p className="mt-1 text-sm text-slate-600">
                Keep showing up. Small wins compound.
              </p>
              <div className="mt-3 rounded-xl bg-sky-50/90 p-3 ring-1 ring-sky-100">
                <p className="text-sm">
                  Goals completed:{" "}
                  <strong>
                    {completedSteps}/{totalSteps}
                  </strong>
                </p>
                <p className="text-sm">
                  Priorities ranked: <strong>{orderedPrioritiesCount}/5</strong>
                </p>
                <p className="text-sm">
                  Action plans written: <strong>{actionPlansCount}/5</strong>
                </p>
              </div>
            </section>
          )}
        </main>

        <nav className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-3xl border border-white/70 bg-white/70 px-2 py-2 shadow-lg backdrop-blur-xl">
          <div className="grid grid-cols-5 gap-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center rounded-lg py-1 text-[11px] transition ${
                    active
                      ? "bg-sky-100 text-sky-700 shadow-sm"
                      : "text-slate-500 hover:bg-sky-50/90 hover:text-slate-800"
                  }`}
                >
                  <Icon className="mb-1 h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {selectedGoal && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/35 p-4 backdrop-blur-sm sm:items-center">
          <div className="glass-card w-full max-w-md p-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold">{selectedGoal.title}</h3>
              <button
                onClick={() => setSelectedGoalId(null)}
                className="rounded-lg p-1 text-slate-500 transition hover:bg-sky-50/90 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-3 text-sm text-slate-600">Checklist</p>

            <div className="space-y-2">
              {selectedGoal.steps.map((step, index) => {
                const checked = goalChecks[selectedGoal.id][index];
                return (
                  <button
                    key={step}
                    onClick={() => toggleGoalStep(selectedGoal.id, index)}
                    className="flex w-full items-center gap-2 rounded-lg border border-sky-100 bg-white/70 px-3 py-2 text-left text-sm transition hover:bg-sky-50/90"
                  >
                    {checked ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-400" />
                    )}
                    <span className={checked ? "text-slate-500 line-through" : ""}>
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
