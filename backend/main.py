from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from openai import OpenAI
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.get("/")
def root():
    return {"message": "VisuaLearn API is running"}

@app.get("/explain")
async def explain(topic: str):
    """Stream explanation for a given topic"""
    
    prompts = {
        "bubble-sort": "Explain the bubble sort algorithm in 4-5 short sentences: what the core idea is, what goal it achieves, and finish with its time complexity (best, average and worst case) and why.",
        "binary-search": "Explain the binary search algorithm in 4-5 short sentences: what the core idea is, what goal it achieves, and finish with its time complexity and why.",
        "quick-sort": "Explain the quicksort algorithm in 4-5 short sentences: what the core idea is, what goal it achieves, and finish with its time complexity (best, average and worst case) and why.",
    }

    prompt = prompts.get(topic, f"Explain {topic} in 4-5 short sentences: the core idea, its goal, and its time complexity.")
    
    def generate():
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ],
            stream=True,
        )
        for chunk in response:
            text = chunk.choices[0].delta.content
            if text:
                yield json.dumps({"text": text}) + "\n"
    
    return StreamingResponse(generate(), media_type="application/x-ndjson")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)