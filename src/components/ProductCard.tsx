'use client';

import React, { useState } from 'react';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { Product, ProductColor } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [isAdded, setIsAdded] = useState(false);

  const activeImage = selectedColor?.image || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <img
          src={activeImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
          {product.discountPercentage > 0 && (
            <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[9px] sm:text-[10px] font-extrabold tracking-wide uppercase">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2 py-0.5 rounded bg-[#92400E] text-white text-[9px] sm:text-[10px] font-bold uppercase">
              Bestseller
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-0.5 rounded bg-white/95 backdrop-blur-sm text-[9px] sm:text-[10px] font-semibold text-slate-800 shadow-xs">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="text-[11px] font-bold text-slate-900">{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 group-hover:text-[#1E3A8A] transition-colors">
            {product.title}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 hidden sm:block">
            {product.tagline}
          </p>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-1.5 pt-0.5" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            {product.colors.map(color => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                title={color.name}
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border transition-all ${
                  selectedColor.name === color.name
                    ? 'border-slate-950 ring-1 ring-slate-950 scale-110'
                    : 'border-slate-300'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500 truncate max-w-[80px]">
            {selectedColor.name}
          </span>
        </div>

        {/* Waist Sizes (Compact for mobile) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5" onClick={e => e.stopPropagation()}>
          {product.sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                selectedSize === size
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Price & Add Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5" onClick={e => e.stopPropagation()}>
          <div>
            <div className="text-sm sm:text-base font-black text-slate-950">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[10px] text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`p-2 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-[#1E3A8A] text-white'
            }`}
            title="Add to Bag"
          >
            {isAdded ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
