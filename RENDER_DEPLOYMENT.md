# Render Deployment Guide

## Overview
This guide will help you deploy your MERN ecommerce analytics platform on Render.

## Prerequisites

1. **Render Account**: Create a free account at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Set up a MongoDB database (free tier available)
4. **Google OAuth**: Have your Google Client ID ready

---

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and new project
3. Create a cluster (free tier)
4. Add a database user with username and password
5. Get your connection string (looks like: `mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)

---

## Step 2: Push Code to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

2. Create `.gitignore` in root:
```
node_modules
.env
.env.local
dist
build
.DS_Store
uploads
```

3. Create `.gitignore` in `server/`:
```
node_modules
.env
uploads
```

4. Create `.gitignore` in `client/`:
```
node_modules
.env.local
dist
build
```

---

## Step 3: Create Web Services on Render

### Option A: Automatic Deployment (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select your repo and configure:

#### Backend Service
- **Name**: `ecommerce-analytics-server`
- **Runtime**: Node
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Plan**: Free

#### Frontend Service
- **Name**: `ecommerce-analytics-client`
- **Runtime**: Node
- **Build Command**: `cd client && npm install && npm run build`
- **Start Command**: `cd client && npm run preview`
- **Plan**: Free

### Option B: Manual Configuration via YAML

1. Create `render.yaml` in root (already created)
2. Push to GitHub
3. Go to Render Dashboard → "New" → "Infrastructure"
4. Select your repository
5. Render will detect render.yaml and configure automatically

---

## Step 4: Configure Environment Variables

### For Backend Service

1. Go to backend service settings
2. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a strong random string (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"`)
   - `FRONTEND_URL`: Your frontend Render URL (e.g., `https://app-name.onrender.com`)
   - `FRONTEND_URL`: Your frontend Render URL (e.g., `https://your-frontend.onrender.com`)

### For Frontend Service

1. Go to frontend service settings
2. Add environment variables:
   - `VITE_API_URL`: Your backend Render URL (e.g., `https://your-backend.onrender.com/api`)
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID

---

## Step 5: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Find your OAuth 2.0 credentials
3. Add to Authorized JavaScript origins:
   - `https://your-frontend.onrender.com`
   - `https://*.onrender.com`

4. Add to Authorized redirect URIs:
   - `https://your-frontend.onrender.com`
   - `https://*.onrender.com`

---

## Step 6: Database Seeding

### Create Initial Admin

1. After services are deployed, visit backend health check:
   ```
   https://your-backend.onrender.com/health
   ```

2. Run seed endpoint to create admin:
   ```
   https://your-backend.onrender.com/api/seed
   ```

3. Login credentials:
   - Email: `admin@manika.com`
   - Password: `manika93057`

### Seed ML Data (Optional)

```
https://your-backend.onrender.com/api/seed-ml
```

---

## Step 7: Verify Deployment

### Frontend
- Visit: `https://your-frontend.onrender.com`
- Check if page loads

### Backend
- Health check: `https://your-backend.onrender.com/health`
- Login page: `https://your-frontend.onrender.com/admin/login`

### Database Connection
- Check MongoDB Atlas for new connections
- Verify admin user is created

---

## Important Configurations

### CORS Setup
Backend already has CORS configured for production. Make sure `FRONTEND_URL` environment variable is set correctly.

### File Uploads
- Uploads are stored in `server/uploads/` directory
- Note: On Render free tier, this is ephemeral and will be cleared on redeploy
- **Recommendation**: Use MongoDB GridFS or cloud storage (AWS S3, Cloudinary) for production

### ML Service
- Currently runs on localhost:5001
- For production, consider deploying separately or adjusting configuration

### Database Backups
- MongoDB Atlas free tier includes automatic backups
- Enable backup snapshots in Atlas dashboard

---

## Deployment Checklist

- [ ] MongoDB Atlas database created
- [ ] GitHub repository with .gitignore
- [ ] Render account created
- [ ] Backend service created with environment variables
- [ ] Frontend service created with environment variables
- [ ] Google OAuth credentials updated
- [ ] Services deployed and running
- [ ] Health check passing
- [ ] Admin user created
- [ ] Google login tested
- [ ] Products visible on frontend

---

## Common Issues

### 1. Frontend Shows 404
**Solution**: 
- Check `VITE_API_URL` is correct
- Verify backend service is running
- Check browser console for errors

### 2. Backend Connection Refused
**Solution**:
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0 for Render)
- Check database user credentials

### 3. Google Login Not Working
**Solution**:
- Verify `VITE_GOOGLE_CLIENT_ID` is set
- Check authorized origins in Google Cloud Console
- Clear browser cache and localStorage

### 4. Slow Cold Starts
**Solution**:
- This is normal for free tier
- Consider upgrading to paid plan for faster performance
- Use Render's "Always On" feature

### 5. Uploads Not Persisting
**Solution**:
- Use cloud storage like AWS S3 or Cloudinary
- Or use MongoDB GridFS for file storage

---

## Performance Optimization

1. **Enable Gzip Compression** (already configured in server)
2. **Use CDN** for static assets (Render includes free CDN)
3. **Database Indexing** (already set up in models)
4. **Connection Pooling** (configured in MongoDB URI)

---

## Monitoring & Logs

### View Backend Logs
1. Render Dashboard → Backend Service
2. Click "Logs" tab
3. Scroll through logs

### View Frontend Logs
1. Render Dashboard → Frontend Service
2. Click "Logs" tab

### Database Monitoring
1. MongoDB Atlas Dashboard
2. Check Metrics, Activity, Logs

---

## Scaling for Production

### After Free Tier
1. Upgrade Render instances to paid plans
2. Switch to MongoDB paid tier
3. Implement caching (Redis)
4. Use separate ML service deployment
5. Enable auto-scaling
6. Implement CDN for static assets

---

## Security Notes

1. **Never** commit `.env` files
2. **Always** use strong JWT_SECRET
3. **Rotate** JWT_SECRET periodically
4. **Monitor** MongoDB Atlas for suspicious activity
5. **Enable** two-factor authentication on accounts
6. **Use** HTTPS only (Render handles this automatically)

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Express.js**: https://expressjs.com
- **React**: https://react.dev
- **Vite**: https://vitejs.dev

---

## Next Steps

1. Deploy to production
2. Test all features thoroughly
3. Set up monitoring alerts
4. Plan for scaling
5. Implement backup strategy
6. Enable analytics tracking

**Congratulations! Your app is now live on Render! 🎉**
