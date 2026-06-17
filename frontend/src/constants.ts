import type { FunnelNode } from './types';

export const INITIAL_BLOCKS: FunnelNode[] = [
  {
    id: 'start',
    step: 'Старт',
    subtitle: 'Первое сообщение',
    delay: '0 мин',
    kind: 'message',
    content: 'Привет! Посмотри это видео...',
    buttonText: '🚀 Начать',
    x: 250,
    y: 50
  },
  {
    id: 'push1',
    step: 'Дожим 1',
    subtitle: 'Через 1 час',
    delay: '1 час',
    kind: 'reminder',
    content: 'Вы забыли забрать бонус!',
    buttonText: '🎁 Забрать',
    x: 250,
    y: 200
  },
  {
    id: 'push2',
    step: 'Дожим 2',
    subtitle: 'Через 24 часа',
    delay: '24 часа',
    kind: 'reminder',
    content: 'Последний шанс на скидку!',
    buttonText: '🔥 Скидка',
    x: 250,
    y: 350
  },
  {
    id: 'payment',
    step: 'Оплата',
    subtitle: 'Счет на оплату',
    delay: 'Мгновенно',
    kind: 'message',
    content: 'Ваш счет на оплату готов.',
    buttonText: '💳 Оплатить',
    x: 500,
    y: 200
  },
  {
    id: 'delivery',
    step: 'Выдача',
    subtitle: 'После оплаты',
    delay: '0 мин',
    kind: 'delivery',
    content: 'Спасибо за покупку! Вот доступ.',
    buttonText: '📂 Открыть',
    x: 500,
    y: 400
  }
];
