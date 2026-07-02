import { motion } from 'framer-motion';
import { 
  Bot, GitMerge, CreditCard, BarChart2, User, ChevronRight, HelpCircle,
  TrendingUp, Clock, AlertCircle, ArrowRight 
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip as ReChartsTooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import type { TabType, AppState, SheetType } from '../../types';

interface HomeProps {
  appState: AppState;
  setActiveTab: (tab: TabType) => void;
  setSheet: (sheet: SheetType) => void;
  onCreateBot: () => void;
}

const STATS_DATA = [
  { name: 'Пн', views: 400, sales: 24 },
  { name: 'Вт', views: 300, sales: 18 },
  { name: 'Ср', views: 600, sales: 45 },
  { name: 'Чт', views: 800, sales: 52 },
  { name: 'Пт', views: 500, sales: 38 },
  { name: 'Сб', views: 900, sales: 67 },
  { name: 'Вс', views: 700, sales: 50 },
];

export const Home = ({ appState, setActiveTab, setSheet, onCreateBot }: HomeProps) => {
  const hasBot = appState.activeBot !== null;
  const isSubscribed = appState.subscriptionStatus === 'active';

  // --- WELCOME SCREEN (Shown only if no bot exists) ---
  if (!hasBot) {
    return (
      <motion.div
        key="home-welcome"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="pb-12 max-w-5xl mx-auto px-4 md:px-0"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2 flex items-center gap-2">
            Добро пожаловать! 👋
          </h1>
          <p className="text-[15px] text-[var(--color-foreground-secondary)] max-w-xl">
            Создайте своего первого бота и начните автоматизировать процессы и принимать платежи.
          </p>
        </div>

        {/* Main Banner */}
        <div className="card relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 mb-10 p-8">
          {/* Decorative background blobs */}
          <div className="absolute -top-24 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'var(--color-primary)', opacity: 0.1 }} />
          <div className="absolute -bottom-16 right-48 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'var(--color-accent)', opacity: 0.1 }} />
          
          <div className="relative z-10 max-w-md">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">
              У вас пока нет ботов
            </h2>
            <p className="text-[15px] text-[var(--color-foreground-secondary)] mb-8">
              Создайте своего первого бота в пару кликов и настройте воронки, приём платежей и автоматические сценарии.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button 
                onClick={onCreateBot}
                className="btn btn-primary w-full sm:w-auto px-6 py-3"
              >
                Создать первого бота
              </button>
              <button className="btn btn-secondary w-full sm:w-auto px-6 py-3">
                Узнать больше
              </button>
            </div>
          </div>

          {/* Robot Image Container (Enlarged) */}
          <div className="relative z-10 hidden md:block h-64 w-64 flex-shrink-0">
            <img 
              src="/welcome_robot.png" 
              alt="Welcome Robot" 
              className="w-full h-full object-contain drop-shadow-2xl scale-[1.3] transform translate-y-2 translate-x-4" 
            />
          </div>
        </div>

        {/* Your Tariff Section */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4">Ваш тариф</h3>
          <div className="card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--color-surface-2)' }}>
                <User size={28} style={{ color: 'var(--color-foreground-tertiary)' }} />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-[var(--color-foreground)] mb-1">Не выбран</h4>
                <p className="text-[13px] text-[var(--color-foreground-secondary)]">
                  Вы не выбрали тариф. Создайте бота или выберите подписку PRO.
                </p>
              </div>
            </div>
            
            <div className="flex-1 w-full rounded-xl p-4 border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <div className="flex justify-between items-center mb-2 pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[13px] font-medium text-[var(--color-foreground)]">Ботов</span>
                <span className="text-[14px] font-bold text-[var(--color-foreground)]">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-[var(--color-foreground)]">Активных ботов</span>
                <span className="text-[14px] font-bold text-[var(--color-foreground)]">0</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('subscription')}
              className="btn btn-secondary w-full md:w-auto shrink-0 px-6 py-2.5"
            >
              Выбрать тариф
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4">Что можно сделать прямо сейчас</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Action 1 */}
            <div className="card group cursor-pointer p-5 flex flex-col h-full" onClick={() => setActiveTab('build')}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                <Bot size={24} />
              </div>
              <h4 className="text-[15px] font-bold text-[var(--color-foreground)] mb-2">Создать бота</h4>
              <p className="text-[13px] text-[var(--color-foreground-secondary)] mb-4 flex-1">
                Подключите Telegram бота и настройте его за пару минут.
              </p>
              <div className="flex items-center gap-1.5 text-[13px] font-bold mt-auto" style={{ color: 'var(--color-primary)' }}>
                Создать <ChevronRight size={16} />
              </div>
            </div>

            {/* Action 2 */}
            <div className="card group cursor-pointer p-5 flex flex-col h-full" onClick={() => setActiveTab('build')}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'var(--color-success-soft)', color: 'var(--color-success)' }}>
                <GitMerge size={24} />
              </div>
              <h4 className="text-[15px] font-bold text-[var(--color-foreground)] mb-2">Настроить воронку</h4>
              <p className="text-[13px] text-[var(--color-foreground-secondary)] mb-4 flex-1">
                Создайте сценарий общения и автоматизируйте процессы.
              </p>
              <div className="flex items-center gap-1.5 text-[13px] font-bold mt-auto" style={{ color: 'var(--color-success)' }}>
                Настроить <ChevronRight size={16} />
              </div>
            </div>

            {/* Action 3 */}
            <div className="card group cursor-pointer p-5 flex flex-col h-full" onClick={() => setActiveTab('subscription')}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'var(--color-warning-soft)', color: 'var(--color-warning)' }}>
                <CreditCard size={24} />
              </div>
              <h4 className="text-[15px] font-bold text-[var(--color-foreground)] mb-2">Принимать платежи</h4>
              <p className="text-[13px] text-[var(--color-foreground-secondary)] mb-4 flex-1">
                Подключите приём платежей и начните зарабатывать без комиссии.
              </p>
              <div className="flex items-center gap-1.5 text-[13px] font-bold mt-auto" style={{ color: 'var(--color-warning)' }}>
                Подключить <ChevronRight size={16} />
              </div>
            </div>

            {/* Action 4 */}
            <div className="card group cursor-pointer p-5 flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}>
                <BarChart2 size={24} />
              </div>
              <h4 className="text-[15px] font-bold text-[var(--color-foreground)] mb-2">Смотреть аналитику</h4>
              <p className="text-[13px] text-[var(--color-foreground-secondary)] mb-4 flex-1">
                Отслеживайте статистику и улучшайте результаты своего бота.
              </p>
              <div className="flex items-center gap-1.5 text-[13px] font-bold mt-auto" style={{ color: 'var(--color-accent)' }}>
                Подробнее <ChevronRight size={16} />
              </div>
            </div>

          </div>
        </div>

        {/* Help Banner - using warning semantic colors */}
        <div className="rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm group transition-colors" style={{ background: 'var(--color-warning-soft)', border: '1px solid rgba(255, 149, 0, 0.2)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-warning-soft)', color: 'var(--color-warning)' }}>
              <HelpCircle size={24} strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-[15px] font-bold mb-0.5" style={{ color: 'var(--color-warning)' }}>
                Нужна помощь?
              </h4>
              <p className="text-[13px]" style={{ color: 'var(--color-foreground-secondary)' }}>
                Мы подготовили подробные инструкции и ответы на частые вопросы.
              </p>
            </div>
          </div>
          <button className="btn btn-secondary shrink-0 px-6 py-2.5 w-full md:w-auto border" style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}>
            Перейти в базу знаний
          </button>
        </div>
      </motion.div>
    );
  }

  // --- DASHBOARD SCREEN (Shown if user has a bot) ---
  return (
    <motion.div
      key="home-dashboard"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="space-y-6 pb-8"
    >
      {/* Subscription banner */}
      {!isSubscribed && (
        <div
          className="flex items-center justify-between gap-4 p-4 rounded-[var(--radius-md)]"
          style={{
            background: 'var(--color-warning-soft)',
            border: '1px solid rgba(229,150,63,0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-foreground)' }}>
                {appState.subscriptionStatus === 'expired' ? 'Подписка истекла — боты остановлены' : 'Оформите PRO подписку'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-foreground-secondary)', marginTop: '2px' }}>
                Подписка нужна для публикации воронок и приёма платежей
              </div>
            </div>
          </div>
          <button
            onClick={() => setSheet(appState.subscriptionStatus === 'expired' ? 'billing_renew' : 'checkout')}
            className="btn btn-primary"
            style={{ height: '36px', fontSize: '13px', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {appState.subscriptionStatus === 'expired' ? 'Продлить' : 'Оформить'}
          </button>
        </div>
      )}

      {/* Revenue + CTA */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-foreground-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Выручка за месяц
        </div>
        <div className="text-kpi" style={{ marginBottom: '4px' }}>
          154 820 ₽
        </div>
        <div className="flex items-center gap-1.5" style={{ marginBottom: '20px' }}>
          <TrendingUp size={14} style={{ color: 'var(--color-success)' }} />
          <span style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: 500 }}>
            +18.4% к прошлому месяцу
          </span>
        </div>
        <button
          onClick={() => setActiveTab('build')}
          className="btn btn-action"
          style={{ height: '40px' }}
        >
          Редактировать воронку
          <ArrowRight size={15} />
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Лиды', value: '1 240' },
          { label: 'Конверсия', value: '11.4%' },
          { label: 'Продажи', value: '86' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--color-foreground)', fontVariantNumeric: 'tabular-nums', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-foreground-tertiary)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-foreground)' }}>Активность</span>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }} />
              <span style={{ fontSize: '12px', color: 'var(--color-foreground-secondary)' }}>Просмотры</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)' }} />
              <span style={{ fontSize: '12px', color: 'var(--color-foreground-secondary)' }}>Продажи</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={STATS_DATA}>
            <defs>
              <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E9ADB" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#2E9ADB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#30B56B" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#30B56B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--color-foreground-tertiary)" fontSize={11} axisLine={false} tickLine={false} dy={8} />
            <YAxis hide />
            <ReChartsTooltip
              contentStyle={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px', boxShadow: 'var(--shadow-float)', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="views" stroke="#2E9ADB" strokeWidth={1.5} fillOpacity={1} fill="url(#gViews)" />
            <Area type="monotone" dataKey="sales" stroke="#30B56B" strokeWidth={1.5} fillOpacity={1} fill="url(#gSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Events */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '16px' }}>
          <Clock size={15} style={{ color: 'var(--color-foreground-tertiary)' }} />
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-foreground)' }}>События</span>
        </div>
        <div>
          {[
            { title: 'Платёж принят', desc: '@ivanov оплатил доступ', time: '2 мин назад', dot: 'success' },
            { title: 'Новый лид', desc: 'Вход через рекламную ссылку', time: '15 мин назад', dot: 'primary' },
            { title: 'Дожим отправлен', desc: 'Доставлен 156 пользователям', time: '1 час назад', dot: 'warning' },
          ].map((ev, i) => (
            <div
              key={i}
              className="card-row flex items-start gap-3"
              style={{ paddingTop: i === 0 ? 0 : '14px' }}
            >
              <div
                className="status-dot mt-1.5 shrink-0"
                style={{
                  background: ev.dot === 'success' ? 'var(--color-success)' : ev.dot === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)',
                }}
              />
              <div className="flex-1">
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-foreground)' }}>{ev.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--color-foreground-secondary)', marginTop: '2px' }}>{ev.desc}</div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-foreground-tertiary)', whiteSpace: 'nowrap', marginTop: '2px' }}>{ev.time}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
