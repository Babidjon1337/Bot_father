import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Crown, 
  CheckCircle2, XCircle, Bot, Users, CreditCard, LineChart, RefreshCcw, Headphones, ChevronLeft, Lock
} from 'lucide-react';

import type { AppState } from '../../types';

interface SubscriptionProps {
  appState: AppState;
  onPurchaseSuccess: (plan: 'basic' | 'pro') => void;
  onGoToBots: () => void;
}

export const Subscription = ({ appState, onPurchaseSuccess, onGoToBots }: SubscriptionProps) => {
  const [step, setStep] = useState<'select' | 'confirm' | 'success' | 'active'>('select');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | null>(null);
  const [email, setEmail] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelledUntil, setCancelledUntil] = useState<string | null>(null);

  // Confetti effect state
  const [confetti, setConfetti] = useState<{id: number, x: number, color: string, delay: number}[]>([]);

  useEffect(() => {
    if (step === 'success') {
      const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
      const newConfetti = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5
      }));
      setConfetti(newConfetti);
    }
  }, [step]);

  useEffect(() => {
    if (appState.subscriptionStatus !== 'active') {
      setStep('select');
      setSelectedPlan(null);
    }
  }, [appState.subscriptionStatus]);

  const handleSelectPlan = (plan: 'basic' | 'pro') => {
    setSelectedPlan(plan);
    setStep('confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      if (selectedPlan) {
        onPurchaseSuccess(selectedPlan);
      }
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const planDetails = {
    basic: {
      name: 'Базовый бот',
      price: '2 000 ₽',
      period: 'навсегда',
      sub: '1 бот разово',
      icon: <Star style={{ color: 'var(--color-primary)' }} size={24} />,
      image: '/single_bot.png',
      features: [
        { icon: <Bot size={18} />, text: '1 активный бот' },
        { icon: <Users size={18} />, text: 'До 10 000 пользователей' },
        { icon: <CreditCard size={18} />, text: 'Приём платежей (ком. 2%)' },
      ]
    },
    pro: {
      name: 'PRO Подписка',
      price: '3 000 ₽',
      period: '/ мес',
      sub: 'до 10 ботов',
      icon: <Crown style={{ color: 'var(--color-accent)' }} size={24} />,
      image: '/pro_sub.png',
      features: [
        { icon: <Bot size={18} />, text: 'До 10 активных ботов' },
        { icon: <Users size={18} />, text: 'Без ограничений на пользователей' },
        { icon: <CreditCard size={18} />, text: 'Приём платежей без комиссии' },
        { icon: <LineChart size={18} />, text: 'Аналитика и статистика' },
        { icon: <Headphones size={18} />, text: 'Приоритетная поддержка' },
      ]
    }
  };

  return (
    <div className="pb-24 max-w-5xl mx-auto w-full min-h-[80vh] flex flex-col">
      <style>{`
        @keyframes slow-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {appState.subscriptionStatus === 'active' ? (
        <motion.div
          key="active-sub"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          {/* Top Banner */}
          <div className="bg-[var(--color-primary-soft)] rounded-2xl p-6 md:p-8 mb-6 flex flex-col md:flex-row gap-6 md:items-start justify-between">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-sm shrink-0 self-start">
                <Crown size={32} className="text-[var(--color-accent)] md:w-10 md:h-10" />
              </div>
              <div>
                <div className="text-[13px] md:text-[14px] text-[var(--color-foreground-secondary)] mb-1">Ваш тариф</div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)]">PRO</span>
                  <span className="px-3 py-1 bg-[var(--color-success-soft)] text-[var(--color-success)] text-[12px] font-bold rounded-full">
                    ✓ Активен
                  </span>
                </div>
                <div className="text-[16px] md:text-[18px] font-bold text-[var(--color-foreground)] mb-1">
                  {appState.bots.length} из 10 ботов
                </div>
                <div className="text-[13px] md:text-[14px] text-[var(--color-foreground-secondary)]">
                  Вы используете {appState.bots.length} бота из доступных 10
                </div>
              </div>
            </div>
            
            <div className="md:text-right pt-2 md:pt-0 border-t border-[var(--color-primary)]/10 md:border-t-0">
              <div className="text-[13px] md:text-[14px] text-[var(--color-foreground-secondary)] mb-2 mt-4 md:mt-0">Следующее списание</div>
              <div className="text-[18px] md:text-[20px] font-bold text-[var(--color-foreground)] mb-1 md:mb-2">25 июля 2025</div>
              <div className="text-[13px] md:text-[14px] text-[var(--color-foreground-secondary)]">Списания проходят автоматически</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="card-saas p-5 md:p-6">
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <div className="w-8 h-8 rounded bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center">
                  <Crown size={18} />
                </div>
                <h3 className="text-[15px] md:text-[16px] font-bold text-[var(--color-foreground)]">Что включено в PRO</h3>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'До 10 ботов',
                  'Неограниченные воронки',
                  'Приём платежей',
                  'Расширенная аналитика',
                  'Приоритетная поддержка',
                  'Интеграции (ЮKassa, Robokassa и др.)'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13px] md:text-[14px] text-[var(--color-foreground-secondary)]">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Subscription Management */}
          <div className="card-saas p-5 md:p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center">
                <Crown size={18} />
              </div>
              <h3 className="text-[15px] md:text-[16px] font-bold text-[var(--color-foreground)]">Управление подпиской</h3>
            </div>

            {cancelledUntil ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 rounded-xl mb-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <XCircle size={18} className="text-[var(--color-danger)] shrink-0 mt-0.5 hidden sm:block" />
                  <div>
                    <div className="text-[14px] font-semibold text-[var(--color-foreground)] mb-0.5 flex items-center gap-2">
                      <XCircle size={16} className="text-[var(--color-danger)] sm:hidden" />
                      Подписка отменена
                    </div>
                    <div className="text-[13px] text-[var(--color-foreground-secondary)]">
                      Остаётся активной до <span className="font-bold text-[var(--color-foreground)]">{cancelledUntil}</span>. После этой даты боты будут остановлены.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCancelledUntil(null)}
                  className="w-full py-3 px-4 rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
                >
                  <RefreshCcw size={16} />
                  Возобновить подписку
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full py-3 px-4 rounded-xl text-[14px] font-semibold border border-[var(--color-danger)]/30 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/5 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle size={16} />
                Отменить подписку
              </button>
            )}
          </div>
        </motion.div>

      ) : (
        <AnimatePresence mode="wait">
          {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex flex-col mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)] mb-1.5 md:mb-2">
                Выберите подходящий тариф
              </h1>
              <p className="text-[14px] md:text-[15px] text-[var(--color-foreground-secondary)]">
                Опубликовывайте ботов и принимайте платежи
              </p>
            </div>

            {/* Purchased Slots Status (if not PRO but has slots) */}
            {(appState.slotsBought || 0) > 0 && (
              <div className="card-saas p-5 md:p-6 mb-6 md:mb-8" style={{ border: '1px solid var(--color-primary)' }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--color-primary-soft)] rounded-xl flex items-center justify-center shrink-0">
                      <Star size={24} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <div className="text-[13px] text-[var(--color-foreground-secondary)] mb-1">Ваши покупки</div>
                      <div className="text-[16px] md:text-[18px] font-bold text-[var(--color-foreground)]">
                        Куплено: {appState.slotsBought} {appState.slotsBought === 1 ? 'базовый бот' : appState.slotsBought! > 1 && appState.slotsBought! < 5 ? 'базовых бота' : 'базовых ботов'}
                      </div>
                      <div className="text-[13px] text-[var(--color-foreground-secondary)] mt-1">
                        Вы можете приобрести еще ботов или перейти на PRO для снятия лимитов.
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onGoToBots()}
                    className="w-full sm:w-auto py-2.5 px-4 bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-[14px] font-semibold text-[var(--color-foreground)] transition-colors whitespace-nowrap"
                  >
                    Перейти к ботам
                  </button>
                </div>
              </div>
            )}

            {/* Pricing Cards */}
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mx-4 px-4 md:grid md:grid-cols-2 md:overflow-visible md:pb-10 md:mx-0 md:px-0 gap-4 md:gap-6">
              {/* Single Bot */}
              <div 
                className="card-saas p-5 md:p-6 flex flex-col relative overflow-hidden group hover:border-[var(--color-primary)] cursor-pointer w-[280px] sm:w-[320px] md:w-auto shrink-0 snap-center" 
                onClick={() => handleSelectPlan('basic')}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, var(--color-primary-soft) 0%, transparent 100%)' }} />
                <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-16 -mt-16 md:-mr-20 md:-mt-20 pointer-events-none" />
                
                <div 
                  className="flex justify-center mb-4 relative z-10 -mx-6 h-[160px] md:h-[220px]"
                  style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)', maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)' }}
                >
                  <img src="/single_bot.png" alt="Single Bot" className="w-full h-full object-contain transform scale-110 group-hover:scale-[1.15] transition-transform duration-500" />
                </div>
                
                <div className="flex items-center gap-2 mb-2 md:mb-3 relative z-10">
                  <Star className="text-[var(--color-primary)]" size={20} />
                  <h2 className="text-[16px] md:text-lg font-bold text-[var(--color-foreground)]">Базовый бот</h2>
                </div>
                
                <div className="mb-1 relative z-10">
                  <span className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">2 000 ₽</span>
                </div>
                <p className="text-[13px] text-[var(--color-foreground-secondary)] mb-5 md:mb-6 relative z-10">
                  навсегда, 1 бот
                </p>

                <div className="mt-auto relative z-10">
                  <button className="w-full py-3 px-4 bg-white border border-gray-200 dark:border-gray-700 rounded-xl text-[14px] font-bold text-[#111827] group-hover:bg-gray-50 transition-colors shadow-sm">
                    Купить 1 бота
                  </button>
                </div>
              </div>

              {/* PRO Subscription */}
              <div 
                className="card-saas p-5 md:p-6 flex flex-col relative overflow-hidden group hover:border-[#A855F7] cursor-pointer mt-0 w-[280px] sm:w-[320px] md:w-auto shrink-0 snap-center" 
                onClick={() => handleSelectPlan('pro')}
                style={{
                  background: 'linear-gradient(145deg, var(--color-surface) 0%, rgba(139, 92, 246, 0.03) 100%)',
                  boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.15)'
                }}
              >
                {/* Animated gradient border effect via pseudo-element simulation */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, transparent 100%)' }} />
                
                {/* Advanced glow */}
                <div className="absolute top-0 right-0 w-64 h-64 opacity-30 pointer-events-none" style={{
                  background: 'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.4) 0%, transparent 60%), radial-gradient(circle at 90% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
                  filter: 'blur(20px)'
                }} />
                
                <div className="absolute top-5 left-5 z-30 overflow-hidden rounded-full group/badge cursor-default shadow-sm border border-[#A855F7]/30">
                  <div className="px-3 py-1 bg-gradient-to-r from-[#9333EA] to-[#EC4899] text-white text-[12px] font-bold relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent flex -translate-x-full" style={{ animation: 'shine 2.5s infinite ease-in-out' }} />
                    PRO
                  </div>
                </div>
                
                <div 
                  className="flex justify-center mb-4 relative z-10 -mx-6 h-[160px] md:h-[220px]"
                  style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)', maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)' }}
                >
                  <img src="/pro_sub.png" alt="PRO Subscription" className="w-full h-full object-contain transform scale-110 group-hover:scale-[1.15] transition-transform duration-500" />
                </div>
                
                <div className="flex justify-between items-start mb-2 md:mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <Crown className="text-[#9333EA]" size={20} />
                    <h2 className="text-[16px] md:text-lg font-bold text-[var(--color-foreground)]">PRO Подписка</h2>
                  </div>
                </div>
                
                <div className="mb-1 relative z-10 flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">3 000 ₽</span>
                  <span className="text-[13px] md:text-[14px] font-medium text-[var(--color-foreground-secondary)]">/ мес</span>
                </div>
                <p className="text-[13px] text-[var(--color-foreground-secondary)] mb-5 md:mb-6 relative z-10">
                  до 10 ботов, все функции
                </p>

                <div className="mt-auto relative z-10">
                  <button 
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#EC4899] rounded-xl text-[14px] font-bold text-white transition-all shadow-[0_8px_20px_-6px_rgba(168,85,247,0.5)] group-hover:shadow-[0_12px_24px_-8px_rgba(168,85,247,0.7)] group-hover:scale-[1.02]"
                    style={{ backgroundSize: '200% auto', animation: 'slow-gradient 4s ease infinite' }}
                  >
                    Выбрать PRO
                  </button>
                </div>
              </div>
            </div>

            {/* Comparison Table / Grid (Mobile Friendly) */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 md:p-8 shadow-sm mb-6">
              <h3 className="text-[16px] md:text-lg font-bold text-[var(--color-foreground)] mb-6">
                Сравнение тарифов
              </h3>
              
              <div className="flex flex-col gap-5">
                {/* Feature 1 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-[var(--color-border)] gap-3 md:gap-0">
                  <div className="flex items-center gap-3 text-[14px] font-medium md:w-1/2">
                    <Bot size={18} className="text-[var(--color-foreground-secondary)]" />
                    Количество активных ботов
                  </div>
                  <div className="flex justify-between md:justify-around w-full md:w-1/2 text-[13px]">
                    <div className="flex flex-col items-center gap-1 w-1/2">
                      <span className="text-[11px] text-[var(--color-foreground-secondary)] uppercase md:hidden">Базовый</span>
                      <span className="text-[var(--color-foreground-secondary)]">1 бот</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 w-1/2">
                      <span className="text-[11px] text-[var(--color-foreground-secondary)] uppercase md:hidden text-[#9333EA]">PRO</span>
                      <span className="font-bold">До 10 ботов</span>
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-[var(--color-border)] gap-3 md:gap-0">
                  <div className="flex items-center gap-3 text-[14px] font-medium md:w-1/2">
                    <Users size={18} className="text-[var(--color-foreground-secondary)]" />
                    Пользователи в боте
                  </div>
                  <div className="flex justify-between md:justify-around w-full md:w-1/2 text-[13px]">
                    <div className="flex flex-col items-center gap-1 w-1/2">
                      <span className="text-[var(--color-foreground-secondary)] text-center">До 10 000</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 w-1/2">
                      <span className="font-bold text-center">Без ограничений</span>
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-[var(--color-border)] gap-3 md:gap-0">
                  <div className="flex items-center gap-3 text-[14px] font-medium md:w-1/2">
                    <CreditCard size={18} className="text-[var(--color-foreground-secondary)]" />
                    Комиссия приёма платежей
                  </div>
                  <div className="flex justify-between md:justify-around w-full md:w-1/2 text-[13px]">
                    <div className="flex flex-col items-center gap-1 w-1/2">
                      <span className="text-[var(--color-foreground-secondary)] text-center">2%</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 w-1/2">
                      <span className="font-bold text-center">Без комиссии (0%)</span>
                    </div>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-[var(--color-border)] gap-3 md:gap-0">
                  <div className="flex items-center gap-3 text-[14px] font-medium md:w-1/2">
                    <LineChart size={18} className="text-[var(--color-foreground-secondary)]" />
                    Аналитика и конструктор
                  </div>
                  <div className="flex justify-between md:justify-around w-full md:w-1/2 text-[13px]">
                    <div className="flex flex-col items-center gap-1 w-1/2">
                      <CheckCircle2 size={18} className="text-[var(--color-success)]" />
                    </div>
                    <div className="flex flex-col items-center gap-1 w-1/2">
                      <CheckCircle2 size={18} className="text-[var(--color-success)]" />
                    </div>
                  </div>
                </div>

                {/* Feature 5 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-[var(--color-border)] gap-3 md:gap-0">
                  <div className="flex items-center gap-3 text-[14px] font-medium md:w-1/2">
                    <RefreshCcw size={18} className="text-[var(--color-foreground-secondary)]" />
                    Смена токена Telegram
                  </div>
                  <div className="flex justify-between md:justify-around w-full md:w-1/2 text-[13px]">
                    <div className="flex flex-col items-center gap-1 w-1/2 text-center">
                      <XCircle size={18} className="text-[var(--color-danger)]" />
                      <span className="text-[11px] text-[var(--color-foreground-tertiary)] mt-1">До 10 польз.</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 w-1/2">
                      <CheckCircle2 size={18} className="text-[var(--color-success)]" />
                    </div>
                  </div>
                </div>

                {/* Feature 6 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3 md:gap-0">
                  <div className="flex items-center gap-3 text-[14px] font-medium md:w-1/2">
                    <Headphones size={18} className="text-[var(--color-foreground-secondary)]" />
                    Приоритетная поддержка
                  </div>
                  <div className="flex justify-between md:justify-around w-full md:w-1/2 text-[13px]">
                    <div className="flex flex-col items-center gap-1 w-1/2">
                      <XCircle size={18} className="text-[var(--color-danger)]" />
                    </div>
                    <div className="flex flex-col items-center gap-1 w-1/2">
                      <CheckCircle2 size={18} className="text-[var(--color-success)]" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
          )}

          {/* --- STEP 2: CONFIRMATION --- */}
          {step === 'confirm' && selectedPlan && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto w-full pt-4 md:pt-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <button 
                  onClick={() => setStep('select')}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-foreground)] shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-[20px] md:text-[22px] font-bold text-[var(--color-foreground)]">Подтвердите выбор</h2>
              </div>

              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" style={{ background: selectedPlan === 'pro' ? 'var(--color-accent-soft)' : 'var(--color-primary-soft)' }} />

                <div className="flex items-center gap-4 p-4 bg-[var(--color-surface-2)] rounded-2xl mb-6 relative z-10 border border-[var(--color-border)]">
                  <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm p-1">
                    <img src={planDetails[selectedPlan].image} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-[15px] md:text-[16px] font-bold text-[var(--color-foreground)] mb-0.5 flex items-center gap-1.5">
                      {planDetails[selectedPlan].name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[16px] md:text-[18px] font-bold text-[var(--color-foreground)]">{planDetails[selectedPlan].price}</span>
                      <span className="text-[13px] text-[var(--color-foreground-secondary)]">{planDetails[selectedPlan].period}</span>
                    </div>
                    <div className="text-[12px] md:text-[13px] text-[var(--color-foreground-secondary)] mt-0.5">{planDetails[selectedPlan].sub}</div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 pl-1 relative z-10">
                  {planDetails[selectedPlan].features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-[13px] md:text-[14px] text-[var(--color-foreground)]">
                      <div className="text-[var(--color-foreground-secondary)]">{f.icon}</div>
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-6 relative z-10">
                  <label className="block text-[13px] font-medium text-[var(--color-foreground-secondary)] mb-1.5">
                    Email для чека (необязательно)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[14px] md:text-[15px] text-[var(--color-foreground)] placeholder-[var(--color-foreground-secondary)] focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>

                <button
                  onClick={handlePay}
                  disabled={isPaying}
                  className="w-full py-3 md:py-3.5 px-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white rounded-xl text-[15px] md:text-[16px] font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-70 relative z-10"
                >
                  {isPaying ? (
                    <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Перейти к оплате'
                  )}
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] md:text-[12px] text-[var(--color-foreground-secondary)] relative z-10">
                  <Lock size={14} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span>Безопасная оплата через ЮKassa</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- STEP 5: SUCCESS --- */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-12 md:py-16 relative overflow-hidden h-[60vh] md:h-[70vh]"
            >
              {/* Confetti */}
              {confetti.map((c) => (
                <div
                  key={c.id}
                  className="absolute w-2 h-2 rounded-sm z-0"
                  style={{
                    left: `${c.x}%`,
                    top: '-10px',
                    backgroundColor: c.color,
                    animation: `fall 3s linear ${c.delay}s forwards`
                  }}
                />
              ))}

              <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-sm border border-green-200 dark:border-green-800/50">
                <CheckCircle2 size={40} className="md:w-12 md:h-12" strokeWidth={2.5} />
              </div>

              <h2 className="text-[24px] md:text-3xl font-bold text-[var(--color-foreground)] mb-2 relative z-10">Оплата успешна!</h2>
              <h3 className="text-[18px] md:text-xl font-medium text-[var(--color-foreground)] mb-4 relative z-10">
                {selectedPlan === 'pro' ? 'Тариф PRO активирован' : 'Базовый бот приобретен'}
              </h3>
              <p className="text-[14px] md:text-[15px] text-[var(--color-foreground-secondary)] max-w-sm mx-auto mb-8 md:mb-10 relative z-10">
                Теперь вам доступны новые функции и возможности.
              </p>

              <button
                onClick={() => {
                  setStep('select');
                  onGoToBots();
                }}
                className="w-full md:w-auto py-3 md:py-3.5 px-8 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white rounded-xl text-[15px] md:text-[16px] font-bold shadow-md hover:shadow-lg transition-all relative z-10"
              >
                Вернуться к ботам
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Cancel subscription modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <XCircle size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-2">Отменить подписку?</h3>
              <p className="text-[14px] text-[var(--color-foreground-secondary)] mb-8">
                Подписка останется активной до конца оплаченного периода (25 июля 2025). После этого ваши боты (сверх лимита 1 шт) будут приостановлены.
              </p>
              
              <div className="flex flex-col gap-3 relative z-10">
                <button
                  onClick={() => {
                    setCancelledUntil('25 июля 2025');
                    setShowCancelModal(false);
                  }}
                  className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  Да, отменить
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full py-3 px-4 bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-hover)] text-[var(--color-foreground)] font-semibold rounded-xl transition-colors border border-[var(--color-border)]"
                >
                  Не отменять
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
