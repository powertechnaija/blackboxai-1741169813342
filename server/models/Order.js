const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    bag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bag',
      required: true
    },
    variant: {
      size: String,
      color: String,
      price: Number,
      sku: String
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },
  paymentInfo: {
    provider: {
      type: String,
      enum: ['stripe', 'paystack'],
      required: true
    },
    paymentId: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    reference: String,
    amount_paid: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    payment_date: Date,
    metadata: Object
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingInfo: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date
  },
  notes: String,
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  refundInfo: {
    status: {
      type: String,
      enum: ['none', 'requested', 'processing', 'completed', 'rejected'],
      default: 'none'
    },
    reason: String,
    amount: Number,
    date: Date
  }
}, {
  timestamps: true
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  }
  next();
});

// Instance method to update order status
orderSchema.methods.updateOrderStatus = async function(status) {
  this.orderStatus = status;
  if (status === 'delivered') {
    this.trackingInfo.deliveredAt = Date.now();
  }
  return this.save();
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function(userId) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);
};

// Index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ 'paymentInfo.status': 1 });
orderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
