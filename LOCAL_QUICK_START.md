# Quick Start - Running Locally with MongoDB Compass

## Prerequisites Checklist

- [ ] MongoDB Community Edition installed (download from mongodb.com)
- [ ] MongoDB Compass installed (download from mongodb.com)
- [ ] Node.js v16+ installed
- [ ] Python 3.8+ installed
- [ ] Git installed

## Step 1: Run Setup Script (One-Time)

### Windows
```powershell
cd "MY bussiness"
.\setup-local.bat
```

### Mac/Linux
```bash
cd "MY bussiness"
chmod +x setup-local.sh
./setup-local.sh
```

This will:
- Check MongoDB installation
- Start MongoDB service
- Install all dependencies
- Verify everything is ready

## Step 2: Setup MongoDB Compass Database

### Open MongoDB Compass
1. Launch MongoDB Compass
2. Connection: `mongodb+srv://user:manika4713@cluster0.abckf.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0`
3. Click "Connect"

### Create Database
1. Click "Create Database"
2. Database Name: `ecommerce-analytics`
3. Collection Name: `products`
4. Click "Create Database"

### Create Collections
Once database is created, create these collections (right-click on database → Create Collection):
- `admins`
- `clickevents`
- `visitors`
- `mlpredictions`

### Insert Admin User
1. Click on `admins` collection
2. Click "Insert Document" button
3. Paste this JSON:

```json
{
  "name": "Admin User",
  "email": "admin@manika.com",
  "password": "$2a$10$Jxop8DYVxwnXXr4ZTyiKIuBM5aGs0oXMwNuErxkvW3eMnkId7Z4RK",
  "role": "admin",
  "isActive": true,
  "lastLogin": new Date(),
  "createdAt": new Date()
}
```

**Login Credentials:**
- Email: `admin@manika.com`
- Password: `manika93057`

### Insert Sample Products
Click "Insert Document" in `products` collection and paste:

```json
{
  "title": "Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "image": "https://via.placeholder.com/300x300?text=Headphones",
  "category": "Electronics",
  "meeshoLink": "https://meesho.com/product",
  "clicks": 0,
  "impressions": 0,
  "stockStatus": "in-stock",
  "isActive": true,
  "createdAt": new Date()
}
```

Repeat for 5-10 more products with different categories:
- Electronics
- Fashion  
- Home & Kitchen
- Sports & Outdoors
- Beauty
- Books

## Step 3: Run All Three Services

Open **3 separate terminal windows** (not tabs!) in the project root directory:

### Terminal 1: Backend Server
```powershell
cd server
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected to: mongodb+srv://user:manika4713@cluster0.abckf.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0
```

### Terminal 2: Frontend (React)
```powershell
cd client
npm run dev
```

Expected output:
```
Local:   http://localhost:3000/
```

### Terminal 3: ML Service
```powershell
cd ml-service
venv\Scripts\activate
python app.py
```

Expected output:
```
* Running on http://localhost:5001
* WARNING: This is a development server
```

## Step 4: Test the Application

### Access Frontend
- Open browser: http://localhost:3000
- Click "Products" - should show your products
- Click on a product - it redirects to Meesho
- Click "Admin" - should show login page

### Login to Admin Dashboard
1. Go to http://localhost:3000/admin/login
2. Email: `admin@manika.com`
3. Password: `manika93057`
4. Click "Login"
5. Should show admin dashboard with charts

### Test API Directly
```powershell
# Get all products
curl http://localhost:5000/api/products

# Test backend is running
curl http://localhost:5000/health
```

## Step 5: Monitor in MongoDB Compass

Watch real-time data as you use the app:

1. **Click a product** → New entry in `clickevents` collection
2. **Visit pages** → New session in `visitors` collection
3. **Wait 1 hour** → New predictions in `mlpredictions` collection

## Useful Commands

### Stop Services
- Press `Ctrl+C` in each terminal

### Check if MongoDB is Running (Windows)
```powershell
Get-Service MongoDB
```

### Start MongoDB (if stopped)
```powershell
net start MongoDB
```

### Restart All Services
1. Stop all 3 terminals with Ctrl+C
2. In each terminal, run the command again
3. Refresh browser (F5)

### Clear All Data (Reset Database)
In MongoDB Compass:
1. Right-click database → Delete
2. Create new database with same steps as above

### View MongoDB Logs
```powershell
# Windows - MongoDB stores logs in:
C:\Program Files\MongoDB\Server\5.0\log\mongod.log
```

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 5000 | http://localhost:5000/api |
| ML Service | 5001 | http://localhost:5001 |
| MongoDB | Cloud | mongodb+srv://... (MongoDB Atlas) |

## Troubleshooting

### "Connection refused" on port 5000
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB service won't start
```powershell
# Restart service
Stop-Service MongoDB
Start-Service MongoDB

# Or check if already running
Get-Process mongod
```

### Frontend can't connect to API
- Check if backend is running on port 5000
- Check browser console (F12) for errors
- Try: http://localhost:5000/api/products directly

### Admin login fails
- Verify admin user exists in MongoDB Compass
- Check email and password are correct
- Clear browser cache (Ctrl+Shift+Delete)

### ML Service not updating predictions
- Wait for 1 hour (or change ML_RUN_INTERVAL in .env)
- Check if ml-service is still running
- Check console for error messages

## Environment Files Location

```
.env files are configured for MongoDB Atlas:

server/.env
├─ MONGODB_URI=mongodb+srv://user:manika4713@cluster0.abckf.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0
├─ PORT=5000
├─ JWT_SECRET=ecommerce-local-secret-key-change-in-production
└─ ...

client/.env
└─ VITE_API_URL=http://localhost:5000/api

ml-service/.env
├─ MONGODB_URI=mongodb+srv://user:manika4713@cluster0.abckf.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0
├─ DB_NAME=ecommerce-analytics
└─ ...
```

## Next Steps

1. ✅ Run setup script
2. ✅ Create MongoDB database and collections
3. ✅ Add admin user
4. ✅ Add sample products
5. ✅ Run all 3 services
6. ✅ Test in browser
7. → Browse products and test features
8. → View admin dashboard
9. → Monitor MongoDB Compass for new data
10. → Deploy when ready

---

**Everything is now ready to run locally! 🎉**
