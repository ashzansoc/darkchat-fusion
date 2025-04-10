FROM continuumio/miniconda3:latest as build

WORKDIR /app

# Create a Python 3.12 environment with Node.js
RUN conda create -n frontend python=3.12 nodejs=20 npm=10 -c conda-forge -y

# Make RUN commands use the new environment
SHELL ["conda", "run", "-n", "frontend", "/bin/bash", "-c"]

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN conda run -n frontend npm ci

# Copy application code
COPY . .

# Build the app
RUN conda run -n frontend npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 