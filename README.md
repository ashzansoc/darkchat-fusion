
# AI Chatbot Application

This project consists of a React-based frontend chatbot UI and a Python FastAPI backend that connects to Gemini AI on Google Vertex AI.

## Project Structure

- `src/` - Frontend React application
- `backend/` - Backend FastAPI application

## Setup and Running

### Frontend

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Run the backend server:
   ```
   python app.py
   ```

   The API will be available at [http://localhost:8000](http://localhost:8000)

## Implementing Gemini AI

The current implementation uses mock responses. To implement the actual Gemini AI with Vertex AI:

1. Install additional dependencies:
   ```
   pip install vertexai google-cloud-aiplatform
   ```

2. Set up a Google Cloud project and enable the Vertex AI API
3. Set up authentication with a service account key
4. Update the code in `backend/app.py` to use the actual Vertex AI client

## Features

- Interactive chat interface
- Suggestion chips for common questions
- Backend API with FastAPI
- Citations for AI responses
- Responsive design

## Technologies Used

- Frontend: React, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- AI: Google Vertex AI (Gemini)
