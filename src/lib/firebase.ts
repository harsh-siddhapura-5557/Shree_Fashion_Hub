import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAbS09pdbS0dS550wx-RicK-PXKTiqJBmc',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'shree-fashion-hub-49ca0.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'shree-fashion-hub-49ca0',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'shree-fashion-hub-49ca0.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '870047803305',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:870047803305:web:804d87943d307e160806b8',
};

export const isFirebaseConfigured = true;

export const app = isFirebaseConfigured
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth = app ? getAuth(app) : null;

export type { ConfirmationResult };
export { RecaptchaVerifier, signInWithPhoneNumber };
