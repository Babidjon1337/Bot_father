export interface FunnelNode {
  id: string;
  step: string;
  subtitle: string;
  delay: string;
  kind: 'message' | 'reminder' | 'delivery';
  content: string;
  buttonText: string;
  x: number;
  y: number;
}

export type TabType = 'overview' | 'builder' | 'flow' | 'stats' | 'settings';
