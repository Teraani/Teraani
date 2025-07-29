// @ts-nocheck
import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  "projectId": "amistososai-fc",
  "appId": "1:657470761890:web:9815f54aead972bc3920fb",
  "storageBucket": "amistososai-fc.firebasestorage.app",
  "apiKey": "AIzaSyBgjuo0ZYaSFELCmiJEvZIgHdsUi0bFC58",
  "authDomain": "amistososai-fc.firebaseapp.com",
  "measurementId": "G-0759LK1EB2",
  "messagingSenderId": "657470761890"
};

// Initialize Firebase
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
