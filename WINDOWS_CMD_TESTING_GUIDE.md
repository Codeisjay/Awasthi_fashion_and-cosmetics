# Local Testing Guide - Windows CMD

## Step 1: Create an Admin User

First, run the seed endpoint to create a test admin account:

```cmd
curl -X GET "http://localhost:5000/api/seed"
```

Expected response:
```json
{
  "success": true,
  "message": "Admin account created successfully",
  "admin": {
    "name": "Admin",
    "email": "admin@manika.com",
    "role": "admin"
  }
}
```

OR if admin already exists:
```json
{
  "success": true,
  "message": "Admin already exists",
  "admin": {
    "email": "admin@manika.com",
    "name": "Admin"
  }
}
```

---

## Step 2: Login to Get JWT Token

```cmd
curl -X POST "http://localhost:5000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@manika.com\",\"password\":\"manika93057\"}"
```

**Expected response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "_id": "...",
    "name": "Admin",
    "email": "admin@manika.com",
    "role": "admin"
  }
}
```

**Copy the `token` value** - you'll use this in the next request.

---

## Step 3: Test Product Creation

Replace `YOUR_TOKEN_HERE` with the actual token from Step 2:

```cmd
curl -X POST "http://localhost:5000/api/products" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"title\":\"Test Product\",\"description\":\"This is a test product\",\"image\":\"https://example.com/test.jpg\",\"category\":\"Electronics\",\"meeshoLink\":\"https://meesho.com/product\",\"price\":191}"
```

**Expected response (SUCCESS ✓):**
```json
{
  "success": true,
  "product": {
    "_id": "...",
    "title": "Test Product",
    "description": "This is a test product",
    "image": "https://example.com/test.jpg",
    "category": "Electronics",
    "meeshoLink": "https://meesho.com/product",
    "price": 191,
    "originalPrice": null,
    "discountedPrice": null,
    "stockStatus": "in-stock",
    "isActive": true,
    "createdAt": "2026-05-26T..."
  }
}
```

---

## Complete Test Script (Windows CMD)

Save this as `test-product.bat`:

```batch
@echo off
setlocal enabledelayedexpansion

echo ============================================
echo STEP 1: Seed admin account
echo ============================================
curl -X GET "http://localhost:5000/api/seed"
pause

echo.
echo ============================================
echo STEP 2: Login to get token
echo ============================================
echo Login as: admin@manika.com / manika93057
echo.
for /f "delims=" %%i in ('curl -s -X POST "http://localhost:5000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@manika.com\",\"password\":\"manika93057\"}" ^
  ^| findstr "token"') do set TOKEN=%%i

echo Retrieved token (first 50 chars):
echo !TOKEN:~0,50!...
echo.
echo ============================================
echo STEP 3: Test product creation
echo ============================================

curl -X POST "http://localhost:5000/api/products" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer !TOKEN!" ^
  -d "{\"title\":\"Test Product\",\"description\":\"This is a test\",\"image\":\"https://example.com/test.jpg\",\"category\":\"Electronics\",\"meeshoLink\":\"https://meesho.com\",\"price\":191}"

pause
```

Run it: `test-product.bat`

---

## Manual Testing Steps (Recommended for Debugging)

### Step 1: Start server
```cmd
npm run start
```

### Step 2: In another CMD window, seed admin
```cmd
curl -X GET "http://localhost:5000/api/seed"
```

### Step 3: Login (copy the token value)
```cmd
curl -X POST "http://localhost:5000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@manika.com\",\"password\":\"manika93057\"}"
```

### Step 4: Create product (use token from Step 3)
```cmd
curl -X POST "http://localhost:5000/api/products" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." ^
  -d "{\"title\":\"Test\",\"description\":\"Test\",\"image\":\"https://example.com/test.jpg\",\"category\":\"Electronics\",\"meeshoLink\":\"https://meesho.com\",\"price\":191}"
```

---

## Windows CMD Syntax Notes

✅ **Correct (Windows CMD):**
- Use `^` at end of line to continue
- Use `"` to wrap URL
- Use `\"` to escape quotes in JSON
- Single line OR multi-line with `^`

❌ **Incorrect (Linux Bash):**
- Backslash `\` doesn't work for line continuation in Windows CMD
- Works in PowerShell but different syntax

---

## Debugging: Response Messages

| Response | Meaning | Solution |
|----------|---------|----------|
| `"Not authorized to access this route"` | Token is missing or invalid | Use correct token from login |
| `"Invalid JSON in request body"` | JSON syntax error | Check quotes and escape characters |
| `"Title is required..."` | Missing required field | Add all required fields |
| `"Price must be a valid number"` | Price format wrong | Ensure price is number: `"price":191` |
| `"Product created successfully"` | ✓ SUCCESS | Product saved to DB! |

---

## What Each Endpoint Does

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/seed` | GET | None | Create test admin account |
| `/api/auth/login` | POST | None | Get JWT token for admin |
| `/api/products` | POST | Bearer token | Create new product |
| `/api/products` | GET | None | Get all products (public) |

---

## Expected Server Logs

When testing, you should see in server console:

```
[REQUEST] POST /api/products
[REQUEST] Content-Type: application/json
[REQUEST] Body fields: title, description, image, category, meeshoLink, price
[REQUEST] ✓ Price field detected: 191 (number)
[CREATE PRODUCT] Received data: { title: "Test Product...", category: "Electronics", price: 191, priceType: "number", allKeys: [...] }
[TIMING] Validation phase took 12ms
[TIMING] DB operation took 85ms
[TIMING] Total request time: 128ms
[CREATE PRODUCT] ✓ Product created successfully: 6655...
[TIMING] ✓ POST /api/products completed in 128ms
```

If you see these logs, the fix is working! ✓

---

## If Still Not Working

1. **Check MongoDB is running**
   ```cmd
   echo Test: does MongoDB connect?
   curl -X GET "http://localhost:5000/health"
   ```

2. **Check auth middleware**
   - Remove Authorization header to see if endpoint returns 401
   - If it doesn't, auth isn't being checked

3. **Check token validity**
   - Decode JWT at: https://jwt.io
   - Paste token, check `exp` (expiration)
   - Check `role` is `admin`

4. **Check server logs**
   - Look for error messages
   - Ensure no "Cannot find module" errors

---

## Example Complete Flow

```cmd
:: Terminal 1: Start server
npm run start

:: Terminal 2: Seed admin
curl -X GET "http://localhost:5000/api/seed"

:: Response: {"success":true,"message":"Admin account created successfully"}

:: Terminal 2: Login
curl -X POST "http://localhost:5000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@manika.com\",\"password\":\"manika93057\"}"

:: Response with token:
:: {"success":true,"token":"eyJhbGc...","admin":{...}}

:: Terminal 2: Create product (use token from above)
curl -X POST "http://localhost:5000/api/products" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer eyJhbGc..." ^
  -d "{\"title\":\"Test\",\"description\":\"Test\",\"image\":\"https://example.com/test.jpg\",\"category\":\"Electronics\",\"meeshoLink\":\"https://meesho.com\",\"price\":191}"

:: Response:
:: {"success":true,"product":{"_id":"...","title":"Test",...}}

:: ✓ SUCCESS! Product created!
```

