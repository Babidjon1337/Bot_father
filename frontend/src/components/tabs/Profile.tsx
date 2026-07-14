import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Star,
  CheckCircle2,
  Bot,
  Users,
  CreditCard,
  LineChart,
  Headphones,
  BarChart2,
  ChevronRight,
  XCircle,
  RefreshCcw,
  Sun,
  Moon,
  Zap,
} from "lucide-react";
import type { AppState, TabType } from "../../types";

interface ProfileProps {
  appState: AppState;
  setActiveTab?: (tab: TabType) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  onPurchaseSuccess?: (plan: "basic" | "pro") => void;
}

type Section = "profile" | "plans" | "confirm";

export const Profile = ({
  appState,
  setActiveTab,
  theme,
  toggleTheme,
  onPurchaseSuccess,
}: ProfileProps) => {
  const isSubscribed = appState.subscriptionStatus === "active";
  const [section, setSection] = useState<Section>("profile");
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [cancelledUntil, setCancelledUntil] = useState<string | null>(null);

  // TG BackButton wiring
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg?.BackButton) return;

    if (section !== "profile") {
      tg.BackButton.show();
      const handler = () => {
        if (section === "confirm") setSection("plans");
        else setSection("profile");
      };
      tg.BackButton.onClick(handler);
      return () => {
        tg.BackButton.offClick(handler);
        tg.BackButton.hide();
      };
    } else {
      tg.BackButton.hide();
    }
  }, [section]);

  const handleSelectPlan = (plan: "basic" | "pro") => {
    setSelectedPlan(plan);
    setSection("confirm");
  };

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      if (selectedPlan && onPurchaseSuccess) onPurchaseSuccess(selectedPlan);
      setSection("profile");
    }, 1500);
  };

  const plans = {
    basic: {
      name: "Базовый",
      price: "2 000 ₽",
      period: "навсегда",
      icon: <Star size={20} style={{ color: "var(--color-primary)" }} />,
      color: "var(--color-primary)",
      colorSoft: "var(--color-primary-soft)",
      features: [
        { icon: <Bot size={15} />, text: "1 активный бот" },
        { icon: <Users size={15} />, text: "До 10 000 пользователей" },
        { icon: <CreditCard size={15} />, text: "Приём платежей (ком. 2%)" },
      ],
    },
    pro: {
      name: "PRO",
      price: "3 000 ₽",
      period: "/ мес",
      icon: <Crown size={20} style={{ color: "var(--color-accent)" }} />,
      color: "var(--color-accent)",
      colorSoft: "var(--color-accent-soft)",
      features: [
        { icon: <Bot size={15} />, text: "До 10 активных ботов" },
        { icon: <Users size={15} />, text: "Без ограничений на польз." },
        { icon: <CreditCard size={15} />, text: "Платежи без комиссии" },
        { icon: <LineChart size={15} />, text: "Аналитика" },
        { icon: <Headphones size={15} />, text: "Приоритетная поддержка" },
      ],
    },
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="w-full pb-10 flex justify-center"
    >
      <div className="w-full max-w-[640px] pt-2 lg:pt-6 px-4 lg:px-0">
        <AnimatePresence mode="wait">

          {/* ── PROFILE SECTION ── */}
          {section === "profile" && (
            <motion.div
              key="profile-main"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Account Header Card — with theme toggle */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                }}
              >
                {/* Gradient banner */}
                <div
                  style={{
                    height: "80px",
                    background: "linear-gradient(135deg, var(--color-primary) 0%, #A855F7 100%)",
                    opacity: 0.9,
                  }}
                />

                {/* Theme toggle in top-right of card */}
                <button
                  onClick={toggleTheme}
                  className="absolute top-3 right-3 z-10 flex items-center justify-center rounded-xl transition-all"
                  style={{
                    width: 36,
                    height: 36,
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                  title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                <div className="px-5 pb-5 relative">
                  <div
                    className="flex items-center justify-center shrink-0 shadow-md"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "var(--color-surface)",
                      border: "3px solid var(--color-surface)",
                      color: "var(--color-primary)",
                      fontSize: "22px",
                      fontWeight: 700,
                      marginTop: "-32px",
                      marginBottom: "12px",
                    }}
                  >
                    {appState.userEmail ? appState.userEmail.charAt(0).toUpperCase() : "U"}
                  </div>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-foreground)", margin: 0 }}>
                    Мой аккаунт
                  </h2>
                  <p style={{ fontSize: "13px", color: "var(--color-foreground-secondary)", marginTop: "2px" }}>
                    {appState.userEmail || "Не указан"}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 size={14} style={{ color: "var(--color-foreground-tertiary)" }} />
                    <span style={{ fontSize: "12px", color: "var(--color-foreground-secondary)" }}>Ботов создано</span>
                  </div>
                  <span style={{ fontSize: "28px", fontWeight: 700, color: "var(--color-foreground)", letterSpacing: "-0.02em" }}>
                    {appState.bots.length}
                  </span>
                </div>
                <div className="card p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={14} style={{ color: "var(--color-foreground-tertiary)" }} />
                    <span style={{ fontSize: "12px", color: "var(--color-foreground-secondary)" }}>Пользователей</span>
                  </div>
                  <span style={{ fontSize: "28px", fontWeight: 700, color: "var(--color-foreground)", letterSpacing: "-0.02em" }}>
                    {appState.bots.reduce((acc, bot) => acc + bot.usersCount, 0)}
                  </span>
                </div>
              </div>

              {/* Purchased Slots Display */}
              {!isSubscribed && (appState.slotsBought || 0) > 0 && (
                <div className="card-saas p-4" style={{ border: '1px solid var(--color-primary)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--color-primary-soft)] rounded-xl flex items-center justify-center shrink-0">
                      <Star size={24} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <div className="text-[13px] text-[var(--color-foreground-secondary)] mb-0.5">Ваши покупки</div>
                      <div className="text-[16px] font-bold text-[var(--color-foreground)]">
                        Куплено: {appState.slotsBought} {appState.slotsBought === 1 ? 'базовый бот' : appState.slotsBought! > 1 && appState.slotsBought! < 5 ? 'базовых бота' : 'базовых ботов'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRO Subscription CTA — selling banner if not subscribed */}
              {!isSubscribed ? (
                <button onClick={() => setActiveTab ? setActiveTab("subscription") : setSection("plans")} className="w-full text-left">
                  <div
                    className="relative overflow-hidden rounded-2xl"
                    style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #C026D3 100%)" }}
                  >
                    {/* Shine */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, transparent 40%)" }} />
                    {/* Circles */}
                    <div className="absolute -top-8 -right-8 pointer-events-none" style={{ width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                    <div className="absolute -bottom-10 -left-6 pointer-events-none" style={{ width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

                    {/* Top label */}
                    <div className="relative z-10 px-5 pt-5 pb-2 flex items-center justify-between">
                      <div
                        className="inline-flex items-center gap-1.5"
                        style={{ background: "rgba(255,255,255,0.18)", borderRadius: "100px", padding: "4px 10px", fontSize: "11px", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}
                      >
                        <Crown size={11} />
                        PRO ДОСТУП
                      </div>
                      <div className="flex items-center gap-1" style={{ background: "rgba(255,255,255,0.15)", borderRadius: "100px", padding: "4px 10px" }}>
                        <Zap size={12} style={{ color: "#FFD700" }} />
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>Популярно</span>
                      </div>
                    </div>

                    {/* Content row */}
                    <div className="relative z-10 px-5 pb-5 flex items-end justify-between gap-3">
                      <div>
                        <div style={{ fontSize: "22px", fontWeight: 900, color: "#fff", lineHeight: "1.15", marginBottom: "6px" }}>
                          Разблокируй<br />все возможности
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {["10 ботов", "Без комиссии", "Аналитика", "Поддержка"].map(tag => (
                            <span key={tag} style={{ background: "rgba(255,255,255,0.15)", borderRadius: "100px", padding: "3px 10px", fontSize: "11px", color: "#fff", fontWeight: 500 }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span style={{ fontSize: "28px", fontWeight: 900, color: "#fff" }}>3 000 ₽</span>
                          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>/ месяц</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <img
                          src="/pro_sub.png"
                          alt="PRO Bot"
                          style={{ width: 90, height: 90, objectFit: "contain" }}
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    </div>

                    {/* CTA button full width */}
                    <div className="relative z-10 px-5 pb-5">
                      <div
                        className="w-full py-3 rounded-xl text-center font-bold"
                        style={{ background: "#fff", color: "#4F46E5", fontSize: "14px" }}
                      >
                        Оформить PRO подписку →
                      </div>
                    </div>
                  </div>
                </button>
              ) : (
                /* Active subscription — compact card */
                <button
                  onClick={() => setSection("plans")}
                  className="w-full card p-4 flex items-center gap-4 text-left transition-colors hover:bg-[var(--color-surface-2)]"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--color-accent-soft)" }}>
                    <Crown size={18} style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-foreground)" }}>PRO подписка</div>
                    <div style={{ fontSize: "12px", color: "var(--color-foreground-secondary)", marginTop: "2px" }}>
                      Активна · {appState.bots.length} из 10 ботов
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="badge badge-success" style={{ fontSize: "11px" }}>PRO</span>
                    <ChevronRight size={16} style={{ color: "var(--color-foreground-tertiary)" }} />
                  </div>
                </button>
              )}

              {/* Settings rows */}
              <div className="card-saas divide-y divide-[var(--color-border)] overflow-hidden p-0" style={{ borderRadius: "16px" }}>
                {[
                  { label: "Уведомления", desc: "Email и Telegram", icon: <Zap size={16} /> },
                  { label: "Безопасность", desc: "Пароль и 2FA", icon: <Bot size={16} /> },
                ].map((row, i) => (
                  <button key={i} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--color-surface-2)] transition-colors text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--color-surface-2)", color: "var(--color-foreground-secondary)" }}>
                      {row.icon}
                    </div>
                    <div className="flex-1">
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)" }}>{row.label}</div>
                      <div style={{ fontSize: "12px", color: "var(--color-foreground-tertiary)" }}>{row.desc}</div>
                    </div>
                    <ChevronRight size={15} style={{ color: "var(--color-foreground-tertiary)" }} />
                  </button>
                ))}
              </div>

            </motion.div>
          )}

          {/* ── PLANS SECTION ── */}
          {section === "plans" && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-foreground)", letterSpacing: "-0.02em", margin: 0 }}>
                  Тарифы
                </h2>
                <p style={{ fontSize: "13px", color: "var(--color-foreground-secondary)", marginTop: "4px" }}>
                  Выберите подходящий план для вашего бизнеса
                </p>
              </div>

              {/* Active Sub Banner */}
              {isSubscribed && (
                <div className="rounded-2xl p-4" style={{ background: "var(--color-accent-soft)", border: "1px solid rgba(175,82,222,0.2)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <Crown size={18} style={{ color: "var(--color-accent)" }} />
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-accent)" }}>PRO активен</span>
                    <span className="badge badge-success" style={{ fontSize: "11px", marginLeft: "auto" }}>✓ Активна</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--color-foreground-secondary)" }}>
                    Используете {appState.bots.length} из 10 ботов · Следующее списание: 25 июля 2025
                  </p>
                  {cancelledUntil ? (
                    <button
                      onClick={() => setCancelledUntil(null)}
                      className="mt-3 w-full py-2.5 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg, var(--color-success), #059669)" }}
                    >
                      <RefreshCcw size={14} /> Возобновить
                    </button>
                  ) : (
                    <button
                      onClick={() => setCancelledUntil("25 июля 2025")}
                      className="mt-3 w-full py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2"
                      style={{ background: "var(--color-danger-soft)", color: "var(--color-danger)" }}
                    >
                      <XCircle size={14} /> Отменить подписку
                    </button>
                  )}
                </div>
              )}

              {/* Plan Cards */}
              {(["basic", "pro"] as const).map((planKey) => {
                const plan = plans[planKey];
                const isActive = isSubscribed && planKey === "pro";
                const planImage = planKey === "pro" ? "/pro_sub.png" : "/single_bot.png";
                return (
                  <div
                    key={planKey}
                    className="card-saas overflow-hidden"
                    style={{ border: isActive ? `2px solid ${plan.color}` : undefined, position: "relative", padding: 0 }}
                  >
                    <div
                      className="relative flex items-center justify-between px-5 pt-4 pb-2 overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${plan.colorSoft}, transparent)` }}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {plan.icon}
                          <span style={{ fontSize: "17px", fontWeight: 800, color: "var(--color-foreground)" }}>{plan.name}</span>
                          {isActive && <span className="badge badge-success" style={{ fontSize: "10px" }}>Текущий</span>}
                          {planKey === "pro" && !isActive && (
                            <span className="badge" style={{ fontSize: "10px", background: plan.colorSoft, color: plan.color }}>Топ</span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span style={{ fontSize: "22px", fontWeight: 800, color: plan.color }}>{plan.price}</span>
                          <span style={{ fontSize: "12px", color: "var(--color-foreground-secondary)" }}>{plan.period}</span>
                        </div>
                      </div>
                      <img src={planImage} alt={plan.name} className="h-[90px] object-contain" style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.12))" }} />
                    </div>

                    <div className="px-5 pb-5 pt-3">
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2.5">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: plan.colorSoft, color: plan.color }}>
                              {f.icon}
                            </div>
                            <span style={{ fontSize: "13px", color: "var(--color-foreground-secondary)" }}>{f.text}</span>
                          </li>
                        ))}
                      </ul>
                      {!isActive && (
                        <button
                          onClick={() => handleSelectPlan(planKey)}
                          className="w-full py-3 rounded-xl text-[14px] font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${plan.color}, ${planKey === "pro" ? "#7c3aed" : "#1d6bc4"})` }}
                        >
                          Выбрать {plan.name}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Comparison Table */}
              <div className="card-saas p-5">
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "14px" }}>Сравнение тарифов</h3>
                <div className="space-y-3">
                  {[
                    { feature: "Ботов", basic: "1", pro: "10" },
                    { feature: "Пользователей", basic: "10 000", pro: "∞" },
                    { feature: "Платежи", basic: "2% ком.", pro: "Без ком." },
                    { feature: "Аналитика", basic: "—", pro: "✓" },
                    { feature: "Поддержка", basic: "Стандарт", pro: "Приоритет" },
                  ].map((row) => (
                    <div key={row.feature} className="flex items-center justify-between">
                      <span style={{ fontSize: "13px", color: "var(--color-foreground-secondary)", flex: 1 }}>{row.feature}</span>
                      <div className="flex gap-6">
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-foreground)", width: "64px", textAlign: "center" }}>{row.basic}</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-accent)", width: "64px", textAlign: "center" }}>{row.pro}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                    <span style={{ fontSize: "12px", color: "var(--color-foreground-tertiary)", flex: 1 }}>Тариф</span>
                    <div className="flex gap-6">
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-primary)", width: "64px", textAlign: "center" }}>Базовый</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-accent)", width: "64px", textAlign: "center" }}>PRO</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── CONFIRM PAYMENT SECTION ── */}
          {section === "confirm" && selectedPlan && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--color-foreground)", letterSpacing: "-0.02em", margin: 0 }}>Оформление</h2>
                <p style={{ fontSize: "13px", color: "var(--color-foreground-secondary)", marginTop: "4px" }}>Подтвердите выбранный тариф</p>
              </div>

              <div className="card-saas p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: plans[selectedPlan].colorSoft }}>
                    {plans[selectedPlan].icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>{plans[selectedPlan].name}</div>
                    <div style={{ fontSize: "13px", color: "var(--color-foreground-secondary)" }}>
                      {plans[selectedPlan].price} {plans[selectedPlan].period}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {plans[selectedPlan].features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 size={14} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: "var(--color-foreground-secondary)" }}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-4 space-y-3">
                <div className="flex justify-between">
                  <span style={{ fontSize: "13px", color: "var(--color-foreground-secondary)" }}>Тариф</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)" }}>{plans[selectedPlan].name}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: "13px", color: "var(--color-foreground-secondary)" }}>Период</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)" }}>{plans[selectedPlan].period}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[var(--color-border)]">
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-foreground)" }}>Итого</span>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: plans[selectedPlan].color }}>{plans[selectedPlan].price}</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={isPaying}
                className="w-full py-4 rounded-2xl text-[15px] font-bold text-white flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${plans[selectedPlan].color}, ${selectedPlan === "pro" ? "#7c3aed" : "#1d6bc4"})`,
                  opacity: isPaying ? 0.7 : 1,
                  boxShadow: "0 8px 20px -4px rgba(99,102,241,0.4)",
                }}
              >
                {isPaying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Обработка...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Оплатить {plans[selectedPlan].price}
                  </>
                )}
              </button>

              <p style={{ fontSize: "11px", color: "var(--color-foreground-tertiary)", textAlign: "center", lineHeight: 1.5 }}>
                Нажимая «Оплатить», вы принимаете условия публичной оферты. Оплата осуществляется через защищённый шлюз.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
