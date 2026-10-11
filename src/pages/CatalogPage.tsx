import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, X, SlidersHorizontal, Search } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/mockData.ts';
import { ProductCard } from '../components/ui/ProductCard.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';
import { useCart } from '../hooks/useCart.ts';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  // URL synced state
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchTerm, setSearchTerm] = useState<string>(searchParam);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc' | 'newest'>('rating');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category param if URL changes externally
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  // Handle category change and sync URL
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  // Handle search term input and sync URL
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  // Toggle size
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Toggle color
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortBy('rating');
    setSearchParams({});
  };

  // Compute all available sizes across catalog
  const allAvailableSizes = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set);
  }, []);

  // Compute all available colors across catalog
  const allAvailableColors = useMemo(() => {
    const map = new Map<string, string>();
    PRODUCTS.forEach((p) => {
      p.colors.forEach((c) => {
        if (!map.has(c)) {
          map.set(c, p.colorHexMap[c] || '#444444');
        }
      });
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category check
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search term check
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(query));
        const matchesDesc = product.shortDescription.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesTags && !matchesDesc) {
          return false;
        }
      }

      // Price range
      const min = minPrice ? parseFloat(minPrice) : null;
      const max = maxPrice ? parseFloat(maxPrice) : null;
      if (min !== null && product.price < min) return false;
      if (max !== null && product.price > max) return false;

      // Size match
      if (selectedSizes.length > 0) {
        const hasMatchingSize = selectedSizes.some((s) => product.sizes.includes(s));
        if (!hasMatchingSize) return false;
      }

      // Color match
      if (selectedColors.length > 0) {
        const hasMatchingColor = selectedColors.some((c) => product.colors.includes(c));
        if (!hasMatchingColor) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.reviewCount - a.reviewCount;
      return 0;
    });
  }, [
    selectedCategory,
    searchTerm,
    minPrice,
    maxPrice,
    selectedSizes,
    selectedColors,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full"
    >
      {/* Page Header: Crisp & Spacious */}
      <div className="mb-8 pb-6 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-widest text-[#b8860b] block mb-1">
          Our Collection
        </span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#064e3b] tracking-tight">
              Browse <span className="text-[#043d2e] underline decoration-[#c59b27] decoration-4 underline-offset-8">All Products</span>
            </h1>
            <p className="text-sm text-stone-500 mt-2">
              Showing {filteredProducts.length} of {PRODUCTS.length} curated luxury pieces
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search oxfords, sneakers, blazers..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="luxury-input pl-10 pr-4 py-2.5 text-xs bg-white border-stone-300 shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle & Quick Bar */}
      <div className="flex lg:hidden items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-800 shadow-2xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#c59b27]" />
          <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-800 outline-none"
        >
          <option value="rating">Top Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Popularity</option>
        </select>
      </div>

      {/* Main Layout Grid (Sidebar + Product Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Filter: Crisp White (60%) Card */}
        <aside
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } lg:block lg:col-span-1 space-y-6 luxury-card p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#065f46]" />
              <h3 className="font-bold text-[#064e3b] text-sm">Refine Results</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-[#b8860b] hover:text-[#92400e] font-semibold cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Category
            </h4>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#064e3b] text-white font-bold shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>All Products</span>
                <span className="text-[10px] opacity-80">{PRODUCTS.length}</span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = PRODUCTS.filter((p) => p.category === cat.id).length;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#064e3b] text-white font-bold shadow-xs'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Price Range ($ USD)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="luxury-input py-1.5 px-2.5 text-xs text-center border-stone-300"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="luxury-input py-1.5 px-2.5 text-xs text-center border-stone-300"
                />
              </div>
            </div>
          </div>

          {/* Size Filter */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Available Sizes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {allAvailableSizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`cursor-pointer px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#c59b27] text-white font-bold shadow-xs'
                        : 'bg-white text-stone-700 border border-stone-300 hover:border-[#064e3b]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Filter */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Colors
            </h4>
            <div className="flex flex-wrap gap-2">
              {allAvailableColors.map(({ name, hex }) => {
                const isSelected = selectedColors.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => toggleColor(name)}
                    className={`cursor-pointer relative p-0.5 rounded-full transition-all ${
                      isSelected
                        ? 'ring-2 ring-[#c59b27] ring-offset-2 ring-offset-white scale-110'
                        : 'opacity-70 hover:opacity-100 ring-1 ring-stone-300'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full block border border-black/10"
                      style={{ backgroundColor: hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By (Desktop) */}
          <div className="pt-4 border-t border-stone-100 hidden lg:block">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Sort By
            </h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="luxury-input py-2 px-3 text-xs border-stone-300"
            >
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Popularity</option>
            </select>
          </div>
        </aside>

        {/* Right Main Grid */}
        <section className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters, price range, or search keywords."
              actionLabel="Clear Filters"
              onAction={resetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p, size, color) => {
                    addToCart({
                      product: p,
                      selectedSize: size,
                      selectedColor: color,
                      quantity: 1,
                    });
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
};
