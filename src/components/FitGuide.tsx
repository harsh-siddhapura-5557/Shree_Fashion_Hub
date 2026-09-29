'use client';

import React, { useState } from 'react';
import { Ruler, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FitType {
  id: string;
  categoryName: string;
  name: string;
  tagline: string;
  rise: string;
  thigh: string;
  legOpening: string;
  recommendedFor: string;
  description: string;
  image: string;
  accentColor: string;
}

const FITS: FitType[] = [
  {
    id: 'straight',
    categoryName: 'Straight Cut',
    name: 'Classic Straight Cut',
    tagline: 'Timeless American Silhouette',
    rise: 'Mid Rise (10.5")',
    thigh: 'Regular Ease',
    legOpening: '16" Straight Opening',
    recommendedFor: 'Boots, high-top sneakers, casual and semi-formal wear',
    description: 'Uniform width from thigh to hem. Balanced drape that flatters all Indian body types.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    accentColor: '#1E3A8A'
  },
  {
    id: 'baggy',
    categoryName: 'Baggy / Wide Leg',
    name: '90s Relaxed Baggy',
    tagline: 'Authentic Streetwear Stack',
    rise: 'Mid-to-High Rise (11.5")',
    thigh: 'Generous Relaxed',
    legOpening: '18" Wide Stack',
    recommendedFor: 'Oversized tees, streetwear hoodies, retro sneakers',
    description: 'Spacious through hip and leg with natural pooling over chunkier sneakers. Peak comfort.',
    image: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=800&q=80',
    accentColor: '#92400E'
  },
  {
    id: 'slim',
    categoryName: 'Slim Fit',
    name: 'Precision Slim Tapered',
    tagline: 'Sculpted 4-Way Power Flex',
    rise: 'Mid Rise (10")',
    thigh: 'Fitted Contour',
    legOpening: '14" Tapered',
    recommendedFor: 'Loafers, athletic builds, sharp evening looks',
    description: 'Contours the leg naturally with high-recovery elastane. Never bags out at the knees.',
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80',
    accentColor: '#0F172A'
  },
  {
    id: 'cargo',
    categoryName: 'Cargo Denim',
    name: 'Tactical Multi-Pocket',
    tagline: 'Heavy Duty 6-Pocket Utility',
    rise: 'Mid Rise (10.8")',
    thigh: 'Comfort Relaxed',
    legOpening: '15.5" Articulated',
    recommendedFor: 'Travel, utility wear, combat boots, active street life',
    description: 'Engineered knee darts with deep reinforced bellows pockets and antique brass snaps.',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
    accentColor: '#3F4E3C'
  }
];

export function FitGuide() {
  const [selectedFitId, setSelectedFitId] = useState('straight');
  const activeFit = FITS.find(f => f.id === selectedFitId) || FITS[0];

  return (
    <section id="fit-guide" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 border border-slate-200">
              <Ruler className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Interactive Denim Fit Studio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-slate-950">
              FIND YOUR PERFECT <span className="text-[#1E3A8A]">JEANS FIT</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Compare how each cut drapes from waist to ankle. Click any fit to explore measurements and available sizes.
            </p>
          </div>

          {/* Quick Fit Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {FITS.map(fit => (
              <button
                key={fit.id}
                onClick={() => setSelectedFitId(fit.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  selectedFitId === fit.id
                    ? 'bg-[#111827] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {fit.name}
              </button>
            ))}
          </div>
        </div>

        {/* 4-COLUMN FULL-WIDTH INTERACTIVE VISUAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {FITS.map(fit => {
            const isSelected = selectedFitId === fit.id;

            return (
              <div
                key={fit.id}
                onClick={() => setSelectedFitId(fit.id)}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-900 shadow-xl bg-[#FAF9F6] transform -translate-y-1'
                    : 'border-slate-200 hover:border-slate-400 bg-white shadow-xs hover:shadow-md'
                }`}
              >
                {/* Visual Image Header */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={fit.image}
                    alt={fit.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Badge on image */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm text-[11px] font-black tracking-wider uppercase text-slate-900 shadow-xs">
                      {fit.categoryName}
                    </span>
                  </div>

                  {/* Active Indicator Pin */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-[#111827] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Active Selection</span>
                    </div>
                  )}

                  {/* Tagline over image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wide">
                      {fit.tagline}
                    </div>
                    <div className="text-base font-black font-display text-white">
                      {fit.name}
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {fit.description}
                  </p>

                  {/* Precision Specs Table */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200/90 text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="text-slate-400 font-medium">Waist Rise:</span>
                      <span className="font-extrabold text-slate-900">{fit.rise}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="text-slate-400 font-medium">Thigh Room:</span>
                      <span className="font-extrabold text-slate-900">{fit.thigh}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="text-slate-400 font-medium">Leg Opening:</span>
                      <span className="font-extrabold text-slate-900">{fit.legOpening}</span>
                    </div>
                  </div>

                  {/* Available Waist Sizes Pills */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      In-Stock Waist Sizes:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {['28', '30', '32', '34', '36', '38'].map(sz => (
                        <span
                          key={sz}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-extrabold"
                        >
                          {sz}&quot;
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Styling Advice */}
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#92400E] shrink-0 mt-0.5" />
                    <span><strong>Pair With:</strong> {fit.recommendedFor}</span>
                  </div>

                  {/* Action Link to Catalog */}
                  <a
                    href="#catalog"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-[#111827] text-white hover:bg-[#1E3A8A]'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    <span>View {fit.categoryName} Jeans</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
