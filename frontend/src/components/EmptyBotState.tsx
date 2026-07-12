import { motion } from 'framer-motion';
import { Plus, LayoutGrid } from 'lucide-react';

interface EmptyBotStateProps {
  onCreateBot: () => void;
  title?: string;
  description?: string;
}

export const EmptyBotState = ({ 
  onCreateBot,
  title = 'Добро пожаловать!',
  description = 'Создайте своего первого бота, чтобы автоматизировать процессы общения с клиентами и начать принимать платежи прямо в Telegram.'
}: EmptyBotStateProps) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      minHeight: '400px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="card-saas"
        style={{
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-2) 100%)'
        }}
      >
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, var(--color-primary-soft) 0%, rgba(255,255,255,0) 60%)',
          zIndex: 0,
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1,
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px',
          padding: '6px 14px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '100px',
          color: 'var(--color-primary)',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <LayoutGrid size={14} />
          <span>Bot Father</span>
        </div>

        {/* Image */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          marginBottom: '36px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            src="/empty_state_robot.png" 
            alt="New Bot" 
            style={{ 
              height: '300px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))'
            }} 
          />
        </div>

        {/* Text Content */}
        <h2 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: 'var(--color-foreground)',
          marginBottom: '16px',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          position: 'relative',
          zIndex: 1
        }}>
          {title}
        </h2>
        
        <p style={{
          fontSize: '16px',
          color: 'var(--color-foreground-secondary)',
          lineHeight: 1.6,
          marginBottom: '40px',
          maxWidth: '480px',
          position: 'relative',
          zIndex: 1
        }}>
          {description}
        </p>

        {/* Action Button */}
        <button
          onClick={onCreateBot}
          className="btn-primary-saas group"
          style={{
            height: '56px',
            padding: '0 36px',
            fontSize: '16px',
            gap: '10px',
            boxShadow: '0 8px 24px -8px rgba(99, 102, 241, 0.5)',
            display: 'inline-flex',
            position: 'relative',
            zIndex: 1,
            borderRadius: '14px'
          }}
        >
          <Plus size={22} strokeWidth={2.5} />
          Создать первого бота
        </button>
      </motion.div>
    </div>
  );
};
