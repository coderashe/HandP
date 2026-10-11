import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Footprints,
  ShoppingBag,
  Send,
  Navigation,
} from 'lucide-react';
import { STORE_INFO } from '../data/mockData.ts';
import { buildWhatsAppUrl, formatStoreInquiry } from '../utils/whatsapp.ts';

export const StorePage: React.FC = () => {
  // Opening logic
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday
  const isOpen = day >= 1 && day <= 6 ? hour >= 8 && hour < 18 : hour >= 10 && hour < 15;

  // Contact form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;
    const msg = formatStoreInquiry(formName, formPhone || 'Not provided', formMessage);
    const url = buildWhatsAppUrl(STORE_INFO.whatsappClean, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const directWhatsAppUrl = buildWhatsAppUrl(
    STORE_INFO.whatsappClean,
    'Hi H & P Shoes! I am planning to visit your Harare showroom today.'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full bg-[#fafaf9]"
    >
      {/* 1. PAGE HEADER */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#b8860b] block mb-2">
          Find Us in Central Harare
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#064e3b] tracking-tight">
          Visit Our <span className="text-[#043d2e] underline decoration-[#c59b27] decoration-4 underline-offset-8">Harare Showroom</span>
        </h1>
        <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
          Conveniently located on Leopold Takawira Street. Step inside for private styling, authentic
          shoe sizing, and luxury shopping.
        </p>
      </div>

      {/* 2. TWO-COLUMN LAYOUT: STORE INFO & MOCK MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
        {/* Left Column: Store Info Card (6 cols) */}
        <div className="lg:col-span-6 luxury-card p-8 rounded-3xl bg-white border border-stone-200/90 shadow-md space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Live Open / Closed Indicator */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Operating Status
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOpen ? 'bg-emerald-600 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span
                  className={`text-xs font-extrabold tracking-wider uppercase ${
                    isOpen ? 'text-[#065f46]' : 'text-rose-600'
                  }`}
                >
                  {isOpen ? 'Currently Open' : 'Currently Closed'}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#065f46] block">
                Showroom Address
              </span>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-stone-900 text-base leading-snug">
                    {STORE_INFO.address}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Opposite Dolphin House / Central Harare Business District
                  </p>
                </div>
              </div>
            </div>

            {/* Opening Hours Table */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#065f46] block">
                Showroom Trading Hours
              </span>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Monday – Saturday:</span>
                  <span className="font-bold text-stone-900">8:00 AM – 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Sunday:</span>
                  <span className="font-bold text-stone-900">10:00 AM – 3:00 PM</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-200 text-emerald-800 font-medium">
                  <span>Public Holidays:</span>
                  <span>Special Hours (Check WhatsApp)</span>
                </div>
              </div>
            </div>

            {/* Direct Contacts */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#065f46] block">
                Contact & Inquiries
              </span>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${STORE_INFO.whatsappClean}`}
                  className="flex-1 p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#064e3b] text-xs flex items-center gap-2.5 text-stone-800 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#c59b27] shrink-0" />
                  <span className="font-mono font-medium">{STORE_INFO.whatsappDisplay}</span>
                </a>

                <a
                  href={`mailto:${STORE_INFO.email}`}
                  className="flex-1 p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#064e3b] text-xs flex items-center gap-2.5 text-stone-800 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#c59b27] shrink-0" />
                  <span className="truncate font-medium">{STORE_INFO.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Action CTAs: Emerald Directions & Matte Gold WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-stone-100">
            <a
              href={STORE_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-white border-2 border-[#064e3b] hover:bg-emerald-50 text-[#064e3b] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#c59b27]/25 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Showroom</span>
            </a>
          </div>
        </div>

        {/* Right Column: Mock Map Card (6 cols) */}
        <div
          className="lg:col-span-6 luxury-card rounded-3xl border border-stone-200 overflow-hidden relative flex flex-col justify-between min-h-[440px] shadow-md"
          style={{
            backgroundImage:
              'repeating-linear-gradient(#e7e5e4 0px, #e7e5e4 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #e7e5e4 0px, #e7e5e4 1px, transparent 1px, transparent 40px)',
            backgroundColor: '#f5f5f4',
          }}
        >
          {/* Street Grid Graphic Representation */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            {/* Leopold Takawira Axis Line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-14 -translate-x-1/2 bg-emerald-100/70 border-x border-emerald-300 flex items-center justify-center">
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#064e3b] font-bold rotate-90 whitespace-nowrap">
                LEOPOLD TAKAWIRA ST
              </span>
            </div>
            {/* Cross Street Line */}
            <div className="absolute left-0 right-0 top-1/2 h-10 -translate-y-1/2 bg-stone-200/80 border-y border-stone-300 flex items-center px-4">
              <span className="text-[10px] tracking-widest uppercase font-mono text-stone-600 font-bold">
                HARARE CBD CORRIDOR
              </span>
            </div>
          </div>

          {/* Top Bar on Map */}
          <div className="p-4 relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-white/90 border border-stone-300 text-[10px] font-bold text-[#064e3b] uppercase tracking-wider shadow-xs backdrop-blur-xs">
              Harare City Center · 52CW+952
            </span>
          </div>

          {/* Center Location Pin with Pulsing Glow in Deep Royal Emerald with Gold Ring */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-md animate-ping" />
              <div className="w-14 h-14 rounded-full bg-[#064e3b] border-2 border-[#c59b27] text-white flex items-center justify-center shadow-xl relative z-10">
                <MapPin className="w-8 h-8 fill-white" />
              </div>
            </div>
            <div className="mt-3 px-3.5 py-1.5 rounded-lg bg-white border border-[#c59b27] text-xs font-black text-[#064e3b] shadow-lg">
              H & P SHOES SHOWROOM
            </div>
          </div>

          {/* Bottom Card on Map */}
          <div className="p-6 relative z-10 bg-white/95 backdrop-blur-md border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="font-bold text-sm text-stone-900">52CW+952 Dolphin 123</h4>
              <p className="text-xs text-stone-500">Leopold Takawira St, Harare, Zimbabwe</p>
            </div>
            <a
              href={STORE_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-md shadow-[#c59b27]/20"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. GETTING HERE & LANDMARKS */}
      <div className="luxury-card p-8 rounded-3xl bg-white border border-stone-200 mb-16 space-y-4 shadow-xs">
        <h3 className="text-lg font-bold text-[#064e3b] flex items-center gap-2">
          <Navigation className="w-5 h-5 text-[#c59b27]" />
          <span>Directions & Nearby Landmarks</span>
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed">
          Our boutique is situated along the vibrant Leopold Takawira commercial stretch in central
          Harare, adjacent to Dolphin House. If you are arriving from Sam Nujoma Street or Robert
          Mugabe Way, proceed toward central Leopold Takawira. Dedicated curb drop-off and nearby
          secure guarded parking bays are accessible throughout the day.
        </p>
      </div>

      {/* 4. WHAT TO EXPECT (3 CARDS) */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#b8860b] block mb-1">
            In-Store Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#064e3b]">
            What to Expect When You Visit
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="luxury-card p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#065f46] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Personal Styling</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our footwear and wardrobe advisors help match formal derby shoes, linen blazers, and
              leather belts for weddings, graduations, and executive dinners.
            </p>
          </div>

          <div className="luxury-card p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#065f46] flex items-center justify-center">
              <Footprints className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Professional Fitting</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Try on genuine sizes 39 through 47. We verify instep fit, arch support, and width to
              guarantee immediate comfort on day one.
            </p>
          </div>

          <div className="luxury-card p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#065f46] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Same-Day Collection</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Order online or over WhatsApp and pick up your packaged box directly at the front desk
              in minutes with zero waiting or shipping fees.
            </p>
          </div>
        </div>
      </div>

      {/* 5. CONTACT FORM SECTION */}
      <div className="luxury-card p-8 sm:p-12 rounded-3xl bg-white border border-[#c59b27]/30 max-w-2xl mx-auto shadow-xl">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#b8860b] block mb-1">
            Direct Messaging
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#064e3b]">
            Send an Inquiry to Our Showroom
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            Have questions about a specific size, restock, or wedding party order? Message our team
            directly.
          </p>
        </div>

        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="formName" className="block text-xs font-bold text-stone-700">
              Your Name *
            </label>
            <input
              id="formName"
              type="text"
              required
              placeholder="e.g. Tinashe Chiduku"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="luxury-input text-xs border-stone-300"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="formPhone" className="block text-xs font-bold text-stone-700">
              Phone Number
            </label>
            <input
              id="formPhone"
              type="tel"
              placeholder="e.g. 077 123 4567"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className="luxury-input text-xs border-stone-300"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="formMessage" className="block text-xs font-bold text-stone-700">
              Your Message *
            </label>
            <textarea
              id="formMessage"
              required
              rows={4}
              placeholder="Tell us what shoe model, size, or styling inquiry you have..."
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              className="luxury-input text-xs resize-none border-stone-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#c59b27]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Send via WhatsApp</span>
          </button>
        </form>
      </div>
    </motion.div>
  );
};
