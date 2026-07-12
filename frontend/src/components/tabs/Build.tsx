import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Image as ImageIcon, ShieldAlert, Bold, Italic, Strikethrough, Link2 } from 'lucide-react';
import { EmptyBotState } from '../EmptyBotState';
import { FunnelCard } from '../FunnelCard';
import { TimerPresets } from '../TimerPresets';
import { DeliverySelector } from '../DeliverySelector';
import type { FunnelNode, DeliveryType, AppState } from '../../types';

interface BuildProps {
  appState: AppState;
  blocks: FunnelNode[];
  selectedBlockId: string;
  setSelectedBlockId: (id: string) => void;
  updateBlock: (id: string, field: keyof FunnelNode, value: string) => void;
  onPublish: () => void;
  onCreateBot: () => void;
  onOpenSettings: () => void;
  theme: 'light' | 'dark';
}

// --- Rich Text Editor ---
export const RichTextEditor = ({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder?: string }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    handleInput();
    editorRef.current?.focus();
  };

  return (
    <div className="flex flex-col border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-surface)] focus-within:border-[var(--color-primary)] transition-colors">
      <div className="flex items-center gap-0.5 p-1 bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--color-surface)] text-[var(--color-foreground-secondary)]"><Bold size={13}/></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--color-surface)] text-[var(--color-foreground-secondary)]"><Italic size={13}/></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('strikeThrough'); }} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--color-surface)] text-[var(--color-foreground-secondary)]"><Strikethrough size={13}/></button>
        <button type="button" onMouseDown={(e) => { 
          e.preventDefault();
          const url = prompt('Введите URL:');
          if (url) execCmd('createLink', url);
        }} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--color-surface)] text-[var(--color-foreground-secondary)]"><Link2 size={13}/></button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="p-3 min-h-[88px] outline-none text-[14px] rich-text-editor"
        style={{ color: 'var(--color-foreground)' }}
        data-placeholder={placeholder}
      />
    </div>
  );
};
// --- End Editor ---

