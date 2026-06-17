import { useState, useEffect, useMemo } from 'react';
import WebApp from '@twa-dev/sdk';
import { 
  Layout, 
  GitBranch, 
  BarChart3, 
  Settings, 
  Zap, 
  CreditCard, 
  ChevronRight, 
  Plus, 
  Play, 
  Bell, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  ExternalLink,
  ArrowRight,
  Monitor
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ReChartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Utility for Shadcn-like class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Data Types ---
interface FunnelNode {
  id: string;
  step: string;
  subtitle: string;
  delay: string;
  kind: 'message' | 'reminder' | 'delivery';
  content: string;
  buttonText: string;
  x: number;
  y: number;
}

const INITIAL_BLOCKS: FunnelNode[] = [
  {
    id: 'start',
    step: 'Старт',
    subtitle: 'Первое касание',
    delay: '0 мин',
    kind: 'message',
    content: 'Привет! Посмотри это видео про нашу воронку и начни зарабатывать уже сегодня! 👇',
    buttonText: '🚀 Купить курс',
    x: 100,
    y: 100
  },
  {
    id: 'push1',
    step: 'Дожим 1',
    subtitle: 'Напоминание',
    delay: '1 час',
    kind: 'reminder',
    content: 'Ты посмотрел видео, но не решился. Мы дарим тебе скидку 20% на первые 24 часа! 🎁',
    buttonText: '💳 Забрать скидку',
    x: 400,
    y: 250
  },
  {
    id: 'delivery',
    step: 'Выдача',
    subtitle: 'Финальный шаг',
    delay: 'Мгновенно',
    kind: 'delivery',
    content: 'Поздравляем! Оплата прошла успешно. Вот твои материалы курса. Удачи! 📚',
    buttonText: '📂 Открыть доступ',
    x: 700,
    y: 100
  }
];

const STATS_DATA = [
  { name: 'Пн', views: 400, sales: 24 },
  { name: 'Вт', views: 300, sales: 18 },
  { name: 'Ср', views: 600, sales: 45 },
  { name: 'Чт', views: 800, sales: 52 },
  { name: 'Пт', views: 500, sales: 38 },
  { name: 'Сб', views: 900, sales: 67 },
  { name: 'Вс', views: 700, sales: 50 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'builder' | 'flow' | 'stats' | 'settings'>('overview');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [blocks, setBlocks] = useState<FunnelNode[]>(INITIAL_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('start');

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    WebApp.setHeaderColor('bg_color');
  }, []);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || blocks[0];

  const handlePay = () => {
    WebApp.HapticFeedback.impactOccurred('medium');
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsSubscribed(true);
      WebApp.HapticFeedback.notificationOccurred('success');
    }, 1500);
  };

  const updateBlock = (id: string, field: keyof FunnelNode, value: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const flowNodes: Node[] = useMemo(() => blocks.map(block => ({
    id: block.id,
    data: { label: block.step },
    position: { x: block.x, y: block.y },
    className: cn(
      "p-4 rounded-2xl border-2 shadow-lg w-40 text-center font-bold",
      block.kind === 'message' ? "bg-primary/10 border-primary text-primary" : 
      block.kind === 'reminder' ? "bg-warning/10 border-warning text-warning" : 
      "bg-success/10 border-success text-success"
    )
  })), [blocks]);

  const flowEdges: Edge[] = useMemo(() => [
    { id: 'e1-2', source: 'start', target: 'push1', animated: true, label: 'через 1 час', style: { stroke: '#fbbf24' } },
    { id: 'e1-3', source: 'start', target: 'delivery', label: 'оплата', style: { stroke: '#36d399' } },
  ], []);

  if (!isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-card p-6 text-center overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="w-24 h-24 bg-gradient-to-br from-[#2ea6ff] to-[#7c5cff] rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 relative"
        >
          <Zap size={40} color="white" fill="white" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/30 rounded-3xl blur-xl"
          />
        </motion.div>
        <h1 className="text-4xl font-black mb-3 tracking-tight">Bot Father</h1>
        <p className="text-muted-foreground mb-10 max-w-xs leading-relaxed">
          Ваша персональная империя ботов начинается здесь. Конструктор, воронки, платежи.
        </p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-[32px] p-8 w-full max-w-sm border-white/5"
        >
          <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <CreditCard />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">PRO Доступ</div>
              <div className="text-sm text-muted-foreground font-medium">1500₽ / месяц</div>
            </div>
          </div>
          
          <button 
            onClick={handlePay}
            disabled={isPaying}
            className="group relative w-full bg-gradient-to-r from-[#2ea6ff] to-[#7c5cff] text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
              {isPaying ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <>Подписаться <ArrowRight size={20} /></>}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
          </button>
          <p className="text-[10px] text-muted-foreground mt-4 font-medium opacity-60">
            Нажимая кнопку, вы принимаете условия публичной оферты и политики конфиденциальности.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 border-r border-border bg-card/30 flex-col p-6 gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap size={20} color="white" fill="white" />
          </div>
          <h2 className="font-black text-xl tracking-tight">Bot Father</h2>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {[
            { id: 'overview', icon: Monitor, label: 'Обзор', desc: 'Сводка и метрики' },
            { id: 'builder', icon: Layout, label: 'Конструктор', desc: 'Редактор блоков' },
            { id: 'flow', icon: GitBranch, label: 'Схема', desc: 'Логика воронки' },
            { id: 'stats', icon: BarChart3, label: 'Аналитика', desc: 'Прибыль и конверсия' },
            { id: 'settings', icon: Settings, label: 'Настройки', desc: 'Аккаунт и API' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group text-left",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                activeTab === item.id ? "bg-white/20" : "bg-muted group-hover:bg-white/10"
              )}>
                <item.icon size={20} />
              </div>
              <div>
                <div className="font-bold text-sm">{item.label}</div>
                <div className={cn("text-[10px]", activeTab === item.id ? "text-white/70" : "text-muted-foreground")}>{item.desc}</div>
              </div>
            </button>
          ))}
        </nav>

        <div className="glass p-5 rounded-3xl border-primary/10">
          <div className="text-xs font-bold text-primary mb-1">PRO ПЛАН</div>
          <div className="text-[10px] text-muted-foreground leading-relaxed mb-4">
            Обновляется 24 июля 2026. <br/>Все функции разблокированы.
          </div>
          <button className="w-full bg-primary/10 text-primary font-bold py-2.5 rounded-xl text-xs hover:bg-primary hover:text-white transition-colors">
            Опубликовать
          </button>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col h-full overflow-hidden pb-20 lg:pb-0">
        <header className="h-16 lg:h-20 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="font-black text-xl lg:text-2xl tracking-tight">
            {activeTab === 'overview' && 'Обзор аккаунта'}
            {activeTab === 'builder' && 'Конструктор воронки'}
            {activeTab === 'flow' && 'Карта логики'}
            {activeTab === 'stats' && 'Аналитика прибыли'}
            {activeTab === 'settings' && 'Настройки'}
          </h2>
          <div className="flex items-center gap-3">
             <button className="hidden sm:flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-xl text-sm font-bold border border-border hover:bg-white/10 transition-colors">
               <Play size={16} fill="currentColor" /> Тест
             </button>
             <button className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
               Сохранить
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                   <div className="md:col-span-2 glass p-8 rounded-[40px] relative overflow-hidden flex flex-col justify-center min-h-[240px]">
                      <div className="relative z-10">
                        <span className="bg-success/10 text-success text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-success/20 mb-4 inline-block">
                          Система активна
                        </span>
                        <h3 className="text-3xl lg:text-4xl font-black mb-4 leading-tight">Ваш бот приносит <br/><span className="text-primary">154 820 ₽</span> в месяц</h3>
                        <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-6">
                          Воронка "NovaFlow" показывает отличные результаты. Конверсия из видео в оплату выросла на 12% за неделю.
                        </p>
                        <div className="flex gap-3">
                          <button onClick={() => setActiveTab('builder')} className="bg-foreground text-background px-6 py-3 rounded-2xl text-sm font-bold hover:scale-105 transition-transform">
                            Редактировать воронку
                          </button>
                        </div>
                      </div>
                      <div className="absolute right-[-20%] bottom-[-20%] w-80 h-80 bg-primary/20 rounded-full blur-[80px]" />
                   </div>
                   
                   <div className="glass p-8 rounded-[40px] border-primary/20 flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                          <TrendingUp size={24} />
                        </div>
                        <h4 className="font-bold text-lg mb-1">Статистика</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">За последние 7 дней ваш бот обработал 1,240 лидов.</p>
                      </div>
                      <div className="mt-8 space-y-4">
                        <div className="flex justify-between items-end">
                           <div className="text-2xl font-black">11.4%</div>
                           <div className="text-xs text-success font-bold">+2.1%</div>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-primary" />
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Конверсия в продажу</div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   {[
                     { label: 'Просмотры', value: '5,241', color: 'primary', icon: Users },
                     { label: 'Клики', value: '1,173', color: 'primary', icon: Zap },
                     { label: 'Продажи', value: '86', color: 'success', icon: ShoppingBag },
                     { label: 'Средний чек', value: '1,802 ₽', color: 'success', icon: CreditCard },
                   ].map((stat, i) => (
                     <div key={i} className="glass p-5 rounded-3xl border-white/5">
                        <div className="flex justify-between items-start mb-3">
                           <div className={cn("p-2 rounded-xl bg-opacity-10", `bg-${stat.color}`, `text-${stat.color}`)}>
                             <stat.icon size={18} />
                           </div>
                           <div className="text-[10px] text-success font-bold">+12%</div>
                        </div>
                        <div className="text-xl font-black mb-1">{stat.value}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</div>
                     </div>
                   ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass p-8 rounded-[40px]">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold flex items-center gap-2"><Clock size={18} className="text-primary" /> История событий</h4>
                      <button className="text-[10px] font-bold text-primary hover:underline">ВСЕ СОБЫТИЯ</button>
                    </div>
                    <div className="space-y-6">
                      {[
                        { title: 'Платеж успешно принят', desc: 'Пользователь @ivanov оплатил доступ к курсу.', time: '2 мин назад', status: 'success' },
                        { title: 'Новый лид в воронке', desc: 'Зафиксирован вход через рекламную ссылку.', time: '15 мин назад', status: 'info' },
                        { title: 'Дожим отправлен', desc: 'Блок "Дожим 1" доставлен 156 пользователям.', time: '1 час назад', status: 'warning' },
                      ].map((event, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className={cn("w-1.5 h-1.5 rounded-full mt-2 shrink-0", 
                            event.status === 'success' ? "bg-success shadow-[0_0_8px_rgba(54,211,153,0.5)]" : 
                            event.status === 'warning' ? "bg-warning shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "bg-primary shadow-[0_0_8px_rgba(46,166,255,0.5)]"
                          )} />
                          <div>
                            <div className="text-sm font-bold group-hover:text-primary transition-colors">{event.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{event.desc}</div>
                            <div className="text-[10px] text-muted-foreground/50 mt-2 font-medium uppercase">{event.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="glass p-8 rounded-[40px] bg-gradient-to-br from-primary/5 to-transparent">
                     <h4 className="font-bold mb-2">Быстрый старт</h4>
                     <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Следуйте этим шагам, чтобы максимизировать прибыль вашего бота.</p>
                     <div className="space-y-3">
                        {[
                          { text: 'Подключите ЮKassa для приема оплат', done: true },
                          { text: 'Добавьте видео-презентацию в первый блок', done: true },
                          { text: 'Настройте дожим через 24 часа', done: false },
                          { text: 'Проверьте работу Webhook', done: true },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                            {item.done ? <CheckCircle2 size={18} className="text-success" /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-muted-foreground/30" />}
                            <span className={cn("text-xs font-medium", item.done ? "text-foreground" : "text-muted-foreground")}>{item.text}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'builder' && (
              <motion.div key="builder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid lg:grid-cols-[1fr_400px] gap-8 h-full">
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                     <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Цепочка сообщений</div>
                     <button className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-xl text-xs font-black hover:bg-primary hover:text-white transition-all">
                       <Plus size={14} strokeWidth={3} /> ДОБАВИТЬ ШАГ
                     </button>
                  </div>

                  <div className="space-y-4">
                    {blocks.map((block, idx) => (
                      <motion.div 
                        key={block.id}
                        layout
                        onClick={() => setSelectedBlockId(block.id)}
                        className={cn(
                          "glass p-6 rounded-[32px] cursor-pointer transition-all duration-300 border-2",
                          selectedBlockId === block.id ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-2xl" : "border-white/5 hover:border-white/10"
                        )}
                      >
                        <div className="flex justify-between items-center mb-4">
                           <div className="flex items-center gap-3">
                              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner",
                                block.kind === 'message' ? "bg-primary text-white" : 
                                block.kind === 'reminder' ? "bg-warning text-black" : "bg-success text-white"
                              )}>
                                {idx + 1}
                              </div>
                              <div>
                                <div className="font-bold text-sm">{block.step}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{block.subtitle}</div>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                             <Clock size={12} className="text-muted-foreground" />
                             <span className="text-[10px] font-bold text-muted-foreground">{block.delay}</span>
                           </div>
                        </div>
                        
                        <div className="relative group">
                          <textarea 
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm focus:border-primary/50 focus:bg-white/10 outline-none transition-all resize-none mb-4 leading-relaxed h-24"
                          />
                          <div className="absolute right-3 bottom-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                             <span className="text-[10px] text-muted-foreground font-mono">{block.content.length} chars</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                               <CreditCard size={14} />
                             </div>
                             <input 
                               value={block.buttonText}
                               onChange={(e) => updateBlock(block.id, 'buttonText', e.target.value)}
                               className="bg-transparent border-none outline-none font-bold text-sm w-full"
                             />
                           </div>
                           <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="hidden lg:block">
                  <div className="sticky top-8 w-full">
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 px-4">Live Preview</div>
                    <div className="relative mx-auto w-[320px] h-[640px] bg-black rounded-[50px] border-[10px] border-[#1a1a1a] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
                       {/* Phone Top Bar */}
                       <div className="h-8 bg-black flex items-center justify-between px-8 text-[10px] text-white font-bold pt-2">
                          <span>9:41</span>
                          <div className="flex gap-1.5">
                             <div className="w-4 h-2 bg-white rounded-[2px]" />
                          </div>
                       </div>
                       
                       {/* Telegram Header */}
                       <div className="bg-[#17212b] p-3 flex items-center gap-3 border-b border-black/20">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-black text-xs">BF</div>
                          <div>
                            <div className="text-white text-xs font-bold leading-none">NovaFlow Bot</div>
                            <div className="text-primary text-[10px] mt-1 font-medium">bot</div>
                          </div>
                       </div>

                       <div className="bg-[#0e1621] flex-1 p-4 flex flex-col justify-end bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover relative">
                          <div className="absolute inset-0 bg-black/40" />
                          <AnimatePresence mode="wait">
                            <motion.div 
                              key={selectedBlockId}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="relative z-10 space-y-3"
                            >
                               <div className="bg-[#182533] text-white p-4 rounded-[22px] rounded-bl-sm max-w-[90%] text-[13px] shadow-lg border border-white/5 leading-relaxed">
                                 {selectedBlock.content}
                               </div>
                               <motion.div 
                                 whileTap={{ scale: 0.95 }}
                                 className="bg-primary text-white p-3.5 rounded-[18px] font-black text-sm text-center shadow-lg shadow-primary/30 cursor-pointer"
                               >
                                 {selectedBlock.buttonText}
                               </motion.div>
                            </motion.div>
                          </AnimatePresence>
                       </div>
                       
                       {/* Phone Bottom Bar */}
                       <div className="h-12 bg-[#17212b] flex items-center px-4 gap-3">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white">📎</div>
                          <div className="flex-1 h-8 bg-black/20 rounded-full border border-white/5" />
                          <div className="w-6 h-6 text-primary">💬</div>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'flow' && (
              <motion.div key="flow" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full min-h-[70vh] glass rounded-[40px] relative overflow-hidden border-white/5 bg-[#0a0d12]">
                <ReactFlow 
                  nodes={flowNodes} 
                  edges={flowEdges} 
                  fitView
                  onNodeClick={(_, node) => {
                    WebApp.HapticFeedback.impactOccurred('light');
                    setSelectedBlockId(node.id);
                  }}
                >
                  <Background color="#ffffff" gap={20} size={1} opacity={0.05} />
                  <Controls className="bg-card border-border fill-foreground" />
                  <MiniMap nodeStrokeWidth={3} className="bg-card border-border" maskColor="rgba(0,0,0,0.5)" />
                </ReactFlow>
                <div className="absolute bottom-6 left-6 flex gap-4">
                   <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2 border-white/10">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Контент</span>
                   </div>
                   <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2 border-white/10">
                      <div className="w-3 h-3 rounded-full bg-warning" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Дожим</span>
                   </div>
                   <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2 border-white/10">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Успех</span>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'stats' && (
               <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass p-8 rounded-[40px] bg-gradient-to-br from-primary/20 to-transparent border-primary/20 flex flex-col justify-between">
                       <div>
                         <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Выручка месяца</div>
                         <div className="text-4xl font-black mb-2 tracking-tighter">154 820 ₽</div>
                       </div>
                       <div className="text-xs text-success font-bold flex items-center gap-1">
                         <TrendingUp size={14} /> +18.4% к прошлому
                       </div>
                    </div>
                    {[
                      { label: 'Новые лиды', value: '1,240', change: '+24%', color: 'primary' },
                      { label: 'Конверсия', value: '11.4%', change: '+1.2%', color: 'success' },
                      { label: 'ROI', value: '412%', change: '+35%', color: 'primary' },
                    ].map((stat, i) => (
                      <div key={i} className="glass p-8 rounded-[40px] border-white/5 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">{stat.label}</div>
                          <div className="text-3xl font-black mb-2 tracking-tighter">{stat.value}</div>
                        </div>
                        <div className={cn("text-xs font-bold", stat.color === 'success' ? "text-success" : "text-primary")}>
                          {stat.change} за неделю
                        </div>
                      </div>
                    ))}
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-[40px] h-[400px] border-white/5">
                      <h4 className="font-bold mb-8 flex justify-between items-center">
                        График активности
                        <div className="flex gap-2">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold"><div className="w-2 h-2 rounded-full bg-primary" /> ПРОСМОТРЫ</div>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold"><div className="w-2 h-2 rounded-full bg-success" /> ПРОДАЖИ</div>
                        </div>
                      </h4>
                      <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={STATS_DATA}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2ea6ff" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#2ea6ff" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#36d399" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#36d399" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="#95a0b8" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                          <YAxis stroke="#95a0b8" fontSize={10} axisLine={false} tickLine={false} />
                          <ReChartsTooltip 
                            contentStyle={{ backgroundColor: '#131821', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="views" stroke="#2ea6ff" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                          <Area type="monotone" dataKey="sales" stroke="#36d399" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="glass p-8 rounded-[40px] border-white/5">
                      <h4 className="font-bold mb-8">Воронка конверсии</h4>
                      <div className="space-y-8">
                        {[
                          { label: 'Старт воронки', value: '5,241', pct: 100, color: 'primary' },
                          { label: 'Клик по кнопке', value: '1,173', pct: 42, color: 'primary' },
                          { label: 'Дожим 1', value: '408', pct: 28, color: 'warning' },
                          { label: 'Успешная оплата', value: '86', pct: 1.6, color: 'success' },
                        ].map((step, i) => (
                          <div key={i} className="space-y-3">
                            <div className="flex justify-between items-end">
                              <div>
                                <div className="text-sm font-bold">{step.label}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{step.value} пользователей</div>
                              </div>
                              <div className={cn("text-xl font-black", `text-${step.color}`)}>{step.pct}%</div>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${step.pct}%` }} 
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={cn("h-full shadow-lg", 
                                  step.color === 'primary' ? "bg-gradient-to-r from-primary to-primary/60" : 
                                  step.color === 'warning' ? "bg-gradient-to-r from-warning to-warning/60" : "bg-gradient-to-r from-success to-success/60"
                                )} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
               </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
                <div className="glass p-8 rounded-[40px] border-white/5">
                   <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 rounded-[32px] bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary/20">Р</div>
                      <div>
                         <h3 className="text-2xl font-black mb-1">Родион</h3>
                         <p className="text-muted-foreground text-sm">NovaFlow Studio · Владелец</p>
                         <div className="flex gap-2 mt-3">
                            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/20 uppercase tracking-widest">ADMIN</span>
                            <span className="bg-success/10 text-success text-[10px] font-black px-3 py-1 rounded-full border border-success/20 uppercase tracking-widest">VERIFIED</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-[28px] bg-white/5 border border-white/5">
                         <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Email аккаунта</div>
                         <div className="font-bold text-sm">rodion@novaflow.app</div>
                      </div>
                      <div className="p-5 rounded-[28px] bg-white/5 border border-white/5">
                         <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Telegram ID</div>
                         <div className="font-bold text-sm">123456789</div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-[40px] border-white/5">
                    <h4 className="font-bold mb-6 flex items-center gap-2"><CreditCard size={18} className="text-primary" /> Подписка</h4>
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-[32px] mb-6">
                       <div className="text-xs font-black text-primary uppercase tracking-widest mb-1">Текущий тариф</div>
                       <div className="text-2xl font-black mb-4">PRO Annual</div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground font-medium">Следующее списание:</span>
                          <span className="font-bold">24 июля 2026</span>
                       </div>
                    </div>
                    <button className="w-full bg-white text-black font-black py-4 rounded-2xl text-sm hover:scale-[1.02] active:scale-95 transition-transform shadow-xl">
                      УПРАВЛЯТЬ ПОДПИСКОЙ
                    </button>
                  </div>

                  <div className="glass p-8 rounded-[40px] border-white/5">
                    <h4 className="font-bold mb-6 flex items-center gap-2"><Zap size={18} className="text-primary" /> Интеграции</h4>
                    <div className="space-y-3">
                       {[
                         { name: 'ЮKassa', status: 'Активно', active: true },
                         { name: 'Prodamus', status: 'Отключено', active: false },
                         { name: 'S3 Storage', status: 'Активно', active: true },
                         { name: 'Webhooks', status: 'Активно', active: true },
                       ].map((int, i) => (
                         <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                            <span className="text-xs font-bold">{int.name}</span>
                            <div className="flex items-center gap-2">
                               <span className={cn("text-[10px] font-black uppercase tracking-widest", int.active ? "text-success" : "text-muted-foreground")}>{int.status}</span>
                               <div className={cn("w-1.5 h-1.5 rounded-full", int.active ? "bg-success shadow-[0_0_8px_rgba(54,211,153,0.5)]" : "bg-muted-foreground/30")} />
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="glass p-8 rounded-[40px] border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                   <div className="text-center md:text-left">
                      <h4 className="font-bold mb-1">API Ключи</h4>
                      <p className="text-xs text-muted-foreground">Используйте ключи для интеграции с внешними сервисами.</p>
                   </div>
                   <button className="flex items-center gap-2 bg-muted-foreground/10 text-foreground border border-white/10 px-6 py-3 rounded-2xl text-xs font-black hover:bg-white/10 transition-all">
                      СГЕНЕРИРОВАТЬ КЛЮЧ <ExternalLink size={14} />
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 w-full glass rounded-t-[32px] border-b-0 pb-safe pt-2 px-6 flex justify-between items-center z-50 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        {[
          { id: 'overview', icon: Monitor, label: 'Обзор' },
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
              "flex flex-col items-center gap-1.5 p-3 transition-all duration-300 relative",
              activeTab === tab.id ? "text-primary scale-110" : "text-muted-foreground/60 hover:text-muted-foreground"
            )}
          >
            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
