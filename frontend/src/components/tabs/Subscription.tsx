import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Crown, 
  CheckCircle2, XCircle, Bot, Users, CreditCard, LineChart, GitMerge, RefreshCcw, Headphones, Info, ChevronLeft, Lock
} from 'lucide-react';

interface SubscriptionProps {
  onPurchaseSuccess: (plan: 'basic' | 'pro') => void;
  onGoToBots: () => void;
}

export const Subscription = ({ onPurchaseSuccess, onGoToBots }: SubscriptionProps) => {
  const [step, setStep] = useState<'select' | 'confirm' | 'success' | 'active'>('select');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | null>(null);
  const [email, setEmail] = useState('');
  const [isPaying, setIsPaying] = useState(false);

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
      sub: '1 бот',
      icon: <Star className="text-blue-500" size={24} />,
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
      icon: <Crown className="text-purple-500" size={24} />,
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
    <div className="pb-24 max-w-5xl mx-auto px-4 md:px-0 min-h-[80vh] flex flex-col">
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
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-1">
                  Выберите подходящий тариф
                </h1>
                <p className="text-[15px] text-[var(--color-foreground-secondary)]">
                  Опубликовывайте ботов и принимайте платежи
                </p>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Single Bot */}
              <div 
                className="bg-[var(--color-surface)] border border-blue-100 dark:border-blue-900/30 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer" 
                onClick={() => handleSelectPlan('basic')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <div 
                  className="flex justify-center mb-4 relative z-10 -mx-6 h-[220px]"
                  style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)', maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)' }}
                >
                  <img src="/single_bot.png" alt="Single Bot" className="w-full h-full object-contain transform scale-110 group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <Star className="text-[var(--color-primary)]" size={20} />
                  <h2 className="text-lg font-bold text-[var(--color-foreground)]">Базовый бот</h2>
                </div>
                
                <div className="mb-1 relative z-10">
                  <span className="text-3xl font-bold text-[var(--color-foreground)]">2 000 ₽</span>
                </div>
                <p className="text-[13px] text-[var(--color-foreground-secondary)] mb-6 relative z-10">
                  навсегда
                </p>

                <div className="mt-auto relative z-10">
                  <button className="w-full py-2.5 px-4 bg-white border border-gray-200 dark:border-gray-700 rounded-xl text-[14px] font-semibold text-[#111827] group-hover:bg-gray-50 transition-colors shadow-sm">
                    Выбрать
                  </button>
                </div>
              </div>

              {/* PRO Subscription */}
              <div 
                className="bg-[var(--color-surface)] border border-purple-300 dark:border-purple-700/50 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer" 
                onClick={() => handleSelectPlan('pro')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="absolute top-0 right-0 w-full h-56 opacity-20 pointer-events-none" style={{
                  background: 'radial-gradient(circle at 80% 20%, var(--color-primary) 0%, transparent 50%), radial-gradient(circle at 90% 50%, var(--color-warning) 0%, transparent 40%)'
                }} />
                
                <div className="absolute top-6 left-6 z-30 overflow-hidden rounded-full group/badge cursor-default">
                  <div className="px-3 py-1 bg-[#A78BFA] text-white text-[12px] font-bold relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent flex -translate-x-full" style={{ animation: 'shine 2.5s infinite ease-in-out' }} />
                    PRO
                  </div>
                </div>
                
                <div 
                  className="flex justify-center mb-4 relative z-10 -mx-6 h-[220px]"
                  style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)', maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)' }}
                >
                  <img src="/pro_sub.png" alt="PRO Subscription" className="w-full h-full object-contain transform scale-110 group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <Crown className="text-[#9333EA]" size={20} />
                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">PRO Подписка</h2>
                  </div>
                </div>
                
                <div className="mb-1 relative z-10 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[var(--color-foreground)]">3 000 ₽</span>
                  <span className="text-[14px] font-medium text-[var(--color-foreground-secondary)]">/ мес</span>
                </div>
                <p className="text-[13px] text-[var(--color-foreground-secondary)] mb-6 relative z-10">
                  до 10 ботов
                </p>

                <div className="mt-auto relative z-10">
                  <button 
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] rounded-xl text-[14px] font-semibold text-white transition-opacity shadow-sm group-hover:opacity-90"
                    style={{ backgroundSize: '200% auto', animation: 'slow-gradient 4s ease infinite' }}
                  >
                    Выбрать PRO
                  </button>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-6">
                Что входит в тарифы
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="py-4 text-[13px] font-medium text-[var(--color-foreground-tertiary)] w-1/2">Возможности</th>
                      <th className="py-4 text-[13px] font-medium text-[var(--color-foreground-tertiary)] w-1/4 text-center">Базовый бот</th>
                      <th className="py-4 text-[13px] font-medium text-[var(--color-foreground-tertiary)] w-1/4 text-center text-[var(--color-foreground)]">PRO Подписка</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px] text-[var(--color-foreground)]">
                    {/* Feature 1 */}
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-4 flex items-center gap-3">
                        <Bot size={18} className="text-[var(--color-foreground-secondary)]" />
                        Количество активных ботов
                      </td>
                      <td className="py-4 text-center text-[var(--color-foreground-secondary)]">1 бот</td>
                      <td className="py-4 text-center font-medium">До 10 ботов</td>
                    </tr>
                    {/* Feature 2 */}
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-4 flex items-center gap-3">
                        <Users size={18} className="text-[var(--color-foreground-secondary)]" />
                        Пользователи в боте
                      </td>
                      <td className="py-4 text-center text-[var(--color-foreground-secondary)]">До 10</td>
                      <td className="py-4 text-center font-medium">Без ограничений</td>
                    </tr>
                    {/* Feature 3 */}
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-4 flex items-center gap-3">
                        <CreditCard size={18} className="text-[var(--color-foreground-secondary)]" />
                        Приём платежей
                      </td>
                      <td className="py-4"><div className="flex justify-center"><CheckCircle2 size={18} className="text-[var(--color-success)]" /></div></td>
                      <td className="py-4"><div className="flex justify-center"><CheckCircle2 size={18} className="text-[var(--color-success)]" /></div></td>
                    </tr>
                    {/* Feature 4 */}
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-4 flex items-center gap-3">
                        <LineChart size={18} className="text-[var(--color-foreground-secondary)]" />
                        Аналитика и статистика
                      </td>
                      <td className="py-4"><div className="flex justify-center"><CheckCircle2 size={18} className="text-[var(--color-success)]" /></div></td>
                      <td className="py-4"><div className="flex justify-center"><CheckCircle2 size={18} className="text-[var(--color-success)]" /></div></td>
                    </tr>
                    {/* Feature 5 */}
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-4 flex items-center gap-3">
                        <GitMerge size={18} className="text-[var(--color-foreground-secondary)]" />
                        Конструктор воронок
                      </td>
                      <td className="py-4"><div className="flex justify-center"><CheckCircle2 size={18} className="text-[var(--color-success)]" /></div></td>
                      <td className="py-4"><div className="flex justify-center"><CheckCircle2 size={18} className="text-[var(--color-success)]" /></div></td>
                    </tr>
                    {/* Feature 6 */}
                    <tr className="border-b border-[var(--color-border)]">
                      <td className="py-4 flex items-center gap-3">
                        <RefreshCcw size={18} className="text-[var(--color-foreground-secondary)]" />
                        Смена токена после 10 пользователей
                      </td>
                      <td className="py-4"><div className="flex justify-center"><XCircle size={18} className="text-[var(--color-danger)]" /></div></td>
                      <td className="py-4"><div className="flex justify-center"><CheckCircle2 size={18} className="text-[var(--color-success)]" /></div></td>
                    </tr>
                    {/* Feature 7 */}
                    <tr className="">
                      <td className="py-4 flex items-center gap-3">
                        <Headphones size={18} className="text-[var(--color-foreground-secondary)]" />
                        Приоритетная поддержка
                      </td>
                      <td className="py-4"><div className="flex justify-center"><XCircle size={18} className="text-[var(--color-danger)]" /></div></td>
                      <td className="py-4"><div className="flex justify-center"><CheckCircle2 size={18} className="text-[var(--color-success)]" /></div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="rounded-[16px] p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm group transition-colors" style={{ background: 'var(--color-accent-soft)', border: '1px solid rgba(191, 90, 242, 0.2)' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-accent-soft)', color: 'var(--color-accent)' }}>
                  <Info size={20} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold mb-0.5" style={{ color: 'var(--color-accent)' }}>
                    Нужен больше чем 10 ботов?
                  </h4>
                  <p className="text-[13px]" style={{ color: 'var(--color-foreground-secondary)' }}>
                    Напишите нам, и мы предложим индивидуальные условия для вашего проекта.
                  </p>
                </div>
              </div>
              <button className="btn btn-secondary shrink-0 py-2.5 px-5 whitespace-nowrap w-full md:w-auto border" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>
                Связаться с нами
              </button>
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
            className="max-w-md mx-auto w-full pt-4"
          >
            <div className="mb-6 flex items-center gap-3">
              <button 
                onClick={() => setStep('select')}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-foreground)] shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold text-[var(--color-foreground)]">Подтвердите выбор тарифа</h2>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm mb-6 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none ${selectedPlan === 'pro' ? 'bg-purple-500/10' : 'bg-blue-500/10'}`} />

              <div className="flex items-center gap-4 p-4 bg-[var(--color-surface-2)] rounded-2xl mb-6 relative z-10 border border-[var(--color-border)]">
                <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm p-1">
                  <img src={planDetails[selectedPlan].image} alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[var(--color-foreground)] mb-0.5 flex items-center gap-1.5">
                    {planDetails[selectedPlan].name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[18px] font-bold text-[var(--color-foreground)]">{planDetails[selectedPlan].price}</span>
                    <span className="text-[13px] text-[var(--color-foreground-secondary)]">{planDetails[selectedPlan].period}</span>
                  </div>
                  <div className="text-[13px] text-[var(--color-foreground-secondary)] mt-0.5">{planDetails[selectedPlan].sub}</div>
                </div>
              </div>

              <div className="space-y-4 mb-8 pl-1 relative z-10">
                {planDetails[selectedPlan].features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-[14px] text-[var(--color-foreground)]">
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
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[15px] text-[var(--color-foreground)] placeholder-[var(--color-foreground-secondary)] focus:outline-none focus:border-[#8B5CF6] transition-colors"
                />
              </div>

              <button
                onClick={handlePay}
                disabled={isPaying}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white rounded-xl text-[16px] font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-70 relative z-10"
              >
                {isPaying ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Перейти к оплате'
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-[var(--color-foreground-secondary)] relative z-10">
                <Lock size={14} />
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
            className="flex-1 flex flex-col items-center justify-center text-center py-12 relative overflow-hidden h-[60vh]"
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

            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-sm border border-green-200 dark:border-green-800/50">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>

            <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-2 relative z-10">Оплата успешна!</h2>
            <h3 className="text-xl font-medium text-[var(--color-foreground)] mb-4 relative z-10">
              Ваш тариф {selectedPlan === 'pro' ? 'PRO' : 'Базовый'} активирован
            </h3>
            <p className="text-[15px] text-[var(--color-foreground-secondary)] max-w-md mx-auto mb-10 relative z-10">
              Теперь вам доступны все возможности {selectedPlan === 'pro' ? 'профессионального' : 'выбранного'} тарифа.
            </p>

            <button
              onClick={() => {
                setStep('active');
                onGoToBots();
              }}
              className="py-3.5 px-8 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white rounded-xl text-[16px] font-bold shadow-md hover:shadow-lg transition-all relative z-10"
            >
              Перейти к моим ботам
            </button>
          </motion.div>
        )}

        {/* --- STEP 6: ACTIVE TARIFF --- */}
        {step === 'active' && selectedPlan && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full pt-8"
          >
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              
              <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-200 dark:border-green-800/50">
                {planDetails[selectedPlan].icon}
              </div>

              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-1">
                {planDetails[selectedPlan].name} активна
              </h2>
              
              <div className="flex items-center justify-center gap-2 mb-8">
                <span className="text-[18px] font-bold text-[var(--color-foreground)]">{planDetails[selectedPlan].price} {planDetails[selectedPlan].period}</span>
                <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[12px] font-bold rounded-full">
                  Активно
                </span>
              </div>

              <div className="space-y-4 text-left border-t border-[var(--color-border)] pt-6 relative z-10">
                {planDetails[selectedPlan].features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-[15px] text-[var(--color-foreground)]">
                    <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => {
                  setStep('select');
                  setSelectedPlan(null);
                }}
                className="text-[14px] text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)] transition-colors underline"
              >
                (Дев-кнопка) Вернуться к выбору тарифа
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
