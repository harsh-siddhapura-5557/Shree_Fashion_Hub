'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Video, ShieldCheck, Truck } from 'lucide-react';

export function ReturnPolicyBanner() {
  const pathname = usePathname();

  // Do not show customer policy banner on admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="bg-[#111827] text-slate-100 text-xs py-2.5 px-3 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left perk (Hidden on small mobile) */}
        <div className="hidden md:flex items-center gap-1.5 text-slate-300 font-medium text-[11px]">
          <Truck className="w-3.5 h-3.5 text-amber-500" />
          <span>All India Free Express Delivery</span>
        </div>

        {/* Center Critical Policy Notice */}
        <div className="flex items-center justify-center gap-1.5 mx-auto text-center font-medium text-[11px] sm:text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            <strong className="text-amber-400 font-bold uppercase tracking-wider">Return Notice:</strong>{' '}
            Return valid only for damaged/defective pieces with a complete unboxing video.
          </span>
          <Video className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
        </div>

        {/* Right perk */}
        <div className="hidden md:flex items-center gap-1.5 text-slate-300 font-medium text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>100% Genuine Handcrafted Denim</span>
        </div>

      </div>
    </div>
  );
}
