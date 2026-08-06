import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export const getAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) return `${ASSET_BASE_URL}${url}`;
  if (url.startsWith('uploads/')) return `${ASSET_BASE_URL}/${url}`;
  return url;
};

// Initialize session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// ═══════════════════════════════════════════════════════════════
// REQUEST ID TRACKING
// ═══════════════════════════════════════════════════════════════
let requestIdCounter = 0;
const generateRequestId = () => ++requestIdCounter;

// ═══════════════════════════════════════════════════════════════
// TRACKING REQUEST DELAY
// ═══════════════════════════════════════════════════════════════
const delayTrackingRequest = (config) => {
  // Simple delay: wait 500ms before allowing request through
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[${config.requestId}] Tracking request ready to send`);
      resolve();
    }, 500);
  });
};

// ═══════════════════════════════════════════════════════════════
// CREATE AXIOS INSTANCE
// ═══════════════════════════════════════════════════════════════
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for all requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// ═══════════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR - Add token and request ID
// ═══════════════════════════════════════════════════════════════
apiClient.interceptors.request.use((config) => {
  // Generate request ID for tracking
  const requestId = generateRequestId();
  config.headers['X-Request-ID'] = requestId;
  config.requestId = requestId;
  
  // Add token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log request (only in development)
  if (import.meta.env.DEV) {
    const isTrackingRequest = config.url.includes('/track/');
    const logMessage = `[${config.requestId}] ${config.method.toUpperCase()} ${config.url}`;
    if (isTrackingRequest) {
      console.log(`${logMessage} (TRACKING REQUEST)`);
      console.log(`[${config.requestId}] Data:`, config.data);
    } else {
      console.log(logMessage);
    }
  }
  
  // Delay tracking requests
  if (config.url.includes('/track/')) {
    return delayTrackingRequest(config).then(() => config);
  }
  
  return config;
}, (error) => {
  console.error('[REQUEST ERROR]', error);
  return Promise.reject(error);
});

// ═══════════════════════════════════════════════════════════════
// RESPONSE INTERCEPTOR - Enhanced error handling
// ═══════════════════════════════════════════════════════════════
apiClient.interceptors.response.use(
  (response) => {
    // Log response (only in development)
    if (import.meta.env.DEV) {
      const isTrackingResponse = response.config?.url?.includes('/track/');
      const logMessage = `[${response.config?.requestId}] ${response.status} OK (${response.statusText})`;
      if (isTrackingResponse) {
        console.log(`${logMessage} (TRACKING RESPONSE)`);
        console.log(`[${response.config?.requestId}] Response Data:`, response.data);
      } else {
        console.log(logMessage);
      }
    }
    return response;
  },
  (error) => {
    const requestId = error.config?.requestId || 'UNKNOWN';
    const isTrackingError = error.config?.url?.includes('/track/');
    
    // Enhance error message
    if (error.response?.data?.message) {
      if (Array.isArray(error.response.data.message)) {
        error.response.data.message = error.response.data.message.join(', ');
      }
    }
    
    // Log error (only in development)
    if (import.meta.env.DEV) {
      if (isTrackingError) {
        console.error(`\n╔════════════════════════════════════════════════════════╗`);
        console.error(`║     [${requestId}] TRACKING REQUEST ERROR          ║`);
        console.error(`╚════════════════════════════════════════════════════════╝`);
        console.error(`Status: ${error.response?.status || 'NETWORK ERROR'}`);
        console.error(`Message: ${error.response?.data?.message || error.message}`);
        console.error(`Code: ${error.code}`);
        console.error(`Full Error:`, error.response?.data || error);
      } else {
        console.error(`[${requestId}] ${error.response?.status || 'NETWORK'} ERROR`, {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          code: error.code
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Product Services
export const productService = {
  getProducts: (category, search, page = 1, limit = 12) =>
    apiClient.get('/products', {
      params: { category, search, page, limit }
    }),
  getProduct: (id) => apiClient.get(`/products/${id}`),
  createProduct: (data) => {
    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║         [API SERVICE] CREATE PRODUCT              ║');
    console.log('╚═══════════════════════════════════════════════════╝');
    console.log('[API SERVICE] data parameter received:', data);
    console.log('[API SERVICE] data type:', typeof data);
    console.log('[API SERVICE] data.price:', data.price);
    console.log('[API SERVICE] typeof data.price:', typeof data.price);
    console.log('[API SERVICE] "price" in data:', 'price' in data);
    console.log('[API SERVICE] Object.keys(data):', Object.keys(data));
    
    // **CRITICAL**: Verify it's NOT FormData
    console.log('[API SERVICE] Is FormData?', data instanceof FormData);
    console.log('[API SERVICE] Is plain object?', data.constructor.name === 'Object');
    
    // **ENSURE PRICE IS INCLUDED**: Create new object with explicit type conversion
    const sanitizedData = {
      ...data,
      price: data.price !== undefined ? Number(data.price) : data.price
    };
    
    console.log('[API SERVICE] Sanitized data.price:', sanitizedData.price);
    console.log('[API SERVICE] Sanitized typeof price:', typeof sanitizedData.price);
    console.log('[API SERVICE] JSON.stringify(sanitizedData):', JSON.stringify(sanitizedData, null, 2));
    
    console.log('[API SERVICE] Making POST request to /products');
    console.log('[API SERVICE] Calling: apiClient.post("/products", sanitizedData)');
    
    return apiClient.post('/products', sanitizedData);
  },
  updateProduct: (id, data) => {
    console.log('[API SERVICE] updateProduct called with ID:', id, 'data:', data);
    return apiClient.put(`/products/${id}`, data);
  },
  deleteProduct: (id) => apiClient.delete(`/products/${id}`)
};

// Auth Services
export const authService = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  register: (name, email, password) =>
    apiClient.post('/auth/register', { name, email, password }),
  getMe: () => apiClient.get('/auth/me')
};

// User Auth Services (Google OAuth)
export const userAuthService = {
  googleLogin: (googleId, email, name, profileImage) =>
    apiClient.post('/auth/google', {
      googleId,
      email,
      name,
      profileImage
    }),
  getUserMe: () => apiClient.get('/auth/user/me'),
  logoutUser: () => apiClient.post('/auth/user/logout')
};

export const trackingService = {
  trackVisit: (page) => {
    const sessionId = getSessionId();
    const deviceInfo = getDeviceInfo();
    const payload = {
      sessionId,
      page,
      ...deviceInfo
    };
    console.log('[API] trackVisit payload:', JSON.stringify(payload, null, 2));
    return apiClient.post('/track/visit', payload);
  },
  trackClick: (productId) => {
    const sessionId = getSessionId();
    const deviceInfo = getDeviceInfo();
    const payload = {
      productId,
      sessionId,
      ...deviceInfo
    };
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║         [API SERVICE] Track Click Request            ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('[API] Product ID:', productId);
    console.log('[API] Session ID:', sessionId);
    console.log('[API] Device Info:', JSON.stringify(deviceInfo, null, 2));
    console.log('[API] Full payload:', JSON.stringify(payload, null, 2));
    console.log('[API] Request will be sent to:', apiClient.defaults.baseURL + '/track/click\n');
    
    return apiClient.post('/track/click', payload)
      .then(response => {
        console.log('[API] ✅ trackClick response:', JSON.stringify(response.data, null, 2));
        return response;
      })
      .catch(error => {
        console.error('[API] ❌ trackClick error:', {
          status: error.response?.status,
          message: error.response?.data?.message,
          error: error.message
        });
        throw error;
      });
  },
  getProductClicks: (productId) =>
    apiClient.get(`/track/clicks/${productId}`)
};

// Analytics Services
export const analyticsService = {
  getOverview: () => apiClient.get('/analytics/overview'),
  getTraffic: (days = 30) =>
    apiClient.get('/analytics/traffic', { params: { days } }),
  getProductAnalytics: (days = 30) =>
    apiClient.get('/analytics/products', { params: { days } }),
  getUserAnalytics: (days = 30) =>
    apiClient.get('/analytics/users', { params: { days } })
};

// ML Services
export const mlService = {
  getRecommendations: () => apiClient.get('/ml/recommendations'),
  getTrending: () => apiClient.get('/ml/trending'),
  getDemandAnalysis: () => apiClient.get('/ml/demand-analysis'),
  updatePrediction: (productId, data) =>
    apiClient.post(`/ml/predictions/${productId}`, data)
};

// Offer Services
export const offerService = {
  // Public endpoints
  getActiveOffers: () => apiClient.get('/offers/active'),
  getOffersForProduct: (productId) =>
    apiClient.get(`/offers/product/${productId}`),
  getOffersForCategory: (category) =>
    apiClient.get(`/offers/category/${category}`),
  validateCoupon: (couponCode, cartTotal) =>
    apiClient.post('/offers/validate-coupon', { couponCode, cartTotal }),
  applyOffer: (offerId, productId, quantity) =>
    apiClient.post('/offers/apply', { offerId, productId, quantity }),

  // Admin endpoints
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/offers/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  createOffer: (data) => apiClient.post('/offers', data),
  getAllOffers: (filters) =>
    apiClient.get('/offers', { params: filters }),
  getOfferById: (id) => apiClient.get(`/offers/${id}`),
  updateOffer: (id, data) => apiClient.put(`/offers/${id}`, data),
  deleteOffer: (id) => apiClient.delete(`/offers/${id}`),
  toggleOfferStatus: (id) =>
    apiClient.patch(`/offers/${id}/toggle-status`),
  recordConversion: (offerId, revenue) =>
    apiClient.post(`/offers/record-conversion/${offerId}`, { revenue }),
  getOfferAnalytics: () => apiClient.get('/offers/analytics'),
  autoExpireOffers: () =>
    apiClient.post('/offers/admin/auto-expire'),
  autoActivateScheduled: () =>
    apiClient.post('/offers/admin/auto-activate')
};

export const postService = {
  getPosts: () => apiClient.get('/posts'),
  getPostById: (id) => apiClient.get(`/posts/${id}`),
  addComment: (postId, commentText, name, profileImage) =>
    apiClient.post(`/posts/${postId}/comments`, { commentText, name, profileImage }),
  createPost: (data) => apiClient.post('/posts', data),
  getAdminPosts: () => apiClient.get('/posts/admin'),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/posts/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deletePost: (id) => apiClient.delete(`/posts/${id}`)
};

// Utility function to get device info
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let device = 'desktop';
  let browser = 'Unknown';

  if (/mobile/i.test(userAgent)) device = 'mobile';
  else if (/tablet/i.test(userAgent)) device = 'tablet';

  if (/Chrome/i.test(userAgent)) browser = 'Chrome';
  else if (/Safari/i.test(userAgent)) browser = 'Safari';
  else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
  else if (/Edge/i.test(userAgent)) browser = 'Edge';

  return { device, browser, userAgent };
};

export default apiClient;
