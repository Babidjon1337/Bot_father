import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, { Background, Controls, Handle, Position } from 'reactflow';
import type { Edge, NodeProps, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { MessageCircle, Bell, CreditCard, FileBox, FileText } from 'lucide-react';
import type { FunnelNode } from '../../types';

interface FlowProps {
  blocks: FunnelNode[];
  setSelectedBlockId: (id: string) => void;
  updateBlock: (id: string, field: keyof FunnelNode, value: string) => void;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
}

const BLOCK_COLORS = {
  offer:    { bg: 'var(--color-surface-2)', border: 'var(--color-border-strong)', text: 'var(--color-foreground-secondary)', icon: FileText },
  message:  { bg: 'var(--color-primary-soft)', border: 'var(--color-primary)', text: 'var(--color-primary)', icon: MessageCircle },
  reminder: { bg: 'var(--color-warning-soft)', border: 'var(--color-warning)', text: 'var(--color-warning)', icon: Bell },
  payment:  { bg: 'var(--color-accent-soft)', border: 'var(--color-accent)', text: 'var(--color-accent)', icon: CreditCard },
  delivery: { bg: 'var(--color-success-soft)', border: 'var(--color-success)', text: 'var(--color-success)', icon: FileBox },
};

const CustomNode = ({ data }: NodeProps) => {
  const { title, subtitle, kind, content, buttonText } = data;
  const colors = BLOCK_COLORS[kind as keyof typeof BLOCK_COLORS] || BLOCK_COLORS.message;
  const Icon = colors.icon;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: `2px solid ${colors.border}`,
        borderRadius: '16px',
        width: '280px',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      <div style={{ background: colors.bg, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1px solid ${colors.border}` }}>
        <Icon size={18} style={{ color: colors.text }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: colors.text, lineHeight: 1.2 }}>{title}</div>
          <div style={{ fontSize: '12px', color: colors.text, opacity: 0.8 }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {content && (
          <div style={{
            background: 'var(--color-surface-2)',
            padding: '10px 12px',
            borderRadius: '12px',
            fontSize: '13px',
            color: 'var(--color-foreground)',
            lineHeight: 1.5,
            borderBottomLeftRadius: '4px',
            maxWidth: '90%',
          }}>
            {content.length > 60 ? content.substring(0, 60) + '...' : content}
          </div>
        )}
        {buttonText && (
          <div style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            padding: '8px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            textAlign: 'center',
            color: 'var(--color-primary)',
          }}>
            {buttonText}
          </div>
        )}
        {!content && !buttonText && (
          <div style={{ fontSize: '13px', color: '#94A3B8', fontStyle: 'italic' }}>
            Нет контента
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Top} id="top" style={{ background: colors.border, width: '10px', height: '10px' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: colors.border, width: '10px', height: '10px' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: colors.border, width: '10px', height: '10px' }} />
      <Handle type="target" position={Position.Left} id="left" style={{ background: colors.border, width: '10px', height: '10px' }} />
    </div>
  );
};

export const Flow = ({ blocks, setSelectedBlockId, setActiveTab, theme }: FlowProps) => {
  const getBlock = (id: string) => blocks.find(b => b.id === id);

  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
  }), []);

  const flowNodes: Node[] = useMemo(() => [
    {
      id: 'offer',
      type: 'custom',
      position: { x: 250, y: 50 },
      data: { title: 'Оферта', subtitle: 'Шаг 0', kind: 'offer', content: 'Ссылка на договор оферты' },
    },
    {
      id: 'start',
      type: 'custom',
      position: { x: 250, y: 250 },
      data: { title: 'Первое сообщение', subtitle: 'Мгновенно', kind: 'message', content: getBlock('start')?.content, buttonText: getBlock('start')?.buttonText },
    },
    {
      id: 'push1',
      type: 'custom',
      position: { x: 250, y: 480 },
      data: { title: 'Дожим 1', subtitle: getBlock('push1')?.delay || '1 час', kind: 'reminder', content: getBlock('push1')?.content, buttonText: getBlock('push1')?.buttonText },
    },
    {
      id: 'push2',
      type: 'custom',
      position: { x: 250, y: 710 },
      data: { title: 'Дожим 2', subtitle: getBlock('push2')?.delay || '24 часа', kind: 'reminder', content: getBlock('push2')?.content, buttonText: getBlock('push2')?.buttonText },
    },
    {
      id: 'payment',
      type: 'custom',
      position: { x: 650, y: 250 },
      data: { title: 'Оплата', subtitle: 'Мгновенно', kind: 'payment', content: 'Счет на оплату сформирован.', buttonText: 'Оплатить' },
    },
    {
      id: 'delivery',
      type: 'custom',
      position: { x: 650, y: 480 },
      data: { title: 'Выдача', subtitle: 'После оплаты', kind: 'delivery', content: getBlock('delivery')?.content },
    },
  ], [blocks]);

  const flowEdges: Edge[] = useMemo(() => [
    { id: 'e-offer-start', source: 'offer', sourceHandle: 'bottom', target: 'start', targetHandle: 'top', type: 'smoothstep', style: { stroke: '#94A3B8', strokeWidth: 2 } },
    { id: 'e-start-push1', source: 'start', sourceHandle: 'bottom', target: 'push1', targetHandle: 'top', type: 'smoothstep', animated: true, style: { stroke: '#CBD5E1', strokeWidth: 2 } },
    { id: 'e-push1-push2', source: 'push1', sourceHandle: 'bottom', target: 'push2', targetHandle: 'top', type: 'smoothstep', animated: true, style: { stroke: '#CBD5E1', strokeWidth: 2 } },
    { id: 'e-start-payment', source: 'start', sourceHandle: 'right', target: 'payment', targetHandle: 'left', type: 'smoothstep', style: { stroke: '#3B82F6', strokeWidth: 2 } },
    { id: 'e-push1-payment', source: 'push1', sourceHandle: 'right', target: 'payment', targetHandle: 'left', type: 'smoothstep', style: { stroke: '#F59E0B', strokeWidth: 2 } },
    { id: 'e-push2-payment', source: 'push2', sourceHandle: 'right', target: 'payment', targetHandle: 'left', type: 'smoothstep', style: { stroke: '#F59E0B', strokeWidth: 2 } },
    { id: 'e-payment-delivery', source: 'payment', sourceHandle: 'bottom', target: 'delivery', targetHandle: 'top', type: 'smoothstep', style: { stroke: '#A855F7', strokeWidth: 2 } },
  ], []);

  return (
    <motion.div
      key="flow"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 w-full"
      style={{
        background: 'var(--color-surface-2)',
      }}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_, node) => {
          const tg = (window as any).Telegram?.WebApp;
          if (tg) tg.HapticFeedback.impactOccurred('light');
          setSelectedBlockId(node.id === 'delivery' ? 'after_payment' : node.id);
          setActiveTab('build');
        }}
      >
        <Background color={theme === 'dark' ? '#38383A' : '#CBD5E1'} gap={16} />
        <Controls style={{ display: 'flex', flexDirection: 'column', gap: '5px' }} />
      </ReactFlow>
    </motion.div>
  );
};
