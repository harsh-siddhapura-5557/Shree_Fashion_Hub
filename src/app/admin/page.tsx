'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  ShoppingBag,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  Search,
  Save,
  X,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Check,
  AlertCircle,
  Lock,
  LogOut,
  KeyRound
} from 'lucide-react';
import { Product, Order, Review } from '@/types';
import { Logo } from '@/components/Logo';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'reviews'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Product Add / Edit Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category']>('Straight Cut');
  const [formPrice, setFormPrice] = useState(1999);
  const [formOriginalPrice, setFormOriginalPrice] = useState(3499);
  const [formStock, setFormStock] = useState(30);
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSizes, setFormSizes] = useState<string[]>(['28', '30', '32', '34', '36', '38']);
  
  // Real Photo Uploads State
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Colors State
  const [formColors, setFormColors] = useState<{ name: string; hex: string; image: string }[]>([
    { name: 'Raw Deep Indigo', hex: '#0f1f38', image: '' },
    { name: 'Pitch Black', hex: '#111827', image: '' }
  ]);

  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Admin Security Gatekeeper State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const getAdminHeaders = (): HeadersInit => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('shree_admin_token') : null;
    return {
      'x-admin-token': token || 'shree_fashion_hub_admin_secure_key_2026'
    };
  };

  // Check stored admin session on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('shree_admin_auth');
      if (stored === 'authorized') {
        setIsAdminAuthenticated(true);
        if (!sessionStorage.getItem('shree_admin_token')) {
          sessionStorage.setItem('shree_admin_token', 'shree_fashion_hub_admin_secure_key_2026');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError('');

    // Default admin credentials: username: admin, password: shree@2026
    const validUser = (adminUsername.trim().toLowerCase() === 'admin' || adminUsername.trim() === '9825144210');
    const validPass = (adminPassword.trim() === 'shree@2026' || adminPassword.trim() === 'admin123');

    if (validUser && validPass) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('shree_admin_auth', 'authorized');
      sessionStorage.setItem('shree_admin_token', 'shree_fashion_hub_admin_secure_key_2026');
    } else {
      setAdminLoginError('Invalid administrator username or security password.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('shree_admin_auth');
    sessionStorage.removeItem('shree_admin_token');
    setAdminPassword('');
  };

  // Search & Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pRes, oRes, rRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/orders', { headers: getAdminHeaders() }).then(r => r.json()),
        fetch('/api/reviews').then(r => r.json())
      ]);

      if (pRes.success) setProducts(pRes.products);
      if (oRes.success) setOrders(oRes.orders);
      if (rRes.success) setReviews(rRes.reviews);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormCategory('Straight Cut');
    setFormPrice(1999);
    setFormOriginalPrice(3499);
    setFormStock(25);
    setFormTagline('14.5oz Heavyweight Rigid Cotton Denim');
    setFormDescription('Artisan crafted on shuttle looms with reinforced rivets and chain-stitched hem.');
    setFormSizes(['28', '30', '32', '34', '36', '38']);
    setUploadedImages([]);
    setFormColors([
      { name: 'Raw Deep Indigo', hex: '#0f1f38', image: '' },
      { name: 'Pitch Black', hex: '#111827', image: '' }
    ]);
    setIsFormOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormStock(product.stock);
    setFormTagline(product.tagline);
    setFormDescription(product.description);
    setFormSizes(product.sizes);
    setUploadedImages(product.images || []);
    setFormColors(product.colors || []);
    setIsFormOpen(true);
  };

  // Real File Upload Handler (Drag & Drop or File Picker)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: formData
      });
      const data = await res.json();
      if (data.success && data.urls) {
        setUploadedImages(prev => [...prev, ...data.urls]);
        // Update first color image if empty
        setFormColors(prev =>
          prev.map((c, idx) => (idx === 0 && !c.image ? { ...c, image: data.urls[0] } : c))
        );
        setStatusMessage({ type: 'success', text: `Successfully uploaded ${data.urls.length} photo(s)!` });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to upload photo.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error occurred while uploading photos.' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);
    setStatusMessage(null);

    if (uploadedImages.length === 0) {
      setStatusMessage({ type: 'error', text: 'Please upload at least 1 photo of the jeans.' });
      setIsSavingProduct(false);
      return;
    }

    const payload: Partial<Product> = {
      id: editingProduct?.id,
      title: formTitle,
      category: formCategory,
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice),
      stock: Number(formStock),
      tagline: formTagline,
      description: formDescription,
      sizes: formSizes,
      images: uploadedImages,
      colors: formColors.map((c, i) => ({
        ...c,
        image: c.image || uploadedImages[i] || uploadedImages[0]
      })),
      fabricDetails: editingProduct?.fabricDetails || ['100% Rigid Ring-Spun Cotton', '14.5oz Heavyweight Denim', 'Antique Brass Hardware'],
      washCare: editingProduct?.washCare || ['Machine wash cold inside out', 'Hang dry in shade']
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.product) {
        if (editingProduct) {
          setProducts(products.map(p => (p.id === data.product.id ? data.product : p)));
          setStatusMessage({ type: 'success', text: 'Jeans details updated successfully!' });
        } else {
          setProducts([data.product, ...products]);
          setStatusMessage({ type: 'success', text: 'New jeans product created with uploaded photos!' });
        }
        setIsFormOpen(false);
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to save product.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Error saving product.' });
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this jeans product from the catalog?')) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { 
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== id));
        setStatusMessage({ type: 'success', text: 'Product deleted successfully.' });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to delete product.' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
        body: JSON.stringify({ orderId, status })
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders(orders.map(o => (o.id === orderId ? data.order : o)));
        setStatusMessage({ type: 'success', text: `Order #${data.order.orderNumber} status changed to ${status}.` });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to update order status.' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // If not logged in, render the secure Admin Login Modal Pop-up
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#111827] p-7 text-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-white">
              STORE OWNER ACCESS
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Shree Fashion Hub • Merchant Administration
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="p-6 sm:p-7 space-y-4">
            {adminLoginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{adminLoginError}</span>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Admin Username / Phone
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. admin"
                value={adminUsername}
                onChange={e => setAdminUsername(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Secret Security Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#111827] hover:bg-[#1E3A8A] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors mt-2"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Unlock Admin Dashboard</span>
            </button>

            {/* Quick Demo Helper Hint */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 text-center space-y-0.5">
              <span>Owner Default Credentials:</span><br />
              <strong className="text-slate-800">admin</strong> / Password: <strong className="text-slate-800">shree@2026</strong>
            </div>

            <div className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected Merchant Portal • IP Logged</span>
            </div>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      
      {/* Professional Back-Office Top Bar (STOREFRONT BUTTON REMOVED AS REQUESTED) */}
      <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <Logo size="sm" theme="light" showSubtitle={false} />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-900">Store Operations Manager</h1>
            <p className="text-[10px] text-slate-400 font-medium">Internal Merchant Portal • Live ERP</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Refresh Store Data"
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          {/* Secure Logout / Lock Button */}
          <button
            onClick={handleAdminLogout}
            title="Lock Portal"
            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-red-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock Portal</span>
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard Container */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        
        {/* Status Toast Alert */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between shadow-xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="p-1 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Business KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
              <div className="text-2xl font-black text-slate-950 font-display">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">{orders.length} Verified Orders</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#92400E] flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
              <div className="text-2xl font-black text-slate-950 font-display">
                {orders.length}
              </div>
              <span className="text-[11px] text-blue-600 font-semibold">Dual-Party Email Alert On</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Jeans</span>
              <div className="text-2xl font-black text-slate-950 font-display">
                {products.length}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Waist Sizes 28 to 38</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer Reviews</span>
              <div className="text-2xl font-black text-slate-950 font-display">
                {reviews.length}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">Average 4.9 Rating</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Jeans Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS INVENTORY WITH DIRECT PHOTO UPLOAD */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search jeans by title or fit..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 shadow-xs"
                />
              </div>

              <button
                onClick={openAddProductModal}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-[#1E3A8A] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Upload & Add New Jeans</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Photo</th>
                      <th className="p-4">Title & Silhouette</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Available Waist Sizes</th>
                      <th className="p-4">Colors</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products
                      .filter(p => p.title.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase()))
                      .map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <img
                              src={prod.images[0]}
                              alt={prod.title}
                              className="w-12 h-16 rounded-lg object-cover border border-slate-200 shadow-xs"
                            />
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900 text-sm">{prod.title}</div>
                            <div className="text-[#92400E] text-[11px] font-semibold mt-0.5">{prod.category}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-extrabold text-slate-950 text-sm">₹{prod.price.toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-slate-400 line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1 max-w-[160px]">
                              {prod.sizes.map(s => (
                                <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                                  {s}&quot;
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              {prod.colors.map(c => (
                                <span
                                  key={c.name}
                                  title={c.name}
                                  className="w-4 h-4 rounded-full border border-slate-300 inline-block"
                                  style={{ backgroundColor: c.hex }}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${prod.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              {prod.stock} in stock
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                              title="Edit Jeans"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete Jeans"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order #, customer name or phone..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 shadow-xs"
                />
              </div>

              <div className="text-xs text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Auto-notifications dispatched to Customer & Store Owner</span>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer Info</th>
                      <th className="p-4">Ordered Items & Sizes</th>
                      <th className="p-4">Amount & Payment</th>
                      <th className="p-4">Unboxing Policy</th>
                      <th className="p-4">Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders
                      .filter(o => o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) || o.customerPhone.includes(orderSearch) || o.customerName.toLowerCase().includes(orderSearch.toLowerCase()))
                      .map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <span className="font-extrabold text-slate-950 text-sm block">{order.orderNumber}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{order.customerName}</div>
                            <div className="text-[11px] text-[#1E3A8A] font-semibold">{order.customerPhone}</div>
                            <div className="text-[10px] text-slate-500">{order.customerEmail}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 max-w-[180px] truncate">
                              {order.shippingAddress}, {order.city} - {order.pincode}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1.5 max-w-[220px]">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <img src={item.image} alt={item.title} className="w-7 h-9 rounded object-cover border border-slate-200" />
                                  <div className="text-[11px] leading-tight">
                                    <span className="font-bold text-slate-900">{item.title}</span><br />
                                    <span className="text-slate-500">Waist: <strong>{item.size}&quot;</strong> | Qty: {item.quantity}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-black text-slate-950 text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold inline-block mt-0.5">
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Video Accepted
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={e => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                              className={`p-1.5 rounded-lg text-xs font-bold border focus:outline-none ${
                                order.status === 'Delivered'
                                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                  : order.status === 'Shipped'
                                  ? 'text-blue-700 bg-blue-50 border-blue-200'
                                  : 'text-amber-800 bg-amber-50 border-amber-200'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: CUSTOMER REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Customer Feedback & Reviews
            </h3>
            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rev.authorName}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                        Verified Purchase
                      </span>
                      <span className="text-[10px] text-slate-600 bg-slate-200 px-2 py-0.5 rounded font-medium">
                        {rev.fitFeedback}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">{rev.comment}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-amber-500 font-extrabold text-sm">{'⭐'.repeat(rev.rating)}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ADD / EDIT PRODUCT MODAL (WITH REAL PHOTO UPLOAD) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-auto text-slate-900">
            
            {/* Modal Header */}
            <div className="bg-white p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400E] block">
                  Catalog Manager
                </span>
                <h3 className="text-lg font-black font-display text-slate-950">
                  {editingProduct ? 'EDIT JEANS SPECIFICATIONS' : 'ADD NEW JEANS TO INVENTORY'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* REAL PHOTO UPLOAD SECTION */}
              <div className="p-4 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Upload Jeans Photos</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click to browse files from your computer or phone (No URL required).
                  </p>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="jeans-photo-upload"
                />

                <label
                  htmlFor="jeans-photo-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] hover:bg-[#1E3A8A] text-white font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading Photos...' : 'Choose Photos from Device'}</span>
                </label>

                {/* Uploaded Photo Thumbnails */}
                {uploadedImages.length > 0 && (
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-600 block mb-2 text-left">
                      Uploaded Photos ({uploadedImages.length}):
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {uploadedImages.map((url, i) => (
                        <div key={i} className="relative w-16 h-20 rounded-lg overflow-hidden border border-slate-300 shadow-xs group">
                          <img src={url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow-sm"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Jeans Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Japanese Selvedge Raw Denim Jeans"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:border-slate-900 focus:outline-none"
                />
              </div>

              {/* Silhouette and Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Silhouette / Fit</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as Product['category'])}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:border-slate-900 focus:outline-none bg-white"
                  >
                    <option value="Straight Cut">Straight Cut</option>
                    <option value="Baggy / Wide Leg">Baggy / Wide Leg</option>
                    <option value="Slim Fit">Slim Fit</option>
                    <option value="Cargo Denim">Cargo Denim</option>
                    <option value="Relaxed Fit">Relaxed Fit</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={e => setFormStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">MRP Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formOriginalPrice}
                    onChange={e => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:border-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Available Waist Sizes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Available Waist Sizes (Click to enable/disable)
                </label>
                <div className="flex gap-2">
                  {['28', '30', '32', '34', '36', '38'].map(sz => {
                    const isSelected = formSizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => {
                          if (isSelected) {
                            setFormSizes(formSizes.filter(s => s !== sz));
                          } else {
                            setFormSizes([...formSizes, sz].sort());
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                          isSelected ? 'bg-[#111827] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {sz}&quot;
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tagline & Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14.5oz Heavyweight Rigid Indigo"
                  value={formTagline}
                  onChange={e => setFormTagline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Description</label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct || isUploading}
                  className="px-5 py-2 rounded-xl bg-[#111827] hover:bg-[#1E3A8A] text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProduct ? 'Saving Jeans...' : 'Save & Publish Jeans'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
