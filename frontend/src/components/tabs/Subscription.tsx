import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Crown, 
  CheckCircle2, XCircle, Bot, Users, CreditCard, LineChart, RefreshCcw, Headphones, ChevronLeft, Lock
} from 'lucide-react';

import { useAppState } from '../../providers/AppStateProvider';

export const Subscription = () => {
  const { appState, handlePurchaseSuccess: onPurchaseSuccess, setActiveTab } = useAppState();
  const onGoToBots = () => setActiveTab('home');
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

      {appState.subscriptionStatus === 'active' && step !== 'success' ? (
        <motion.div
          key="active-sub"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="flex flex-col gap-6">
            {/* Main Hero Card */}
            <div className="relative overflow-hidden rounded-[32px] p-8 md:p-10 border border-[var(--color-primary)]/20 shadow-lg shadow-[var(--color-primary)]/5" style={{ background: 'linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-2) 100%)' }}>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/10 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-accent)]/10 rounded-full blur-[60px] pointer-events-none -ml-20 -mb-20" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] shadow-xl shadow-[var(--color-primary)]/20 flex items-center justify-center shrink-0 border-4 border-[var(--color-surface)]">
                    <Crown size={40} className="text-white drop-shadow-md" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl md:text-4xl font-black text-[var(--color-foreground)] tracking-tight">PRO Подписка</h2>
                      <div className="px-3 py-1 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 text-[var(--color-success)] text-[13px] font-bold rounded-full flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-success)] shadow-[0_0_8px_var(--color-success)]" />
                        Активна
                      </div>
                    </div>
                    <p className="text-[15px] md:text-[16px] text-[var(--color-foreground-secondary)] font-medium">
                      Разблокированы все возможности платформы
                    </p>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="flex flex-col items-start md:items-end p-5 md:p-6 rounded-[24px] bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] w-full md:w-auto">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">
                    <RefreshCcw size={14} /> Автопродление
                  </div>
                  <div className="text-2xl font-black text-[var(--color-foreground)] mb-1">
                    25 июля
                  </div>
                  <div className="text-[14px] text-[var(--color-foreground-secondary)] font-medium">
                    Списание <span className="text-[var(--color-foreground)] font-bold">3 000 ₽</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Management & Limits Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Usage Stats */}
              <div className="card-saas p-6 md:p-8 rounded-[28px]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-[16px] bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-foreground)] border border-[var(--color-border)]">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[var(--color-foreground)]">Лимиты ботов</h3>
                    <p className="text-[14px] text-[var(--color-foreground-secondary)] font-medium">Используется {appState.bots.length} из 10</p>
                  </div>
                </div>
                
                <div className="h-3 w-full bg-[var(--color-surface-2)] rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full transition-all duration-1000"
                    style={{ width: `${(appState.bots.length / 10) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[13px] font-semibold text-[var(--color-foreground-tertiary)]">
                  <span>{appState.bots.length} активных</span>
                  <span>Осталось {10 - appState.bots.length}</span>
                </div>
              </div>

              {/* Management */}
              <div className="card-saas p-6 md:p-8 rounded-[28px] flex flex-col justify-between">
                <div>
                  <h3 className="text-[18px] font-bold text-[var(--color-foreground)] mb-2">Управление</h3>
                  <p className="text-[14px] text-[var(--color-foreground-secondary)] leading-relaxed mb-6">
                    Настройте ваших ботов, подключите платежные системы или управляйте статусом подписки.
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => onGoToBots()}
                    className="btn-primary-saas w-full py-3.5 rounded-[16px] text-[15px] font-bold flex items-center justify-center gap-2"
                  >
                    К моим ботам
                  </button>
                  
                  {cancelledUntil ? (
                    <button
                      onClick={() => setCancelledUntil(null)}
                      className="w-full py-3.5 rounded-[16px] text-[15px] font-bold text-[var(--color-success)] bg-[var(--color-success)]/10 hover:bg-[var(--color-success)]/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCcw size={18} />
                      Возобновить подписку
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full py-3.5 rounded-[16px] text-[14px] font-semibold text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors flex items-center justify-center"
                    >
                      Отменить подписку
                    </button>
                  )}
                </div>
              </div>

            </div>
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
            <div className="flex flex-col items-center text-center mb-8 md:mb-12 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-[13px] mb-4">
                <Crown size={16} /> Тарифы
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[var(--color-foreground)] mb-3 tracking-tight">
                Выберите подходящий тариф
              </h1>
              <p className="text-[15px] md:text-[16px] text-[var(--color-foreground-secondary)] max-w-lg mx-auto leading-relaxed">
                Опубликовывайте ботов, собирайте статистику и принимайте платежи от пользователей без ограничений.
              </p>
            </div>

            {/* Purchased Slots Status (if not PRO but has slots) */}
            {(appState.slotsBought || 0) > 0 && (
              <div className="mb-6 md:mb-8 relative rounded-[28px] overflow-hidden group shadow-sm" style={{ border: '1px solid rgba(var(--color-primary-rgb), 0.3)', background: 'var(--color-surface)' }}>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-primary)]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] bg-[#8B5CF6]/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex flex-col md:flex-row gap-5 md:items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 opacity-50" />
                      <Star size={32} className="text-[var(--color-primary)] drop-shadow-sm relative z-10" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span className="text-xl md:text-2xl font-black text-[var(--color-foreground)] tracking-tight">Базовый тариф</span>
                        <div className="px-2.5 py-1 bg-[var(--color-success)]/10 text-[var(--color-success)] text-[12px] font-bold rounded-full border border-[var(--color-success)]/20 flex items-center gap-1.5 shadow-sm">
                          Активен навсегда
                        </div>
                      </div>
                      <div className="text-[14px] md:text-[15px] font-semibold text-[var(--color-foreground)] mb-1">
                        Куплено: {appState.slotsBought} {appState.slotsBought === 1 ? 'бот' : appState.slotsBought! > 1 && appState.slotsBought! < 5 ? 'бота' : 'ботов'}
                      </div>
                      <div className="text-[13px] md:text-[14px] text-[var(--color-foreground-secondary)] max-w-lg leading-relaxed">
                        У вас есть доступ к базовому функционалу без абонентской платы. Вы можете приобрести еще ботов, или перейти на PRO для снятия всех лимитов.
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto flex flex-col gap-3 shrink-0">
                    <button 
                      onClick={() => onGoToBots()}
                      className="w-full md:w-auto py-3.5 px-6 bg-[var(--color-foreground)] hover:bg-[var(--color-foreground)]/90 rounded-xl text-[14px] font-bold text-[var(--color-surface)] transition-colors whitespace-nowrap shadow-md text-center"
                    >
                      К моим ботам
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Cards */}
            <div className="flex flex-col md:grid md:grid-cols-2 gap-5 md:gap-6 w-full">
              {/* Single Bot */}
              <motion.div 
                whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.08)" }}
                className="card-saas p-5 md:p-6 flex flex-col relative overflow-hidden group hover:border-[var(--color-primary)] cursor-pointer w-full transition-shadow" 
                onClick={() => handleSelectPlan('basic')}
                style={{ borderRadius: 24, padding: 0 }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, var(--color-primary-soft) 0%, transparent 100%)' }} />
                
                <div className="px-6 pt-5 pb-0">
                  <div className="flex justify-center mb-4 relative z-10 -mx-6 h-[160px] md:h-[220px]" style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)', maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)' }}>
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      src="/single_bot.png" 
                      alt="Single Bot" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2 md:mb-3 relative z-10">
                    <Star className="text-[var(--color-primary)]" size={20} />
                    <h2 className="text-[18px] font-bold text-[var(--color-foreground)] letter-spacing-tight">Базовый бот</h2>
                  </div>
                  
                  <div className="mb-1 relative z-10 flex items-baseline gap-1.5">
                    <span className="text-2xl md:text-3xl font-black text-[var(--color-foreground)] letter-spacing-tight">2 000 ₽</span>
                  </div>
                  <p className="text-[13px] text-[var(--color-foreground-secondary)] mb-5 md:mb-6 relative z-10">
                    навсегда, 1 бот
                  </p>

                  <div className="mt-auto relative z-10 pb-6">
                    <button className="w-full py-3.5 px-4 bg-white dark:bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-[15px] font-bold text-[var(--color-foreground)] group-hover:bg-gray-50 dark:group-hover:bg-[var(--color-surface-hover)] transition-colors shadow-sm">
                      Купить 1 бота
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* PRO Subscription */}
              <motion.div 
                whileHover={{ y: -4, boxShadow: '0 12px 30px -10px rgba(139, 92, 246, 0.25)' }}
                className="card-saas p-5 md:p-6 flex flex-col relative overflow-hidden group hover:border-[var(--color-accent)] cursor-pointer w-full transition-shadow" 
                onClick={() => handleSelectPlan('pro')}
                style={{
                  background: 'linear-gradient(145deg, var(--color-surface) 0%, rgba(139, 92, 246, 0.03) 100%)',
                  boxShadow: '0 10px 24px -10px rgba(139, 92, 246, 0.1)',
                  borderRadius: 24,
                  padding: 0
                }}
              >
                {/* Animated gradient border effect via pseudo-element simulation */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, transparent 100%)' }} />
                
                <div className="absolute top-5 left-5 z-30 overflow-hidden rounded-full group/badge cursor-default shadow-sm border border-[#A855F7]/30">
                  <div className="px-3 py-1 bg-gradient-to-r from-[#9333EA] to-[#EC4899] text-white text-[12px] font-bold relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent flex -translate-x-full" style={{ animation: 'shine 2.5s infinite ease-in-out' }} />
                    PRO
                  </div>
                </div>

                <div className="px-6 pt-5 pb-0">
                  <div 
                    className="flex justify-center mb-4 relative z-10 -mx-6 h-[160px] md:h-[220px]"
                    style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)', maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)' }}
                  >
                    <motion.img 
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      src="/pro_sub.png" 
                      alt="PRO Subscription" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  
                  <div className="flex justify-between items-start mb-2 md:mb-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <Crown className="text-[#9333EA]" size={20} />
                      <h2 className="text-[18px] font-bold text-[var(--color-foreground)] letter-spacing-tight">PRO Подписка</h2>
                    </div>
                  </div>
                  
                  <div className="mb-1 relative z-10 flex items-baseline gap-1.5">
                    <span className="text-2xl md:text-3xl font-black text-[var(--color-foreground)] letter-spacing-tight">3 000 ₽</span>
                    <span className="text-[13px] md:text-[14px] font-medium text-[var(--color-foreground-secondary)]">/ мес</span>
                  </div>
                  <p className="text-[13px] text-[var(--color-foreground-secondary)] mb-5 md:mb-6 relative z-10">
                    до 10 ботов, все функции
                  </p>

                  <div className="mt-auto relative z-10 pb-6">
                    <button 
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#EC4899] rounded-xl text-[15px] font-bold text-white transition-all shadow-[0_4px_12px_rgba(168,85,247,0.3)] group-hover:shadow-[0_8px_20px_rgba(168,85,247,0.5)] group-hover:scale-[1.02]"
                      style={{ backgroundSize: '200% auto', animation: 'slow-gradient 4s ease infinite' }}
                    >
                      Выбрать PRO
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Comparison Table / Grid (Mobile Friendly) */}
            <div className="card-saas p-0 overflow-hidden mb-8 shadow-sm border border-[var(--color-border)]" style={{ borderRadius: 32 }}>
              <div className="p-6 md:p-8 border-b border-[var(--color-border)] flex flex-col items-center text-center bg-gradient-to-b from-[var(--color-surface-2)] to-transparent">
                <h3 className="text-[20px] md:text-[24px] font-black text-[var(--color-foreground)] tracking-tight">
                  Сравнение возможностей
                </h3>
              </div>
              
              <div className="flex flex-col relative bg-[var(--color-surface)]">
                {/* Header Row (hidden on small mobile, visible on sm+) */}
                <div className="hidden sm:flex items-center px-6 md:px-8 py-5 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div className="w-1/2 text-[12px] md:text-[13px] font-bold text-[var(--color-foreground-secondary)] uppercase tracking-widest">Возможности</div>
                  <div className="w-1/4 text-center text-[13px] md:text-[14px] font-black text-[var(--color-primary)] uppercase tracking-wider">Базовый</div>
                  <div className="w-1/4 text-center text-[13px] md:text-[14px] font-black text-[var(--color-accent)] uppercase tracking-wider">PRO</div>
                </div>

                {/* Features */}
                {[
                  { icon: <Bot size={18} />, title: "Активные боты", basic: "1 бот", pro: "До 10 ботов", highlightPro: true },
                  { icon: <Users size={18} />, title: "Пользователи", basic: "До 10 000", pro: "Без ограничений", highlightPro: true },
                  { icon: <CreditCard size={18} />, title: "Комиссия платежей", basic: "2%", pro: "0% (Без комиссии)", highlightPro: true },
                  { icon: <LineChart size={18} />, title: "Аналитика", basic: <CheckCircle2 size={20} className="text-[var(--color-success)] mx-auto sm:mx-0" />, pro: <CheckCircle2 size={20} className="text-[var(--color-success)] mx-auto sm:mx-0" />, highlightPro: false },
                  { icon: <RefreshCcw size={18} />, title: "Смена токена", basic: <XCircle size={20} className="text-[var(--color-danger)] mx-auto sm:mx-0" />, pro: <CheckCircle2 size={20} className="text-[var(--color-success)] mx-auto sm:mx-0" />, highlightPro: false },
                  { icon: <Headphones size={18} />, title: "Поддержка", basic: <XCircle size={20} className="text-[var(--color-danger)] mx-auto sm:mx-0" />, pro: <CheckCircle2 size={20} className="text-[var(--color-success)] mx-auto sm:mx-0" />, highlightPro: false },
                ].map((row, i, arr) => (
                  <div key={i} className={`flex flex-col sm:flex-row sm:items-center px-5 md:px-8 py-5 md:py-6 ${i !== arr.length - 1 ? 'border-b border-[var(--color-border)]' : ''} hover:bg-[var(--color-surface-2)]/30 transition-colors group relative`}>
                    
                    {/* Feature Title */}
                    <div className="flex items-center gap-3 sm:gap-4 text-[15px] sm:text-[16px] font-bold text-[var(--color-foreground)] sm:w-1/2 mb-4 sm:mb-0 relative z-10">
                      <div className="w-10 h-10 shrink-0 rounded-[12px] bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-foreground-secondary)] border border-[var(--color-border)]">
                        {row.icon}
                      </div>
                      {row.title}
                    </div>

                    {/* Mobile Comparison Layout (Blocks) */}
                    <div className="flex flex-col sm:hidden w-full gap-2 relative z-10">
                      <div className="flex justify-between items-center bg-[var(--color-surface-2)]/50 px-4 py-3 rounded-[14px] border border-[var(--color-border)]">
                        <span className="text-[12px] font-bold text-[var(--color-foreground-secondary)] uppercase tracking-wider">Базовый</span>
                        <div className="font-semibold text-[var(--color-foreground-secondary)] text-[14px]">{row.basic}</div>
                      </div>
                      <div className="flex justify-between items-center bg-[var(--color-accent)]/5 px-4 py-3 rounded-[14px] border border-[var(--color-accent)]/20 shadow-sm">
                        <span className="text-[12px] font-black text-[var(--color-accent)] uppercase tracking-wider">PRO</span>
                        <div className={`font-bold text-[14px] ${row.highlightPro ? 'text-[var(--color-accent)]' : 'text-[var(--color-foreground)]'}`}>{row.pro}</div>
                      </div>
                    </div>

                    {/* Desktop Comparison Layout (Columns) */}
                    <div className="hidden sm:flex justify-around w-1/2 text-[15px]">
                      <div className="flex items-center justify-center w-1/2 relative z-10 font-medium text-[var(--color-foreground-secondary)]">
                        {row.basic}
                      </div>
                      <div className="flex items-center justify-center w-1/2 relative z-10">
                        <div className="absolute inset-y-[-24px] inset-x-2 bg-[var(--color-accent)]/[0.04] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className={`relative z-10 ${row.highlightPro ? 'font-black text-[var(--color-accent)]' : 'font-semibold text-[var(--color-foreground)]'}`}>{row.pro}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                <motion.button 
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setStep('select')}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-foreground)] shadow-sm"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <h2 className="text-[20px] md:text-[22px] font-bold text-[var(--color-foreground)]">Подтвердите выбор</h2>
              </div>

              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-5 md:p-6 shadow-sm mb-6 relative overflow-hidden">
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

                <motion.button
                  whileHover={{ scale: isPaying ? 1 : 1.01 }}
                  whileTap={{ scale: isPaying ? 1 : 0.98 }}
                  onClick={handlePay}
                  disabled={isPaying}
                  className="w-full py-4 rounded-[16px] text-[16px] font-bold text-white flex items-center justify-center gap-2 shadow-[0_8px_24px_-6px_rgba(99,102,241,0.4)] relative z-10"
                  style={{
                    background: `linear-gradient(135deg, ${planDetails[selectedPlan!].name === 'PRO Подписка' ? '#7C3AED' : 'var(--color-primary)'}, ${planDetails[selectedPlan!].name === 'PRO Подписка' ? '#4F46E5' : '#1d6bc4'})`,
                    opacity: isPaying ? 0.7 : 1,
                  }}
                >
                  {isPaying ? (
                    <>
                      <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Перейти к оплате
                    </>
                  )}
                </motion.button>
                
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
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex-1 flex flex-col items-center justify-center py-12 md:py-16 relative h-[60vh] md:h-[70vh]"
            >
              {/* Confetti */}
              {confetti.map((c) => (
                <div
                  key={c.id}
                  className="absolute w-2 h-2 rounded-sm z-0 pointer-events-none"
                  style={{
                    left: `${c.x}%`,
                    top: '-10px',
                    backgroundColor: c.color,
                    animation: `fall 3s linear ${c.delay}s forwards`
                  }}
                />
              ))}

              <div className="card-saas p-8 md:p-12 text-center max-w-md w-full relative overflow-hidden shadow-2xl shadow-[var(--color-success)]/10" style={{ borderRadius: 32 }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-success)]/10 rounded-full blur-[60px] pointer-events-none -mr-20 -mt-20" />
                
                <div className="relative z-10">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                    className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-[var(--color-success)] to-green-400 text-white rounded-[24px] flex items-center justify-center mb-6 shadow-lg shadow-[var(--color-success)]/30"
                  >
                    <CheckCircle2 size={40} className="md:w-12 md:h-12 drop-shadow-md" strokeWidth={2.5} />
                  </motion.div>

                  <h2 className="text-[26px] md:text-3xl font-black text-[var(--color-foreground)] tracking-tight mb-2">Оплата успешна!</h2>
                  <h3 className="text-[16px] md:text-lg font-bold text-[var(--color-success)] mb-3">
                    {selectedPlan === 'pro' ? 'Тариф PRO активирован' : 'Базовый бот приобретен'}
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-[var(--color-foreground-secondary)] leading-relaxed max-w-sm mx-auto mb-8">
                    Средства зачислены, новые возможности уже доступны для ваших ботов.
                  </p>

                  <button
                    onClick={() => {
                      setStep('select');
                      onGoToBots();
                    }}
                    className="w-full py-3.5 px-6 bg-[var(--color-foreground)] hover:bg-[var(--color-foreground)]/90 text-[var(--color-surface)] rounded-2xl text-[15px] font-bold shadow-md transition-all active:scale-[0.98]"
                  >
                    Вернуться к ботам
                  </button>
                </div>
              </div>
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
                Вы сможете пользоваться тарифом до конца оплаченного периода (25 июля 2025). 
                <br/><br/>
                <span className="font-semibold text-[var(--color-foreground)]">Деньги больше не спишутся.</span> После окончания срока ваши боты сверх лимита будут приостановлены.
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
