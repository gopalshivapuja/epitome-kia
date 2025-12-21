#!/bin/bash

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker Desktop and try again."
  exit 1
fi

echo "Starting database container..."
docker-compose up -d db

echo "Waiting for database to be ready..."
until docker-compose exec db pg_isready -U user -d epitome_kia_local; do
  echo "Waiting for DB..."
  sleep 2
done

echo "Database is ready!"
echo "Connection String: postgresql://user:password@localhost:5433/epitome_kia_local"
