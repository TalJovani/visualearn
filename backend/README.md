# VisuaLearn — Backend

FastAPI server that streams AI-generated algorithm explanations. See the [project README](../README.md) for the full picture.

## Setup

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file in this folder:
```
OPENAI_API_KEY=sk-your-key-here
```

Run it:
```bash
python main.py
```
Serves at `http://localhost:8000`.

## API

### `GET /explain?topic=<topic>`

Streams a GPT-generated explanation as newline-delimited JSON (`{"text": "..."}` per line), one chunk per token. Supported `topic` values: `bubble-sort`, `binary-search`, `quick-sort`, `fibonacci`. Any other value falls back to a generic prompt.

```bash
curl "http://localhost:8000/explain?topic=bubble-sort"
```

### `GET /`

Health check — returns `{"message": "VisuaLearn API is running"}`.

## Deployment

Deployed on Render using the `render.yaml` blueprint at the repo root (New → Blueprint on [dashboard.render.com](https://dashboard.render.com), select this repo, enter `OPENAI_API_KEY` when prompted). Render assigns its own port via the `PORT` env var, which `main.py` reads automatically.

## Adding a new topic

Add a `"topic-name": "prompt text"` entry to the `prompts` dict in `main.py`, then add a matching option in the frontend's topic picker.

## Notes

- Uses `gpt-4o-mini` — cheap and fast, well suited for short explanations.
- `openai>=1.0` client syntax (`client.chat.completions.create(...)`) — the old `openai.ChatCompletion.create(...)` API was removed in that version.
- CORS is currently open (`allow_origins` includes `"*"`) — fine for this project's scope, but worth tightening to the actual frontend domain if this ever needs to be more locked down.
