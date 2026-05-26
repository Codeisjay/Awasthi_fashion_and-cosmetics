# Click Tracking - Step-by-Step Debugging Guide

## Quick Test (Do This First!)

### Step 1: Test if Server is Receiving Requests

Open browser console and run:
```javascript
fetch('http://localhost:5000/api/track/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'hello', timestamp: new Date() })
})
.then(r => r.json())
.then(data => console.log('✅ Server responded:', data))
.catch(e => console.error('❌ Request failed:', e.message))
```

**Expected Output in Console:**
```
✅ Server responded: {success: true, message: 'Test endpoint is working!', ...}
```

**Expected Output in Server Logs:**
```
╔════════════════════════════════════════════════════════════════════════╗
║          [TEST ENDPOINT] Request Received            ║
╚════════════════════════════════════════════════════════════════════════╝
[Test] Request body: {test: 'hello', timestamp: '...'}
```

---

## If Test Endpoint Works: Debug Click Tracking

### Step 2: Check Browser Console When Clicking Product

1. **Refresh browser** to load latest code
2. **Open browser DevTools (F12)** → Console tab
3. **Click any product**
4. **Look for these logs** (in order):

```
╔════════════════════════════════════════════════════════════════════════╗
║         [API SERVICE] Track Click Request            ║
╚════════════════════════════════════════════════════════════════════════╝
[API] Product ID: 6a159dffaa14067144le1dcf
[API] Session ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
[API] Device Info: {device: 'desktop', browser: 'Chrome', userAgent: '...'}
[API] Full payload: {...}
[API] Request will be sent to: http://localhost:5000/api/track/click

[5] POST /track/click (TRACKING REQUEST)
[5] Data: {productId: '...', sessionId: '...', device: 'desktop', browser: 'Chrome'}

[5] 201 OK (Created) (TRACKING RESPONSE)
[5] Response Data: {success: true, message: 'Click tracked successfully', ...}
```

### Step 3: Check Server Console

Look for:
```
╔════════════════════════════════════════════════════════════════════════╗
║          [TRACKING CLICK] Request Received            ║
╚════════════════════════════════════════════════════════════════════════╝
[Tracking] Full request body: {
  productId: '...',
  sessionId: '...',
  device: 'desktop',
  browser: 'Chrome',
  ...
}
[Tracking] Database connection state: 1 (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)
[Tracking] Attempting to create click event...
[Tracking] ✅ Click event created successfully
[Tracking] ✅ Product clicks updated from 0 to 1
```

---

## Troubleshooting

### Issue 1: Test Endpoint Returns Error

**Problem**: Test endpoint POST fails
```
❌ Request failed: Failed to fetch
```

**Diagnosis**: 
- Is server running? Check terminal running `npm run dev --prefix server`
- Is CORS blocking the request? Check browser DevTools Network tab
- Wrong backend URL? Check `.env` file `VITE_API_URL`

**Solution**:
- Make sure server is running on port 5000
- Check `VITE_API_URL` environment variable
- Check CORS settings in `server/server.js`

---

### Issue 2: Browser Console Shows No Tracking Logs

**Problem**: Click doesn't trigger any tracking logs

**Diagnosis**:
- Is the browser showing the new code? (Check for `[API SERVICE] Track Click Request`)
- Did you reload the page after code changes?
- Is the click handler even running?

**Solution**:
1. Hard reload: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
2. Clear browser cache: DevTools → Application → Clear Storage
3. Check browser console for any JavaScript errors

---

### Issue 3: Browser Shows Tracking Logs but Server Shows No Logs

**Problem**: 
- Browser console shows `[5] POST /track/click` 
- Server console has no `[TRACKING CLICK]` logs

**Diagnosis**: Request is sent but not reaching the server
- Network proxy/firewall blocking?
- CORS error preventing actual request?
- Wrong backend URL?

**Solution**:
1. Check Network tab in DevTools - is the POST request showing?
2. What's the response status? 200? 404? 403? 500?
3. Check CORS errors in Network tab Details
4. Verify `VITE_API_URL` points to correct server

---

### Issue 4: Server Shows Error in Logs

**Problem**: Server logs show `[Tracking] ❌ Error...`

**Common Errors**:

**Missing productId:**
```
[Tracking] ❌ Missing productId in request body
```
→ Check if product._id is being sent correctly

**Database Connection (state 0):**
```
[Tracking] Database connection state: 0
```
→ MongoDB isn't connected. Check `MONGODB_URI` in `.env`

**Product Not Found:**
```
[Tracking] ⚠️ Product not found for ID: 6a159dffaa14067144le1dcf
```
→ Product ID doesn't exist in database. Check if product was created successfully.

**Validation Error:**
```
error: {
  kind: 'ObjectId',
  value: 'invalid-id',
  ...
}
```
→ Product ID format is invalid. Should be MongoDB ObjectId format.

---

## Step-by-Step Manual Testing

### Via Browser Console (Recommended)

```javascript
// Step 1: Get a valid product ID
// Go to /products page, click a product, check the URL or inspect the element

// Step 2: Test tracking with real product ID
const productId = '6a159dffaa14067144le1dcf'; // Replace with actual product ID from your DB
const sessionId = localStorage.getItem('sessionId'); // Get existing session

fetch('http://localhost:5000/api/track/click', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId,
    sessionId,
    device: 'desktop',
    browser: 'Chrome',
    userAgent: navigator.userAgent
  })
})
.then(r => r.json())
.then(data => {
  console.log('Response:', data);
  if (data.success) {
    console.log('✅ Click tracked!');
    console.log('Product now has', data.verification.productClicks, 'clicks');
  } else {
    console.error('❌ Tracking failed:', data.message);
  }
})
.catch(e => console.error('❌ Error:', e.message))
```

### Via cURL (If you have curl installed)

```bash
# Get a valid product ID first
PRODUCT_ID="6a159dffaa14067144le1dcf"  # Replace with actual ID
SESSION_ID=$(node -e "console.log(require('uuid').v4())")

curl -X POST http://localhost:5000/api/track/click \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"sessionId\": \"$SESSION_ID\",
    \"device\": \"desktop\",
    \"browser\": \"Chrome\"
  }"
```

---

## Verification Checklist

After you see successful logs, verify:

1. **Database verification** - Run diagnostic script:
   ```bash
   node server/utils/testMLTrigger.js
   ```
   Should show: `Total Clicks: X` (higher than before)

2. **Dashboard check** - Refresh admin dashboard
   - "Total Clicks" card should show a number
   - "Most clicked product" should populate

3. **ML Insights** - Go to ML Insights page
   - Should see trending products
   - Should see demand analysis
   - If not, manually trigger: POST `/api/ml/generate`

---

## Getting Help

If still not working, collect this information:

1. **Server logs** when clicking product (copy-paste the `[TRACKING CLICK]` section)
2. **Browser console logs** (F12 → Console)
3. **Browser Network tab** (F12 → Network) - check the POST `/track/click` request
   - What's the status code?
   - What's in the Response?
   - Any CORS errors?
4. **Environment info**:
   - What's your `VITE_API_URL`?
   - What's your `MONGODB_URI`?
   - Is server on localhost:5000?
   - Is MongoDB connected?

Then share all this information for faster debugging!
