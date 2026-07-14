import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, KeyRound, ExternalLink, ArrowRight, ArrowLeft, CheckCircle2, Info, CreditCard } from 'lucide-react';
import { PAYMENT_PROVIDERS } from '../../constants';
import type { PaymentProvider, BotConfig } from '../../types';

interface BotCreateSheetProps {
  onClose: () => void;
  onCreate: (botData: Partial<BotConfig>) => void;
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

export const BotCreateSheet = ({ onClose, onCreate }: BotCreateSheetProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Basic
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  // Step 2: Payment
  const [skipPayment, setSkipPayment] = useState(false);
  const [provider, setProvider] = useState<PaymentProvider>('yookassa');
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [price, setPrice] = useState('');

  // Step 3: Offer
  const [offerUrl, setOfferUrl] = useState('');

  // TG BackButton wiring
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg?.BackButton) return;
    tg.BackButton.show();
    const handler = () => {
      if (step > 1) setStep((s) => (s - 1) as any);
      else onClose();
    };
    tg.BackButton.onClick(handler);
    return () => {
      tg.BackButton.offClick(handler);
      tg.BackButton.hide();
    };
  }, [step, onClose]);

  const canGoNext1 = name.trim().length > 0 && token.trim().length > 0 && token.includes(':');
  
  const currentFields = useMemo(() => PAYMENT_PROVIDERS[provider], [provider]);
  
  const canGoNext2 = skipPayment || (
    price.trim().length > 0 && 
    currentFields.every(f => (keys[f.key] || '').trim() !== '')
  );
  
  const handleCreate = () => {
    onCreate({
      name: name.trim(),
      username: username.trim() || 'username',
      token: token.trim(),
      paymentProvider: provider,
      paymentKeys: skipPayment ? {} : keys,
      paymentAmount: skipPayment ? '' : price,
      offerUrl: offerUrl.trim(),
    });
  };

  return (
    <>
      {/* Dim backdrop — hidden on mobile (fullscreen) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="hidden lg:block"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
        }}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-surface)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          zIndex: 50,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          // Fullscreen on mobile, sheet on desktop
          height: 'calc(100dvh - env(safe-area-inset-top, 0px))',
          maxHeight: '100dvh',
        }}
        className="lg:max-h-[90vh] lg:h-auto max-w-xl mx-auto w-full"
      >
        {/* Header - added pt-safe to prevent overlap with TG BackButton if fullscreen */}
        <div className="flex justify-between items-center px-5 py-4 pt-[max(env(safe-area-inset-top,16px),16px)] lg:pt-4 border-b border-[var(--color-border)] shrink-0">
          <div className="mt-1">
            <h2 className="text-[18px] font-bold text-[var(--color-foreground)] leading-none">Подключение бота</h2>
            <div className="flex gap-1.5 mt-2">
              <div className={`h-1 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`} />
              <div className={`h-1 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`} />
              <div className={`h-1 w-8 rounded-full transition-colors ${step >= 3 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`} />
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-foreground-secondary)] hover:bg-[var(--color-border)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                <div className="text-center mb-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-primary-soft)] flex items-center justify-center mb-4">
                    <Bot size={32} className="text-[var(--color-primary)]" />
                  </div>
                  <p className="text-[14px] text-[var(--color-foreground-secondary)] leading-relaxed">
                    Для начала нам потребуется токен от <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline">@BotFather</a>.<br />
                    Создайте нового бота там и скопируйте HTTP API Token.
                  </p>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[var(--color-foreground-secondary)] block mb-1.5">
                    Внутреннее название (для себя)
                  </label>
                  <input
                    type="text"
                    placeholder="Например: Мой магазин"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input w-full"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[var(--color-foreground-secondary)] block mb-1.5">
                    Юзернейм бота (опционально)
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[var(--color-foreground-secondary)] block mb-1.5">
                    Telegram Token <span className="text-[var(--color-danger)]">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-foreground-tertiary)]" />
                    <input
                      type="text"
                      placeholder="1234567890:AAH..."
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="input w-full"
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                  {token && !token.includes(':') && (
                    <p className="text-[12px] text-[var(--color-danger)] mt-1.5">Некорректный формат токена</p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                <div className="text-center mb-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-success-soft)] flex items-center justify-center mb-4">
                    <CreditCard size={32} className="text-[var(--color-success)]" />
                  </div>
                  <p className="text-[14px] text-[var(--color-foreground-secondary)] leading-relaxed">
                    Как вы хотите принимать оплату от пользователей?
                  </p>
                </div>

                <label className="flex items-center justify-between cursor-pointer bg-[var(--color-surface-2)] p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-all">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-medium text-[var(--color-foreground)]">Пропустить настройку платежей</span>
                    <span className="text-[12px] text-[var(--color-foreground-secondary)] mt-0.5">Вы сможете настроить кассу позже</span>
                  </div>
                  <div 
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300" 
                    style={{ backgroundColor: skipPayment ? 'var(--color-primary)' : 'var(--color-border-strong)' }}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${skipPayment ? 'translate-x-6' : 'translate-x-1'}`} 
                    />
                  </div>
                  {/* Скрытый инпут для логики */}
                  <input 
                    type="checkbox" 
                    checked={skipPayment} 
                    onChange={(e) => setSkipPayment(e.target.checked)}
                    className="hidden"
                  />
                </label>

                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  className={`flex flex-col gap-5 transition-all duration-300 ${skipPayment ? 'opacity-30 pointer-events-none grayscale select-none' : ''}`}
                >
                  <div>
                    <label className="text-[13px] font-medium text-[var(--color-foreground-secondary)] block mb-2.5">Выберите провайдера</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(Object.keys(PAYMENT_PROVIDERS) as PaymentProvider[]).map(p => {
                        const info = PROVIDER_INFO[p];
                        const isSelected = provider === p;
                        
                        return (
                          <button
                            key={p}
                            onClick={() => { setProvider(p); setKeys({}); }}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer hover:bg-[var(--color-surface-2)]`}
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
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                  >
                    <Info size={16} className="mt-0.5" style={{ color: PROVIDER_INFO[provider].color, flexShrink: 0 }} />
                    <p className="text-[13px] leading-relaxed text-[var(--color-foreground-secondary)]">
                      {PROVIDER_INSTRUCTIONS[provider]}
                    </p>
                  </motion.div>

                  <div className="space-y-4">
                    {currentFields.map((f) => (
                      <div key={f.key}>
                        <label className="text-[13px] font-medium text-[var(--color-foreground-secondary)] block mb-1.5">{f.label}</label>
                        <input
                          type="text"
                          placeholder={f.hint}
                          value={keys[f.key] || ''}
                          onChange={(e) => setKeys(prev => ({ ...prev, [f.key]: e.target.value }))}
                          className="input w-full"
                          disabled={skipPayment}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-[13px] font-medium text-[var(--color-foreground-secondary)] block mb-1.5">
                      Сумма к оплате (в рублях)
                    </label>
                    <input
                      type="number"
                      placeholder="Например: 990"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="input w-full"
                      disabled={skipPayment}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                <div className="text-center mb-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-warning-soft)] flex items-center justify-center mb-4">
                    <ExternalLink size={32} className="text-[var(--color-warning)]" />
                  </div>
                  <p className="text-[14px] text-[var(--color-foreground-secondary)] leading-relaxed">
                    Последний шаг: укажите ссылку на публичную оферту или условия использования, чтобы соблюдать правила платёжных систем.
                  </p>
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[var(--color-foreground-secondary)] block mb-1.5">
                    Ссылка на оферту
                  </label>
                  <input
                    type="url"
                    placeholder="https://mysite.com/offer"
                    value={offerUrl}
                    onChange={(e) => setOfferUrl(e.target.value)}
                    className="input w-full"
                  />
                  <p className="text-[12px] text-[var(--color-foreground-tertiary)] mt-2">
                    Можно настроить позже в разделе "Главные настройки".
                  </p>
                </div>

                <div className="mt-4 bg-[var(--color-primary-soft)] p-4 rounded-2xl border border-[var(--color-primary)]/20">
                  <h4 className="text-[14px] font-semibold text-[var(--color-primary)] flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} />
                    Всё готово!
                  </h4>
                  <p className="text-[13px] text-[var(--color-primary)]/80 leading-relaxed">
                    Нажмите кнопку ниже, чтобы завершить настройку и перейти к визуальному редактору сообщений.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--color-border)] flex gap-3 shrink-0 bg-[var(--color-surface)]">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="h-[52px] px-6 rounded-2xl flex items-center justify-center font-semibold transition-all flex-[1]"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              disabled={(step === 1 && !canGoNext1) || (step === 2 && !canGoNext2)}
              className="h-[52px] rounded-2xl flex items-center justify-center font-semibold transition-all flex-[2] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', boxShadow: '0 8px 16px -6px rgba(99,102,241,0.4)' }}
            >
              Далее
              <ArrowRight size={18} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="h-[52px] rounded-2xl flex items-center justify-center font-semibold transition-all flex-[2] text-white"
              style={{ background: 'linear-gradient(135deg, var(--color-success), #10B981)', boxShadow: '0 8px 16px -6px rgba(16,185,129,0.4)' }}
            >
              Создать бота
              <CheckCircle2 size={18} className="ml-2" />
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
};
