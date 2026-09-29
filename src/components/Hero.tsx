'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Ruler, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

interface HeroJeansFeature {
  id: string;
  name: string;
  category: string;
  weight: string;
  tagline: string;
  price: number;
  originalPrice: number;
  image: string;
  accentBadge: string;
  sizes: string[];
}

const HERO_PIECES: HeroJeansFeature[] = [
  {
    id: 'selvedge',
    name: 'Midnight Raw Japanese Selvedge',
    category: 'Straight Cut',
    weight: '14.5 oz Shuttle Loom Twill',
    tagline: 'Rigid pure indigo that breaks in to form unique personal honeycombs and whiskers.',
    price: 2499,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80',
    accentBadge: 'Artisan Signature • Red Selvedge ID',
    sizes: ['28', '30', '32', '34', '36', '38']
  },
  {
    id: 'baggy',
    name: '90s Vintage Acid Wash Baggy',
    category: 'Wide Leg / Baggy',
    weight: '13.2 oz Washed Comfort Denim',
    tagline: 'Authentic 90s streetwear cut with natural sneaker stack and relaxed thigh ease.',
    price: 1899,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=1200&q=80',
    accentBadge: 'Trending Streetwear • Stone Washed',
    sizes: ['28', '30', '32', '34', '36', '38']
  },
  {
    id: 'slim',
    name: 'Precision Sculpted Slim Tapered',
    tagline: 'Engineered 4-way power flex recovery that hugs the silhouette with zero knee-sagging.',
    category: 'Slim Fit',
    weight: '12.8 oz Flex-Recovery Cotton',
    price: 1699,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=1200&q=80',
    accentBadge: 'Zero Knee-Sag • 4-Way Power Flex',
    sizes: ['28', '30', '32', '34', '36', '38']
  }
];

const TICKER_ITEMS = [
  'RAW JAPANESE SELVEDGE DENIM',
  '14.5 OZ SHUTTLE LOOM WEAVE',
  'SOLID ANTIQUE BRASS HARDWARE',
  'TRUE TO INDIAN WAIST SIZING (28-38)',
  'UNBOXING VIDEO GUARANTEE PROTECTED',
  'FREE ALL-INDIA EXPRESS DISPATCH',
  '100% RING-SPUN COMBED COTTON'
];

export function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activePiece = HERO_PIECES[activeIdx];

  return (
    <section className="relative bg-[#FAF9F6] text-slate-900 border-b border-slate-200 overflow-hidden">
      
      {/* Decorative Atmosphere Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-amber-100/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-12 sm:pb-16 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Interactive Editorial Experience */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-300 shadow-xs text-xs font-semibold text-slate-700"
            >
              <span className="w-2 h-2 rounded-full bg-[#1E3A8A] animate-ping" />
              <span className="font-bold text-[#92400E]">Shree Fashion Hub</span>
              <span className="text-slate-300">•</span>
              <span>Heavyweight Denim Studio</span>
            </motion.div>

            {/* Headline with Stagger Animation */}
            <div className="space-y-2">
              <motion.h1
                key={activePiece.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 font-display leading-[1.2]"
              >
                Heavyweight Denim. <br />
                <span className="text-[#1E3A8A]">Engineered for Indian Waists.</span>
              </motion.h1>

              <p className="text-slate-600 text-xs sm:text-sm lg:text-base max-w-xl font-normal leading-relaxed pt-1">
                Handcrafted from long-staple ring-spun cotton. Every pair is cut with anatomical precision to eliminate back-waist gaps and knee sagging.
              </p>
            </div>

            {/* Interactive Piece Switcher Tabs */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Interactive Lookbook Preview:
              </span>
              <div className="flex flex-wrap gap-2">
                {HERO_PIECES.map((piece, idx) => (
                  <button
                    key={piece.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeIdx === idx
                        ? 'bg-[#111827] text-white shadow-md scale-102'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{piece.name.split(' ')[0]} {piece.category.split('/')[0]}</span>
                    {activeIdx === idx && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="#catalog"
                className="px-7 py-3.5 rounded-xl bg-[#111827] hover:bg-[#1E3A8A] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <span>Shop This Collection</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#fit-guide"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center transition-colors shadow-xs"
              >
                <Ruler className="w-4 h-4 text-[#1E3A8A] mr-1.5" />
                <span>Explore Fit Studio</span>
              </a>
            </div>

            {/* Live Stats Row */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-display">{activePiece.weight.split(' ')[0]} oz</div>
                <div className="text-[11px] text-slate-500 font-medium">Fabric Weight</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#92400E] font-display">4.9 ★</div>
                <div className="text-[11px] text-slate-500 font-medium">Customer Loved</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#1E3A8A] font-display">28 to 38</div>
                <div className="text-[11px] text-slate-500 font-medium">Waist Sizing Ready</div>
              </div>
            </div>

          </div>

          {/* Right Column: Animated Interactive Denim Showcase Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Animated Card Container */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePiece.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100"
                >
                  <img
                    src={activePiece.image}
                    alt={activePiece.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                  {/* Floating Top Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5 border border-slate-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{activePiece.accentBadge}</span>
                    </span>
                  </div>

                  {/* Floating Bottom Card Over Image */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400E]">
                          {activePiece.category}
                        </span>
                        <h2 className="text-sm sm:text-base font-black text-slate-950">
                          {activePiece.name}
                        </h2>
                        <div className="flex items-center gap-1 mt-1">
                          {activePiece.sizes.map(sz => (
                            <span key={sz} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                              {sz}&quot;
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base sm:text-lg font-black text-[#1E3A8A]">
                          ₹{activePiece.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 line-through block">
                          ₹{activePiece.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>

      {/* CONTINUOUS ANIMATED LUXURY DENIM TICKER MARQUEE */}
      <div className="bg-[#111827] text-slate-200 py-3 border-t border-slate-800 overflow-hidden select-none">
        <div className="animate-marquee-scroll flex items-center gap-8 whitespace-nowrap text-xs font-bold tracking-widest uppercase">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-amber-400">★</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
