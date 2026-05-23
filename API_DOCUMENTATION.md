# Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth Endpoints

#### Register Admin
```
POST /auth/register
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "token": "jwt_token",
  "admin": {
    "id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Login Admin
```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "token": "jwt_token",
  "admin": {
    "id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Get Current Admin
```
GET /auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "admin": {
    "id": "admin_id",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin",
    "lastLogin": "2024-01-15T10:30:00Z"
  }
}
```

### Product Endpoints

#### Get All Products
```
GET /products?category=Electronics&search=laptop&page=1&limit=12

Response:
{
  "success": true,
  "count": 12,
  "total": 150,
  "pages": 13,
  "currentPage": 1,
  "products": [
    {
      "_id": "product_id",
      "title": "Product Title",
      "description": "Product Description",
      "image": "https://image-url.com",
      "category": "Electronics",
      "meeshoLink": "https://meesho.com/...",
      "clicks": 45,
      "impressions": 200,
      "stockStatus": "in-stock",
      "isActive": true,
      "createdAt": "2024-01-10T00:00:00Z"
    }
  ]
}
```

#### Get Single Product
```
GET /products/:productId

Response:
{
  "success": true,
  "product": {
    "_id": "product_id",
    "title": "Product Title",
    "description": "Product Description",
    "image": "https://image-url.com",
    "category": "Electronics",
    "meeshoLink": "https://meesho.com/...",
    "clicks": 45,
    "impressions": 200,
    "stockStatus": "in-stock",
    "isActive": true
  }
}
```

#### Create Product (Admin Only)
```
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Product",
  "description": "Product Description",
  "image": "https://image-url.com/image.jpg",
  "category": "Electronics",
  "meeshoLink": "https://meesho.com/product",
  "stockStatus": "in-stock"
}

Response:
{
  "success": true,
  "product": {
    "_id": "new_product_id",
    "title": "New Product",
    ...
  }
}
```

#### Update Product (Admin Only)
```
PUT /products/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "stockStatus": "out-of-stock"
}

Response:
{
  "success": true,
  "product": {
    "_id": "product_id",
    "title": "Updated Title",
    "stockStatus": "out-of-stock",
    ...
  }
}
```

#### Delete Product (Admin Only)
```
DELETE /products/:productId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Product deleted"
}
```

### Tracking Endpoints

#### Track Visit
```
POST /track/visit
Content-Type: application/json

{
  "sessionId": "uuid-v4",
  "page": "/products",
  "device": "mobile",
  "browser": "Chrome",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}

Response:
{
  "success": true,
  "sessionId": "uuid-v4"
}
```

#### Track Click
```
POST /track/click
Content-Type: application/json

{
  "productId": "product_id",
  "sessionId": "uuid-v4",
  "device": "mobile",
  "browser": "Chrome",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}

Response:
{
  "success": true,
  "clickEvent": {
    "_id": "click_event_id",
    "productId": "product_id",
    "sessionId": "uuid-v4",
    "timestamp": "2024-01-15T10:30:00Z",
    "device": "mobile",
    "browser": "Chrome"
  }
}
```

#### Get Product Clicks
```
GET /track/clicks/:productId

Response:
{
  "success": true,
  "productId": "product_id",
  "clicks": 45,
  "impressions": 200,
  "clickRate": "22.50"
}
```

### Analytics Endpoints

#### Get Overview (Admin Only)
```
GET /analytics/overview
Authorization: Bearer <token>

Response:
{
  "success": true,
  "overview": {
    "totalVisitors": 1500,
    "totalClicks": 3200,
    "totalProducts": 50,
    "todayVisitors": 120,
    "mostClickedProduct": {
      "_id": "product_id",
      "title": "Product Name",
      "clicks": 250
    },
    "leastClickedProduct": {
      "_id": "product_id",
      "title": "Product Name",
      "clicks": 5
    }
  }
}
```

#### Get Traffic Analytics (Admin Only)
```
GET /analytics/traffic?days=30
Authorization: Bearer <token>

Response:
{
  "success": true,
  "traffic": {
    "dailyTraffic": [
      {
        "_id": "2024-01-15",
        "visitors": 120
      }
    ],
    "deviceBreakdown": [
      {
        "_id": "mobile",
        "count": 800
      }
    ],
    "browserBreakdown": [
      {
        "_id": "Chrome",
        "count": 600
      }
    ],
    "hourlyTraffic": [
      {
        "_id": 10,
        "count": 45
      }
    ]
  }
}
```

#### Get Product Analytics (Admin Only)
```
GET /analytics/products?days=30
Authorization: Bearer <token>

Response:
{
  "success": true,
  "productAnalytics": {
    "productPerformance": [...],
    "categoryPerformance": [...],
    "topProducts": [...]
  }
}
```

#### Get User Analytics (Admin Only)
```
GET /analytics/users?days=30
Authorization: Bearer <token>

Response:
{
  "success": true,
  "userAnalytics": {
    "returningVsNew": [
      {
        "_id": true,
        "count": 300
      }
    ],
    "totalSessions": 1500,
    "avgSessionDuration": 245.5,
    "topPages": [...]
  }
}
```

### ML Endpoints

#### Get Recommendations (Admin Only)
```
GET /ml/recommendations
Authorization: Bearer <token>

Response:
{
  "success": true,
  "recommendations": {
    "promote": [...],
    "maintain": [...],
    "reduce": [...],
    "discontinue": [...]
  }
}
```

#### Get Trending Products (Admin Only)
```
GET /ml/trending
Authorization: Bearer <token>

Response:
{
  "success": true,
  "trendingProducts": [
    {
      "_id": "prediction_id",
      "productId": {
        "_id": "product_id",
        "title": "Product Name"
      },
      "trendScore": 85,
      "isIncreasing": true
    }
  ]
}
```

#### Get Demand Analysis (Admin Only)
```
GET /ml/demand-analysis
Authorization: Bearer <token>

Response:
{
  "success": true,
  "demandAnalysis": {
    "overview": [
      {
        "_id": "high",
        "count": 15,
        "avgTrendScore": 78.5,
        "avgConfidence": 0.85
      }
    ],
    "highDemandProducts": [...],
    "lowDemandProducts": [...]
  }
}
```

## Error Responses

### Unauthorized
```
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Not Found
```
{
  "success": false,
  "message": "Resource not found"
}
```

### Validation Error
```
{
  "success": false,
  "message": ["Field is required", "Email is invalid"]
}
```

### Server Error
```
{
  "success": false,
  "message": "Server Error"
}
```

## Rate Limiting
- No rate limiting implemented in basic version
- Recommended for production: 100 requests per minute per IP

## CORS Configuration
- Allowed origin: FRONTEND_URL from environment
- Allowed methods: GET, POST, PUT, DELETE
- Allowed headers: Content-Type, Authorization
