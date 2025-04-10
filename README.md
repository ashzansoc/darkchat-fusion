# Answers by Coredge

A modern AI chatbot interface powered by FastAPI and React.

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm (v8 or higher)

## Frontend Dependencies

Install the frontend dependencies:

```bash
npm install react
npm install @tanstack/react-query
npm install react-router-dom
npm install react-markdown
npm install remark-gfm
npm install lucide-react
npm install tailwindcss
npm install sonner
```

## Backend Dependencies

Create a Python virtual environment and install the backend dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

Install required Python packages:

```bash
pip install fastapi
pip install uvicorn
pip install google-cloud-aiplatform
pip install python-dotenv
pip install google.generativeai
pip install pydantic
```

## Environment Setup

1. Create a `.env` file in the backend directory:

```env
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
```

2. Configure your Google Cloud credentials for Vertex AI

## Running the Application

1. Start the backend server:

```bash
cd backend
uvicorn app:app --reload --port 8001
```

2. Start the frontend development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

- `src/` - Frontend React application
- `backend/` - Backend FastAPI application

## Important Notes

- The frontend chatbot communicates with the backend at `http://localhost:8000/api/chat`
- Both the frontend and backend must be running simultaneously for the chatbot to work
- The backend is currently using mock responses, but can be extended to use Gemini AI

## Implementing Gemini AI

To implement the actual Gemini AI with Vertex AI:

1. Install additional dependencies:
   ```
   pip install vertexai google-cloud-aiplatform
   ```

2. Set up a Google Cloud project and enable the Vertex AI API
3. Set up authentication with a service account key
4. Update the code in `backend/app.py` to use the actual Vertex AI client

## Troubleshooting

If you see "Failed to get a response from the AI" error:

1. Make sure the backend server is running at http://localhost:8000
2. Check if there are any error messages in the backend console
3. Verify network connectivity between frontend and backend
4. If using a virtual environment, ensure all required packages are installed

## Features

- Interactive chat interface
- Suggestion chips for common questions
- Backend API with FastAPI
- Citations for AI responses
- Responsive design

## Technologies Used

- Frontend: React, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
