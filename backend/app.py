
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
import json
from typing import List, Optional
import os

# Mock implementation until Vertex AI setup is complete
class ChatResponse(BaseModel):
    text: str
    citations: List[dict] = []

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Process chat messages and return AI responses.
    
    This is a temporary mock implementation. When you set up the actual Vertex AI credentials,
    you can uncomment the code below and implement the actual Gemini integration.
    """
    user_message = request.message
    history = request.history
    
    # Simple response logic for testing - replace with actual Gemini integration
    if "weather" in user_message.lower():
        return ChatResponse(
            text="I don't have real-time weather data access, but San Francisco generally has a cool Mediterranean climate characterized by mild, wet winters and dry summers.",
            citations=[]
        )
    elif "next.js" in user_message.lower():
        return ChatResponse(
            text="Next.js offers several advantages including server-side rendering, static site generation, file-based routing, API routes, and built-in image optimization.",
            citations=[{"title": "Next.js Documentation", "uri": "https://nextjs.org/docs"}]
        )
    elif "algorithm" in user_message.lower() or "dijkstra" in user_message.lower():
        return ChatResponse(
            text="Dijkstra's algorithm is used to find the shortest path between nodes in a graph. Here's a simplified implementation...",
            citations=[{"title": "Algorithm Explanation", "uri": "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm"}]
        )
    elif "essay" in user_message.lower() or "silicon valley" in user_message.lower():
        return ChatResponse(
            text="Silicon Valley, located in the southern part of the San Francisco Bay Area, has become synonymous with technological innovation and entrepreneurship.",
            citations=[{"title": "Silicon Valley History", "uri": "https://en.wikipedia.org/wiki/Silicon_Valley"}]
        )
    else:
        return ChatResponse(
            text="I'm a simulated AI assistant. When fully implemented with Vertex AI credentials, I'll be able to provide more helpful responses.",
            citations=[]
        )

@app.get("/")
async def root():
    return {"message": "API is running. Use /api/chat endpoint for chat functionality."}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
