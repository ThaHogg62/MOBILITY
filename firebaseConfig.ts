
import * as firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// =================================================================================
// IMPORTANT: ACTION REQUIRED
// =================================================================================
// Replace the placeholder values below with your own Firebase project's configuration.
// You can find this data in the Firebase console:
// 1. Go to your Firebase project.
// 2. Click the gear icon -> "Project settings".
// 3. In the "General" tab, scroll down to "Your apps".
// 4. Click on the "Web app" (</>) icon to find your config object.
// =================================================================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // <-- REPLACE
  authDomain: "YOUR_AUTH_DOMAIN", // <-- REPLACE
  projectId: "YOUR_PROJECT_ID", // <-- REPLACE
  storageBucket: "YOUR_STORAGE_BUCKET", // <-- REPLACE
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // <-- REPLACE
  appId: "YOUR_APP_ID" // <-- REPLACE
};

let app: firebase.app.App | null = null;
let auth: firebase.auth.Auth | null = null;

if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_")) {
  try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth(app);
  } catch (error) {
    console.error("Error initializing Firebase. Please check your firebaseConfig.ts.", error);
    auth = null;
  }
} else {
    console.warn("Firebase configuration is missing or contains placeholder values in 'firebaseConfig.ts'. Authentication features will be disabled until you add your project keys.");
}

export { auth };