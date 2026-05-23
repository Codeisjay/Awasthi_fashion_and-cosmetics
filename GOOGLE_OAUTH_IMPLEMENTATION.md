# Google OAuth Login Implementation - Complete Setup

## ✅ Backend Components Created

### 1. User Model (`server/models/User.js`)
- Stores user information from Google OAuth
- Fields: name, email, googleId, profileImage, loginMethod, isActive, lastLogin
- Email and googleId are unique constraints

### 2. Google Auth Controller (`server/controllers/googleAuthController.js`)
- **googleLogin**: Handles user login/registration with Google
- **getUserMe**: Retrieves current logged-in user
- **logoutUser**: User logout endpoint
- Automatically creates or updates users based on Google profile

### 3. User Auth Routes (`server/routes/userAuthRoutes.js`)
- `POST /api/auth/google` - Login with Google
- `GET /api/auth/user/me` - Get current user (protected)
- `POST /api/auth/user/logout` - Logout (protected)

### 4. Updated Auth Middleware (`server/middleware/auth.js`)
- Now supports both Admin and User authentication
- Automatically detects token type ('admin' or 'user')
- Fetches appropriate model based on token type

### 5. Server Routes Registration
- Added user auth routes to server.js
- Routes available at `/api/auth` endpoints

---

## ✅ Frontend Components Created

### 1. User Login Page (`client/src/pages/UserLoginPage.jsx`)
- Google OAuth login interface
- Handles token exchange and user registration
- Redirects to home after successful login
- Shows success/error toasts

### 2. Google Login Button Component (`client/src/components/GoogleLoginButton.jsx`)
- Reusable button component for Google login
- Can be used on multiple pages

### 3. Updated AuthContext (`client/src/context/AuthContext.jsx`)
- New `loginWithGoogle` method
- Tracks `userType` ('admin' or 'user')
- Maintains user data for logged-in users
- Stores authentication type in localStorage

### 4. Updated API Services (`client/src/services/api.js`)
- New `userAuthService` with Google login endpoints
- Methods: `googleLogin`, `getUserMe`, `logoutUser`

---

## 🔧 Setup Instructions

### Step 1: Install Frontend Package
```bash
cd client
npm install @react-oauth/google
```

### Step 2: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 Web Application credentials
5. Add authorized origins and redirect URIs
6. Copy your Client ID

### Step 3: Create Environment File
Create `client/.env.local`:
```
VITE_GOOGLE_CLIENT_ID=your-client-id-here
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Update Frontend Entry Point
Update `client/src/main.jsx`:
```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
```

### Step 5: Update App Routes
Add the user login page route in `client/src/App.jsx`:
```jsx
import UserLoginPage from './pages/UserLoginPage';

// In your Routes component:
<Route path="/login" element={<UserLoginPage />} />
```

### Step 6: Restart Services
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

---

## 🎯 API Endpoints

### User Authentication

#### Google Login (Public)
```http
POST /api/auth/google
Content-Type: application/json

{
  "googleId": "118123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "profileImage": "https://lh3.googleusercontent.com/..."
}

Response (201):
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com",
    "profileImage": "https://...",
    "loginMethod": "google",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Current User (Protected)
```http
GET /api/auth/user/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com",
    "profileImage": "https://...",
    "loginMethod": "google",
    "lastLogin": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Logout (Protected)
```http
POST /api/auth/user/logout
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📊 Database Structure

### Users Collection
```
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "googleId": "118123456789",
  "profileImage": "https://lh3.googleusercontent.com/...",
  "loginMethod": "google",
  "isActive": true,
  "lastLogin": ISODate("2024-01-15T10:30:00Z"),
  "createdAt": ISODate("2024-01-15T10:00:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

---

## 🔐 Authentication Flow

1. User clicks "Sign in with Google"
2. Google OAuth dialog opens
3. User authorizes the app
4. Frontend receives Google credentials
5. Frontend calls `POST /api/auth/google` with user info
6. Backend checks if user exists:
   - If exists: updates lastLogin
   - If not exists: creates new user
7. Backend generates JWT token
8. Frontend stores token in localStorage
9. User is redirected to home page
10. AuthContext tracks user as 'user' type

---

## 🔗 Related Files Changed

- `server/server.js` - Added user auth routes import and registration
- `server/middleware/auth.js` - Updated to support both user and admin tokens
- `client/src/services/api.js` - Added userAuthService
- `client/src/context/AuthContext.jsx` - Added Google login support
- `client/src/hooks/useAuth.js` - Works with updated context

---

## 🚀 Testing

### Quick Test
1. Visit `http://localhost:3000/login`
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. Should see success message and redirect to home
5. Check localStorage for authToken

### API Testing with cURL
```bash
# Test Google login
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "googleId": "118123456789",
    "email": "test@example.com",
    "name": "Test User",
    "profileImage": "https://..."
  }'

# Get current user (replace TOKEN with actual JWT)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/auth/user/me
```

---

## ⚠️ Important Notes

1. **Client ID**: Keep your Google Client ID safe but it's okay to expose in frontend
2. **JWT Secret**: Keep `JWT_SECRET` in `.env` safe - never expose it
3. **CORS**: Backend CORS is configured for localhost:3000 by default
4. **Tokens**: JWTs are stored in localStorage (httpOnly cookies recommended in production)
5. **User Types**: System now distinguishes between 'admin' and 'user' login types
6. **Duplication**: Email can't be used for both admin and user accounts

---

## ✨ Features

✅ Google OAuth login for users
✅ Automatic user registration on first login
✅ User profile storage (name, email, picture)
✅ JWT token generation for sessions
✅ Protected endpoints with authentication
✅ Separate user and admin authentication
✅ Last login tracking
✅ User profile retrieval

---

## 📝 Next Steps

1. Install the `@react-oauth/google` package
2. Get Google OAuth credentials
3. Add environment variables
4. Update main.jsx with GoogleOAuthProvider
5. Update App.jsx with UserLoginPage route
6. Test the login flow
7. Update Navbar to show login/logout for users
8. Add user profile page
