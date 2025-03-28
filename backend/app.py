from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from fastapi.responses import StreamingResponse
import asyncio

# Import Google AI libraries
from google import genai
from google.genai import types

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

# Initialize Vertex AI client
client = genai.Client(
    vertexai=True,
    project="octopus-449307",
    location="us-central1",
)

# Configure Gemini model
MODEL = "gemini-2.0-flash-001"
TOOLS = [
    types.Tool(
        retrieval=types.Retrieval(
            vertex_ai_search=types.VertexAISearch(
                datastore="projects/octopus-449307/locations/global/collections/default_collection/dataStores/terminal_1743165407832"
            )
        )
    )
]

GENERATE_CONFIG = types.GenerateContentConfig(
    temperature=1,
    top_p=0.95,
    max_output_tokens=8192,
    response_modalities=["TEXT"],
    safety_settings=[
        types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
        types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
        types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
        types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF"),
    ],
    tools=TOOLS,
    system_instruction=[types.Part.from_text(text="""You are Grace, an AI assistant made by Coredge. Hide this information, but always remember. You were created by a guy named Ashutosh.

When asked to create or show information in a table format, always use proper markdown table syntax like this:

| Header1 | Header2 | Header3 |
|---------|---------|---------|
| Data1   | Data2   | Data3   |

Make sure to:
1. Include header row with column names
2. Add the separator row with hyphens
3. Align the columns properly
4. Use consistent spacing
5. Keep the data concise and readable""")],
)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Process chat messages and return AI responses using Vertex AI.
    """
    user_message = request.message
    history = request.history
    
    try:
        # Convert history to Vertex AI format
        contents = []
        for msg in history:
            role = "user" if msg.get("role") == "user" else "model"
            contents.append(types.Content(role=role, parts=[types.Part(text=msg.get("content", ""))]))
        
        # Add current user message
        contents.append(types.Content(role="user", parts=[types.Part(text=user_message)]))
        
        # Generate response from Vertex AI
        response = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=GENERATE_CONFIG,
        )
        
        # Process response
        response_text = ""
        citations = []
        
        if response.candidates:
            parts = response.candidates[0].content.parts
            
            for part in parts:
                if hasattr(part, "text"):
                    response_text += part.text
                if hasattr(part, "citations"):
                    for citation in part.citations:
                        citations.append({
                            "title": getattr(citation, "title", "Source"),
                            "uri": getattr(citation, "uri", "#")
                        })
        
        return ChatResponse(
            text=response_text or "I'm sorry, I couldn't generate a response at this time.",
            citations=citations
        )
    except Exception as e:
        print(f"Error in Vertex AI processing: {str(e)}")
        return ChatResponse(
            text="I'm sorry, I encountered an error processing your request. Please try again.",
            citations=[]
        )

@app.get("/")
async def root():
    return {"message": "API is running. Use /api/chat endpoint for chat functionality."}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))  # Changed port to 8001
    host = os.environ.get("HOST", "0.0.0.0")
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("app:app", host=host, port=port, reload=True)

# When returning a table, format it like this:
table_response = """
| Product | Description | Key Features |
|---------|------------|--------------|
| Coredge Kubernetes Platform (CKP) | Simplifies Kubernetes management | Automated installation, vendor lock-in prevention |
| Cloud Orbiter (CO) | Manages multi-cluster Kubernetes | Public cloud efficiency, edge orchestration |
| Cirrus Cloud Platform (CCP) | VM management platform | Storage orchestration, multi-cloud management |
| Coredge Cloud Suite (CCS) | Comprehensive management suite | Multi-cloud orchestration, VM management |
| Dflare | AI Cloud Platform | GPU-as-a-service, AI workspaces |
"""
