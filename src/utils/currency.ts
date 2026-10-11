import type { DeliveryOption } from '../types/shop.ts';

export const USD_TO_ZIG_RATE = 26.5;

export function convertToZIG(usdAmount: number): number {
  return Math.round(usdAmount * USD_TO_ZIG_RATE);
}

export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatZIG(amount: number): string {
  const zigVal = convertToZIG(amount);
  return `ZiG ${zigVal.toLocaleString()}`;
}

export function calculateDeliveryTotal(baseUSD: number, deliveryOption: DeliveryOption): number {
  return deliveryOption === 'delivery' ? baseUSD + 3 : baseUSD;
}
