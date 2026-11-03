# AGENTS.md — Development Rules & Operating Manual for Fitly

## 1. Product Overview
**Fitly** ("Apply where you fit.") is an AI-powered job-matching platform designed for job seekers in Egypt and the MENA region.
Instead of applying blindly to dozens of jobs, a candidate receives a curated shortlist of jobs they actually fit, ranked with an explicit match percentage and a breakdown of matched skills, missing skills, strengths, and gaps.
For each matching job, Fitly generates:
1. A tailored, ATS-friendly CV emphasizing relevant experience and skills.
2. A personalized cover letter matching one of 3 selectable tones.

**Prototype Scope:**
This repository is a 100% frontend-only, interactive, clickable prototype intended for academic demonstration to a university professor. All AI matching, CV tailoring, data extraction, and payments are realistically simulated on the client side without any external server or network dependencies.

---

## 2. Hard Constraints (Do's and Don'ts)

### DO:
- **Client-only execution**: Run entirely in the browser using Vite, React 18, and local JSON files.
- **Persist state**: Store profile data, application history, saved jobs, and credit balances in `localStorage`.
- **Provide Reset Demo**: Give users an immediate, unambiguous way to wipe `localStorage` and reset demo state to factory defaults.
- **Simulate AI realistically**: Centralize all simulated AI operations in `src/services/aiService.js` with artificial delays (1.2–2.5s) and step-by-step progress status messages.
- **Light mode only**: Adhere strictly to the clean, crisp light theme with pure white canvas and dark inversion surfaces where defined in `DESIGN.md`.
- **Ensure 100% interactivity**: Every button, link, filter, modal, and tab must function cleanly. No dead links or placeholder "coming soon" alerts.
- **Support responsive layouts**: Full support down to 360px mobile width with no horizontal overflow.

### DON'T:
- **NO backend**: Do not spin up Node servers, Express backends, mock service workers, or SQLite/Postgres databases.
- **NO external API calls**: Do not make outbound fetch requests to OpenAI, Anthropic, LinkedIn, Wuzzuf, or payment gateways.
- **NO real auth/login**: No authentication screens, passwords, OAuth, or sign-up walls. Open directly into the app flow. Maintain clean injection points in `src/context/` for future auth.
- **NO dark mode toggles**: Do not add theme switchers or dark mode classes to the `html` root.
- **NO UI component libraries**: Do not install MUI, Chakra, Ant Design, Shadcn, or Tailwind UI packages. Build all components cleanly with Tailwind CSS based on `DESIGN.md`.
- **NO CDN dependencies**: Use `@fontsource` for local Inter and JetBrains Mono fonts.

---

## 3. Tech Stack & Folder Structure

### Tech Stack
- **Framework**: React 18 (Vite, JavaScript JSX)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), strictly configured with design tokens from `DESIGN.md`
- **Icons**: `lucide-react`
- **Typography**: `@fontsource/inter` (weights 400, 500, 600) and `@fontsource/jetbrains-mono` (weight 400)
- **State**: React Context (`AppStateContext.jsx`) + custom hooks with `localStorage` synchronization
- **Document Output**: Print CSS stylesheet for CV (`window.print()`) and `.txt` cover letter export

### Directory Structure
```
fitly/
  AGENTS.md
  DESIGN.md
  PROGRESS.md
  public/
    assets/
      images/
      logos/
      avatars/
      CREDITS.md
  src/
    data/
      jobs.json
      candidates.json
      plans.json
      skills.json
      companies.json
      templates.json
    services/
      aiService.js
    context/
      AppStateContext.jsx
    hooks/
      useAppState.js
      useDebounce.js
    components/
      ui/            (Button, Input, Badge, Card, Modal, Tabs, Chip, Skeleton, Toast, Accordion, ScoreRing)
      layout/        (Navbar, Footer, Container, PageHeader)
      jobs/          (JobCard, JobFilters, MatchAnalysis, JobFeed)
      cv/            (CvPreview, CvEditor, CoverLetterEditor, AtsChecklist)
      credits/       (CreditBalanceChip, PricingCards, CheckoutModal, UsageHistoryTable)
      home/          (HeroDeviceMockup, FeatureCards, ComparisonTable)
    pages/
      LandingPage.jsx
      OnboardingPage.jsx
      MatchesPage.jsx
      JobDetailPage.jsx
      ApplyModal.jsx (or ApplyPage.jsx)
      CreditsPage.jsx
      ApplicationsPage.jsx
      SavedJobsPage.jsx
      ProfilePage.jsx
      NotFoundPage.jsx
    lib/
      formatters.js
      scoringHelpers.js
      constants.js
    styles/
      index.css
      print.css
```

---

## 4. Design Rules (`DESIGN.md` is Law)

1. **Primary CTA**: Pure black (`#000000`) fill with white text (`#ffffff`), 8px border radius (`rounded-md`), 40px height, Inter 500 (14px). Never use blue or colored fills for primary buttons.
2. **Text Links**: Inline links inside body copy use Text Link Blue (`#0d74ce`). Blue is never used as a button background.
3. **Radii Hierarchy**:
   - `rounded-md` (8px): Primary & secondary buttons, text inputs, icon squares.
   - `rounded-lg` (12px): Feature cards, pricing cards, code blocks, job cards.
   - `rounded-xl` (16px): Device mockup composite frame.
   - `rounded-full` (`rounded-pill`, 9999px): Small badges and status pills ONLY. Never for CTA buttons.
