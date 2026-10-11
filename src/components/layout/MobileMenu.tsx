import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, ShoppingBag, MapPin, ExternalLink, Phone } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo.tsx';
import { STORE_INFO, CATEGORIES } from '../../data/mockData.ts';
import { buildWhatsAppUrl } from '../../utils/whatsapp.ts';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  cartCount,
}) => {
  const whatsappUrl = buildWhatsAppUrl(
    STORE_INFO.whatsappClean,
    "Hello H & P Shoes! I'm browsing your online collection and would like to inquire."
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 lg:hidden"
          />

          {/* Drawer Panel: Crisp White (60%) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white border-l border-stone-200 z-50 lg:hidden flex flex-col justify-between overflow-y-auto p-6 shadow-2xl"
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-stone-200">
                <BrandLogo size="sm" darkMode={false} />
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer p-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links (Emerald 30%) */}
              <nav className="flex flex-col gap-2 mt-6">
                <Link
                  to="/"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl text-base font-semibold text-stone-800 hover:text-[#064e3b] hover:bg-emerald-50/60 transition-all"
                >
                  Home
                </Link>
                <Link
                  to="/catalog"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl text-base font-semibold text-stone-800 hover:text-[#064e3b] hover:bg-emerald-50/60 transition-all flex items-center justify-between"
                >
                  <span>Catalog & Shop</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#064e3b] font-bold">
                    All Items
                  </span>
                </Link>
                <Link
                  to="/store"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl text-base font-semibold text-stone-800 hover:text-[#064e3b] hover:bg-emerald-50/60 transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-[#c59b27]" />
                  Our Harare Store
                </Link>
              </nav>

              {/* Quick Categories list */}
              <div className="mt-6 pt-6 border-t border-stone-200">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 px-4">
                  Shop By Category
                </span>
                <div className="flex flex-col gap-1 mt-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/catalog?category=${cat.id}`}
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg text-sm text-stone-600 hover:text-[#064e3b] hover:bg-emerald-50/40 transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Matte Gold CTA (10%) and Emerald Button */}
            <div className="pt-6 border-t border-stone-200 space-y-3 mt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#064e3b] hover:bg-[#053e2f] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>

              <Link
                to="/catalog"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#c59b27]/25 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Now {cartCount > 0 && `(${cartCount} in bag)`}
              </Link>

              <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                <a
                  href={`tel:${STORE_INFO.whatsappClean}`}
                  className="flex items-center gap-1 hover:text-[#064e3b]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c59b27]" />
                  {STORE_INFO.whatsappDisplay}
                </a>
                <a
                  href={STORE_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#064e3b]"
                >
                  Facebook <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