export const Build = ({ 
  appState, 
  blocks, 
  setSelectedBlockId, 
  updateBlock, 
  onPublish,
  onCreateBot,
  onOpenSettings,
  theme 
}: BuildProps) => {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('link');
  const [deliveryValue, setDeliveryValue] = useState('');

  const getBlock = (id: string) => blocks.find(b => b.id === id);

  // Preview simulation state
  const [previewStep, setPreviewStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [, setForceRender] = useState(0);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '85%' }}>
      <div style={{
        background: 'var(--color-surface)',
        color: 'var(--color-foreground)',
        padding: media ? '4px' : '10px 14px',
        borderRadius: '16px',
        borderBottomLeftRadius: '4px',
        fontSize: '14px',
        lineHeight: 1.4,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
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
        {text && <div style={{ padding: media ? '0 8px 8px 8px' : '0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: text.replace(/<[^>]*>?/gm, '') }} />}
      </div>
      {button && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: 'var(--color-primary)',
          padding: '10px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 500,
          textAlign: 'center',
          cursor: 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          {button}
        </div>
      )}
    </div>
  );

  const hasMainSettings = !!(appState.activeBot?.token && appState.activeBot?.name);

  if (!appState.activeBot) {
    return <EmptyBotState onCreateBot={onCreateBot} />;
  }

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Bot Header (Settings Access) */}
      <div className="card-saas flex items-center justify-between gap-4 flex-wrap mb-6 px-5 py-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--color-primary-soft)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '18px'
          }}>
            {appState.activeBot.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-foreground)', fontSize: '15px' }}>
              {appState.activeBot.name}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-foreground-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: appState.activeBot.status === 'active' ? 'var(--color-success)' : 'var(--color-warning)'
              }} />
              {appState.activeBot.status === 'active' ? 'Активен' : 'Черновик'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!appState.activeBot.paymentProvider && (
            <div style={{
              background: 'var(--color-warning-soft)',
              color: 'var(--color-warning)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }} onClick={onOpenSettings}>
              <ShieldAlert size={14} />
              Касса не подключена
            </div>
          )}
          <button 
            className="btn-primary-saas" 
            onClick={onOpenSettings}
            style={{ fontSize: '14px', height: '36px', padding: '0 16px' }}
          >
            ⚙️ Настройки бота
          </button>
        </div>
      </div>

    <motion.div
      key="build"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className={`grid grid-cols-1 ${hasMainSettings ? 'lg:grid-cols-[1fr_340px]' : ''} gap-6 pb-24`}
    >
      {/* Left: funnel steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: hasMainSettings ? 'none' : '600px', margin: hasMainSettings ? '0' : '0 auto', width: '100%' }}>
        <div data-tour="tour-funnel-steps" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <FunnelCard stepId="start" title="Шаг 1 · Старт" isComplete={!!(getBlock('start')?.content)} defaultExpanded>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div onClick={() => setSelectedBlockId('start')}>
                      <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Текст сообщения</label>
                      <RichTextEditor
                        value={getBlock('start')?.content || ''}
                        onChange={(v) => updateBlock('start', 'content', v)}
                        placeholder="Первое сообщение бота..."
                      />
                    </div>
                    <div>
                      <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Текст кнопки</label>
                      <input
                        value={getBlock('start')?.buttonText || ''}
                        onChange={(e) => updateBlock('start', 'buttonText', e.target.value)}
                        placeholder="Например: Начать"
                        className="input w-full"
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
                    <div onClick={() => setSelectedBlockId('push1')}>
                      <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Текст дожима</label>
                      <RichTextEditor
                        value={getBlock('push1')?.content || ''}
                        onChange={(v) => updateBlock('push1', 'content', v)}
                        placeholder="Напоминание пользователю..."
                      />
                    </div>
                    <div>
                      <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Текст кнопки</label>
                      <input
                        value={getBlock('push1')?.buttonText || ''}
                        onChange={(e) => updateBlock('push1', 'buttonText', e.target.value)}
                        placeholder="Например: Перейти"
                        className="input w-full"
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
                    <div onClick={() => setSelectedBlockId('push2')}>
                      <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Текст дожима</label>
                      <RichTextEditor
                        value={getBlock('push2')?.content || ''}
                        onChange={(v) => updateBlock('push2', 'content', v)}
                        placeholder="Последний шанс..."
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
                    <div onClick={() => setSelectedBlockId('delivery')}>
                      <label className="text-label" style={{ display: 'block', marginBottom: '8px', marginTop: '4px' }}>Текст сообщения после оплаты</label>
                      <RichTextEditor
                        value={getBlock('delivery')?.content || ''}
                        onChange={(v) => updateBlock('delivery', 'content', v)}
                        placeholder="Спасибо за покупку!"
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
              background: theme === 'dark' ? '#0f0f0f' : '#e4eaf0', // TG default background tint
              backgroundImage: theme === 'dark' 
                ? 'radial-gradient(circle at 50% 0%, #1a1a24 0%, #0f0f0f 100%)' 
                : 'radial-gradient(circle at 50% 0%, #f0f4f8 0%, #e4eaf0 100%)',
              borderRadius: '44px',
              border: `10px solid ${theme === 'dark' ? '#18181b' : '#ffffff'}`,
              boxShadow: theme === 'dark' ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Header */}
            <div style={{
              background: theme === 'dark' ? 'rgba(24,24,27,0.85)' : 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
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
      </div>      {/* Fixed Bottom Action Bar — always visible */}
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
          {appState.activeBot && (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn btn-secondary"
              style={{ height: '40px', padding: '0 16px', color: 'var(--color-danger)' }}
            >
              Очистить базу
            </button>
          )}
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

      {createPortal(
        <AnimatePresence>
          {showConfirm && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowConfirm(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100000, backdropFilter: 'blur(4px)' }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10, x: '-50%' }} animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }} exit={{ opacity: 0, scale: 0.95, y: 10, x: '-50%' }}
                style={{
                  position: 'fixed', top: '50%', left: '50%', zIndex: 100001,
                  background: 'var(--color-surface)', width: '90%', maxWidth: '340px',
                  borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-float)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-danger-soft)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldAlert size={20} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-foreground)', margin: 0 }}>Очистить базу?</h3>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-foreground-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
                  Вы уверены, что хотите безвозвратно удалить базу лидов этого бота?
                  <br/><br/>
                  <span style={{ color: 'var(--color-danger)', fontSize: '13px', fontWeight: 500 }}>
                    Полное удаление базы пользователей сбросит счетчик юзеров и разблокирует смену токена.
                  </span>
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, height: '44px' }}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => {
                      if (appState.activeBot) appState.activeBot.usersCount = 0;
                      setShowConfirm(false);
                      setForceRender(prev => prev + 1);
                    }}
                    className="btn"
                    style={{ flex: 1, height: '44px', background: 'var(--color-danger)', color: '#fff', border: 'none' }}
                  >
                    Очистить
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
    </div>
  );
};
