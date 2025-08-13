
import { SubscriptionTier, User } from '../types';
import type { User as FirebaseUser } from 'firebase/auth';

/**
 * Fetches a user's full profile from the backend.
 * If the user doesn't exist, it creates a new profile for them.
 * @param firebaseUser The user object from Firebase Auth.
 */
export const fetchUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
    // First, try to get the user
    const getResponse = await fetch(`/api/user/${firebaseUser.uid}`);

    if (getResponse.ok) {
        const userProfile = await getResponse.json();
        return userProfile as User;
    }

    if (getResponse.status === 404) {
        // User not found, so create a new one
        const newUser: Omit<User, 'subscriptionTier'> = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            avatarUrl: firebaseUser.photoURL,
        };
        const createResponse = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });

        if (!createResponse.ok) {
            throw new Error("Failed to create user profile on the backend.");
        }

        const createdProfile = await createResponse.json();
        return createdProfile as User;
    }

    // Handle other errors
    throw new Error("Failed to fetch user profile from the backend.");
};