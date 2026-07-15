import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { FunnelNode, TabType, AppState, SheetType } from '../types';
import { INITIAL_BLOCKS } from '../constants';

interface AppContextType {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  blocks: FunnelNode[];
  setBlocks: React.Dispatch<React.SetStateAction<FunnelNode[]>>;
  selectedBlockId: string;
  setSelectedBlockId: React.Dispatch<React.SetStateAction<string>>;
  toastMessage: string | null;
  setToastMessage: React.Dispatch<React.SetStateAction<string | null>>;
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  setSheet: (sheet: SheetType | null, data?: any) => void;
  toggleTheme: () => void;
  updateBlock: (id: string, field: keyof FunnelNode, value: string) => void;
  handleCreateBotClick: () => void;
  handlePurchaseSuccess: (plan: 'basic' | 'pro') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('bot_father_appState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, activeSheet: null };
      } catch (e) {}
    }
    return {
      activeBot: null,
      bots: [],
      subscriptionStatus: 'none',
      subscriptionUntil: null,
      slotsBought: 0,
      userEmail: '',
      activeSheet: null,
      isDirty: false,
    };
  });

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    return (localStorage.getItem('bot_father_activeTab') as TabType) || 'home';
  });
  
  const [blocks, setBlocks] = useState<FunnelNode[]>(() => {
    const saved = localStorage.getItem('bot_father_blocks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_BLOCKS;
  });
  
  const [selectedBlockId, setSelectedBlockId] = useState<string>('start');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('bot_father_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('bot_father_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('bot_father_appState', JSON.stringify(appState));
  }, [appState]);

  useEffect(() => {
    localStorage.setItem('bot_father_blocks', JSON.stringify(blocks));
  }, [blocks]);

  useEffect(() => {
    localStorage.setItem('bot_father_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setSheet = (sheet: SheetType | null, data?: any) =>
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

  const handlePurchaseSuccess = (plan: 'basic' | 'pro') => {
    setAppState(prev => {
      const nextState = { ...prev };
      if (plan === 'pro') {
        nextState.subscriptionStatus = 'active';
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
  };

  return (
    <AppContext.Provider
      value={{
        appState,
        setAppState,
        activeTab,
        setActiveTab,
        blocks,
        setBlocks,
        selectedBlockId,
        setSelectedBlockId,
        toastMessage,
        setToastMessage,
        theme,
        setTheme,
        setSheet,
        toggleTheme,
        updateBlock,
        handleCreateBotClick,
        handlePurchaseSuccess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
