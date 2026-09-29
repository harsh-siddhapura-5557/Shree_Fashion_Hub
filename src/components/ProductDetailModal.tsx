'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, ShieldAlert, CheckCircle, Sparkles, MessageSquare, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductColor, Review } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
      setSelectedImage(product.colors[0]?.image || product.images[0]);
      setQuantity(1);
      setIsAdded(false);
      setReviewSuccessMsg('');

      setIsLoadingReviews(true);
      fetch(`/api/reviews?productId=${product.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setReviews(data.reviews);
        })
        .catch(console.error)
        .finally(() => setIsLoadingReviews(false));
    }
  }, [product]);

  if (!product || !selectedColor) return null;

  const imageList = product.images && product.images.length > 0 ? product.images : [selectedImage];
  const currentIdx = imageList.indexOf(selectedImage);
  const safeIdx = currentIdx >= 0 ? currentIdx : 0;

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = (safeIdx + 1) % imageList.length;
    setSelectedImage(imageList[next]);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prev = (safeIdx - 1 + imageList.length) % imageList.length;
    setSelectedImage(imageList[prev]);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) {
      handleNextImage();
    } else if (diff < -40) {
      handlePrevImage();
    }
    setTouchStartX(null);
  };

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          authorName: newAuthor,
          rating: newRating,
          comment: newComment,
          fitFeedback: 'True to Size'
        })
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
        setNewAuthor('');
        setNewComment('');
        setReviewSuccessMsg('Thank you! Your verified review has been posted.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden my-auto border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/80 text-white hover:bg-slate-950 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[88vh] overflow-y-auto">
          
          {/* Left Column: Image & Thumbnails */}
          <div className="p-4 sm:p-6 bg-slate-50 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div 
                className="aspect-[3/4] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-slate-200 relative select-none touch-pan-y group"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-cover object-center pointer-events-none transition-all duration-200"
                />

                {/* Left/Right Navigation Arrows */}
                {imageList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      aria-label="Previous photo"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-all z-10 shadow-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="Next photo"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-all z-10 shadow-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Floating Photo Counter & Swipe Hint Pill */}
                {imageList.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 z-10 pointer-events-none shadow-sm">
                    <span>{safeIdx + 1} / {imageList.length}</span>
                    <span className="text-amber-400 font-extrabold">• Swipe</span>
                  </div>
                )}

                <div className="absolute top-2.5 left-2.5 bg-slate-900 text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold z-10">
                  {product.category}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imageList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-18 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img ? 'border-slate-900 ring-1 ring-slate-900 scale-102' : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#92400E]" />
                Denim Specifications
              </span>
              <ul className="text-slate-600 text-[11px] space-y-1">
                {product.fabricDetails.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-5 sm:p-7 flex flex-col justify-between space-y-5">
            
            <div className="space-y-4">
              
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-900">{product.rating}</span>
                <span className="text-[11px] text-slate-400">({product.reviewCount} reviews)</span>
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 font-display">
                  {product.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {product.tagline}
                </p>
                <div className="flex items-baseline gap-2.5 mt-2">
                  <span className="text-2xl font-black text-slate-950">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold">
                      Save {product.discountPercentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* MANDATORY UNBOXING VIDEO RETURN POLICY BANNER */}
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-amber-300/80 text-slate-900 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400E]">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>MANDATORY RETURN POLICY</span>
                </div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed pl-5">
                  Note: Return valid only for damaged/defective pieces with a complete unboxing video.
                </p>
              </div>

              {/* Color Wash */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Wash: <strong className="text-slate-900">{selectedColor.name}</strong>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color);
                        if (color.image) setSelectedImage(color.image);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                        selectedColor.name === color.name
                          ? 'border-slate-950 bg-slate-50 text-slate-950 ring-1 ring-slate-950'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: color.hex }} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Waist Size (28 to 38) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Waist Size: <strong className="text-slate-900">{selectedSize} Inches</strong>
                  </label>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> In Stock
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Bag Button */}
              <div className="pt-2 flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg hover:bg-white text-slate-700 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-xs text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg hover:bg-white text-slate-700 font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 hover:bg-[#1E3A8A] text-white shadow-sm'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdded ? 'Added to Bag!' : 'Add to Shopping Bag'}</span>
                </button>
              </div>

            </div>

            {/* Customer Reviews Section */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#1E3A8A]" />
                Customer Reviews ({reviews.length})
              </h2>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {isLoadingReviews ? (
                  <p className="text-[11px] text-slate-400">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-[11px] text-slate-500">No reviews yet for this pair.</p>
                ) : (
                  reviews.map(rev => (
                    <div key={rev.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rev.authorName}</span>
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Input */}
              <form onSubmit={handleReviewSubmit} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                {reviewSuccessMsg && (
                  <div className="text-[11px] text-emerald-700 bg-emerald-50 p-1.5 rounded font-medium">
                    {reviewSuccessMsg}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    required
                    className="p-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <select
                    value={newRating}
                    onChange={e => setNewRating(Number(e.target.value))}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white font-bold text-xs"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  placeholder="Share feedback on waist fit and denim texture..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  required
                  className="w-full p-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-1.5 bg-slate-900 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 hover:bg-slate-800"
                >
                  <Send className="w-3 h-3" />
                  <span>Post Review</span>
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
