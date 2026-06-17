import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Landing } from './components/Landing';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';

import { Overview } from './components/tabs/Overview';
import { Builder } from './components/tabs/Builder';
import { Flow } from './components/tabs/Flow';
import { Stats } from './components/tabs/Stats';
import { Settings } from './components/tabs/Settings';

import type { FunnelNode, TabType } from './types';
import { INITIAL_BLOCKS } from './constants';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [blocks, setBlocks] = useState<FunnelNode[]>(INITIAL_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('start');

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
      tg.setHeaderColor('bg_color');
      tg.setBackgroundColor('bg_color');
      
      // Request fullscreen if available (new TG API feature)
      if (tg.requestFullscreen) {
        tg.requestFullscreen();
      }
    }
  }, []);

  const handlePay = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) tg.HapticFeedback.impactOccurred('medium');
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsSubscribed(true);
      if (tg) tg.HapticFeedback.notificationOccurred('success');
    }, 1500);
  };

  const updateBlock = (id: string, field: keyof FunnelNode, value: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  if (!isSubscribed) {
    return <Landing onPay={handlePay} isPaying={isPaying} />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-h-screen pb-[calc(env(safe-area-inset-bottom)+80px)] lg:pb-0 relative">
        <Header activeTab={activeTab} />

        <div className="flex-1 p-4 lg:p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <Overview key="overview" setActiveTab={setActiveTab} />
            )}

            {activeTab === 'builder' && (
              <Builder 
                key="builder"
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                setSelectedBlockId={setSelectedBlockId}
                updateBlock={updateBlock}
              />
            )}

            {activeTab === 'flow' && (
              <Flow 
                key="flow"
                blocks={blocks}
                setSelectedBlockId={setSelectedBlockId}
                updateBlock={updateBlock}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'stats' && (
               <Stats key="stats" />
            )}

            {activeTab === 'settings' && (
              <Settings key="settings" />
            )}
          </AnimatePresence>
        </div>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
