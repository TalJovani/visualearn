# VisuaLearn — Frontend

React + Vite app for VisuaLearn. See the [project README](../README.md) for the full picture (what this is, how it works, tech stack).

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`. Requires the [backend](../backend/README.md) running at `http://localhost:8000` for the AI explanation feature to work — the visualizations themselves run without it.

By default the app calls `http://localhost:8000`. To point it at a deployed backend instead, set `VITE_API_URL` (e.g. in a `.env` file, or via `vercel env add VITE_API_URL production` when deploying) — it's read at build time, so redeploy after changing it.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Structure

- `src/App.jsx` — topic picker, calls the backend's `/explain` endpoint, streams the response into the explanation panel
- `src/components/*Visualizer.jsx` — one component per algorithm, each owns its own animation state and voice narration
- `src/hooks/useVoiceNarration.js` — shared speech + play/pause/resume control used by every visualizer
- `src/utils/arrayPresets.js` — generates randomized input arrays, including best/worst-case edge cases
- Adding a new algorithm: create a new `<Name>Visualizer.jsx` (copy an existing one as a template), register it in `App.jsx`'s topic list, and add a matching prompt in `backend/main.py`
