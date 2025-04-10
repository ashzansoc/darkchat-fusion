# DarkChat Fusion

An AI-powered chat application using Google's Gemini AI model with FastAPI backend and React frontend.

## Docker Deployment

This application is containerized with Docker for easy deployment. Follow these steps to run it:

### Prerequisites

- Docker and Docker Compose installed on your VM
- Proper Google Cloud credentials configured for Vertex AI

### Deployment Steps

1. Clone this repository to your VM:
   ```bash
   git clone <repository-url>
   cd darkchat-fusion
   ```

2. Set up Google Cloud authentication (if not already done):
   ```bash
   # Make the script executable
   chmod +x backend/setup_cloud_auth.sh
   # Run the authentication script
   ./backend/setup_cloud_auth.sh
   ```

3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

   This will:
   - Build the backend FastAPI container
   - Build the frontend React container
   - Start both services

4. Access the application:
   - The application will be available at `http://<your-vm-ip>/`
   - The API will be available at `http://<your-vm-ip>/api/`

### Configuration

- Backend configuration: Edit `backend/app.py` if you need to customize AI behavior or endpoints
- Google Cloud credentials: Ensure your VM has proper permissions for Google Cloud and Vertex AI

### Stopping the Application

```bash
docker-compose down
```

### Updates

To update after code changes:

```bash
git pull
docker-compose up -d --build
```

This will rebuild the containers with the latest code changes.

## Troubleshooting

### Google Cloud Authentication Issues

If you encounter authentication issues with Google Cloud:

1. Run the authentication setup script:
   ```bash
   ./backend/setup_cloud_auth.sh
   ```

2. Restart the containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Container Logs

To check container logs for issues:

```bash
# Check backend logs
docker logs darkchat-backend

# Check frontend logs
docker logs darkchat-frontend
```

## Security Notes

- For production use, consider adding authentication
- Set appropriate CORS settings in `backend/app.py`
- Update environment variables in docker-compose.yml for production settings

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

## Features

- Interactive chat interface
- Suggestion chips for common questions
- Backend API with FastAPI
- Citations for AI responses
- Responsive design

## Technologies Used

- Frontend: React, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
