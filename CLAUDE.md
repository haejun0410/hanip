# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (HMR)
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Serve the production build locally
```

No test suite exists in this project.

## Architecture

**HanIP (한입)** is a Korean fintech prototype — a mobile-first UI for tax deductions (절세) and government subsidies (정부지원금). It is a pure frontend with all data hardcoded/mocked; there is no backend or API integration.

### Mobile frame layout

The app simulates a phone screen: `#root` centers a fixed-width `.app-frame` (390 px) on a gray background. The frame is a flex column of three fixed regions:

```
┌─────────────────┐
│     Header      │  height: var(--header-height, 56px)
├─────────────────┤
│   .page-content │  flex: 1, overflow-y: auto — all page scrolling happens here
├─────────────────┤
│    BottomNav    │  height: var(--bottom-nav-height, 64px)
└─────────────────┘
```

CSS custom properties for colors, spacing, shadows, and radii are defined in `src/index.css` and used with inline styles throughout all components (no CSS modules, no Tailwind).

### Auth-gated routing (`src/App.tsx`)

`AppShell` reads `isLoggedIn` from `AuthContext` and renders either the authenticated page or its guest counterpart on every route. Auth state is in-memory only (`useState(false)`) — a login call sets it to `true`, refresh resets to `false`.

### Header configuration pattern

Every page calls `useHeaderConfig(cfg)` at its top level. This hook writes to `HeaderContext` via `useEffect`, which the shared `Header` component reads to show/hide the back button, bell icon, logo, title, and notification badge. Pages that need a custom header must call this hook — it's the only way to control header appearance.

### Guest pages

Routes that require login render a `Guest*` variant page for unauthenticated users. These wrap a blurred/dimmed copy of the real page content inside `<GuestPreview>`, which overlays a login prompt card. When adding a new protected page, follow this same pattern.

### Login flow (`src/pages/Login/LoginFlow.tsx`)

A single-component, 5-step wizard (`본인 인증 → 가족 관계 → 소득 정보 → 주식 정보 → 마이데이터`). All state is local. After the final step it shows a 2-second loading screen, then a completion screen. Pressing the CTA calls `login()` from `AuthContext` and navigates to `/`.

### Global CSS utility classes

Defined in `src/index.css` and used across pages via `className`:

| Class | Purpose |
|---|---|
| `.card` | White rounded card with shadow |
| `.badge`, `.badge-{blue,green,orange,purple,gray,red}` | Pill labels |
| `.btn-primary` / `.btn-secondary` | Full-width action buttons |
| `.input` | Styled text input |
| `.section` / `.section-header` / `.section-title` | Page section layout helpers |
| `.divider` | 8px gray horizontal separator |
| `.scroll-x` | Horizontal scroll container |

### Persona-based data routing

Two hardcoded user personas live in `src/data/`: `hanbeoteam.ts` (single mother) and `kimgodsaeng.ts` (young adult). Pages resolve data by checking `userName` from `useAuth()` against the persona name constant, then selecting the matching dataset. When adding new data-driven pages, follow this same branch pattern.

### Chatbot answer system (`src/pages/Chatbot/`)

The chatbot is purely frontend — no LLM API. `ChatbotPage` resolves answers via two indexed maps:

- **`ragAnswers`**: keyed `[question_text][coach_id]`; `findRagAnswer()` normalizes input, scores keywords, returns a match if score ≥ 2.
- **`quickReplyAnswers`**: exact-match map for preset quick-reply buttons.

Three coach levels (`easy` / `summary` / `strategy`) provide different answer styles for the same question. The UI simulates a 3-step search with 850 ms delays before showing the final answer. Coach selection is persisted in `localStorage` under `hanip-chatbot-coach` via `ChatbotCoachContext`; the page redirects to `/chatbot/init` if no coach is set.

### Global contexts

| Context | Storage | Purpose |
|---|---|---|
| `AuthContext` | In-memory | `isLoggedIn`, `userName`, `login()`, `logout()` |
| `ChatbotCoachContext` | `localStorage` | Selected coach ID; validates saved ID against known profiles on load |
| `StreakContext` | `localStorage` | Daily activity streak; seeds 7 days of history on first load |
| `HeaderContext` | In-memory | Per-page header config written by `useHeaderConfig()` |

### Stack

React 19, React Router 7, Vite 8, TypeScript 6 (strict mode). No test suite.
