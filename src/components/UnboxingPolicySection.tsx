'use client';

import React from 'react';
import { Video, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export function UnboxingPolicySection() {
  return (
    <section id="unboxing-policy" className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual Guide Card */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-[#FAF9F6] border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#92400E]" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Unboxing Protocol
                  </span>
                </div>
                <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-extrabold">
                  MANDATORY
                </span>
              </div>

              {/* Step Checklist */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-[#111827] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Before Cutting The Bag</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Show all sides of the parcel and the address shipping label clearly to the camera.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-[#111827] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Single Uncut Video</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Keep the recording continuous without pausing or editing while opening the courier package.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-[#111827] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Immediate Inspection</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Inspect buttons, zipper, and fabric on camera to confirm condition.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px] leading-tight">Videos filmed after the package has already been opened cannot be accepted.</span>
              </div>

            </div>
          </div>

          {/* Right Column: Explanatory Text */}
          <div className="lg:col-span-7 space-y-4 order-1 lg:order-2 text-left">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] p-1 shadow-xs border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                <img 
                  src="/brand/shree-fashion-hub-emblem.png" 
                  alt="Shree Fashion Hub Certified Seal" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>Official Return Guarantee</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-slate-950">
              TRANSPARENT POLICY. <br />
              <span className="text-[#1E3A8A]">ZERO COMPROMISE QUALITY.</span>
            </h2>

            {/* Official Highlighted User Requirement Quote */}
            <div className="p-4 rounded-xl bg-[#FAF9F6] border-2 border-amber-400/80 text-slate-900">
              <p className="text-sm sm:text-base font-bold text-slate-950">
                &ldquo;Note: Return valid only for damaged/defective pieces with a complete unboxing video.&rdquo;
              </p>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Every single pair of jeans shipped by Shree Fashion Hub passes rigorous triple-point stitching and fabric checks. In case of courier transit damage or defect, you are protected with a fast replacement or full refund when supported by an authentic unboxing video.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Immediate replacement dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reverse doorstep pickup arranged</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
