# Project Architecture & Setup Guide

## Overview

This is a complete full-stack MERN (MongoDB, Express, React, Node.js) ecommerce analytics platform with machine learning capabilities. The project consists of three main services:

1. **Frontend (React/Vite)** - User-facing product showcase
2. **Backend (Node.js/Express)** - REST API and data management
3. **ML Service (Python/Flask)** - Demand prediction and insights

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (React/Vite)                      │
│  ┌──────────┐  ┌────────────┐  ┌──────────────┐            │
│  │ User     │  │   Admin    │  │   Analytics  │            │
│  │ Panel    │  │  Dashboard │  │  Components  │            │
│  └────┬─────┘  └─────┬──────┘  └──────┬───────┘            │
│       │              │                │                     │
│       └──────────────┴────────────────┘                     │
│                    ↓                                         │
│            Axios / React Router                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓ HTTP/REST
┌──────────────────────────────────────────────────────────────┐
│              Backend (Node.js/Express)                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Express Server                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │ Routes   │  │ Middleware│ │  Controllers     │   │  │
│  │  │ Auth     │  │ Auth JWT  │ │  Auth            │   │  │
│  │  │ Products │  │ Error     │ │  Products        │   │  │
│  │  │ Tracking │  │ Handler   │ │  Tracking        │   │  │
│  │  │ Analytics│  │ CORS      │ │  Analytics       │   │  │
│  │  │ ML       │  │           │ │  ML              │   │  │
│  │  └──────────┘  └──────────┘ └──────────────────┘   │  │
│  └────────────────────────────────────────────────────────┘  │
│       ↓                                       ↓               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Mongoose Models (ODM)                      │    │
│  │  Admin | Product | ClickEvent | Visitor | MLPred  │    │
│  └────────────────────┬────────────────────────────────┘    │
└─────────────────────────┼──────────────────────────────────────┘
                          │
                          ↓ MongoDB Protocol
┌──────────────────────────────────────────────────────────────┐
│           MongoDB Atlas (Database)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collections:                                        │   │
│  │  • admins           (User credentials)              │   │
│  │  • products         (Product catalog)               │   │
│  │  • clickevents      (Analytics data)                │   │
│  │  • visitors         (Session tracking)              │   │
│  │  • mlpredictions    (ML results)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                          ↑
                          │
┌──────────────────────────────────────────────────────────────┐
│         ML Service (Python/Flask)                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Scheduled Pipeline (Runs every hour)               │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │ Data Fetch   │  │  Preprocess  │                 │  │
│  │  │ from MongoDB │  │  Data        │                 │  │
│  │  └──────┬───────┘  └──────┬───────┘                 │  │
│  │         └──────────────────┘                         │  │
│  │              ↓                                        │  │
│  │         ┌─────────────────┐                          │  │
│  │         │  Train Models   │                          │  │
│  │         │  • Linear Reg   │                          │  │
│  │         │  • Decision Tree│                          │  │
│  │         │  • Trend Detect │                          │  │
│  │         └────────┬────────┘                          │  │
│  │                  ↓                                    │  │
│  │      ┌──────────────────────┐                        │  │
│  │      │ Generate             │                        │  │
│  │      │ Predictions &        │                        │  │
│  │      │ Recommendations      │                        │  │
│  │      └──────────┬───────────┘                        │  │
│  │               ↓                                       │  │
│  │    ┌─────────────────────────┐                       │  │
│  │    │ Store in MongoDB        │                       │  │
│  │    │ (mlpredictions table)   │                       │  │
│  │    └─────────────────────────┘                       │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18.2** - UI library
- **Vite 4.3** - Build tool (fast refresh)
- **Tailwind CSS 3.3** - Utility-first CSS
- **React Router v6** - Client-side routing
- **Axios 1.4** - HTTP client
- **Recharts 2.7** - Data visualization
- **Lucide React 0.263** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express 4.18** - Web framework
- **MongoDB/Mongoose** - Database & ODM
- **JWT (jwt-simple)** - Authentication
- **bcryptjs 2.4** - Password hashing
- **CORS** - Cross-origin support
- **Nodemon** - Dev auto-reload

### ML Service
- **Python 3.8+** - Programming language
- **Flask 2.3** - Web framework
- **Pandas 2.0** - Data manipulation
- **Scikit-learn 1.2** - Machine learning
- **NumPy 1.24** - Numerical computing
- **PyMongo 4.3** - MongoDB driver

### Database
- **MongoDB Atlas** - Cloud database
- **Indexes** - Performance optimization

## Data Flow

### User Interaction Flow
```
User visits site
    ↓
Frontend tracks visit → Backend /api/track/visit
    ↓
User browses products → Frontend fetches /api/products
    ↓
User clicks product → Frontend tracks click → Backend /api/track/click
    ↓
Redirect to Meesho
```

