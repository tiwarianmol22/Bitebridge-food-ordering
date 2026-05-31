#!/bin/bash
# ============================================
# BiteBridge — Setup Script
# One-command local setup for macOS
# ============================================

set -e

echo ""
echo "🍽️  Setting up BiteBridge — Online Food Ordering System"
echo "======================================================="
echo ""

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL not found. Install it with: brew install mysql"
    echo "   Then start it with: brew services start mysql"
    exit 1
fi

echo "✅ MySQL found"

# Backend Setup
echo ""
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt --quiet

echo "✅ Python dependencies installed"

# Setup MySQL Database
echo ""
echo "🗄️  Setting up MySQL database..."
echo "   (Enter MySQL root password when prompted, or press Enter if no password)"

mysql -u root -p < sql/schema.sql 2>/dev/null || mysql -u root < sql/schema.sql
mysql -u root -p bitbridge_db < sql/seed.sql 2>/dev/null || mysql -u root bitbridge_db < sql/seed.sql
mysql -u root -p bitbridge_db < sql/triggers.sql 2>/dev/null || mysql -u root bitbridge_db < sql/triggers.sql

echo "✅ Database setup complete"

# Initialize Flask-Migrate
export FLASK_APP=run.py
flask db init 2>/dev/null || true
flask db migrate -m "Initial migration" 2>/dev/null || true
flask db upgrade 2>/dev/null || true

echo "✅ Flask migrations initialized"

cd ..

# Frontend Setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend
npm install --silent

echo "✅ Frontend dependencies installed"
cd ..

echo ""
echo "============================================"
echo "✅ Setup complete!"
echo ""
echo "To start the app, run:"
echo "  ./start.sh"
echo ""
echo "Or start manually:"
echo "  Backend:  cd backend && source venv/bin/activate && flask run --port=5000"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "📧 Admin Login: admin@bitbridge.com / password123"
echo "📧 User Login:  john@gmail.com / password123"
echo "============================================"
