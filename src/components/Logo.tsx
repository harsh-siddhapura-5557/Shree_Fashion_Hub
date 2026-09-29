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
      ? 'w-16 h-16' 
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
    <div className="flex items-center gap-2.5 sm:gap-3 group select-none transition-all">
      
      {/* Official 3D Luxury Gold & Black SF Monogram Crest */}
      <div className={`relative ${badgeDimensions} rounded-xl bg-white p-0.5 shadow-sm border border-slate-200/90 shrink-0 group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden`}>
        <img
          src="/brand/sf-luxury-logo.png"
          alt="Shree Fashion Hub Logo"
          className="w-full h-full object-contain filter drop-shadow-xs"
        />
      </div>

      {/* Luxury Brand Typography */}
      <div className="flex flex-col text-left justify-center">
        <div className={`${titleSize} font-display leading-none flex items-center gap-1.5`}>
          <span className={`tracking-[0.06em] font-serif ${isLight ? 'text-slate-950 font-black' : 'text-white font-black'}`}>
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
