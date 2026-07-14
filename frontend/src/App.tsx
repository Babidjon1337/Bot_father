import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';

import { Home } from './components/tabs/Home';
import { Build } from './components/tabs/Build';
import { Flow } from './components/tabs/Flow';
import { BotManagement } from './components/tabs/BotManagement';
import { Profile } from './components/tabs/Profile';
import { Subscription } from './components/tabs/Subscription';

import { BotSettings } from './components/sheets/BotSettings';
import { CheckoutSheet } from './components/sheets/CheckoutSheet';
import { BotCreateSheet } from './components/sheets/BotCreateSheet';
import { BotSwitcher } from './components/sheets/BotSwitcher';
import { BillingRenew } from './components/sheets/BillingRenew';

import { Toast } from './components/Toast';

import type { FunnelNode, TabType, AppState, SheetType } from './types';
import { INITIAL_BLOCKS } from './constants';
import { createBot } from './utils';

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    activeBot: null,
    bots: [],
    subscriptionStatus: 'none',
    subscriptionUntil: null,
    slotsBought: 0,
    userEmail: '',
    activeSheet: null,
    isDirty: false,
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [blocks, setBlocks] = useState<FunnelNode[]>(INITIAL_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('start');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
      if (tg.requestFullscreen) tg.requestFullscreen();
      // Official TG API to disable swipe-to-close gesture
      if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
      // Set TG header color to match app background — makes Close/Minimize buttons feel native
      if (tg.setHeaderColor) tg.setHeaderColor('bg_color');
      if (tg.setBackgroundColor) tg.setBackgroundColor('bg_color');
      // Set bottom bar color
      if (tg.setBottomBarColor) tg.setBottomBarColor('bg_color');
    }

    // Prevent swipe-to-close ONLY when no scrollable parent is being scrolled.
    // This allows content inside overflow-y-auto containers to scroll normally.
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0]?.clientY ?? 0;
      const swipingDown = currentY > startY;

      // Walk up the DOM to check if any ancestor is scrollable
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body) {
        const overflowY = window.getComputedStyle(el).overflowY;
        const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
        if (isScrollable) {
          // Allow scroll if we're not at the very top (can scroll up more)
          if (!swipingDown || el.scrollTop > 0) return;
          break;
        }
        el = el.parentElement;
      }

      // Block only at root level and swiping down (prevents TG collapse)
      if (swipingDown) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
    };
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

  const handleCreateBotClick = () => {
    const isPro = appState.subscriptionStatus === 'active';
    const hasSlots = isPro ? appState.bots.length < 10 : appState.bots.length < 1;
    if (!hasSlots) {
      setActiveTab('subscription');
      return;
    }
    setSheet('bot_create');
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
        onCreateBot={handleCreateBotClick}
      />

      <main
        className="flex-1 flex flex-col relative lg:ml-[240px] overflow-hidden h-full"
      >
        <Header activeTab={activeTab} appState={appState} setSheet={setSheet} onCreateBot={handleCreateBotClick} />

        {/* Content Area with its own scroll */}
        <div className={`flex-1 flex flex-col relative ${activeTab === 'flow' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          
          {/* Mobile Navigation Spacer */}
          <style>{`
            @media (max-width: 1023px) {
              /* Bottom: nav bar height + device safe area */
              .mobile-padding { padding-bottom: calc(56px + env(safe-area-inset-bottom, 12px)) !important; }
              /* Top: TG header bar (Close + Minimize buttons) — use env(safe-area-inset-top) + 44px */
              .tg-header-safe { padding-top: max(54px, calc(env(safe-area-inset-top, 0px) + 44px)) !important; }
              .flow-padding { padding-bottom: 0; }
            }
          `}</style>

          <div 
            className={`flex-1 flex flex-col ${activeTab === 'flow' ? 'flow-padding' : activeTab === 'subscription' ? 'px-3 lg:px-4 py-4 lg:py-8 mobile-padding' : 'px-4 pt-3 pb-4 lg:p-8 mobile-padding'}`} 
            style={{ maxWidth: activeTab === 'flow' ? '100%' : activeTab === 'subscription' ? '1100px' : '960px', margin: '0 auto', width: '100%' }}
          >
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <Home key="home" appState={appState} setActiveTab={setActiveTab} setSheet={setSheet} onCreateBot={handleCreateBotClick} />
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
                onPublish={() => setActiveTab('subscription')}
                onCreateBot={handleCreateBotClick}
                onOpenSettings={() => setSheet('bot_settings')}
              />
            )}
            {activeTab === 'flow' && (
              <Flow
                key="flow"
                theme={theme}
                blocks={blocks}
                appState={appState}
                setSelectedBlockId={setSelectedBlockId}
                updateBlock={updateBlock}
                setActiveTab={setActiveTab as any}
                onCreateBot={handleCreateBotClick}
              />
            )}
            {activeTab === 'profile' && (
              <Profile key="profile" appState={appState} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme}
                onPurchaseSuccess={(plan) => {
                  setAppState(prev => {
                    const nextState = { ...prev };
                    if (plan === 'pro') {
                      nextState.subscriptionStatus = 'active';
                      if (nextState.activeBot && nextState.activeBot.status === 'inactive') nextState.activeBot.status = 'active';
                      nextState.bots = nextState.bots.map(b => b.id === nextState.activeBot?.id ? { ...b, status: 'active' } : b);
                    } else if (plan === 'basic') {
                      nextState.slotsBought = (nextState.slotsBought || 0) + 1;
                      if (nextState.activeBot && nextState.activeBot.status === 'inactive') nextState.activeBot.status = 'active';
                      nextState.bots = nextState.bots.map(b => b.id === nextState.activeBot?.id ? { ...b, status: 'active' } : b);
                    }
                    return nextState;
                  });
                }}
              />
            )}
            {activeTab === 'subscription' && (
              <Subscription 
                key="subscription" 
                appState={appState}
                onPurchaseSuccess={(plan) => {
                  setAppState(prev => {
                    const nextState = { ...prev };
                    if (plan === 'pro') {
                      nextState.subscriptionStatus = 'active';
                      // If there is an active bot and it's a draft, make it active
                      if (nextState.activeBot && nextState.activeBot.status === 'inactive') {
                        nextState.activeBot.status = 'active';
                      }
                      nextState.bots = nextState.bots.map(b => b.id === nextState.activeBot?.id ? { ...b, status: 'active' } : b);
                    } else if (plan === 'basic') {
                      nextState.slotsBought = (nextState.slotsBought || 0) + 1;
                      if (nextState.activeBot && nextState.activeBot.status === 'inactive') {
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
            {activeTab === 'manage' && (
              <BotManagement 
                key="manage" 
                appState={appState} 
                onCreateBot={handleCreateBotClick} 
                onOpenBot={(botId) => {
                  const bot = appState.bots.find(b => b.id === botId);
                  if (bot) {
                    setAppState(prev => ({ ...prev, activeBot: bot }));
                    setActiveTab('home');
                  }
                }} 
                onEditBot={(botId) => {
                  const bot = appState.bots.find(b => b.id === botId);
                  if (bot) {
                    setAppState(prev => ({ ...prev, activeBot: bot }));
                    setActiveTab('build');
                  }
                }}
                onEditBotSettings={(botId) => {
                  const bot = appState.bots.find(b => b.id === botId);
                  if (bot) {
                    setAppState(prev => ({ ...prev, activeBot: bot }));
                    setSheet('bot_settings');
                  }
                }}
                onToggleBot={(botId, newStatus) => {
                  setAppState(prev => ({
                    ...prev,
                    bots: prev.bots.map(b => b.id === botId ? { ...b, status: newStatus } : b),
                    activeBot: prev.activeBot?.id === botId ? { ...prev.activeBot, status: newStatus } : prev.activeBot,
                  }));
                }}
                onDeleteBot={(botId) => {
                  setAppState(prev => ({
                    ...prev,
                    bots: prev.bots.filter(b => b.id !== botId),
                    activeBot: prev.activeBot?.id === botId ? null : prev.activeBot,
                  }));
                }}
                onClearLeads={(botId) => {
                  setAppState(prev => {
                    const updatedBots = prev.bots.map(b => b.id === botId ? { ...b, usersCount: 0 } : b);
                    return {
                      ...prev,
                      bots: updatedBots,
                      activeBot: prev.activeBot?.id === botId ? { ...prev.activeBot, usersCount: 0 } : prev.activeBot
                    };
                  });
                }}
              />
            )}
          </AnimatePresence>
        </div>
        </div>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Sheets */}
      <AnimatePresence>
        {appState.activeSheet === 'bot_settings' && (
          <BotSettings
            key="bot_settings"
            appState={appState}
            onClose={() => setSheet(null)}
            onSave={() => {
              setAppState(prev => ({ ...prev }));
            }}
          />
        )}
        {(appState.activeSheet === 'billing_renew' || appState.activeSheet === 'billing_first') && (
          <BillingRenew
            key="billing_renew"
            onClose={() => setSheet(null)}
            onSuccess={() => {
              setSheet(null);
              setToastMessage('Подписка успешно продлена! 🎉');
            }}
          />
        )}
        {appState.activeSheet === 'checkout' && appState.sheetData && 'tariff' in appState.sheetData && (
          <CheckoutSheet
            key="checkout"
            tariffId={appState.sheetData.tariff}
            onClose={() => setSheet(null)}
            onSuccess={(email) => {
              const tariff = appState.sheetData && 'tariff' in appState.sheetData ? appState.sheetData.tariff : 'basic';
              setAppState(prev => ({ ...prev, userEmail: email }));
              setSheet(null);
              setToastMessage(`Оплата принята! Спасибо за покупку тарифа ${tariff === 'pro' ? 'PRO' : 'Базовый'} 🎉`);
            }}
          />
        )}
        {appState.activeSheet === 'bot_create' && (
          <BotCreateSheet
            key="bot_create"
            onClose={() => setSheet(null)}
            onCreate={(botData) => {
              const newBot = {
                ...createBot(appState.bots.length),
                ...botData,
                username: botData.username?.startsWith('@') ? botData.username : `@${botData.username || 'username'}`,
              };
              setAppState(prev => ({
                ...prev,
                activeBot: newBot,
                bots: [...prev.bots, newBot],
              }));
              setSheet(null);
              setActiveTab('build');
              setToastMessage('Бот успешно создан! 🎉');
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
            onToggleStatus={(id, newStatus) => {
              setAppState(prev => {
                const isPro = prev.subscriptionStatus === 'active';
                const nextState = { ...prev };
                
                if (!isPro && newStatus === 'active') {
                  // Если не PRO, отключаем всех остальных ботов
                  nextState.bots = nextState.bots.map(b => ({
                    ...b,
                    status: b.id === id ? 'active' : 'inactive'
                  }));
                } else {
                  // Иначе просто переключаем статус конкретного бота
                  nextState.bots = nextState.bots.map(b => 
                    b.id === id ? { ...b, status: newStatus } : b
                  );
                }

                // Синхронизируем activeBot, если он затронут
                if (nextState.activeBot) {
                  const updatedActiveBot = nextState.bots.find(b => b.id === nextState.activeBot!.id);
                  if (updatedActiveBot) {
                    nextState.activeBot = { ...updatedActiveBot };
                  }
                }
                
                return nextState;
              });
            }}
            onAddBot={() => {
              const newBot = createBot(appState.bots.length);
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

      </AnimatePresence>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

    </div>
  );
}
