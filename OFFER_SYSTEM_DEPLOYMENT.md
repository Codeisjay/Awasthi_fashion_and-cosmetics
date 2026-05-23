# Offer System Implementation - Deployment Checklist

## Pre-Deployment Verification

### Backend Setup
- [x] Upload middleware created (`/server/middleware/upload.js`)
- [x] Static file serving configured in `server.js`
- [x] Image upload endpoint added to routes
- [x] Image upload handler added to controller
- [x] Error handling implemented for file uploads
- [x] `.gitignore` updated to exclude uploads folder

### Frontend Setup
- [x] OfferCard component created with professional design
- [x] AdminOffers component updated with image upload UI
- [x] API service updated with image upload function
- [x] OffersPage redesigned with filtering and search
- [x] HomePage enhanced with featured offers section
- [x] Navbar updated with Offers link
- [x] App.jsx routes updated with `/offers` path

### Directory Structure
```
server/
├── middleware/
│   └── upload.js                 ✓ Created
├── uploads/                       (will be created on first upload)
│   └── offers/                    (image storage)
├── controllers/
│   └── offerController.js         ✓ Updated
├── routes/
│   └── offerRoutes.js             ✓ Updated
└── server.js                      ✓ Updated

client/
├── src/
│   ├── components/
│   │   ├── OfferCard.jsx          ✓ Created
│   │   └── Navbar.jsx             ✓ Updated
│   ├── pages/
│   │   ├── HomePage.jsx           ✓ Updated
│   │   └── OffersPage.jsx         ✓ Updated
│   ├── dashboard/
│   │   └── AdminOffers.jsx        ✓ Updated
│   ├── services/
│   │   └── api.js                 ✓ Updated
│   └── App.jsx                    ✓ Updated
```

## Installation & Setup

### 1. Backend Dependencies
All required packages should already be installed:
```bash
cd server
npm list multer express cors mongoose
# Should show all packages installed
```

If multer is missing:
```bash
npm install multer@1.4.5-lts.1
```

### 2. Create Uploads Directory
The directory will be created automatically on first image upload, but you can create it manually:
```bash
mkdir -p server/uploads/offers
chmod 755 server/uploads/offers
```

### 3. Frontend Dependencies
No new dependencies needed. Verify existing packages:
```bash
cd client
npm list react axios
```

### 4. Environment Variables
No new environment variables needed. Existing setup should work:
- `VITE_API_URL` - Backend API URL
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Authentication key

## Testing Before Deployment

### 1. Backend Image Upload Testing
```bash
# Start backend server
cd server
npm start

# Test health check
curl http://localhost:5000/health

# Test admin login (required for uploads)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### 2. Image Upload Test
```bash
# Upload a test image (requires admin token from above)
curl -X POST http://localhost:5000/api/offers/upload-image \
  -H "Authorization: Bearer <your_admin_token>" \
  -F "image=@test-image.jpg"

# Expected response:
# {
#   "success": true,
#   "message": "Image uploaded successfully",
#   "imageUrl": "/uploads/offers/offer-1234567890-abcdef.jpg"
# }
```

### 3. Frontend Testing
```bash
# Start frontend
cd client
npm run dev

# Test offer pages:
# - http://localhost:5173/ (Homepage with featured offers)
# - http://localhost:5173/offers (All offers page)
# - http://localhost:5173/admin/offers (Admin offers management)
```

### 4. Admin Panel Testing
1. Navigate to `/admin/login`
2. Login with: `admin@manika.com` / `manika93057`
3. Go to Offers Management
4. Create a new offer with an image:
   - Fill in all fields
   - Upload an image file
   - Verify preview appears
   - Submit form
5. Verify offer appears on `/offers` page
6. Check if image displays correctly

### 5. Image Serving Test
1. Create an offer with image
2. Open browser DevTools (F12)
3. Go to Network tab
4. Navigate to `/offers` page
5. Check that image requests return 200 status
6. Verify images load without CORS errors

## Deployment Steps

### Option 1: Local Deployment
1. Ensure MongoDB is running
2. Start backend: `cd server && npm start`
3. Start frontend: `cd client && npm run dev`
4. Test at `http://localhost:3000` (or port shown in terminal)

### Option 2: Production Deployment

