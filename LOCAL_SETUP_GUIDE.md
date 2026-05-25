# Local MongoDB Setup with Compass - Complete Guide

## Step 1: Install MongoDB Community Edition

### Windows
1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Run the installer (.msi file)
3. Choose "Complete" installation
4. Check "Install as a Service" (default: MongoDB)
5. Check "Run the MongoDB service on Windows startup"
6. Click Install
7. Verify installation:
   ```powershell
   mongod --version
   ```

### Verify MongoDB is Running
- Open Services (services.msc)
- Look for "MongoDB" service
- Status should be "Started"
- If not running, right-click → Start

---

## Step 2: Install MongoDB Compass

1. Download from: https://www.mongodb.com/products/compass
2. Run installer
3. Complete installation
4. Launch MongoDB Compass

---

## Step 3: Connect Compass to Local MongoDB

1. Open MongoDB Compass
2. Connection String should be: `mongodb+srv://user:manika4713@cluster0.abckf.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0`
3. Click "Connect"
4. You should see "admin" database

**Create Database:**
1. Click "Create Database"
2. Database Name: `ecommerce-analytics`
3. Collection Name: `products`
4. Click "Create Database"

**Create Collections:**
In Compass, create these collections:
- [ ] admins
- [ ] products
- [ ] clickevents
- [ ] visitors
- [ ] mlpredictions

---

## Step 4: Update Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:manika4713@cluster0.abckf.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-123-change-this
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### ML Service (.env)
```env
MONGODB_URI=mongodb+srv://user:manika4713@cluster0.abckf.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=ecommerce-analytics
ML_RUN_INTERVAL=3600
FLASK_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Step 5: Create Initial Admin User

Run this in MongoDB Compass:

1. Go to `ecommerce-analytics` → `admins` collection
2. Click "Insert Document"
3. Paste and modify this JSON:

```json
{
  "_id": ObjectId(),
  "name": "Admin User",
  "email": "admin@manika.com",
  "password": "$2a$10$Jxop8DYVxwnXXr4ZTyiKIuBM5aGs0oXMwNuErxkvW3eMnkId7Z4RK",
  "role": "admin",
  "isActive": true,
  "lastLogin": new Date(),
  "createdAt": new Date()
}
```

**Note:** The password hash above is for "manika93057". To create your own:
- Use online bcrypt generator: https://bcrypt-generator.com/
- Password: `manika93057`, Rounds: 10

Or use this Node.js snippet:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('manika93057', 10, (err, hash) => {
  console.log(hash);
});
```

---

## Step 6: Add Sample Products

In MongoDB Compass, go to `admins` → `products` and insert:

```json
{
  "_id": ObjectId(),
  "title": "Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "image": "https://via.placeholder.com/300x300?text=Headphones",
  "category": "Electronics",
  "meeshoLink": "https://meesho.com/product/wireless-headphones",
  "clicks": 0,
  "impressions": 0,
  "stockStatus": "in-stock",
  "isActive": true,
  "createdAt": new Date()
}
```

Add 5-10 more products with different categories:
- Electronics
- Fashion
- Home & Kitchen
- Sports & Outdoors
- Beauty & Personal Care

---

## Step 7: Install Dependencies

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

### ML Service
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

---

## Step 8: Run All Services

Open 3 separate terminal windows:

### Terminal 1: Backend
```bash
cd server
npm run dev
```
Expected output:
```
Server running on port 5000
MongoDB connected successfully
```

### Terminal 2: Frontend
```bash
cd client
npm run dev
```
Expected output:
```
Local:   http://localhost:3000/
```

### Terminal 3: ML Service
```bash
cd ml-service
venv\Scripts\activate  # Windows
python app.py
```
Expected output:
```
* Running on http://localhost:5001
```

---

## Step 9: Test Everything

### Test Frontend
1. Open http://localhost:3000
2. Click "Products" - should show your products
3. Click "Admin" - should show login page

### Test Admin Login
1. Go to http://localhost:3000/admin/login
2. Email: `admin@manika.com`
3. Password: `manika93057`
4. Should redirect to dashboard
5. Dashboard should load with charts (may be empty initially)

### Test Backend API
```powershell
# Get products
curl http://localhost:5000/api/products

# Get analytics
curl http://localhost:5000/api/analytics/overview -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Step 10: Monitor in MongoDB Compass

Watch data being created:

1. **After product clicks:** `clickevents` collection grows
2. **After visits:** `visitors` collection grows
3. **ML pipeline:** `mlpredictions` collection gets updates every hour

---

## Troubleshooting

### MongoDB Won't Start
```powershell
# Check if MongoDB is running
Get-Service -Name "MongoDB"

# Start MongoDB service
Start-Service -Name "MongoDB"

# Stop MongoDB service
Stop-Service -Name "MongoDB"
```

### Port Already in Use
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### CORS Error
- Check FRONTEND_URL in backend .env
- Restart backend: `npm run dev`

### Can't Connect to MongoDB
- Verify MongoDB Atlas credentials in .env
- Check if mongodb+srv://... URI is correct
- Check firewall/network settings for cloud connectivity

### ML Pipeline Not Running
- Check if ml-service is running
- Check console for errors
- Verify MONGODB_URI in ml-service .env

---

## File Locations for Reference

```
project/
├── server/
│   ├── .env (contains MONGODB_URI)
│   └── server.js
├── client/
│   ├── .env (contains API_URL)
│   └── src/App.jsx
├── ml-service/
│   ├── .env (contains MONGODB_URI)
│   └── app.py
└── MongoDB Atlas (cloud-based database)
```

---

## Default URLs After Setup

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **ML Service:** http://localhost:5001
- **MongoDB Compass:** Local connection (no URL needed)

---

## Quick Checklist

- [ ] MongoDB Community Edition installed
- [ ] MongoDB Compass installed and connected
- [ ] Database `ecommerce-analytics` created
- [ ] Collections created (admins, products, clickevents, visitors, mlpredictions)
- [ ] Admin user created in database
- [ ] Sample products added
- [ ] .env files updated with local MongoDB URI
- [ ] Dependencies installed (npm install, pip install)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] ML Service running on port 5001
- [ ] Frontend loads at http://localhost:3000
- [ ] Admin login works
- [ ] Dashboard shows data

---

## Next Steps

1. Browse products on frontend
2. Click products to generate click events
3. Watch data appear in MongoDB Compass
4. Check admin dashboard for analytics
5. ML pipeline runs every hour automatically

**Everything is now running locally! 🎉**
