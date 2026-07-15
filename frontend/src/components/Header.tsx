
import type { TabType, AppState, SheetType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  appState: AppState;
  setSheet: (sheet: SheetType) => void;
  onCreateBot: () => void;
}

const TAB_TITLES: Record<TabType, string> = {
  home:    'Статистика',
  build:   'Воронка',
  flow:    'Схема логики',
  profile: 'Профиль',
  subscription: 'Подписка',
  manage: 'Ваши боты'
};

export const Header = ({ activeTab }: HeaderProps) => {
  return (
    <header
      className="shrink-0 flex items-center justify-between px-4 lg:px-8 h-[56px] lg:h-[74px] glass-panel"
      style={{
        borderBottom: '1px solid var(--color-border)',
        zIndex: 40,
        position: 'sticky',
        top: 0
      }}
    >
      {/* Mobile Title Container (Centered absolute) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none lg:hidden">
        <h1 className="text-[17px] font-bold text-[var(--color-foreground)]" style={{ letterSpacing: '-0.01em' }}>
          {TAB_TITLES[activeTab]}
        </h1>
      </div>

      {/* Left: Desktop title + bot switcher */}
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <h1 className="text-screen-title hidden lg:block">{TAB_TITLES[activeTab]}</h1>
      </div>

      {/* Right side for desktop actions if any */}
      <div className="hidden lg:flex items-center gap-2" />
    </header>
  );
};
