import { 
  auth, 
} from '../firebaseConfig';
import * as firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

type FirebaseUser = firebase.User;
// The callback for onAuthChange can be a function or an observer object.
type NextOrObserver<T> = ((a: T) => void) | firebase.Observer<any>;

// Providers will be created inside the sign-in functions
// to prevent crashing on load if Firebase isn't configured.

const showAuthDisabledAlert = () => {
    alert("Authentication is currently unavailable. The application may not be configured correctly.");
};

export const signInWithGoogle = async () => {
    if (!auth) {
        showAuthDisabledAlert();
        console.error("Firebase not initialized. Cannot sign in with Google.");
        return null;
    }
    try {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(googleProvider);
        return result.user;
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        return null;
    }
}

export const signInWithApple = async () => {
    if (!auth) {
        showAuthDisabledAlert();
        console.error("Firebase not initialized. Cannot sign in with Apple.");
        return null;
    }
    try {
        const appleProvider = new firebase.auth.OAuthProvider('apple.com');
        const result = await auth.signInWithPopup(appleProvider);
        return result.user;
    } catch (error) {
        console.error("Error during Apple sign-in:", error);
        return null;
    }
}

export const signOut = () => {
    if (!auth) {
        console.error("Firebase not initialized. Cannot sign out.");
        return Promise.resolve(); // Return a resolved promise to maintain function signature
    }
    return auth.signOut();
}

export const onAuthChange = (callback: NextOrObserver<FirebaseUser | null>) => {
    if (!auth) {
        console.warn("Firebase not initialized. Cannot listen for auth changes.");
        // Immediately call the callback with a null user to prevent an infinite loading state.
        // This handles both function callbacks and observer objects.
        if (typeof callback === 'function') {
            callback(null);
        } else if (callback && 'next' in callback && typeof callback.next === 'function') {
            callback.next(null);
        }
        // Return a dummy unsubscribe function.
        return () => {};
    }
    // The compat onAuthStateChanged is compatible with the callback type.
    return auth.onAuthStateChanged(callback as any);
}
