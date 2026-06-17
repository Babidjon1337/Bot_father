import { motion } from 'framer-motion';
import { Monitor, Layout, GitBranch, BarChart3, Settings } from 'lucide-react';
import { cn } from '../utils';
import type { TabType } from '../types';

interface MobileNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TABS = [
  { id: 'overview' as const, icon: Monitor, label: 'Обзор' },
  { id: 'builder' as const, icon: Layout, label: 'Редактор' },
  { id: 'flow' as const, icon: GitBranch, label: 'Схема' },
  { id: 'stats' as const, icon: BarChart3, label: 'Статс' },
  { id: 'settings' as const, icon: Settings, label: 'Опции' },
];

export const MobileNav = ({ activeTab, setActiveTab }: MobileNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full glass rounded-t-[32px] border-b-0 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 px-6 flex justify-between items-center z-50 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            const tg = (window as any).Telegram?.WebApp;
            if (tg) tg.HapticFeedback.impactOccurred('light');
            setActiveTab(tab.id);
          }}
          className={cn(
            "flex flex-col items-center gap-2 p-2 transition-all duration-300 relative min-w-[64px]",
            activeTab === tab.id ? "text-primary scale-105" : "text-muted-foreground/50 hover:text-muted-foreground"
          )}
        >
          <div className={cn(
            "p-1.5 rounded-xl transition-colors duration-300",
            activeTab === tab.id ? "bg-primary/10" : "bg-transparent"
          )}>
            <tab.icon size={26} strokeWidth={activeTab === tab.id ? 2.2 : 1.8} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.05em] leading-none">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div 
              layoutId="activeTab"
              className="absolute -top-1.5 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]"
            />
          )}
        </button>
      ))}
    </nav>
  );
};
