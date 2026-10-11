import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo.tsx';
import { STORE_INFO, CATEGORIES } from '../../data/mockData.ts';
import { buildWhatsAppUrl } from '../../utils/whatsapp.ts';

export const Footer: React.FC = () => {
  const whatsappUrl = buildWhatsAppUrl(
    STORE_INFO.whatsappClean,
    'Hi H & P Shoes! I am contacting you through your official website.'
  );

  return (
    <footer
      id="store-contact-footer"
      className="bg-[#043327] border-t-2 border-[#c59b27]/40 text-stone-200 relative overflow-hidden"
    >
      {/* Background glow accent: soft gold radial */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c59b27]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <BrandLogo size="lg" darkMode={true} />
            <p className="text-sm text-emerald-100/90 leading-relaxed pt-2">
              Harare's premier destination for genuine luxury footwear, formal brogues, modern
              streetwear sneakers, and refined wardrobe essentials.
            </p>
            <div className="text-xs italic text-[#c59b27] font-medium tracking-wide">
              "Built for Harare's Fashion Elite"
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Us"
                className="w-10 h-10 rounded-xl bg-[#064e3b] border border-emerald-600/50 hover:border-[#c59b27] hover:bg-emerald-800 text-emerald-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={STORE_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook Page"
                className="w-10 h-10 rounded-xl bg-[#064e3b] border border-emerald-600/50 hover:border-[#c59b27] hover:bg-emerald-800 text-emerald-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c59b27] mb-5">
              Quick Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-white text-emerald-100/80 transition-colors flex items-center gap-1.5 group"
                >
                  <span>Home Showcase</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400/60 group-hover:text-[#c59b27] transition-colors" />
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-white text-emerald-100/80 transition-colors flex items-center gap-1.5 group"
                >
                  <span>Complete Catalog</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400/60 group-hover:text-[#c59b27] transition-colors" />
                </Link>
              </li>
              <li>
                <Link
                  to="/store"
                  className="hover:text-white text-emerald-100/80 transition-colors flex items-center gap-1.5 group"
                >
                  <span>Harare Showroom & Map</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400/60 group-hover:text-[#c59b27] transition-colors" />
                </Link>
              </li>
              <li>
                <a
                  href={STORE_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-emerald-100/80 transition-colors flex items-center gap-1.5 group"
                >
                  <span>Directions via Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400/60 group-hover:text-[#c59b27] transition-colors" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c59b27] mb-5">
              Collection Categories
            </h4>
            <ul className="space-y-3 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/catalog?category=${cat.id}`}
                    className="hover:text-white text-emerald-100/80 transition-colors block"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Store Contact & Hours */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c59b27] mb-5">
              Harare Showroom
            </h4>

            <div className="flex items-start gap-3 text-sm text-emerald-100/90">
              <MapPin className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
              <span>{STORE_INFO.address}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-emerald-100/90">
              <Phone className="w-4 h-4 text-[#c59b27] shrink-0" />
              <a
                href={`tel:${STORE_INFO.whatsappClean}`}
                className="hover:text-white transition-colors"
              >
                {STORE_INFO.whatsappDisplay}
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-emerald-100/90">
              <Mail className="w-4 h-4 text-[#c59b27] shrink-0" />
              <a
                href={`mailto:${STORE_INFO.email}`}
                className="hover:text-white transition-colors"
              >
                {STORE_INFO.email}
              </a>
            </div>

            <div className="flex items-start gap-3 text-sm text-emerald-100/90">
              <Clock className="w-4 h-4 text-[#c59b27] shrink-0 mt-0.5" />
              <span>{STORE_INFO.hours}</span>
            </div>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#064e3b] border border-[#c59b27]/60 hover:bg-[#075e47] text-white text-xs font-bold transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#c59b27]" />
                Live WhatsApp Assistance
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution bar */}
        <div className="mt-14 pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <p>© {STORE_INFO.copyrightYear} powered by IStartK. All rights reserved.</p>
          <p className="text-emerald-300/50">
            Royal Elegance · Style That Speaks | Quality You Feel
          </p>
        </div>
      </div>
    </footer>
  );
};
