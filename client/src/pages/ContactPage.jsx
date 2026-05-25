import React, { useEffect, useState } from 'react';
import { trackingService } from '../services/api';
import { Mail, Phone, MapPin, Navigation } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackingService.trackVisit('/contact').catch(err => console.log('Tracking error:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recipientEmail: 'awasthr080@gmail.com'
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const elegantStyle = {
    fontFamily: '"Playfair Display", Georgia, serif',
    letterSpacing: '0.05em'
  };

  const mapsLink = 'https://maps.app.goo.gl/vKcf3Hb1ke5hNyMH6';
  const latitude = 26.428867;
  const longitude = 80.2924839;
  const businessName = 'Awasthi beauty parlour and cosmetics';

  return (
    <div className="pt-20 xs:pt-24 sm:pt-28 bg-gradient-to-b from-pink-50 via-white to-purple-50 min-h-screen pb-8 xs:pb-12">
      <div className="max-w-6xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 py-6 xs:py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-8 xs:mb-12 sm:mb-16 animate-fade-in">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 xs:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600" style={elegantStyle}>
            Get In Touch
          </h1>
          <p className="text-base xs:text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            Visit us at our beautiful beauty parlour and fashion store. We're excited to welcome you!
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mb-8 xs:mb-12 sm:mb-16">
          {[
            { icon: Mail, title: 'Email', text: 'awasthr080@gmail.com', bg: 'from-pink-100 to-pink-200', color: 'text-pink-600', delay: '0s' },
            { icon: Phone, title: 'Phone', text: '+91 9305748046', bg: 'from-purple-100 to-purple-200', color: 'text-purple-600', delay: '0.1s' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-4 xs:p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 md:active:scale-100 animate-slide-in-up"
                style={{ animationDelay: item.delay }}
              >
                <div className={`bg-gradient-to-br ${item.bg} w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4`}>
                  <Icon className={`w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8 ${item.color}`} />
                </div>
                <h3 className="text-lg xs:text-xl font-bold mb-1 xs:mb-2 text-gray-900 text-center">{item.title}</h3>
                <p className="text-sm xs:text-base text-gray-600 text-center">{item.text}</p>
              </div>
            );
          })}

          <div 
            className="bg-gradient-to-br from-pink-500 to-purple-500 p-4 xs:p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white hover:scale-105 active:scale-95 md:active:scale-100 animate-slide-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="bg-white bg-opacity-20 w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
              <MapPin className="w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8" />
            </div>
            <h3 className="text-lg xs:text-xl font-bold mb-1 xs:mb-2 text-center">Location</h3>
            <p className="text-sm xs:text-base font-semibold text-center">{businessName}</p>
          </div>

          <div 
            className="bg-gradient-to-br from-orange-400 to-red-500 p-4 xs:p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white hover:scale-105 active:scale-95 md:active:scale-100 animate-slide-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="bg-white bg-opacity-20 w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
              <span className="text-2xl xs:text-3xl">🛒</span>
            </div>
            <h3 className="text-lg xs:text-xl font-bold mb-1 xs:mb-2 text-center">Meesho</h3>
            <p className="text-sm xs:text-base font-semibold text-center">Shop Online</p>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-8 xs:mb-12 sm:mb-16 animate-slide-in-up">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 xs:p-6 sm:p-8">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white" style={elegantStyle}>
                📍 Find Us On Map
              </h2>
            </div>
            
            <div className="p-4 xs:p-6 sm:p-8">
              <div className="bg-gray-100 rounded-xl overflow-hidden mb-4 xs:mb-6 shadow-lg">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.0542340626!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47594be32a7b%3A0xb22ce47c29640c7f!2sAwasthi%20beauty%20parlour%20and%20cosmetics!5e0!3m2!1sen!2sin!4v`}
                  width="100%"
                  height="300"
                  className="w-full"
                  style={{ border: 0, borderRadius: '8px', minHeight: '300px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 xs:gap-6">
                <div className="bg-pink-50 p-4 xs:p-6 rounded-xl">
                  <h3 className="text-base xs:text-lg font-bold text-gray-800 mb-2 xs:mb-3">Coordinates</h3>
                  <p className="text-sm xs:text-base text-gray-700 mb-2">
                    <span className="font-semibold">Latitude:</span> {latitude}
                  </p>
                  <p className="text-sm xs:text-base text-gray-700">
                    <span className="font-semibold">Longitude:</span> {longitude}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 xs:p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-base xs:text-lg font-bold text-gray-800 mb-2 xs:mb-3">Directions</h3>
                    <p className="text-sm xs:text-base text-gray-700 mb-3 xs:mb-4">Click the button to get directions</p>
                  </div>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 xs:px-6 py-2 xs:py-3 rounded-lg hover:shadow-lg transition font-semibold active:scale-95 md:active:scale-100 text-sm xs:text-base"
                  >
                    <Navigation className="w-4 xs:w-5 h-4 xs:h-5 mr-2" />
                    Open Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meesho Section */}
        <div className="mb-8 xs:mb-12 sm:mb-16 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 xs:p-6 sm:p-8">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white" style={elegantStyle}>
                🛒 Shop On Meesho
              </h2>
            </div>
            
            <div className="p-4 xs:p-6 sm:p-8">
              <p className="text-sm xs:text-base sm:text-lg text-gray-700 leading-relaxed mb-6 xs:mb-8 text-center">
                Our complete range of beauty products, fashion items, and cosmetics is available on <strong>Meesho</strong>. Enjoy convenient online shopping!
              </p>
              
              <div className="flex flex-col xs:flex-row gap-4 xs:gap-6 items-center justify-center">
                <a 
                  href="https://www.meesho.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 xs:px-8 py-3 xs:py-4 rounded-xl hover:shadow-lg transition font-bold inline-flex items-center active:scale-95 md:active:scale-100 text-sm xs:text-base whitespace-nowrap"
                >
                  <span className="text-lg xs:text-xl mr-2">🛒</span>
                  Visit Meesho
                </a>
                
                <div className="text-center xs:text-left">
                  <p className="text-gray-700 font-bold text-sm xs:text-base">Available Products:</p>
                  <p className="text-gray-600 text-xs xs:text-sm">Fashion • Cosmetics • Beauty • Accessories</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-4 xs:p-6 sm:p-8 lg:p-12 max-w-3xl mx-auto animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="mb-6 xs:mb-8">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600" style={elegantStyle}>
              Send Us A Message
            </h2>
            <p className="text-gray-600 mt-2 text-sm xs:text-base">We'd love to hear from you! Drop us a message and we'll get back to you soon.</p>
          </div>

          <form className="space-y-4 xs:space-y-6" onSubmit={handleSubmit}>
            {submitted && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 text-green-700 px-4 xs:px-6 py-3 xs:py-4 rounded-xl animate-scale-in">
                <p className="font-semibold text-sm xs:text-base">✓ Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 xs:gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm xs:text-base">Name</label>
                <input
                  type="text"
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition text-sm xs:text-base"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-sm xs:text-base">Email</label>
                <input
                  type="email"
                  className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition text-sm xs:text-base"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm xs:text-base">Phone</label>
              <input
                type="tel"
                className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition text-sm xs:text-base"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm xs:text-base">Subject</label>
              <input
                type="text"
                className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition text-sm xs:text-base"
                placeholder="What is this about?"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm xs:text-base">Message</label>
              <textarea
                rows={5}
                className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition resize-none text-sm xs:text-base"
                placeholder="Tell us more..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 xs:py-4 rounded-xl hover:shadow-lg transition font-bold text-base xs:text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 md:active:scale-100"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
