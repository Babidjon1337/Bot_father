import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';

interface BillingRenewProps {
  userEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const BillingRenew = ({ userEmail, onClose, onSuccess }: BillingRenewProps) => {
  const [accepted, setAccepted] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => { setIsPaying(false); onSuccess(); }, 1500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40, backdropFilter: 'blur(4px)' }}
      />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: 'var(--color-surface)',
          borderRadius: '20px 20px 0 0',
          borderTop: '1px solid var(--color-border)',
          padding: '24px 20px',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
          boxShadow: 'var(--shadow-sheet)',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-foreground)' }}>Продление подписки</h3>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-surface-2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} style={{ color: 'var(--color-foreground-secondary)' }} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'var(--color-warning-soft)', borderRadius: 'var(--radius-sm)', marginBottom: '20px', border: '1px solid rgba(229,150,63,0.2)' }}>
          <AlertCircle size={16} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: 'var(--color-foreground)', lineHeight: 1.5 }}>Подписка истекла. Боты временно остановлены.</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-foreground-secondary)' }}>PRO · 1 месяц</span>
            <span style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-foreground)' }}>1 500 ₽</span>
          </div>

          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Email аккаунта</label>
            <input type="email" value={userEmail || 'user@example.com'} readOnly className="input" style={{ opacity: 0.6, cursor: 'not-allowed' }} />
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
            <div
              onClick={() => setAccepted(!accepted)}
              style={{
                width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0, marginTop: '2px',
                background: accepted ? 'var(--color-primary)' : 'var(--color-surface)',
                border: `1.5px solid ${accepted ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 150ms ease',
              }}
            >
              {accepted && <Check size={12} color="#fff" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: '13px', color: 'var(--color-foreground-secondary)', lineHeight: 1.6 }}>
              Принимаю условия <a href="#" style={{ color: 'var(--color-primary)' }}>Публичной оферты</a>.
            </span>
          </label>
        </div>

        <button
          disabled={!accepted || isPaying}
          onClick={handlePay}
          className="btn btn-primary"
          style={{ width: '100%', height: '48px', fontSize: '15px' }}
        >
          {isPaying
            ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            : 'Оплатить 1 500 ₽'}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </motion.div>
    </>
  );
};
