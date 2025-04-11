# Backend Dockerfile
FROM python:3.12-slim

# Set up working directory
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Create and activate Python virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip to version 25
RUN pip install --upgrade pip==25.0

# Copy requirements file
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application code
COPY . .

# Expose the port
EXPOSE 8000

# Run the application
CMD ["python", "app.py"] 