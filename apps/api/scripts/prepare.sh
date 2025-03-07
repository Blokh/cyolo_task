#!/bin/bash

# Check if .env.example exists
if [ ! -f .env.example ]; then
  echo "Error: .env.example file not found."
  exit 1
fi

# Copy .env.example to .env if .env doesn't exist
if [ ! -f .env ]; then
  echo "Copying .env.example to .env..."
  cp .env.example .env
  echo "✅ .env file created."
else
  echo "⚠️ .env file already exists. Not overwriting."
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo "Error: docker-compose not found. Please install Docker and Docker Compose."
  exit 1
fi

# Run docker-compose up
echo "Starting containers with docker-compose..."
docker-compose up -d

# Check if containers started successfully
if [ $? -eq 0 ]; then
  echo "✅ Docker containers are up and running."
  echo "Services:"
  docker-compose ps
else
  echo "❌ Failed to start containers. Check the error above."
  exit 1
fi

echo "🚀 Environment is ready!"