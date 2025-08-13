
import { TIER_PRICES } from '../constants';
import { SubscriptionTier } from '../types';

interface PaymentIntentResponse {
  clientSecret: string;
}

/**
 * Calls your backend to create a Stripe PaymentIntent.
 *
 * @param {SubscriptionTier} tier - The subscription tier being purchased.
 * @returns {Promise<PaymentIntentResponse>}
 */
export const createPaymentIntent = async (tier: SubscriptionTier): Promise<PaymentIntentResponse> => {
  const price = TIER_PRICES[tier];
  if (!price) {
    throw new Error("Invalid subscription tier selected.");
  }

  const response = await fetch(`/api/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || 'Failed to create payment intent.');
  }

  return response.json();
};

/**
 * Verifies a payment on the backend after Stripe confirmation on the client.
 *
 * @param {string} paymentIntentId The ID of the successful PaymentIntent.
 * @returns {Promise<{ success: boolean }>}
 */
export const verifyPaymentOnBackend = async (paymentIntentId: string, uid: string, tier: SubscriptionTier): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, uid, tier }),
    });

    if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Payment verification failed.');
    }
    
    return response.json();
};