import { Home, Layers, User, GitBranch, Crown, Settings, Moon, ChevronDown } from 'lucide-react';
import { cn } from '../utils';
import type { TabType, AppState, SheetType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  appState: AppState;
  setSheet: (sheet: SheetType) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const MAIN_NAV: { id: TabType; icon: React.FC<any>; label: string; activeColor: string }[] = [
  { id: 'home',    icon: Home,      label: 'Статистика', activeColor: 'var(--color-primary)'  },
  { id: 'build',   icon: Layers,    label: 'Воронка', activeColor: 'var(--color-accent)'  },
  { id: 'profile', icon: User,      label: 'Профиль', activeColor: 'var(--color-success)'  },
];

export const Sidebar = ({ activeTab, setActiveTab, appState, setSheet, theme, toggleTheme }: SidebarProps) => {
  const { activeBot, subscriptionStatus } = appState;
  const isSubscribed = subscriptionStatus === 'active';

  return (
    <aside
      className="hidden lg:flex flex-col w-[240px] shrink-0 fixed top-0 left-0 bottom-0"
      style={{
        background: 'var(--color-sidebar)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Logo */}
      <div 
        className="px-5 flex justify-center items-center shrink-0" 
        style={{ 
          height: '74px', 
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-sidebar)'
        }}
      >
        <span
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--color-foreground)',
            letterSpacing: '-0.02em',
          }}
        >
          Bot Father
        </span>
      </div>

      {/* Bot switcher — only if bot connected */}
      {activeBot && (
        <div className="px-3 pt-4">
          <button
            onClick={() => setSheet('bot_switcher')}
            className={cn(
              "w-full flex items-center gap-3 px-2 py-2 rounded-[var(--radius-sm)] text-left",
              "hover:bg-[var(--color-surface-2)] transition-colors"
            )}
          >
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white shrink-0"
              style={{
                background: 'var(--color-primary)',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {activeBot.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="truncate"
                style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-foreground)' }}
              >
                {activeBot.name}
              </div>
              <div
                className="truncate flex items-center gap-1"
                style={{ fontSize: '11px', color: 'var(--color-foreground-tertiary)' }}
              >
                <span
                  className="status-dot"
                  style={{
                    background: activeBot.status === 'active'
                      ? 'var(--color-success)'
                      : 'var(--color-foreground-tertiary)',
                    width: '5px',
                    height: '5px',
                  }}
                />
                {activeBot.status === 'active' ? 'Активен' : 'Черновик'}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--color-foreground-tertiary)', flexShrink: 0 }} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 min-h-0 px-3 pt-3 pb-2 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="nav-label mb-2">Навигация</div>

        {MAIN_NAV.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn('nav-item', isActive && 'active')}
              style={{
                color: isActive ? 'var(--color-foreground)' : 'var(--color-foreground-secondary)',
                background: isActive ? 'var(--color-surface-2)' : 'transparent',
              }}
            >
              <div
                data-tour={item.id === 'home' ? 'tour-nav-stats' : item.id === 'profile' ? 'tour-nav-profile' : item.id === 'build' ? 'tour-funnel-tab' : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <item.icon
                  size={18}
                  strokeWidth={isActive ? 2 : 1.75}
                  style={{
                    flexShrink: 0,
                    color: item.activeColor,
                    transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                />
                {item.label}
              </div>
            </button>
          );
        })}

        {/* Desktop-only: Flow map */}
        <div className="divider" style={{ margin: '12px 0' }} />
        <div className="nav-label mb-2" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-foreground-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Инструменты</div>
        <button
          onClick={() => setActiveTab('flow')}
          className={cn('nav-item', activeTab === 'flow' && 'active')}
          style={{
            color: activeTab === 'flow' ? 'var(--color-foreground)' : 'var(--color-foreground-secondary)',
            background: activeTab === 'flow' ? 'var(--color-surface-2)' : 'transparent',
          }}
        >
          <GitBranch
            size={18}
            strokeWidth={activeTab === 'flow' ? 2 : 1.75}
            style={{ 
              flexShrink: 0, 
              color: 'var(--color-warning)',
              transform: activeTab === 'flow' ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          />
          Схема логики
        </button>
      </nav>
        {/* Bottom controls */}
        <div className="mt-auto flex flex-col gap-1.5 pt-2 px-3 pb-3 shrink-0">
          <button
            onClick={() => setActiveTab('subscription')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left"
            style={{
              background: activeTab === 'subscription' ? 'var(--color-surface-2)' : 'var(--color-surface)',
              border: '1px solid',
              borderColor: activeTab === 'subscription' ? 'var(--color-border)' : 'var(--color-surface)',
              color: activeTab === 'subscription' ? 'var(--color-primary)' : 'var(--color-foreground)',
            }}
          >
            <Crown size={18} className={activeTab === 'subscription' ? "text-[var(--color-primary)]" : "text-[var(--color-foreground-secondary)]"} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: activeTab === 'subscription' ? 'var(--color-primary)' : 'var(--color-foreground)' }}>Подписка</span>
          </button>

          {/* Tariff Card */}
          <div className="mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3">
            <div style={{ fontSize: '11px', color: 'var(--color-foreground-secondary)' }} className="mb-1">Ваш тариф</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-foreground)' }} className="mb-2">
              {isSubscribed ? 'PRO Подписка' : 'Базовый'}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: '12px', color: 'var(--color-foreground-secondary)' }}>
                {isSubscribed ? `${appState.bots.length} из 10 ботов` : '1 бот'}
              </span>
              <span
                className="status-dot"
                style={{
                  background: 'var(--color-success)',
                  width: '6px',
                  height: '6px',
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--color-foreground-secondary)' }}>Активен</span>
            </div>
            <button
              onClick={() => setActiveTab('subscription')}
              className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors"
            >
              <Settings size={14} className="text-[var(--color-foreground-secondary)]" />
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-foreground)' }}>Управление</span>
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-colors text-left"
          >
            <Moon size={18} className="text-[var(--color-foreground-secondary)]" />
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-foreground)', flex: 1 }}>Тёмная тема</span>
            {/* Toggle switch */}
            <div 
              className="w-8 h-5 rounded-full relative transition-colors duration-200"
              style={{ background: theme === 'dark' ? 'var(--color-primary)' : 'var(--color-border)' }}
            >
              <div 
                className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-200 shadow-sm"
                style={{ 
                  left: theme === 'dark' ? 'calc(100% - 18px)' : '2px',
                }}
              />
            </div>
          </button>
        </div>
      </aside>
  );
};
