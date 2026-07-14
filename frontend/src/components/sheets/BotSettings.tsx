import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, X, Info } from 'lucide-react';
import { PAYMENT_PROVIDERS } from '../../constants';
import type { PaymentProvider, AppState } from '../../types';

interface BotSettingsProps {
  appState: AppState;
  onClose: () => void;
  onSave: () => void;
}

const PROVIDER_INFO: Record<PaymentProvider, { label: string, logo: string, color: string }> = {
  yookassa: { label: 'ЮKassa', logo: '/yookassa.png', color: '#3390ec' },
  robokassa: { label: 'Robokassa', logo: '/robokassa.png', color: '#af52de' },
  prodamus: { label: 'Prodamus', logo: '/prodamus.png', color: '#ff9500' }
};

const PROVIDER_INSTRUCTIONS: Record<PaymentProvider, string> = {
  yookassa: "Ключи API находятся в кабинете ЮKassa: раздел Интеграция -> Ключи API.",
  robokassa: "Технические данные (логин и пароли) находятся в настройках магазина Robokassa.",
  prodamus: "Секретный токен выдается технической поддержкой Продамуса при интеграции."
};

export const BotSettings = ({ appState, onClose, onSave }: BotSettingsProps) => {
  const activeBot = appState.activeBot;
  
  const [name, setName] = useState(activeBot?.name || '');
  const [token, setToken] = useState(activeBot?.token || '');
  const [offerUrl, setOfferUrl] = useState(activeBot?.offerUrl || '');
  const [provider, setProvider] = useState<PaymentProvider>((activeBot?.paymentProvider as PaymentProvider) || 'yookassa');
  const [keys, setKeys] = useState<Record<string, string>>(activeBot?.paymentKeys || { shopId: '', secretKey: '' });
  const [price, setPrice] = useState(activeBot?.paymentAmount || '');

  const isPro = appState.subscriptionStatus === 'active';
  const hasManyUsers = (activeBot?.usersCount || 0) > 10;

  // Токен блокируется только если нет PRO подписки И юзеров больше 10
  const isTokenLocked = !isPro && hasManyUsers;

  const canEditToken = !isTokenLocked;
  const canEditPayment = true;

  const handleSave = () => {
    if (activeBot) {
      activeBot.name = name;
      activeBot.token = token;
      activeBot.offerUrl = offerUrl;
      activeBot.paymentProvider = provider;
      activeBot.paymentKeys = keys;
      activeBot.paymentAmount = price;
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
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-foreground)' }}>Главные настройки</h3>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-surface-2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} style={{ color: 'var(--color-foreground-secondary)' }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '60vh', overflowY: 'auto', padding: '8px', margin: '-8px' }}>

          {/* Name */}
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Имя бота</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Мой Супер Бот"
              className="input w-full"
            />
          </div>

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
                style={{ paddingLeft: '40px', opacity: !canEditToken ? 0.6 : 1, cursor: !canEditToken ? 'not-allowed' : 'text', width: '100%' }}
              />
            </div>
            {isTokenLocked && (
              <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-warning)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ fontSize: '14px' }}>🔒</span>
                У вас более 10 пользователей. Токен заблокирован. (Для смены нужна PRO подписка или новый слот).
              </p>
            )}
          </div>

          {/* Offer */}
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Ссылка на оферту</label>
            <input
              type="text"
              value={offerUrl}
              onChange={(e) => setOfferUrl(e.target.value)}
              placeholder="https://example.com/offer"
              className="input w-full"
            />
          </div>

          {/* Payment provider */}
          <div>
            <label className="text-label" style={{ display: 'block', marginBottom: '12px' }}>Платёжная система</label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {(Object.keys(PAYMENT_PROVIDERS) as PaymentProvider[]).map(p => {
                const info = PROVIDER_INFO[p];
                const isSelected = provider === p;
                
                return (
                  <button
                    key={p}
                    onClick={() => { setProvider(p); setKeys({}); }}
                    disabled={!canEditPayment}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${!canEditPayment ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[var(--color-surface-2)]'}`}
                    style={{
                      borderColor: isSelected ? info.color : 'var(--color-border)',
                      background: isSelected ? `${info.color}10` : 'var(--color-surface)',
                      boxShadow: isSelected ? `0 0 0 1px ${info.color}20, var(--shadow-card)` : 'none'
                    }}
                  >
                    <img src={info.logo} alt={info.label} className="w-8 h-8 rounded mb-2 object-contain" />
                    <span style={{ fontSize: '12px', fontWeight: isSelected ? 600 : 500, color: isSelected ? 'var(--color-foreground)' : 'var(--color-foreground-secondary)' }}>
                      {info.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="popLayout">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                >
                  <Info size={16} className="mt-0.5" style={{ color: PROVIDER_INFO[provider].color, flexShrink: 0 }} />
                  <p className="text-[13px] leading-relaxed text-[var(--color-foreground-secondary)]">
                    {PROVIDER_INSTRUCTIONS[provider]}
                  </p>
                </motion.div>
                
                <div className="space-y-4">
                  {PAYMENT_PROVIDERS[provider].map(field => (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <label className="text-[13px] font-medium text-[var(--color-foreground-secondary)] block mb-1.5">{field.label}</label>
                      <input
                        type="text"
                        placeholder={field.hint}
                        value={keys[field.key] || ''}
                        onChange={(e) => setKeys(prev => ({ ...prev, [field.key]: e.target.value }))}
                        disabled={!canEditPayment}
                        className="input w-full"
                        style={{ opacity: !canEditPayment ? 0.6 : 1, cursor: !canEditPayment ? 'not-allowed' : 'text' }}
                      />
                    </motion.div>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <label className="text-[13px] font-medium text-[var(--color-foreground-secondary)] block mb-1.5">
                      Сумма к оплате (в рублях)
                    </label>
                    <input
                      type="number"
                      placeholder="Например: 990"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      disabled={!canEditPayment}
                      className="input w-full"
                      style={{ opacity: !canEditPayment ? 0.6 : 1, cursor: !canEditPayment ? 'not-allowed' : 'text' }}
                    />
                  </motion.div>
                </div>
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
      </motion.div>
    </>
  );
};
