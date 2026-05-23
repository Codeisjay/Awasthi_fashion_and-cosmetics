import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, LogIn, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>Awasthi Fashions & Cosmetics</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition">
              Products
            </Link>
            <Link to="/offers" className="text-gray-700 hover:text-blue-600 transition font-semibold">
              Offers
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-gray-300 pl-8">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 font-semibold">{user?.name}</span>
                </div>
                <button
                  onClick={handleAdminClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdminClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Admin
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Products
            </Link>
            <Link to="/offers" className="block text-gray-700 hover:text-blue-600 font-semibold" onClick={() => setIsOpen(false)}>
              Offers
            </Link>
            <Link to="/about" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <div className="block text-gray-700 font-semibold py-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user?.name}
                </div>
                <button
                  onClick={handleAdminClick}
                  className="block w-full text-left bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleAdminClick}
                className="block w-full text-left bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Admin Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
