import { useState } from 'react';

interface TimerPresetsProps {
  value: string;
  onChange: (value: string) => void;
  presets: string[];
}

export const TimerPresets = ({ value, onChange, presets }: TimerPresetsProps) => {
  const isCustom = !presets.includes(value) && value !== '';
  const [showCustom, setShowCustom] = useState(isCustom);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label className="text-label">Отправить через</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {presets.map(preset => (
          <button
            key={preset}
            onClick={() => { setShowCustom(false); onChange(preset); }}
            style={{
              height: '34px',
              padding: '0 14px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '13px',
              fontWeight: value === preset && !showCustom ? 500 : 400,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: value === preset && !showCustom ? 'var(--color-primary)' : 'var(--color-border)',
              background: value === preset && !showCustom ? 'var(--color-primary-soft)' : 'var(--color-surface)',
              color: value === preset && !showCustom ? 'var(--color-primary)' : 'var(--color-foreground-secondary)',
              transition: 'all 150ms ease',
            }}
          >
            {preset}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(true)}
          style={{
            height: '34px',
            padding: '0 14px',
            borderRadius: 'var(--radius-xs)',
            fontSize: '13px',
            fontWeight: showCustom ? 500 : 400,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: showCustom ? 'var(--color-primary)' : 'var(--color-border)',
            background: showCustom ? 'var(--color-primary-soft)' : 'var(--color-surface)',
            color: showCustom ? 'var(--color-primary)' : 'var(--color-foreground-secondary)',
            transition: 'all 150ms ease',
          }}
        >
          Своё
        </button>
      </div>
      {showCustom && (
        <input
          type="text"
          placeholder="Например: 10 мин"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input"
        />
      )}
    </div>
  );
};
