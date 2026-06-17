import { motion } from 'framer-motion';
import { CreditCard, Zap, ExternalLink } from 'lucide-react';
import { cn } from '../../utils';

export const Settings = () => {
  return (
    <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      <div className="glass p-8 rounded-[40px] border-white/5">
         <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-[32px] bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary/20">Р</div>
            <div>
               <h3 className="text-2xl font-black mb-1 text-foreground">Родион</h3>
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
               <div className="font-bold text-sm text-foreground">rodion@novaflow.app</div>
            </div>
            <div className="p-5 rounded-[28px] bg-white/5 border border-white/5">
               <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Telegram ID</div>
               <div className="font-bold text-sm text-foreground">123456789</div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[40px] border-white/5">
          <h4 className="font-bold mb-6 flex items-center gap-2 text-foreground"><CreditCard size={18} className="text-primary" /> Подписка</h4>
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-[32px] mb-6">
             <div className="text-xs font-black text-primary uppercase tracking-widest mb-1">Текущий тариф</div>
             <div className="text-2xl font-black mb-4 text-foreground">PRO Annual</div>
             <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">Следующее списание:</span>
                <span className="font-bold text-foreground">24 июля 2026</span>
             </div>
          </div>
          <button className="w-full bg-white text-black font-black py-4 rounded-2xl text-sm hover:scale-[1.02] active:scale-95 transition-transform shadow-xl">
            УПРАВЛЯТЬ ПОДПИСКОЙ
          </button>
        </div>

        <div className="glass p-8 rounded-[40px] border-white/5">
          <h4 className="font-bold mb-6 flex items-center gap-2 text-foreground"><Zap size={18} className="text-primary" /> Интеграции</h4>
          <div className="space-y-3">
             {[
               { name: 'ЮKassa', status: 'Активно', active: true },
               { name: 'Prodamus', status: 'Отключено', active: false },
               { name: 'S3 Storage', status: 'Активно', active: true },
               { name: 'Webhooks', status: 'Активно', active: true },
             ].map((int, i) => (
               <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-foreground">{int.name}</span>
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
            <h4 className="font-bold mb-1 text-foreground">API Ключи</h4>
            <p className="text-xs text-muted-foreground">Используйте ключи для интеграции с внешними сервисами.</p>
         </div>
         <button className="flex items-center gap-2 bg-muted-foreground/10 text-foreground border border-white/10 px-6 py-3 rounded-2xl text-xs font-black hover:bg-white/10 transition-all">
            СГЕНЕРИРОВАТЬ КЛЮЧ <ExternalLink size={14} />
         </button>
      </div>
    </motion.div>
  );
};
