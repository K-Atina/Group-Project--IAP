# M-Pesa (Daraja API) Integration Guide

## Overview
This integration allows ticket buyers to pay using M-Pesa STK Push (Lipa na M-Pesa Online). When a user purchases a ticket, they receive a prompt on their phone to enter their M-Pesa PIN and complete the payment.

## Setup Instructions

### 1. Get Daraja API Credentials

**For Testing (Sandbox):**
1. Visit: https://developer.safaricom.co.ke/
2. Sign up for an account
3. Create a new app
4. Select "Lipa Na M-Pesa Online" product
5. Get your credentials:
   - Consumer Key
   - Consumer Secret
   - Passkey (provided in test credentials)

**For Production:**
1. Go through Safaricom's approval process
2. Get your production credentials
3. Use your actual Paybill/Till number

### 2. Configure Environment Variables

Update `.env` file with your credentials:

```env
MPESA_ENVIRONMENT=sandbox  # Change to 'production' for live
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379  # Sandbox shortcode (replace with yours for production)
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=http://localhost:8080/api/mpesa/callback
```

### 3. Update MpesaService.php

Edit `backend/src/Services/MpesaService.php` and update the constructor with your credentials:

```php
if ($this->environment === 'sandbox') {
    $this->consumerKey = 'YOUR_SANDBOX_CONSUMER_KEY';
    $this->consumerSecret = 'YOUR_SANDBOX_CONSUMER_SECRET';
    $this->shortcode = '174379';
    $this->passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
}
```

### 4. Setup Callback URL (For Production)

For production, you need a public URL for callbacks:

**Option A: Use Ngrok (for testing)**
```bash
ngrok http 8080
```
Then update the callback URL to: `https://your-ngrok-url.ngrok.io/api/mpesa/callback`

**Option B: Deploy to a server**
Use your actual domain: `https://yourdomain.com/api/mpesa/callback`

## API Endpoints

### 1. Initiate Payment (STK Push)

**Endpoint:** `POST /api/mpesa/initiate`

**Request Body:**
```json
{
  "phone_number": "254712345678",
  "amount": 1500,
  "event_id": 1,
  "ticket_type_id": 1,
  "quantity": 2
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment request sent. Please check your phone.",
  "order_id": 123,
  "order_reference": "ORD-ABC123",
  "checkout_request_id": "ws_CO_DMZ_123456789_12345678"
}
```

### 2. Query Payment Status

**Endpoint:** `POST /api/mpesa/query`

**Request Body:**
```json
{
  "checkout_request_id": "ws_CO_DMZ_123456789_12345678"
}
```

### 3. Callback (Automatic)

**Endpoint:** `POST /api/mpesa/callback`

This endpoint is called automatically by Safaricom when payment is completed/failed.

## Frontend Integration Example

```typescript
// In your checkout component
const initiatePayment = async (phoneNumber: string, amount: number) => {
  try {
    const response = await fetch('/api/mpesa/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        phone_number: phoneNumber,
        amount: amount,
        event_id: eventId,
        ticket_type_id: ticketTypeId,
        quantity: quantity
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show success message
      alert('Please check your phone to complete payment');
      
      // Poll for payment status
      pollPaymentStatus(data.checkout_request_id);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
};

const pollPaymentStatus = async (checkoutRequestId: string) => {
  // Poll every 5 seconds for up to 2 minutes
  let attempts = 0;
  const maxAttempts = 24; // 2 minutes
  
  const interval = setInterval(async () => {
    attempts++;
    
    const response = await fetch('/api/mpesa/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkout_request_id: checkoutRequestId
      })
    });
    
    const data = await response.json();
    
    if (data.data.ResultCode === '0') {
      // Payment successful
      clearInterval(interval);
      alert('Payment successful!');
      // Redirect to success page
    } else if (attempts >= maxAttempts) {
      // Timeout
      clearInterval(interval);
      alert('Payment status check timed out. Please check your orders.');
    }
  }, 5000);
};
```

## Testing with Sandbox

**Test Phone Numbers:**
- Format: 254XXXXXXXXX (Kenyan format)
- Example: 254712345678

**Test Process:**
1. Call the initiate endpoint with test phone number
2. You'll receive an STK push on the Safaricom test app
3. Enter PIN: **Provided by Safaricom in sandbox docs**
4. Payment will be processed
5. Callback will update order status automatically

## Phone Number Format

The system automatically formats phone numbers:
- `0712345678` → `254712345678`
- `712345678` → `254712345678`
- `+254712345678` → `254712345678`

## Order Status Flow

1. **Pending** - Order created, waiting for payment
2. **Payment Initiated** - STK push sent
3. **Completed** - Payment successful (via callback)
4. **Failed/Cancelled** - Payment failed or user cancelled

## Database Schema

The `orders` table tracks M-Pesa payments:
- `payment_reference` - Stores CheckoutRequestID
- `payment_status` - pending, completed, failed
- `status` - pending, confirmed, cancelled

## Security Notes

1. **Never expose credentials** in frontend code
2. **Validate callbacks** - Ensure they're from Safaricom
3. **Use HTTPS** in production
4. **Whitelist callback IPs** if possible
5. **Store sensitive data** in environment variables

## Troubleshooting

### Error: "Invalid Access Token"
- Check your Consumer Key and Secret
- Ensure they're correctly copied (no extra spaces)

### Error: "Bad Request - Invalid PhoneNumber"
- Ensure phone number is in format 254XXXXXXXXX
- Must be a valid Safaricom number

### No STK Push Received
- Check phone number format
- Verify shortcode and passkey
- Check if phone has network connection

### Callback Not Received
- Ensure callback URL is publicly accessible
- Check firewall settings
- Use ngrok for local testing

## Production Checklist

- [ ] Get production credentials from Safaricom
- [ ] Update environment to 'production'
- [ ] Use your actual Paybill/Till number
- [ ] Set up public callback URL with HTTPS
- [ ] Test with small amounts first
- [ ] Implement proper error logging
- [ ] Set up monitoring for failed transactions
- [ ] Implement retry logic for failed payments
- [ ] Add email notifications for payment status

## Support

For M-Pesa API issues, contact:
- Daraja Support: https://developer.safaricom.co.ke/
- Email: apisupport@safaricom.co.ke
