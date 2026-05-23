import React, { useEffect } from 'react';
import { trackingService } from '../services/api';
import { Sparkles, Heart, Award, Users, MapPin } from 'lucide-react';

const AboutPage = () => {
  useEffect(() => {
    trackingService.trackVisit('/about').catch(err => console.log('Tracking error:', err));
  }, []);

  const elegantStyle = {
    fontFamily: '"Playfair Display", Georgia, serif',
    letterSpacing: '0.05em'
  };

  const serviceSections = [
    {
      title: '💄 Beauty Parlour Services',
      services: [
        'Bridal & Party Makeup',
        'Facials & Skin Care',
        'Hair Styling & Hair Care',
        'Waxing & Threading',
        'Manicure & Pedicure',
        'Clean-up & Glow Treatments',
        'Mehendi Services',
        'Regular Parlour Services'
      ],
      description: 'We provide a complete range of professional beauty and self-care services designed to help you look and feel your best. We focus on hygiene, customer comfort, and personalized care to give every client a relaxing and satisfying experience.'
    },
    {
      title: '👗 Ladies Fashion Collection',
      services: [
        'Kurtis',
        'Leggings',
        'Tops & Daily Wear',
        'Fashion Accessories',
        'Ethnic Wear',
        'Trendy Seasonal Collections'
      ],
      description: 'Fashion is an important part of confidence, and we bring you stylish and affordable ladies\' wear for every occasion. We carefully select products that combine comfort, quality, and modern fashion trends.'
    },
    {
      title: '🛍 Cosmetics & Beauty Products',
      services: [
        'Makeup Essentials',
        'Skin Care Products',
        'Hair Care Products',
        'Beauty Accessories',
        'Cosmetic Kits',
        'Personal Care Items'
      ],
      description: 'We offer a wide range of beauty and cosmetic products to meet your everyday needs. We aim to provide trusted and quality products suitable for all beauty needs.'
    }
  ];

  const whyChooseUs = [
    'Affordable Prices',
    'Friendly Customer Service',
    'Quality Beauty Products',
    'Trendy Fashion Collection',
    'Professional Parlour Services',
    'Comfortable & Hygienic Environment',
    'One Place for Beauty & Fashion'
  ];

  return (
    <div className="pt-28 bg-gradient-to-b from-pink-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-pink-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600" style={elegantStyle}>
            Where Beauty, Fashion & Confidence Come Together
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Welcome to our beauty and fashion destination — a place created especially for women who love style, self-care, and confidence. We proudly offer professional beauty parlour services along with a beautiful collection of ladies' garments, cosmetics, and daily beauty essentials under one roof.
          </p>
        </div>

        {/* Tagline */}
        <div className="text-center mb-16 bg-white bg-opacity-60 backdrop-blur py-8 rounded-2xl shadow-lg">
          <p className="text-2xl font-semibold text-gray-800" style={elegantStyle}>
            Our goal is simple: to provide quality products, trendy fashion, and trusted beauty services at affordable prices for every customer.
          </p>
        </div>

        {/* Services Sections */}
        {serviceSections.map((section, idx) => (
          <div key={idx} className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-8">
                <h2 className="text-3xl font-bold text-white" style={elegantStyle}>
                  {section.title}
                </h2>
              </div>
              
              <div className="p-8">
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {section.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.services.map((service, sidx) => (
                    <div key={sidx} className="flex items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
                      <span className="text-pink-600 text-xl mr-3">✓</span>
                      <span className="text-gray-800 font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-12">
            <h2 className="text-4xl font-bold text-white mb-8 text-center" style={elegantStyle}>
              🌸 Why Choose Us?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((reason, idx) => (
                <div key={idx} className="bg-white bg-opacity-90 rounded-xl p-6 text-center hover:bg-opacity-100 transition shadow-lg">
                  <Heart className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                  <p className="font-semibold text-gray-800">{reason}</p>
                </div>
              ))}
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
            
            <div className="p-8 text-center">
              <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
                Our beautiful collection of <strong>ladies' fashion, cosmetics, and beauty products</strong> is also available on Meesho. Shop from the comfort of your home and enjoy the same quality and affordability!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-orange-50 p-6 rounded-xl">
                  <p className="text-2xl mb-2">👗</p>
                  <h3 className="font-semibold text-gray-800 mb-2">Fashion & Accessories</h3>
                  <p className="text-gray-600 text-sm">Browse our trendy collection of kurtis, leggings, and accessories</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl">
                  <p className="text-2xl mb-2">💄</p>
                  <h3 className="font-semibold text-gray-800 mb-2">Beauty Products</h3>
                  <p className="text-gray-600 text-sm">Explore makeup, skincare, and hair care essentials</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl">
                  <p className="text-2xl mb-2">🚚</p>
                  <h3 className="font-semibold text-gray-800 mb-2">Easy Delivery</h3>
                  <p className="text-gray-600 text-sm">Fast and convenient delivery to your doorstep</p>
                </div>
              </div>
              
              <div className="mt-8">
                <a 
                  href="https://www.meesho.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-4 rounded-lg hover:shadow-lg transition font-semibold text-lg"
                >
                  Visit Us On Meesho
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600" style={elegantStyle}>
              ❤️ Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl">
              Our mission is to create a trusted beauty and fashion space where every customer feels confident, beautiful, and valued. We believe beauty is not only about appearance — it is about confidence, self-care, and happiness.
            </p>
          </div>
        </div>

        {/* Visit Us Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-12 text-center">
            <MapPin className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4" style={elegantStyle}>
              📍 Visit Us Today
            </h2>
            <p className="text-xl text-white mb-2">
              Experience beauty, fashion, and care all in one place.
            </p>
            <p className="text-lg text-white font-semibold">
              We look forward to welcoming you and becoming a part of your beauty journey.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
