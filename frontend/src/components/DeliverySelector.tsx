import { Link2, MailPlus, FileBox } from 'lucide-react';
import type { DeliveryType } from '../types';

interface DeliverySelectorProps {
  value: DeliveryType;
  onChange: (type: DeliveryType) => void;
  deliveryValue: string;
  onDeliveryValueChange: (val: string) => void;
}

const OPTIONS: { id: DeliveryType; icon: React.FC<any>; label: string }[] = [
  { id: 'link',   icon: Link2,   label: 'Ссылка' },
  { id: 'invite', icon: MailPlus, label: 'Инвайт' },
  { id: 'file',   icon: FileBox,  label: 'Файл' },
];

export const DeliverySelector = ({ value, onChange, deliveryValue, onDeliveryValueChange }: DeliverySelectorProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label className="text-label">Тип выдачи</label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          padding: '4px',
          background: 'var(--color-surface-2)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        {OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: '36px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: value === opt.id ? 500 : 400,
              cursor: 'pointer',
              border: 'none',
              background: value === opt.id ? 'var(--color-surface)' : 'transparent',
              color: value === opt.id ? 'var(--color-foreground)' : 'var(--color-foreground-secondary)',
              boxShadow: value === opt.id ? 'var(--shadow-card)' : 'none',
              transition: 'all 150ms ease',
            }}
          >
            <opt.icon size={15} strokeWidth={1.75} />
            {opt.label}
          </button>
        ))}
      </div>

      <div>
        {value === 'link' && (
          <input
            type="url"
            placeholder="https://t.me/+"
            value={deliveryValue}
            onChange={(e) => onDeliveryValueChange(e.target.value)}
            className="input"
          />
        )}
        {value === 'invite' && (
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '13px',
              color: 'var(--color-foreground-secondary)',
              lineHeight: 1.5,
            }}
          >
            Бот автоматически сгенерирует одноразовую пригласительную ссылку.
          </div>
        )}
        {value === 'file' && (
          <div
            style={{
              padding: '24px',
              border: '1px dashed var(--color-border-strong)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-foreground)', marginBottom: '4px' }}>Загрузить файл</div>
            <div style={{ fontSize: '12px', color: 'var(--color-foreground-tertiary)' }}>PDF, DOCX, ZIP до 50 МБ</div>
          </div>
        )}
      </div>
    </div>
  );
};
