
# Chatbot Backend

This is a FastAPI backend for the chatbot application. It serves as an API interface between the frontend and the AI model.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the server:
   ```
   python app.py
   ```

## Implementing Gemini AI

To implement the actual Gemini AI integration with Vertex AI:

1. Install additional dependencies:
   ```
   pip install vertexai google-cloud-aiplatform
   ```

2. Set up a Google Cloud project and enable the Vertex AI API
3. Set up authentication with a service account key
4. Modify the `/api/chat` endpoint in `app.py` to use the actual Vertex AI client

## API Endpoints

- `GET /`: Health check endpoint
- `POST /api/chat`: Send a message to the AI assistant
