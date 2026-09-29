'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Phone, MapPin, ArrowRight, CheckCircle2, Video } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#111827] text-slate-200 border-t border-slate-800">
      
      {/* Top Denim VIP Club Newsletter Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-10">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
              Exclusive Member Access
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white">
              Join the Shree Fashion Hub VIP Denim Club
            </h3>
            <p className="text-xs text-slate-400 max-w-md">
              Receive early access to limited Japanese selvedge drops, restock alerts, and exclusive private discounts.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter mobile or email address"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
            >
              <span>{isSubscribed ? 'Joined!' : 'Join Drops'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-16 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Atelier Col (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" theme="dark" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm pt-1">
              Crafting premium denim engineered specifically for Indian builds. Built with heavy ring-spun cotton, authentic shuttle loom selvedge, and solid brass hardware.
            </p>
            {/* Official Brand Seal (First uploaded image) */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-slate-800/80 shadow-xs max-w-sm">
              <div className="w-16 h-16 rounded-xl bg-white p-1 shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                <img 
                  src="/brand/shree-fashion-hub-emblem.png" 
                  alt="Shree Fashion Hub Official Seal" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                  Official Atelier Seal
                </span>
                <h4 className="text-xs font-black text-white">
                  Shree Fashion Hub
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  100% Genuine Handcrafted Denim Guarantee
                </p>
              </div>
            </div>
          </div>

          {/* Cuts & Silhouettes (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Signature Fits
            </h4>
            <ul className="text-xs space-y-2.5 text-slate-400 font-medium">
              <li><a href="#fit-guide" className="hover:text-amber-400 transition-colors">Classic Straight Cut</a></li>
              <li><a href="#fit-guide" className="hover:text-amber-400 transition-colors">90s Vintage Acid Baggy</a></li>
              <li><a href="#fit-guide" className="hover:text-amber-400 transition-colors">Precision Slim Tapered</a></li>
              <li><a href="#fit-guide" className="hover:text-amber-400 transition-colors">Tactical Cargo Jeans</a></li>
              <li><a href="#fit-guide" className="hover:text-amber-400 transition-colors">Heritage Carpenter Workwear</a></li>
            </ul>
          </div>

          {/* Transparent Return Policy Box (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Store Return Guarantee
            </h4>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[11px] uppercase tracking-wide">
                <Video className="w-3.5 h-3.5" />
                <span>Unboxing Video Requirement</span>
              </div>
              <p className="text-xs font-semibold leading-relaxed text-amber-100">
                Note: Return valid only for damaged/defective pieces with a complete unboxing video.
              </p>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Record a single uncut video while opening the courier package for fast replacement or full refund.
            </p>
          </div>

          {/* Studio Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Denim Studio
            </h4>
            <div className="text-xs space-y-3 text-slate-400 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Bodakdev, SG Highway, Ahmedabad, Gujarat - 380054</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:support@shreefashionhub.com" className="hover:text-white transition-colors">
                  support@shreefashionhub.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98251 44210 (10 AM - 8 PM IST)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Trust Seals */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="pl-1">
            © {new Date().getFullYear()} Shree Fashion Hub. All rights reserved. Handcrafted in India.
          </p>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
            <span>UPI & Online Pay</span>
            <span>•</span>
            <span>Cash On Delivery</span>
            <span>•</span>
            <span>All-India Free Dispatch</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
