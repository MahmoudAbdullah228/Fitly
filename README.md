# Fitly — Apply where you fit.

> **AI-Powered Job-Matching Platform for Egypt & the MENA Region**  
> An interactive, client-first frontend prototype built for academic demonstration.

[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)

---

## 📌 Overview

**Fitly** solves the broken "blind resume blasting" problem in the job search market. Instead of applying blindly to dozens of dead-end job postings, job seekers receive a curated **Top 10 shortlist** of roles they actually fit, ranked with an explicit **Match Percentage** and an explainable breakdown of matched skills, missing skills, strengths, and gap analysis.

For each matching job, Fitly generates:
1. **A tailored, ATS-friendly CV** emphasizing role-relevant experience, highlighted keywords, and restructured bullet points.
2. **A personalized cover letter** matching one of 3 selectable tones (*Professional*, *Friendly*, or *Concise*).
3. **Credit-based application economy** (starts with 4 free starter credits, exactly 2 full applications, with simulated pay-as-you-go packs and subscription plans in EGP).

---

## ✨ Key Features

- **🎯 Deterministic AI Matching Algorithm**: Evaluates candidate profile against jobs using weighted criteria (60% required skills, 15% nice-to-have skills, 15% title/domain overlap, 10% experience level fit).
- **📄 Instant ATS CV & Cover Letter Tailoring**: One-click generation with before/after diff summary, live in-browser editor, print-optimized PDF output (`window.print()`), and `.txt` cover letter export.
- **🇪🇬 Realistic Egyptian & MENA Dataset**: 46 curated jobs across tech, fintech, logistics, health, and design, featuring realistic salaries in EGP (e.g., 20K–65K EGP/mo), Egyptian cities (Cairo, Giza, New Cairo, Smart Village, Alexandria), and local sources (LinkedIn, Wuzzuf, Indeed, Bayt, Forasna).
- **💳 Credit & Billing System**: Real-time credit deductions, low-balance warnings, and mock checkout modal accepting arbitrary inputs with zero external dependencies.
- **📊 Interactive Applications Tracker**: Track applied positions across pipeline stages (*Applied*, *Interviewing*, *Offer*, *Rejected*) and review stored tailored materials anytime.
- **📱 Responsive & Accessible**: 100% responsive from 360px mobile viewports up to large desktop screens, conforming strictly to the Expo-Neutral design token system (`DESIGN.md`).

---

## 🛠️ Tech Stack

- **Framework**: React 18 (Vite, JavaScript JSX)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite` and strict design tokens
- **Typography**: `@fontsource/inter` (400, 500, 600) and `@fontsource/jetbrains-mono` (400)
- **Icons**: `lucide-react`
- **State Management**: React Context (`AppStateContext.jsx`) synchronized with browser `localStorage`
- **Mock AI Layer**: Deterministic client-side service (`src/services/aiService.js`) with realistic delays and progress callbacks

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm` or `yarn`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MahmoudAbdullah228/Fitly.git

# 2. Navigate to project directory
cd Fitly

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
Fitly/
├── AGENTS.md                  # Development rules and architecture guidelines
├── DESIGN.md                  # Design system tokens and specifications
├── PROGRESS.md                # Task tracker and implementation logs
├── public/
│   ├── assets/
│   │   ├── favicon.svg        # Official Fitly SVG icon
│   │   ├── logos/             # Fictional MENA company monograms
│   │   └── avatars/           # Candidate and team avatars
├── src/
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives (Button, Card, Modal, ScoreRing, etc.)
│   │   ├── layout/            # Navbar, Footer, AppLayout
│   │   ├── home/              # Hero device mockup, Comparison table, Features
│   │   ├── jobs/              # JobCard, JobFilters, MatchAnalysis, ApplyModal
│   │   └── credits/           # Pricing cards, Checkout modal, Usage history
│   ├── data/
│   │   ├── jobs.json          # 46 realistic MENA job listings
│   │   ├── skills.json        # Normalized skills taxonomy and aliases
│   │   ├── companies.json     # Company profiles
│   │   ├── plans.json         # EGP credit packs & subscriptions
│   │   └── templates.json     # CV rewriting and cover letter tone templates
│   ├── services/
│   │   └── aiService.js       # Centralized mock AI service layer
│   ├── context/
│   │   └── AppStateContext.jsx # Global state & localStorage persistence
│   ├── pages/                 # Route pages (Landing, Start, Matches, Detail, Credits, etc.)
│   └── styles/
│       ├── index.css          # Tailwind CSS v4 tokens and theme variables
│       └── print.css          # Print-friendly single-column ATS CV styles
└── package.json
```

---

## 📜 License

This prototype is created for educational and demonstration purposes. All rights reserved.
