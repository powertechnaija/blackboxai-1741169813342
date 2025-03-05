const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');
const Bag = require('../models/Bag');

// Helper function to validate stock availability
const validateStock = async (items) => {
  for (const item of items) {
    const bag = await Bag.findById(item.bag);
    const variant = bag.variants.find(v => 
      v.size === item.variant.size && 
      v.color === item.variant.color
    );
    
    if (!variant || variant.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${bag.name} - ${item.variant.color} ${item.variant.size}`);
    }
  }
};

// Helper function to update stock after successful payment
const updateStock = async (items) => {
  for (const item of items) {
    await Bag.findOneAndUpdate(
      { 
        _id: item.bag,
        'variants.size': item.variant.size,
        'variants.color': item.variant.color
      },
      { 
        $inc: { 'variants.$.stock': -item.quantity }
      }
    );
  }
};

// Stripe Payment Integration
exports.createStripeCheckout = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    // Validate stock availability
    await validateStock(items);

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.bag.name,
            description: `${item.variant.color} - ${item.variant.size}`,
          },
          unit_amount: item.variant.price * 100, // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: req.user._id.toString(),
        shippingAddress: JSON.stringify(shippingAddress)
      }
    });

    // Create pending order
    const order = new Order({
      user: req.user._id,
      items: items.map(item => ({
        bag: item.bag,
        variant: item.variant,
        quantity: item.quantity,
        subtotal: item.variant.price * item.quantity
      })),
      totalAmount,
      shippingAddress,
      paymentInfo: {
        provider: 'stripe',
        paymentId: session.id,
        status: 'pending'
      }
    });

    await order.save();

    res.json({ 
      sessionId: session.id,
      orderId: order._id
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Paystack Payment Integration
exports.initializePaystackPayment = async (req, res) => {
  try {
    const { items, shippingAddress, email } = req.body;
    
    // Validate stock availability
    await validateStock(items);

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
    
    // Initialize Paystack transaction
    const response = await paystack.transaction.initialize({
      email,
      amount: totalAmount * 100, // Convert to kobo/cents
      metadata: {
        userId: req.user._id.toString(),
        items: JSON.stringify(items),
        shippingAddress: JSON.stringify(shippingAddress)
      }
    });

    // Create pending order
    const order = new Order({
      user: req.user._id,
      items: items.map(item => ({
        bag: item.bag,
        variant: item.variant,
        quantity: item.quantity,
        subtotal: item.variant.price * item.quantity
      })),
      totalAmount,
      shippingAddress,
      paymentInfo: {
        provider: 'paystack',
        reference: response.data.reference,
        status: 'pending'
      }
    });

    await order.save();

    res.json({ 
      authorizationUrl: response.data.authorization_url,
      reference: response.data.reference,
      orderId: order._id
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Stripe Webhook Handler
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const order = await Order.findOne({
        'paymentInfo.paymentId': session.id
      });

      if (order) {
        order.paymentInfo.status = 'completed';
        order.paymentInfo.payment_date = new Date();
        await order.save();
        
        // Update stock levels
        await updateStock(order.items);
      }
    } catch (error) {
      console.error('Error processing Stripe webhook:', error);
    }
  }

  res.json({ received: true });
};

// Paystack Webhook Handler
exports.paystackWebhook = async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const order = await Order.findOne({
        'paymentInfo.reference': event.data.reference
      });

      if (order) {
        order.paymentInfo.status = 'completed';
        order.paymentInfo.payment_date = new Date();
        order.paymentInfo.metadata = event.data;
        await order.save();

        // Update stock levels
        await updateStock(order.items);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing Paystack webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify Paystack Payment
exports.verifyPaystackPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const response = await paystack.transaction.verify(reference);
    
    if (response.data.status === 'success') {
      const order = await Order.findOne({
        'paymentInfo.reference': reference
      });

      if (order && order.paymentInfo.status !== 'completed') {
        order.paymentInfo.status = 'completed';
        order.paymentInfo.payment_date = new Date();
        order.paymentInfo.metadata = response.data;
        await order.save();

        // Update stock levels
        await updateStock(order.items);
      }

      res.json({ status: 'success', order });
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Order Status
exports.getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('items.bag')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request Refund
exports.requestRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentInfo.status !== 'completed') {
      return res.status(400).json({ error: 'Cannot request refund for incomplete payment' });
    }

    if (order.refundInfo.status !== 'none') {
      return res.status(400).json({ error: 'Refund already requested' });
    }

    order.refundInfo = {
      status: 'requested',
      reason,
      amount: order.totalAmount,
      date: new Date()
    };

    await order.save();

    res.json({ message: 'Refund requested successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
