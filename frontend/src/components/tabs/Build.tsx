import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { FunnelCard } from '../FunnelCard';
import { TimerPresets } from '../TimerPresets';
import { DeliverySelector } from '../DeliverySelector';
import { BotSetupCard } from '../BotSetupCard';
import type { FunnelNode, DeliveryType, AppState } from '../../types';

interface BuildProps {
  appState: AppState;
  blocks: FunnelNode[];
  selectedBlockId: string;
  setSelectedBlockId: (id: string) => void;
  updateBlock: (id: string, field: keyof FunnelNode, value: string) => void;
  onBotConnect: () => void;
  onPublish: () => void;
  theme: 'light' | 'dark';
}

export const Build = ({ 
  appState, 
  blocks, 
  setSelectedBlockId, 
  updateBlock, 
  onBotConnect,
  onPublish,
  theme 
}: BuildProps) => {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('link');
  const [deliveryValue, setDeliveryValue] = useState('');

  const getBlock = (id: string) => blocks.find(b => b.id === id);

  // Preview simulation state
  const [previewStep, setPreviewStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    if (previewStep >= 2) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setPreviewStep(prev => prev + 1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying, previewStep]);

  const handlePlayPreview = () => {
    setPreviewStep(0);
    setIsPlaying(true);
  };

  const MessageBubble = ({ text, button, media }: { text?: string, button?: string, media?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '85%' }}>
      <div style={{
        background: 'var(--color-surface)',
        color: 'var(--color-foreground)',
        padding: media ? '4px' : '10px 14px',
        borderRadius: '16px',
        borderBottomLeftRadius: '4px',
        fontSize: '14px',
        lineHeight: 1.4,
        boxShadow: 'var(--shadow-card)',
      }}>
        {media && (
          <div style={{
            background: 'var(--color-surface-2)',
            borderRadius: '12px',
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: text ? '8px' : '0',
            color: 'var(--color-foreground-tertiary)'
          }}>
            <ImageIcon size={24} style={{ marginBottom: '8px' }} />
            <span style={{ fontSize: '11px', textAlign: 'center', padding: '0 10px' }}>
              Тут находится ваше фото или видео
            </span>
          </div>
        )}
        {text && <div style={{ padding: media ? '0 8px 8px' : 0 }}>{text}</div>}
      </div>
      {button && (
        <div style={{
          background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(10px)',
          color: 'var(--color-primary)',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 500,
          textAlign: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-card)',
          marginTop: '2px',
        }}>
          {button}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      key="build"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 pb-24"
    >
      {/* Left: funnel steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {!appState.activeBot && (
          <BotSetupCard onConnect={onBotConnect} />
        )}
        
        <div data-tour="tour-funnel-steps" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <FunnelCard stepId="offer" title="Шаг 0 · Оферта" isComplete={false}>
              <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Ссылка на договор оферты</label>
              <input type="url" placeholder="https://..." className="input" />
            </FunnelCard>

            <FunnelCard stepId="start" title="Шаг 1 · Старт" isComplete={!!(getBlock('start')?.content)} defaultExpanded>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Текст сообщения</label>
                  <textarea
                    value={getBlock('start')?.content || ''}
                    onChange={(e) => updateBlock('start', 'content', e.target.value)}
                    onClick={() => setSelectedBlockId('start')}
                    placeholder="Первое сообщение бота..."
                    className="textarea"
                    style={{ minHeight: '88px' }}
                  />
                </div>
                <div>
                  <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Текст кнопки</label>
                  <input
                    value={getBlock('start')?.buttonText || ''}
                    onChange={(e) => updateBlock('start', 'buttonText', e.target.value)}
                    placeholder="Например: Начать"
                    className="input"
                  />
                </div>
              </div>
            </FunnelCard>

            <FunnelCard stepId="push1" title="Шаг 2 · Дожим 1" isComplete={!!(getBlock('push1')?.content)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <TimerPresets
                  value={getBlock('push1')?.delay || '1ч'}
                  onChange={(val) => updateBlock('push1', 'delay', val)}
                  presets={['1ч', '6ч', '12ч', '24ч', '48ч']}
                />
                <div>
                  <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Текст дожима</label>
                  <textarea
                    value={getBlock('push1')?.content || ''}
                    onChange={(e) => updateBlock('push1', 'content', e.target.value)}
                    onClick={() => setSelectedBlockId('push1')}
                    placeholder="Напоминание пользователю..."
                    className="textarea"
                    style={{ minHeight: '88px' }}
                  />
                </div>
                <div>
                  <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Текст кнопки</label>
                  <input
                    value={getBlock('push1')?.buttonText || ''}
                    onChange={(e) => updateBlock('push1', 'buttonText', e.target.value)}
                    placeholder="Например: Перейти"
                    className="input"
                  />
                </div>
              </div>
            </FunnelCard>

            <FunnelCard stepId="push2" title="Шаг 3 · Дожим 2" isComplete={!!(getBlock('push2')?.content)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <TimerPresets
                  value={getBlock('push2')?.delay || '24ч'}
                  onChange={(val) => updateBlock('push2', 'delay', val)}
                  presets={['1ч', '6ч', '12ч', '24ч', '48ч']}
                />
                <div>
                  <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Текст дожима</label>
                  <textarea
                    value={getBlock('push2')?.content || ''}
                    onChange={(e) => updateBlock('push2', 'content', e.target.value)}
                    onClick={() => setSelectedBlockId('push2')}
                    placeholder="Последний шанс..."
                    className="textarea"
                    style={{ minHeight: '88px' }}
                  />
                </div>
              </div>
            </FunnelCard>

            <FunnelCard stepId="after_payment" title="Шаг 4 · После оплаты" isComplete={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <DeliverySelector
                  value={deliveryType}
                  onChange={setDeliveryType}
                  deliveryValue={deliveryValue}
                  onDeliveryValueChange={setDeliveryValue}
                />
                <div>
                  <label className="text-label" style={{ display: 'block', marginBottom: '8px', marginTop: '4px' }}>Текст сообщения после оплаты</label>
                  <textarea
                    value={getBlock('delivery')?.content || ''}
                    onChange={(e) => updateBlock('delivery', 'content', e.target.value)}
                    onClick={() => setSelectedBlockId('delivery')}
                    placeholder="Спасибо за покупку!"
                    className="textarea"
                    style={{ minHeight: '88px' }}
                  />
                </div>
              </div>
            </FunnelCard>
        </div>
        <div style={{ height: '80px' }} /> {/* Spacer for fixed bottom bar */}
      </div>

      {/* Right: Live Preview (desktop only) */}
      <div className="hidden lg:block" data-tour="tour-preview">
        <div style={{ position: 'sticky', top: '72px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px', paddingLeft: '4px' }}>
            <span className="text-hint">Предпросмотр воронки</span>
            <button
              onClick={handlePlayPreview}
              className="btn btn-ghost"
              style={{ height: '28px', padding: '0 8px', fontSize: '12px', color: 'var(--color-primary)' }}
            >
              {isPlaying ? <RotateCcw size={14} className="animate-spin" /> : <Play size={14} />}
              <span>{isPlaying ? 'Проигрываем...' : 'Прогнать'}</span>
            </button>
          </div>
          
          {/* Phone Mockup */}
          <div
            style={{
              margin: '0 auto',
              width: '320px',
              height: '620px',
              background: theme === 'dark' ? '#0F0F0F' : '#E4EAF0', // TG default background tint
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', // subtle texture
              borderRadius: '44px',
              border: `10px solid ${theme === 'dark' ? '#1C1C1E' : '#FFFFFF'}`,
              boxShadow: 'var(--shadow-float)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Header */}
            <div style={{
              background: theme === 'dark' ? 'rgba(28,28,30,0.9)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderBottom: '1px solid var(--color-border)',
              zIndex: 10,
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, color: '#fff' }}>B</div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-foreground)', lineHeight: 1.2 }}>Ваш бот</div>
                <div style={{ fontSize: '12px', color: 'var(--color-foreground-secondary)', marginTop: '2px' }}>bot</div>
              </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
              <AnimatePresence>
                {/* Step 0: Start */}
                <motion.div
                  key="start"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <MessageBubble 
                    text={getBlock('start')?.content} 
                    button={getBlock('start')?.buttonText} 
                    media={true}
                  />
                </motion.div>

                {/* Step 1: Push 1 */}
                {previewStep >= 1 && (
                  <motion.div
                    key="push1"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    <div style={{ fontSize: '11px', textAlign: 'center', color: '#8B95A1', margin: '8px 0' }}>Через {getBlock('push1')?.delay || '1 час'}</div>
                    <MessageBubble 
                      text={getBlock('push1')?.content} 
                      button={getBlock('push1')?.buttonText} 
                    />
                  </motion.div>
                )}

                {/* Step 2: Push 2 */}
                {previewStep >= 2 && (
                  <motion.div
                    key="push2"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    <div style={{ fontSize: '11px', textAlign: 'center', color: '#8B95A1', margin: '8px 0' }}>Через {getBlock('push2')?.delay || '24 часа'}</div>
                    <MessageBubble 
                      text={getBlock('push2')?.content} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar — always visible */}
      <div
        className="fixed left-0 right-0 z-40 flex items-center justify-between px-4 py-3 lg:left-[240px] bottom-[calc(env(safe-area-inset-bottom)+64px)] lg:bottom-0"
        style={{
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          gap: '12px',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {appState.activeBot ? (
            <>
              <div
                style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: appState.isDirty ? 'var(--color-warning)' : 'var(--color-success)',
                  boxShadow: appState.isDirty ? '0 0 8px var(--color-warning-soft)' : '0 0 8px var(--color-success-soft)'
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-foreground)' }}>
                {appState.isDirty ? 'Нужно сохранить' : 'Сохранено'}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '13px', color: 'var(--color-foreground-tertiary)' }}>
              Публикация от <strong style={{ color: 'var(--color-foreground-secondary)' }}>2 000 ₽</strong>
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {appState.activeBot && appState.isDirty && (
            <button
              className="btn btn-secondary"
              style={{ height: '40px', padding: '0 16px' }}
              onClick={() => {
                const tg = (window as any).Telegram?.WebApp;
                if (tg) tg.HapticFeedback.impactOccurred('medium');
              }}
            >
              Сохранить
            </button>
          )}
          <button
            className="btn btn-action"
            style={{ height: '40px', padding: '0 20px' }}
            data-tour="tour-publish-btn"
            onClick={onPublish}
          >
            Опубликовать
          </button>
        </div>
      </div>
    </motion.div>
  );
};
