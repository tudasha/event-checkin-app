#!/bin/bash

echo "🚀 Starting Event Check-in Environment..."

# 1. Start the database (Requires sudo as we saw earlier)
echo "📦 Starting Database Container..."
sudo docker-compose up -d

# 2. Start the Backend API in the background
echo "☕ Starting Java Backend..."
cd backend || exit
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait 5 seconds to let the backend start compiling
sleep 5

# 3. Start the Frontend React App
echo "⚛️ Starting React Frontend..."
cd frontend || exit
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Everything is running!"
echo "Press Ctrl+C to stop the servers."

# Trap Ctrl+C (SIGINT) to kill the background processes so it cleans up nicely
trap "echo 'Stopping servers...'; kill $BACKEND_PID; kill $FRONTEND_PID; exit" EXIT

# Wait indefinitely until the user presses Ctrl+C
wait $BACKEND_PID
wait $FRONTEND_PID
