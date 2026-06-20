import { Save, ChevronDown } from 'lucide-react';
import { cn } from '../utils';
import type { TabType, AppState, SheetType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  appState: AppState;
  setSheet: (sheet: SheetType) => void;
}

const TAB_TITLES: Record<TabType, string> = {
  home:    'Статистика',
  build:   'Воронка',
  flow:    'Схема логики',
  profile: 'Профиль',
};

export const Header = ({ activeTab, appState, setSheet }: HeaderProps) => {
  const { activeBot, isDirty } = appState;

  return (
    <header
      className="shrink-0 flex items-center justify-between px-5 lg:px-8 h-[56px] lg:h-[74px]"
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        zIndex: 40,
      }}
    >
      {/* Left: title + bot switcher on mobile */}
      <div className="flex items-center gap-3">
        <h1 className="text-screen-title">{TAB_TITLES[activeTab]}</h1>

        {/* Mobile bot switcher — always show to hint at multiple bots */}
        {activeBot && (
          <button
            onClick={() => setSheet('bot_switcher')}
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-xs)] transition-colors duration-150 hover:bg-black/[0.04]"
          >
            <span
              style={{ fontSize: '13px', fontWeight: 400, color: 'var(--color-foreground-secondary)' }}
            >
              {activeBot.name}
            </span>
            <ChevronDown size={13} style={{ color: 'var(--color-foreground-tertiary)' }} />
          </button>
        )}
      </div>

      {/* Right: save icon for build tab */}
      <div className="flex items-center gap-2">
        {activeTab === 'build' && (
          <button
            title="Сохранить черновик"
            onClick={() => {
              const tg = (window as any).Telegram?.WebApp;
              if (tg) tg.HapticFeedback.impactOccurred('medium');
            }}
            className={cn(
              'flex items-center gap-2 px-3 rounded-[var(--radius-xs)] transition-colors duration-150',
              isDirty
                ? 'text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]'
                : 'text-[var(--color-foreground-tertiary)] hover:bg-black/[0.04] hover:text-[var(--color-foreground-secondary)]'
            )}
            style={{ height: '32px', fontSize: '13px', fontWeight: 400 }}
          >
            <Save size={15} strokeWidth={1.75} />
            {isDirty && <span>Сохранить</span>}
          </button>
        )}
      </div>
    </header>
  );
};
