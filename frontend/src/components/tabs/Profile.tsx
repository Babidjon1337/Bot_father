import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Settings, Sun, Moon } from 'lucide-react';
import type { AppState, SheetType, TabType } from '../../types';

interface ProfileProps {
  appState: AppState;
  setSheet: (sheet: SheetType) => void;
  setActiveTab: (tab: TabType) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Profile = ({ appState, setSheet, setActiveTab, theme, toggleTheme }: ProfileProps) => {
  const isSubscribed = appState.subscriptionStatus === 'active';

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="w-full pb-10 flex justify-center"
    >
      <div className="w-full max-w-[640px] space-y-6 pt-4 lg:pt-8 px-4 lg:px-0">
        
        {/* Premium Account Header */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          {/* Cover Gradient */}
          <div 
            style={{ 
              height: '100px', 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #A855F7 100%)',
              opacity: 0.9
            }} 
          />
          
          {/* Theme Toggle Overlay */}
          <div className="absolute top-4 right-4 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)' }}>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center transition-colors hover:bg-white/20"
              style={{ height: '36px', width: '36px', color: '#fff' }}
              title="Сменить тему"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>

          <div className="px-6 pb-6 relative">
            {/* Overlapping Avatar */}
            <div 
              className="flex items-center justify-center shrink-0 shadow-md"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--color-surface)',
                border: '4px solid var(--color-surface)',
                color: 'var(--color-primary)',
                fontSize: '28px',
                fontWeight: 700,
                marginTop: '-40px',
                marginBottom: '16px'
              }}
            >
              {appState.userEmail ? appState.userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-foreground)', letterSpacing: '-0.02em', margin: 0 }}>Мой аккаунт</h2>
              <p style={{ fontSize: '14px', color: 'var(--color-foreground-secondary)', marginTop: '2px', marginBottom: 0 }}>
                {appState.userEmail || 'Не указан'}
              </p>
            </div>
          </div>
        </div>

        {/* Informative Editor Warning */}
        <div style={{
          background: 'var(--color-surface-2)',
          borderLeft: '3px solid var(--color-primary)',
          padding: '12px 16px',
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          fontSize: '13px',
          color: 'var(--color-foreground)',
          lineHeight: 1.5,
        }}>
          <strong>Режим редактирования:</strong> Ниже указаны настройки платёжных систем и параметры для <strong>текущего выбранного бота</strong>. Если вы сохранили настройки — они сразу применяются к воронке.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Subscription block */}
          <div className="card">
            <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
              <ShieldCheck size={18} style={{ color: isSubscribed ? 'var(--color-success)' : 'var(--color-foreground-tertiary)' }} />
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-foreground)' }}>Подписка</span>
              <span className={`badge ${isSubscribed ? 'badge-success' : 'badge-muted'}`} style={{ marginLeft: 'auto' }}>
                {isSubscribed ? 'Активна' : 'Не активна'}
              </span>
            </div>

            {isSubscribed ? (
              <div className="card-row" style={{ paddingTop: 0 }}>
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>PRO тариф</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-foreground-secondary)' }}>до 24 июля 2026</span>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--color-foreground-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
                {appState.subscriptionStatus === 'expired'
                  ? 'Подписка истекла. Боты остановлены.'
                  : 'Оформите PRO для публикации ботов и приёма платежей.'}
              </p>
            )}

            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <button
                onClick={() => {
                  if (isSubscribed || appState.subscriptionStatus === 'expired') {
                    setSheet('billing_renew');
                  } else {
                    setActiveTab('subscription');
                  }
                }}
                className={`btn ${isSubscribed ? 'btn-secondary' : 'btn-primary'}`}
                style={{ height: '36px', width: '100%', fontSize: '13px' }}
              >
                {isSubscribed ? 'Управлять подпиской' : 'Перейти на PRO'}
              </button>
            </div>
          </div>

          {/* Payment integrations */}
          <div className="card">
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div className="flex items-center gap-3">
                <CreditCard size={18} style={{ color: 'var(--color-foreground-tertiary)' }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-foreground)' }}>Интеграции</span>
              </div>
              <button
                onClick={() => setSheet('bot_settings')}
                className="btn btn-ghost"
                style={{ height: '32px', width: '32px', padding: 0, color: 'var(--color-foreground-tertiary)' }}
                title="Настройки интеграций"
              >
                <Settings size={16} />
              </button>
            </div>
            <div>
              {[
                { name: 'ЮKassa', active: true },
                { name: 'Robokassa', active: false },
                { name: 'Prodamus', active: false },
              ].map((p, i) => (
                <div key={i} className="card-row flex items-center justify-between" style={{ paddingTop: i === 0 ? 0 : '14px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="status-dot" style={{ background: p.active ? 'var(--color-success)' : 'var(--color-foreground-tertiary)' }} />
                    <span style={{ fontSize: '13px', color: p.active ? 'var(--color-success)' : 'var(--color-foreground-tertiary)' }}>
                      {p.active ? 'Подключено' : 'Не настроено'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
