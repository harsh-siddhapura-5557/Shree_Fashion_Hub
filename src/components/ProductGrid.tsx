'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, Sparkles, Filter, Ruler, X } from 'lucide-react';
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
        
        {/* Header Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#92400E] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Rigid & Stretch Denim Catalog</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-950">
            DISCOVER ALL JEANS
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Hand-picked washes with double-needle construction. Select your preferred fit and size below.
          </p>
        </div>

        {/* Unified Luxury Filter & Search Toolbar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4.5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            
            {/* 1. Integrated Search Bar (takes 5 cols on lg) */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search jeans by name, wash, fit..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 text-xs font-semibold bg-slate-50/70 focus:bg-white transition-all text-slate-900"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 2. Fit / Style Dropdown (takes 3 cols on lg) */}
            <div className="lg:col-span-3 relative">
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:border-slate-300 focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/10 px-3 py-1 transition-all">
                <Filter className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0 mr-2" />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block -mb-0.5">
                    Fit / Style
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    aria-label="Filter by Fit or Style"
                    className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer py-1"
                  >
                    <option value="All">All Fits (બધા ફિટ)</option>
                    <option value="Straight Cut">Straight Cut (સ્ટ્રેટ કટ)</option>
                    <option value="Baggy / Wide Leg">Baggy / Wide Leg (બેગી)</option>
                    <option value="Slim Fit">Slim Fit (સ્લીમ ફિટ)</option>
                    <option value="Cargo Denim">Cargo Denim (કાર્ગો)</option>
                    <option value="Relaxed Fit">Relaxed Fit (રિલેક્સ્ડ)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Size Dropdown (takes 2 cols on lg) */}
            <div className="lg:col-span-2 relative">
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:border-slate-300 focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/10 px-3 py-1 transition-all">
                <Ruler className="w-3.5 h-3.5 text-amber-600 shrink-0 mr-2" />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block -mb-0.5">
                    Size
                  </span>
                  <select
                    value={selectedSize}
                    onChange={e => setSelectedSize(e.target.value)}
                    aria-label="Filter by Waist Size"
                    className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer py-1"
                  >
                    <option value="All">All Sizes</option>
                    <option value="28">28&quot; Waist</option>
                    <option value="30">30&quot; Waist</option>
                    <option value="32">32&quot; Waist</option>
                    <option value="34">34&quot; Waist</option>
                    <option value="36">36&quot; Waist</option>
                    <option value="38">38&quot; Waist</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Sort Dropdown (takes 2 cols on lg) */}
            <div className="lg:col-span-2 relative">
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/70 hover:border-slate-300 focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/10 px-3 py-1 transition-all">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2" />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block -mb-0.5">
                    Sort By
                  </span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    aria-label="Sort products by"
                    className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer py-1"
                  >
                    <option value="featured">Featured Archive</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Active Filter Pills Bar & Results Counter */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">
                Showing <strong className="text-slate-950 font-black">{sortedProducts.length}</strong> jeans
              </span>

              {/* Active Category Chip */}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111827] text-white text-[11px] font-bold">
                  <span>Fit: {selectedCategory}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className="hover:text-amber-400"
                    title="Remove fit filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Active Size Chip */}
              {selectedSize !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1E3A8A] text-white text-[11px] font-bold">
                  <span>Size: {selectedSize}&quot;</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSize('All')}
                    className="hover:text-amber-400"
                    title="Remove size filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Active Search Chip */}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold">
                  <span>&quot;{searchQuery}&quot;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-red-600"
                    title="Remove search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            {/* Clear All Button if any filter active */}
            {(selectedCategory !== 'All' || selectedSize !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSize('All');
                  setSearchQuery('');
                }}
                className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 transition-colors"
              >
                <span>Clear All Filters</span>
              </button>
            )}
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
