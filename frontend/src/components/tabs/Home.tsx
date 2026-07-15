
import { motion } from "framer-motion";
import {
  Bot,
  CreditCard,
  BarChart2,
  User,
  Clock,
  ArrowRight,
  Plus,
  GitMerge
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReChartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useAppState } from "../../providers/AppStateProvider";

import { STATS_DATA } from "../../mockData";
// Features list (honest, explaining why it is great)
const FEATURES = [
  {
    title: "Визуальный конструктор воронок",
    desc: "Проектируйте путь клиента в наглядном редакторе. Соединяйте блоки приветствия, предложений и выдачи контента без программирования.",
    icon: <GitMerge size={22} />,
    color: "var(--color-primary)",
    colorSoft: "var(--color-primary-soft)",
  },
  {
    title: "Автоматические дожимы (Follow-ups)",
    desc: "Возвращайте пользователей, которые остановились на полпути. Система автоматически отправит напоминание или спецпредложение через заданное время.",
    icon: <Clock size={22} />,
    color: "var(--color-success)",
    colorSoft: "var(--color-success-soft)",
  },
  {
    title: "Приём платежей прямо в боте",
    desc: "Интегрируйте ЮKassa, Robokassa или Prodamus в 2 клика. Продавайте цифровые товары, подписки или услуги с мгновенной фиксацией оплаты.",
    icon: <CreditCard size={22} />,
    color: "var(--color-accent)",
    colorSoft: "var(--color-accent-soft)",
  },
  {
    title: "Реальная аналитика продаж",
    desc: "Следите за показателями в реальном времени. Графики просмотров, статистика переходов и воронка конверсии помогут оптимизировать продажи.",
    icon: <BarChart2 size={22} />,
    color: "#F59E0B",
    colorSoft: "rgba(245,158,11,0.1)",
  },
];

// Start steps
const START_STEPS = [
  {
    num: "1",
    title: "Создайте бота в Telegram",
    desc: "Откройте официального @BotFather, нажмите /newbot и скопируйте выданный API-токен. Это займёт меньше минуты.",
    icon: <Bot size={20} />,
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
    darkGradient: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.05) 100%)"
  },
  {
    num: "2",
    title: "Подключите к платформе",
    desc: "Вставьте токен в нашей панели. Бот моментально оживёт и будет готов к настройке логики и воронок.",
    icon: <GitMerge size={20} />,
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
    darkGradient: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(139,92,246,0.05) 100%)"
  },
  {
    num: "3",
    title: "Настройте воронку продаж",
    desc: "Соберите цепочку сообщений: добавьте текст, медиа и кнопки. Настройте таймеры для автоматических дожимов.",
    icon: <User size={20} />,
    color: "#EC4899",
    gradient: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)",
    darkGradient: "linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0.05) 100%)"
  },
  {
    num: "4",
    title: "Начните принимать оплаты",
    desc: "Подключите ЮKassa или Robokassa в пару кликов и получайте деньги напрямую на ваш счёт. Готово к запуску трафика!",
    icon: <CreditCard size={20} />,
    color: "#10B981",
    gradient: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
    darkGradient: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.05) 100%)"
  },
];

