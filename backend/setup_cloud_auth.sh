#!/bin/bash

# Help script for setting up Google Cloud authentication
# Run this script on your VM if you encounter authentication issues

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Google Cloud SDK (gcloud) is not installed. Installing..."
    curl https://sdk.cloud.google.com | bash
    exec -l $SHELL
    gcloud init
else
    echo "Google Cloud SDK is already installed."
fi

# Authenticate with Google Cloud
echo "Authenticating with Google Cloud..."
gcloud auth login

# Set up application default credentials
echo "Setting up application default credentials..."
gcloud auth application-default login

# Verify project settings
echo "Setting project to octopus-449307..."
gcloud config set project octopus-449307

# Enable required APIs if they're not already enabled
echo "Enabling required APIs..."
gcloud services enable aiplatform.googleapis.com generativelanguage.googleapis.com

echo "Authentication setup completed. You may need to restart your Docker containers."
echo "Run: docker-compose down && docker-compose up -d" 