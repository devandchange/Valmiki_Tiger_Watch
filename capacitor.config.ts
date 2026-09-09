import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.valmikitigerwatch.app',
  appName: 'Valmiki Tiger Watch',
  webDir: 'dist',
  plugins: {
    Filesystem: {},
    Share: {}
  }
};

export default config;
