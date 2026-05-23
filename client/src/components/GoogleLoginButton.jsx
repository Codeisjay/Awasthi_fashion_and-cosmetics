import React, { useCallback } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const GoogleLoginButton = ({ onSuccess, onError, isLoading = false }) => {
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = useCallback(async () => {
    try {
      // This will open Google login in a new window/tab
      // You need to implement the Google OAuth flow
      // For now, showing how to call the backend
      
      if (typeof window !== 'undefined' && window.google) {
        // Google button is available
        const button = document.getElementById('google-login-button');
        if (button) {
          button.click();
        }
      } else {
        console.error('Google API not loaded');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (onError) onError(error);
    }
  }, [loginWithGoogle, onError]);

  return (
    <div className="w-full">
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700 disabled:opacity-50"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 7v10M7 12h10" strokeLinecap="round" />
        </svg>
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      
      {/* Hidden Google button for the actual authentication */}
      <div id="google-signin-container" className="hidden"></div>
    </div>
  );
};

export default GoogleLoginButton;
