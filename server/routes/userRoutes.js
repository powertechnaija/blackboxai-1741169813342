const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
  register,
  login,
  getProfile,
  updateProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserOrders,
  getAllUsers,
  deleteUser,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes (requires authentication)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.get('/orders', protect, getUserOrders);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:bagId', protect, removeFromWishlist);

// Admin routes (requires admin role)
router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);

// Route parameters validation middleware
router.param('id', (req, res, next, id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  next();
});

router.param('bagId', (req, res, next, id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid bag ID format' });
  }
  next();
});

router.param('token', (req, res, next, token) => {
  if (!token.match(/^[0-9a-fA-F]{40}$/)) {
    return res.status(400).json({ error: 'Invalid token format' });
  }
  next();
});

// Input validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

// Rate limiting for auth routes
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many attempts, please try again after 15 minutes'
});

router.use('/login', authLimiter);
router.use('/forgot-password', authLimiter);
router.use('/reset-password', authLimiter);

module.exports = router;
