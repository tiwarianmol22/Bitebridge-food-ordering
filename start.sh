#!/bin/bash
# ============================================
# BiteBridge — Start Script
# Starts both Flask backend and Vite frontend
# ============================================

echo ""
echo "🍽️  Starting BiteBridge..."
echo ""

# Start Backend
echo "🔧 Starting Flask backend on port 5001..."
cd backend
source venv/bin/activate
flask run --port=5001 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Start Frontend
echo "🌐 Starting React frontend on port 5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "============================================"
echo "✅ BiteBridge is running!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5001"
echo ""
echo "📧 Admin: admin@bitbridge.com / password123"
echo "📧 User:  john@gmail.com / password123"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "============================================"

# Wait and handle cleanup
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
