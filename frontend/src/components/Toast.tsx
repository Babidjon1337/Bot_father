import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose: () => void;
}

export const Toast = ({ message, type = 'success', duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 18px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-float)',
          whiteSpace: 'nowrap',
        }}
      >
        {type === 'success'
          ? <CheckCircle2 size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
          : <XCircle size={16} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />}
        <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--color-foreground)' }}>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};
