import api from './api';

export const paymentService = {
  // Stripe payment methods
  createStripeCheckout: async (orderData) => {
    const response = await api.post('/payments/stripe/create-checkout', orderData);
    return response.data;
  },

  // Paystack payment methods
  initializePaystackPayment: async (orderData) => {
    const response = await api.post('/payments/paystack/initialize', orderData);
    return response.data;
  },

  verifyPaystackPayment: async (reference) => {
    const response = await api.get(`/payments/paystack/verify/${reference}`);
    return response.data;
  },

  // Order methods
  getOrderStatus: async (orderId) => {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data;
  },

  requestRefund: async (orderId, reason) => {
    const response = await api.post(`/payments/order/${orderId}/refund`, { reason });
    return response.data;
  },

  // Payment methods
  getPaymentMethods: async () => {
    return [
      {
        id: 'stripe',
        name: 'Credit Card (Stripe)',
        icon: 'credit-card',
        description: 'Pay securely with your credit card via Stripe'
      },
      {
        id: 'paystack',
        name: 'Paystack',
        icon: 'paystack',
        description: 'Pay securely with Paystack'
      }
    ];
  },

  // Webhook endpoints (these are handled server-side)
  stripeWebhookEndpoint: '/payments/webhook/stripe',
  paystackWebhookEndpoint: '/payments/webhook/paystack',

  // Helper methods
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  validatePaymentData: (data) => {
    const requiredFields = ['items', 'shippingAddress', 'paymentMethod'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (data.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const { street, city, state, country, zipCode } = data.shippingAddress;
    if (!street || !city || !state || !country || !zipCode) {
      throw new Error('Invalid shipping address');
    }

    if (!['stripe', 'paystack'].includes(data.paymentMethod)) {
      throw new Error('Invalid payment method');
    }

    return true;
  },

  calculateOrderTotals: (items) => {
    return items.reduce(
      (totals, item) => {
        const itemTotal = item.variant.price * item.quantity;
        return {
          subtotal: totals.subtotal + itemTotal,
          total: totals.total + itemTotal,
          items: totals.items + item.quantity
        };
      },
      { subtotal: 0, total: 0, items: 0 }
    );
  }
};

export default paymentService;
