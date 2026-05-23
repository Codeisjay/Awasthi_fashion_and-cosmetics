import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { analyticsService } from '../services/api';
import { Users, MousePointerClick, Package, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [overview, setOverview] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewRes, trafficRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getTraffic(30)
      ]);
      setOverview(overviewRes.data.overview);
      setTraffic(trafficRes.data.traffic);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-8">Dashboard Overview</h1>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Visitors</p>
                      <p className="text-3xl font-bold">{overview?.totalVisitors || 0}</p>
                    </div>
                    <Users className="w-12 h-12 text-blue-600 opacity-20" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Clicks</p>
                      <p className="text-3xl font-bold">{overview?.totalClicks || 0}</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Products</p>
                      <p className="text-3xl font-bold">{overview?.totalProducts || 0}</p>
                    </div>
                    <Package className="w-12 h-12 text-purple-600 opacity-20" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Today's Visitors</p>
                      <p className="text-3xl font-bold">{overview?.todayVisitors || 0}</p>
                    </div>
                    <MousePointerClick className="w-12 h-12 text-orange-600 opacity-20" />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Traffic Chart */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Daily Traffic</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={traffic?.dailyTraffic || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="visitors" stroke="#3b82f6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Device Breakdown */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Device Breakdown</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={traffic?.deviceBreakdown || []}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {['#3b82f6', '#10b981', '#f59e0b'].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Browsers */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Top Browsers</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={traffic?.browserBreakdown || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Hourly Traffic */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Traffic by Hour</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={traffic?.hourlyTraffic || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Most/Least Clicked Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Most Clicked Product</h2>
                  {overview?.mostClickedProduct && (
                    <div className="space-y-2">
                      <p className="font-semibold">{overview.mostClickedProduct.title}</p>
                      <p className="text-gray-600">{overview.mostClickedProduct.clicks} clicks</p>
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Least Clicked Product</h2>
                  {overview?.leastClickedProduct && (
                    <div className="space-y-2">
                      <p className="font-semibold">{overview.leastClickedProduct.title}</p>
                      <p className="text-gray-600">{overview.leastClickedProduct.clicks} clicks</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
