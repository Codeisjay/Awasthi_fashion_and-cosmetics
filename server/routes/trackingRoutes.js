const express = require('express');
const { trackVisit, trackClick, getProductClicks } = require('../controllers/trackingController');

const router = express.Router();

// Debug endpoint - test if server is receiving requests
router.post('/test', (req, res) => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║          [TEST ENDPOINT] Request Received            ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('[Test] Request body:', JSON.stringify(req.body, null, 2));
  console.log('[Test] Headers:', {
    contentType: req.headers['content-type'],
    userAgent: req.headers['user-agent']
  });
  
  res.status(200).json({
    success: true,
    message: 'Test endpoint is working!',
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// Tracking routes
router.post('/visit', trackVisit);
router.post('/click', trackClick);
router.get('/clicks/:productId', getProductClicks);

module.exports = router;
