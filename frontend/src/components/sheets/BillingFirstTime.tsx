import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Bot, Crown } from 'lucide-react';
import { cn } from '../../utils';

interface BillingFirstTimeProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const BillingFirstTime = ({ onClose, onSuccess }: BillingFirstTimeProps) => {
  const [tariff, setTariff] = useState<'single' | 'pro'>('pro');
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => { setIsPaying(false); onSuccess(); }, 1500);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 240 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'var(--color-background)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 20px 100px' }}>
          <button
            onClick={onClose}
            className="flex items-center justify-center transition-colors hover:bg-[var(--color-surface-2)]"
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              cursor: 'pointer', marginBottom: '24px',
            }}
          >
            <X size={16} style={{ color: 'var(--color-foreground-secondary)' }} />
          </button>

          <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Выберите тариф
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--color-foreground-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
            Создайте разового бота или получите полный доступ ко всем функциям.
          </p>

          {/* Tariffs Switcher */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {/* Single Bot */}
            <div 
              onClick={() => setTariff('single')}
              className={cn(
                "relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                tariff === 'single' ? "border-[var(--color-primary)] shadow-md" : "border-transparent opacity-70"
              )}
              style={{ background: 'var(--color-surface)', borderStyle: tariff === 'single' ? 'solid' : 'solid', borderColor: tariff === 'single' ? 'var(--color-primary)' : 'var(--color-border)' }}
            >
              <div style={{ height: '90px', position: 'relative' }}>
                <img src="/single_bot.jpg" alt="Single Bot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 100%)' }} />
              </div>
              <div className="p-3 pt-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Bot size={14} style={{ color: 'var(--color-primary)' }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-foreground)' }}>Разовый бот</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-foreground)' }}>2 000 ₽</div>
                <div style={{ fontSize: '12px', color: 'var(--color-foreground-secondary)' }}>навсегда</div>
              </div>
            </div>

            {/* PRO Subscription */}
            <div 
              onClick={() => setTariff('pro')}
              className={cn(
                "relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                tariff === 'pro' ? "shadow-md" : "opacity-70"
              )}
              style={{ background: 'var(--color-surface)', borderColor: tariff === 'pro' ? 'var(--color-warning)' : 'var(--color-border)' }}
            >
              <div style={{ position: 'absolute', top: '-1px', right: '-1px', background: 'var(--color-warning)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '0 12px 0 12px', zIndex: 2, textTransform: 'uppercase' }}>
                Выгодно
              </div>
              <div style={{ height: '90px', position: 'relative' }}>
                <img src="/pro_sub.jpg" alt="PRO Subscription" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 100%)' }} />
              </div>
              <div className="p-3 pt-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Crown size={14} style={{ color: 'var(--color-warning)' }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-foreground)' }}>PRO Подписка</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-foreground)' }}>3 000 ₽</div>
                <div style={{ fontSize: '12px', color: 'var(--color-foreground-secondary)' }}>в месяц</div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div style={{ background: 'var(--color-surface)', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {tariff === 'single' ? 'Включено в разовую оплату:' : 'Преимущества PRO:'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tariff === 'single' ? (
                <>
                  <div className="flex gap-3"><Check size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} /><span style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>1 рабочий бот навсегда</span></div>
                  <div className="flex gap-3"><Check size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} /><span style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>Безграничное изменение текста</span></div>
                  <div className="flex gap-3"><Check size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} /><span style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>Приём оплат через шлюзы</span></div>
                  <div className="flex gap-3"><X size={18} style={{ color: 'var(--color-danger)', flexShrink: 0 }} /><span style={{ fontSize: '14px', color: 'var(--color-foreground-secondary)' }}>Смена токена (если больше 10 пользователей, токен фиксируется)</span></div>
                </>
              ) : (
                <>
                  <div className="flex gap-3"><Check size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} /><span style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>До 10 активных ботов</span></div>
                  <div className="flex gap-3"><Check size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} /><span style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>Свободная смена токенов в любое время</span></div>
                  <div className="flex gap-3"><Check size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} /><span style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>Автоматические дожимы (Follow-ups)</span></div>
                  <div className="flex gap-3"><Check size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} /><span style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>Расширенная аналитика для всех ботов</span></div>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Email для чеков</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ваша@почта.ru"
                className="input"
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <div
                onClick={() => setAccepted(!accepted)}
                style={{
                  width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0, marginTop: '2px',
                  background: accepted ? (tariff === 'pro' ? 'var(--color-warning)' : 'var(--color-primary)') : 'var(--color-surface)',
                  border: `1.5px solid ${accepted ? (tariff === 'pro' ? 'var(--color-warning)' : 'var(--color-primary)') : 'var(--color-border-strong)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 150ms ease',
                }}
              >
                {accepted && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--color-foreground-secondary)', lineHeight: 1.6 }}>
                Принимаю условия{' '}
                <a href="#" style={{ color: tariff === 'pro' ? 'var(--color-warning)' : 'var(--color-primary)' }}>Публичной оферты</a>{' '}
                и согласен на обработку персональных данных.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        maxWidth: '480px', margin: '0 auto', width: '100%',
      }}>
        <button
          disabled={!email || !accepted || isPaying}
          onClick={handlePay}
          className={cn("btn", tariff === 'pro' ? "bg-orange-500 hover:bg-orange-600 text-white" : "btn-primary")}
          style={{ width: '100%', height: '48px', fontSize: '15px', fontWeight: 600, border: 'none' }}
        >
          {isPaying
            ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            : (tariff === 'single' ? 'Оплатить 2 000 ₽' : 'Оформить PRO за 3 000 ₽/мес')
          }
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </motion.div>
  );
};
