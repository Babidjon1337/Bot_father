
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
import type { TabType, AppState, SheetType } from "../../types";

interface HomeProps {
  appState: AppState;
  setActiveTab: (tab: TabType) => void;
  setSheet: (sheet: SheetType) => void;
  onCreateBot: () => void;
}

const STATS_DATA: { name: string; views: number; sales: number }[] = [];

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

export const Home = ({ appState, setActiveTab, onCreateBot }: HomeProps) => {
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
          <div className="bg-[var(--color-primary-soft)] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[var(--color-primary)]">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-[var(--color-surface)] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <div className="font-bold text-[var(--color-foreground)]">
                  Доступно для создания: {appState.slotsBought} {appState.slotsBought === 1 ? 'бот' : appState.slotsBought! > 1 && appState.slotsBought! < 5 ? 'бота' : 'ботов'}
                </div>
                <div className="text-[13px] text-[var(--color-foreground-secondary)]">Вы приобрели слоты для ботов. Создайте своего первого бота!</div>
              </div>
            </div>
          </div>
        )}

        {/* HERO SECTION (Adaptive for Mobile and PC) */}
        <div
          className="relative overflow-hidden p-6 md:p-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8"
          style={{
            borderRadius: 24,
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            minHeight: "clamp(300px, 45vh, 450px)",
          }}
        >
          {/* Decorative accents */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl hidden md:block" style={{ background: "linear-gradient(180deg, var(--color-primary), var(--color-accent), #EC4899)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.05) 0%, transparent 65%)" }} />

          {/* Text and Actions */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left relative z-10">
            <div
              className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full"
              style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)", fontSize: 13, fontWeight: 600 }}
            >
              <Bot size={14} />
              Конструктор Telegram ботов
            </div>
            <h1
              className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-[var(--color-foreground)] leading-tight mb-4 tracking-tight"
            >
              Создай Telegram-бота<br className="hidden md:block" />{" "}
              <span style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                без кода за 5 минут
              </span>
            </h1>
            <p className="text-sm md:text-base text-[var(--color-foreground-secondary)] max-w-[480px] leading-relaxed mb-6 md:mb-8">
              Создавайте умные воронки продаж, принимайте оплаты через ЮKassa, Robokassa или Prodamus и возвращайте клиентов автоматическими дожимами.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onCreateBot}
                className="btn-primary-saas flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
                style={{ height: 50, padding: "0 32px", fontSize: 16, borderRadius: 14, boxShadow: "0 10px 24px -6px rgba(99,102,241,0.4)" }}
              >
                <Plus size={18} />
                Создать бота
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className="btn btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
                style={{ height: 50, padding: "0 24px", fontSize: 15, borderRadius: 14 }}
              >
                Тарифы
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Large Robot Image */}
          <div className="relative z-10 shrink-0 flex items-center justify-center w-[240px] md:w-[320px] lg:w-[360px] mb-4 md:mb-0 mt-4 md:mt-0">
            <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full blur-3xl opacity-50 pointer-events-none" style={{ background: "radial-gradient(circle, var(--color-primary-soft) 0%, transparent 70%)" }} />
            <img
              src="/welcome_robot.png"
              alt="Bot Father Welcome Robot"
              className="w-full h-auto object-contain select-none"
              style={{
                maxHeight: "clamp(200px, 35vh, 320px)",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.12))",
              }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        </div>

        {/* WHY BOT FATHER SECTION / FEATURES */}
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-foreground)] tracking-tight">Возможности платформы</h2>
            <p className="text-xs md:text-sm text-[var(--color-foreground-secondary)] mt-1">Все необходимые инструменты для автоматизации вашего бизнеса в одном месте</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                className="card-saas p-5 md:p-6 flex gap-4 items-start border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-all"
                style={{ borderRadius: 16 }}
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: feat.colorSoft, color: feat.color }}
                >
                  {feat.icon}
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm md:text-base font-bold text-[var(--color-foreground)] leading-tight">{feat.title}</h3>
                  <p className="text-xs md:text-sm text-[var(--color-foreground-secondary)] leading-relaxed">{feat.desc}</p>
                </div>
              </div>
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
              <div
                key={i}
                className="card-saas p-6 relative overflow-hidden shrink-0 w-[280px] md:w-auto snap-center group transition-all duration-300 hover:-translate-y-1"
                style={{ 
                  borderRadius: 20,
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 4px 20px -10px rgba(0,0,0,0.05)"
                }}
              >
                {/* Decorative large background number */}
                <div
                  className="absolute -right-4 -bottom-6 font-black select-none pointer-events-none opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300"
                  style={{ fontSize: 120, lineHeight: 1, color: step.color }}
                >
                  {step.num}
                </div>
                
                {/* Glow effect */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-500" 
                  style={{ background: step.color }}
                />
                
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)` }}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-foreground)] leading-tight">{step.title}</h3>
                </div>
                <p className="text-xs md:text-sm text-[var(--color-foreground-secondary)] leading-relaxed relative z-10">{step.desc}</p>
                
                {/* Step connector for desktop */}
                {i < START_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-3 w-6 border-t-2 border-dashed border-[var(--color-border)] z-0" />
                )}
              </div>
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="space-y-6 pb-8"
    >
      {/* Subscription banner */}
      {!isSubscribed && (
        <button onClick={() => setActiveTab("profile")} className="w-full text-left">
          <div
            className="relative overflow-hidden rounded-2xl p-4 flex items-center gap-4"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)" }} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
              <User size={20} style={{ color: "#fff" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>
                {appState.subscriptionStatus === "expired" ? "Подписка истекла" : "🚀 Активируй PRO"}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>
                {appState.subscriptionStatus === "expired" ? "Боты остановлены — продлите подписку" : "Приём платежей, воронки, аналитика"}
              </div>
            </div>
            <div className="shrink-0 px-4 py-2 rounded-xl text-[13px] font-bold" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", whiteSpace: "nowrap" }}>
              {appState.subscriptionStatus === "expired" ? "Продлить" : "Оформить"}
            </div>
          </div>
        </button>
      )}

      {/* Revenue + CTA */}
      <div className="card-saas" style={{ padding: "24px" }}>
        <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-foreground-tertiary)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>
          Выручка за месяц
        </div>
        <div className="text-kpi" style={{ marginBottom: "4px" }}>—</div>
        <div style={{ fontSize: "13px", color: "var(--color-foreground-tertiary)", fontWeight: 500, marginBottom: "20px" }}>
          Данные появятся после первых продаж
        </div>
        <button onClick={() => setActiveTab("build")} className="btn btn-action" style={{ height: "40px" }}>
          Редактировать воронку
          <ArrowRight size={15} />
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        {[{ label: "Лиды", value: "—" }, { label: "Конверсия", value: "—" }, { label: "Продажи", value: "—" }].map((stat, i) => (
          <div key={i} className="card-saas" style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: "20px", fontWeight: 500, letterSpacing: "-0.01em", color: "var(--color-foreground)", marginBottom: "4px" }}>{stat.value}</div>
            <div style={{ fontSize: "12px", color: "var(--color-foreground-tertiary)" }}>{stat.label}</div>
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
      <div className="card" style={{ padding: "24px" }}>
        <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
          <Clock size={15} style={{ color: "var(--color-foreground-tertiary)" }} />
          <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-foreground)" }}>События</span>
        </div>
        <div style={{ padding: "24px 0", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "var(--color-foreground-tertiary)" }}>
            Событий пока нет. Запустите воронку, чтобы увидеть активность.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
