import React, { useState } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Sparkles,
  MapPin,
  Truck,
} from 'lucide-react';
import { PRODUCTS, STORE_INFO } from '../data/mockData.ts';
import { PriceDisplay } from '../components/ui/PriceDisplay.tsx';
import { ColorSwatch } from '../components/ui/ColorSwatch.tsx';
import { SizeSelector } from '../components/ui/SizeSelector.tsx';
import { Badge } from '../components/ui/Badge.tsx';
import { ProductCard } from '../components/ui/ProductCard.tsx';
import { useCart } from '../hooks/useCart.ts';
import { buildWhatsAppUrl, formatProductInquiry } from '../utils/whatsapp.ts';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    return <Navigate to="/catalog" replace />;
  }

  // State
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Default');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showSizeModal, setShowSizeModal] = useState<boolean>(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('desc');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const maxQty = Math.min(10, product.stockCount);

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(maxQty, prev + delta)));
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${product.id}`, {
      state: {
        size: selectedSize,
        color: selectedColor,
        quantity,
      },
    });
  };

  const handleAddToCart = () => {
    addToCart({
      product,
      selectedSize,
      selectedColor,
      quantity,
    });
    setToastMessage(`Added ${quantity}x ${product.name} (${selectedSize}) to bag!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleWhatsApp = () => {
    const msg = formatProductInquiry(product.name, selectedSize, selectedColor, product.brand);
    const url = buildWhatsAppUrl(STORE_INFO.whatsappClean, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion((prev) => (prev === section ? null : section));
  };

  // Related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || true)
  ).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-[#fafaf9]"
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 px-5 py-3 rounded-xl bg-[#c59b27] text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-300"
          >
            <Sparkles className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap pb-1">
        <Link to="/" className="hover:text-[#064e3b] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-[#064e3b] transition-colors">
          Catalog
        </Link>
        <span>/</span>
        <Link
          to={`/catalog?category=${product.category}`}
          className="hover:text-[#064e3b] capitalize transition-colors"
        >
          {product.category.replace('-', ' ')}
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Left Column: Image Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Showcase Box */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-stone-200/90 shadow-md bg-stone-900">
            <div
              className={`w-full h-full ${product.mockImages[activeImageIndex] || 'bg-stone-900'} flex flex-col items-center justify-center p-8 transition-colors duration-500 relative`}
            >
              {/* Subtle visual gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="relative z-10 text-center flex flex-col items-center">
                <span className="text-8xl filter drop-shadow-2xl mb-4 select-none">
                  {product.category === 'formal-footwear' && '👞'}
                  {product.category === 'luxury-sneakers' && '👟'}
                  {product.category === 'premium-boots' && '🥾'}
                  {product.category === 'designer-clothing' && '👔'}
                  {product.category === 'accessories' && '🕶️'}
                </span>
                <span className="text-sm font-black tracking-widest uppercase text-amber-200 drop-shadow">
                  {product.brand}
                </span>
                <span className="text-xs text-stone-200 mt-1">{product.origin}</span>
              </div>
            </div>

            {/* Badge overlay on main image */}
            {product.badge && (
              <div className="absolute top-4 right-4 z-10">
                <Badge text={product.badge} variant="gold" />
              </div>
            )}
          </div>

          {/* 3 Thumbnail Swatch Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {product.mockImages.map((imgClass, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`cursor-pointer aspect-video rounded-xl overflow-hidden border-2 transition-all p-2 flex items-center justify-center ${imgClass} ${
                  activeImageIndex === index
                    ? 'border-[#c59b27] ring-2 ring-[#c59b27]/30 scale-102 shadow-xs'
                    : 'border-stone-300 opacity-60 hover:opacity-100 hover:border-stone-400'
                }`}
              >
                <span className="text-xs font-bold text-white drop-shadow uppercase">
                  View {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info & Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#065f46]">
                {product.brand}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating & Stock Badge */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-[#c59b27]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-[#c59b27] text-[#c59b27]'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-stone-600 font-semibold">
                  {product.rating} ({product.reviewCount} customer reviews)
                </span>
              </div>

              {product.stockCount > 5 ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#065f46] border border-emerald-300">
                  ✓ In Stock ({product.stockCount} pairs available)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-[#92400e] border border-amber-300">
                  ⚠ Low Stock: Only {product.stockCount} left
                </span>
              )}
            </div>
          </div>

          {/* Price Display Large: Crisp White / Ivory Container */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <PriceDisplay
              priceUSD={product.price}
              originalPriceUSD={product.originalPrice}
              size="lg"
            />
            <div className="text-xs text-stone-500 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#065f46] shrink-0" />
              <span>Guaranteed Authentic · International Import ({product.origin})</span>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Select Color: <span className="text-[#064e3b] font-black">{selectedColor}</span>
              </span>
            </div>
            <ColorSwatch
              colors={product.colors}
              colorHexMap={product.colorHexMap}
              selected={selectedColor}
              onChange={(col) => {
                setSelectedColor(col);
                const idx = product.colors.indexOf(col);
                if (idx !== -1) setActiveImageIndex(idx % product.mockImages.length);
              }}
            />
          </div>

          {/* Size Selection */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Select Size: <span className="text-[#064e3b] font-black">{selectedSize}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSizeModal(true)}
                className="text-xs text-[#b8860b] hover:text-[#92400e] underline font-semibold cursor-pointer"
              >
                Size Guide
              </button>
            </div>
            <SizeSelector
              sizes={product.sizes}
              selected={selectedSize}
              onChange={setSelectedSize}
            />
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Quantity:
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl bg-white border border-stone-300 p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleQtyChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQtyChange(1)}
                  disabled={quantity >= maxQty}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-stone-500">
                Max {maxQty} per order
              </span>
            </div>
          </div>

          {/* Actions: Buy Now (Matte Gold CTA 10%), Add To Cart (Emerald 30%), WhatsApp */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            {product.checkoutEnabled && (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-4 px-6 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#c59b27]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>Buy Now — Pay via EcoCash or Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3.5 px-4 rounded-xl bg-[#064e3b] hover:bg-[#053e2f] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="py-3.5 px-4 rounded-xl bg-white hover:bg-emerald-50 border-2 border-emerald-600/40 text-[#065f46] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Delivery Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 text-xs text-[#064e3b]">
            <div className="flex items-center gap-2.5 font-medium">
              <MapPin className="w-4 h-4 text-[#c59b27] shrink-0" />
              <span>🏪 Free pickup · Leopold Takawira St</span>
            </div>
            <div className="flex items-center gap-2.5 font-medium">
              <Truck className="w-4 h-4 text-[#c59b27] shrink-0" />
              <span>🚚 Harare delivery available ($3)</span>
            </div>
          </div>

          {/* Accordion Details: Crisp White Panels */}
          <div className="pt-4 border-t border-stone-200 space-y-2">
            {/* Description Accordion */}
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleAccordion('desc')}
                className="w-full py-3.5 px-4 text-left font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center justify-between cursor-pointer hover:bg-stone-50"
              >
                <span>Description</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#064e3b] transition-transform ${
                    activeAccordion === 'desc' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'desc' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3"
                >
                  {product.fullDescription}
                </motion.div>
              )}
            </div>

            {/* Features Accordion */}
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleAccordion('feat')}
                className="w-full py-3.5 px-4 text-left font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center justify-between cursor-pointer hover:bg-stone-50"
              >
                <span>Features & Specifications</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#064e3b] transition-transform ${
                    activeAccordion === 'feat' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'feat' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-4 pb-4 space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3"
                >
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#065f46] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Sizing & Fit Accordion */}
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleAccordion('fit')}
                className="w-full py-3.5 px-4 text-left font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center justify-between cursor-pointer hover:bg-stone-50"
              >
                <span>Sizing & Fit Advice</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#064e3b] transition-transform ${
                    activeAccordion === 'fit' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'fit' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-4 pb-4 text-xs text-stone-600 leading-relaxed space-y-2 border-t border-stone-100 pt-3"
                >
                  <p>
                    Fits true to size. If you have wide feet or wear thick dress socks, we recommend
                    selecting one size up.
                  </p>
                  <p className="text-[#065f46] font-semibold">
                    Need in-person sizing? Visit our Leopold Takawira showroom for professional foot
                    measuring.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Care Instructions Accordion */}
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleAccordion('care')}
                className="w-full py-3.5 px-4 text-left font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center justify-between cursor-pointer hover:bg-stone-50"
              >
                <span>Care Instructions</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#064e3b] transition-transform ${
                    activeAccordion === 'care' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'care' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3"
                >
                  Store with wooden shoe trees in a well-ventilated dry space. Use beeswax or neutral
                  cream polish for calfskin leather. For suede, brush with a crepe or horsehair suede
                  brush in one direction.
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <section className="pt-12 border-t border-stone-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#b8860b] block mb-1">
              Curated Recommendations
            </span>
            <h3 className="text-2xl font-black text-[#064e3b]">You May Also Like</h3>
          </div>
          <Link
            to="/catalog"
            className="text-xs font-bold text-[#065f46] hover:text-[#064e3b] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relProd) => (
            <ProductCard key={relProd.id} product={relProd} />
          ))}
        </div>
      </section>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeModal(false)}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 luxury-card p-6 rounded-2xl max-w-lg w-full bg-white border border-[#c59b27]/40 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="text-lg font-bold text-[#064e3b]">Official Sizing Chart</h3>
                <button
                  type="button"
                  onClick={() => setShowSizeModal(false)}
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Shoe Size Table */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#b8860b] mb-2">
                  Footwear Conversion (Men & Unisex)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500">
                        <th className="py-2 px-3">EU Size</th>
                        <th className="py-2 px-3">UK Size</th>
                        <th className="py-2 px-3">US Size</th>
                        <th className="py-2 px-3">Foot Length</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      <tr>
                        <td className="py-2 px-3 font-bold text-[#064e3b]">39</td>
                        <td className="py-2 px-3">6.0</td>
                        <td className="py-2 px-3">7.0</td>
                        <td className="py-2 px-3">24.5 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-[#064e3b]">40</td>
                        <td className="py-2 px-3">7.0</td>
                        <td className="py-2 px-3">8.0</td>
                        <td className="py-2 px-3">25.0 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-[#064e3b]">41</td>
                        <td className="py-2 px-3">8.0</td>
                        <td className="py-2 px-3">9.0</td>
                        <td className="py-2 px-3">26.0 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-[#064e3b]">42</td>
                        <td className="py-2 px-3">8.5</td>
                        <td className="py-2 px-3">9.5</td>
                        <td className="py-2 px-3">26.5 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-[#064e3b]">43</td>
                        <td className="py-2 px-3">9.0</td>
                        <td className="py-2 px-3">10.0</td>
                        <td className="py-2 px-3">27.5 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-[#064e3b]">44</td>
                        <td className="py-2 px-3">10.0</td>
                        <td className="py-2 px-3">11.0</td>
                        <td className="py-2 px-3">28.0 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-[#064e3b]">45</td>
                        <td className="py-2 px-3">11.0</td>
                        <td className="py-2 px-3">12.0</td>
                        <td className="py-2 px-3">29.0 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Apparel Size Table */}
              <div className="mt-6 pt-4 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#b8860b] mb-2">
                  Designer Apparel (Blazers & Shirts)
                </h4>
                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="font-bold text-stone-900">Size S:</span>
                    <span>Chest 36 inches (91 cm)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="font-bold text-stone-900">Size M:</span>
                    <span>Chest 38–40 inches (96–101 cm)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="font-bold text-stone-900">Size L:</span>
                    <span>Chest 42–44 inches (106–111 cm)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="font-bold text-stone-900">Size XL:</span>
                    <span>Chest 46 inches (116 cm)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-stone-900">Size XXL:</span>
                    <span>Chest 48+ inches (122+ cm)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowSizeModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#c59b27] text-white font-bold text-xs cursor-pointer hover:bg-[#b38a1c] shadow-sm"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
