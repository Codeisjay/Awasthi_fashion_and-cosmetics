import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Products', path: '/admin/products' },
    { label: 'Offers & Promotions', path: '/admin/offers' },
    { label: 'ML Insights', path: '/admin/insights' }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static bg-gray-900 text-white w-64 h-screen overflow-y-auto transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <BarChart3 className="w-8 h-8" />
            <div>
              <h1 className="text-xs font-semibold text-gray-400">AWASTHI</h1>
              <h2 className="text-lg font-bold" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>Admin Panel</h2>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
