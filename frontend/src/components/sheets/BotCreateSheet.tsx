import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bot } from 'lucide-react';

interface BotCreateSheetProps {
  onClose: () => void;
  onCreate: (name: string, username: string) => void;
}

export const BotCreateSheet = ({ onClose, onCreate }: BotCreateSheetProps) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), username.trim() || 'username');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-surface)',
          padding: '24px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          zIndex: 50,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        }}
        className="max-w-md mx-auto"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>Добавить бота</h2>
          <button onClick={onClose} style={{ padding: '8px', background: 'var(--color-surface-2)', borderRadius: '50%', color: 'var(--color-foreground-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div className="w-20 h-20 mx-auto rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center mb-4">
              <Bot size={40} className="text-[var(--color-primary)]" />
            </div>
            <p className="text-[14px] text-[var(--color-foreground-secondary)]">
              Придумайте название, чтобы отличать этого бота от других.
            </p>
          </div>

          <div>
            <label className="text-[13px] font-medium text-[var(--color-foreground-secondary)] block mb-2">
              Название (для себя)
            </label>
            <input
              type="text"
              placeholder="Например: Мой магазин одежды"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[15px] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              autoFocus
              required
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label className="text-[13px] font-medium text-[var(--color-foreground-secondary)] block mb-2">
              Юзернейм бота (необязательно)
            </label>
            <input
              type="text"
              placeholder="@username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[15px] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 text-white rounded-xl text-[16px] font-bold shadow-md transition-all duration-200 disabled:opacity-50"
          >
            Продолжить
          </button>
        </form>
      </motion.div>
    </>
  );
};
