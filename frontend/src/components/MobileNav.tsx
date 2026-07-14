import { Home, Layers, User, Bot } from 'lucide-react';
import type { TabType } from '../types';

interface MobileNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TABS: { id: TabType; icon: React.FC<any>; label: string; activeColor: string }[] = [
  { id: 'home',    icon: Home,   label: 'Главная',  activeColor: 'var(--color-primary)' },
  { id: 'build',   icon: Layers, label: 'Воронка',  activeColor: 'var(--color-accent)' },
  { id: 'manage',  icon: Bot,    label: 'Боты',     activeColor: 'var(--color-warning)' },
  { id: 'profile', icon: User,   label: 'Профиль',  activeColor: 'var(--color-success)' },
];

export const MobileNav = ({ activeTab, setActiveTab }: MobileNavProps) => {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 lg:hidden"
      aria-label="Мобильная навигация"
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex justify-around items-stretch h-[56px]">
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
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
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
                  size={22}
                  strokeWidth={isActive ? 2 : 1.75}
                  style={{
                    color: isActive ? tab.activeColor : 'var(--color-foreground-tertiary)',
                    transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? tab.activeColor : 'var(--color-foreground-tertiary)',
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
