# Troubleshooting Guide

If you're seeing the error message: "I'm sorry, I encountered an error processing your request. The backend service might be unavailable", follow this guide to diagnose and fix the issue.

## Step 1: Check if the Backend is Running

Make sure the FastAPI backend server is running:

```bash
# Navigate to the backend directory
cd backend

# Start the backend server
python app.py
```

You should see output indicating the server has started successfully.

## Step 2: Check Google Cloud Authentication

The most common cause of errors is issues with Google Cloud authentication. The application needs proper credentials to access Google's Vertex AI services.

### Test Authentication

1. With the backend running, visit:
   ```
   http://localhost:8000/test-auth
   ```

2. Check the response:
   - If you see `"status": "success"`, authentication is working properly
   - If you see `"status": "error"`, there's an authentication issue

### Fix Authentication Issues

1. Make sure you have the Google Cloud SDK installed and are logged in:
   ```bash
   # Install gcloud if needed
   curl https://sdk.cloud.google.com | bash
   
   # Log in to your Google account
   gcloud auth login
   
   # Set up application default credentials
   gcloud auth application-default login
   
   # Set the correct project
   gcloud config set project octopus-449307
   ```

2. Verify you have access to the Vertex AI project:
   ```bash
   gcloud projects describe octopus-449307
   ```

3. Restart the backend server after fixing credentials.

## Step 3: Check Backend Logs

Look at the backend logs for detailed error information:

```bash
# While running the backend, look for error messages in the terminal output
```

Common error messages include:
- "Failed to initialize Google AI client" - Authentication issues
- "Permission denied" - Missing access to the required Google Cloud resources
- "Resource not found" - The AI model or search datastore doesn't exist

## Step 4: Check Network Connectivity

Make sure your frontend can reach the backend:

1. Test with a simple curl command:
   ```bash
   curl http://localhost:8000/
   ```

2. If running in Docker, make sure the containers can communicate:
   ```bash
   docker-compose ps
   ```

## Step 5: Check Firewall and Ports

1. Make sure port 8000 is open and not blocked by a firewall
2. Verify the backend is listening on the correct address (0.0.0.0:8000)

## Step 6: Check for Configuration Issues

1. Verify the correct API URL in the frontend:
   - In development: Should be "http://localhost:8000/api/chat"
   - In Docker: Should be "/api/chat"

2. Check CORS settings if you're getting CORS errors in the browser console

## Getting Additional Help

If you continue to experience issues:

1. Collect the backend logs
2. Check browser console for any frontend errors
3. Try the health check endpoint: http://localhost:8000/
4. Try the auth test endpoint: http://localhost:8000/test-auth

With this information, you'll be better positioned to diagnose and resolve the issue. 