import { useState, useEffect } from 'react';
import { Modal } from '.';
import { useLocation } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const isAppInstalled = 
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as Navigator & { standalone: boolean }).standalone) ||
      document.referrer.includes('android-app://') ||
      localStorage.getItem('pwaInstalled') === 'true';
    
    setIsStandalone(isAppInstalled);

    let mounted = true;
    const handler = (e: Event) => {
      e.preventDefault();
      if (mounted) {
        setSupportsPWA(true);
        setPromptInstall(e as BeforeInstallPromptEvent);
      }
    };
    
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      mounted = false;
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Show modal when on dashboard pages
  useEffect(() => {
    const isDashboardPage = location.pathname === '/dashboard' || location.pathname === '/rider-dashboard';

    if (isDashboardPage && !isStandalone) {
      setShowModal(true);
    }
  }, [location, isStandalone]);

  const handleInstallClick = async () => {
    if (!promptInstall) return;
    
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    if (outcome === 'accepted') {
      setSupportsPWA(false);
      setShowModal(false);
      localStorage.setItem('pwaInstalled', 'true');
    }
  };

  const handleDecline = () => {
    setShowModal(false);
  };

  if (isStandalone || (!supportsPWA && !isIOS)) {
    return null;
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={handleDecline}
      title="Install Lani App"
    >
      <div className="space-y-6 p-4">
        {isIOS ? (
          <>
            <div className="space-y-4">
              <h3 className="font-medium text-main">Follow these steps to install:</h3>
              <ol className="space-y-3 text-sm text-main">
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <p>Tap the Share button in your browser's menu</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <p>Scroll down and tap "Add to Home Screen"</p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <p>Tap "Add" to confirm</p>
                </li>
              </ol>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-main bg-background_2 rounded-lg hover:bg-background_2/80"
              >
                Got it
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-main">Install Lani for a better experience with quick access and offline features.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-2 border border-line rounded-lg text-main hover:bg-background_2"
              >
                Not now
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 px-4 py-2 bg-primary_1 text-white rounded-lg hover:bg-primary_1/90"
              >
                Install
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default InstallPWA; 