# Deployment Guide

## Prerequisites
- Git repository
- MongoDB Atlas account
- Vercel account (for frontend)
- Render account (for backend and ML service)
- GitHub account

## Step-by-Step Deployment

### 1. Frontend Deployment (Vercel)

#### Prepare Frontend
```bash
cd client
npm run build
```

#### Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select the `client` directory as root
5. Configure environment variables:
   - `REACT_APP_API_URL`: Your backend API URL

#### Environment Variables (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

#### Deploy
- Click "Deploy"
- Vercel will automatically deploy on every push to main branch

### 2. Backend Deployment (Render)

#### Prepare Backend
```bash
cd server
npm install
```

#### Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: ecommerce-analytics-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free or Paid

#### Environment Variables (Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-analytics
JWT_SECRET=your_very_secure_secret_key_here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### Deploy
- Click "Create Web Service"
- Render will deploy automatically

### 3. ML Service Deployment (Render)

#### Prepare ML Service
```bash
cd ml-service
pip install -r requirements.txt
```

#### Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: ecommerce-ml-service
   - **Environment**: Python 3.11
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Plan**: Free or Paid

#### Environment Variables (Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-analytics
DB_NAME=ecommerce-analytics
ML_RUN_INTERVAL=3600
FLASK_ENV=production
```

#### Deploy
- Click "Create Web Service"
- Render will deploy automatically

### 4. Database Setup (MongoDB Atlas)

#### Create MongoDB Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project
3. Click "Create" to create a new cluster
4. Choose:
   - Provider: AWS (or your preferred)
   - Region: Closest to your location
   - Cluster tier: Free M0

#### Configure Network Access
1. Go to "Network Access"
2. Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - **Note**: For production, restrict to specific IPs

#### Create Database User
1. Go to "Database Access"
2. Add new database user
3. Set username and password
4. Grant Admin privileges

#### Get Connection String
1. Click "Connect" on cluster
2. Select "Drivers"
3. Copy connection string
4. Replace `<username>`, `<password>`, and `<database>`

Example:
```
mongodb+srv://admin:password123@cluster0.abc123.mongodb.net/ecommerce-analytics
```

### 5. Initialize Database

#### Create Collections and Indexes
```javascript
// Connect to MongoDB Atlas and run these commands in MongoDB Compass or shell

// Admin collection
db.createCollection("admins")

// Product collection
db.createCollection("products")
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "createdAt": -1 })

// ClickEvent collection
db.createCollection("clickevents")
db.clickevents.createIndex({ "productId": 1, "timestamp": -1 })
db.clickevents.createIndex({ "sessionId": 1 })
db.clickevents.createIndex({ "timestamp": -1 })

// Visitor collection
db.createCollection("visitors")
db.visitors.createIndex({ "sessionId": 1 })
db.visitors.createIndex({ "visitTime": -1 })

// ML Prediction collection
db.createCollection("mlpredictions")
db.mlpredictions.createIndex({ "productId": 1 })
db.mlpredictions.createIndex({ "generatedAt": -1 })
```

#### Insert Sample Admin
```javascript
db.admins.insertOne({
  name: "Admin",
  email: "admin@manika.com",
  password: "hashed_password_here", // You'll need to hash this first
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

### 6. Domain Configuration

#### Update Frontend URL
- In Vercel project settings, add custom domain
- Update `FRONTEND_URL` in backend environment

#### Update Backend URL
- Get Render backend URL
- Update `REACT_APP_API_URL` in frontend environment

#### Update ML Service URL
- Get Render ML service URL
- Configure in backend if needed

### 7. DNS Setup

If using custom domains:

#### For Vercel (Frontend)
```
CNAME: your-domain.com → cname.vercel-dns.com
```

#### For Render (Backend)
```
CNAME: api.your-domain.com → api-url.onrender.com
```

### 8. SSL/TLS Certificate

- Vercel: Automatically provides SSL
- Render: Automatically provides SSL
- MongoDB Atlas: SSL connection required

### 9. Final Verification

Test all endpoints:
```bash
# Frontend
curl https://your-frontend-url.vercel.app

# Backend
curl https://your-backend-url.onrender.com/health

# ML Service
curl https://your-ml-url.onrender.com/health

# Login
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@manika.com","password":"manika93057"}'
```

### 10. Monitoring & Logs

#### Vercel Logs
- Dashboard → Project → Deployments → View Logs

#### Render Logs
- Dashboard → Service → Logs

#### MongoDB Logs
- MongoDB Atlas → Monitoring → Logs

### 11. Auto-Deployment Setup

Both Vercel and Render support automatic deployments on Git push:

1. Push to main branch
2. GitHub triggers webhook
3. Services automatically deploy

### 12. Production Checklist

- [ ] Update all environment variables
- [ ] Verify CORS settings
- [ ] Test all API endpoints
- [ ] Configure custom domains
- [ ] Set up SSL certificates
- [ ] Enable database backups
- [ ] Configure monitoring/alerts
- [ ] Set up error tracking
- [ ] Test payment integration (if applicable)
- [ ] Verify analytics tracking
- [ ] Test ML pipeline execution
- [ ] Set up uptime monitoring

### 13. Troubleshooting Deployment

#### Common Issues

**CORS Error**
- Verify FRONTEND_URL in backend
- Check browser console for exact error
- Update CORS settings in server.js

**Database Connection Failed**
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**ML Service Not Running**
- Check ML service logs
- Verify Python dependencies installed
- Check MongoDB connection

**Frontend Not Loading API**
- Verify REACT_APP_API_URL is correct
- Check browser network tab
- Ensure backend is running

## Continuous Deployment Workflow

```
Push to GitHub
    ↓
GitHub Actions / Webhook
    ↓
Vercel (Frontend) deploys automatically
Render (Backend) deploys automatically
Render (ML) deploys automatically
    ↓
Tests run
    ↓
Production environment updated
```

## Scaling Considerations

### Database
- Upgrade MongoDB plan as needed
- Enable replication
- Configure backups

### Backend
- Consider Render higher tier for better performance
- Enable auto-scaling if available
- Monitor response times

### Frontend
- CDN distribution (Vercel handles automatically)
- Image optimization
- Code splitting

## Security Checklist

- [ ] Change default credentials
- [ ] Rotate API keys
- [ ] Enable 2FA on accounts
- [ ] Configure firewall rules
- [ ] Enable database encryption
- [ ] Set up HTTPS/SSL
- [ ] Review CORS policy
- [ ] Enable rate limiting
- [ ] Set up DDoS protection
- [ ] Regular security audits

## Support

For deployment issues:
1. Check Vercel/Render documentation
2. Review service logs
3. Check MongoDB Atlas documentation
4. Contact support teams
