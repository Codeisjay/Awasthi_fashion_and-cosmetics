# 📚 OFFER SYSTEM - QUICK REFERENCE

## 🚀 Quick Start

### 1. Access Admin Offers Dashboard
```
URL: /admin/offers
Auth: Admin login required
```

### 2. Create First Offer
- Click "New Offer"
- Fill in details
- Click "Create Offer"

### 3. View Offers Homepage
- Offers automatically appear in banners
- Countdowns display automatically
- Badges show on products

---

## 📡 API QUICK COMMANDS

### Get Active Offers
```bash
curl http://localhost:5000/api/offers/active
```

### Get Offers for Product
```bash
curl http://localhost:5000/api/offers/product/{PRODUCT_ID}
```

### Validate Coupon
```bash
curl -X POST http://localhost:5000/api/offers/validate-coupon \
  -H "Content-Type: application/json" \
  -d '{"couponCode":"SUMMER50","cartTotal":5000}'
```

### Create Offer (Admin)
```bash
curl -X POST http://localhost:5000/api/offers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "title":"50% Off Sale",
    "offerType":"percentage",
    "discountType":"percentage",
    "discountValue":50,
    "startDate":"2025-06-01",
    "endDate":"2025-08-31",
    "priority":50
  }'
```

### Delete Offer (Admin)
```bash
curl -X DELETE http://localhost:5000/api/offers/{OFFER_ID} \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 🎯 Offer Type Reference

| Type | Best For | Example |
|------|----------|---------|
| **Festive** | Special occasions | Diwali, Holi, Black Friday |
| **Percentage** | General discounts | 25% OFF, 50% OFF |
| **Fixed** | Specific amounts | ₹500 OFF, ₹1000 OFF |
| **BOGO** | Volume deals | Buy 1 Get 1 Free |
| **Seasonal** | Season-based | Summer Sale, Winter Sale |
| **Flash** | Time-limited | 2 Hour Flash Deal |
| **Category** | Specific categories | 20% OFF Beauty Products |
| **Product** | Specific products | Premium item discount |

---

## 🎨 Component Usage

### Use OfferBanner on Homepage
```jsx
import OfferBanner from './components/OfferBanner';

function HomePage() {
  return (
    <>
      <OfferBanner />
      {/* Rest of page */}
    </>
  );
}
```

### Use OfferBadge on Product Cards
```jsx
import OfferBadge from './components/OfferBadge';

function ProductCard({ product, offer }) {
  return (
    <div>
      {offer && <OfferBadge offer={offer} compact={true} />}
      <h3>{product.title}</h3>
    </div>
  );
}
```

### Use CountdownTimer on Product Page
```jsx
import CountdownTimer from './components/CountdownTimer';

function ProductPage({ offer }) {
  return (
    <>
      <CountdownTimer endDate={offer.endDate} offerTitle={offer.title} />
    </>
  );
}
```

---

## 📊 Admin Dashboard Features

### Analytics Cards
- Active Offers Count
- Total Clicks
- Total Conversions  
- Total Revenue

### Offer Management
- ✅ Create offers
- ✅ Edit offers
- ✅ Delete offers
- ✅ Toggle active/inactive
- ✅ Filter by type
- ✅ Sort by priority/date

---

## 🔄 Common Tasks

### Task 1: Create Diwali Sale
1. Go to `/admin/offers`
2. Click "New Offer"
3. Fill:
   - Title: "Diwali Mega Sale"
   - Type: Festive
   - Discount: 70%
   - Coupon: DIWALI70
   - Start: 2025-10-15
   - End: 2025-11-15
   - Priority: 100
   - Display: Hero
4. Click "Create Offer"

### Task 2: Create Flash Sale
1. Title: "2 Hour Flash Sale"
2. Type: Flash
3. Discount: 60%
4. Coupon: FLASH60
5. Start: Today + 1 hour
6. End: Today + 3 hours
7. Priority: 100
8. Display: Popup

### Task 3: Apply Category Offer
1. Title: "Beauty Bonanza"
2. Type: Category
3. Discount: 30%
4. Categories: Beauty, Cosmetics
5. Coupon: BEAUTY30

---

## ✅ Validation Rules

| Field | Rule |
|-------|------|
| Discount % | 0-100 |
| Fixed Amount | > 0 |
| Start Date | Must be before End Date |
| End Date | Must be after Start Date |
| Priority | 0-100 (higher = better) |
| Coupon Code | Must be unique |
| Title | Max 100 characters |
| Description | Max 500 characters |

---

## 🎯 Priority Scale

```
Flash Sale:      100 (Highest Priority)
Festive Sale:    50
Seasonal Sale:   10  
Regular Sale:    0   (Lowest Priority)
```

---

## 💡 Pro Tips

1. **Use High Priority for Flash Sales** - Set priority to 100
2. **Set Display Position** - Hero for main banners, Popup for urgent
3. **Use Coupon Codes** - Makes tracking easier
4. **Set Minimum Purchase** - Avoid unprofitable orders
5. **Use Maximum Discount** - Cap maximum discount for high-price items
6. **Schedule in Advance** - Create offers ahead of campaigns
7. **Monitor Analytics** - Check which offers convert best
8. **Auto-expiry Works** - Offers automatically expire after end date

---

## 🐛 Troubleshooting

### Offer Not Showing
- Check if offer is active (toggle status)
- Check dates are correct
- Check if within date range
- Check product/category applicability

### Coupon Not Validating
- Check coupon code spelling (uppercase)
- Check offer is active
- Check dates are valid
- Check minimum purchase requirement
- Check usage limit

### Discount Not Calculating
- Check discount value is set
- Check discount type (percentage/fixed)
- Check if offer is within date range
- Check maximum discount cap

---

## 📞 Support

**Files Reference:**
- Models: `server/models/Offer.js`, `server/models/Product.js`
- Controllers: `server/controllers/offerController.js`
- Services: `server/services/offerService.js`
- Routes: `server/routes/offerRoutes.js`
- Components: `client/src/components/OfferBanner.jsx`, etc.
- Admin: `client/src/dashboard/AdminOffers.jsx`

**Full Documentation:**
- Read: `OFFER_SYSTEM_GUIDE.md`
- Implementation: `OFFER_SYSTEM_IMPLEMENTATION.md`

---

## 📱 Mobile Optimizations

- Responsive banners
- Compact timer for small screens
- Touch-friendly buttons
- Mobile-optimized images

---

## 🔒 Security Checklist

- ✅ Admin routes protected
- ✅ Input validation
- ✅ Date validation
- ✅ Coupon uniqueness
- ✅ Usage limit enforcement
- ✅ Minimum purchase validation
- ✅ Authentication required

---

## 🎓 Learning Path

1. **Start**: Read `OFFER_SYSTEM_GUIDE.md`
2. **Understand**: Review models and controllers
3. **Implement**: Create your first offer
4. **Monitor**: Check analytics
5. **Optimize**: Adjust based on performance

---

**Last Updated**: May 23, 2025
**Version**: 1.0.0
**Status**: ✅ Ready for Production
