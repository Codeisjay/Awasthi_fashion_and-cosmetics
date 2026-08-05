import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, LogOut, LayoutDashboard, Package, Tag, Brain, Image, ChevronDown } from 'lucide-react';

const AdminNavbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userNavOpen, setUserNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Offers', path: '/admin/offers', icon: Tag },
    { label: 'Posts', path: '/admin/posts', icon: Image },
    { label: 'ML Insights', path: '/admin/insights', icon: Brain }
  ];

  const userNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Offers', path: '/offers' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg z-40">
      <div className="w-full px-2 xs:px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 xs:h-16 sm:h-20">
          {/* Logo Section */}
          <Link to="/admin/dashboard" className="flex items-center gap-2 xs:gap-3 group flex-shrink-0">
            <div className="bg-white/20 p-2 xs:p-2.5 rounded-lg group-hover:bg-white/30 transition-colors">
              <LayoutDashboard className="w-5 xs:w-6 h-5 xs:h-6" />
            </div>
            <div className="hidden xs:block">
              <p className="text-xs font-bold text-blue-100">ADMIN</p>
              <p className="text-sm xs:text-base font-bold leading-tight text-white">Awasthi Fashion & Cosmetics</p>
            </div>
            <div className="xs:hidden">
              <p className="text-sm font-bold">Awasthi's</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1 mx-6">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-white/20 font-bold'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="relative">
              <button
                onClick={() => setUserNavOpen(!userNavOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
              >
                <span className="text-sm font-medium">User Site</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {userNavOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 rounded-xl bg-white text-gray-900 shadow-xl overflow-hidden z-50">
                  {userNavItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setUserNavOpen(false)}
                      className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - User Menu and Mobile Toggle */}
          <div className="flex items-center gap-2 xs:gap-4">
            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 xs:px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                </div>
                <span className="text-sm font-medium hidden xs:inline">{user?.name || 'Admin'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-40 bg-white text-gray-900 rounded-lg shadow-xl py-2 w-48 animate-slide-in-down">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-semibold text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left text-sm font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 lg:hidden z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-700 to-blue-900 shadow-2xl lg:hidden z-50 animate-slide-in-right overflow-y-auto">
              <div className="pt-20 pb-4">
                <div className="px-2 xs:px-3 space-y-1">
                  {menuItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 xs:px-4 py-4 rounded-lg transition-all duration-300 text-sm xs:text-base ${
                          isActive(item.path)
                            ? 'bg-white/30 font-bold text-white'
                            : 'text-blue-100 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  {/* Mobile User Menu */}
                  <div className="border-t border-blue-500 mt-4 pt-4">
                    <div className="px-3 xs:px-4 py-3 text-xs xs:text-sm text-blue-100">
                      <p className="font-semibold text-white">{user?.name || 'Admin'}</p>
                      <p className="text-blue-300 text-xs">{user?.email}</p>
                    </div>
                    <div className="space-y-2">
                      {userNavItems.map(item => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className="block w-full text-left px-3 xs:px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition text-sm xs:text-base font-semibold"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 xs:px-4 py-3 text-red-200 hover:bg-red-500/30 transition-colors text-left text-sm font-semibold rounded-lg bg-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
