from google import genai
from google.genai import types
import base64
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class Citation(BaseModel):
    title: str
    uri: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str
    citations: List[Citation] = []
    
# Initialize the Vertex AI client
client = genai.Client(
    vertexai=True,
    project="octopus-449307",
    location="us-central1",
)

@app.get("/")
async def health_check():
    """Health check endpoint for the API."""
    return {"status": "ok", "message": "Grace AI Chat API is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Convert the chat history to Gemini format
        contents = []
        for message in request.messages:
            contents.append(
                types.Content(
                    role=message.role,
                    parts=[types.Part.from_text(text=message.content)]
                )
            )
        
        # Configure tools and generation parameters
        tools = [
            types.Tool(retrieval=types.Retrieval(vertex_ai_search=types.VertexAISearch(
                datastore="projects/octopus-449307/locations/global/collections/default_collection/dataStores/terminal_1743165407832"
            ))),
        ]
        
        generate_content_config = types.GenerateContentConfig(
            temperature=1.0,
            top_p=0.95,
            max_output_tokens=8192,
            response_modalities=["TEXT"],
            safety_settings=[
                types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF")
            ],
            tools=tools,
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
5. Keep the data concise and readable

For bullets, use proper formatting with:
- Clear bullet points
- Consistent indentation
- Proper spacing between items""")],
        )
        
        # Generate response
        response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=contents,
            config=generate_content_config,
        )
        
        # Process response and extract citations
        response_text = ""
        citations = []
        
        if hasattr(response, 'candidates') and response.candidates:
            candidate = response.candidates[0]
            if hasattr(candidate, 'content') and candidate.content:
                content = candidate.content
                
                # Extract text
                if hasattr(content, 'parts'):
                    for part in content.parts:
                        if hasattr(part, 'text'):
                            response_text += part.text
                        
                        # Extract citations if available
                        if hasattr(part, 'citations'):
                            for citation in part.citations:
                                citations.append(Citation(
                                    title=getattr(citation, 'title', 'Source'),
                                    uri=getattr(citation, 'uri', '#')
                                ))
        
        # If no text was extracted, use the simple .text property
        if not response_text and hasattr(response, 'text'):
            response_text = response.text
        
        return ChatResponse(
            response=response_text,
            citations=citations
        )
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

# For development server
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)