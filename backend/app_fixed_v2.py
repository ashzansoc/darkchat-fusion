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
import os

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
    
    # Get project and location from environment or use defaults
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT", "octopus-449307")
    location = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")
    
    logger.info(f"Using project: {project_id}, location: {location}")
    
    client = genai.Client(
        vertexai=True,
        project=project_id,
        location=location,
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
            logger.info(f"Adding message with role: {message.role}, content: {message.content[:50]}...")
            contents.append(
                types.Content(
                    role=message.role,
                    parts=[types.Part.from_text(text=message.content)]
                )
            )
        
        # Don't use tools at all since they're causing the error
        
        # Generate response
        logger.info("Sending request to Gemini AI with basic configuration...")
        
        # The issue is coming from the tools, so we'll use a very simple configuration
        response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=contents,
            # Use a simple generation config with basic parameters
            temperature=0.7,
            max_output_tokens=4000,
            # No tools to avoid the file URI error
        )
        logger.info("Received response from Gemini AI")
        
        # Extract the response text directly
        response_text = ""
        if hasattr(response, 'text'):
            response_text = response.text
        
        if not response_text:
            # Fallback if we still don't have a response
            response_text = "I'm sorry, I couldn't generate a proper response at this time."
            
        logger.info(f"Response text (first 100 chars): {response_text[:100]}...")
        
        return ChatResponse(
            response=response_text,
            citations=[]  # No citations since we're not using search tools
        )
    
    except Exception as e:
        error_traceback = traceback.format_exc()
        logger.error(f"Error in chat endpoint: {str(e)}")
        logger.error(f"Traceback: {error_traceback}")
        
        # Return a more specific error message
        error_message = f"Error generating response: {str(e)}"
        logger.error(error_message)
        
        # Provide a fallback response for users
        return ChatResponse(
            response="I apologize, but I encountered an error while processing your request. The system might be experiencing technical difficulties. Please try again later or contact support if the problem persists.",
            citations=[]
        )

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
        # Fix the API call to not use 'generation_config' parameter
        test_response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=[types.Content(
                role="user",
                parts=[types.Part.from_text(text="Hello, can you give me a one-word response for testing?")]
            )],
            # Direct parameters instead of generation_config
            temperature=0,
            max_output_tokens=10
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

@app.get("/simplified-chat")
async def simplified_chat(message: str = "Hello"):
    """Simplified chat endpoint for testing."""
    try:
        logger.info(f"Simplified chat request received with message: {message}")
        
        if client is None:
            return {"status": "error", "message": "Google AI client is not initialized"}
        
        # Use the most basic possible configuration
        response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=[types.Content(
                role="user",
                parts=[types.Part.from_text(text=message)]
            )],
            # Direct parameters instead of nested config
            temperature=0.7,
            max_output_tokens=1000
        )
        
        if hasattr(response, 'text'):
            return {"status": "success", "response": response.text}
        else:
            return {"status": "error", "message": "No response text returned"}
            
    except Exception as e:
        logger.error(f"Error in simplified chat: {str(e)}")
        return {"status": "error", "message": str(e)}

# For development server
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    logger.info(f"Starting FastAPI server on {host}:{port}")
    uvicorn.run("app:app", host=host, port=port, reload=True) 