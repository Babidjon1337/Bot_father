import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ReChartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '../../utils';

const STATS_DATA = [
  { name: 'Пн', views: 400, sales: 24 },
  { name: 'Вт', views: 300, sales: 18 },
  { name: 'Ср', views: 600, sales: 45 },
  { name: 'Чт', views: 800, sales: 52 },
  { name: 'Пт', views: 500, sales: 38 },
  { name: 'Сб', views: 900, sales: 67 },
  { name: 'Вс', views: 700, sales: 50 },
];

export const Stats = () => {
  return (
     <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass p-8 rounded-[40px] bg-gradient-to-br from-primary/20 to-transparent border-primary/20 flex flex-col justify-between">
             <div>
               <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Выручка месяца</div>
               <div className="text-4xl font-black mb-2 tracking-tighter text-foreground">154 820 ₽</div>
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
                <div className="text-3xl font-black mb-2 tracking-tighter text-foreground">{stat.value}</div>
              </div>
              <div className={cn("text-xs font-bold", stat.color === 'success' ? "text-success" : "text-primary")}>
                {stat.change} за неделю
              </div>
            </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-[40px] h-[400px] border-white/5">
            <h4 className="font-bold mb-8 flex justify-between items-center text-foreground">
              График активности
              <div className="flex gap-2">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground"><div className="w-2 h-2 rounded-full bg-primary" /> ПРОСМОТРЫ</div>
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground"><div className="w-2 h-2 rounded-full bg-success" /> ПРОДАЖИ</div>
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
            <h4 className="font-bold mb-8 text-foreground">Воронка конверсии</h4>
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
                      <div className="text-sm font-bold text-foreground">{step.label}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{step.value} пользователей</div>
                    </div>
                    <div className={cn("text-xl font-black", 
                      step.color === 'primary' ? "text-primary" : 
                      step.color === 'warning' ? "text-warning" : "text-success"
                    )}>{step.pct}%</div>
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
  );
};
