import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Star,
  Users,
  ChevronRight,
  Sun,
  Moon,
  Zap,
  BarChart2,
} from "lucide-react";
import { useAppState } from '../../providers/AppStateProvider';

export const Profile = () => {
  const { appState, theme, toggleTheme, setActiveTab } = useAppState();
  const isSubscribed = appState.subscriptionStatus === "active";

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
            <motion.div
              key="profile-main"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
              }}
              className="space-y-4"
            >
              {/* Account Header Card — with theme toggle */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                className="relative rounded-[24px] overflow-hidden group"
                style={{
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  boxShadow: "0 4px 24px -12px rgba(0,0,0,0.05)"
                }}
              >
                {/* Gradient banner */}
                <div
                  className="transition-transform duration-1000 group-hover:scale-105"
                  style={{
                    height: "88px",
                    background: "linear-gradient(135deg, var(--color-primary) 0%, #A855F7 100%)",
                    opacity: 0.9,
                  }}
                />

                {/* Theme toggle in top-right of card */}
                <button
                  onClick={toggleTheme}
                  className="absolute top-3 right-3 z-10 flex items-center justify-center rounded-xl transition-all hover:bg-white/30 active:scale-95"
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

                <div className="px-6 pb-6 relative">
                  <div
                    className="flex items-center justify-center shrink-0 shadow-md relative z-10"
                    style={{
                      width: "68px",
                      height: "68px",
                      borderRadius: "20px",
                      background: "var(--color-surface)",
                      border: "4px solid var(--color-surface)",
                      color: "var(--color-primary)",
                      fontSize: "24px",
                      fontWeight: 700,
                      marginTop: "-34px",
                      marginBottom: "12px",
                    }}
                  >
                    {appState.userEmail ? appState.userEmail.charAt(0).toUpperCase() : "U"}
                  </div>
                  <h2 style={{ fontSize: "19px", fontWeight: 800, color: "var(--color-foreground)", margin: 0, letterSpacing: "-0.01em" }}>
                    Мой аккаунт
                  </h2>
                  <p style={{ fontSize: "13px", color: "var(--color-foreground-secondary)", marginTop: "2px" }}>
                    {appState.userEmail || "Не указан"}
                  </p>
                </div>
              </motion.div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="card p-5 flex flex-col transition-shadow hover:shadow-md cursor-default">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 size={15} style={{ color: "var(--color-foreground-tertiary)" }} />
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-foreground-secondary)" }}>Ботов создано</span>
                  </div>
                  <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--color-foreground)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {appState.bots.length}
                  </span>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="card p-5 flex flex-col transition-shadow hover:shadow-md cursor-default">
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={15} style={{ color: "var(--color-foreground-tertiary)" }} />
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-foreground-secondary)" }}>Пользователей</span>
                  </div>
                  <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--color-foreground)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {appState.bots.reduce((acc, bot) => acc + bot.usersCount, 0)}
                  </span>
                </motion.div>
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
                <motion.button 
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab?.("subscription")} 
                  className="w-full text-left group"
                >
                  <div
                    className="relative overflow-hidden transition-shadow group-hover:shadow-[0_12px_24px_-8px_rgba(124,58,237,0.4)]"
                    style={{ borderRadius: 24, background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #C026D3 100%)" }}
                  >
                    {/* Shine */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, transparent 40%)" }} />
                    {/* Circles */}
                    <div className="absolute -top-8 -right-8 pointer-events-none transition-transform duration-700 group-hover:scale-125" style={{ width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                    <div className="absolute -bottom-10 -left-6 pointer-events-none transition-transform duration-700 group-hover:scale-125" style={{ width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

                    {/* Top label */}
                    <div className="relative z-10 px-6 pt-6 pb-2 flex items-center justify-between">
                      <div
                        className="inline-flex items-center gap-1.5"
                        style={{ background: "rgba(255,255,255,0.18)", borderRadius: "100px", padding: "4px 10px", fontSize: "11px", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}
                      >
                        <Crown size={12} />
                        PRO ДОСТУП
                      </div>
                      <div className="flex items-center gap-1" style={{ background: "rgba(255,255,255,0.15)", borderRadius: "100px", padding: "4px 10px" }}>
                        <Zap size={12} style={{ color: "#FFD700" }} />
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>Популярно</span>
                      </div>
                    </div>

                    {/* Content row */}
                    <div className="relative z-10 px-6 pb-6 flex items-end justify-between gap-3">
                      <div>
                        <div style={{ fontSize: "24px", fontWeight: 900, color: "#fff", lineHeight: "1.15", marginBottom: "8px", letterSpacing: "-0.02em" }}>
                          Разблокируй<br />все возможности
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {["10 ботов", "Без комиссии", "Аналитика", "Поддержка"].map(tag => (
                            <span key={tag} style={{ background: "rgba(255,255,255,0.15)", borderRadius: "100px", padding: "4px 10px", fontSize: "11px", color: "#fff", fontWeight: 600 }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span style={{ fontSize: "28px", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>3 000 ₽</span>
                          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>/ месяц</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <img
                          src="/pro_sub.png"
                          alt="PRO Bot"
                          className="transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                          style={{ width: 180, height: 180, objectFit: "contain", filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.3))", marginBottom: "-12px", marginRight: "-12px" }}
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    </div>

                    {/* CTA button full width */}
                    <div className="relative z-10 px-6 pb-6">
                      <div
                        className="w-full py-3.5 rounded-xl text-center font-bold transition-colors group-hover:bg-white/90"
                        style={{ background: "#fff", color: "#4F46E5", fontSize: "15px" }}
                      >
                        Оформить PRO подписку →
                      </div>
                    </div>
                  </div>
                </motion.button>
              ) : (
                /* Active subscription — compact card */
                <button
                  onClick={() => setActiveTab?.("subscription")}
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
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="card-saas overflow-hidden p-0 divide-y divide-[var(--color-border)]" style={{ borderRadius: "24px" }}>
                <div className="flex flex-col">
                  <button 
                    onClick={() => {
                      const tg = (window as any).Telegram?.WebApp;
                      if (tg) tg.HapticFeedback.impactOccurred('light');
                      const el = document.getElementById('notifications-expand');
                      if (el) {
                        el.style.display = el.style.display === 'none' ? 'block' : 'none';
                      }
                    }} 
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[var(--color-surface-2)] transition-colors text-left group"
                  >
                    <div className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}>
                      <Zap size={18} />
                    </div>
                    <div className="flex-1">
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-foreground)" }}>Уведомления и чеки</div>
                      <div style={{ fontSize: "13px", color: "var(--color-foreground-tertiary)" }}>Настройки Email и Telegram</div>
                    </div>
                    <ChevronRight size={18} className="text-[var(--color-foreground-tertiary)] transition-transform group-hover:translate-x-1" />
                  </button>
                  
                  {/* Expanded Content */}
                  <div id="notifications-expand" style={{ display: 'none', padding: '0 20px 20px 20px' }}>
                    <div className="pt-4 border-t border-[var(--color-border)] space-y-5">
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="relative inline-flex h-[28px] w-[50px] shrink-0 items-center rounded-full bg-[var(--color-primary)] transition-colors mt-0.5">
                          <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-[26px] transition-transform shadow-sm" />
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">Уведомления в Telegram</div>
                          <div className="text-[13px] text-[var(--color-foreground-secondary)] mt-0.5 leading-relaxed">
                            Получать информацию о лидах и оплатах
                          </div>
                        </div>
                      </label>
                      <div>
                        <label className="text-[13px] font-bold text-[var(--color-foreground)] block mb-1.5">
                          Email для отправки чеков
                        </label>
                        <input
                          type="email"
                          placeholder="ваша@почта.ru"
                          defaultValue={appState.userEmail || ""}
                          className="input w-full"
                          style={{ height: '44px', fontSize: '14px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
      </div>
    </motion.div>
  );
};