#### Backend (Render or similar)
1. Push code to git repository
2. Create new Web Service on Render
3. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_connection
   JWT_SECRET=your_secret_key
   FRONTEND_URL=your_frontend_url
   NODE_ENV=production
   PORT=5000
   ```
4. Build command: `cd server && npm install`
5. Start command: `npm start`
6. Enable persistence for uploads folder (if using Render)

#### Frontend (Vercel or Netlify)
1. Push code to git repository
2. Create new project pointing to client folder
3. Set environment variables:
   ```
   VITE_API_URL=your_backend_url
   ```
4. Build command: `npm run build`
5. Output directory: `dist`

#### Important: Uploads Folder
For production, uploads folder needs persistence:
- **Render**: Create a disk mount for `/server/uploads`
- **Vercel**: Use external storage (AWS S3, etc.)
- **Self-hosted**: Ensure folder has write permissions

## Post-Deployment Verification

### 1. Check All Routes
- [ ] `/` - Homepage loads with featured offers
- [ ] `/offers` - Offers page loads and displays offers
- [ ] `/admin/login` - Admin login works
- [ ] `/admin/dashboard` - Admin dashboard accessible
- [ ] `/admin/offers` - Admin offers panel loads

### 2. Test Image Upload
- [ ] Admin can upload images
- [ ] Images appear in offer cards
- [ ] Images load without 404 errors
- [ ] Different image formats work (JPG, PNG, WebP)

### 3. Test User Features
- [ ] Users can view offers
- [ ] Search functionality works
- [ ] Filters work (by type)
- [ ] Sort options work
- [ ] Countdown timers display correctly
- [ ] Coupon codes show properly

### 4. Test Admin Features
- [ ] Can create offers with images
- [ ] Can edit offers and change images
- [ ] Can delete offers
- [ ] Can toggle offer status (active/inactive)
- [ ] Can view offer analytics

### 5. Mobile Testing
- [ ] Homepage loads correctly on mobile
- [ ] Offers page is responsive
- [ ] Image sizes adjust for mobile
- [ ] Navigation works on mobile
- [ ] Admin panel works on mobile

## Troubleshooting

### Images Not Uploading
1. Check server logs for errors
2. Verify `/server/uploads` folder exists and is writable
3. Check file size (must be under 5MB)
4. Verify file format (JPG, PNG, WebP, GIF only)
5. Check admin token is valid
6. Ensure CORS is configured correctly

### Images Not Displaying
1. Check image URL in database
2. Verify static file serving is enabled in server.js
3. Check file permissions on uploaded images
4. Clear browser cache
5. Check browser console for CORS errors

### Database Issues
1. Verify MongoDB connection string
2. Check database credentials
3. Ensure offer documents have bannerImage field
4. Run migration if needed (shouldn't be necessary)

### Port Conflicts
- Backend default: 5000
- Frontend default: 5173
- Change with PORT environment variable or npm flags

## Rollback Plan

If issues occur:
1. Revert last commit: `git revert <commit-hash>`
2. Remove uploads folder: `rm -rf server/uploads`
3. Restart servers
4. Check logs for error details
5. Contact developer if issues persist

## Performance Optimization (Optional)

### Image Optimization
```bash
# Install image optimization packages (optional)
npm install --save-dev sharp

# Add image processing to upload.js for resize/compression
```

### Caching Headers
Add to server.js:
```javascript
app.use('/uploads', express.static('uploads', {
  maxAge: '1d',
  etag: false
}));
```

### CDN Integration (Future)
- Consider S3 for image storage
- Use CloudFront for distribution
- Update image URLs to CDN paths

## Support & Maintenance

### Regular Tasks
- Monitor upload folder size
- Clean old/unused images periodically
- Review offer analytics
- Update offer images seasonally

### Common Questions
- **Q: How to backup uploaded images?**
  - A: Backup `/server/uploads` folder regularly

- **Q: Can I migrate images to S3?**
  - A: Yes, update upload middleware and image URLs

- **Q: How to set image storage limits?**
  - A: Configure in upload.js limits object

## Documentation References
- [OFFER_SYSTEM_IMAGE_GUIDE.md](./OFFER_SYSTEM_IMAGE_GUIDE.md) - User guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [Multer Documentation](https://github.com/expressjs/multer) - File upload library

---
**Deployment Date**: ___________
**Deployed By**: ___________
**Version**: 1.0.0
**Status**: [ ] Testing [ ] Staging [ ] Production
