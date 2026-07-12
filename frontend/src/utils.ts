import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { BotConfig } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createBot = (existingCount: number): BotConfig => ({
  id: `b${existingCount + 1}`,
  name: 'Новый Бот',
  username: '@new_bot',
  status: 'inactive',
  usersCount: 0,
  isTokenLocked: false,
  funnelComplete: false,
});
