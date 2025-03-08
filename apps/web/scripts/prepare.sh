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