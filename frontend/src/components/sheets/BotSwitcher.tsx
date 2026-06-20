import { motion } from 'framer-motion';
import { Check, Plus, X, Lock } from 'lucide-react';
import type { BotConfig } from '../../types';

interface BotSwitcherProps {
  bots: BotConfig[];
  activeBotId: string | undefined;
  subscriptionStatus: 'none' | 'active' | 'expired';
  onSelect: (id: string) => void;
  onAddBot: () => void;
  onClose: () => void;
}

export const BotSwitcher = ({ bots, activeBotId, subscriptionStatus, onSelect, onAddBot, onClose }: BotSwitcherProps) => {
  const isPro = subscriptionStatus === 'active';

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 40 }}
      />
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed', top: '64px', left: '16px', right: '16px', zIndex: 50,
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-float)',
          padding: '6px',
          maxWidth: '320px',
        }}
        className="lg:absolute lg:top-14 lg:left-0 lg:right-auto"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', marginBottom: '2px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-foreground-tertiary)', fontWeight: 500 }}>Ваши боты</span>
          <button onClick={onClose} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={13} style={{ color: 'var(--color-foreground-tertiary)' }} />
          </button>
        </div>

        {/* Active bots */}
        {bots.map(bot => (
          <button
            key={bot.id}
            onClick={() => onSelect(bot.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: 'var(--radius-xs)', border: 'none',
              background: bot.id === activeBotId ? 'var(--color-primary-soft)' : 'transparent',
              cursor: 'pointer', transition: 'background 150ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                background: bot.id === activeBotId ? 'var(--color-primary)' : 'var(--color-surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 600,
                color: bot.id === activeBotId ? '#fff' : 'var(--color-foreground-secondary)',
              }}>
                {bot.name.substring(0, 2).toUpperCase()}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: bot.id === activeBotId ? 500 : 400, color: 'var(--color-foreground)' }}>{bot.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-foreground-tertiary)', marginTop: '1px' }}>{bot.username}</div>
              </div>
            </div>
            {bot.id === activeBotId && <Check size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />}
          </button>
        ))}

        {/* Locked slot (shown to non-PRO users who already have 1 bot, to tease PRO) */}
        {!isPro && bots.length >= 1 && (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: 'var(--radius-xs)',
              opacity: 0.6,
            }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
              border: '1.5px dashed var(--color-border-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lock size={13} style={{ color: 'var(--color-foreground-tertiary)' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--color-foreground-secondary)' }}>Слот #2 — заблокирован</div>
              <div style={{ fontSize: '11px', color: 'var(--color-foreground-tertiary)' }}>PRO открывает до 10 ботов</div>
            </div>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '4px', paddingTop: '4px' }}>
          <button
            onClick={() => { onClose(); onAddBot(); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: 'var(--radius-xs)', border: 'none',
              background: 'transparent', cursor: 'pointer', transition: 'background 150ms ease',
              color: 'var(--color-foreground-secondary)',
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px dashed var(--color-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus size={14} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '14px' }}>Добавить бота</div>
              {!isPro && <div style={{ fontSize: '11px', color: 'var(--color-warning)' }}>Разовый 2 000 ₽ или PRO</div>}
            </div>
          </button>
        </div>
      </motion.div>
    </>
  );
};
