import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.valmikitigerwatch.app',
  appName: 'Valmiki Tiger Watch',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    Filesystem: {},
    Share: {}
  }
};

export default config;
