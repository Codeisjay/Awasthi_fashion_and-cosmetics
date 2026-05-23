# Quick Deployment Checklist for Render

## 1️⃣ Pre-Deployment (10 minutes)

```bash
# Commit all changes
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 2️⃣ Create Services on Render (5 minutes each)

### Backend Service
1. Go to render.com → Dashboard → New Web Service
2. Connect GitHub repo → Select your repo
3. Configure:
   - Name: `ecommerce-analytics-server`
   - Runtime: `Node`
   - Build: `cd server && npm install`
   - Start: `cd server && npm start`
   - Plan: Free

### Frontend Service
1. New Web Service
2. Configure:
   - Name: `ecommerce-analytics-client`
   - Runtime: `Node`
   - Build: `cd client && npm install && npm run build`
   - Start: `cd client && npm run preview`
   - Plan: Free

## 3️⃣ Set Environment Variables (5 minutes)

### Backend Service Environment
```
NODE_ENV = production
PORT = 5000
MONGODB_URI = mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET = (generate strong random key)
FRONTEND_URL = https://your-frontend-name.onrender.com
```

### Frontend Service Environment
```
VITE_API_URL = https://your-backend-name.onrender.com/api
VITE_GOOGLE_CLIENT_ID = your_google_client_id
```

## 4️⃣ Update Google OAuth (2 minutes)

In [Google Cloud Console](https://console.cloud.google.com/):
- Add `https://your-frontend-name.onrender.com` to Authorized JavaScript origins
- Add same URL to Authorized redirect URIs

## 5️⃣ Verify Deployment (5 minutes)

```
✓ Backend health: https://your-backend-name.onrender.com/health
✓ Frontend loads: https://your-frontend-name.onrender.com
✓ Admin login works with admin@manika.com / manika93057
✓ Google login button appears
✓ Products visible in UI
```

## 🚨 If Something Goes Wrong

1. **Check Logs**:
   - Render Dashboard → Service → Logs tab

2. **Common Issues**:
   - MongoDB connection: Verify URI and IP whitelist (add 0.0.0.0/0)
   - API URL: Ensure VITE_API_URL matches backend URL
   - Google OAuth: Check redirect URIs in Google Cloud Console

3. **Quick Fixes**:
   ```bash
   git push  # Trigger redeploy
   # Or manually redeploy from Render dashboard
   ```

---

## Total Time: ~30-40 minutes ⏱️

### URLs After Deployment
- **Frontend**: https://your-frontend-name.onrender.com
- **Backend API**: https://your-backend-name.onrender.com/api
- **Admin Login**: https://your-frontend-name.onrender.com/admin/login
- **User Login**: https://your-frontend-name.onrender.com/login

---

## 📚 Full Guide
See `RENDER_DEPLOYMENT.md` for detailed instructions
