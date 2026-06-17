import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, ShoppingBag, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils';
import type { TabType } from '../../types';

interface OverviewProps {
  setActiveTab: (tab: TabType) => void;
}

export const Overview = ({ setActiveTab }: OverviewProps) => {
  return (
    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 bg-card p-10 rounded-[48px] relative overflow-hidden flex flex-col justify-center min-h-[300px] border border-white/5">
            <div className="relative z-10">
              <span className="bg-success/20 text-success text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block">
                Система активна
              </span>
              <h3 className="text-4xl lg:text-5xl font-black mb-6 leading-tight text-foreground tracking-tight">Ваш бот приносит <br/><span className="text-primary">154 820 ₽</span> в месяц</h3>
              <p className="text-muted-foreground text-base max-w-lg leading-relaxed mb-10 font-medium">
                Воронка "NovaFlow" показывает отличные результаты. Конверсия из видео в оплату выросла на 12% за неделю.
              </p>
              <button onClick={() => setActiveTab('builder')} className="bg-foreground text-background px-10 py-4 rounded-3xl text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-2xl">
                Редактировать воронку
              </button>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
         </div>
         
         <div className="bg-card p-10 rounded-[48px] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8">
                <TrendingUp size={32} strokeWidth={2.5} />
              </div>
              <h4 className="font-black text-2xl mb-2 text-foreground">Статистика</h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">За последние 7 дней ваш бот обработал 1,240 лидов.</p>
            </div>
            <div className="mt-12 space-y-6">
              <div className="flex justify-between items-end">
                 <div className="text-4xl font-black text-foreground tabular-nums">11.4%</div>
                 <div className="text-sm text-success font-black tracking-wider">+2.1%</div>
              </div>
              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
              </div>
              <div className="text-[11px] text-muted-foreground/60 font-black uppercase tracking-[0.2em]">Конверсия в продажу</div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Просмотры', value: '5,241', color: 'primary', icon: Users },
           { label: 'Клики', value: '1,173', color: 'primary', icon: Zap },
           { label: 'Продажи', value: '86', color: 'success', icon: ShoppingBag },
           { label: 'Средний чек', value: '1,802 ₽', color: 'success', icon: CreditCard },
         ].map((stat, i) => (
           <div key={i} className="bg-card p-8 rounded-[40px] border border-white/5 group hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-6">
                 <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", 
                    stat.color === 'primary' ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                 )}>
                   <stat.icon size={24} strokeWidth={2.5} />
                 </div>
                 <div className="text-xs text-success font-black tracking-widest">+12%</div>
              </div>
              <div className="text-2xl font-black mb-2 text-foreground tabular-nums">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-[0.2em]">{stat.label}</div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-10 rounded-[48px] border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-xl flex items-center gap-3 text-foreground"><Clock size={20} className="text-primary" /> История событий</h4>
            <button className="text-[11px] font-black text-primary hover:underline uppercase tracking-widest">ВСЕ СОБЫТИЯ</button>
          </div>
          <div className="space-y-8">
            {[
              { title: 'Платеж успешно принят', desc: 'Пользователь @ivanov оплатил доступ к курсу.', time: '2 мин назад', status: 'success' },
              { title: 'Новый лид в воронке', desc: 'Зафиксирован вход через рекламную ссылку.', time: '15 мин назад', status: 'info' },
              { title: 'Дожим отправлен', desc: 'Блок "Дожим 1" доставлен 156 пользователям.', time: '1 час назад', status: 'warning' },
            ].map((event, i) => (
              <div key={i} className="flex gap-5 group">
                <div className={cn("w-2 h-2 rounded-full mt-2.5 shrink-0", 
                  event.status === 'success' ? "bg-success shadow-[0_0_10px_rgba(49,208,149,0.5)]" : 
                  event.status === 'warning' ? "bg-warning shadow-[0_0_10px_rgba(247,181,0,0.5)]" : "bg-primary shadow-[0_0_10px_rgba(46,166,255,0.5)]"
                )} />
                <div>
                  <div className="text-base font-bold group-hover:text-primary transition-colors text-foreground">{event.title}</div>
                  <div className="text-sm text-muted-foreground mt-1.5 font-medium leading-relaxed">{event.desc}</div>
                  <div className="text-[10px] text-muted-foreground/40 mt-3 font-black uppercase tracking-widest">{event.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card p-10 rounded-[48px] border border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
           <h4 className="font-black text-xl mb-3 text-foreground tracking-tight">Быстрый старт</h4>
           <p className="text-sm text-muted-foreground mb-8 leading-relaxed font-medium">Следуйте этим шагам, чтобы максимизировать прибыль вашего бота.</p>
           <div className="space-y-4">
              {[
                { text: 'Подключите ЮKassa для приема оплат', done: true },
                { text: 'Добавьте видео-презентацию в первый блок', done: true },
                { text: 'Настройте дожим через 24 часа', done: false },
                { text: 'Проверьте работу Webhook', done: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                  {item.done ? <CheckCircle2 size={24} strokeWidth={3} className="text-success" /> : <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30" />}
                  <span className={cn("text-sm font-bold", item.done ? "text-foreground" : "text-muted-foreground")}>{item.text}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
};
