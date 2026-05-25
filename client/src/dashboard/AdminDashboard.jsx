import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { analyticsService } from '../services/api';
import { Users, MousePointerClick, Package, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
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
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="pt-20 xs:pt-24 sm:pt-28 px-2 xs:px-3 sm:px-4 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-6 xs:mb-8 text-gray-900">Dashboard Overview</h1>

          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading analytics...</div>
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8">
                <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs xs:text-sm font-medium">Total Visitors</p>
                      <p className="text-2xl xs:text-3xl font-bold text-gray-900 mt-2">{overview?.totalVisitors || 0}</p>
                    </div>
                    <Users className="w-10 xs:w-12 h-10 xs:h-12 text-blue-600 opacity-15" />
                  </div>
                </div>

                <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs xs:text-sm font-medium">Total Clicks</p>
                      <p className="text-2xl xs:text-3xl font-bold text-gray-900 mt-2">{overview?.totalClicks || 0}</p>
                    </div>
                    <TrendingUp className="w-10 xs:w-12 h-10 xs:h-12 text-green-600 opacity-15" />
                  </div>
                </div>

                <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs xs:text-sm font-medium">Total Products</p>
                      <p className="text-2xl xs:text-3xl font-bold text-gray-900 mt-2">{overview?.totalProducts || 0}</p>
                    </div>
                    <Package className="w-10 xs:w-12 h-10 xs:h-12 text-purple-600 opacity-15" />
                  </div>
                </div>

                <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs xs:text-sm font-medium">Today's Visitors</p>
                      <p className="text-2xl xs:text-3xl font-bold text-gray-900 mt-2">{overview?.todayVisitors || 0}</p>
                    </div>
                    <MousePointerClick className="w-10 xs:w-12 h-10 xs:h-12 text-orange-600 opacity-15" />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 mb-6 xs:mb-8">
                {/* Daily Traffic Chart */}
                <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md">
                  <h2 className="text-lg xs:text-xl font-bold mb-4 text-gray-900">Daily Traffic</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={traffic?.dailyTraffic || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Device Breakdown */}
                <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md">
                  <h2 className="text-lg xs:text-xl font-bold mb-4 text-gray-900">Device Breakdown</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={traffic?.deviceBreakdown || []}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
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
                <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md">
                  <h2 className="text-lg xs:text-xl font-bold mb-4 text-gray-900">Top Browsers</h2>
                  <ResponsiveContainer width="100%" height={250}>
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
                <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md">
                  <h2 className="text-lg xs:text-xl font-bold mb-4 text-gray-900">Traffic by Hour</h2>
                  <ResponsiveContainer width="100%" height={250}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6">
                <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md">
                  <h2 className="text-lg xs:text-xl font-bold mb-4 text-gray-900">🔥 Most Clicked Product</h2>
                  {overview?.mostClickedProduct ? (
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">{overview.mostClickedProduct.title}</p>
                      <p className="text-sm text-gray-600">{overview.mostClickedProduct.clicks} clicks</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No data available</p>
                  )}
                </div>

                <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md">
                  <h2 className="text-lg xs:text-xl font-bold mb-4 text-gray-900">📊 Least Clicked Product</h2>
                  {overview?.leastClickedProduct ? (
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">{overview.leastClickedProduct.title}</p>
                      <p className="text-sm text-gray-600">{overview.leastClickedProduct.clicks} clicks</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No data available</p>
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
