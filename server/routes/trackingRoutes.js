const express = require('express');
const { trackVisit, trackClick, getProductClicks } = require('../controllers/trackingController');

const router = express.Router();

router.post('/visit', trackVisit);
router.post('/click', trackClick);
router.get('/clicks/:productId', getProductClicks);

module.exports = router;
