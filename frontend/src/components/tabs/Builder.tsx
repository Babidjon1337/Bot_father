import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { cn } from '../../utils';
import type { FunnelNode } from '../../types';

interface BuilderProps {
  blocks: FunnelNode[];
  selectedBlockId: string;
  setSelectedBlockId: (id: string) => void;
  updateBlock: (id: string, field: keyof FunnelNode, value: string) => void;
}

export const Builder = ({ blocks, selectedBlockId, setSelectedBlockId, updateBlock }: BuilderProps) => {
  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || blocks[0];

  return (
    <motion.div key="builder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid lg:grid-cols-[1fr_400px] gap-8 h-full">
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
           <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Цепочка сообщений</div>
           <button className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-xl text-xs font-black hover:bg-primary hover:text-white transition-all">
             <Plus size={14} strokeWidth={3} /> ДОБАВИТЬ ШАГ
           </button>
        </div>

        <div className="space-y-4">
          {blocks.map((block, idx) => (
            <motion.div 
              key={block.id}
              layout
              onClick={() => setSelectedBlockId(block.id)}
              className={cn(
                "glass p-6 rounded-[32px] cursor-pointer transition-all duration-300 border-2",
                selectedBlockId === block.id ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-2xl" : "border-white/5 hover:border-white/10"
              )}
            >
              <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner",
                      block.kind === 'message' ? "bg-primary text-white" : 
                      block.kind === 'reminder' ? "bg-warning text-black" : "bg-success text-white"
                    )}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{block.step}</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{block.subtitle}</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                   <Clock size={12} className="text-muted-foreground" />
                   <span className="text-[10px] font-bold text-muted-foreground">{block.delay}</span>
                 </div>
              </div>
              
              <div className="relative group">
                <textarea 
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-foreground focus:border-primary/50 focus:bg-white/10 outline-none transition-all resize-none mb-4 leading-relaxed h-24"
                />
                <div className="absolute right-3 bottom-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   <span className="text-[10px] text-muted-foreground font-mono">{block.content.length} chars</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                     <CreditCard size={14} />
                   </div>
                   <input 
                     value={block.buttonText}
                     onChange={(e) => updateBlock(block.id, 'buttonText', e.target.value)}
                     className="bg-transparent border-none outline-none font-bold text-sm w-full text-foreground"
                   />
                 </div>
                 <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="hidden lg:block">
        <div className="sticky top-8 w-full">
          <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 px-4">Live Preview</div>
          <div className="relative mx-auto w-[320px] h-[640px] bg-black rounded-[50px] border-[10px] border-[#1a1a1a] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
             {/* Phone Top Bar */}
             <div className="h-8 bg-black flex items-center justify-between px-8 text-[10px] text-white font-bold pt-2">
                <span>9:41</span>
                <div className="flex gap-1.5">
                   <div className="w-4 h-2 bg-white rounded-[2px]" />
                </div>
             </div>
             
             {/* Telegram Header */}
             <div className="bg-[#17212b] p-3 flex items-center gap-3 border-b border-black/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-black text-xs">BF</div>
                <div>
                  <div className="text-white text-xs font-bold leading-none">NovaFlow Bot</div>
                  <div className="text-primary text-[10px] mt-1 font-medium">bot</div>
                </div>
             </div>

             <div className="bg-[#0e1621] flex-1 p-4 flex flex-col justify-end bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover relative">
                <div className="absolute inset-0 bg-black/40" />
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={selectedBlockId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="relative z-10 space-y-3"
                  >
                     <div className="bg-[#182533] text-white p-4 rounded-[22px] rounded-bl-sm max-w-[90%] text-[13px] shadow-lg border border-white/5 leading-relaxed">
                       {selectedBlock.content}
                     </div>
                     <motion.div 
                       whileTap={{ scale: 0.95 }}
                       className="bg-primary text-white p-3.5 rounded-[18px] font-black text-sm text-center shadow-lg shadow-primary/30 cursor-pointer"
                     >
                       {selectedBlock.buttonText}
                     </motion.div>
                  </motion.div>
                </AnimatePresence>
             </div>
             
             {/* Phone Bottom Bar */}
             <div className="h-12 bg-[#17212b] flex items-center px-4 gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white">📎</div>
                <div className="flex-1 h-8 bg-black/20 rounded-full border border-white/5" />
                <div className="w-6 h-6 text-primary">💬</div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
