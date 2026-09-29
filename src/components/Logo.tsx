'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  showSubtitle?: boolean;
}

export function Logo({ size = 'md', theme = 'light', showSubtitle = true }: LogoProps) {
  const isLight = theme === 'light';

  // Sizing definitions
  const badgeDimensions = 
    size === 'sm' 
      ? 'w-9 h-9' 
      : size === 'lg' 
      ? 'w-14 h-14' 
      : 'w-11 h-11';

  const titleSize = 
    size === 'sm'
      ? 'text-base font-black'
      : size === 'lg'
      ? 'text-2xl font-black'
      : 'text-lg sm:text-xl font-black';

  const subtitleSize = 
    size === 'sm'
      ? 'text-[8px] tracking-[0.2em]'
      : size === 'lg'
      ? 'text-[11px] tracking-[0.24em]'
      : 'text-[9px] sm:text-[10px] tracking-[0.22em]';

  return (
    <div className="flex items-center gap-3 group select-none transition-all">
      
      {/* Handcrafted Denim Atelier Heraldic Crest */}
      <div className={`relative ${badgeDimensions} rounded-2xl bg-gradient-to-br from-[#0c1527] via-[#111827] to-[#050914] p-1 shadow-md border border-slate-700/80 shrink-0 group-hover:scale-105 group-hover:shadow-amber-500/10 transition-all duration-300 flex items-center justify-center`}>
        
        {/* Double Gold Stitch Accent Ring */}
        <div className="absolute inset-1 rounded-xl border border-dashed border-amber-500/50 pointer-events-none" />

        {/* Vector Heraldic SF Monogram Crest */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full p-1 drop-shadow-sm" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield Path */}
          <path 
            d="M50 8 L84 22 V54 C84 72 50 92 50 92 C50 92 16 72 16 54 V22 L50 8 Z" 
            fill="#1E3A8A" 
            fillOpacity="0.35"
            stroke="#D97706" 
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Golden Stitch Track */}
          <path 
            d="M50 16 L76 27 V52 C76 66 50 82 50 82 C50 82 24 66 24 52 V27 L50 16 Z" 
            stroke="#F59E0B" 
            strokeWidth="1.8" 
            strokeDasharray="4 3" 
            strokeLinecap="round"
          />

          {/* Letter S in Burnished Gold */}
          <path 
            d="M36 34 C36 29 42 26 50 26 C58 26 62 29 62 33 C62 38 56 41 46 43 C37 45 33 49 33 55 C33 63 41 66 50 66 C59 66 65 62 65 57" 
            stroke="#FBBF24" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Letter F in Brilliant Crisp White (Intertwined) */}
          <path 
            d="M52 32 H70 M52 32 V68 M52 48 H66" 
            stroke="#FFFFFF" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Center Golden Artisan Star Rivet */}
          <circle cx="50" cy="18" r="3.5" fill="#F59E0B" />
          <circle cx="50" cy="18" r="1.5" fill="#FFFBEB" />
        </svg>

      </div>

      {/* Luxury Brand Typography */}
      <div className="flex flex-col text-left justify-center">
        <div className={`${titleSize} font-display leading-none flex items-center gap-1.5`}>
          <span className={`tracking-[0.08em] font-serif ${isLight ? 'text-slate-950 font-black' : 'text-white font-black'}`}>
            SHREE
          </span>
          <span className="text-[#B45309] font-black tracking-normal">
            FASHION HUB
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`uppercase font-extrabold ${subtitleSize} ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Handcrafted Denim
            </span>
            <span className="text-amber-500 text-[9px] font-bold">•</span>
            <span className={`uppercase font-extrabold ${subtitleSize} ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Est. 2026
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
