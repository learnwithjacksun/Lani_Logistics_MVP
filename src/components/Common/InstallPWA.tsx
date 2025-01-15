import { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import Image from './Image';
import { Share, X } from 'lucide-react';

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

  if(showModal){
    return (
      <>
      <div className='fixed w-full bottom-0 py-2 px-4 shadow-[0_-5px_10px_rgba(0,0,0,0.09)] backdrop-blur-md backdrop-brightness-200 flex justify-between items-center'>
        {isIOS ? (
          <div className='flex items-center gap-2 '>
            <Image src='/logo-orange.png' alt='Lani Logo' width={30} height={30}/>
           <div>
            <p className='text-sm text-main'>For quick and easy access anytime,</p>
            <p className='flex items-center gap-1 text-sm text-main'>
              <span className='text-main'>Click on the share icon</span>
              <Share size={16}/>,
            </p>
            <p className='text-sm text-main'>then <b>Add home screen</b></p>
           </div>
          </div>
        ) : (
          <div className='flex items-center justify-between gap-2 w-full'>
              <div className='flex items-center gap-2 '>
              <Image src='/logo-orange.png' alt='Lani Logo' width={30} height={30}/>
              <p className='text-sm text-main'>Install App for quick access</p>
            </div>
            <button onClick={handleInstallClick} className='btn-primary px-2 py-1 rounded-md'>Install</button>
          </div>
        )}
       
        <button onClick={handleDecline} className=' px-2 py-1 text-main rounded-md'>
          <X size={20}/>
        </button>
      </div>
      </>
    );
  }

  return null;
};

export default InstallPWA; 