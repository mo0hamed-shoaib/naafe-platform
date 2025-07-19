import fetch from 'node-fetch';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import JobRequest from '../models/JobRequest.js';
import Offer from '../models/Offer.js';
import User from '../models/User.js';
import { logger } from '../middlewares/logging.middleware.js';

class PaymobService {
  constructor() {
    this.baseUrl = 'https://accept.paymob.com/api';
    this.authToken = null;
    this.tokenExpiry = null;
  }

  get apiKey() {
    return process.env.PAYMOB_API_KEY;
  }

  get iframeId() {
    return process.env.PAYMOB_IFRAME_ID;
  }

  get integrationId() {
    // Use the correct integration ID from Paymob dashboard
    return process.env.PAYMOB_INTEGRATION_ID || '5197919';
  }

  get hmacSecret() {
    return process.env.PAYMOB_HMAC_SECRET;
  }

  get publicKey() {
    return process.env.PAYMOB_PUBLIC_KEY;
  }

  get secretKey() {
    return process.env.PAYMOB_SECRET_KEY;
  }

  /**
   * Authenticate with Paymob and get access token
   */
  async authenticate() {
    try {
      // Check if we have a valid token
      if (this.authToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
        return this.authToken;
      }

      logger.info('Attempting Paymob authentication...');
      const response = await fetch(`${this.baseUrl}/auth/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey
        })
      });

      logger.info(`Paymob auth response status: ${response.status}`);
      
      if (response.status !== 200 && response.status !== 201) {
        const errorText = await response.text();
        logger.error(`Paymob auth error response: ${errorText}`);
        throw new Error(`Paymob authentication failed: ${response.status}`);
      }

      const data = await response.json();
      logger.info('Paymob auth response data received');
      
      if (!data.token) {
        logger.error('No token in Paymob response:', data);
        throw new Error('No token received from Paymob');
      }

      this.authToken = data.token;
      // Token expires in 24 hours, set expiry to 23 hours to be safe
      this.tokenExpiry = new Date(Date.now() + 23 * 60 * 60 * 1000);

      logger.info('Paymob authentication successful');
      return this.authToken;
    } catch (error) {
      logger.error('Paymob authentication error:', error);
      throw new Error('Failed to authenticate with Paymob');
    }
  }

  /**
   * Register order with Paymob
   */
  async registerOrder(orderData) {
    try {
      const token = await this.authenticate();

      const response = await fetch(`${this.baseUrl}/ecommerce/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: token,
          delivery_needed: false,
          amount_cents: Math.round(orderData.totalAmount * 100), // Convert to cents
          currency: orderData.currency,
          merchant_order_id: orderData.orderId,
          items: [
            {
              name: `Service Payment - ${orderData.jobTitle}`,
              amount_cents: Math.round(orderData.amount * 100),
              description: `Payment for service: ${orderData.jobTitle}`,
              quantity: 1
            },
            {
              name: 'Platform Commission',
              amount_cents: Math.round(orderData.commission * 100),
              description: 'Naafe platform commission',
              quantity: 1
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Paymob order registration failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.id) {
        throw new Error('No order ID received from Paymob');
      }

      logger.info(`Paymob order registered: ${data.id}`);
      return data;
    } catch (error) {
      logger.error('Paymob order registration error:', error);
      throw new Error('Failed to register order with Paymob');
    }
  }

  /**
   * Get payment key from Paymob
   */
  async getPaymentKey(orderData, paymobOrderId) {
    try {
      const token = await this.authenticate();

      const response = await fetch(`${this.baseUrl}/acceptance/payment_keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: token,
          amount_cents: Math.round(orderData.totalAmount * 100),
          expiration: 3600, // 1 hour
          order_id: paymobOrderId,
          billing_data: {
            apartment: 'NA',
            email: orderData.seekerEmail,
            floor: 'NA',
            first_name: orderData.seekerFirstName || 'Test',
            street: 'NA',
            building: 'NA',
            phone_number: orderData.seekerPhone || '+201234567890',
            shipping_method: 'NA',
            postal_code: 'NA',
            city: 'Cairo',
            country: 'EG',
            last_name: orderData.seekerLastName || 'User',
            state: 'Cairo',
            // Additional required fields
            company: 'NA',
            apartment_number: 'NA',
            floor_number: 'NA',
            street_number: 'NA',
            building_number: 'NA',
            shipping_method_id: 1,
            extra_description: `Payment for: ${orderData.jobTitle}`,
            payment_method: 'card'
          },
          currency: orderData.currency,
          integration_id: parseInt(this.integrationId),
          lock_order_when_paid: false
        })
      });

      if (!response.ok) {
        throw new Error(`Paymob payment key request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.token) {
        throw new Error('No payment key received from Paymob');
      }

      logger.info(`Paymob payment key generated: ${data.token}`);
      return data;
    } catch (error) {
      logger.error('Paymob payment key error:', error);
      throw new Error('Failed to get payment key from Paymob');
    }
  }

  /**
   * Verify HMAC signature from webhook
   */
  verifyHmacSignature(hmac, transactionId, amountCents, currency, orderId) {
    try {
      const concatenatedString = `${transactionId}${amountCents}${currency}${orderId}`;
      const calculatedHmac = crypto
        .createHmac('sha512', this.hmacSecret)
        .update(concatenatedString)
        .digest('hex');

      return hmac === calculatedHmac;
    } catch (error) {
      logger.error('HMAC verification error:', error);
      return false;
    }
  }

  /**
   * Create payment record in database
   */
  async createPaymentRecord(paymentData) {
    try {
      logger.info('Creating payment record with data:', {
        orderId: paymentData.orderId,
        jobRequestId: paymentData.jobRequestId,
        offerId: paymentData.offerId,
        seeker: paymentData.seekerId,
        provider: paymentData.providerId,
        amount: paymentData.amount,
        commission: paymentData.commission,
        totalAmount: paymentData.totalAmount,
        currency: paymentData.currency,
        paymobOrderId: paymentData.paymobOrderId,
        paymobPaymentKey: paymentData.paymobPaymentKey
      });

      const payment = new Payment({
        orderId: paymentData.orderId,
        jobRequestId: paymentData.jobRequestId,
        offerId: paymentData.offerId,
        seeker: paymentData.seekerId,
        provider: paymentData.providerId,
        amount: paymentData.amount,
        commission: paymentData.commission,
        totalAmount: paymentData.totalAmount,
        currency: paymentData.currency,
        paymobOrderId: paymentData.paymobOrderId,
        paymobPaymentKey: paymentData.paymobPaymentKey
      });

      await payment.save();
      logger.info(`Payment record created: ${payment._id}`);
      return payment;
    } catch (error) {
      logger.error('Error creating payment record:', error);
      logger.error('Error details:', error.message);
      if (error.errors) {
        logger.error('Validation errors:', Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        })));
      }
      throw new Error(`Failed to create payment record: ${error.message}`);
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(orderId, status, transactionData = null) {
    try {
      const updateData = {
        status,
        transactionData
      };

      if (status === 'completed') {
        updateData.completedAt = new Date();
      }

      const payment = await Payment.findOneAndUpdate(
        { orderId },
        updateData,
        { new: true }
      );

      if (!payment) {
        throw new Error('Payment not found');
      }

      logger.info(`Payment status updated: ${orderId} -> ${status}`);
      return payment;
    } catch (error) {
      logger.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }

  /**
   * Get payment by order ID
   */
  async getPaymentByOrderId(orderId) {
    try {
      const payment = await Payment.findOne({ orderId })
        .populate('jobRequestId')
        .populate('offerId')
        .populate('seeker', 'name email phone')
        .populate('provider', 'name email phone');

      return payment;
    } catch (error) {
      logger.error('Error getting payment:', error);
      throw new Error('Failed to get payment');
    }
  }

  /**
   * Generate iframe URL for payment
   */
  generateIframeUrl(paymentKey) {
    // Use iframe URL format with the correct iframe ID
    const iframeId = this.iframeId || '941127';
    return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;
  }

  /**
   * Process complete payment flow
   */
  async processPayment(paymentData) {
    try {
      // 1. Register order with Paymob
      const paymobOrder = await this.registerOrder(paymentData);
      
      // 2. Get payment key
      const paymentKeyData = await this.getPaymentKey(paymentData, paymobOrder.id);
      
      // 3. Create payment record
      const payment = await this.createPaymentRecord({
        ...paymentData,
        paymobOrderId: paymobOrder.id,
        paymobPaymentKey: paymentKeyData.token
      });

      // 4. Generate iframe URL
      const iframeUrl = this.generateIframeUrl(paymentKeyData.token);

      return {
        payment,
        iframeUrl,
        paymentKey: paymentKeyData.token,
        orderId: paymobOrder.id
      };
    } catch (error) {
      logger.error('Payment processing error:', error);
      throw error;
    }
  }
}

export default new PaymobService(); 