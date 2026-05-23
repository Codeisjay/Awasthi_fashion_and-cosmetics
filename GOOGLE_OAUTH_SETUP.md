# Google OAuth Login Implementation

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application):
   - Authorized JavaScript origins: `http://localhost:3000`, `your-production-domain.com`
   - Authorized redirect URIs: `http://localhost:3000`, `your-production-domain.com`
5. Copy your **Client ID**

## Step 2: Install Frontend Package

```bash
cd client
npm install @react-oauth/google
```

## Step 3: Update Environment Variables

Create a `.env.local` file in the client folder:
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Update main.jsx

Add Google OAuth Provider wrapper:

```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <AuthProvider>
    <App />
  </AuthProvider>
</GoogleOAuthProvider>
```

## Step 5: Use Google Login in Components

```jsx
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from './hooks/useAuth';

const MyComponent = () => {
  const { loginWithGoogle } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Get user info from Google
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credentialResponse.access_token}`,
        { headers: { Authorization: `Bearer ${credentialResponse.access_token}` } }
      );
      const profile = await response.json();

      // Login with our backend
      await loginWithGoogle(
        profile.id,
        profile.email,
        profile.name,
        profile.picture
      );

      // Navigate or handle success
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.log('Login Failed'),
    flow: 'implicit'
  });

  return (
    <button onClick={() => googleLogin()}>
      Sign in with Google
    </button>
  );
};
```

## Backend Endpoints

### Google Login
**POST** `/api/auth/google`
```json
{
  "googleId": "user-google-id",
  "email": "user@example.com",
  "name": "User Name",
  "profileImage": "https://..."
}
```

Response:
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "profileImage": "https://...",
    "loginMethod": "google"
  }
}
```

### Get Current User
**GET** `/api/auth/user/me`
Headers: `Authorization: Bearer <token>`

### Logout
**POST** `/api/auth/user/logout`
Headers: `Authorization: Bearer <token>`

## Database Models

### User Model
- `name`: String
- `email`: String (unique)
- `googleId`: String (unique)
- `profileImage`: String
- `loginMethod`: 'google'
- `isActive`: Boolean
- `lastLogin`: Date
- `timestamps`: { createdAt, updatedAt }

## Testing

1. Start your backend: `npm run dev`
2. Start your frontend: `npm run dev`
3. Visit http://localhost:3000
4. Click "Sign in with Google"
5. Complete the Google OAuth flow
6. You should be logged in and see your profile

## Security Notes

- Never expose your Google Client Secret in frontend code
- Use HTTPS in production
- Validate tokens on the backend
- Store JWT tokens securely (httpOnly cookies recommended in production)
- Add rate limiting to auth endpoints
- Implement CSRF protection

## Troubleshooting

**Issue**: "Client ID not found"
- Make sure VITE_GOOGLE_CLIENT_ID is set correctly in `.env.local`
- Restart the dev server after changing env vars

**Issue**: "Redirect URI mismatch"
- Check Google Cloud Console settings
- Make sure your authorized redirect URIs match your app URL

**Issue**: "Token invalid after login"
- Check that JWT_SECRET in backend matches token generation
- Verify User model is created in MongoDB