export const Home = () => {
  const { appState, setActiveTab, handleCreateBotClick: onCreateBot } = useAppState();
  const hasBot = appState.activeBot !== null;
  const isSubscribed = appState.subscriptionStatus === "active";

  // --- WELCOME SCREEN (no bot yet) ---
  if (!hasBot) {
    return (
      <motion.div
        key="home-welcome"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        className="w-full space-y-8 md:space-y-12 pb-6"
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        
        {/* Purchased Slots Banner */}
        {(!isSubscribed && (appState.slotsBought || 0) > 0) && (
          <div 
            className="rounded-[24px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border"
            style={{
              background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
              borderColor: 'var(--color-primary-soft)',
              boxShadow: '0 8px 24px -12px rgba(var(--color-primary-rgb), 0.15)'
            }}
          >
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                <Bot size={24} />
              </div>
              <div>
                <div className="font-bold text-[16px] text-[var(--color-foreground)] tracking-tight">
                  Доступно для создания: {appState.slotsBought} {appState.slotsBought === 1 ? 'бот' : appState.slotsBought! > 1 && appState.slotsBought! < 5 ? 'бота' : 'ботов'}
                </div>
                <div className="text-[13px] text-[var(--color-foreground-secondary)] mt-0.5">
                  Вы приобрели слоты для ботов. Создайте своего первого бота!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HERO SECTION (Adaptive for Mobile and PC) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden p-6 md:p-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 group"
          style={{
            borderRadius: 24,
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            minHeight: "clamp(300px, 45vh, 450px)",
            boxShadow: "0 8px 30px -10px rgba(0,0,0,0.05)",
          }}
        >
          {/* Decorative accents */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl hidden md:block opacity-80 transition-opacity group-hover:opacity-100" style={{ background: "linear-gradient(180deg, var(--color-primary), var(--color-accent), #EC4899)" }} />
          <div className="absolute inset-0 pointer-events-none opacity-50 transition-opacity duration-700 group-hover:opacity-100" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.08) 0%, transparent 65%)" }} />

          {/* Text and Actions */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full"
              style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)", fontSize: 13, fontWeight: 600 }}
            >
              <Bot size={14} />
              Конструктор Telegram ботов
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--color-foreground)] leading-[1.1] mb-5 tracking-tight"
            >
              Создай Telegram-бота<br className="hidden md:block" />{" "}
              <span style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                без кода за 5 минут
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-[15px] md:text-base text-[var(--color-foreground-secondary)] max-w-[480px] leading-relaxed mb-8"
            >
              Создавайте умные воронки продаж, принимайте оплаты через ЮKassa, Robokassa или Prodamus и возвращайте клиентов автоматическими дожимами.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            >
              <button
                onClick={onCreateBot}
                className="btn-primary-saas flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap active:scale-95 transition-transform"
                style={{ height: 52, padding: "0 32px", fontSize: 16, borderRadius: 16, boxShadow: "0 10px 24px -6px rgba(99,102,241,0.4)" }}
              >
                <Plus size={18} />
                Создать бота
              </button>
              <button
                onClick={() => setActiveTab("subscription")}
                className="btn btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap active:scale-95 transition-transform"
                style={{ height: 52, padding: "0 24px", fontSize: 15, borderRadius: 16 }}
              >
                Тарифы
                <ArrowRight size={15} />
              </button>
            </motion.div>
          </div>

          {/* Large Robot Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
            className="relative z-10 shrink-0 flex items-center justify-center w-[280px] md:w-[360px] lg:w-[420px] mb-4 md:mb-0 mt-4 md:mt-0"
          >
            <div className="absolute w-[240px] h-[240px] md:w-[340px] md:h-[340px] rounded-full blur-3xl opacity-50 pointer-events-none transition-opacity duration-700 group-hover:opacity-80" style={{ background: "radial-gradient(circle, var(--color-primary-soft) 0%, transparent 70%)" }} />
            <motion.img
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              src="/welcome_robot.png"
              alt="Bot Father Welcome Robot"
              className="w-full h-auto object-contain select-none transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
              style={{
                maxHeight: "clamp(240px, 45vh, 400px)",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.12))",
              }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </motion.div>
        </motion.div>

        {/* WHY BOT FATHER SECTION / FEATURES */}
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-foreground)] tracking-tight">Возможности платформы</h2>
            <p className="text-xs md:text-sm text-[var(--color-foreground-secondary)] mt-1">Все необходимые инструменты для автоматизации вашего бизнеса в одном месте</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.08)" }}
                className="p-5 md:p-6 flex gap-4 items-start border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors group cursor-default"
                style={{ borderRadius: 20 }}
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: feat.colorSoft, color: feat.color }}
                >
                  {feat.icon}
                </div>
                <div className="space-y-1.5 min-w-0">
                  <h3 className="text-[15px] font-bold text-[var(--color-foreground)] leading-tight">{feat.title}</h3>
                  <p className="text-[13px] md:text-sm text-[var(--color-foreground-secondary)] leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* HOW TO START STEPS */}
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-foreground)] tracking-tight">Как начать работу?</h2>
            <p className="text-xs md:text-sm text-[var(--color-foreground-secondary)] mt-1">Четыре простых шага до запуска вашего первого автоматизированного Telegram-бота</p>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0 gap-4 md:gap-6">
            {START_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                whileHover={{ y: -6, boxShadow: "0 16px 32px -12px rgba(0,0,0,0.1)" }}
                className="p-6 relative overflow-hidden shrink-0 w-[280px] md:w-auto snap-center group transition-colors cursor-default md:bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)]"
                style={{ 
                  borderRadius: 24,
                  background: "var(--color-surface)", // fallback
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* Decorative large background number */}
                <div
                  className="absolute -right-2 -bottom-4 font-black select-none pointer-events-none opacity-[0.08] group-hover:opacity-[0.15] transition-all duration-500 group-hover:scale-110"
                  style={{ fontSize: 140, lineHeight: 1, color: step.color }}
                >
                  {step.num}
                </div>
                
                {/* Glow effect */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-500" 
                  style={{ background: step.color }}
                />
                
                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <div
                    className="w-12 h-12 shrink-0 rounded-[14px] flex items-center justify-center font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)` }}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-[15px] font-bold text-[var(--color-foreground)] leading-tight">{step.title}</h3>
                </div>
                <p className="text-[13px] md:text-sm text-[var(--color-foreground-secondary)] leading-relaxed relative z-10">{step.desc}</p>
                
                {/* Step connector for desktop */}
                {i < START_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-3 w-6 border-t-[2.5px] border-dotted border-[var(--color-border)] z-0 opacity-50" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // --- DASHBOARD SCREEN (has bot) ---
  return (
    <motion.div
      key="home-dashboard"
      initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(4px)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6 pb-8"
    >
      {/* Subscription banner */}
      {!isSubscribed && (
        <motion.button 
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab("profile")} 
          className="w-full text-left"
        >
          <div
            className="relative overflow-hidden p-5 flex items-center gap-4 transition-shadow hover:shadow-[0_12px_32px_-12px_rgba(79,70,229,0.6)] group"
            style={{ borderRadius: 28, background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {/* Soft inner glow */}
            <div className="absolute inset-0 pointer-events-none rounded-[28px] border border-white/10" />
            
            <div className="absolute inset-0 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)" }} />
            
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 shadow-inner" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
              <User size={24} style={{ color: "#fff" }} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "2px", letterSpacing: '-0.01em' }}>
                {appState.subscriptionStatus === "expired" ? "Подписка истекла" : "🚀 Активируй PRO"}
              </div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>
                {appState.subscriptionStatus === "expired" ? "Боты остановлены — продлите подписку" : "Приём платежей, воронки, аналитика"}
              </div>
            </div>
            
            <div className="shrink-0 px-4 py-2.5 rounded-[14px] text-[14px] font-bold shadow-sm transition-transform group-hover:scale-105" style={{ background: "#ffffff", color: "#4F46E5", whiteSpace: "nowrap" }}>
              {appState.subscriptionStatus === "expired" ? "Продлить" : "Оформить"}
            </div>
          </div>
        </motion.button>
      )}

      {/* Revenue + CTA */}
      <div className="card-saas flex flex-col" style={{ padding: "24px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground-secondary)", letterSpacing: "0.02em", textTransform: "uppercase", marginBottom: "12px" }}>
          Выручка за месяц
        </div>
        <div className="text-[32px] font-extrabold text-[var(--color-foreground)] tracking-tight leading-none flex items-end gap-2" style={{ marginBottom: "8px" }}>
          145 000 ₽ <span className="text-[14px] font-medium text-[var(--color-success)] mb-1.5">+12.5%</span>
        </div>
        <div style={{ fontSize: "14px", color: "var(--color-foreground-tertiary)", fontWeight: 500, marginBottom: "24px" }}>
          Моковые данные для демонстрации
        </div>
        <button onClick={() => setActiveTab("build")} className="btn-primary-saas self-start" style={{ height: "44px", borderRadius: "14px", fontSize: "14px" }}>
          Редактировать воронку
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {[{ label: "Лиды", value: "1,248" }, { label: "Конверсия", value: "18.4%" }, { label: "Продажи", value: "230" }].map((stat, i) => (
          <div key={i} className="card-saas" style={{ padding: "20px 16px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--color-foreground)", marginBottom: "4px" }}>{stat.value}</div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-foreground-secondary)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card-saas" style={{ padding: "24px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-foreground)" }}>Активность</span>
          <div className="flex gap-4">
            {[{ label: "Просмотры", color: "#2E9ADB" }, { label: "Продажи", color: "#30B56B" }].map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
                <span style={{ fontSize: "12px", color: "var(--color-foreground-secondary)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={STATS_DATA}>
            <defs>
              <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E9ADB" stopOpacity={0.1} /><stop offset="95%" stopColor="#2E9ADB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#30B56B" stopOpacity={0.1} /><stop offset="95%" stopColor="#30B56B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--color-foreground-tertiary)" fontSize={11} axisLine={false} tickLine={false} dy={8} />
            <YAxis hide />
            <ReChartsTooltip contentStyle={{ background: "#fff", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }} />
            <Area type="monotone" dataKey="views" stroke="#2E9ADB" strokeWidth={1.5} fillOpacity={1} fill="url(#gViews)" />
            <Area type="monotone" dataKey="sales" stroke="#30B56B" strokeWidth={1.5} fillOpacity={1} fill="url(#gSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Events */}
      <div className="card-saas transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]" style={{ padding: "24px" }}>
        <div className="flex items-center gap-2" style={{ marginBottom: "20px" }}>
          <Clock size={16} style={{ color: "var(--color-foreground-tertiary)" }} />
          <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-foreground)" }}>События</span>
        </div>
        <div style={{ padding: "0", background: "transparent", border: "none" }}>
          <div className="flex flex-col gap-3">
            {[
              { text: "Новая продажа: Тариф PRO", time: "10 мин назад", icon: <CreditCard size={14} />, color: "var(--color-success)" },
              { text: "Пользователь дошел до шага Оплата", time: "25 мин назад", icon: <User size={14} />, color: "var(--color-primary)" },
              { text: "Сработал автоматический дожим", time: "1 час назад", icon: <Clock size={14} />, color: "var(--color-warning)" },
            ].map((event, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-[var(--color-surface)] shadow-sm" style={{ color: event.color }}>
                  {event.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[var(--color-foreground)] truncate">{event.text}</div>
                  <div className="text-[12px] text-[var(--color-foreground-tertiary)] mt-0.5">{event.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
