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

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full header-glass transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 h-18 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" aria-label="Shree Fashion Hub Home">
          <Logo size="md" theme="light" />
        </Link>

        {/* Desktop Navigation Links */}
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
          
          {/* User Sign In / Account Dropdown */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full pl-2 pr-3 py-1.5 transition-all text-left"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-7 h-7 rounded-full bg-[#111827] text-amber-400 flex items-center justify-center text-xs font-black shadow-xs">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight max-w-[120px] truncate">
                    {user?.name || user?.phone}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">My Account</div>
                </div>
                <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Luxury Account Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Customer Info Header */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#111827] text-amber-400 flex items-center justify-center text-sm font-black shadow-xs shrink-0">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-950 truncate">
                          {user?.name || 'Valued Customer'}
                        </div>
                        <div className="text-xs text-slate-600 font-medium truncate">
                          {user?.phone ? `+91 ${user.phone.slice(-10)}` : user?.email}
                        </div>
                        {user?.email && user?.phone && (
                          <div className="text-[10px] text-slate-400 truncate">
                            {user.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="px-2 py-1.5 space-y-0.5 text-xs font-semibold text-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openCart();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors text-left"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-500" />
                      <span>Shopping Bag & Items</span>
                      {totalItems > 0 && (
                        <span className="ml-auto bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {totalItems}
                        </span>
                      )}
                    </button>

                    <a
                      href="#unboxing-policy"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#92400E]" />
                      <span>Unboxing Guarantee Policy</span>
                    </a>
                  </div>

                  {/* Clean Logout / Sign Out Button */}
                  <div className="mt-1 pt-1.5 border-t border-slate-100 px-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold text-xs transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>Sign Out of Account</span>
                    </button>
                  </div>
                </div>
              )}
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

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-5 py-5 space-y-4 shadow-xl">
          {/* Mobile User Profile Section */}
          {isAuthenticated && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#111827] text-amber-400 flex items-center justify-center text-xs font-black shadow-xs">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {user?.name || 'Customer'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {user?.phone ? `+91 ${user.phone.slice(-10)}` : user?.email}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1 border border-red-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}

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
