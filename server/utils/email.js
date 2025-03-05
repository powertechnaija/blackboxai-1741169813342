const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const emailTemplates = {
  verification: (name, url) => ({
    subject: 'Verify Your Email',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Welcome to Fashion Bags!</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering. Please verify your email by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, you can also click this link:</p>
        <p><a href="${url}">${url}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Fashion Bags Team</p>
      </div>
    `
  }),

  passwordReset: (name, url) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can also click this link:</p>
        <p><a href="${url}">${url}</a></p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Fashion Bags Team</p>
      </div>
    `
  }),

  orderConfirmation: (order) => ({
    subject: 'Order Confirmation',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Order Confirmation</h2>
        <p>Hello ${order.user.name},</p>
        <p>Thank you for your order! Here are your order details:</p>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9;">
          <h3>Order Summary</h3>
          <p>Order ID: ${order._id}</p>
          <p>Order Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
          
          <h4>Items:</h4>
          ${order.items.map(item => `
            <div style="margin-bottom: 10px;">
              <p>${item.bag.name} - ${item.variant.color}, ${item.variant.size}</p>
              <p>Quantity: ${item.quantity}</p>
              <p>Price: $${item.variant.price}</p>
            </div>
          `).join('')}
          
          <h4>Total Amount: $${order.totalAmount}</h4>
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Shipping Address:</h3>
          <p>${order.shippingAddress.street}</p>
          <p>${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
          <p>${order.shippingAddress.country}, ${order.shippingAddress.zipCode}</p>
        </div>
        
        <p>We'll send you another email when your order ships.</p>
        <p>Best regards,<br>Fashion Bags Team</p>
      </div>
    `
  }),

  orderShipped: (order) => ({
    subject: 'Your Order Has Been Shipped',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Order Shipped</h2>
        <p>Hello ${order.user.name},</p>
        <p>Your order has been shipped! Here are the tracking details:</p>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #f9f9f9;">
          <h3>Shipping Information</h3>
          <p>Order ID: ${order._id}</p>
          <p>Tracking Number: ${order.trackingInfo.trackingNumber}</p>
          <p>Carrier: ${order.trackingInfo.carrier}</p>
          ${order.trackingInfo.trackingUrl ? 
            `<p>Track your order: <a href="${order.trackingInfo.trackingUrl}">Click here</a></p>` : ''}
          <p>Estimated Delivery: ${new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString()}</p>
        </div>
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Fashion Bags Team</p>
      </div>
    `
  })
};

// Send email function
exports.sendEmail = async ({ to, template, data }) => {
  try {
    const { subject, html } = emailTemplates[template](data);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

// Verify email configuration
exports.verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email configuration verified');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

module.exports = exports;
