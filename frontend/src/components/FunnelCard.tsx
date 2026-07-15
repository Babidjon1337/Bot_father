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
      className="transition-all duration-300 relative group"
      style={{ 
        padding: 0, 
        overflow: 'hidden',
        background: 'var(--color-surface)',
        borderRadius: '24px',
        border: isExpanded ? '1px solid var(--color-border-strong)' : '1px solid var(--color-border)',
        boxShadow: isExpanded ? '0 12px 32px -12px rgba(0,0,0,0.08)' : '0 4px 12px -8px rgba(0,0,0,0.05)',
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between transition-colors duration-200 hover:bg-[var(--color-surface-2)]"
        style={{
          padding: '16px 20px',
          background: isExpanded ? 'var(--color-surface-2)' : 'transparent',
          borderBottom: isExpanded ? '1px solid var(--color-border)' : '1px solid transparent',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              background: isComplete ? 'var(--color-success)' : 'var(--color-danger)',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              boxShadow: isComplete ? '0 0 8px var(--color-success-soft)' : '0 0 8px var(--color-danger-soft)',
              transition: 'all 0.3s ease'
            }}
          />
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-foreground)', letterSpacing: '-0.01em' }}>{title}</span>
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
            <div style={{ padding: '24px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
