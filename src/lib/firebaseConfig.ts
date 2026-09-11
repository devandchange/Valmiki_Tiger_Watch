// Firebase Applet Configuration for Google Authentication & Google Workspace
import rawConfig from '../../firebase-applet-config.json';

export const firebaseConfig = {
  projectId: rawConfig.projectId || "gen-lang-client-0741534586",
  appId: rawConfig.appId || "1:350309246189:web:a4e00fa09d823741b818e4",
  apiKey: rawConfig.apiKey || "AIzaSyC-sl0OJLDNYWPGg-e4_xfTqixA0cpUIzk",
  authDomain: rawConfig.authDomain || "gen-lang-client-0741534586.firebaseapp.com",
  storageBucket: rawConfig.storageBucket || "gen-lang-client-0741534586.firebasestorage.app",
  messagingSenderId: rawConfig.messagingSenderId || "350309246189",
  oAuthClientId: rawConfig.oAuthClientId || "350309246189-hpjajvv6mijv1j51gk9u65sli2m2aqma.apps.googleusercontent.com"
};
