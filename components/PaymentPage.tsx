
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { TIER_PRICES } from '../constants';
import { MicIcon } from './icons';
import { createPaymentIntent, verifyPaymentOnBackend } from '../services/paymentService';
import { SubscriptionTier, User } from '../types';
import { auth } from '../firebaseConfig';


const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#e5e7eb',
      fontFamily: '"Rajdhani", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#f87171', iconColor: '#f87171' },
  },
};

const CheckoutForm: React.FC<{ onSuccess: () => void; onGoBack: () => void; tier: SubscriptionTier; }> = ({ onSuccess, onGoBack, tier }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const price = TIER_PRICES[tier];

    useEffect(() => {
        createPaymentIntent(tier)
            .then(data => setClientSecret(data.clientSecret))
            .catch(err => setError(err.message || 'Failed to initialize payment. Please try again.'));
    }, [tier]);

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret || !auth?.currentUser) {
            setError("Payment system not ready or user not logged in.");
            return;
        };

        setProcessing(true);
        setError(null);
        
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError("Card element not found.");
            setProcessing(false);
            return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement },
        });

        if (error) {
            setError(error.message || 'An unexpected error occurred.');
            setProcessing(false);
        } else if (paymentIntent?.status === 'succeeded') {
            try {
                const verification = await verifyPaymentOnBackend(paymentIntent.id, auth.currentUser.uid, tier);
                if (verification.success) {
                    onSuccess();
                } else {
                    setError("Payment verification failed. Please contact support.");
                    setProcessing(false);
                }
            } catch (verificationError: any) {
                 setError(verificationError.message || "An error occurred during payment verification.");
                 setProcessing(false);
            }
        }
    };

    const isReadyForPayment = !!stripe && !!clientSecret;

    return (
        <form onSubmit={handlePay}>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="card-element">
                    Credit or debit card
                </label>
                <div id="card-element" className={`bg-gray-800 border border-gray-700 rounded-md p-3.5 transition-opacity ${!isReadyForPayment ? 'opacity-50' : ''}`}>
                    <CardElement options={{...CARD_ELEMENT_OPTIONS, disabled: !isReadyForPayment}} />
                </div>
            </div>

            {error && <div className="text-red-400 text-sm mb-4 text-center" role="alert">{error}</div>}
            
            <div className="mt-8">
                 <button type="submit" disabled={!isReadyForPayment || processing} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    {processing ? 'Processing...' : !isReadyForPayment ? 'Initializing...' : `Pay $${price}`}
                </button>
                <button type="button" onClick={onGoBack} className="w-full text-center text-gray-400 mt-4 hover:text-white disabled:opacity-50" disabled={processing}>
                    Go Back
                </button>
            </div>
        </form>
    );
};


export const PaymentPage: React.FC<{ onSuccess: () => void; onGoBack: () => void; tier: SubscriptionTier; }> = ({ onSuccess, onGoBack, tier }) => {
    const [isPaid, setIsPaid] = useState(false);
    
    const price = TIER_PRICES[tier];
    
    const handleSuccess = () => {
        setIsPaid(true);
        setTimeout(onSuccess, 2000);
    };
    
    if (!stripePromise) {
        return (
             <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
                 <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
                    <h2 className="text-2xl font-orbitron text-red-400 mb-4">Stripe Not Configured</h2>
                    <p className="text-gray-300 mb-6">
                        The Stripe publishable key is missing. Please set
                        <code className="bg-gray-900 text-yellow-400 p-1 rounded-md mx-1">STRIPE_PUBLISHABLE_KEY</code>
                        as an environment variable.
                    </p>
                    <button type="button" onClick={onGoBack} className="text-center text-gray-400 hover:text-white">
                        Go Back
                    </button>
                 </div>
             </div>
        );
    }

    if (isPaid) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
                <div className="text-center bg-gray-800 p-10 rounded-lg shadow-2xl animate-fade-in-scale">
                    <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center bg-green-500 rounded-full">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-3xl font-orbitron text-white mb-2">Payment Successful!</h2>
                    <p className="text-gray-300 mb-6">Welcome to {tier}. Your studio is now fully unlocked.</p>
                </div>
                 <style>{`@keyframes fade-in-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards ease-out; }`}</style>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-grid-pattern">
            <style>{`.bg-grid-pattern { background-image: linear-gradient(rgba(10, 10, 10, 0.98), rgba(10, 10, 10, 0.98)), radial-gradient(circle at center, #1e3a8a 1px, transparent 1px); background-size: 100%, 30px 30px; }`}</style>
            <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-2xl overflow-hidden animate-fade-in-scale">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-orbitron text-white">Secure Checkout</h2>
                            <p className="text-gray-400">Upgrading to <span className={tier === SubscriptionTier.Exclusive ? 'text-yellow-400 font-bold' : 'text-blue-400 font-bold'}>{tier}</span>.</p>
                        </div>
                        <MicIcon className="w-10 h-10 text-blue-400" />
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center mb-6">
                        <span className="text-gray-300">One-Time Payment</span>
                        <span className="text-2xl font-bold text-white">${price}.00 USD</span>
                    </div>

                    <Elements stripe={stripePromise}>
                        <CheckoutForm onSuccess={handleSuccess} onGoBack={onGoBack} tier={tier} />
                    </Elements>
                </div>
            </div>
             <style>{`@keyframes fade-in-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards ease-out; }`}</style>
        </div>
    );
};