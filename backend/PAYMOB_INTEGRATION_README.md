# Paymob Payment Gateway Integration

This document describes the complete integration of Paymob payment gateway into the Naafe platform for handling service payments between seekers and providers.

## 🏗️ Architecture Overview

The payment system follows a secure, event-driven architecture with the following components:

- **Payment Model**: Stores payment transactions and status
- **Paymob Service**: Handles all Paymob API interactions
- **Payment Controller**: Manages payment endpoints and webhooks
- **Socket.IO Integration**: Real-time payment notifications
- **Frontend Components**: Payment UI and user experience

## 🔧 Backend Setup

### 1. Environment Variables

Add the following variables to your `.env` file:

```env
# Paymob Configuration
PAYMOB_API_KEY=your_api_key_here
PAYMOB_IFRAME_ID=your_iframe_id_here
PAYMOB_INTEGRATION_ID=your_integration_id_here
PAYMOB_HMAC_SECRET=your_hmac_secret_here
PAYMOB_PUBLIC_KEY=your_public_key_here
PAYMOB_SECRET_KEY=your_secret_key_here
```

### 2. Database Schema

The `Payment` model includes:

```javascript
{
  orderId: String,           // Unique order identifier
  jobRequestId: ObjectId,    // Reference to job request
  offerId: ObjectId,         // Reference to accepted offer
  seeker: ObjectId,          // User who pays
  provider: ObjectId,        // User who receives payment
  amount: Number,            // Service amount
  commission: Number,        // Platform commission (10%)
  totalAmount: Number,       // Total to pay
  currency: String,          // Currency (EGP, USD, EUR)
  status: String,            // pending, processing, completed, failed, cancelled
  paymobOrderId: String,     // Paymob's order ID
  paymobPaymentKey: String,  // Paymob's payment key
  paymobTransactionId: String, // Paymob's transaction ID
  paymentMethod: String,     // card, wallet, cash, bank_transfer
  transactionData: Mixed,    // Raw Paymob response data
  completedAt: Date,         // Payment completion timestamp
  failureReason: String      // Reason for failure if any
}
```

### 3. API Endpoints

#### Create Payment Order
```http
POST /api/paymob/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobRequestId": "507f1f77bcf86cd799439011",
  "offerId": "507f1f77bcf86cd799439012"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "NAAFE_1234567890_abc123",
    "iframeUrl": "https://accept.paymob.com/standalone?payment_token=...",
    "paymentKey": "payment_key_here",
    "amount": 1000,
    "commission": 100,
    "totalAmount": 1100,
    "currency": "EGP"
  }
}
```

#### Get Payment Status
```http
GET /api/paymob/status/:orderId
Authorization: Bearer <token>
```

#### Get Payment History
```http
GET /api/paymob/history?page=1&limit=10
Authorization: Bearer <token>
```

#### Paymob Webhook
```http
POST /api/paymob/webhook
Content-Type: application/json

{
  "type": "TRANSACTION",
  "obj": {
    "id": "transaction_id",
    "amount_cents": 110000,
    "currency": "EGP",
    "order": { "id": "paymob_order_id" },
    "hmac": "hmac_signature",
    "success": true,
    "is_captured": true
  }
}
```

## 🎨 Frontend Integration

### 1. Payment Components

#### PaymentModal
- Displays Paymob iframe for secure payment
- Shows payment status and order summary
- Handles success/failure states

#### OrderSummary
- Displays payment breakdown
- Shows service amount, commission, and total
- Includes security and commission information

#### MarkCompletedButton
- Triggers payment flow for completed services
- Allows proof upload (optional)
- Shows payment summary before proceeding

### 2. Integration in ChatPage

The payment flow is integrated into the chat interface:

```typescript
// Payment section appears for seekers when job is in progress
{isSeeker && isJobInProgress && !isJobCompleted && (
  <div className="p-4 border-t border-gray-100 bg-warm-cream">
    <MarkCompletedButton
      jobRequestId={conversation.jobRequestId._id}
      offerId={conversation._id}
      jobTitle={conversation.jobRequestId.title}
      amount={1000}
      onPaymentInitiated={handlePaymentInitiated}
    />
  </div>
)}

// Payment modal for iframe display
{showPaymentModal && paymentData && (
  <PaymentModal
    isOpen={showPaymentModal}
    onClose={() => setShowPaymentModal(false)}
    iframeUrl={paymentData.iframeUrl}
    orderId={paymentData.orderId}
    amount={paymentData.amount}
    commission={paymentData.commission}
    totalAmount={paymentData.totalAmount}
    currency={paymentData.currency}
    onPaymentSuccess={handlePaymentSuccess}
    onPaymentFailure={handlePaymentFailure}
  />
)}
```

