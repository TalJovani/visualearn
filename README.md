# VisuaLearn 🎓

An AI-powered educational visualization platform. Pick a computer science topic, and VisuaLearn generates a spoken explanation with GPT while animating the algorithm step by step — so you see it, hear it, and understand it at the same time.

## How it works

1. Pick a topic (e.g. Bubble Sort) and click **Visualize & Explain**.
2. The backend streams a GPT-generated explanation covering the core idea, its goal, and its time complexity.
3. The frontend animates the algorithm live — comparisons, swaps, pivots, and sorted elements are all color-coded.
4. Voice narration (via the browser's built-in Web Speech API) speaks each key step in sync with the animation, and can read the full explanation aloud on demand.

## Features

- **4 interactive visualizations**: Bubble Sort, Quick Sort, Binary Search, Fibonacci Sequence
- **AI explanations**: streamed in real time from OpenAI's API, covering idea / goal / time complexity
- **Synced voice narration**: the animation waits for narration to finish before continuing, so sound and motion never drift apart
- **Read Explanation button**: hear the full theoretical explanation for any topic

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Framer Motion, Axios, Web Speech API |
| Backend | FastAPI (Python), OpenAI API (streaming) |
| Planned deployment | Vercel (frontend), Render (backend) |

## Project Structure

```
visualearn/
├── frontend/               React + Vite app
│   ├── src/
│   │   ├── App.jsx         Main UI: topic picker, AI           explanation panel
│   │   ├── components/     One visualizer component per algorithm
│   │   └── main.jsx
│   └── package.json
│
├── backend/                FastAPI server
│   ├── main.py             /explain endpoint (streams GPT output)
│   ├── requirements.txt
│   └── .env                OPENAI_API_KEY (not committed)
│
└── .env                    OPENAI_API_KEY (not committed)
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- An OpenAI API key with available credit (this uses the **API**, not a ChatGPT subscription — see [platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing))

### Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        #Windows
pip install -r requirements.txt
```

Create `backend/.env`:
```
OPENAI_API_KEY=sk-your-key-here
```

Run the server:
```bash
python main.py
```
The API will be available at `http://localhost:8000`.

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

### Using the app

With both servers running, open `http://localhost:5173`, pick a topic, and click **🚀 Visualize & Explain**.

## Status

✅ Bubble Sort · Quick Sort · Binary Search · Fibonacci — visualized, explained, and narrated
🚧 Planned: A* and Dijkstra (pathfinding, grid-based visualization)
