import { Zap, Monitor, Layout, GitBranch, BarChart3, Settings } from 'lucide-react';
import { cn } from '../utils';
import type { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const NAV_ITEMS = [
  { id: 'overview' as const, icon: Monitor, label: 'Обзор', desc: 'Сводка и метрики' },
  { id: 'builder' as const, icon: Layout, label: 'Конструктор', desc: 'Редактор блоков' },
  { id: 'flow' as const, icon: GitBranch, label: 'Схема', desc: 'Логика воронки' },
  { id: 'stats' as const, icon: BarChart3, label: 'Аналитика', desc: 'Прибыль и конверсия' },
  { id: 'settings' as const, icon: Settings, label: 'Настройки', desc: 'Аккаунт и API' },
];

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <aside className="hidden lg:flex w-80 border-r border-white/5 bg-background flex-col p-8 gap-10">
      <div className="flex items-center gap-4 px-2">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
          <Zap size={24} color="white" fill="white" />
        </div>
        <h2 className="font-black text-2xl tracking-tighter text-foreground">Bot Father</h2>
      </div>

      <nav className="flex flex-col gap-3 flex-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-5 p-4 rounded-[24px] transition-all duration-300 group text-left",
              activeTab === item.id 
                ? "bg-primary text-white shadow-2xl shadow-primary/20 scale-[1.02]" 
                : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
              activeTab === item.id ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
            )}>
              <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            </div>
            <div>
              <div className="font-black text-sm tracking-tight">{item.label}</div>
              <div className={cn("text-[10px] font-bold uppercase tracking-widest mt-0.5", activeTab === item.id ? "text-white/60" : "text-muted-foreground/50")}>{item.desc}</div>
            </div>
          </button>
        ))}
      </nav>

      <div className="bg-card p-6 rounded-[32px] border border-white/5 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="text-[11px] font-black text-primary mb-2 uppercase tracking-[0.2em]">PRO ПЛАН</div>
          <div className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">
            Обновляется 24 июля 2026. <br/>Все функции разблокированы.
          </div>
          <button className="w-full bg-primary/10 text-primary font-black py-3 rounded-2xl text-xs hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95">
            Опубликовать
          </button>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
      </div>
    </aside>
  );
};

