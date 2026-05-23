# Offer System - Image Upload & Display Guide

## Overview
The offer system has been enhanced with professional image upload capabilities and improved visibility throughout the website. Offers now appear in multiple locations with beautiful card designs, countdown timers, and professional image displays.

## New Features

### 1. **Image Upload in Admin Panel**
- Admins can now upload banner images for offers
- Supported formats: JPEG, PNG, WebP, GIF
- Maximum file size: 5MB
- Images are validated and stored securely

### 2. **Professional Offer Display**
Offers now display as beautiful cards with:
- High-quality banner images
- Discount badges showing percentage/fixed amounts
- Offer type labels (Festive, Flash, BOGO, etc.)
- Countdown timers showing time until offer expires
- Coupon codes (if applicable)
- Minimum purchase requirements
- Color-coded design based on offer type

### 3. **Offers Visibility**
Offers are now visible in three key locations:

#### a) **Home Page**
- Featured Offers Section showing top 3 offers by priority
- Beautiful grid layout with CTAs
- Direct link to view all offers

#### b) **Dedicated Offers Page (`/offers`)**
- Complete catalog of all active offers
- Search functionality to find specific offers
- Filter by offer type
- Sort options:
  - By Priority (default)
  - By Ending Soon
  - By Highest Discount
- Professional card-based grid layout
- Mobile responsive design

#### c) **Navigation Bar**
- "Offers" link prominently displayed
- Quick access from any page
- Works on both desktop and mobile

## How to Use

### For Admins: Creating an Offer with Image

1. **Navigate to Admin Panel**
   - Click "Admin" in navbar (or "Dashboard" if logged in)
   - Go to Offers Management section

2. **Create New Offer**
   - Click "New Offer" button
   - Fill in basic details:
     - Title (required)
     - Description
     - Offer Type (Percentage, Fixed, BOGO, etc.)
     - Discount Value
     - Coupon Code (optional)
     - Dates (Start & End)

3. **Upload Banner Image**
   - Click on "Banner Image" upload section
   - Select image file (JPG, PNG, WebP, or GIF)
   - Image will upload automatically
   - Preview will appear on the right
   - File size must be under 5MB

4. **Set Display Options**
   - Priority (0-100): Higher numbers show first
   - Display Position: Choose where to show (Hero, Carousel, Banner, Popup)
   - These help you control offer visibility

5. **Submit**
   - Click "Create Offer" button
   - Offer will be saved with image

### For Admins: Editing an Offer

1. Find the offer in the Offers Management table
2. Click the Edit button (pencil icon)
3. Update any fields including:
   - Image: Upload a new image or remove existing
   - Other details: Title, discount, dates, etc.
4. Click "Update Offer"

### For Admins: Managing Images

**Replacing an Image:**
- Click edit on the offer
- Upload a new image to replace existing
- Old image will be overwritten

**Removing an Image:**
- Click the "X" button on the image preview
- Image will be removed from the offer
- Offer will display without an image (gray placeholder)

### For Users: Viewing Offers

**On Homepage:**
- Scroll to "Featured Offers" section
- See top 3 offers displayed professionally
- Click "View All Offers" to see complete catalog

**On Offers Page (`/offers`):**
- Click "Offers" in navbar
- Browse all active offers
- Use search to find specific offers
- Filter by offer type
- Sort by different criteria
- Click on any offer card to see details

**Offer Card Information:**
- Big discount badge showing savings
- Offer title and description
- Coupon code (if applicable) - displayed in special box
- Days until offer expires with countdown
- Minimum purchase requirement (if applicable)
- "View Details" button for more info

## Technical Details

### Backend Image Handling
- Images stored in `/server/uploads/offers/` directory
- Unique filenames with timestamps prevent conflicts
- Images served statically at `/uploads/offers/filename`
- Maximum 5MB file size enforced
- File type validation (image files only)

### Image URL Format
```
http://your-server.com/uploads/offers/offer-[timestamp]-[random].jpg
```

### Database Field
- Stored in `Offer.bannerImage` field
- Can be updated without deleting offer
- Supports null values (offers work without images)

## Design Features

### Offer Card Colors
Offers are color-coded by type:
- **Festive**: Red to Pink gradient
- **Percentage**: Blue to Cyan gradient
- **Fixed Amount**: Green to Emerald gradient
- **BOGO**: Purple to Pink gradient
- **Seasonal**: Orange to Yellow gradient
- **Flash**: Red to Orange gradient
- **Category**: Indigo to Purple gradient
- **Product**: Cyan to Blue gradient

### Responsive Design
- Automatically adjusts for mobile devices
- Touch-friendly buttons
- Optimized images for all screen sizes
- Mobile-optimized card layout

## Tips for Best Results

### Image Best Practices
1. **Size**: 
   - Recommended: 1200 x 600 pixels or larger
   - Aspect ratio: 2:1 works best
   
2. **Format**: 
   - Use PNG for images with transparency
   - Use JPG for photos (smaller file size)
   - Use WebP for modern browsers (best compression)

3. **Content**:
   - Include clear offer details visually
   - Use contrasting colors for readability
   - Add your brand colors
   - Keep text minimal (title and discount are shown separately)

4. **Quality**:
   - Ensure images are clear and professional
   - Avoid low-resolution or pixelated images
   - Bright, appealing images perform better

### Offer Configuration Tips
1. **Priority**: Set higher values (50-100) for important offers
2. **Display Position**: Use "hero" for main offers, "carousel" for rotation
3. **Dates**: Set realistic start/end times
4. **Coupon Codes**: Make them easy to remember (e.g., SUMMER25)

## Troubleshooting

### Image Upload Issues
- **"Image too large"**: Compress image to under 5MB
- **"Invalid file type"**: Use JPG, PNG, WebP, or GIF
- **Upload fails**: Check internet connection, try again

### Images Not Appearing
- Verify image URL in database
- Check if `/uploads/offers/` folder exists
- Ensure server has permission to serve static files
- Clear browser cache and reload

### Offers Not Visible
- Check offer is marked as "Active"
- Verify start date has passed and end date is in future
- Check if any filters are applied (search/type)
- Ensure display position is not set to "none"

## File Locations
- Backend uploads: `/server/uploads/offers/`
- Frontend components: `/client/src/components/OfferCard.jsx`
- Admin panel: `/client/src/dashboard/AdminOffers.jsx`
- Public page: `/client/src/pages/OffersPage.jsx`
- Upload middleware: `/server/middleware/upload.js`

## API Endpoints

### Image Upload
```
POST /api/offers/upload-image
Authentication: Required (Admin)
Content-Type: multipart/form-data

Request:
{
  "image": <file>
}

Response:
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/offers/offer-1234567890-abcdef.jpg"
}
```

### Get Active Offers (Includes Images)
```
GET /api/offers/active
Authentication: Not required

Response includes:
{
  "_id": "...",
  "title": "...",
  "bannerImage": "/uploads/offers/...",
  ...
}
```

## Future Enhancements
- Multiple images per offer (gallery)
- Image cropping/editing tool
- Lazy loading for better performance
- Image optimization on upload
- CDN integration for faster image delivery
- Image analytics (impressions, clicks)

## Support
For issues or questions about the offer system, please:
1. Check this guide
2. Review the API documentation
3. Check browser console for errors
4. Ensure all dependencies are installed
5. Verify MongoDB connection is working
