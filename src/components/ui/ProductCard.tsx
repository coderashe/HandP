import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import type { Product } from '../../types/shop.ts';
import { Badge } from './Badge.tsx';
import { PriceDisplay } from './PriceDisplay.tsx';
import { ColorSwatch } from './ColorSwatch.tsx';
import { SizeSelector } from './SizeSelector.tsx';
import { buildWhatsAppUrl, formatProductInquiry } from '../../utils/whatsapp.ts';
import { STORE_INFO } from '../../data/mockData.ts';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, size: string, color: string) => void;
  onBuyNow?: (product: Product, size: string, color: string) => void;
  onWhatsAppInquiry?: (product: Product, size: string, color: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onWhatsAppInquiry,
}) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Default');

  // Map selected color to one of the mock image backgrounds
  const colorIndex = Math.max(0, product.colors.indexOf(selectedColor));
  const activeBgClass = product.mockImages[colorIndex % product.mockImages.length] || 'bg-stone-900';

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product, selectedSize, selectedColor);
    } else {
      navigate(`/checkout/${product.id}`, {
        state: { size: selectedSize, color: selectedColor, quantity: 1 },
      });
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWhatsAppInquiry) {
      onWhatsAppInquiry(product, selectedSize, selectedColor);
    } else {
      const msg = formatProductInquiry(product.name, selectedSize, selectedColor, product.brand);
      const url = buildWhatsAppUrl(STORE_INFO.whatsappClean, msg);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, selectedSize, selectedColor);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(6, 78, 59, 0.08)' }}
      transition={{ duration: 0.2 }}
      className={`luxury-card flex flex-col justify-between overflow-hidden relative group bg-white border border-stone-200/90 hover:border-[#c59b27]/60 transition-colors shadow-xs ${
        !product.inStock ? 'opacity-75' : ''
      }`}
    >
      {/* Top Media / Mock Image Box */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <div
            className={`w-full h-full ${activeBgClass} flex items-center justify-center transition-transform duration-500 group-hover:scale-105 relative`}
          >
            {/* Visual subtle texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Centered stylized shoe/fashion icon depiction */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl filter drop-shadow-md mb-1">
                {product.category === 'formal-footwear' && '👞'}
                {product.category === 'luxury-sneakers' && '👟'}
                {product.category === 'premium-boots' && '🥾'}
                {product.category === 'designer-clothing' && '👔'}
                {product.category === 'accessories' && '🕶️'}
              </span>
              <span className="text-[11px] font-black tracking-widest uppercase text-amber-200 drop-shadow">
                {product.brand}
              </span>
            </div>
          </div>
        </Link>

        {/* Top-Right Badge Overlay */}
        {product.badge && (
          <div className="absolute top-3 right-3 z-10">
            <Badge
              text={product.badge}
              variant={product.badge.toLowerCase().includes('seller') ? 'gold' : 'green'}
            />
          </div>
        )}

        {/* Out of Stock banner */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="px-4 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Body: Crisp White Background */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        {/* Info & Title */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#065f46]">
              {product.brand}
            </span>
            {/* Star Ratings in Matte Gold */}
            <div className="flex items-center gap-1">
              <div className="flex items-center text-[#c59b27]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(product.rating)
                        ? 'fill-[#c59b27] text-[#c59b27]'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-stone-500 font-medium">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="group-hover:text-[#064e3b] transition-colors">
            <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Interactive Swatches & Sizes */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          {/* Color swatches */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-500 font-medium">Color:</span>
            <ColorSwatch
              colors={product.colors}
              colorHexMap={product.colorHexMap}
              selected={selectedColor}
              onChange={setSelectedColor}
              size="sm"
            />
          </div>

          {/* Size pills */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-stone-500 font-medium shrink-0">Size:</span>
            <div className="max-w-[75%] overflow-x-auto pb-0.5">
              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onChange={setSelectedSize}
                compact
              />
            </div>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-stone-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <PriceDisplay
              priceUSD={product.price}
              originalPriceUSD={product.originalPrice}
              size="md"
            />
            {onAddToCart && (
              <button
                type="button"
                onClick={handleAddToCart}
                title="Add to Cart"
                className="cursor-pointer transition-all duration-200 p-2.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-[#064e3b] border border-stone-200 shadow-2xs"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons: Matte Gold CTA (10%) + Emerald WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            {product.checkoutEnabled ? (
              <button
                type="button"
                onClick={handleBuyNow}
                className="cursor-pointer transition-all duration-200 col-span-1 py-2.5 px-3 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md shadow-[#c59b27]/25 active:scale-95"
              >
                Buy Now
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                to={`/product/${product.id}`}
                className="cursor-pointer transition-all duration-200 col-span-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 text-center"
              >
                Details
              </Link>
            )}

            <button
              type="button"
              onClick={handleWhatsApp}
              className="cursor-pointer transition-all duration-200 col-span-1 py-2.5 px-3 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-600/40 text-[#065f46] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
