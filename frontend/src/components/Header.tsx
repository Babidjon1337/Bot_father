import { Play } from 'lucide-react';
import type { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
}

const TAB_TITLES: Record<TabType, string> = {
  overview: 'Обзор аккаунта',
  builder: 'Конструктор воронки',
  flow: 'Карта логики',
  stats: 'Аналитика прибыли',
  settings: 'Настройки',
};

export const Header = ({ activeTab }: HeaderProps) => {
  return (
    <header className="h-16 lg:h-20 bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <h2 className="font-black text-2xl lg:text-3xl tracking-tight text-foreground">
        {TAB_TITLES[activeTab]}
      </h2>
      <div className="flex items-center gap-3">
         <button className="bg-primary text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
           Сохранить
         </button>
      </div>
    </header>
  );
};
