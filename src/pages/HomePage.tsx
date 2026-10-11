import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Ruler,
  CreditCard,
  Store,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { STORE_INFO, PRODUCTS, CATEGORIES } from '../data/mockData.ts';
import { ProductCard } from '../components/ui/ProductCard.tsx';
import { PriceDisplay } from '../components/ui/PriceDisplay.tsx';
import { buildWhatsAppUrl } from '../utils/whatsapp.ts';

export const HomePage: React.FC = () => {
  const whatsappUrl = buildWhatsAppUrl(
    STORE_INFO.whatsappClean,
    'Hi H & P Shoes! I saw your showroom online and would like to see available stock.'
  );

  const featuredSix = PRODUCTS.slice(0, 6);
  const heroMiniProducts = PRODUCTS.slice(0, 3);

  const pillarIconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#065f46]" />,
    Ruler: <Ruler className="w-6 h-6 text-[#065f46]" />,
    CreditCard: <CreditCard className="w-6 h-6 text-[#065f46]" />,
    Store: <Store className="w-6 h-6 text-[#065f46]" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col w-full bg-[#fafaf9]"
    >
      {/* 1. HERO SECTION: Crisp White / Ivory (60%) with Emerald (30%) & Matte Gold (10%) */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-b from-white via-[#fafaf9] to-[#f4f7f5] py-16 lg:py-24 border-b border-stone-200/80">
        {/* Soft Ambient Royal Glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c59b27]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Diagonal Subtle Texture Overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #d6d3d1 0, #d6d3d1 1px, transparent 0, transparent 24px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Harare Boutique Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#065f46] animate-pulse" />
                <span className="text-xs font-black tracking-widest text-[#064e3b] uppercase">
                  Harare's #1 Fashion Boutique
                </span>
              </div>

              {/* Royal Headline: Deep Emerald Typography */}
              <div className="space-y-1">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#064e3b] leading-none">
                  DRESS TO
                </h1>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-[#043d2e] drop-shadow-xs">
                  IMPRESS
                </h1>
              </div>

              {/* Subheadline: Clean and spacious */}
              <p className="text-base sm:text-lg text-stone-600 font-normal max-w-xl leading-relaxed">
                Step into luxury with hand-selected formal oxfords, Italian suede loafers, cushioned
                designer sneakers, and tailored apparel. Harare’s prime address for discerning
                fashion connoisseurs.
              </p>

              {/* CTAs: Matte Gold Primary Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="px-8 py-4 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#c59b27]/25 flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <span>Shop the Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-xl bg-white hover:bg-emerald-50 border-2 border-[#064e3b] text-[#064e3b] font-bold text-sm uppercase tracking-wider shadow-xs flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Showroom</span>
                </a>
              </div>

              {/* Trust Checkmarks Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#065f46] shrink-0" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#065f46] shrink-0" />
                  <span>EcoCash & Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#065f46] shrink-0" />
                  <span>Leopold Takawira St</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#065f46] shrink-0" />
                  <span>Diaspora Orders</span>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols) — Showcase Card: Crisp White with Subtle Gold Trim */}
            <div className="lg:col-span-5">
              <div className="luxury-card p-6 border border-[#c59b27]/40 rounded-3xl bg-white/95 backdrop-blur-md shadow-xl relative">
                {/* Header inside card */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-xs font-black tracking-widest uppercase text-[#064e3b]">
                      Currently In Store
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#b8860b] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    New Drops
                  </span>
                </div>

                {/* 3 Stacked featured product mini-cards */}
                <div className="space-y-3.5 my-5">
                  {heroMiniProducts.map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/product/${prod.id}`}
                      className="group flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-[#c59b27] transition-all hover:bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl ${prod.mockImages[0]} flex items-center justify-center shrink-0 border border-black/10 group-hover:scale-105 transition-transform`}
                        >
                          <span className="text-lg">
                            {prod.category === 'formal-footwear' ? '👞' : '👟'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#065f46]">
                            {prod.brand}
                          </span>
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#064e3b] transition-colors line-clamp-1">
                            {prod.name}
                          </h4>
                          <span className="text-[11px] text-stone-500">
                            Sizes {prod.sizes[0]}–{prod.sizes[prod.sizes.length - 1]}
                          </span>
                        </div>
                      </div>

                      <div className="text-right pl-2">
                        <PriceDisplay priceUSD={prod.price} size="sm" showZIG={false} />
                        <span className="text-[10px] text-emerald-700 font-semibold">In Stock</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Category quick-jump pills row */}
                <div className="pt-4 border-t border-stone-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Quick Jump:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/catalog?category=${cat.id}`}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#064e3b] hover:text-white border border-stone-200 text-[11px] font-semibold text-stone-700 transition-colors"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST PILLARS SECTION: Crisp Ivory with Emerald Accents */}
      <section className="py-16 bg-[#f7f7f6] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STORE_INFO.trustPillars.map((pillar, i) => (
              <div
                key={i}
                className="luxury-card p-6 rounded-2xl bg-white border border-stone-200 hover:border-[#c59b27]/60 transition-colors group flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 group-hover:bg-emerald-100 transition-colors">
                      {pillarIconMap[pillar.icon] || <ShieldCheck className="w-6 h-6 text-[#065f46]" />}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-[#065f46] border border-stone-200">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#064e3b] transition-colors">
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#b8860b] mt-0.5 mb-2">
                    {pillar.subtitle}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#b8860b] block mb-2">
              Featured Collection
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#064e3b] tracking-tight">
              Our Best <span className="text-[#043d2e] underline decoration-[#c59b27] decoration-4 underline-offset-8">Sellers</span>
            </h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#065f46] hover:text-[#064e3b] transition-colors group self-start md:self-auto"
          >
            <span>Explore All 14 Items</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSix.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Full Catalog Button: Matte Gold CTA (10%) */}
        <div className="text-center mt-12">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#c59b27]/25 transition-all active:scale-95 cursor-pointer"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. BRANDS MARQUEE SECTION: Regal Emerald (30%) Grounding Band */}
      <section className="py-14 bg-[#064e3b] text-white overflow-hidden select-none border-y border-[#043d2e]">
        <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-[#c59b27]">
            Trusted Brands We Carry In Store
          </span>
        </div>

        <div className="flex animate-marquee text-2xl sm:text-3xl font-black tracking-wider text-emerald-100">
          {/* First loop */}
          {STORE_INFO.featuredBrands.map((brand, idx) => (
            <span key={`b1-${idx}`} className="mx-8 hover:text-[#c59b27] transition-colors">
              {brand.toUpperCase()} <span className="text-[#c59b27] mx-6 font-normal">·</span>
            </span>
          ))}
          {/* Second duplicated loop for seamless infinite animation */}
          {STORE_INFO.featuredBrands.map((brand, idx) => (
            <span key={`b2-${idx}`} className="mx-8 hover:text-[#c59b27] transition-colors">
              {brand.toUpperCase()} <span className="text-[#c59b27] mx-6 font-normal">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* 5. CTA BANNER SECTION: Crisp White Card with Emerald & Matte Gold Styling */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="luxury-card p-8 sm:p-12 rounded-3xl border border-[#c59b27]/30 bg-gradient-to-r from-emerald-50/70 via-white to-amber-50/40 relative overflow-hidden shadow-xl">
          {/* Background decorative soft glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c59b27]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#065f46] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                Harare Central Boutique
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#064e3b] tracking-tight">
                Visit Our Harare Showroom
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Experience personal styling and try on the latest collections in person at our
                Leopold Takawira boutique. Walk-ins and reservations are both warmly welcomed.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-stone-600 pt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#c59b27]" />
                  {STORE_INFO.address}
                </span>
                <span className="hidden sm:inline text-stone-400">•</span>
                <span className="font-medium">{STORE_INFO.hours}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <a
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border-2 border-[#064e3b] text-[#064e3b] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#c59b27]/25 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
