import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';

import { Home } from './components/tabs/Home';
import { Build } from './components/tabs/Build';
import { Flow } from './components/tabs/Flow';
import { Profile } from './components/tabs/Profile';
import { Subscription } from './components/tabs/Subscription';

import { BillingRenew } from './components/sheets/BillingRenew';
import { CheckoutSheet } from './components/sheets/CheckoutSheet';
import { BotSwitcher } from './components/sheets/BotSwitcher';
import { BotSettings } from './components/sheets/BotSettings';
import { Toast } from './components/Toast';

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

  const setSheet = (sheet: SheetType, data?: any) =>
    setAppState(prev => ({ ...prev, activeSheet: sheet, sheetData: data }));

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
        theme={theme}
        toggleTheme={toggleTheme}
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
            className={`flex-1 flex flex-col ${activeTab === 'flow' ? 'flow-padding' : activeTab === 'subscription' ? 'px-2 lg:px-4 py-4 lg:py-8 mobile-padding' : 'p-4 lg:p-8 mobile-padding'}`} 
            style={{ maxWidth: activeTab === 'flow' ? '100%' : activeTab === 'subscription' ? '1100px' : '960px', margin: '0 auto', width: '100%' }}
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
                  const newBotId = `b${appState.bots.length + 1}`;
                  const newBot: import('./types').BotConfig = { 
                    id: newBotId, 
                    name: 'Новый Бот', 
                    username: '@new_bot', 
                    status: 'draft', 
                    usersCount: 0, 
                    isTokenLocked: false, 
                    funnelComplete: false 
                  };
                  setAppState(prev => ({
                    ...prev,
                    activeBot: newBot,
                    bots: [...prev.bots, newBot],
                  }));
                }}
                onPublish={() => setActiveTab('subscription')}
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
              <Profile key="profile" appState={appState} setSheet={setSheet} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} />
            )}
            {activeTab === 'subscription' && (
              <Subscription 
                key="subscription" 
                onPurchaseSuccess={(plan) => {
                  setAppState(prev => {
                    const nextState = { ...prev };
                    if (plan === 'pro') {
                      nextState.subscriptionStatus = 'active';
                      // If there is an active bot and it's a draft, make it active
                      if (nextState.activeBot && nextState.activeBot.status === 'draft') {
                        nextState.activeBot.status = 'active';
                      }
                      nextState.bots = nextState.bots.map(b => b.id === nextState.activeBot?.id ? { ...b, status: 'active' } : b);
                    } else if (plan === 'basic') {
                      if (nextState.activeBot && nextState.activeBot.status === 'draft') {
                        nextState.activeBot.status = 'active';
                      }
                      nextState.bots = nextState.bots.map(b => b.id === nextState.activeBot?.id ? { ...b, status: 'active' } : b);
                    }
                    return nextState;
                  });
                }}
                onGoToBots={() => setActiveTab('home')}
              />
            )}
          </AnimatePresence>
        </div>
        </div>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Sheets */}
      <AnimatePresence>
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
        {appState.activeSheet === 'checkout' && appState.sheetData?.tariff && (
          <CheckoutSheet
            key="checkout"
            tariffId={appState.sheetData.tariff}
            onClose={() => setSheet(null)}
            onSuccess={(email) => {
              setAppState(prev => ({ ...prev, userEmail: email }));
              setSheet(null);
              alert(`Payment initiated for ${appState.sheetData.tariff} with email ${email}`);
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
              const newBotId = `b${appState.bots.length + 1}`;
              const newBot: import('./types').BotConfig = { 
                id: newBotId, 
                name: 'Новый Бот', 
                username: '@new_bot', 
                status: 'draft', 
                usersCount: 0, 
                isTokenLocked: false, 
                funnelComplete: false 
              };
              setAppState(prev => ({
                ...prev,
                activeBot: newBot,
                bots: [...prev.bots, newBot],
              }));
              setSheet(null);
              setActiveTab('build');
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
    </div>
  );
}
