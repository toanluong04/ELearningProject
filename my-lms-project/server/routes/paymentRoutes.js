// server/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Standard JSON route for creating the Stripe Checkout session
router.post('/create-checkout-session', paymentController.createCheckoutSession);

module.exports = router;