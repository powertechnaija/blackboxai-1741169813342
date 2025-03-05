const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createStripeCheckout,
  initializePaystackPayment,
  stripeWebhook,
  paystackWebhook,
  verifyPaystackPayment,
  getOrderStatus,
  requestRefund
} = require('../controllers/paymentController');

// Stripe webhook (must be raw body)
router.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Paystack webhook
router.post(
  '/webhook/paystack',
  express.json(),
  paystackWebhook
);

// Protected routes (requires authentication)
router.post('/stripe/create-checkout', protect, createStripeCheckout);
router.post('/paystack/initialize', protect, initializePaystackPayment);
router.get('/paystack/verify/:reference', protect, verifyPaystackPayment);
router.get('/order/:orderId', protect, getOrderStatus);
router.post('/order/:orderId/refund', protect, requestRefund);

// Input validation middleware
const { validatePayment } = require('../utils/validation');
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

// Apply validation to payment routes
router.post('/stripe/create-checkout', validateRequest(validatePayment));
router.post('/paystack/initialize', validateRequest(validatePayment));

// Rate limiting for payment routes
const rateLimit = require('express-rate-limit');

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 payment attempts per windowMs
  message: 'Too many payment attempts, please try again after 15 minutes'
});

router.use('/stripe/create-checkout', paymentLimiter);
router.use('/paystack/initialize', paymentLimiter);

// Route parameters validation middleware
router.param('orderId', (req, res, next, id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid order ID format' });
  }
  next();
});

router.param('reference', (req, res, next, ref) => {
  if (!ref.match(/^[a-zA-Z0-9_-]+$/)) {
    return res.status(400).json({ error: 'Invalid reference format' });
  }
  next();
});

// Error handling for payment routes
router.use((err, req, res, next) => {
  if (err.type === 'StripeCardError') {
    return res.status(402).json({ error: err.message });
  }
  if (err.name === 'PaystackError') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
