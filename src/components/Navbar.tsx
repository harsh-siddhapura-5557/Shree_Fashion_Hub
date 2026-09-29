'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, ShieldCheck, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

import { Logo } from '@/components/Logo';

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full header-glass transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" aria-label="Shree Fashion Hub Home">
          <Logo size="md" theme="light" />
        </Link>

        {/* Desktop Navigation Links (ADMIN PANEL BUTTON REMOVED AS REQUESTED) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-normal text-slate-700">
          <a href="#catalog" className="hover:text-[#1E3A8A] transition-colors">
            All Jeans
          </a>
          <a href="#fit-guide" className="hover:text-[#1E3A8A] transition-colors">
            Fit Guide
          </a>
          <a href="#unboxing-policy" className="hover:text-[#1E3A8A] flex items-center gap-1.5 transition-colors">
            <ShieldCheck className="w-4 h-4 text-[#92400E]" />
            <span>Unboxing Guarantee</span>
          </a>
          <a href="#reviews" className="hover:text-[#1E3A8A] transition-colors">
            Customer Reviews
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* User Sign In / Account */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-xs font-bold">
                {user?.name?.[0] || 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-800 max-w-[90px] sm:max-w-[130px] truncate">
                {user?.name || user?.phone}
              </span>
              <button
                onClick={logout}
                title="Logout"
                className="text-slate-400 hover:text-red-600 ml-1 p-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <User className="w-4 h-4 text-slate-600" />
              <span>Login / Sign In</span>
            </button>
          )}

          {/* Bag Button */}
          <button
            onClick={openCart}
            aria-label="Shopping Bag"
            className="relative px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-full bg-[#111827] hover:bg-slate-800 text-white font-bold transition-transform active:scale-95 shadow-sm flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="text-xs font-bold tracking-wide">
              Bag
            </span>
            {totalItems > 0 && (
              <span className="bg-[#92400E] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center ml-0.5">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation (ADMIN PANEL BUTTON REMOVED) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-5 py-5 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-3 font-semibold text-sm text-slate-800">
            <a
              href="#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-slate-100 hover:text-[#1E3A8A]"
            >
              <span>Explore All Jeans</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#fit-guide"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-slate-100 hover:text-[#1E3A8A]"
            >
              <span>Fit Guide (Slim, Baggy, Straight)</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#unboxing-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-slate-100 text-[#92400E]"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Unboxing Video Guarantee
              </span>
              <ChevronRight className="w-4 h-4 text-[#92400E]" />
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 hover:text-[#1E3A8A]"
            >
              <span>Customer Reviews</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </nav>

          {!isAuthenticated && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="w-full py-3 rounded-xl bg-[#111827] text-white font-bold text-xs flex items-center justify-center gap-2 mt-2"
            >
              <User className="w-4 h-4" />
              <span>Login / Sign Up with Phone</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
