# Admin User Setup - MongoDB Compass

## Quick Admin User Creation

### Method 1: Use Pre-Hashed Password (Easiest)

**Email:** admin@manika.com
**Password:** manika93057
**Hash:** $2a$10$Jxop8DYVxwnXXr4ZTyiKIuBM5aGs0oXMwNuErxkvW3eMnkId7Z4RK

In MongoDB Compass:
1. Go to `admins` collection
2. Click "Insert Document"
3. Paste:

```json
{
  "name": "Admin User",
  "email": "admin@manika.com",
  "password": "$2a$10$Jxop8DYVxwnXXr4ZTyiKIuBM5aGs0oXMwNuErxkvW3eMnkId7Z4RK",
  "role": "admin",
  "isActive": true,
  "lastLogin": new Date(),
  "createdAt": new Date()
}
```

4. Click "Insert"

---

## Method 2: Generate Your Own Password Hash

### Using Online Tool
1. Go to: https://bcrypt-generator.com/
2. Enter password: `manika93057`
3. Set rounds: `10`
4. Copy the generated hash
5. Replace in the JSON above

### Using Node.js
```javascript
// Save this as hash.js and run: node hash.js

const bcrypt = require('bcryptjs');

const password = 'manika93057';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) console.error(err);
  console.log('Hash:', hash);
  process.exit(0);
});
```

Run:
```bash
cd server
npm install bcryptjs
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('manika93057', 10, (err, hash) => { console.log(hash); });"
```

---

## Method 3: Use API Endpoint (After Backend is Running)

First, make sure backend is running:
```bash
npm run dev
```

Then in PowerShell:
```powershell
$body = @{
    name = "Admin User"
    email = "admin@manika.com"
    password = "manika93057"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

Then login:
```powershell
$body = @{
    email = "admin@manika.com"
    password = "manika93057"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

---

## Verify Admin User

After inserting, you should see in MongoDB Compass:

```
admins collection:
├─ _id: ObjectId
├─ name: "Admin User"
├─ email: "admin@manika.com"
├─ password: "$2a$10$..." (hashed)
├─ role: "admin"
├─ isActive: true
├─ lastLogin: Date
└─ createdAt: Date
```

---

## Login Test

1. Frontend: http://localhost:3000/admin/login
2. Email: `admin@manika.com`
3. Password: `manika93057`
4. Click "Login"

Should redirect to: http://localhost:3000/admin/dashboard

---

## Create Multiple Admin Users

Repeat the process for each admin:

```json
{
  "name": "Super Admin",
  "email": "superadmin@example.com",
  "password": "$2a$10$N9x8wL7vK6jM5iO4pQ3rS2TuVwXyZaAbCdEfGhIjKlMnOpQrStUvWx",
  "role": "superadmin",
  "isActive": true,
  "lastLogin": new Date(),
  "createdAt": new Date()
}
```

---

## Troubleshooting

### Login Not Working
- Check password hash is correct
- Verify email matches exactly
- Try clearing browser cache
- Check backend console for errors

### "User not found" Error
- Verify admin user exists in MongoDB Compass
- Check email spelling exactly matches
- Make sure insert was successful (got green checkmark)

### "Incorrect password" Error
- Verify hash is correct
- Try regenerating hash
- Make sure you copied full hash

---

**Admin user is now ready to use! 🔐**
