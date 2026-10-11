import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import type { OrderSummary } from '../types/shop.ts';
import { STORE_INFO } from '../data/mockData.ts';
import { formatUSD, formatZIG } from '../utils/currency.ts';
import { buildWhatsAppUrl, formatOrderMessage } from '../utils/whatsapp.ts';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const order = location.state as OrderSummary | null;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const whatsappUrl = buildWhatsAppUrl(STORE_INFO.whatsappClean, formatOrderMessage(order));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full bg-[#fafaf9]"
    >
      <div className="luxury-card p-8 sm:p-12 rounded-3xl bg-white border border-[#c59b27]/40 text-center shadow-xl relative overflow-hidden">
        {/* Soft Gold Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c59b27]/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Animated Checkmark Icon in Matte Gold */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-[#c59b27] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#c59b27]/30 mb-6"
        >
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </motion.div>

        <span className="text-xs font-black uppercase tracking-widest text-[#065f46]">
          Order Verified & Recorded
        </span>
        <h1 className="text-3xl font-black text-[#064e3b] mt-1 mb-2">Thank You, {order.customerName}!</h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
          Your order has been recorded in our Harare inventory system. Our team is preparing your
          items.
        </p>

        <div className="inline-block px-4 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs font-mono text-[#064e3b] mb-8">
          Order Reference: <strong className="text-stone-900 text-sm">{order.orderRef}</strong>
        </div>

        {/* Summary Card */}
        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-3 mb-8">
          <div className="flex justify-between py-1 border-b border-stone-200">
            <span className="text-stone-500">Product:</span>
            <span className="font-bold text-stone-900 text-right">{order.product.name}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-200">
            <span className="text-stone-500">Variant:</span>
            <span className="font-bold text-stone-900">
              Size {order.selectedSize} · {order.selectedColor} (Qty: {order.quantity})
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-200">
            <span className="text-stone-500">Fulfillment:</span>
            <span className="font-bold text-stone-900 capitalize">
              {order.deliveryOption === 'pickup'
                ? 'Store Pickup (Leopold Takawira St)'
                : order.deliveryAddress}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-200">
            <span className="text-stone-500">Payment:</span>
            <span className="font-bold text-[#064e3b] capitalize">
              {order.paymentMethod === 'ecocash' ? 'EcoCash Wallet' : 'Visa / Mastercard'}
            </span>
          </div>
          <div className="flex justify-between pt-2 text-sm">
            <span className="font-bold text-stone-900">Total Amount:</span>
            <div className="text-right">
              <span className="font-black text-[#064e3b]">{formatUSD(order.totalUSD)}</span>
              <span className="text-xs text-stone-500 block">({formatZIG(order.totalUSD)})</span>
            </div>
          </div>
        </div>

        {/* Actions: Emerald WhatsApp & Matte Gold Continue CTA */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-xl bg-[#064e3b] hover:bg-[#043e2e] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#064e3b]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Send Order Details to WhatsApp</span>
          </a>

          <Link
            to="/catalog"
            className="w-full py-3.5 px-6 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-[#c59b27]/20"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
