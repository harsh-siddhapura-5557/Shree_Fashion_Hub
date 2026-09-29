'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';

interface ProductGridProps {
  initialProducts: Product[];
}

const CATEGORIES = [
  'All',
  'Straight Cut',
  'Baggy / Wide Leg',
  'Slim Fit',
  'Cargo Denim',
  'Relaxed Fit'
];

const WAIST_SIZES = ['All', '28', '30', '32', '34', '36', '38'];

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const [products] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSize = selectedSize === 'All' || product.sizes.includes(selectedSize);
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSize && matchesSearch;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <section id="catalog" className="py-14 sm:py-20 bg-[#FAF9F6] border-b border-slate-200">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6 sm:space-y-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#92400E] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Rigid & Stretch Denim Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-950">
              DISCOVER ALL JEANS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Hand-picked washes with double-needle construction and authentic rivets. Choose your waist size below.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by wash, selvedge, fit..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-slate-900 bg-white shadow-xs"
            />
          </div>
        </div>

        {/* Filter Toolbar across full width */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
          
          {/* Fit Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 hidden sm:inline">
              Silhouette:
            </span>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Waist Sizes & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
                Waist Size:
              </span>
              {WAIST_SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedSize === size
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {size === 'All' ? 'All Sizes' : `${size}"`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-bold text-xs focus:outline-none"
              >
                <option value="featured">Featured Archive</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

        </div>

        {/* Full-Width Grid: 2 cols on mobile, 3 on tablet, 4 on desktop, 4-5 on large screens */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <h3 className="text-base font-bold text-slate-900">No jeans match your filter criteria</h3>
            <p className="text-xs text-slate-500">
              Try switching your waist size or silhouette filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSize('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#111827] text-white text-xs font-bold mt-2 hover:bg-[#1E3A8A]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {sortedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={product => setActiveModalProduct(product)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </section>
  );
}
