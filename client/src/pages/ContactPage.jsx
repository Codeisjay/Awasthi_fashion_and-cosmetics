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
    <div className="pt-28 bg-gradient-to-b from-pink-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600" style={elegantStyle}>
            Get In Touch
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Visit us at our beautiful beauty parlour and fashion store. We're excited to welcome you!
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl transition">
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-600">awasthr080@gmail.com</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl text-center hover:shadow-2xl transition">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="text-gray-600">+91 9305748046</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-8 rounded-2xl shadow-xl text-center text-white hover:shadow-2xl transition">
            <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            <p className="text-white font-semibold">{businessName}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-400 to-red-500 p-8 rounded-2xl shadow-xl text-center text-white hover:shadow-2xl transition">
            <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Meesho</h3>
            <p className="text-white font-semibold">Shop Online</p>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6">
              <h2 className="text-3xl font-bold text-white" style={elegantStyle}>
                📍 Find Us On Map
              </h2>
            </div>
            
            <div className="p-8">
              <div className="bg-gray-100 rounded-xl overflow-hidden mb-6 shadow-lg">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.0542340626!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47594be32a7b%3A0xb22ce47c29640c7f!2sAwasthi%20beauty%20parlour%20and%20cosmetics!5e0!3m2!1sen!2sin!4v`}
                  width="100%"
                  height="500"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-pink-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Coordinates</h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Latitude:</span> {latitude}
                  </p>
                  <p className="text-gray-700 mb-4">
                    <span className="font-semibold">Longitude:</span> {longitude}
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Directions</h3>
                    <p className="text-gray-700 mb-4">Click the button below to get directions on Google Maps</p>
                  </div>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-semibold"
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Open In Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meesho Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-8">
              <h2 className="text-3xl font-bold text-white" style={elegantStyle}>
                🛒 Shop On Meesho
              </h2>
            </div>
            
            <div className="p-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center">
                Our complete range of beauty products, fashion items, and cosmetics is available on <strong>Meesho</strong>. Enjoy convenient online shopping with easy returns and fast delivery!
              </p>
              
              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                <a 
                  href="https://www.meesho.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-4 rounded-lg hover:shadow-lg transition font-semibold inline-flex items-center"
                >
                  <span className="text-xl mr-2">🛒</span>
                  Visit Us On Meesho
                </a>
                
                <div className="text-center md:text-left">
                  <p className="text-gray-700 font-semibold">Available Products:</p>
                  <p className="text-gray-600">Fashion • Cosmetics • Beauty Products • Accessories</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600" style={elegantStyle}>
              Send Us A Message
            </h2>
            <p className="text-gray-600 mt-2">We'd love to hear from you! Drop us a message and we'll get back to you soon.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {submitted && (
              <div className="bg-green-100 border-2 border-green-500 text-green-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">✓ Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                placeholder="What is this about?"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition resize-none"
                placeholder="Tell us more..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
