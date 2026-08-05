import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { offerService, ASSET_BASE_URL } from '../services/api';
import { ArrowLeft, Calendar, Tag, Zap } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';

const OfferDetailsPage = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffer = async () => {
      setLoading(true);
      try {
        const response = await offerService.getOfferById(id);
        setOffer(response.data.offer);
      } catch (err) {
        console.error('Failed to load offer details:', err);
        setError('Unable to load offer details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOffer();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">Loading offer details...</div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <p className="text-gray-700 text-lg font-semibold mb-4">{error || 'Offer not found.'}</p>
          <Link to="/offers" className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition">
            <ArrowLeft className="w-4 h-4" /> Back to Offers
          </Link>
        </div>
      </div>
    );
  }

  const isFlash = offer.offerType === 'flash';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/offers" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Offers
          </Link>
          <div className="inline-flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
              <Tag className="w-4 h-4" /> {offer.offerType.toUpperCase()}
            </span>
            {isFlash && (
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                🔥 FLASH SALE
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] items-start">
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/40" />
              {offer.bannerImage ? (
                <img
                  src={offer.bannerImage.startsWith('/uploads') ? `${ASSET_BASE_URL}${offer.bannerImage}` : offer.bannerImage}
                  alt={offer.title}
                  className="w-full h-[24rem] sm:h-[30rem] object-cover"
                />
              ) : (
                <div className="h-[24rem] sm:h-[30rem] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black">
                  Offer Image Coming Soon
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-6 sm:px-10 sm:py-8">
                <div className="max-w-3xl">
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">{offer.title}</h1>
                  {offer.couponCode && (
                    <div className="mt-4 inline-flex items-center gap-3 bg-white/15 backdrop-blur rounded-full px-4 py-3 text-sm sm:text-base text-white font-semibold border border-white/20">
                      <Zap className="w-4 h-4 text-yellow-300" /> Use code <span className="uppercase tracking-[0.2em]">{offer.couponCode}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-white p-6 rounded-[1.75rem] shadow-lg border border-gray-200">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">Discount</p>
                <p className="text-3xl font-black text-gray-900">{offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}</p>
              </div>
              <div className="bg-white p-6 rounded-[1.75rem] shadow-lg border border-gray-200">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">Valid Until</p>
                <p className="text-base font-semibold text-gray-900">{new Date(offer.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p className="mt-2 text-sm text-orange-600 font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> <CountdownTimer endDate={offer.endDate} compact={true} />
                </p>
              </div>
              <div className="bg-white p-6 rounded-[1.75rem] shadow-lg border border-gray-200">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">Minimum Spend</p>
                <p className="text-3xl font-black text-gray-900">₹{offer.minimumPurchase || 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-200 p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-indigo-500 font-semibold">Offer Overview</p>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-black text-gray-900">Get the best deal on your next purchase</h2>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-6 py-3 rounded-3xl font-semibold shadow-xl hover:scale-[1.01] transition-transform"
                >
                  Shop Now
                </Link>
              </div>
              <div className="mt-6 prose prose-sm sm:prose-base text-gray-700 max-w-none">
                <p>{offer.description || 'This offer brings you the best value with exciting discounts and exclusive terms tailored to your needs.'}</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-5 text-white">
                <p className="text-xs uppercase tracking-[0.25em] font-semibold">Offer Snapshot</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="rounded-3xl bg-indigo-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">Offer Type</p>
                  <p className="mt-2 text-lg font-bold text-gray-900">{offer.offerType.charAt(0).toUpperCase() + offer.offerType.slice(1)}</p>
                </div>
                <div className="rounded-3xl bg-green-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-green-600">Save More</p>
                  <p className="mt-2 text-lg font-bold text-gray-900">{offer.discountType === 'percentage' ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}</p>
                </div>
                <div className="rounded-3xl bg-yellow-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-yellow-700">Coupon Status</p>
                  <p className="mt-2 text-lg font-bold text-gray-900">{offer.couponCode ? 'Available' : 'No code needed'}</p>
                </div>
              </div>
            </div>

            {offer.applicableCategories && offer.applicableCategories.length > 0 && (
              <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-200 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-purple-500 font-semibold mb-4">Applicable Categories</p>
                <div className="flex flex-wrap gap-3">
                  {offer.applicableCategories.map((category) => (
                    <span key={category} className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">{category}</span>
                  ))}
                </div>
              </div>
            )}

            {offer.applicableProducts && offer.applicableProducts.length > 0 && (
              <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-200 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-blue-500 font-semibold mb-4">Applicable Products</p>
                <div className="flex flex-wrap gap-3">
                  {offer.applicableProducts.map((product) => (
                    <span key={product._id || product} className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-800 text-sm font-semibold">{product.name || product}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailsPage;
