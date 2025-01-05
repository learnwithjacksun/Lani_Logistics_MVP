import { useState, useEffect } from 'react';
import { Download, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e as BeforeInstallPromptEvent);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    if (outcome === 'accepted') {
      setSupportsPWA(false);
    }
  };

  if (!supportsPWA && !isIOS) {
    return null;
  }

  return (
    <button
      onClick={isIOS ? undefined : handleInstallClick}
      className="fixed bottom-24 right-4 bg-primary_1 text-white p-3 rounded-full shadow-lg hover:bg-primary_1/90 transition-colors flex items-center gap-2"
    >
      {isIOS ? (
        <>
          <Share size={20} />
          <span className="text-sm">Tap Share → Add to Home Screen</span>
        </>
      ) : (
        <>
          <Download size={20} />
          <span className="text-sm">Install App</span>
        </>
      )}
    </button>
  );
};

export default InstallPWA; 