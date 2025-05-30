from google import genai
from google.genai import types
import base64
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import logging
import sys
import traceback

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin
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
try:
    logger.info("Attempting to initialize Google AI client...")
    client = genai.Client(
        vertexai=True,
        project="octopus-449307",
        location="us-central1",
    )
    logger.info("Google AI client initialized successfully")
except Exception as e:
    error_traceback = traceback.format_exc()
    logger.error(f"Failed to initialize Google AI client: {str(e)}")
    logger.error(f"Traceback: {error_traceback}")
    logger.error("Check your Google Cloud authentication setup")
    client = None

@app.get("/")
async def health_check():
    """Health check endpoint for the API."""
    # Check if the client is initialized to include in health status
    client_status = "initialized" if client is not None else "not initialized"
    logger.info(f"Health check called. Client status: {client_status}")
    return {
        "status": "ok", 
        "message": "Grace AI Chat API is running",
        "client_status": client_status
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Check if client is initialized
        if client is None:
            logger.error("Chat endpoint called but Google AI client is not initialized")
            raise Exception("Google AI client is not initialized. Check authentication.")
            
        # Log the incoming request
        logger.info(f"Chat request received with {len(request.messages)} messages")
        
        # Convert the chat history to Gemini format
        contents = []
        for message in request.messages:
            contents.append(
                types.Content(
                    role=message.role,
                    parts=[types.Part.from_text(text=message.content)]
                )
            )
            logger.debug(f"Message added to contents: {message.role} - {message.content[:50]}...")
        
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
        logger.info("Sending request to Gemini AI...")
        response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=contents,
            config=generate_content_config,
        )
        logger.info("Received response from Gemini AI")
        
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
            
        logger.info(f"Returning response with {len(citations)} citations")
        
        return ChatResponse(
            response=response_text,
            citations=citations
        )
    
    except Exception as e:
        error_traceback = traceback.format_exc()
        logger.error(f"Error in chat endpoint: {str(e)}")
        logger.error(f"Traceback: {error_traceback}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.get("/test-auth")
async def test_auth():
    """Test endpoint to verify Google Cloud authentication."""
    try:
        if client is None:
            return {
                "status": "error",
                "message": "Google AI client is not initialized",
                "details": "Check server logs for initialization errors"
            }
        
        # Try a simple API call to test authentication
        logger.info("Testing Google AI authentication with a simple request")
        test_response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=[types.Content(
                role="user",
                parts=[types.Part.from_text(text="Hello, can you give me a one-word response for testing?")]
            )],
            generation_config=types.GenerationConfig(
                max_output_tokens=10,
                temperature=0
            )
        )
        
        return {
            "status": "success", 
            "message": "Authentication successful",
            "test_response": test_response.text
        }
    except Exception as e:
        error_traceback = traceback.format_exc()
        logger.error(f"Auth test failed: {str(e)}")
        logger.error(f"Traceback: {error_traceback}")
        return {
            "status": "error",
            "message": "Authentication test failed",
            "error": str(e)
        }

# For development server
if __name__ == "__main__":
    logger.info("Starting FastAPI server...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)