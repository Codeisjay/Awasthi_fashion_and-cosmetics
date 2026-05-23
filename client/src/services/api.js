import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Initialize session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product Services
export const productService = {
  getProducts: (category, search, page = 1, limit = 12) =>
    apiClient.get('/products', {
      params: { category, search, page, limit }
    }),
  getProduct: (id) => apiClient.get(`/products/${id}`),
  createProduct: (data) => apiClient.post('/products', data),
  updateProduct: (id, data) => apiClient.put(`/products/${id}`, data),
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

// Tracking Services
export const trackingService = {
  trackVisit: (page) => {
    const sessionId = getSessionId();
    const deviceInfo = getDeviceInfo();
    return apiClient.post('/track/visit', {
      sessionId,
      page,
      ...deviceInfo
    });
  },
  trackClick: (productId) => {
    const sessionId = getSessionId();
    const deviceInfo = getDeviceInfo();
    return apiClient.post('/track/click', {
      productId,
      sessionId,
      ...deviceInfo
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
