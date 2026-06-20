import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';

import { Home } from './components/tabs/Home';
import { Build } from './components/tabs/Build';
import { Flow } from './components/tabs/Flow';
import { Profile } from './components/tabs/Profile';

import { BillingFirstTime } from './components/sheets/BillingFirstTime';
import { BillingRenew } from './components/sheets/BillingRenew';
import { BotSwitcher } from './components/sheets/BotSwitcher';
import { BotSettings } from './components/sheets/BotSettings';
import { Toast } from './components/Toast';
import { OnboardingTour } from './components/OnboardingTour';

import type { FunnelNode, TabType, AppState, SheetType } from './types';
import { INITIAL_BLOCKS } from './constants';

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    activeBot: null,
    bots: [],
    subscriptionStatus: 'none',
    subscriptionUntil: null,
    userEmail: '',
    activeSheet: null,
    isDirty: false,
  });

  const [activeTab, setActiveTab] = useState<TabType>('build');
  const [blocks, setBlocks] = useState<FunnelNode[]>(INITIAL_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('start');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showTour, setShowTour] = useState<boolean>(() => {
    return !localStorage.getItem('bf_tour_done');
  });

  const completeTour = () => {
    localStorage.setItem('bf_tour_done', '1');
    setShowTour(false);
  };

  // Smart routing on mount
  useEffect(() => {
    if (appState.subscriptionStatus === 'none' && appState.bots.length === 0) {
      setActiveTab('build');
    } else if (appState.bots.length === 0) {
      setActiveTab('build');
    } else {
      setActiveTab('home');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
      if (tg.requestFullscreen) tg.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setSheet = (sheet: SheetType) =>
    setAppState(prev => ({ ...prev, activeSheet: sheet }));

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateBlock = (id: string, field: keyof FunnelNode, value: string) => {
    setBlocks(prev => prev.map(b => (b.id === id ? { ...b, [field]: value } : b)));
    setAppState(prev => ({ ...prev, isDirty: true }));
  };

  return (
    <div
      className="flex h-full overflow-hidden w-full"
      style={{ background: 'var(--color-background)', color: 'var(--color-foreground)', position: 'relative' }}
    >
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '40vh', background: 'linear-gradient(180deg, rgba(46,154,219,0.06) 0%, rgba(242,241,236,0) 100%)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, rgba(255,255,255,0) 70%)', zIndex: 0, pointerEvents: 'none', borderRadius: '50%' }} />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        appState={appState}
        setSheet={setSheet}
      />

      <main
        className="flex-1 flex flex-col relative lg:ml-[240px] overflow-hidden h-full"
      >
        <Header activeTab={activeTab} appState={appState} setSheet={setSheet} />

        {/* Content Area with its own scroll */}
        <div className={`flex-1 flex flex-col relative ${activeTab === 'flow' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          
          {/* Mobile Navigation Spacer */}
          <style>{`
            @media (max-width: 1023px) {
              .mobile-padding { padding-bottom: calc(env(safe-area-inset-bottom) + 60px); }
              .flow-padding { padding-bottom: 0; }
            }
          `}</style>

          <div 
            className={`flex-1 flex flex-col ${activeTab === 'flow' ? 'flow-padding' : 'p-4 lg:p-8 mobile-padding'}`} 
            style={{ maxWidth: activeTab === 'flow' ? '100%' : '960px', margin: '0 auto', width: '100%' }}
          >
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <Home key="home" appState={appState} setActiveTab={setActiveTab} setSheet={setSheet} />
            )}
            {activeTab === 'build' && (
              <Build
                key="build"
                theme={theme}
                appState={appState}
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                setSelectedBlockId={setSelectedBlockId}
                updateBlock={updateBlock}
                onBotConnect={() => {
                  setAppState(prev => ({
                    ...prev,
                    activeBot: { id: 'b1', name: 'Новый Бот', username: '@new_bot', status: 'active', funnelComplete: false },
                    bots: [{ id: 'b1', name: 'Новый Бот', username: '@new_bot', status: 'active', funnelComplete: false }],
                  }));
                }}
                onPublish={() => setSheet('billing_first')}
              />
            )}
            {activeTab === 'flow' && (
              <Flow
                key="flow"
                theme={theme}
                blocks={blocks}
                setSelectedBlockId={setSelectedBlockId}
                updateBlock={updateBlock}
                setActiveTab={setActiveTab as any}
              />
            )}
            {activeTab === 'profile' && (
              <Profile key="profile" appState={appState} setSheet={setSheet} theme={theme} toggleTheme={toggleTheme} />
            )}
          </AnimatePresence>
        </div>
        </div>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Sheets */}
      <AnimatePresence>
        {appState.activeSheet === 'billing_first' && (
          <BillingFirstTime
            key="billing_first"
            onClose={() => setSheet(null)}
            onSuccess={() => {
              setSheet(null);
              setAppState(prev => ({ ...prev, subscriptionStatus: 'active' }));
              setToastMessage('PRO подписка успешно оформлена!');
              setActiveTab('build');
            }}
          />
        )}
        {appState.activeSheet === 'billing_renew' && (
          <BillingRenew
            key="billing_renew"
            userEmail={appState.userEmail}
            onClose={() => setSheet(null)}
            onSuccess={() => {
              setSheet(null);
              setAppState(prev => ({ ...prev, subscriptionStatus: 'active' }));
              setToastMessage('Подписка успешно продлена!');
            }}
          />
        )}
        {appState.activeSheet === 'bot_switcher' && (
          <BotSwitcher
            key="bot_switcher"
            bots={appState.bots}
            activeBotId={appState.activeBot?.id}
            subscriptionStatus={appState.subscriptionStatus}
            onClose={() => setSheet(null)}
            onSelect={(id) => {
              const bot = appState.bots.find(b => b.id === id);
              if (bot) setAppState(prev => ({ ...prev, activeBot: bot }));
              setSheet(null);
            }}
            onAddBot={() => {
              setSheet('billing_first');
            }}
          />
        )}
        {appState.activeSheet === 'bot_settings' && (
          <BotSettings
            appState={appState}
            onClose={() => setSheet(null)}
            onSave={() => setToastMessage('Настройки бота сохранены')}
          />
        )}
      </AnimatePresence>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Onboarding Tour — shown once to new users */}
      {showTour && <OnboardingTour onComplete={completeTour} />}
    </div>
  );
}
