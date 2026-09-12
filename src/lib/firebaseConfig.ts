// Firebase Applet Configuration
import rawConfig from '../../firebase-applet-config.json';

// Safe getter: reads from client env if supplied, else from raw config file
const getCfg = (envVal: string | undefined, rawVal: string | undefined): string => {
  return envVal || rawVal || "";
};

export const firebaseConfig = {
  projectId: getCfg(import.meta.env.VITE_FIREBASE_PROJECT_ID, rawConfig.projectId),
  appId: getCfg(import.meta.env.VITE_FIREBASE_APP_ID, rawConfig.appId),
  apiKey: getCfg(import.meta.env.VITE_FIREBASE_API_KEY, rawConfig.apiKey),
  authDomain: getCfg(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, rawConfig.authDomain),
  storageBucket: getCfg(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, rawConfig.storageBucket),
  messagingSenderId: getCfg(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, rawConfig.messagingSenderId),
  oAuthClientId: getCfg(import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID, rawConfig.oAuthClientId)
};
