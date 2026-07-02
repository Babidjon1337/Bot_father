
import { motion } from 'framer-motion';
import { Bot, Plus, ChevronRight, Settings } from 'lucide-react';
import type { AppState } from '../../types';

interface BotManagementProps {
  appState: AppState;
  onCreateBot: () => void;
  onOpenBot: (botId: string) => void;
  onEditBot: (botId: string) => void;
  onGoToSubscription: () => void;
}

export const BotManagement = ({ appState, onCreateBot, onOpenBot, onEditBot, onGoToSubscription }: BotManagementProps) => {
  const { bots, subscriptionStatus } = appState;
  const isSubscribed = subscriptionStatus === 'active';
  const hasBots = bots.length > 0;

  return (
    <div className="pb-24 max-w-5xl mx-auto px-4 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-1">
              Управление ботами
            </h1>
            <div className="text-[13px] text-[var(--color-foreground-secondary)] flex items-center gap-2">
              Главная <ChevronRight size={14} /> Управление ботами
            </div>
          </div>
          
          <button 
            onClick={onCreateBot}
            className="py-2.5 px-5 flex items-center gap-2 rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20 transition-all font-bold shadow-sm"
          >
            <Plus size={18} />
            Создать бота
          </button>
        </div>

        {/* State 1: No bots */}
        {!hasBots && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
            <div className="max-w-md text-center">
              <div className="w-48 h-48 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl" />
                <img src="/single_bot.png" alt="Bot" className="w-full h-full object-contain relative z-10" />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-2">
                У вас пока нет ботов
              </h2>
              <p className="text-[14px] text-[var(--color-foreground-secondary)] mb-6">
                Создайте своего первого бота и начните принимать платежи прямо в Telegram.
              </p>
              <button 
                onClick={onCreateBot}
                className="btn btn-action py-3 px-6 rounded-xl flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                Создать первого бота
              </button>
            </div>
          </div>
        )}

        {/* State 2 & 3: Bot List */}
        {hasBots && (
          <div className="space-y-6">
            
            {/* PRO Banner */}
            {isSubscribed && (
              <div 
                onClick={onGoToSubscription}
                className="group relative bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-center cursor-pointer transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-3xl group-hover:bg-[var(--color-accent)]/20 transition-colors" />
                
                <div className="flex-1 relative z-10 border-b md:border-b-0 md:border-r border-[var(--color-primary)]/10 pb-6 md:pb-0 md:pr-6">
                  <div className="text-[13px] text-[var(--color-primary)] font-medium mb-3 opacity-80">
                    Использование тарифа PRO
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-[var(--color-foreground)]">{bots.length}</span>
                    <span className="text-[15px] font-medium text-[var(--color-foreground-secondary)]">из 10 ботов</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--color-primary)] rounded-full transition-all" 
                      style={{ width: `${(bots.length / 10) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex-1 relative z-10 border-b md:border-b-0 md:border-r border-[var(--color-primary)]/10 pb-6 md:pb-0 md:pr-6 md:pl-2">
                  <div className="text-[13px] text-[var(--color-foreground-secondary)] font-medium mb-2">
                    Следующее списание
                  </div>
                  <div className="text-[16px] font-bold text-[var(--color-foreground)]">
                    25 июля 2026
                  </div>
                </div>

                <div className="flex-1 relative z-10 md:pl-2">
                  <div className="text-[13px] text-[var(--color-foreground-secondary)] font-medium mb-2">
                    Статус подписки
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                      </span>
                      <span className="text-[15px] font-bold text-[var(--color-foreground)]">Активна</span>
                    </div>
                    <div className="text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-[16px] font-bold text-[var(--color-foreground)] mb-4">Ваши боты</h3>
              
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
                      <tr>
                        <th className="py-3 px-6 text-[12px] font-semibold text-[var(--color-foreground-secondary)]">Бот</th>
                        <th className="py-3 px-6 text-[12px] font-semibold text-[var(--color-foreground-secondary)]">Пользователи</th>
                        <th className="py-3 px-6 text-[12px] font-semibold text-[var(--color-foreground-secondary)]">Платежи</th>
                        <th className="py-3 px-6 text-[12px] font-semibold text-[var(--color-foreground-secondary)]">Статус</th>
                        <th className="py-3 px-6 text-[12px] font-semibold text-[var(--color-foreground-secondary)] text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bots.map((bot, index) => {
                        const colors = [
                          { bg: 'rgba(79, 70, 229, 0.1)', text: '#4F46E5', border: 'rgba(79, 70, 229, 0.2)' },
                          { bg: 'rgba(22, 163, 74, 0.1)', text: '#16A34A', border: 'rgba(22, 163, 74, 0.2)' },
                          { bg: 'rgba(234, 88, 12, 0.1)', text: '#EA580C', border: 'rgba(234, 88, 12, 0.2)' },
                          { bg: 'rgba(219, 39, 119, 0.1)', text: '#DB2777', border: 'rgba(219, 39, 119, 0.2)' },
                          { bg: 'rgba(124, 58, 237, 0.1)', text: '#7C3AED', border: 'rgba(124, 58, 237, 0.2)' },
                          { bg: 'rgba(2, 132, 199, 0.1)', text: '#0284C7', border: 'rgba(2, 132, 199, 0.2)' },
                          { bg: 'rgba(220, 38, 38, 0.1)', text: '#DC2626', border: 'rgba(220, 38, 38, 0.2)' }
                        ];
                        const c = colors[index % colors.length];
                        return (
                        <tr key={bot.id} className={`border-b border-[var(--color-border)] hover:bg-[var(--color-surface-2)]/50 transition-colors ${index === bots.length - 1 ? 'border-b-0' : ''}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border" style={{ background: c.bg, borderColor: c.border }}>
                                <Bot size={20} style={{ color: c.text }} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-[14px] font-bold text-[var(--color-foreground)]">{bot.name}</span>
                                </div>
                                <div className="text-[12px] text-[var(--color-foreground-secondary)]">
                                  @{bot.username || 'username'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-[14px] font-semibold text-[var(--color-foreground)]">{bot.usersCount}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-[14px] font-semibold text-[var(--color-foreground)]">1 250 ₽</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="status-dot" style={{ background: bot.status === 'active' ? 'var(--color-success)' : 'var(--color-foreground-tertiary)', width: '6px', height: '6px' }} />
                              <span className="text-[13px] font-medium text-[var(--color-foreground)]">
                                {bot.status === 'active' ? 'Активен' : 'Отключен'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => onOpenBot(bot.id)}
                                className="py-1.5 px-4 rounded-lg text-[13px] font-bold h-auto bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/20 transition-colors shadow-sm"
                              >
                                Открыть
                              </button>
                              <button 
                                onClick={() => onEditBot(bot.id)}
                                title="Редактировать бота"
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] transition-colors border border-transparent hover:border-[var(--color-border)]"
                              >
                                <Settings size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
