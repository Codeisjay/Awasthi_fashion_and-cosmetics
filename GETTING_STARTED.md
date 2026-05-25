# Getting Started Checklist

Complete this checklist to get your MERN platform up and running!

## Pre-Setup Requirements
- [ ] Node.js v16+ installed (verify: `node --version`)
- [ ] Python 3.8+ installed (verify: `python --version`)
- [ ] Git installed (verify: `git --version`)
- [ ] MongoDB Atlas account created
- [ ] Text editor/IDE ready (VS Code recommended)

## MongoDB Setup
- [ ] Create MongoDB Atlas cluster
- [ ] Create database user
- [ ] Add IP to network access (0.0.0.0/0 for development)
- [ ] Copy connection string
- [ ] Create collections:
  - [ ] admins
  - [ ] products
  - [ ] clickevents
  - [ ] visitors
  - [ ] mlpredictions
- [ ] Create indexes on collections

## Backend Setup
- [ ] Open terminal in `/server`
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in environment variables:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET (use a random string)
  - [ ] PORT (default 5000)
  - [ ] NODE_ENV (development)
  - [ ] FRONTEND_URL
- [ ] Run `npm run dev`
- [ ] Verify: `curl http://localhost:5000/health`

## Frontend Setup
- [ ] Open new terminal in `/client`
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in environment variables:
  - [ ] VITE_API_URL (http://localhost:5000/api)
- [ ] Run `npm run dev`
- [ ] Verify: Browser opens http://localhost:3000

## ML Service Setup
- [ ] Open new terminal in `/ml-service`
- [ ] Create virtual environment: `python -m venv venv`
- [ ] Activate venv:
  - [ ] Windows: `venv\Scripts\activate`
  - [ ] Mac/Linux: `source venv/bin/activate`
- [ ] Run `pip install -r requirements.txt`
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in environment variables:
  - [ ] MONGODB_URI
  - [ ] DB_NAME
  - [ ] ML_RUN_INTERVAL (3600 for 1 hour)
- [ ] Run `python app.py`
- [ ] Verify: `curl http://localhost:5001/health`

## Initial Data Setup
- [ ] Add admin user to database
- [ ] Add sample products to database
- [ ] Verify all collections have data

## Testing
### Frontend Tests
- [ ] Home page loads
- [ ] Products page shows products
- [ ] Search functionality works
- [ ] Category filters work
- [ ] About page accessible
- [ ] Contact page accessible
- [ ] Admin login page accessible

### Admin Panel Tests
- [ ] Login with admin credentials
- [ ] Dashboard loads
- [ ] Analytics cards display
- [ ] Charts render
- [ ] Can navigate to products
- [ ] Can add/edit/delete products
- [ ] Can view insights
- [ ] Logout works

### API Tests
- [ ] GET /api/products returns products
- [ ] POST /api/auth/login returns token
- [ ] GET /api/analytics/overview works (with token)
- [ ] POST /api/track/visit works
- [ ] POST /api/track/click works

### ML Pipeline Tests
- [ ] ML service runs without errors
- [ ] Check mlpredictions collection for results
- [ ] Verify predictions have correct structure

## Deployment Preparation
- [ ] Push code to GitHub repository
- [ ] Create Vercel account
- [ ] Create Render account
- [ ] Update README with actual URLs
- [ ] Review all .env files
- [ ] Test all endpoints one more time
- [ ] Prepare deployment plan

## Production Deployment
- [ ] Deploy frontend to Vercel
  - [ ] Verify: https://frontend-url loads
  - [ ] Test: All pages work
- [ ] Deploy backend to Render
  - [ ] Verify: https://backend-url/health returns 200
  - [ ] Test: API endpoints respond
- [ ] Deploy ML service to Render
  - [ ] Verify: https://ml-url/health returns 200
  - [ ] Test: ML predictions generate
- [ ] Update environment variables
  - [ ] Frontend: VITE_API_URL
  - [ ] Backend: FRONTEND_URL, MONGODB_URI
  - [ ] ML: MONGODB_URI
- [ ] Test end-to-end functionality
- [ ] Monitor logs
- [ ] Set up backups

## Post-Launch
- [ ] Monitor analytics
- [ ] Check error logs daily
- [ ] Verify ML pipeline runs hourly
- [ ] Review user behavior
- [ ] Optimize based on metrics
- [ ] Add more products
- [ ] Fine-tune ML models
- [ ] Plan enhancements

## Documentation
- [ ] Read README.md completely
- [ ] Review API_DOCUMENTATION.md
- [ ] Check ARCHITECTURE.md for system design
- [ ] Follow DEPLOYMENT.md for production
- [ ] Bookmark all documentation

## Security Checklist
- [ ] Change default admin password
- [ ] Rotate JWT_SECRET
- [ ] Enable MongoDB IP whitelist
- [ ] Set up SSL/TLS
- [ ] Enable CORS properly
- [ ] Review error messages (don't expose internals)
- [ ] Audit database permissions
- [ ] Set up logging/monitoring

## Performance Optimization (Optional)
- [ ] Set up caching (Redis optional)
- [ ] Optimize database indexes
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Set up CDN
- [ ] Monitor response times

## Troubleshooting Quick Reference
- MongoDB won't connect → Check connection string, IP whitelist
- CORS errors → Check FRONTEND_URL in backend
- Frontend can't reach API → Check VITE_API_URL
- ML not running → Check Python environment, dependencies
- Port conflicts → Change port or kill existing process

## Additional Resources
- Backend Documentation: `/server/README.md` (create if needed)
- Frontend Documentation: `/client/README.md` (create if needed)
- API Reference: `/API_DOCUMENTATION.md`
- Deployment Guide: `/DEPLOYMENT.md`
- Architecture: `/ARCHITECTURE.md`
- Quick Start: `/QUICKSTART.md`

---

## Success Indicators
✅ You'll know everything is working when:
1. Frontend loads without errors
2. Admin can login successfully
3. Dashboard shows real analytics data
4. Products can be added/edited/deleted
5. ML predictions appear in database
6. All pages are responsive
7. No console errors in browser
8. Backend logs show successful requests
9. ML service runs scheduled tasks
10. All environment variables are properly configured

---

**Once you've completed this checklist, your MERN platform is ready to use!**

For detailed instructions on each step, refer to QUICKSTART.md
