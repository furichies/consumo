#!/bin/bash
set -e
echo "Building docker images..."
docker compose build --no-cache
echo "Initializing database inside api container..."
docker compose run --rm api node init-db.js
echo "Starting services..."
docker compose up -d
echo "Done.\nFrontend: http://localhost:5173\nAPI: http://localhost:5000/api\nPayment mock: http://localhost:4001\nWallet: http://localhost:4100"
