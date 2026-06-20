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

export type TabType = 'home' | 'build' | 'flow' | 'profile';
export type SheetType = 'billing_first' | 'billing_renew' | 'bot_switcher' | 'bot_settings' | null;
export type PaymentProvider = 'yookassa' | 'robokassa' | 'prodamus';
export type DeliveryType = 'link' | 'invite' | 'file';

export interface BotConfig {
  id: string;
  name: string;
  username: string;
  status: 'active' | 'draft' | 'stopped';
  funnelComplete: boolean;
}

export interface AppState {
  activeBot: BotConfig | null;
  bots: BotConfig[];
  subscriptionStatus: 'none' | 'active' | 'expired';
  subscriptionUntil: string | null;
  userEmail: string;
  activeSheet: SheetType;
  isDirty: boolean;
}
