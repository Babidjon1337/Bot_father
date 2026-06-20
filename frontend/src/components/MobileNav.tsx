import { Home, Layers, User } from 'lucide-react';
import type { TabType } from '../types';

interface MobileNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TABS: { id: TabType; icon: React.FC<any>; label: string; activeColor: string; inactiveColor: string }[] = [
  { id: 'home',    icon: Home,   label: 'Статистика', activeColor: 'var(--color-primary)', inactiveColor: 'var(--color-primary-soft)' },
  { id: 'build',   icon: Layers, label: 'Воронка', activeColor: 'var(--color-accent)', inactiveColor: 'var(--color-accent-soft)' },
  { id: 'profile', icon: User,   label: 'Профиль', activeColor: 'var(--color-success)', inactiveColor: 'var(--color-success-soft)' },
];

export const MobileNav = ({ activeTab, setActiveTab }: MobileNavProps) => {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 lg:hidden"
      style={{
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-nav)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 4px)',
      }}
    >
      <div className="flex justify-around items-stretch h-[52px]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                const tg = (window as any).Telegram?.WebApp;
                if (tg) tg.HapticFeedback.selectionChanged();
                setActiveTab(tab.id);
              }}
              className="flex flex-col items-center justify-center gap-1 flex-1 transition-colors duration-150"
              style={{
                color: isActive ? tab.activeColor : 'var(--color-foreground-tertiary)',
              }}
            >
              <div
                data-tour={tab.id === 'home' ? 'tour-nav-stats' : tab.id === 'profile' ? 'tour-nav-profile' : tab.id === 'build' ? 'tour-funnel-tab' : undefined}
                className="flex flex-col items-center justify-center gap-1"
                style={{ padding: '0 8px' }}
              >
                <tab.icon
                  size={24}
                  strokeWidth={isActive ? 2 : 1.75}
                  style={{
                    color: tab.activeColor,
                    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none',
                    transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? 'var(--color-foreground)' : 'var(--color-foreground-secondary)'
                  }}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
