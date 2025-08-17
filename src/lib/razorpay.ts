// Razorpay integration for premium subscriptions
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const RAZORPAY_KEY = 'rzp_test_1234567890'; // Replace with your actual key

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number, planId: string, userId: string) => {
  // In a real app, this would call your backend API
  // For demo purposes, we'll simulate the order creation
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: orderId,
    amount: amount * 100, // Razorpay expects amount in paise
    currency: 'INR',
    status: 'created'
  };
};

export const verifyPayment = async (
  paymentId: string,
  orderId: string,
  signature: string,
  planId: string,
  userId: string
) => {
  // In a real app, this would verify the payment on your backend
  // For demo purposes, we'll simulate successful verification
  console.log('Verifying payment:', { paymentId, orderId, signature, planId, userId });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    subscriptionId: `sub_${Date.now()}`,
    expiresAt: new Date(Date.now() + (planId === 'monthly' ? 30 : planId === 'halfyearly' ? 180 : 365) * 24 * 60 * 60 * 1000)
  };
};