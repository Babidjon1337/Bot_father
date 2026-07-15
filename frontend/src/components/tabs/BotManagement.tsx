import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "../AlertProvider";
import {
  Bot,
  Plus,
  Settings,
  Users,
  ArrowRight,
  Activity,
  Power,
  RefreshCw,
  Trash2,
  TrendingUp,
  MessageSquare,
  CreditCard,
  Lock
} from "lucide-react";
import { EmptyBotState } from "../EmptyBotState";
import { useAppState } from "../../providers/AppStateProvider";

export const BotManagement = () => {
  const { appState, setAppState, setSheet, setActiveTab, handleCreateBotClick: onCreateBot } = useAppState();
  const { bots, subscriptionStatus } = appState;
  const hasBots = bots.length > 0;
  const isPro = subscriptionStatus === "active";
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { showConfirm } = useAlert();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenuId]);

  if (!hasBots) {
    return <EmptyBotState onCreateBot={onCreateBot} title="Список ботов пуст" description="Создайте своего первого Telegram-бота, чтобы начать управлять ими здесь." />;
  }

  const activeBots = bots.filter((b) => b.status === "active").length;
  const totalUsers = bots.reduce((s, b) => s + (b.usersCount || 0), 0);

  const onEditBot = (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (bot) {
      setAppState(prev => ({ ...prev, activeBot: bot }));
      setActiveTab('build');
    }
  };

  const onEditBotSettings = (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (bot) {
      setAppState(prev => ({ ...prev, activeBot: bot }));
      setSheet('bot_settings');
    }
  };

  const onToggleBot = (botId: string, newStatus: 'active' | 'inactive') => {
    setAppState(prev => ({
      ...prev,
      bots: prev.bots.map(b => b.id === botId ? { ...b, status: newStatus } : b),
      activeBot: prev.activeBot?.id === botId ? { ...prev.activeBot, status: newStatus } : prev.activeBot,
    }));
  };

  const onDeleteBot = (botId: string) => {
    setAppState(prev => ({
      ...prev,
      bots: prev.bots.filter(b => b.id !== botId),
      activeBot: prev.activeBot?.id === botId ? null : prev.activeBot,
    }));
  };

  return (
    <div className="pb-24 w-full max-w-[1000px] mx-auto px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Управление ботами</h1>
            <p className="text-[14px] text-[var(--color-foreground-secondary)] mt-1">Аналитика и настройки всех ваших проектов</p>
          </div>
          <button 
            onClick={() => {
              if (!isPro && bots.length >= 1) {
                setActiveTab('subscription');
              } else {
                onCreateBot();
              }
            }}
            className="btn-primary-saas whitespace-nowrap"
            style={{ height: '44px', padding: '0 20px', borderRadius: '14px', fontSize: '14px' }}
          >
            {(!isPro && bots.length >= 1) ? <Lock size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
            {(!isPro && bots.length >= 1) ? 'Доступно в PRO' : 'Создать бота'}
          </button>
        </div>

        {/* Analytics Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Всего ботов", value: bots.length, sub: "Запущено", icon: Bot, color: "var(--color-primary)" },
            { label: "Активных", value: activeBots, sub: "В работе", icon: Activity, color: "var(--color-success)" },
            { label: "Пользователей", value: totalUsers, sub: "Суммарно", icon: Users, color: "var(--color-accent)" },
            { label: "Конверсия", value: "24%", sub: "В оплату", icon: TrendingUp, color: "var(--color-warning)" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-saas p-4 relative overflow-hidden group"
              style={{ borderRadius: '20px' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${stat.color}15`, color: stat.color }}>
                  <stat.icon size={18} />
                </div>
                <div className="text-[24px] font-bold text-[var(--color-foreground)] leading-none">{stat.value}</div>
              </div>
              <div className="text-[14px] font-semibold text-[var(--color-foreground)]">{stat.label}</div>
              <div className="text-[12px] text-[var(--color-foreground-tertiary)]">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Bots List */}
        <div className="space-y-4" ref={menuRef}>
          {bots.map((bot, index) => {
            const initials = bot.name.substring(0, 2).toUpperCase();
            const isActive = bot.status === "active";
            const isMenuOpen = openMenuId === bot.id;

            return (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-saas p-0 overflow-visible relative group"
                style={{ borderRadius: '24px' }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center p-5 gap-6">
                  
                  {/* Info Section */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-[60px] h-[60px] rounded-[18px] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white flex items-center justify-center text-xl font-black shadow-md shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-[18px] font-bold text-[var(--color-foreground)] truncate max-w-[200px]">{bot.name}</h3>
                        {!bot.paymentProvider && (
                          <div className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--color-warning-soft)] text-[var(--color-warning)]" title="Платежная система не подключена">
                            Нет кассы
                          </div>
                        )}
                        <div className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${isActive ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]' : 'bg-[var(--color-surface-2)] text-[var(--color-foreground-tertiary)]'}`}>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />}
                          {isActive ? 'Работает' : 'Черновик'}
                        </div>
                      </div>
                      <div className="text-[14px] text-[var(--color-foreground-secondary)] truncate">@{bot.username?.replace('@', '') || 'username'}</div>
                    </div>
                  </div>

                  {/* Quick Stats Section */}
                  <div className="flex items-center gap-6 lg:border-l lg:border-[var(--color-border)] lg:pl-6">
                    <div className="text-center lg:text-left">
                      <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-foreground-tertiary)] mb-1">
                        <Users size={12} /> Лиды
                      </div>
                      <div className="text-[16px] font-bold text-[var(--color-foreground)]">{bot.usersCount}</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-foreground-tertiary)] mb-1">
                        <MessageSquare size={12} /> Сообщения
                      </div>
                      <div className="text-[16px] font-bold text-[var(--color-foreground)]">{(bot.usersCount || 0) * 3 + 15}</div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-foreground-tertiary)] mb-1">
                        <CreditCard size={12} /> Выручка
                      </div>
                      <div className="text-[16px] font-bold text-[var(--color-success)]">{bot.paymentProvider ? '14 500 ₽' : '0 ₽'}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-[var(--color-border)] lg:border-none w-full lg:w-auto shrink-0 relative">
                    <button
                      onClick={() => onEditBot(bot.id)}
                      className="flex-1 lg:flex-none btn-primary-saas px-4 py-2.5 rounded-[12px] text-[13px] gap-2 shadow-sm"
                    >
                      Редактор <ArrowRight size={14} />
                    </button>
                    
                    <button
                      onClick={() => onToggleBot(bot.id, isActive ? 'inactive' : 'active')}
                      className="w-10 h-10 rounded-[12px] flex items-center justify-center border transition-colors hover:bg-[var(--color-surface-2)] shrink-0"
                      style={{
                        borderColor: isActive ? 'var(--color-success-soft)' : 'var(--color-border)',
                        color: isActive ? 'var(--color-success)' : 'var(--color-foreground-tertiary)'
                      }}
                      title={isActive ? "Остановить" : "Запустить"}
                    >
                      <Power size={16} />
                    </button>

                    <button
                      onClick={() => setOpenMenuId(isMenuOpen ? null : bot.id)}
                      className={`w-10 h-10 rounded-[12px] flex items-center justify-center border transition-colors shrink-0 ${isMenuOpen ? 'bg-[var(--color-primary-soft)] border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-[var(--color-border)] hover:bg-[var(--color-surface-2)] text-[var(--color-foreground-secondary)]'}`}
                    >
                      <Settings size={16} />
                    </button>

                    <AnimatePresence>
                      {isMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-14 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl rounded-xl overflow-hidden z-20"
                        >
                          <div className="p-1">
                            <button onClick={() => { setOpenMenuId(null); onEditBotSettings(bot.id); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-[14px] font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface-2)] rounded-lg transition-colors">
                              <Settings size={16} /> Настройки бота
                            </button>
                            <div className="h-px w-full bg-[var(--color-border)] my-1" />
                            <button onClick={() => { setOpenMenuId(null); showConfirm({ title: "Очистить базу лидов?", message: "Эта операция удалит всех пользователей. Воронки сохранятся.", type: "warning", confirmText: "Сбросить", cancelText: "Отмена", onConfirm: () => {} }); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-[14px] font-medium text-[var(--color-warning)] hover:bg-[var(--color-warning-soft)] rounded-lg transition-colors">
                              <RefreshCw size={16} /> Сбросить базу
                            </button>
                            <button onClick={() => { setOpenMenuId(null); showConfirm({ title: "Удалить бота?", message: "Бот будет удален навсегда.", type: "danger", confirmText: "Удалить", cancelText: "Отмена", onConfirm: () => onDeleteBot(bot.id) }); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-[14px] font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] rounded-lg transition-colors">
                              <Trash2 size={16} /> Удалить бота
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </motion.div>
    </div>
  );
};
