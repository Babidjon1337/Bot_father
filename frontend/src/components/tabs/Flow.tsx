import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, { Background, Controls, MiniMap, Handle, Position } from 'reactflow';
import type { Node, Edge, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import { cn } from '../../utils';
import type { FunnelNode } from '../../types';

interface FlowProps {
  blocks: FunnelNode[];
  setSelectedBlockId: (id: string) => void;
  updateBlock: (id: string, field: keyof FunnelNode, value: string) => void;
  setActiveTab: (tab: 'builder') => void;
}

// Custom Node Component to match the image style with editable delay
const CustomNode = ({ data }: NodeProps) => {
  return (
    <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden min-w-[220px] shadow-2xl">
      <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{data.type}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <div className="text-sm font-black text-foreground mb-1">{data.label}</div>
          <div className="text-[10px] text-muted-foreground font-bold">{data.subtitle}</div>
        </div>

        {data.kind === 'reminder' && (
          <div className="pt-2 border-t border-white/5">
            <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Задержка отправки</div>
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
              <input 
                type="text" 
                value={data.delay} 
                onChange={(e) => data.onUpdate('delay', e.target.value)}
                className="bg-transparent border-none outline-none text-[11px] font-black text-primary w-full"
              />
              <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-[#141414] !border-2 !border-primary !-top-1.5" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-[#141414] !border-2 !border-primary !-bottom-1.5" />
      <Handle type="source" position={Position.Right} id="right" className="!w-3 !h-3 !bg-[#141414] !border-2 !border-primary !-right-1.5" />
      <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !bg-[#141414] !border-2 !border-primary !-left-1.5" />
    </div>
  );
};

const nodeTypes = {
  funnel: CustomNode,
};

export const Flow = ({ blocks, setSelectedBlockId, updateBlock }: FlowProps) => {
  const flowNodes: Node[] = useMemo(() => blocks.map(block => ({
    id: block.id,
    type: 'funnel',
    data: { 
      label: block.step, 
      subtitle: block.subtitle,
      kind: block.kind,
      delay: block.delay,
      onUpdate: (field: keyof FunnelNode, value: string) => updateBlock(block.id, field, value),
      type: block.kind === 'reminder' ? 'Дожим' : block.kind === 'delivery' ? 'Выдача' : 'Сообщение'
    },
    position: { x: block.x, y: block.y },
  })), [blocks, updateBlock]);

  const flowEdges: Edge[] = useMemo(() => [
    // Main Vertical flow
    { 
      id: 'e-start-push1', 
      source: 'start', 
      target: 'push1', 
      animated: true, 
      style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2, strokeDasharray: '6,6' } 
    },
    { 
      id: 'e-push1-push2', 
      source: 'push1', 
      target: 'push2', 
      animated: true, 
      style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2, strokeDasharray: '6,6' } 
    },
    // Payment path
    { 
      id: 'e-start-payment', 
      source: 'start', 
      sourceHandle: 'right',
      target: 'payment', 
      targetHandle: 'left',
      label: 'оплата',
      labelStyle: { fill: '#fff', fontSize: 10, fontWeight: 900 },
      labelBgStyle: { fill: 'var(--color-primary)', rx: 8, fillOpacity: 0.9 },
      style: { stroke: 'var(--color-primary)', strokeWidth: 2, strokeDasharray: '6,6' } 
    },
    { 
      id: 'e-payment-delivery', 
      source: 'payment', 
      target: 'delivery', 
      style: { stroke: '#31d095', strokeWidth: 2, strokeDasharray: '6,6' } 
    },
  ], []);

  return (
    <motion.div 
      key="flow" 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="h-full min-h-[75vh] bg-[#0a0a0a] rounded-[48px] relative overflow-hidden border border-white/5"
    >
      <ReactFlow 
        nodes={flowNodes} 
        edges={flowEdges} 
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_, node) => {
          const tg = (window as any).Telegram?.WebApp;
          if (tg) tg.HapticFeedback.impactOccurred('light');
          setSelectedBlockId(node.id);
        }}
      >
        <Background color="#222" gap={24} size={1} />
        <Controls className="bg-[#141414] border-white/10 fill-white" />
        <MiniMap 
          nodeColor="#222" 
          maskColor="rgba(0,0,0,0.8)"
          className="bg-[#141414] border-white/10 rounded-3xl" 
        />
      </ReactFlow>
      
      <div className="absolute top-8 left-8 flex flex-col gap-2 pointer-events-none">
         <div className="bg-[#141414] border border-white/5 px-5 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">Логика конструктора</span>
         </div>
      </div>
    </motion.div>
  );
};
