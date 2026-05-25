const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');

// POST /api/contact/send-email
router.post('/send-email', sendContactEmail);

module.exports = router;
