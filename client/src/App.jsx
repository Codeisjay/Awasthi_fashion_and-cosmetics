import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { FormSubmissionProvider } from './context/FormSubmissionContext';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/Toast';

// User Pages
import Navbar from './components/Navbar';
import PromotionalBanner from './components/PromotionalBanner';
import { offerService } from './services/api';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import OffersPage from './pages/OffersPage';
import OfferDetailsPage from './pages/OfferDetailsPage';
import PostsPage from './pages/PostsPage';
import UserLoginPage from './pages/UserLoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './dashboard/AdminDashboard';
import AdminProducts from './dashboard/AdminProducts';
import AdminInsights from './dashboard/AdminInsights';
import AdminOffersPage from './pages/AdminOffersPage';
import AdminPostsPage from './pages/AdminPostsPage';

function App() {
  const [topOffers, setTopOffers] = useState([]);

  useEffect(() => {
    fetchTopOffers();
  }, []);

  const fetchTopOffers = async () => {
    try {
      const response = await offerService.getActiveOffers();
      if (response.data.offers) {
        // Get top 5 offers sorted by priority (for banner rotation)
        const topOffer = response.data.offers
          .sort((a, b) => b.priority - a.priority)
          .slice(0, 5);
        setTopOffers(topOffer);
      }
    } catch (err) {
      console.error('Failed to load top offers:', err);
    }
  };

  return (
    <Router>
      <AuthProvider>
        <FormSubmissionProvider>
          <NotificationProvider>
            <ToastContainer />
          <Routes>
            {/* User Routes */}
            <Route
              path="/*"
              element={
                <>
                  {topOffers.length > 0 && <PromotionalBanner offers={topOffers} />}
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/offers" element={<OffersPage />} />
                    <Route path="/offers/:id" element={<OfferDetailsPage />} />
                    <Route path="/posts" element={<PostsPage />} />
                    <Route path="/login" element={<UserLoginPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                  </Routes>
                </>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/offers"
              element={
                <ProtectedRoute>
                  <AdminOffersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts"
              element={
                <ProtectedRoute>
                  <AdminPostsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/insights"
              element={
                <ProtectedRoute>
                  <AdminInsights />
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </NotificationProvider>
        </FormSubmissionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
