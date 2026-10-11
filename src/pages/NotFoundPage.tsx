import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 w-full bg-[#fafaf9]"
    >
      <div className="luxury-card p-10 sm:p-14 rounded-3xl bg-white border border-[#c59b27]/30 text-center max-w-md w-full shadow-xl relative overflow-hidden">
        {/* Ambient Gold Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#c59b27]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="text-7xl sm:text-8xl font-black text-[#064e3b] mb-4 tracking-tighter">
          404
        </div>

        <h1 className="text-2xl font-black text-[#064e3b] mb-2">Page Not Found</h1>

        <p className="text-xs text-stone-600 leading-relaxed mb-8">
          The requested page could not be located in our Harare showroom catalog. It may have moved or
          is no longer available.
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full py-3.5 px-6 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-[#c59b27]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/catalog"
            className="w-full py-3 px-6 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-600/40 text-[#065f46] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
