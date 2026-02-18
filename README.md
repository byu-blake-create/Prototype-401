# GYLT (Get Your Life Together)

GYLT is a React + Vite web app focused on beginner financial wellness. It helps users track practical life goals, rank priorities, read short lessons, and take quizzes to reinforce learning.

## Features

- Goal tracking with step-by-step checklists (house, credit card, bank account, student loans, emergency fund)
- Financial stability progress ring based on completed checklist items
- Priority planning workflow with ranked top 5 goals and written action plans
- Lesson hub with expandable sections and focused lesson reading view
- Quiz system with instant feedback, scoring, results, and retry support
- Profile snapshot showing progress metrics

## Tech Stack

- React 18
- Vite 6
- Tailwind CSS 3
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

Default local URL is typically:

- [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

Build output is generated in:

- `dist/`

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```text
.
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - create production build
- `npm run preview` - locally preview production build

## Notes

- App state is currently in-memory (`useState`) and resets on refresh.
- The current implementation is a single-page app with tab-style navigation.
