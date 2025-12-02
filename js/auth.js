// Authentication Module
import { auth, setPersistence, browserLocalPersistence, browserSessionPersistence } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Check if user is guest
export function isGuest() {
    return localStorage.getItem('guestMode') === 'true';
}

// Set guest mode
export function setGuestMode(isGuest) {
    if (isGuest) {
        localStorage.setItem('guestMode', 'true');
    } else {
        localStorage.removeItem('guestMode');
    }
}

// Validate password
export function validatePassword(password) {
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least 1 capital letter' };
    }
    return { valid: true, message: 'Password is valid' };
}

// Register new user
export async function registerUser(email, password, confirmPassword, keepLoggedIn = true) {
    try {
        // Validate passwords match
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            throw new Error(passwordValidation.message);
        }

        // Set persistence based on "keep me logged in"
        if (keepLoggedIn) {
            await setPersistence(auth, browserLocalPersistence); // 30-90 days
        } else {
            await setPersistence(auth, browserSessionPersistence); // Session only
        }

        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Send verification email
        await sendEmailVerification(userCredential.user);

        return {
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            user: userCredential.user
        };
    } catch (error) {
        console.error('Registration error:', error);
        let message = 'Registration failed';

        if (error.code === 'auth/email-already-in-use') {
            message = 'This email is already registered';
        } else if (error.code === 'auth/invalid-email') {
            message = 'Invalid email address';
        } else if (error.code === 'auth/weak-password') {
            message = 'Password is too weak';
        } else if (error.message) {
            message = error.message;
        }

        return { success: false, message };
    }
}

// Login user
export async function loginUser(email, password, keepLoggedIn = true) {
    try {
        // Set persistence based on "keep me logged in"
        if (keepLoggedIn) {
            await setPersistence(auth, browserLocalPersistence); // 30-90 days
        } else {
            await setPersistence(auth, browserSessionPersistence); // Session only
        }

        // Sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Clear guest mode
        setGuestMode(false);

        return {
            success: true,
            message: 'Login successful!',
            user: userCredential.user
        };
    } catch (error) {
        console.error('Login error:', error);
        let message = 'Login failed';

        if (error.code === 'auth/user-not-found') {
            message = 'No account found with this email';
        } else if (error.code === 'auth/wrong-password') {
            message = 'Incorrect password';
        } else if (error.code === 'auth/invalid-email') {
            message = 'Invalid email address';
        } else if (error.code === 'auth/too-many-requests') {
            message = 'Too many failed attempts. Please try again later';
        }

        return { success: false, message };
    }
}

// Logout user
export async function logoutUser() {
    try {
        await signOut(auth);
        setGuestMode(false);
        return { success: true, message: 'Logged out successfully' };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, message: 'Logout failed' };
    }
}

// Continue as guest
export function continueAsGuest() {
    setGuestMode(true);
    return { success: true, message: 'Continuing as guest' };
}

// Get current user
export function getCurrentUser() {
    return auth.currentUser;
}

// Monitor auth state
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// Check if user is authenticated
export function isAuthenticated() {
    return auth.currentUser !== null && !isGuest();
}
