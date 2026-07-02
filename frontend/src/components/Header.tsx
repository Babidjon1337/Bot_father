import { ChevronDown } from 'lucide-react';
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
  subscription: 'Подписка',
  manage: 'Управление ботами'
};

export const Header = ({ activeTab, appState, setSheet }: HeaderProps) => {
  const { activeBot } = appState;

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

      {/* Right side is intentionally left empty since the save button is in the bottom bar */}
      <div className="flex items-center gap-2" />
    </header>
  );
};
