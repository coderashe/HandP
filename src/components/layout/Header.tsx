import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Menu } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo.tsx';
import { MobileMenu } from './MobileMenu.tsx';
import { useCart } from '../../hooks/useCart.ts';
import { STORE_INFO } from '../../data/mockData.ts';
import { buildWhatsAppUrl } from '../../utils/whatsapp.ts';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  const whatsappGeneralUrl = buildWhatsAppUrl(
    STORE_INFO.whatsappClean,
    'Hi H & P Shoes! I would like to inquire about your current stock.'
  );

  const scrollToContact = (e: React.MouseEvent) => {
    if (location.pathname === '/' || location.pathname === '/store') {
      const footer = document.getElementById('store-contact-footer');
      if (footer) {
        e.preventDefault();
        footer.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const announcementText =
    '✦ NEW ARRIVALS IN STORE  ✦  LEOPOLD TAKAWIRA ST HARARE  ✦  ECOCASH & CARD ACCEPTED  ✦  FREE IN-STORE FITTING  ✦  DIASPORA ORDERS WELCOME  ✦';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        {/* Top announcement marquee bar: Royal Emerald with Matte Gold & White typography */}
        <div className="bg-[#064e3b] text-white py-1.5 overflow-hidden select-none border-b border-[#043d2e]">
          <div className="flex animate-marquee text-[11px] font-bold tracking-widest uppercase">
            <span className="mx-4 text-emerald-100">
              <span className="text-[#c59b27] mr-2">✦</span>
              NEW ARRIVALS IN STORE
              <span className="text-[#c59b27] mx-2">✦</span>
              LEOPOLD TAKAWIRA ST HARARE
              <span className="text-[#c59b27] mx-2">✦</span>
              ECOCASH & CARD ACCEPTED
              <span className="text-[#c59b27] mx-2">✦</span>
              FREE IN-STORE FITTING
              <span className="text-[#c59b27] mx-2">✦</span>
              DIASPORA ORDERS WELCOME
            </span>
            <span className="mx-4 text-emerald-100">
              <span className="text-[#c59b27] mr-2">✦</span>
              NEW ARRIVALS IN STORE
              <span className="text-[#c59b27] mx-2">✦</span>
              LEOPOLD TAKAWIRA ST HARARE
              <span className="text-[#c59b27] mx-2">✦</span>
              ECOCASH & CARD ACCEPTED
              <span className="text-[#c59b27] mx-2">✦</span>
              FREE IN-STORE FITTING
              <span className="text-[#c59b27] mx-2">✦</span>
              DIASPORA ORDERS WELCOME
            </span>
          </div>
        </div>

        {/* Main Header Container: Crisp White 60% */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Left: Brand Logo */}
            <Link to="/" className="flex items-center group">
              <BrandLogo size="md" darkMode={false} />
            </Link>

            {/* Center: Desktop Navigation Links (Emerald 30%) */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-semibold transition-colors duration-200 py-1 ${
                  location.pathname === '/'
                    ? 'text-[#064e3b] font-bold border-b-2 border-[#c59b27]'
                    : 'text-stone-600 hover:text-[#064e3b]'
                }`}
              >
                Home
              </Link>
              <Link
                to="/catalog"
                className={`text-sm font-semibold transition-colors duration-200 py-1 ${
                  location.pathname === '/catalog'
                    ? 'text-[#064e3b] font-bold border-b-2 border-[#c59b27]'
                    : 'text-stone-600 hover:text-[#064e3b]'
                }`}
              >
                Catalog
              </Link>
              <Link
                to="/store"
                className={`text-sm font-semibold transition-colors duration-200 py-1 ${
                  location.pathname === '/store'
                    ? 'text-[#064e3b] font-bold border-b-2 border-[#c59b27]'
                    : 'text-stone-600 hover:text-[#064e3b]'
                }`}
              >
                Our Store
              </Link>
              <a
                href="#store-contact-footer"
                onClick={scrollToContact}
                className="text-sm font-semibold text-stone-600 hover:text-[#064e3b] transition-colors duration-200 cursor-pointer"
              >
                Contact
              </a>
            </nav>

            {/* Right: Actions (Matte Gold 10% CTA) */}
            <div className="flex items-center gap-3">
              {/* WhatsApp Button: Soft Emerald pill */}
              <a
                href={whatsappGeneralUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp H & P Shoes"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 text-[#065f46] text-xs font-bold transition-all shadow-2xs group"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>WhatsApp</span>
              </a>

              {/* Cart Button */}
              <Link
                to="/catalog"
                title="Shopping Bag"
                className="relative p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-[#064e3b] transition-all flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#c59b27] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Shop Now Matte Gold CTA */}
              <Link
                to="/catalog"
                className="hidden lg:flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-extrabold text-xs tracking-wider uppercase shadow-md shadow-[#c59b27]/25 transition-all active:scale-95 cursor-pointer"
              >
                Shop Now
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 hover:text-[#064e3b] cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out mobile drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        cartCount={cartCount}
      />
    </>
  );
};
