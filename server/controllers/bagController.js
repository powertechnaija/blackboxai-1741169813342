const Bag = require('../models/Bag');
const cloudinary = require('../utils/cloudinary');
const { validateBag } = require('../utils/validation');

// Get all bags with filtering, sorting, and pagination
exports.getBags = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      category,
      brand,
      minPrice,
      maxPrice,
      color,
      size,
      search
    } = req.query;

    // Build query
    let query = {};

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by brand
    if (brand) {
      query.brand = brand;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) query['variants.price'].$gte = Number(minPrice);
      if (maxPrice) query['variants.price'].$lte = Number(maxPrice);
    }

    // Filter by color
    if (color) {
      query['variants.color'] = color;
    }

    // Filter by size
    if (size) {
      query['variants.size'] = size;
    }

    // Execute query with pagination
    const bags = await Bag.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total documents
    const count = await Bag.countDocuments(query);

    // Get unique categories, brands, colors, and sizes for filters
    const aggregateFilters = await Bag.aggregate([
      {
        $facet: {
          categories: [{ $group: { _id: '$category' } }],
          brands: [{ $group: { _id: '$brand' } }],
          colors: [{ $unwind: '$variants' }, { $group: { _id: '$variants.color' } }],
          sizes: [{ $unwind: '$variants' }, { $group: { _id: '$variants.size' } }]
        }
      }
    ]);

    res.json({
      bags,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalItems: count,
      filters: {
        categories: aggregateFilters[0].categories.map(c => c._id),
        brands: aggregateFilters[0].brands.map(b => b._id),
        colors: aggregateFilters[0].colors.map(c => c._id),
        sizes: aggregateFilters[0].sizes.map(s => s._id)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single bag by ID
exports.getBagById = async (req, res) => {
  try {
    const bag = await Bag.findById(req.params.id);
    if (!bag) {
      return res.status(404).json({ error: 'Bag not found' });
    }
    res.json(bag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new bag
exports.createBag = async (req, res) => {
  try {
    // Validate bag data
    const { error } = validateBag(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Upload images to cloudinary
    const imageUrls = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'fashion-bags'
        });
        imageUrls.push(result.secure_url);
      }
    }

    const bag = new Bag({
      ...req.body,
      images: imageUrls
    });

    await bag.save();
    res.status(201).json(bag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update bag
exports.updateBag = async (req, res) => {
  try {
    const { error } = validateBag(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Handle image updates if any
    if (req.files && req.files.length > 0) {
      const bag = await Bag.findById(req.params.id);
      
      // Delete old images from cloudinary
      for (const imageUrl of bag.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`fashion-bags/${publicId}`);
      }

      // Upload new images
      const imageUrls = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'fashion-bags'
        });
        imageUrls.push(result.secure_url);
      }
      req.body.images = imageUrls;
    }

    const updatedBag = await Bag.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedBag) {
      return res.status(404).json({ error: 'Bag not found' });
    }

    res.json(updatedBag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete bag
exports.deleteBag = async (req, res) => {
  try {
    const bag = await Bag.findById(req.params.id);
    if (!bag) {
      return res.status(404).json({ error: 'Bag not found' });
    }

    // Delete images from cloudinary
    for (const imageUrl of bag.images) {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`fashion-bags/${publicId}`);
    }

    await bag.remove();
    res.json({ message: 'Bag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add rating and review
exports.addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const bag = await Bag.findById(req.params.id);

    if (!bag) {
      return res.status(404).json({ error: 'Bag not found' });
    }

    // Check if user has already rated
    const existingRating = bag.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
    } else {
      bag.ratings.push({
        user: req.user._id,
        rating,
        review
      });
    }

    await bag.save();
    res.json(bag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bag ratings
exports.getBagRatings = async (req, res) => {
  try {
    const bag = await Bag.findById(req.params.id)
      .populate('ratings.user', 'name profileImage');

    if (!bag) {
      return res.status(404).json({ error: 'Bag not found' });
    }

    res.json(bag.ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update bag stock
exports.updateStock = async (req, res) => {
  try {
    const { variantId, quantity } = req.body;
    const bag = await Bag.findById(req.params.id);

    if (!bag) {
      return res.status(404).json({ error: 'Bag not found' });
    }

    const variant = bag.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    variant.stock = quantity;
    await bag.save();

    res.json(bag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get featured bags
exports.getFeaturedBags = async (req, res) => {
  try {
    const bags = await Bag.find({ featured: true })
      .limit(6)
      .sort('-averageRating');
    
    res.json(bags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
