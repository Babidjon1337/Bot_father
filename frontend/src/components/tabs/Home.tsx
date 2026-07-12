import { motion } from "framer-motion";
import {
  Bot,
  GitMerge,
  CreditCard,
  BarChart2,
  User,
  ChevronRight,
  HelpCircle,
  Clock,
  AlertCircle,
  ArrowRight,
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

export const Home = ({
  appState,
  setActiveTab,
  setSheet,
  onCreateBot,
}: HomeProps) => {
  const hasBot = appState.activeBot !== null;
  const isSubscribed = appState.subscriptionStatus === "active";

  // --- WELCOME SCREEN (Shown only if no bot exists) ---
  if (!hasBot) {
    return (
      <motion.div
        key="home-welcome"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-5xl mx-auto px-4 md:px-0 pb-12"
      >
        {/* Main Banner */}
        <div
          className="card-saas relative overflow-hidden mb-8 flex flex-col md:flex-row items-center justify-between"
          style={{
            padding: "0",
            borderRadius: "24px",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="p-8 md:p-12 relative z-10 flex-1">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: "var(--color-surface-2)",
                borderRadius: "100px",
                color: "var(--color-primary)",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              <Bot size={16} />
              <span>Платформа Bot Father</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-foreground)] mb-4 leading-tight tracking-tight">
              Добро пожаловать <br />в панель управления
            </h1>

            <p className="text-[16px] text-[var(--color-foreground-secondary)] mb-8 max-w-md leading-relaxed">
              Создайте своего первого Telegram-бота в визуальном редакторе.
              Настраивайте воронки продаж, принимайте платежи и анализируйте
              результаты.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onCreateBot}
                className="btn-primary-saas w-full sm:w-auto flex items-center justify-center gap-2"
                style={{
                  height: "52px",
                  padding: "0 32px",
                  fontSize: "15px",
                  borderRadius: "14px",
                  boxShadow: "0 8px 20px -8px rgba(99, 102, 241, 0.5)",
                }}
              >
                Создать бота
              </button>
              <button
                onClick={() => setActiveTab("subscription")}
                className="btn btn-secondary w-full sm:w-auto"
                style={{
                  height: "52px",
                  padding: "0 32px",
                  fontSize: "15px",
                  borderRadius: "14px",
                }}
              >
                Тарифы
              </button>
            </div>
          </div>

          <div className="relative z-10 hidden md:flex items-center justify-center w-[400px] h-[360px] flex-shrink-0">
            {/* Background Glow */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, var(--color-primary-soft) 0%, rgba(255,255,255,0) 70%)",
                zIndex: 0,
              }}
            />

            <img
              src="/welcome_robot.png"
              alt="Welcome Robot"
              className="w-full h-full object-contain relative z-10"
              style={{
                transform: "scale(1.2) translateX(-30px)",
                filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.15))",
              }}
            />
          </div>
        </div>

        {/* Features Grid */}
        <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-6 mt-12 tracking-tight">
          Что вы можете сделать
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <div
            className="card-saas p-6 flex flex-col h-full group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={onCreateBot}
          >
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
              style={{
                background: "var(--color-primary-soft)",
                color: "var(--color-primary)",
              }}
            >
              <Bot size={24} />
            </div>
            <h4 className="text-[16px] font-bold text-[var(--color-foreground)] mb-2">
              Создать бота
            </h4>
            <p className="text-[14px] text-[var(--color-foreground-secondary)] leading-relaxed">
              Быстрый старт. Подключите токен бота и начните настройку.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card-saas p-6 flex flex-col h-full group hover:-translate-y-1 transition-all duration-300">
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
              style={{
                background: "var(--color-success-soft)",
                color: "var(--color-success)",
              }}
            >
              <GitMerge size={24} />
            </div>
            <h4 className="text-[16px] font-bold text-[var(--color-foreground)] mb-2">
              Настроить воронку
            </h4>
            <p className="text-[14px] text-[var(--color-foreground-secondary)] leading-relaxed">
              Визуальный редактор блоков для создания любой логики.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card-saas p-6 flex flex-col h-full group hover:-translate-y-1 transition-all duration-300">
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
              style={{
                background: "var(--color-accent-soft)",
                color: "var(--color-accent)",
              }}
            >
              <CreditCard size={24} />
            </div>
            <h4 className="text-[16px] font-bold text-[var(--color-foreground)] mb-2">
              Принимать платежи
            </h4>
            <p className="text-[14px] text-[var(--color-foreground-secondary)] leading-relaxed">
              Интеграция ЮKassa, Robokassa и Prodamus в пару кликов.
            </p>
          </div>

          {/* Feature 4 */}
          <div
            className="card-saas p-6 flex flex-col h-full group hover:-translate-y-1 transition-all duration-300"
            onClick={() => setActiveTab("subscription")}
          >
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
              style={{
                background: "var(--color-surface-2)",
                color: "var(--color-foreground-tertiary)",
              }}
            >
              <BarChart2 size={24} />
            </div>
            <h4 className="text-[16px] font-bold text-[var(--color-foreground)] mb-2">
              Аналитика
            </h4>
            <p className="text-[14px] text-[var(--color-foreground-secondary)] leading-relaxed">
              Подробная статистика по аудитории, конверсиям и доходам.
            </p>
          </div>
        </div>

        {/* How it works */}
        <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-6 mt-16 tracking-tight">
          Как начать работу?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-saas p-6 flex flex-col items-start relative overflow-hidden">
            <div className="text-[64px] font-black text-[var(--color-foreground)] opacity-5 absolute right-4 bottom-[-10px] leading-none select-none">
              1
            </div>
            <div className="w-10 h-10 rounded-[12px] bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center mb-4 font-bold">
              1
            </div>
            <h4 className="text-[16px] font-bold text-[var(--color-foreground)] mb-2">
              Создайте бота
            </h4>
            <p className="text-[14px] text-[var(--color-foreground-secondary)] leading-relaxed">
              Скопируйте токен вашего бота из @BotFather и вставьте его в панель
              управления.
            </p>
          </div>
          <div className="card-saas p-6 flex flex-col items-start relative overflow-hidden">
            <div className="text-[64px] font-black text-[var(--color-foreground)] opacity-5 absolute right-4 bottom-[-10px] leading-none select-none">
              2
            </div>
            <div className="w-10 h-10 rounded-[12px] bg-[var(--color-warning-soft)] text-[var(--color-warning)] flex items-center justify-center mb-4 font-bold">
              2
            </div>
            <h4 className="text-[16px] font-bold text-[var(--color-foreground)] mb-2">
              Настройте воронку
            </h4>
            <p className="text-[14px] text-[var(--color-foreground-secondary)] leading-relaxed">
              В визуальном конструкторе создайте путь клиента: от приветствия до
              дожимов.
            </p>
          </div>
          <div className="card-saas p-6 flex flex-col items-start relative overflow-hidden">
            <div className="text-[64px] font-black text-[var(--color-foreground)] opacity-5 absolute right-4 bottom-[-10px] leading-none select-none">
              3
            </div>
            <div className="w-10 h-10 rounded-[12px] bg-[var(--color-success-soft)] text-[var(--color-success)] flex items-center justify-center mb-4 font-bold">
              3
            </div>
            <h4 className="text-[16px] font-bold text-[var(--color-foreground)] mb-2">
              Принимайте оплаты
            </h4>
            <p className="text-[14px] text-[var(--color-foreground-secondary)] leading-relaxed">
              Подключите ЮKassa, Robokassa или Prodamus и получайте оплаты прямо
              в боте.
            </p>
          </div>
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
            background: "var(--color-warning-soft)",
            border: "1px solid rgba(229,150,63,0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle
              size={18}
              style={{ color: "var(--color-warning)", flexShrink: 0 }}
            />
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--color-foreground)",
                }}
              >
                {appState.subscriptionStatus === "expired"
                  ? "Подписка истекла — боты остановлены"
                  : "Оформите PRO подписку"}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--color-foreground-secondary)",
                  marginTop: "2px",
                }}
              >
                Подписка нужна для публикации воронок и приёма платежей
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('subscription')}
            className="btn-primary-saas"
            style={{
              height: "36px",
              fontSize: "13px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {appState.subscriptionStatus === "expired"
              ? "Продлить"
              : "Оформить"}
          </button>
        </div>
      )}

      {/* Revenue + CTA */}
      <div className="card-saas" style={{ padding: "24px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--color-foreground-tertiary)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Выручка за месяц
        </div>
        <div className="text-kpi" style={{ marginBottom: "4px" }}>
          —
        </div>
        <div
          className="flex items-center gap-1.5"
          style={{ marginBottom: "20px" }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "var(--color-foreground-tertiary)",
              fontWeight: 500,
            }}
          >
            Данные появятся после первых продаж
          </span>
        </div>
        <button
          onClick={() => setActiveTab("build")}
          className="btn btn-action"
          style={{ height: "40px" }}
        >
          Редактировать воронку
          <ArrowRight size={15} />
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Лиды", value: "—" },
          { label: "Конверсия", value: "—" },
          { label: "Продажи", value: "—" },
        ].map((stat, i) => (
          <div key={i} className="card-saas" style={{ padding: "16px 20px" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--color-foreground)",
                fontVariantNumeric: "tabular-nums",
                marginBottom: "4px",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--color-foreground-tertiary)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card-saas" style={{ padding: "24px" }}>
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: "20px" }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--color-foreground)",
            }}
          >
            Активность
          </span>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--color-foreground-secondary)",
                }}
              >
                Просмотры
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--color-success)",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--color-foreground-secondary)",
                }}
              >
                Продажи
              </span>
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
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="var(--color-foreground-tertiary)"
              fontSize={11}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis hide />
            <ReChartsTooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                boxShadow: "var(--shadow-float)",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#2E9ADB"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#gViews)"
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#30B56B"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#gSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Events */}
      <div className="card" style={{ padding: "24px" }}>
        <div
          className="flex items-center gap-2"
          style={{ marginBottom: "16px" }}
        >
          <Clock
            size={15}
            style={{ color: "var(--color-foreground-tertiary)" }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--color-foreground)",
            }}
          >
            События
          </span>
        </div>
        <div style={{ padding: "24px 0", textAlign: "center" }}>
          <p
            style={{
              fontSize: "14px",
              color: "var(--color-foreground-tertiary)",
            }}
          >
            Событий пока нет. Запустите воронку, чтобы увидеть активность.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
