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

export type TabType = 'home' | 'build' | 'flow' | 'profile' | 'subscription' | 'manage';
export type SheetType = 'billing_first' | 'billing_renew' | 'bot_switcher' | 'bot_settings' | 'checkout' | 'bot_create' | null;
export type PaymentProvider = 'yookassa' | 'robokassa' | 'prodamus';
export type DeliveryType = 'link' | 'invite' | 'file';

export interface BotConfig {
  id: string;
  name: string;
  username: string;
  status: 'active' | 'inactive'; // active means receiving traffic
  usersCount: number;
  isTokenLocked: boolean;
  token?: string;
  paymentProvider?: string;
  paymentKeys?: Record<string, string>;
  paymentAmount?: string;
  funnelComplete: boolean;
}

export interface AppState {
  activeBot: BotConfig | null;
  bots: BotConfig[];
  subscriptionStatus: 'none' | 'active' | 'expired';
  subscriptionUntil: string | null;
  slotsBought: number;
  userEmail: string;
  activeSheet: SheetType;
  sheetData?: any;
  isDirty: boolean;
}
