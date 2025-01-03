import OneSignal from 'react-onesignal';

export const initOneSignal = async () => {
  try {
    await OneSignal.init({
      appId: import.meta.env.VITE_ONESIGNAL_APP_ID, // Replace with your OneSignal app ID
      allowLocalhostAsSecureOrigin: true, // Enables for localhost in development
      notifyButton: {
        enable: true, // Shows the OneSignal notification button
      },
    });

    console.log('OneSignal initialized successfully');
  } catch (error) {
    console.error('OneSignal init error:', error);
  }
};
