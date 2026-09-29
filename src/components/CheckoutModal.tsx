'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, ShieldAlert, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Ahmedabad');
  const [state, setState] = useState('Gujarat');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI / Online'>('COD');
  const [unboxingPolicyAccepted, setUnboxingPolicyAccepted] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync user info into form fields whenever user changes or modal opens
  React.useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.email) setCustomerEmail(user.email);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!unboxingPolicyAccepted) {
      setErrorMessage('You must acknowledge the unboxing video return policy to proceed.');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your bag is empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail: customerEmail || 'customer@shreefashionhub.com',
        shippingAddress,
        city,
        state,
        pincode,
        items: cart.map(item => ({
          productId: item.productId,
          title: item.title,
          size: item.size,
          colorName: item.color.name,
          colorHex: item.color.hex,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        subtotal,
        shippingFee: 0,
        totalAmount: subtotal,
        paymentMethod,
        unboxingPolicyAccepted: true
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrderSuccess(data.order);
        clearCart();
        triggerConfetti();
      } else {
        setErrorMessage(data.message || 'Failed to place order.');
      }
    } catch {
      setErrorMessage('Network error occurred while confirming order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      
      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#111827] p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Direct Checkout
            </span>
            <h2 className="text-lg sm:text-xl font-black font-display text-white">
              {orderSuccess ? 'ORDER CONFIRMED' : 'CONFIRM YOUR DELIVERY'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSuccess ? (
          /* Order Confirmation View */
          <div className="p-5 sm:p-7 space-y-5 text-center">
            
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-1.5">
                Order #{orderSuccess.orderNumber}
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Thank you, {orderSuccess.customerName}!
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Your order is confirmed. A receipt has been sent to <strong>{orderSuccess.customerEmail}</strong> and our dispatch team has been notified.
              </p>
            </div>

            {/* Crucial Return Policy Warning in confirmation */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-left text-xs text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 uppercase text-[11px]">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Unboxing Video Requirement Reminder</span>
              </div>
              <p className="font-medium text-amber-900 text-xs leading-relaxed">
                Note: Return valid only for damaged/defective pieces with a complete unboxing video. Keep the package video recorded from start to finish.
              </p>
            </div>

            {/* Delivery address brief */}
            <div className="bg-slate-50 p-3.5 rounded-xl text-left border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-700">Delivery Address:</div>
              <div className="text-slate-600">
                {orderSuccess.shippingAddress}, {orderSuccess.city}, {orderSuccess.state} - {orderSuccess.pincode}
              </div>
              <div className="font-bold text-slate-900 pt-2 border-t border-slate-200 flex justify-between">
                <span>Total Payable ({orderSuccess.paymentMethod}):</span>
                <span>₹{orderSuccess.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#111827] hover:bg-[#1E3A8A] text-white font-bold text-xs transition-colors"
            >
              Continue Shopping
            </button>

          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handlePlaceOrder} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Contact Details */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                1. Customer & Notification Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile Phone (For Courier)</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Email (For Confirmation Receipt)</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            {/* Shipping Details */}
            <div className="space-y-2.5 pt-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                2. Shipping Address
              </h4>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Street Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="House number, apartment name, street, landmark..."
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="6 Digits"
                    maxLength={6}
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2 pt-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                3. Payment Method
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-slate-900 bg-slate-50 text-slate-950 ring-1 ring-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="font-bold text-xs">Cash on Delivery (COD)</div>
                  <div className="text-[10px] text-slate-500">Pay when order arrives</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI / Online')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'UPI / Online'
                      ? 'border-slate-900 bg-slate-50 text-slate-950 ring-1 ring-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="font-bold text-xs">UPI / Online</div>
                  <div className="text-[10px] text-slate-500">Scan QR / Instant</div>
                </button>
              </div>
            </div>

            {/* MANDATORY UNBOXING VIDEO RETURN POLICY CHECKBOX */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-300 text-amber-950">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={unboxingPolicyAccepted}
                  onChange={e => setUnboxingPolicyAccepted(e.target.checked)}
                  required
                  className="mt-0.5 w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500 shrink-0"
                />
                <span className="text-xs text-amber-900 font-semibold leading-relaxed">
                  I accept the store return policy: <br />
                  <strong className="text-slate-950">
                    &quot;Note: Return valid only for damaged/defective pieces with a complete unboxing video.&quot;
                  </strong>
                </span>
              </label>
            </div>

            {/* Total and Submit */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Total Payable</span>
                <span className="text-xl font-black text-slate-950">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-5 rounded-xl bg-[#111827] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Placing...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
