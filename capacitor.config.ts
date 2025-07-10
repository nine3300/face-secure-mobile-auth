import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.000fc7331c104ab49c67fdac6dff18d4',
  appName: 'face-secure-mobile-auth',
  webDir: 'dist',
  server: {
    url: 'https://000fc733-1c10-4ab4-9c67-fdac6dff18d4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  }
};

export default config;