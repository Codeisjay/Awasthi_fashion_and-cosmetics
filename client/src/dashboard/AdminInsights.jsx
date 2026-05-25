import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { mlService } from '../services/api';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

const AdminInsights = () => {
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
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="pt-20 xs:pt-24 sm:pt-28 px-2 xs:px-3 sm:px-4 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-6 xs:mb-8 text-gray-900">ML Insights & Recommendations</h1>

          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading insights...</div>
          ) : (
            <>
              {/* Demand Analysis Cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8">
                {demandAnalysis?.overview?.map(item => (
                  <div key={item._id} className="bg-white p-4 xs:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-sm xs:text-base font-bold text-gray-900 capitalize mb-2">{item._id} Demand</h3>
                    <p className="text-2xl xs:text-3xl font-bold text-blue-600 mb-3">{item.count}</p>
                    <div className="space-y-2">
                      <p className="text-xs xs:text-sm text-gray-600">
                        <strong>Trend Score:</strong> {item.avgTrendScore.toFixed(1)}/100
                      </p>
                      <p className="text-xs xs:text-sm text-gray-600">
                        <strong>Confidence:</strong> {(item.avgConfidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trending Products */}
              {trending.length > 0 && (
                <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md mb-6 xs:mb-8">
                  <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6">
                    <TrendingUp className="w-6 xs:w-7 h-6 xs:h-7 text-green-600" />
                    <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">🔥 Trending Products</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                    {trending.map(product => (
                      <div key={product._id} className="border-2 border-green-200 bg-green-50 p-4 xs:p-5 rounded-lg hover:shadow-md transition-shadow">
                        <p className="font-bold text-gray-900 text-sm xs:text-base mb-2">{product.productId?.title}</p>
                        <div className="space-y-2">
                          <p className="text-xs xs:text-sm text-gray-700">
                            <strong>Trend Score:</strong> <span className="text-green-600 font-bold">{product.trendScore}/100</span>
                          </p>
                          <p className="text-xs xs:text-sm text-gray-700">
                            <strong>Predicted Clicks:</strong> <span className="text-green-600 font-bold">{product.predictedClicks}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations && (
                <div className="space-y-4 xs:space-y-6">
                  {/* Promote */}
                  {recommendations.promote?.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 xs:p-6 rounded-xl shadow-md border-l-4 border-green-600">
                      <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6">
                        <TrendingUp className="w-6 xs:w-7 h-6 xs:h-7 text-green-600 flex-shrink-0" />
                        <h3 className="text-lg xs:text-xl font-bold text-green-700">Promote These Products</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                        {recommendations.promote.map(rec => (
                          <div key={rec._id} className="bg-white p-4 xs:p-5 rounded-lg hover:shadow-md transition-shadow border-l-4 border-green-500">
                            <p className="font-bold text-gray-900 text-sm xs:text-base mb-2">{rec.productId?.title}</p>
                            <p className="text-xs xs:text-sm text-gray-600">
                              <strong>Predicted Demand:</strong> <span className="text-green-600 font-semibold">{rec.predictedDemand}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Maintain */}
                  {recommendations.maintain?.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 xs:p-6 rounded-xl shadow-md border-l-4 border-blue-600">
                      <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6">
                        <CheckCircle className="w-6 xs:w-7 h-6 xs:h-7 text-blue-600 flex-shrink-0" />
                        <h3 className="text-lg xs:text-xl font-bold text-blue-700">Maintain These Products</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                        {recommendations.maintain.slice(0, 6).map(rec => (
                          <div key={rec._id} className="bg-white p-4 xs:p-5 rounded-lg hover:shadow-md transition-shadow border-l-4 border-blue-500">
                            <p className="font-bold text-gray-900 text-sm xs:text-base mb-2">{rec.productId?.title}</p>
                            <p className="text-xs xs:text-sm text-gray-600">
                              <strong>Status:</strong> <span className="text-blue-600 font-semibold">Stable Demand</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Discontinue */}
                  {recommendations.discontinue?.length > 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 xs:p-6 rounded-xl shadow-md border-l-4 border-red-600">
                      <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6">
                        <TrendingDown className="w-6 xs:w-7 h-6 xs:h-7 text-red-600 flex-shrink-0" />
                        <h3 className="text-lg xs:text-xl font-bold text-red-700">Consider Discontinuing</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                        {recommendations.discontinue.map(rec => (
                          <div key={rec._id} className="bg-white p-4 xs:p-5 rounded-lg hover:shadow-md transition-shadow border-l-4 border-red-500">
                            <p className="font-bold text-gray-900 text-sm xs:text-base mb-2">{rec.productId?.title}</p>
                            <p className="text-xs xs:text-sm text-gray-600">
                              <strong>Reason:</strong> <span className="text-red-600 font-semibold">Low Demand</span>
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
