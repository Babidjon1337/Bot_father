import { motion } from 'framer-motion';
import { TrendingUp, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip as ReChartsTooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import type { TabType, AppState, SheetType } from '../../types';

interface HomeProps {
  appState: AppState;
  setActiveTab: (tab: TabType) => void;
  setSheet: (sheet: SheetType) => void;
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

export const Home = ({ appState, setActiveTab, setSheet }: HomeProps) => {
  const isSubscribed = appState.subscriptionStatus === 'active';
  const hasBot = appState.activeBot !== null;

  return (
    <motion.div
      key="home"
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
            onClick={() => setSheet(appState.subscriptionStatus === 'expired' ? 'billing_renew' : 'billing_first')}
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
          {hasBot ? '154 820 ₽' : '0 ₽'}
        </div>
        {hasBot && (
          <div className="flex items-center gap-1.5" style={{ marginBottom: '20px' }}>
            <TrendingUp size={14} style={{ color: 'var(--color-success)' }} />
            <span style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: 500 }}>
              +18.4% к прошлому месяцу
            </span>
          </div>
        )}
        {!hasBot && (
          <p style={{ fontSize: '14px', color: 'var(--color-foreground-secondary)', marginBottom: '20px' }}>
            Создайте бота и воронку, чтобы начать получать выручку
          </p>
        )}
        <button
          onClick={() => setActiveTab('build')}
          className="btn btn-action"
          style={{ height: '40px' }}
        >
          {hasBot ? 'Редактировать воронку' : 'Создать воронку'}
          <ArrowRight size={15} />
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Лиды', value: hasBot ? '1 240' : '0' },
          { label: 'Конверсия', value: hasBot ? '11.4%' : '—' },
          { label: 'Продажи', value: hasBot ? '86' : '0' },
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
          <AreaChart data={hasBot ? STATS_DATA : []}>
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
        {hasBot ? (
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
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--color-foreground-tertiary)', fontSize: '14px', padding: '24px 0' }}>
            Событий пока нет
          </div>
        )}
      </div>
    </motion.div>
  );
};
