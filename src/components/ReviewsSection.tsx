'use client';

import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { Review } from '@/types';

interface ReviewsSectionProps {
  initialReviews: Review[];
}

export function ReviewsSection({ initialReviews }: ReviewsSectionProps) {
  return (
    <section id="reviews" className="py-14 sm:py-20 bg-[#FAF9F6] border-b border-slate-200">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Customer Testimonials</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-950">
            VERIFIED BUYER EXPERIENCES
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <span className="text-sm font-black text-slate-900">4.9 / 5.0</span>
            <span className="text-xs text-slate-500">• 1,400+ Delivered Orders</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {initialReviews.map(review => (
            <div
              key={review.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {review.fitFeedback}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{review.authorName}</h4>
                  <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Buyer</span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
