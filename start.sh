#!/bin/bash

# Build the backend image
docker build -t my-backend-image -f Dockerfile-backend .

# Build the frontend image
docker build -t my-frontend-image -f Dockerfile-frontend .

# Define the network name
NETWORK_NAME="my-network"

# Check if the network already exists
if ! docker network inspect $NETWORK_NAME &>/dev/null; then
    # Create the Docker network for the containers to communicate
    docker network create $NETWORK_NAME
fi


# Start the backend container
docker run -d --name my-backend-container --network my-network -p 3001:3001 my-backend-image

# Start the frontend container
docker run -d --name my-frontend-container --network my-network -p 3000:3000 my-frontend-image