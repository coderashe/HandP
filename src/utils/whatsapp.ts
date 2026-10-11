import type { OrderSummary } from '../types/shop.ts';
import { formatUSD, formatZIG } from './currency.ts';

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = cleanPhoneNumber(phone);
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function formatProductInquiry(
  productName: string,
  size: string,
  color: string,
  brand: string
): string {
  return `Hi H & P Shoes! 👟 I'm interested in the *${productName}* by ${brand}.\n\n📏 Size: ${size}\n🎨 Color: ${color}\n\nCould you please confirm availability and pricing? Thank you!`;
}

export function formatOrderMessage(order: OrderSummary): string {
  const deliveryText =
    order.deliveryOption === 'pickup'
      ? '🏪 Store Pickup (Leopold Takawira St, Harare)'
      : `🚚 Delivery to: ${order.deliveryAddress || 'Address provided on checkout'}`;

  const paymentText =
    order.paymentMethod === 'ecocash' ? '📱 EcoCash Mobile Wallet' : '💳 Visa / Mastercard';

  return `*🛍️ NEW ORDER CONFIRMATION — H & P SHOES*\n` +
    `-----------------------------------------\n` +
    `*Order Reference:* ${order.orderRef}\n` +
    `*Date & Time:* ${new Date(order.timestamp).toLocaleString()}\n\n` +
    `*Customer Details:*\n` +
    `• Name: ${order.customerName}\n` +
    `• Phone: ${order.customerPhone}\n\n` +
    `*Item Ordered:*\n` +
    `• Product: *${order.product.name}*\n` +
    `• Brand: ${order.product.brand}\n` +
    `• Size: ${order.selectedSize}\n` +
    `• Color: ${order.selectedColor}\n` +
    `• Quantity: ${order.quantity}\n\n` +
    `*Fulfillment & Payment:*\n` +
    `• Option: ${deliveryText}\n` +
    `• Method: ${paymentText}\n` +
    `• Total: *${formatUSD(order.totalUSD)}* (${formatZIG(order.totalUSD)})\n\n` +
    `-----------------------------------------\n` +
    `Thank you for shopping with Harare's Premium Fashion Destination! 👟✨`;
}

export function formatStoreInquiry(name: string, phone: string, message: string): string {
  return `*💬 STORE INQUIRY — H & P SHOES*\n` +
    `• From: *${name}*\n` +
    `• Phone: ${phone}\n\n` +
    `*Message:*\n${message}\n\n` +
    `Sent from Harare Fashion Online Portal.`;
}
