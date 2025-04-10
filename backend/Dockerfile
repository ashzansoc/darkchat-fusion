# Backend Dockerfile
FROM ubuntu:22.04

# Set noninteractive installation
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    wget \
    bzip2 \
    ca-certificates \
    curl \
    git \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Set up Anaconda
ENV CONDA_DIR=/opt/conda
RUN wget https://repo.anaconda.com/archive/Anaconda3-2024.02-1-Linux-x86_64.sh -O ~/anaconda.sh && \
    /bin/bash ~/anaconda.sh -b -p $CONDA_DIR && \
    rm ~/anaconda.sh

# Add conda to path
ENV PATH=$CONDA_DIR/bin:$PATH

# Create a Python 3.12 environment
RUN conda create -n darkchat python=3.12 pip=25 -y

# Make RUN commands use the new environment
SHELL ["conda", "run", "-n", "darkchat", "/bin/bash", "-c"]

# Copy requirements file
COPY requirements.txt .
RUN conda run -n darkchat pip install -r requirements.txt

# Copy application code
COPY . .

# Expose the port
EXPOSE 8000

# Set up the entrypoint to run in the conda environment
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "darkchat", "python", "app.py"] 