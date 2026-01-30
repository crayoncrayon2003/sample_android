import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'jp.sample.zundamon',
  appName: 'ずんだもん',
  webDir: '../frontend',
  server: {
    cleartext: true,
    // Allow access to the local network
    androidScheme: 'http',
    allowNavigation: ['*']
  },
  // Set HTTP Plugin
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;