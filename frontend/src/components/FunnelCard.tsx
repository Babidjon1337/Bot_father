import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface FunnelCardProps {
  stepId: string;
  title: string;
  isComplete: boolean;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export const FunnelCard = ({ title, isComplete, defaultExpanded = false, children }: FunnelCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className="card"
      style={{ padding: 0, overflow: 'hidden' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between transition-colors duration-150"
        style={{
          padding: '14px 20px',
          background: isExpanded ? 'var(--color-surface)' : 'var(--color-surface)',
          borderBottom: isExpanded ? '1px solid var(--color-border)' : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="status-dot"
            style={{
              background: isComplete ? 'var(--color-success)' : 'var(--color-border-strong)',
              width: '7px',
              height: '7px',
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-foreground)' }}>{title}</span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight size={16} style={{ color: 'var(--color-foreground-tertiary)' }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div style={{ padding: '20px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
