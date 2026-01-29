from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import ollama
import json

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple safety check (Acting as a mock MCP interaction)
# In a full setup, this would call a separate MCP process via stdio
def mcp_security_check(user_input: str):
    forbidden_keywords = ["/etc/passwd", "system32", "rm -rf"]
    for word in forbidden_keywords:
        if word in user_input:
            return False, "Security Alert: Input contains restricted commands."
    return True, user_input

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")

    # 1. Secure the input using MCP principles (Validation)
    is_safe, processed_input = mcp_security_check(user_message)
    if not is_safe:
        return {"response": f"⚠️ **{processed_input}**"}

    # 2. Get output from local Ollama
    response = ollama.chat(model='MedAIBase/MedGemma1.0:4b', messages=[
        {'role': 'user', 'content': processed_input},
    ])
    
    return {"response": response['message']['content']}

@app.get("/", response_class=HTMLResponse)
async def get_index():
    with open("index.html") as f:
        return f.read()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)