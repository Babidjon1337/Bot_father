import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, X } from 'lucide-react';
import { PAYMENT_PROVIDERS } from '../../constants';
import type { PaymentProvider, AppState } from '../../types';

interface BotSettingsProps {
  appState: AppState;
  onClose: () => void;
  onSave: () => void;
}

export const BotSettings = ({ appState, onClose, onSave }: BotSettingsProps) => {
  const activeBot = appState.activeBot;
  
  const [token, setToken] = useState(activeBot?.token || '');
  const [provider, setProvider] = useState<PaymentProvider>((activeBot?.paymentProvider as PaymentProvider) || 'yookassa');
  const [keys, setKeys] = useState<Record<string, string>>(activeBot?.paymentKeys || { shopId: '', secretKey: '' });

  const isPro = appState.subscriptionStatus === 'active';
  const hasManyUsers = (activeBot?.usersCount || 0) > 10;

  // Токен блокируется только если нет PRO подписки И юзеров больше 10
  const isTokenLocked = !isPro && hasManyUsers;

  const canEditToken = !isTokenLocked;
  const canEditPayment = true;

  const handleSave = () => {
    if (activeBot) {
      activeBot.token = token;
      activeBot.paymentProvider = provider;
      activeBot.paymentKeys = keys;
    }
    onSave();
    onClose();
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
          maxWidth: '540px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-foreground)' }}>Настройки бота и платежей</h3>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-surface-2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} style={{ color: 'var(--color-foreground-secondary)' }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>

          {/* Token */}
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Токен Telegram бота</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-foreground-tertiary)' }} />
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={!canEditToken}
                placeholder="Например: 1234567890:AAH_..."
                className="input"
                style={{ paddingLeft: '40px', opacity: !canEditToken ? 0.6 : 1, cursor: !canEditToken ? 'not-allowed' : 'text' }}
              />
            </div>
            {isTokenLocked && (
              <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-warning)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ fontSize: '14px' }}>🔒</span>
                У вас более 10 пользователей. Токен заблокирован. (Для смены нужна PRO подписка или новый слот).
              </p>
            )}
          </div>

          {/* Payment provider */}
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Платёжная система</label>
            <div
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px',
                padding: '4px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
              }}
            >
              {(Object.keys(PAYMENT_PROVIDERS) as PaymentProvider[]).map(p => (
                <button
                  key={p}
                  onClick={() => { setProvider(p); setKeys({}); }}
                  disabled={!canEditPayment}
                  style={{
                    height: '34px', borderRadius: '6px', fontSize: '13px',
                    fontWeight: provider === p ? 500 : 400, border: 'none',
                    cursor: canEditPayment ? 'pointer' : 'not-allowed',
                    background: provider === p ? 'var(--color-surface)' : 'transparent',
                    color: provider === p ? 'var(--color-foreground)' : 'var(--color-foreground-secondary)',
                    boxShadow: provider === p ? 'var(--shadow-card)' : 'none',
                    transition: 'all 150ms ease', textTransform: 'capitalize',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            <AnimatePresence mode="popLayout">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {PAYMENT_PROVIDERS[provider].map(field => (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <label className="text-label" style={{ display: 'block', marginBottom: '6px' }}>{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.hint}
                      value={keys[field.key] || ''}
                      onChange={(e) => setKeys(prev => ({ ...prev, [field.key]: e.target.value }))}
                      disabled={!canEditPayment}
                      className="input"
                      style={{ opacity: !canEditPayment ? 0.6 : 1, cursor: !canEditPayment ? 'not-allowed' : 'text' }}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <button
            onClick={handleSave}
            className="btn btn-action"
            style={{ width: '100%', height: '48px', fontSize: '15px' }}
          >
            Сохранить изменения
          </button>
        </div>

        {/* Опасная зона */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-danger)', marginBottom: '8px' }}>Опасная зона</h4>
          <p style={{ fontSize: '13px', color: 'var(--color-foreground-secondary)', marginBottom: '16px' }}>
            Если вы переиспользуете бота для новой воронки, вы можете полностью удалить старую базу пользователей. Это сбросит счетчик юзеров и разблокирует токен.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Вы уверены, что хотите безвозвратно удалить базу лидов этого бота?')) {
                if (activeBot) activeBot.usersCount = 0;
                setToken(token + ' '); setToken(token); // force component render
                alert('База лидов успешно очищена! Счетчик сброшен.');
              }
            }}
            className="btn"
            style={{ width: '100%', height: '44px', fontSize: '14px', background: 'var(--color-danger-soft)', color: 'var(--color-danger)', border: '1px solid rgba(255, 59, 48, 0.2)' }}
          >
            Очистить базу лидов
          </button>
        </div>

        {/* Дев-кнопки для тестирования логики блокировок */}
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          <button
            onClick={() => {
              if (activeBot) {
                activeBot.usersCount = 11;
                // mock state change
                setToken(token + ' ');
                setToken(token);
              }
            }}
            style={{ fontSize: '12px', color: 'var(--color-foreground-secondary)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
          >
            (Дев) Сделать &gt;10 юзеров
          </button>
        </div>
      </motion.div>
    </>
  );
};
