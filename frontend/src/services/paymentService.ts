// We don't need to load Stripe.js for hosted checkout
// The hosted checkout page handles everything

export interface CreateCheckoutSessionRequest {
  conversationId: string;
  amount: number;
  serviceTitle: string;
  providerId: string;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    url: string;
  };
  message?: string;
}

export const createCheckoutSession = async (
  data: CreateCheckoutSessionRequest,
  accessToken: string
): Promise<CreateCheckoutSessionResponse> => {
  try {
    console.log('Making payment request to:', '/api/payment/create-checkout-session');
    console.log('Request data:', data);
    
    const response = await fetch('/api/payment/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      return {
        success: false,
        data: { sessionId: '', url: '' },
        message: `HTTP ${response.status}: ${errorText}`
      };
    }

    const result = await response.json();
    console.log('Response result:', result);
    return result;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      data: { sessionId: '', url: '' },
      message: 'حدث خطأ أثناء إنشاء جلسة الدفع'
    };
  }
};

export const redirectToCheckout = async (sessionUrl: string) => {
  try {
    window.location.href = sessionUrl;
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw new Error('فشل في الانتقال إلى صفحة الدفع');
  }
};

// Not needed for hosted checkout
export const getStripe = () => null;

// Test function to verify proxy is working
export const testPaymentConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing payment connection...');
    const response = await fetch('/api/payment/test');
    const result = await response.json();
    console.log('Payment test result:', result);
    return result.success === true;
  } catch (error) {
    console.error('Payment connection test failed:', error);
    return false;
  }
}; 