4. **Typography**:
   - Display/Headings: **Inter**, weight 600, negative letter spacing (`-0.5px` to `-1.92px`).
   - Body & Nav: **Inter**, weight 400 (body) and 500 (buttons & nav).
   - Code surfaces & technical data: **JetBrains Mono**, weight 400.
5. **Hero Gradient**: The soft sky-blue atmospheric gradient (`#cfe7ff` to `#a8c8e8`) is permitted **exclusively** behind the landing page hero band. It must never appear anywhere else in the application.
6. **No Inline Hex Values**: All styling must use defined Tailwind classes mapping directly to `DESIGN.md` design tokens or CSS variables.
7. **Semantic Color Usage**:
   - Match scores & success: Emerald/Green (`#16a34a`) for high match (≥80%).
   - Warning/Medium match: Amber/Gold (`#ab6400`) for moderate match (60–79%).
   - Muted/Low match: Gray/Muted (`#999999`) for low match (<60%).
   - Error: Soft red (`#eb8e90`).

---

## 5. Coding Conventions

- **Component Size**: Keep components modular and concise. Any component approaching >250 lines must be split into logical sub-components.
- **Pure & Functional**: Standard React functional components with hooks.
- **Accessibility**:
  - Proper HTML elements (`<main>`, `<nav>`, `<header>`, `<section>`, `<article>`, `<button>`).
  - Form controls have associated labels (`htmlFor` or `aria-label`).
  - Visible focus rings (`focus-visible:ring-2 focus-visible:ring-black`).
  - Proper `alt` attributes on all images.
- **Motion**: Subtle CSS transitions (150ms–250ms ease). Honor `prefers-reduced-motion`.
- **Responsive Layouts**: Designed mobile-first or verified across 360px (mobile), 768px (tablet), 1024px (desktop), and 1200px+ (max content width).

---

## 6. Realistic Data Rules

- **Egyptian & MENA Realism**: Salaries in EGP (e.g. 15,000 – 45,000 EGP/mo), real cities (Cairo, Giza, New Cairo, 6th of October, Alexandria, Mansoura, plus Riyadh/Dubai and Remote).
- **No Placeholders**: Never output "John Doe", "Company ABC", or "Lorem Ipsum". Use realistic Egyptian candidate names (e.g., Omar Tarek, Nour El-Din, Salma Hassan, Karim Mostafa) and credible fictional companies (e.g., NilePay Solutions, Khedive Health, Alexandria Data Labs, Kemet Logistics).
- **Normalized Skills**: Every skill referenced in candidates or jobs must link through `skills.json` taxonomy (handling synonyms like JS = JavaScript).
- **Curated Distribution**: At least 40–50 jobs across frontend, backend, fullstack, mobile, DevOps, QA, product, UI/UX, data, marketing, and operations.

---

## 7. Mock AI Service Rules

All simulated AI operations reside in `src/services/aiService.js`.
Every method must:
1. Be `async` and return a Promise.
2. Include JSDoc documenting input parameters and return shapes.
3. Feature a `// TODO(real-ai): Replace this mock with call to AI model / backend endpoint` annotation.
4. Introduce a natural delay (1200ms–2500ms) with support for step-by-step progress callbacks so UI skeletons and progress spinners render gracefully.
5. Execute deterministic algorithms:
   - Matching: 60% required skills, 15% nice-to-have skills, 15% title/domain overlap, 10% experience level fit.
   - Tailoring: Dynamically highlight matching skills, reorder bullet points to match job responsibilities, insert targeted job title in candidate summary.

---

## 8. Workflow Rules (Critical)

1. **Pre-flight**: Always read `AGENTS.md` and `PROGRESS.md` before starting any task.
2. **Phase-by-Phase**: Execute strictly in the order of the phases defined in the Execution Plan.
3. **Immediate Updates**: Update `PROGRESS.md` immediately upon completing each task.
4. **Non-destructive**: Never overwrite working files or delete established features without explicit rationale logged in `PROGRESS.md`.
5. **Resume Protocol**: If the session restarts, read `PROGRESS.md`, find the first unchecked task `[ ]` or in-progress task `[~]`, verify existing outputs, and proceed without repeating work.
6. **Self-Verification**: Never mark a task `[x]` without verifying through automated tests, build verification (`npm run build`), or browser testing.

---

## 9. Definition of Done for Prototype

The prototype is complete when:
1. All 11 screens/flows function smoothly with zero dead buttons.
2. The full user journey (Landing → Onboarding with Sample/Manual profile → Matches Feed → Job Details → Apply with Credit Deduction → Tailored CV/Cover Letter → Application Tracking) works seamlessly.
3. Credits system correctly decrements balances, shows insufficient balance modal, and handles the mock checkout flow with state persistence.
4. `npm run build` passes with zero errors and zero warnings.
5. Tested and verified in browser at 360px, 768px, and 1280px widths without UI breakage or console errors.
