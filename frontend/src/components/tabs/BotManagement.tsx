import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlert } from '../AlertProvider';
import { Bot, Plus, Settings, Users, Zap, MoreHorizontal, ArrowRight, Activity, Power, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { EmptyBotState } from '../EmptyBotState';
import type { AppState } from '../../types';

interface BotManagementProps {
  appState: AppState;
  onCreateBot: () => void;
  onOpenBot: (botId: string) => void;
  onEditBot: (botId: string) => void;
  onEditBotSettings: (botId: string) => void;
  onToggleBot?: (botId: string, newStatus: 'active' | 'inactive') => void;
  onDeleteBot?: (botId: string) => void;
  onClearLeads?: (botId: string) => void;
}

const BOT_GRADIENTS = [
  { from: '#4F46E5', to: '#818CF8', soft: 'rgba(79,70,229,0.08)', border: 'rgba(79,70,229,0.2)' },
  { from: '#7C3AED', to: '#A78BFA', soft: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)' },
  { from: '#0284C7', to: '#38BDF8', soft: 'rgba(2,132,199,0.08)', border: 'rgba(2,132,199,0.2)' },
  { from: '#16A34A', to: '#4ADE80', soft: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.2)' },
  { from: '#DB2777', to: '#F472B6', soft: 'rgba(219,39,119,0.08)', border: 'rgba(219,39,119,0.2)' },
  { from: '#EA580C', to: '#FB923C', soft: 'rgba(234,88,12,0.08)', border: 'rgba(234,88,12,0.2)' },
  { from: '#0891B2', to: '#67E8F9', soft: 'rgba(8,145,178,0.08)', border: 'rgba(8,145,178,0.2)' },
];

export const BotManagement = ({ appState, onCreateBot, onOpenBot, onEditBot, onEditBotSettings, onToggleBot, onDeleteBot, onClearLeads }: BotManagementProps) => {
  const { bots } = appState;
  const hasBots = bots.length > 0;
  const activeBots = bots.filter(b => b.status === 'active').length;
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { showAlert, showConfirm } = useAlert();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuId]);

  return (
    <div className="pb-24 w-full max-w-6xl mx-auto px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Header — no create button here */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-1">
            Управление ботами
          </h1>
          <div className="text-[13px] text-[var(--color-foreground-secondary)]">
            Главная <span className="opacity-40">/</span> Боты
          </div>
        </div>

        {/* Stats bar */}
        {hasBots && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Всего ботов', value: bots.length, icon: Bot, color: 'var(--color-primary)' },
              { label: 'Активных', value: activeBots, icon: Activity, color: 'var(--color-success)' },
              { label: 'Пользователей', value: bots.reduce((s, b) => s + (b.usersCount || 0), 0), icon: Users, color: 'var(--color-accent)' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card-saas p-4 flex items-center gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${stat.color}18` }}
                >
                  <stat.icon size={20} style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-[22px] font-bold text-[var(--color-foreground)] leading-none mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-[12px] text-[var(--color-foreground-secondary)]">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!hasBots && (
          <EmptyBotState onCreateBot={onCreateBot} />
        )}

        {/* Bot cards grid */}
        {hasBots && (
          <div>
            <h3 className="text-[15px] font-bold text-[var(--color-foreground)] mb-4">Ваши боты</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bots.map((bot, index) => {
                const g = BOT_GRADIENTS[index % BOT_GRADIENTS.length];
                const initials = bot.name.substring(0, 2).toUpperCase();
                const isActive = bot.status === 'active';
                const isMenuOpen = openMenuId === bot.id;

                return (
                  <motion.div
                    key={bot.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    className="relative card-saas overflow-visible"
                  >
                    {/* Gradient top strip */}
                    <div
                      className="h-1 w-full rounded-t-2xl"
                      style={{ background: `linear-gradient(90deg, ${g.from}, ${g.to})` }}
                    />

                    <div className="p-5">
                      {/* Top row: avatar + name + toggle + menu */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-[14px] shrink-0 shadow-sm"
                            style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                          >
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              defaultValue={bot.name}
                              className="text-[15px] font-bold text-[var(--color-foreground)] leading-tight mb-0.5 bg-transparent border-none outline-none hover:bg-[var(--color-surface-2)] focus:bg-[var(--color-surface-2)] focus:ring-2 focus:ring-[var(--color-primary-soft)] rounded px-1 -ml-1 w-full transition-all truncate"
                              placeholder="Имя бота"
                            />
                            <div className="text-[12px] text-[var(--color-foreground-secondary)] px-1">
                              @{(bot.username || 'username').replace('@', '')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Power toggle */}
                          <button
                            onClick={() => onToggleBot?.(bot.id, isActive ? 'inactive' : 'active')}
                            title={isActive ? 'Отключить бота' : 'Включить бота'}
                            className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
                            style={{
                              background: isActive ? 'var(--color-success-soft)' : 'var(--color-surface-2)',
                              color: isActive ? 'var(--color-success)' : 'var(--color-foreground-tertiary)',
                              border: `1px solid ${isActive ? 'rgba(22,163,74,0.2)' : 'var(--color-border)'}`,
                              width: '90px',
                              flexShrink: 0
                            }}
                          >
                            <Power size={11} />
                            {isActive ? 'Активен' : 'Выкл'}
                          </button>

                        </div>
                      </div>

                      {/* Stats row */}
                      <div
                        className="flex flex-wrap items-center justify-between gap-2 py-3 px-3 rounded-xl mb-4"
                        style={{ background: g.soft }}
                      >
                        <div className="flex items-center gap-1.5 text-[12px] min-w-0">
                          <Users size={12} style={{ color: g.from, flexShrink: 0 }} />
                          <span className="font-semibold text-[var(--color-foreground)]">{bot.usersCount}</span>
                          <span className="text-[var(--color-foreground-secondary)] truncate">польз.</span>
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-[var(--color-border)] opacity-50" />
                        <div className="flex items-center gap-1.5 text-[12px] min-w-0">
                          <Zap size={12} style={{ color: g.from, flexShrink: 0 }} />
                          <span className="font-semibold text-[var(--color-foreground)]">1 250 ₽</span>
                          <span className="text-[var(--color-foreground-secondary)] truncate">доход</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditBot(bot.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
                          style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                        >
                          Открыть
                          <ArrowRight size={14} />
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(isMenuOpen ? null : bot.id)}
                            title="Меню бота"
                            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-colors ${
                              isMenuOpen 
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]' 
                                : 'border-[var(--color-border)] hover:bg-[var(--color-surface-2)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]'
                            }`}
                          >
                            <Settings size={15} />
                          </button>

                          <AnimatePresence>
                            {isMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-12 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl rounded-xl overflow-hidden z-20"
                                style={{ transformOrigin: 'top right' }}
                              >
                                <div className="p-1">
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      onEditBotSettings(bot.id);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-[14px] text-[var(--color-foreground)] hover:bg-[var(--color-surface-2)] rounded-lg transition-colors"
                                  >
                                    <Settings size={16} />
                                    <span>Настройки бота</span>
                                  </button>
                                  <div className="h-px w-full bg-[var(--color-border)] my-1" />
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      showConfirm({
                                        title: 'Очистить базу лидов?',
                                        message: 'Эта операция удалит всех пользователей и собранные данные (лиды) из базы этого бота. Воронки и настройки сохранятся. Вы уверены, что хотите сбросить базу?',
                                        type: 'warning',
                                        confirmText: 'Да, сбросить',
                                        cancelText: 'Отмена',
                                        onConfirm: () => onClearLeads?.(bot.id)
                                      });
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-[14px] text-[var(--color-warning)] hover:bg-[var(--color-warning-soft)] rounded-lg transition-colors"
                                  >
                                    <RefreshCw size={16} />
                                    <span>Сбросить базу</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      showConfirm({
                                        title: 'Удалить бота?',
                                        message: 'Вы уверены, что хотите полностью удалить этого бота? Все настройки, воронки и база пользователей будут удалены без возможности восстановления.',
                                        type: 'danger',
                                        confirmText: 'Удалить навсегда',
                                        cancelText: 'Отмена',
                                        onConfirm: () => onDeleteBot?.(bot.id)
                                      });
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-[14px] text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                    <span>Удалить бота</span>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Add bot card */}
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: bots.length * 0.07 }}
                onClick={onCreateBot}
                className="group bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] rounded-2xl p-5 flex flex-col items-center justify-center min-h-[200px] hover:border-[var(--color-border-strong)] transition-all duration-300 text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  style={{ background: 'var(--color-primary-soft)' }}
                >
                  <Plus size={22} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="text-[14px] font-bold text-[var(--color-foreground)] mb-1">Добавить бота</div>
                <div className="text-[12px] text-[var(--color-foreground-secondary)]">Создайте нового бота</div>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
