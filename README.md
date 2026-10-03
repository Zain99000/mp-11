# Asme + CampusFlow

One project, two pages:

| URL          | Page                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| `/`          | **Asme** landing page (first page). Click the arrow button beside the input. |
| `/campus/`   | **CampusFlow** — Engineering College Automation dashboard.                   |

Clicking the round arrow button next to the input on the Asme hero (or pressing Enter in the input)
opens CampusFlow. Inside CampusFlow, pages use hash routes, e.g. `/campus/#/students`, `/campus/#/schedule`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 (Asme). Click the arrow button to reach CampusFlow.

## Production build

```bash
npm run build      # outputs dist/index.html and dist/campus/index.html
npm run preview
```

## Layout

```
index.html               Asme entry            -> src/main.tsx
campus/index.html        CampusFlow entry      -> src/campusflow/main.jsx
src/App.tsx, components/ Asme UI (Tailwind 4)
src/campusflow/          CampusFlow app + its own styles.css
```

Asme and CampusFlow are separate HTML entries on purpose: CampusFlow ships its own global
stylesheet, and Tailwind (used by Asme) ships a global reset, so keeping them on separate pages
guarantees neither restyles the other.

CampusFlow data is demo/mock data. Asme's `.env.example` is unchanged (`GEMINI_API_KEY`, `APP_URL`).
