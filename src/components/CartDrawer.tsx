'use client';

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CheckoutModal } from './CheckoutModal';

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      openAuthModal(() => {
        setIsCheckoutOpen(true);
      });
    } else {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity">
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 bg-white text-slate-900 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#1E3A8A]" />
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide font-display">
                  Your Shopping Bag ({totalItems})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="text-slate-400 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Alert Bar */}
            <div className="bg-[#FAF9F6] border-b border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs text-slate-700 font-semibold">
              <span>All India Free Express Delivery</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                Applied
              </span>
            </div>

            {/* Cart Items List */}
            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Your bag is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Browse our collection of 100% cotton jeans and choose your fit.
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-bold hover:bg-[#1E3A8A] transition-colors"
                  >
                    Explore Jeans
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 items-center justify-between"
                  >
                    <div className="w-14 h-18 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span>Waist: <strong>{item.size}</strong></span>
                        <span>•</span>
                        <span className="truncate">{item.color.name}</span>
                      </div>
                      <div className="text-xs font-black text-slate-950 mt-1">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Quantity Pill */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3">
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span className="text-base text-slate-950">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 rounded-xl bg-[#111827] hover:bg-[#1E3A8A] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span>{isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-slate-500">
                  Returns valid only for damaged/defective pieces with full unboxing video.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          closeCart();
        }}
      />
    </>
  );
}
