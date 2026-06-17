import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { Layout, GitBranch, BarChart3, Settings, Zap, CreditCard, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

// Utility for Shadcn-like class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'builder' | 'flow' | 'stats' | 'settings'>('builder');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    WebApp.setHeaderColor('bg_color');
  }, []);

  const handlePay = () => {
    WebApp.HapticFeedback.impactOccurred('medium');
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsSubscribed(true);
      WebApp.HapticFeedback.notificationOccurred('success');
    }, 1500);
  };

  if (!isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-card p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="w-24 h-24 bg-gradient-to-br from-[#2ea6ff] to-[#7c5cff] rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/20"
        >
          <Zap size={40} color="white" />
        </motion.div>
        <h1 className="text-3xl font-black mb-3">Bot Father</h1>
        <p className="text-muted-foreground mb-10 max-w-xs">Ваша персональная империя ботов начинается здесь.</p>
        
        <div className="glass rounded-3xl p-6 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6 bg-muted p-4 rounded-2xl">
            <CreditCard className="text-primary" />
            <div className="text-left">
              <div className="font-bold">Bot Father PRO</div>
              <div className="text-xs text-muted-foreground">1500₽ / месяц</div>
            </div>
          </div>
          
          <button 
            onClick={handlePay}
            disabled={isPaying}
            className="w-full bg-gradient-to-r from-[#2ea6ff] to-[#7c5cff] text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 transition-transform active:scale-95 disabled:opacity-50 flex justify-center"
          >
            {isPaying ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Подписаться"}
          </button>
          <p className="text-[10px] text-muted-foreground mt-4">Нажимая кнопку, вы соглашаетесь с условиями оферты.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* SIDEBAR (Hidden on mobile by default, but let's make it responsive later. For TMA it's usually bottom tabs, but the user liked the mockup. We will use Bottom Tabs for mobile.) */}
      
      <main className="flex-1 flex flex-col h-full overflow-hidden pb-20 lg:pb-0">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="font-bold text-lg">
            {activeTab === 'builder' && 'Конструктор воронки'}
            {activeTab === 'flow' && 'Карта логики'}
            {activeTab === 'stats' && 'Аналитика прибыли'}
            {activeTab === 'settings' && 'Настройки'}
          </h2>
          <button className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-semibold">
            Опубликовать
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'builder' && (
              <motion.div key="builder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid lg:grid-cols-[1fr_320px] gap-6">
                <div className="flex flex-col gap-4">
                  <div className="glass p-6 rounded-3xl border-primary/30">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Шаг 1 · Старт</span>
                    </div>
                    <textarea 
                      className="w-full bg-input/50 border border-border rounded-2xl p-4 text-sm focus:border-primary/50 outline-none transition-colors" 
                      rows={3} 
                      defaultValue="Привет! Посмотри это видео и выбирай тариф👇"
                    />
                    <div className="mt-4 bg-muted/50 p-3 rounded-xl flex justify-between items-center">
                      <span className="font-semibold text-sm">💳 Купить курс</span>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                  
                  <button className="border-2 border-dashed border-border text-muted-foreground rounded-3xl p-6 font-semibold hover:border-primary/50 hover:text-primary transition-colors">
                    + Добавить блок
                  </button>
                </div>
                
                <div className="hidden lg:block">
                  <div className="sticky top-4 w-[320px] h-[640px] bg-black rounded-[40px] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden flex flex-col">
                     <div className="bg-[#0f0f0f] flex-1 p-4 flex flex-col justify-end bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover">
                        <div className="bg-[#212d3b] text-white p-3 rounded-2xl rounded-bl-sm max-w-[85%] text-sm mb-2 shadow-sm">
                          Привет! Посмотри это видео и выбирай тариф👇
                        </div>
                        <div className="bg-[#2ea6ff] text-white p-2.5 rounded-xl font-semibold text-sm text-center shadow-sm">
                          💳 Купить курс
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'flow' && (
              <motion.div key="flow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full min-h-[60vh] glass rounded-3xl relative overflow-hidden flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)]" style={{ backgroundSize: '24px 24px' }}>
                <div className="absolute top-1/4 left-1/4 bg-card border border-border p-4 rounded-2xl shadow-xl z-10 cursor-move">
                  <div className="font-bold text-sm">Старт</div>
                  <div className="text-xs text-muted-foreground">Сообщение</div>
                </div>
                <div className="absolute top-1/2 left-1/2 bg-card border-l-4 border-l-warning p-4 rounded-2xl shadow-xl z-10 cursor-move">
                  <div className="font-bold text-sm">Дожим 1</div>
                  <div className="text-xs text-muted-foreground">Через 1 час</div>
                </div>
                {/* SVG for connections would go here */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full">
                  <path d="M 30% 30% C 40% 30%, 40% 55%, 50% 55%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                </svg>
              </motion.div>
            )}

            {activeTab === 'stats' && (
               <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="glass p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border-primary/20">
                     <div className="text-xs text-muted-foreground mb-2">ВЫРУЧКА</div>
                     <div className="text-2xl font-black">154 820 ₽</div>
                     <div className="text-xs text-success mt-2">+18% за месяц</div>
                   </div>
                   <div className="glass p-6 rounded-3xl">
                     <div className="text-xs text-muted-foreground mb-2">ЛИДЫ</div>
                     <div className="text-2xl font-black">5 241</div>
                     <div className="text-xs text-primary mt-2">86 покупок</div>
                   </div>
                 </div>

                 <div className="glass p-6 rounded-3xl">
                   <h3 className="font-bold mb-6">Воронка конверсии</h3>
                   <div className="space-y-5">
                     <div>
                       <div className="flex justify-between text-sm mb-2">
                         <span>Старт</span>
                         <span className="font-bold">100%</span>
                       </div>
                       <div className="h-2 bg-muted rounded-full overflow-hidden">
                         <div className="h-full bg-primary w-full"></div>
                       </div>
                     </div>
                     <div>
                       <div className="flex justify-between text-sm mb-2">
                         <span>Дожим 1</span>
                         <span className="font-bold">42%</span>
                       </div>
                       <div className="h-2 bg-muted rounded-full overflow-hidden">
                         <div className="h-full bg-primary w-[42%]"></div>
                       </div>
                     </div>
                     <div>
                       <div className="flex justify-between text-sm mb-2">
                         <span>Успешная оплата</span>
                         <span className="font-bold text-success">1.6%</span>
                       </div>
                       <div className="h-2 bg-muted rounded-full overflow-hidden">
                         <div className="h-full bg-success w-[1.6%]"></div>
                       </div>
                     </div>
                   </div>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 w-full glass rounded-t-3xl border-b-0 pb-safe pt-2 px-6 flex justify-between items-center z-50 lg:hidden">
        {[
          { id: 'builder', icon: Layout, label: 'Редактор' },
          { id: 'flow', icon: GitBranch, label: 'Схема' },
          { id: 'stats', icon: BarChart3, label: 'Статс' },
          { id: 'settings', icon: Settings, label: 'Опции' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              WebApp.HapticFeedback.impactOccurred('light');
              setActiveTab(tab.id as any);
            }}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-colors",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            )}
          >
            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
