
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from typing import List, Optional
import os

# Model definitions
class ChatResponse(BaseModel):
    text: str
    citations: List[dict] = []

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

app = FastAPI()

# Configure CORS - This is crucial for frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Process chat messages and return AI responses.
    """
    user_message = request.message
    history = request.history
    
    # Simple response logic for testing - replace with actual Gemini integration later
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
            text="Dijkstra's algorithm is used to find the shortest path between nodes in a graph. Here's a simplified implementation in Python:\n\ndef dijkstra(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    unvisited = list(graph.keys())\n    \n    while unvisited:\n        current = min(unvisited, key=lambda node: distances[node])\n        \n        if distances[current] == float('inf'):\n            break\n            \n        for neighbor, cost in graph[current].items():\n            distance = distances[current] + cost\n            \n            if distance < distances[neighbor]:\n                distances[neighbor] = distance\n                \n        unvisited.remove(current)\n        \n    return distances",
            citations=[{"title": "Algorithm Explanation", "uri": "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm"}]
        )
    elif "essay" in user_message.lower() or "silicon valley" in user_message.lower():
        return ChatResponse(
            text="Silicon Valley, located in the southern part of the San Francisco Bay Area, has become synonymous with technological innovation and entrepreneurship. The region has been the birthplace of numerous tech giants including Apple, Google, and Facebook. Its unique ecosystem combines world-class universities, venture capital firms, and a culture that embraces risk-taking and innovation.",
            citations=[{"title": "Silicon Valley History", "uri": "https://en.wikipedia.org/wiki/Silicon_Valley"}]
        )
    else:
        # Default response
        return ChatResponse(
            text=f"You asked: '{user_message}'. This is a mock response from the backend. When fully implemented with Vertex AI credentials, I'll be able to provide more helpful and contextual responses.",
            citations=[]
        )

@app.get("/")
async def root():
    return {"message": "API is running. Use /api/chat endpoint for chat functionality."}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("app:app", host=host, port=port, reload=True)
