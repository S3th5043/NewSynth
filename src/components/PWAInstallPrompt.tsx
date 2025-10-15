"use client";
import { useEffect, useState } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl glass p-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-800">Install this app?</span>
        <button
          className="rounded-md bg-primary px-3 py-1 text-white"
          onClick={async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome) setVisible(false);
          }}
        >
          Install
        </button>
        <button className="text-gray-600" onClick={() => setVisible(false)}>
          Not now
        </button>
      </div>
    </div>
  );
}
