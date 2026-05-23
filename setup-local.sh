#!/bin/bash
# MongoDB Local Setup Script for Mac/Linux

echo "===================================="
echo "MongoDB Local Setup for MERN App"
echo "===================================="
echo ""

# Check if MongoDB is installed
echo "Checking MongoDB installation..."
if ! command -v mongod &> /dev/null; then
    echo ""
    echo "ERROR: MongoDB not found!"
    echo ""
    echo "Please install MongoDB:"
    echo "Mac: brew install mongodb-community"
    echo "Linux: Follow https://docs.mongodb.com/manual/installation/"
    echo ""
    exit 1
fi

echo "[OK] MongoDB is installed"

# Check if MongoDB is running
echo ""
echo "Checking MongoDB service..."
if pgrep -x "mongod" > /dev/null; then
    echo "[OK] MongoDB service is running"
else
    echo ""
    echo "WARNING: MongoDB service not running!"
    echo "Please start MongoDB with: mongod"
    echo ""
fi

# Install Node dependencies
echo ""
echo "Installing Backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    cd ..
    exit 1
fi
cd ..
echo "[OK] Backend dependencies installed"

echo ""
echo "Installing Frontend dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    cd ..
    exit 1
fi
cd ..
echo "[OK] Frontend dependencies installed"

# Check Python
echo ""
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo ""
    echo "ERROR: Python 3 not found!"
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi
echo "[OK] Python is installed"

# Install Python dependencies
echo ""
echo "Installing ML Service dependencies..."
cd ml-service
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install ML dependencies"
    cd ..
    exit 1
fi
cd ..
echo "[OK] ML Service dependencies installed"

echo ""
echo "===================================="
echo "Setup Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Open MongoDB Compass and connect to: mongodb://localhost:27017"
echo "2. Create database: ecommerce-analytics"
echo "3. Open 3 terminal windows and run:"
echo ""
echo "   Terminal 1: cd server && npm run dev"
echo "   Terminal 2: cd client && npm run dev"
echo "   Terminal 3: cd ml-service && source venv/bin/activate && python app.py"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
