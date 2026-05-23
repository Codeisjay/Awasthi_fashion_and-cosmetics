# Quick Start Guide

Get up and running in 10 minutes!

## Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB Atlas account (free tier OK)
- A code editor (VS Code recommended)

## 1. Quick Setup (5 minutes)

### Clone and Navigate
```bash
cd "MY bussiness"
```

### Backend Quick Start
```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret
npm run dev
# Backend running on http://localhost:5000
```

### Frontend Quick Start (new terminal)
```bash
cd client
npm install
cp .env.example .env
npm run dev
# Frontend running on http://localhost:3000
```

### ML Service Quick Start (new terminal)
```bash
cd ml-service
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
# ML Service running on http://localhost:5001
```

## 2. Quick Testing (5 minutes)

### Test Frontend
1. Open http://localhost:3000
2. Click on "Products" to see product listing
3. Try searching and filtering products
4. Click "Admin" to access login page

### Test Backend
```bash
# Health check
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/api/products

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@manika.com","password":"manika93057"}'
```

### Access Admin Dashboard
1. Go to http://localhost:3000/admin/login
2. Use credentials:
   - Email: admin@manika.com
   - Password: manika93057
3. Click "Login"
4. View dashboard with analytics

## 3. Add Test Data

### Using MongoDB Compass or CLI

#### Add Sample Products
```javascript
db.products.insertMany([
  {
    title: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    image: "https://via.placeholder.com/300x300?text=Headphones",
    category: "Electronics",
    meeshoLink: "https://meesho.com/product",
    clicks: 0,
    impressions: 0,
    stockStatus: "in-stock",
    isActive: true,
    createdAt: new Date()
  },
  {
    title: "Cotton T-Shirt",
    description: "Comfortable and breathable cotton t-shirt",
    image: "https://via.placeholder.com/300x300?text=T-Shirt",
    category: "Fashion",
    meeshoLink: "https://meesho.com/product",
    clicks: 0,
    impressions: 0,
    stockStatus: "in-stock",
    isActive: true,
    createdAt: new Date()
  }
  // Add more products as needed
])
```

## 4. Key URLs

### User Panel
- Home: http://localhost:3000/
- Products: http://localhost:3000/products
- About: http://localhost:3000/about
- Contact: http://localhost:3000/contact

### Admin Panel
- Login: http://localhost:3000/admin/login
- Dashboard: http://localhost:3000/admin/dashboard
- Products: http://localhost:3000/admin/products
- Insights: http://localhost:3000/admin/insights

### API
- Products: http://localhost:5000/api/products
- Analytics: http://localhost:5000/api/analytics/overview
- Track: http://localhost:5000/api/track/

## 5. Common Tasks

### Add a Product (Admin)
1. Login to admin dashboard
2. Click "Products" in sidebar
3. Click "Add Product" button
4. Fill in product details
5. Click "Add Product"

### View Analytics
1. Login to admin dashboard
2. View overview cards on main page
3. Scroll down to see charts and trends

### Track Visits
- Visits are automatically tracked when users visit pages
- Clicks are tracked when users click product links
- View tracking data in admin analytics

### Run ML Pipeline Manually
```bash
cd ml-service
python main.py
```

## 6. Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Error
- Verify MongoDB URI in .env
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### CORS Error
- Clear browser cache (Ctrl+Shift+Delete)
- Verify FRONTEND_URL in backend .env
- Restart backend server

### Blank Admin Dashboard
- Check browser console for errors
- Verify JWT token is valid
- Check network tab in browser dev tools

## 7. Next Steps

After getting everything running:

1. **Explore the codebase**
   - Check `/client/src` for frontend components
   - Check `/server` for backend API
   - Check `/ml-service` for ML models

2. **Customize design**
   - Update colors in `tailwind.config.js`
   - Modify components in `/client/src/components`
   - Update pages in `/client/src/pages`

3. **Add more features**
   - Authentication improvements
   - Email notifications
   - Advanced filtering
   - User accounts

4. **Deploy to production**
   - Follow DEPLOYMENT.md guide
   - Configure MongoDB Atlas
   - Deploy to Vercel, Render, and Heroku

## 8. Important Files to Know

- `/client/src/App.jsx` - Main React app with routing
- `/server/server.js` - Express server entry point
- `/server/routes/` - API route definitions
- `/server/controllers/` - Business logic
- `/ml-service/main.py` - ML pipeline orchestrator
- `/README.md` - Full documentation
- `/API_DOCUMENTATION.md` - Detailed API docs
- `/DEPLOYMENT.md` - Deployment guide

## 9. Development Tips

### Hot Reload
- Frontend: Changes auto-reload in browser
- Backend: Use `npm run dev` for nodemon auto-reload
- ML: Restart `python app.py` to see changes

### Debugging
- Frontend: Use browser DevTools (F12)
- Backend: Check terminal output
- ML: Check terminal logs

### Database Inspection
- Use MongoDB Compass for visual inspection
- Or use MongoDB CLI for command line access

## 10. Still Stuck?

1. **Read full documentation**: `/README.md`
2. **Check API docs**: `/API_DOCUMENTATION.md`
3. **Review deployment guide**: `/DEPLOYMENT.md`
4. **Check component code**: Well-commented and structured
5. **Review errors**: Check browser console and terminal logs

---

**Happy coding! 🚀**
