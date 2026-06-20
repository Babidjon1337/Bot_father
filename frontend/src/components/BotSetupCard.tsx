import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import { PAYMENT_PROVIDERS } from '../constants';
import type { PaymentProvider } from '../types';

interface BotSetupCardProps {
  onConnect: () => void;
}

export const BotSetupCard = ({ onConnect }: BotSetupCardProps) => {
  const [token, setToken] = useState('');
  const [provider, setProvider] = useState<PaymentProvider>('yookassa');
  const [keys, setKeys] = useState<Record<string, string>>({});

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-foreground)', marginBottom: '4px' }}>
          Подключите бота
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-foreground-secondary)' }}>
          Введите токен и выберите платёжную систему
        </div>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Step 1: Token */}
        <div>
        <div data-tour="tour-token-input" className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
            <div
              style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: 'var(--color-primary-soft)',
                color: 'var(--color-primary)',
                fontSize: '11px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}
            >1</div>
            <label className="text-label">Токен Telegram бота</label>
          </div>
          <div style={{ position: 'relative' }}>
            <KeyRound size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-foreground-tertiary)' }} />
            <input
              type="text"
              placeholder="1234567890:AAH_xxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="input"
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <div
            style={{
              marginTop: '8px',
              padding: '10px 14px',
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '12px',
              color: 'var(--color-foreground-secondary)',
              lineHeight: 1.6,
            }}
          >
            Получите токен в{' '}
            <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>@BotFather</a>{' '}
            — отправьте <code style={{ background: 'var(--color-border)', padding: '1px 5px', borderRadius: '4px' }}>/newbot</code>
          </div>
        </div>

        {/* Step 2: Payment provider */}
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
            <div
              style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: 'var(--color-primary-soft)',
                color: 'var(--color-primary)',
                fontSize: '11px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}
            >2</div>
            <label className="text-label">Платёжная система</label>
          </div>

          {/* Segmented control */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px',
              padding: '4px',
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '12px',
            }}
          >
            {(Object.keys(PAYMENT_PROVIDERS) as PaymentProvider[]).map(p => (
              <button
                key={p}
                onClick={() => { setProvider(p); setKeys({}); }}
                style={{
                  height: '34px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: provider === p ? 500 : 400,
                  cursor: 'pointer',
                  border: 'none',
                  background: provider === p ? 'var(--color-surface)' : 'transparent',
                  color: provider === p ? 'var(--color-foreground)' : 'var(--color-foreground-secondary)',
                  boxShadow: provider === p ? 'var(--shadow-card)' : 'none',
                  transition: 'all 150ms ease',
                  textTransform: 'capitalize',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PAYMENT_PROVIDERS[provider].map(field => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <label className="text-label" style={{ display: 'block', marginBottom: '6px' }}>{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.hint}
                    value={keys[field.key] || ''}
                    onChange={(e) => setKeys(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="input"
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={onConnect}
          disabled={token.length < 20}
          className="btn btn-action w-full"
          style={{ height: '44px', width: '100%' }}
        >
          Подключить бота
        </button>
      </div>
    </div>
  );
};
