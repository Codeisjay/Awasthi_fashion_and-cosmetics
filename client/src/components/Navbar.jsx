import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LogIn, User } from 'lucide-react';
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
    <nav className="bg-white shadow-md fixed w-full top-0 z-50 border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between h-14 xs:h-16 items-center">
          <Link to="/" className="flex items-center gap-2 xs:gap-3 group" onClick={() => setIsOpen(false)}>
            <img 
              src="/logo.png" 
              alt="Awasthi's Beauty Parlour & Cosmetics" 
              className="h-12 xs:h-14 w-auto object-contain" 
              style={{maxHeight: '60px'}}
            />
            <div className="hidden md:block">
              <span className="text-sm xs:text-base sm:text-lg font-bold text-gray-900" style={{fontFamily: 'Georgia, serif'}}>Awasthi's</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 lg:gap-8 items-center">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/offers', label: 'Offers', bold: true },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(link => (
              <Link 
                key={link.to}
                to={link.to} 
                className={`text-gray-700 hover:text-blue-600 transition-colors duration-300 ${link.bold ? 'font-semibold' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-3 lg:gap-4 border-l border-gray-300 pl-6 lg:pl-8">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-semibold text-sm lg:text-base">{user?.name}</span>
                </div>
                <button
                  onClick={handleAdminClick}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold text-sm active:scale-95"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold text-sm active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdminClick}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold text-sm active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                Admin
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Sidebar */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 md:hidden z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-2xl md:hidden z-50 animate-slide-in-right overflow-y-auto">
              <div className="pt-20 pb-4">
                <div className="space-y-1 xs:space-y-2 px-3 xs:px-4">
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/products', label: 'Products' },
                    { to: '/offers', label: 'Offers', bold: true },
                    { to: '/about', label: 'About' },
                    { to: '/contact', label: 'Contact' },
                  ].map(link => (
                    <Link 
                      key={link.to}
                      to={link.to} 
                      className={`block px-3 xs:px-4 py-3 xs:py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-300 text-sm xs:text-base ${link.bold ? 'font-semibold text-blue-600' : ''}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-gray-200 my-3 xs:my-4 pt-3 xs:pt-4 px-3 xs:px-4">
                  {isAuthenticated ? (
                    <>
                      <div className="flex text-gray-700 font-semibold py-3 xs:py-4 items-center gap-2 text-sm xs:text-base mb-2 xs:mb-3">
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-2 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="truncate">{user?.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleAdminClick();
                          setIsOpen(false);
                        }}
                        className="block w-full text-left bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 xs:px-4 py-3 xs:py-4 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm xs:text-base mb-2 xs:mb-3"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left bg-gradient-to-r from-red-600 to-red-700 text-white px-3 xs:px-4 py-3 xs:py-4 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm xs:text-base flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        handleAdminClick();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 xs:px-4 py-3 xs:py-4 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm xs:text-base"
                    >
                      Admin Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