## 🔄 Payment Flow

### 1. Service Completion
1. Provider completes the service
2. Seeker clicks "إتمام الخدمة والدفع" (Complete Service & Pay)
3. System shows payment summary with proof upload option

### 2. Payment Initiation
1. Seeker confirms payment details
2. Backend creates payment order with Paymob
3. System generates secure iframe URL
4. Payment modal opens with Paymob iframe

### 3. Payment Processing
1. User completes payment in Paymob iframe
2. Paymob sends webhook to backend
3. Backend verifies HMAC signature
4. System updates payment status and job status
5. Real-time notifications sent via Socket.IO

### 4. Completion
1. Payment success triggers job completion
2. Both users receive notifications
3. Payment record stored in database
4. UI updates to reflect completed status

## 🔐 Security Features

### 1. HMAC Verification
All webhook requests are verified using HMAC-SHA512:

```javascript
const concatenatedString = `${transactionId}${amountCents}${currency}${orderId}`;
const calculatedHmac = crypto
  .createHmac('sha512', hmacSecret)
  .update(concatenatedString)
  .digest('hex');
```

### 2. Authentication
- All payment endpoints require valid JWT tokens
- Users can only access their own payments
- Offer validation ensures payment for accepted offers only

### 3. Data Validation
- Input validation using express-validator
- MongoDB schema validation
- Type checking in TypeScript frontend

## 📡 Real-time Notifications

### Socket.IO Events

#### Payment Initiated
```javascript
socket.emit('payment:initiated', {
  jobRequestId: 'job_id',
  orderId: 'order_id',
  amount: 1100
});
```

#### Payment Completed
```javascript
socket.emit('payment:completed', {
  jobRequestId: 'job_id',
  orderId: 'order_id',
  amount: 1100,
  status: 'completed'
});
```

### Notification Types
- `payment_initiated`: Payment process started
- `payment_completed`: Payment successful
- `payment_failed`: Payment failed

## 🧪 Testing

### 1. Run Integration Test
```bash
cd backend
node test-payment.js
```

### 2. Test Payment Flow
1. Create a job request
2. Accept an offer
3. Mark job as in progress
4. Initiate payment in chat
5. Complete payment in sandbox
6. Verify webhook processing

### 3. Sandbox Testing
Use Paymob's sandbox environment for testing:
- Test cards: 4111 1111 1111 1111
- Test wallets: Various test wallet numbers
- Test scenarios: Success, failure, pending

## 🚀 Deployment

### 1. Production Setup
1. Update environment variables with production Paymob credentials
2. Configure webhook URL in Paymob dashboard
3. Set up SSL certificate for secure webhook delivery
4. Configure database indexes for performance

### 2. Monitoring
- Monitor webhook delivery success rates
- Track payment completion rates
- Log payment failures for investigation
- Monitor HMAC verification failures

### 3. Error Handling
- Graceful handling of Paymob API failures
- Retry mechanisms for failed webhooks
- User-friendly error messages
- Fallback payment methods (if needed)

## 📊 Commission Structure

- **Platform Commission**: 10% of service amount
- **Provider Receives**: 90% of service amount
- **Currency**: EGP (Egyptian Pound) by default
- **Payment Methods**: Cards, wallets, bank transfers

## 🔧 Troubleshooting

### Common Issues

1. **Webhook Not Received**
   - Check webhook URL configuration
   - Verify server accessibility
   - Check firewall settings

2. **HMAC Verification Failed**
   - Verify HMAC secret in environment
   - Check webhook payload format
   - Ensure proper string concatenation

3. **Payment Status Not Updated**
   - Check database connection
   - Verify webhook processing
   - Check notification delivery

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## 📚 Additional Resources

- [Paymob API Documentation](https://developers.paymob.com/egypt/getting-started-egypt)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Payment Schema](backend/models/Payment.js)
- [Payment Service Implementation](backend/services/paymobService.js)

## 🤝 Support

For technical support or questions about the payment integration:
- Check the logs for detailed error messages
- Review Paymob's status page for service issues
- Contact the development team for custom modifications 