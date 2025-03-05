const Joi = require('joi');

// User validation schema
exports.validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(50),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      zipCode: Joi.string()
    })
  });

  return schema.validate(data);
};

// Login validation schema
exports.validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  });

  return schema.validate(data);
};

// Bag validation schema
exports.validateBag = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    description: Joi.string().required(),
    category: Joi.string().required().valid(
      'Handbag',
      'Shoulder Bag',
      'Tote',
      'Clutch',
      'Backpack',
      'Crossbody'
    ),
    brand: Joi.string().required(),
    variants: Joi.array().items(
      Joi.object({
        size: Joi.string().required().valid(
          'Small',
          'Medium',
          'Large',
          'Extra Large'
        ),
        color: Joi.string().required(),
        price: Joi.number().required().min(0),
        stock: Joi.number().required().min(0),
        sku: Joi.string().required()
      })
    ).min(1).required(),
    featured: Joi.boolean(),
    seoMetadata: Joi.object({
      metaTitle: Joi.string(),
      metaDescription: Joi.string(),
      keywords: Joi.array().items(Joi.string())
    })
  });

  return schema.validate(data);
};

// Order validation schema
exports.validateOrder = (data) => {
  const schema = Joi.object({
    items: Joi.array().items(
      Joi.object({
        bag: Joi.string().required(), // MongoDB ObjectId
        variant: Joi.object({
          size: Joi.string().required(),
          color: Joi.string().required(),
          price: Joi.number().required()
        }).required(),
        quantity: Joi.number().required().min(1)
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      zipCode: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().required().valid('stripe', 'paystack')
  });

  return schema.validate(data);
};

// Rating validation schema
exports.validateRating = (data) => {
  const schema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    review: Joi.string().max(500)
  });

  return schema.validate(data);
};

// Address validation schema
exports.validateAddress = (data) => {
  const schema = Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zipCode: Joi.string().required()
  });

  return schema.validate(data);
};

// Password reset validation schema
exports.validatePasswordReset = (data) => {
  const schema = Joi.object({
    password: Joi.string().required().min(6).max(50)
  });

  return schema.validate(data);
};

// Payment validation schema
exports.validatePayment = (data) => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    paymentMethod: Joi.string().required().valid('stripe', 'paystack'),
    amount: Joi.number().required().min(0),
    currency: Joi.string().default('USD'),
    email: Joi.string().email().required()
  });

  return schema.validate(data);
};

module.exports = exports;