### Analytics Data Flow
```
Click events + Visitor data
    ↓
Stored in MongoDB
    ↓
ML Pipeline fetches data (hourly)
    ↓
Preprocess & extract features
    ↓
Train models
    ↓
Generate predictions
    ↓
Store in MLPredictions collection
    ↓
Admin views insights in dashboard
```

### Admin Workflow
```
Admin logs in → JWT token created
    ↓
Admin views dashboard → /api/analytics/overview
    ↓
Admin manages products → /api/products
    ↓
Admin views ML insights → /api/ml/recommendations
    ↓
Admin makes business decisions
```

## Folder Structure Explanation

```
client/
  src/
    components/       # Reusable UI components
    pages/           # Page-level components
    dashboard/       # Admin dashboard components
    services/        # API client & utilities
    context/         # React Context for state
    hooks/           # Custom React hooks
    utils/           # Helper functions
    App.jsx          # Main routing & layout
    main.jsx         # Entry point

server/
  models/            # MongoDB schemas
  controllers/       # Request handlers
  routes/            # API endpoint definitions
  middleware/        # Auth, error handling, CORS
  services/          # Business logic
  config/            # Configuration
  server.js          # Express app setup

ml-service/
  main.py            # Pipeline orchestrator
  train.py           # ML models
  preprocess.py      # Data preprocessing
  app.py             # Flask API
```

## Key Concepts

### Authentication Flow
1. User enters email & password
2. Backend validates credentials
3. Backend hashes password with bcryptjs
4. JWT token created and returned
5. Token stored in localStorage
6. Token sent in Authorization header for subsequent requests
7. Middleware verifies token on protected routes

### Tracking System
1. Each visitor gets unique session ID (UUID v4)
2. Stored in localStorage for persistence
3. Visit tracked with device, browser, timestamp
4. Product clicks tracked with product ID
5. Data aggregated for analytics

### ML Pipeline
1. **Daily Schedule**: Runs every hour (configurable)
2. **Data Aggregation**: Fetches last 30 days of data
3. **Feature Engineering**: Extracts relevant features
4. **Model Training**: Trains Linear Regression + Decision Tree
5. **Prediction**: Generates demand forecasts
6. **Storage**: Saves predictions to MongoDB
7. **Display**: Admin views in dashboard

### Analytics Calculations
- **Click Rate**: clicks / impressions * 100
- **CTR by Category**: Sum of category clicks
- **Unique Visitors**: Count distinct session IDs
- **Peak Hours**: Group visitors by hour
- **Device Breakdown**: Group by device type
- **Trend Score**: Based on recent vs. past clicks

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "data": { /* actual data */ },
  "message": "success/error message"
}
```

## Error Handling

### Frontend
- Axios interceptors catch errors
- Toast notifications for user feedback
- Error boundaries for React errors

### Backend
- Express error middleware
- Custom error messages
- Validation on input

### ML Service
- Try-catch blocks
- Logging errors
- Graceful degradation

## Security Features

1. **Authentication**: JWT tokens
2. **Password Security**: bcryptjs hashing
3. **Input Validation**: Express-validator
4. **CORS**: Configured for frontend domain
5. **Protected Routes**: Admin routes require JWT
6. **SQL Injection Prevention**: Mongoose prevents injection
7. **XSS Protection**: React escapes HTML

## Performance Optimizations

1. **Database Indexing**: Indexes on frequently queried fields
2. **Pagination**: Products paginated for frontend
3. **Lazy Loading**: Images load on demand
4. **Efficient Queries**: Aggregate queries for analytics
5. **Code Splitting**: React routes code-split
6. **Caching**: Can add Redis for session caching

## Monitoring & Logging

- Backend logs to console
- ML pipeline logs to console
- MongoDB logs available in Atlas
- Frontend errors logged to console

## Next Steps for Enhancement

1. **Advanced Features**
   - User accounts
   - Wishlist functionality
   - Reviews/ratings
   - Email notifications

2. **ML Improvements**
   - More advanced models
   - Real-time predictions
   - Customer segmentation
   - Churn prediction

3. **Performance**
   - Redis caching
   - Database optimization
   - Frontend lazy loading
   - Image compression

4. **Security**
   - Rate limiting
   - API key rotation
   - Audit logging
   - Two-factor authentication

5. **Deployment**
   - Docker containerization
   - CI/CD pipeline
   - Monitoring & alerting
   - Backup strategy

---

For detailed setup instructions, see QUICKSTART.md
For API documentation, see API_DOCUMENTATION.md
For deployment, see DEPLOYMENT.md
