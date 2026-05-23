import React, { useState } from 'react';
import AdminSidebar from '../dashboard/AdminSidebar';
import AdminOffers from '../dashboard/AdminOffers';

const AdminOffersPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <AdminOffers />
        </div>
      </div>
    </div>
  );
};

export default AdminOffersPage;
