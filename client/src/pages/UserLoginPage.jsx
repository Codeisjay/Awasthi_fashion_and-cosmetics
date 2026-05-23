import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';

const UserLoginPage = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, isAuthenticated, userType } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && userType === 'user') {
      navigate('/');
    }
  }, [isAuthenticated, userType, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // Get user info from Google
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credentialResponse.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${credentialResponse.access_token}`
          }
        }
      );
      const profile = await response.json();

      // Login with backend
      await loginWithGoogle(profile.id, profile.email, profile.name, profile.picture);

      setToast({
        type: 'success',
        message: `Welcome, ${profile.name}!`
      });

      // Redirect to home
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Login failed:', error);
      setToast({
        type: 'error',
        message: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setToast({
        type: 'error',
        message: 'Google login failed'
      });
    },
    flow: 'implicit'
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
          <p className="text-gray-600 mt-2">Sign in to continue shopping</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="8"
                fill="currentColor"
              >
                G
              </text>
            </svg>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            Shopping made easy with secure Google authentication
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-4 text-xs text-gray-500">
          <a href="/" className="hover:text-gray-700">
            Continue as Guest
          </a>
          <span>•</span>
          <a href="/admin/login" className="hover:text-gray-700">
            Admin Portal
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
