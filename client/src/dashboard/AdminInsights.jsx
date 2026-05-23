import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { mlService } from '../services/api';
import { TrendingUp, AlertCircle } from 'lucide-react';

const AdminInsights = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [trending, setTrending] = useState([]);
  const [demandAnalysis, setDemandAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const [recsRes, trendRes, demandRes] = await Promise.all([
        mlService.getRecommendations(),
        mlService.getTrending(),
        mlService.getDemandAnalysis()
      ]);
      setRecommendations(recsRes.data.recommendations);
      setTrending(trendRes.data.trendingProducts);
      setDemandAnalysis(demandRes.data.demandAnalysis);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-8">ML Insights & Recommendations</h1>

          {loading ? (
            <div className="text-center py-12">Loading insights...</div>
          ) : (
            <>
              {/* Demand Analysis Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {demandAnalysis?.overview?.map(item => (
                  <div key={item._id} className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-2 capitalize">{item._id} Demand</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{item.count}</p>
                    <p className="text-sm text-gray-600">
                      Trend Score: {item.avgTrendScore.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Confidence: {(item.avgConfidence * 100).toFixed(0)}%
                    </p>
                  </div>
                ))}
              </div>

              {/* Trending Products */}
              {trending.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <h2 className="text-2xl font-bold">Trending Products</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trending.map(product => (
                      <div key={product._id} className="border border-gray-300 p-4 rounded-lg">
                        <p className="font-semibold mb-2">{product.productId?.title}</p>
                        <p className="text-sm text-gray-600">
                          Trend Score: <span className="font-bold">{product.trendScore}/100</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Predicted Clicks: <span className="font-bold">{product.predictedClicks}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations && (
                <div className="space-y-8">
                  {/* Promote */}
                  {recommendations.promote?.length > 0 && (
                    <div className="bg-green-50 p-6 rounded-lg shadow-lg border-l-4 border-green-600">
                      <h3 className="text-xl font-bold text-green-600 mb-4">
                        Products to Promote
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.promote.map(rec => (
                          <div key={rec._id} className="bg-white p-4 rounded-lg">
                            <p className="font-semibold">{rec.productId?.title}</p>
                            <p className="text-sm text-gray-600">
                              Predicted Demand: {rec.predictedDemand}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Discontinue */}
                  {recommendations.discontinue?.length > 0 && (
                    <div className="bg-red-50 p-6 rounded-lg shadow-lg border-l-4 border-red-600">
                      <h3 className="text-xl font-bold text-red-600 mb-4">
                        Products to Discontinue
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.discontinue.map(rec => (
                          <div key={rec._id} className="bg-white p-4 rounded-lg">
                            <p className="font-semibold">{rec.productId?.title}</p>
                            <p className="text-sm text-gray-600">
                              Low demand detected
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Maintain */}
                  {recommendations.maintain?.length > 0 && (
                    <div className="bg-blue-50 p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
                      <h3 className="text-xl font-bold text-blue-600 mb-4">
                        Products to Maintain
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.maintain.slice(0, 6).map(rec => (
                          <div key={rec._id} className="bg-white p-4 rounded-lg">
                            <p className="font-semibold">{rec.productId?.title}</p>
                            <p className="text-sm text-gray-600">
                              Stable demand
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInsights;
