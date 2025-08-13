
// Vercel Serverless Function for the entire backend
const express = require('express');
const app = express();
const cors = require('cors');

// =================================================================================
// IMPORTANT: Environment Variables
// You MUST set these in your Vercel project settings for the app to work.
// 1. STRIPE_SECRET_KEY: Your Stripe secret key (e.g., sk_test_...).
// 2. FRONTEND_URL: The public URL of your deployed frontend (e.g., https://your-app.vercel.app).
// =================================================================================
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

if (!stripeSecretKey) {
  console.error("FATAL ERROR: STRIPE_SECRET_KEY is not set.");
}
const stripe = require('stripe')(stripeSecretKey);

// --- Middleware ---
app.use(express.json());
app.use(cors({ origin: frontendUrl }));

// --- In-Memory Database (Simulation) ---
// In a real production environment, you would replace this with a persistent database like Vercel KV, Postgres, or Firestore.
const DB = {
    users: {}, // { uid: { user data } }
    projects: {} // { uid: { project data } }
};

// --- Constants ---
const TIER_PRICES = { Premium: 1500, Exclusive: 3000 };
const DEFAULT_PROJECT = { tracks: [{ id: 1, name: 'Audio Track 1', isMuted: false, isSolo: false, isArmed: true, useVocalPreset: false }] };

// --- API Routes ---

// Health check
app.get('/api/health', (req, res) => res.send({ status: 'ok' }));

// --- User Routes ---
app.post('/api/user', (req, res) => {
    const { uid, name, email, avatarUrl } = req.body;
    if (!uid) return res.status(400).send({ error: "User ID is required." });
    if (DB.users[uid]) return res.status(409).send({ error: "User already exists." });

    const newUser = { uid, name, email, avatarUrl, subscriptionTier: 'Free' };
    DB.users[uid] = newUser;
    DB.projects[uid] = DEFAULT_PROJECT; // Create a default project for the new user

    console.log("New user created:", newUser);
    res.status(201).send(newUser);
});

app.get('/api/user/:uid', (req, res) => {
    const { uid } = req.params;
    const user = DB.users[uid];
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ error: "User not found." });
    }
});


// --- Project Routes ---
app.get('/api/project/:uid', (req, res) => {
    const { uid } = req.params;
    const project = DB.projects[uid];
    if (project) {
        res.send(project);
    } else {
        // If no project exists (e.g., for a new user who hasn't been created yet), send a default project
        res.status(200).send(DEFAULT_PROJECT);
    }
});

app.post('/api/project/:uid', (req, res) => {
    const { uid } = req.params;
    if (!DB.users[uid]) return res.status(404).send({ error: "User not found." });
    
    const projectData = req.body;
    DB.projects[uid] = projectData;
    console.log(`Project saved for user ${uid}`);
    res.send({ success: true });
});


// --- Payment Routes ---
app.post('/api/create-payment-intent', async (req, res) => {
  const { tier } = req.body;
  const amount = TIER_PRICES[tier];

  if (!amount) return res.status(400).send({ error: 'Invalid subscription tier.' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    console.error("Error creating payment intent:", e.message);
    res.status(500).send({ error: 'Failed to create payment intent.' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
    const { paymentIntentId, uid, tier } = req.body;

    if (!paymentIntentId || !uid || !tier) {
        return res.status(400).send({ error: 'paymentIntentId, uid, and tier are required.' });
    }
    if (!DB.users[uid]) {
        return res.status(404).send({ error: "User to upgrade not found." });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update user subscription tier in our database
            DB.users[uid].subscriptionTier = tier;
            console.log(`Payment successful for ${paymentIntentId}. User ${uid} upgraded to ${tier}.`);
            res.send({ success: true });
        } else {
            res.status(400).send({ success: false, error: 'Payment not successful.' });
        }
    } catch (e) {
        console.error("Error verifying payment intent:", e.message);
        res.status(500).send({ error: 'Failed to verify payment.' });
    }
});


// Export the app for Vercel
module.exports = app;
