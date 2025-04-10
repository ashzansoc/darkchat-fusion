#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== DarkChat Fusion VM Setup ===${NC}"
echo -e "This script will set up your VM with Docker and Docker Compose."

# Update system
echo -e "\n${YELLOW}Updating system packages...${NC}"
sudo apt-get update && sudo apt-get upgrade -y
echo -e "${GREEN}System packages updated.${NC}"

# Install prerequisites
echo -e "\n${YELLOW}Installing prerequisites...${NC}"
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git
echo -e "${GREEN}Prerequisites installed.${NC}"

# Install Docker
echo -e "\n${YELLOW}Installing Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}Docker is already installed.${NC}"
else
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}Docker installed successfully.${NC}"
    echo -e "${YELLOW}NOTE: You may need to log out and log back in for Docker permissions to take effect.${NC}"
fi

# Install Docker Compose
echo -e "\n${YELLOW}Installing Docker Compose...${NC}"
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}Docker Compose is already installed.${NC}"
else
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}Docker Compose installed successfully.${NC}"
fi

# Install Google Cloud SDK
echo -e "\n${YELLOW}Setting up Google Cloud SDK...${NC}"
if command -v gcloud &> /dev/null; then
    echo -e "${GREEN}Google Cloud SDK is already installed.${NC}"
else
    echo -e "${YELLOW}Installing Google Cloud SDK...${NC}"
    curl https://sdk.cloud.google.com | bash
    exec -l $SHELL
    echo -e "${GREEN}Google Cloud SDK installed.${NC}"
fi

# Set up Google Cloud authentication
echo -e "\n${YELLOW}Setting up Google Cloud authentication...${NC}"
echo -e "${YELLOW}Please follow the prompts to authenticate with Google Cloud.${NC}"
gcloud auth login
gcloud auth application-default login

# Set the correct project
echo -e "\n${YELLOW}Setting Google Cloud project...${NC}"
gcloud config set project octopus-449307
echo -e "${GREEN}Google Cloud project set to octopus-449307.${NC}"

# Enable required APIs
echo -e "\n${YELLOW}Enabling required Google APIs...${NC}"
gcloud services enable aiplatform.googleapis.com generativelanguage.googleapis.com
echo -e "${GREEN}Google APIs enabled.${NC}"

# Create data directories
echo -e "\n${YELLOW}Creating data directories...${NC}"
mkdir -p data
echo -e "${GREEN}Data directories created.${NC}"

echo -e "\n${GREEN}=======================================${NC}"
echo -e "${GREEN}Setup complete!${NC}"
echo -e "${GREEN}You can now run the application with:${NC}"
echo -e "${BLUE}docker-compose up -d${NC}"
echo -e "${GREEN}=======================================${NC}"

# Remind user to restart session if needed
echo -e "\n${YELLOW}NOTE: If this is the first time installing Docker, you may need to log out and log back in for Docker permissions to take effect.${NC}"
echo -e "${YELLOW}To run Docker without sudo, restart your session with:${NC}"
echo -e "${BLUE}exec su - $USER${NC}" 