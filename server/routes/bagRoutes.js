const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getBags,
  getBagById,
  createBag,
  updateBag,
  deleteBag,
  addRating,
  getBagRatings,
  updateStock,
  getFeaturedBags
} = require('../controllers/bagController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Public routes
router.get('/', getBags);
router.get('/featured', getFeaturedBags);
router.get('/:id', getBagById);
router.get('/:id/ratings', getBagRatings);

// Protected routes (requires authentication)
router.post('/:id/ratings', protect, addRating);

// Admin routes (requires admin role)
router.post('/', protect, admin, upload.array('images', 5), createBag);
router.put('/:id', protect, admin, upload.array('images', 5), updateBag);
router.delete('/:id', protect, admin, deleteBag);
router.put('/:id/stock', protect, admin, updateStock);

// Route parameters validation middleware
router.param('id', (req, res, next, id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid bag ID format' });
  }
  next();
});

module.exports = router;
