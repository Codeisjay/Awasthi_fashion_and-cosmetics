# MERN Ecommerce Analytics Platform

A complete full-stack ecommerce analytics platform with product showcase, visitor tracking, AI/ML-based demand insights, and a comprehensive admin dashboard.

## 🌟 Features

### User Panel
- **Modern Product Showcase**: Browse and filter products by category
- **Real-time Analytics Tracking**: Automatic tracking of visitor behavior
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Product Search**: Advanced search functionality
- **Category Filtering**: Easy product discovery

### Admin Panel
- **Secure Authentication**: JWT-based admin login
- **Dashboard Overview**: Key metrics at a glance
- **Analytics & Insights**:
  - Daily/monthly traffic graphs
  - Device and browser analytics
  - User activity tracking
  - Peak traffic hours analysis
- **Product Management**: Add, edit, delete products
- **ML Recommendations**: AI-powered demand insights
- **Trending Products**: Automatic trend detection
- **User Analytics**: Visitor and session tracking

### Analytics Features
- Visitor tracking with unique session IDs
- Click analytics on products
- Device and browser detection
- Traffic patterns and trends
- User engagement metrics

### ML/AI Features
- **Demand Classification**: High/Medium/Low demand prediction
- **Trend Detection**: Identifying trending products
- **Click Prediction**: Linear regression for future clicks
- **Smart Recommendations**: Promote/maintain/reduce/discontinue suggestions
- **Confidence Scoring**: ML model confidence metrics

## 🛠 Technology Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Machine Learning
- **Python** - ML language
- **Flask** - ML service framework
- **Pandas** - Data processing
- **Scikit-learn** - ML algorithms
- **MongoDB** - Data source

## 📁 Project Structure

```
project-root/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utilities
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                # Node.js backend
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # Auth, error handling
│   ├── services/         # Utility services
│   ├── config/           # Configuration
│   ├── server.js         # Main server file
│   └── package.json
│
├── ml-service/           # Python ML service
│   ├── main.py          # Pipeline orchestrator
│   ├── train.py         # ML models
│   ├── preprocess.py    # Data preprocessing
│   ├── app.py           # Flask app
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB Atlas account
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
cd "MY bussiness"
```

#### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:3000

# Start the server
npm run dev
# Server runs on http://localhost:5000
```

#### 3. Frontend Setup
```bash
cd ../client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env
VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
# App runs on http://localhost:3000
```

#### 4. ML Service Setup
```bash
cd ../ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Update .env
MONGODB_URI=your_mongodb_uri
DB_NAME=ecommerce-analytics

# Run the service
python app.py
# Service runs on http://localhost:5001
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Tracking
- `POST /api/track/visit` - Track visitor
- `POST /api/track/click` - Track product click
- `GET /api/track/clicks/:productId` - Get product clicks

### Analytics
- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/traffic` - Traffic analytics
- `GET /api/analytics/products` - Product analytics
- `GET /api/analytics/users` - User analytics

### ML
- `GET /api/ml/recommendations` - Get recommendations
- `GET /api/ml/trending` - Get trending products
- `GET /api/ml/demand-analysis` - Get demand analysis
- `POST /api/ml/predictions/:productId` - Update predictions

## 🔐 Admin Credentials

For testing purposes:
```
Email: admin@manika.com
Password: manika93057
```

**Note**: Change these credentials in production!

## 📊 Database Models

### Admin
- name
- email
- password (hashed)
- role
- isActive
- lastLogin

### Product
- title
- description
- image
- category
- meeshoLink
- clicks
- impressions
- stockStatus
- isActive
- createdAt

### ClickEvent
- productId
- sessionId
- timestamp
- device
- browser
- ipAddress
- userAgent

### Visitor
- sessionId
- visitTime
- pagesVisited
- device
- browser
- location
- sessionDuration
- isReturning

### MLPrediction
- productId
- predictedDemand
- predictedClicks
- trendScore
- isIncreasing
- recommendation
- confidence
- generatedAt

## 🎯 ML Pipeline

The ML service runs predictions every hour (configurable):

1. **Data Collection**: Fetches click events from MongoDB
2. **Data Preprocessing**: Aggregates and normalizes data
3. **Feature Engineering**: Extracts relevant features
4. **Model Training**: 
   - Linear Regression for click prediction
   - Decision Tree for demand classification
5. **Prediction**: Generates demand forecasts
6. **Trend Detection**: Identifies trending products
7. **Recommendations**: Generates actionable insights
8. **Storage**: Saves predictions back to MongoDB

## 📈 Analytics Tracked

- **Visitors**: Total count, daily count, returning vs new
- **Clicks**: Total clicks, clicks per product, click rate
- **Devices**: Mobile, tablet, desktop breakdown
- **Browsers**: Chrome, Firefox, Safari, Edge, etc.
- **Traffic**: Hourly, daily, monthly patterns
- **Engagement**: Session duration, pages visited
- **Trends**: Click velocity, demand trends
- **Recommendations**: Product performance insights

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy dist folder to Vercel
```

### Backend (Render)
```bash
# Push to Git
# Connect repository to Render
# Set environment variables
# Deploy
```

### Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas
- Configure IP whitelist
- Update connection string

### ML Service (Render)
```bash
# Deploy Python service to Render
# Set Python version: 3.11
# Set start command: python app.py
```

## 🔧 Environment Variables

### Server (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### Client (.env)
```
VITE_API_URL=https://api.yourdomain.com/api
```

### ML Service (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
DB_NAME=ecommerce-analytics
ML_RUN_INTERVAL=3600
FLASK_ENV=production
```

## 📝 Usage Examples

### Track a Visit
```javascript
POST /api/track/visit
{
  "sessionId": "uuid-v4",
  "page": "/products",
  "device": "mobile",
  "browser": "Chrome"
}
```

### Track a Click
```javascript
POST /api/track/click
{
  "productId": "product_id",
  "sessionId": "uuid-v4",
  "device": "mobile",
  "browser": "Chrome"
}
```

### Create a Product
```javascript
POST /api/products (Admin)
{
  "title": "Product Name",
  "description": "Product Description",
  "image": "https://image-url.com/image.jpg",
  "category": "Electronics",
  "meeshoLink": "https://meesho.com/...",
  "stockStatus": "in-stock"
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check connection string in .env
- Verify IP whitelist in MongoDB Atlas
- Ensure database exists

### API Not Responding
- Check backend server is running
- Verify port 5000 is not in use
- Check firewall settings

### ML Pipeline Not Running
- Verify Python dependencies installed
- Check MongoDB connection
- Review logs in ml-service

### CORS Errors
- Verify FRONTEND_URL in backend .env
- Check API client configuration
- Ensure proper headers in requests

## 📦 Build and Run

### Production Build

**Frontend:**
```bash
cd client
npm run build
# Generates optimized dist folder
```

**Backend:**
```bash
cd server
npm install --production
node server.js
```

**ML Service:**
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected admin routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- SQL injection prevention (Mongoose)
- XSS protection (React)

## 🚀 Performance Optimizations

- Product image lazy loading
- Pagination for large datasets
- Database indexing
- Response caching
- Efficient database queries
- Optimized ML pipeline scheduling
- Code splitting in React

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check database logs
4. Review server logs

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Learning Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Scikit-learn Docs](https://scikit-learn.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 Changelog

### Version 1.0.0
- Initial release
- Complete MERN stack implementation
- ML pipeline integration
- Admin dashboard
- Analytics tracking
- Product management
- User authentication

---

**Built with ❤️ for ecommerce analytics**
