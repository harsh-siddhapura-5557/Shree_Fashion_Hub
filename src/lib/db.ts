import fs from 'fs';
import path from 'path';
import { Product, Order, Review } from '@/types';

const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, 'store.json');
const TMP_DATA_FILE = path.join('/tmp', 'shree_store.json');

interface StoreData {
  products: Product[];
  orders: Order[];
  reviews: Review[];
}

let inMemoryStore: StoreData | null = null;

function getStoreFilePath(): string {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return TMP_DATA_FILE;
  }
  return LOCAL_DATA_FILE;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Midnight Raw Japanese Selvedge Jeans',
    slug: 'midnight-raw-japanese-selvedge-jeans',
    tagline: '14.5oz Heavyweight Rigid Indigo with Signature Red Selvedge ID',
    description: 'Crafted on vintage shuttle looms from 100% long-staple ring-spun cotton. This pair will mold to your body over time, developing unique honeycomb and whisker fades.',
    category: 'Straight Cut',
    price: 2499,
    originalPrice: 4999,
    discountPercentage: 50,
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Raw Deep Indigo', hex: '#0f1f38', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80' },
      { name: 'Pitch Obsidian Black', hex: '#121212', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80' }
    ],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 28,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 42,
    fabricDetails: ['100% Rigid Ring-Spun Cotton', '14.5 oz Shuttle Loom Selvedge', 'Solid Antiqued Brass Hardware', 'Chainstitched Hems'],
    washCare: ['Hand wash inside out with cold water only', 'Hang dry in shade to preserve raw indigo', 'Do not bleach']
  },
  {
    id: 'prod-2',
    title: 'Vintage Acid Wash Baggy Streetwear Jeans',
    slug: 'vintage-acid-wash-baggy-jeans',
    tagline: '90s Relaxed Wide-Leg Cut with Natural Stone Wash Texture',
    description: 'The definitive wide-leg silhouette. Generous room through the thigh and calf with a gentle taper at the sneaker stacking line. Extreme comfort meets iconic 90s aesthetic.',
    category: 'Baggy / Wide Leg',
    price: 1899,
    originalPrice: 3499,
    discountPercentage: 45,
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Vintage Acid Grey', hex: '#6b7280', image: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=900&q=80' },
      { name: 'Washed Ice Blue', hex: '#93c5fd', image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80' }
    ],
    images: [
      'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 45,
    isTrending: true,
    rating: 4.8,
    reviewCount: 38,
    fabricDetails: ['99% Premium Cotton, 1% Comfort Stretch', '12.8 oz Soft-Handfeel Denim', 'Reinforced Pockets with Copper Rivets'],
    washCare: ['Machine wash cold, gentle cycle', 'Do not tumble dry', 'Warm iron inside out']
  },
  {
    id: 'prod-3',
    title: 'Precision Tapered Slim Indigo Stretch Jeans',
    slug: 'precision-tapered-slim-indigo-jeans',
    tagline: 'Sculpted Silhouette with High-Recovery 4-Way Power Flex',
    description: 'Designed for daily hustle without losing shape. Features intelligent microfiber weave providing 360-degree flexibility while maintaining authentic vintage denim appearance.',
    category: 'Slim Fit',
    price: 1699,
    originalPrice: 2999,
    discountPercentage: 43,
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Dark Indigo Fade', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=900&q=80' },
      { name: 'Smoky Charcoal', hex: '#374151', image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80' }
    ],
    images: [
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 35,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 56,
    fabricDetails: ['92% Combed Cotton, 6% Elastomultiester, 2% Elastane', 'Sateen Weave Inner Finish', 'YKK Heavy Duty Locking Zipper'],
    washCare: ['Machine wash cold inside out', 'Tumble dry low or line dry']
  },
  {
    id: 'prod-4',
    title: 'Utility Tactical Multi-Pocket Cargo Jeans',
    slug: 'utility-tactical-multi-pocket-cargo-jeans',
    tagline: 'Heavy Duty 6-Pocket Utility Denim with Gusseted Cargo Compartments',
    description: 'Form meets function. Built with deep double-stitched bellows pockets, snap button closures, and engineered knee darts for unrestricted movement in city streets.',
    category: 'Cargo Denim',
    price: 2199,
    originalPrice: 3999,
    discountPercentage: 45,
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Washed Army Olive', hex: '#3f4e3c', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80' },
      { name: 'Stealth Black Denim', hex: '#18181b', image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=900&q=80' }
    ],
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 22,
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 19,
    fabricDetails: ['100% Heavy Twill Cotton Denim', 'Reinforced Crotch Gusset', 'D-Ring Gear Attachment'],
    washCare: ['Cold machine wash', 'Wash with like colors', 'Line dry in shade']
  },
  {
    id: 'prod-5',
    title: 'Heritage Carpenter Relaxed Workwear Jeans',
    slug: 'heritage-carpenter-relaxed-workwear-jeans',
    tagline: 'Hammer Loop & Tool Pocket Detail with Authentic Contrast Stitching',
    description: 'Inspired by traditional American denim workwear. Comfortable roomy fit through seat and thighs with signature hammer loop, bar-tacked stress points, and golden topstitching.',
    category: 'Relaxed Fit',
    price: 1999,
    originalPrice: 3699,
    discountPercentage: 46,
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Heritage Mid Wash Blue', hex: '#2563eb', image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=900&q=80' },
      { name: 'Ecru Off-White Canvas', hex: '#f5f5dc', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80' }
    ],
    images: [
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 30,
    isTrending: true,
    rating: 4.8,
    reviewCount: 24,
    fabricDetails: ['13.2 oz Tough Cotton Drill Denim', 'Triple-Needle Stitching on Outseams', 'Utility Tool Pockets'],
    washCare: ['Machine wash warm', 'Do not tumble dry', 'Iron on cotton setting']
  },
  {
    id: 'prod-6',
    title: 'Classic 90s Authentic Straight-Leg Denim',
    slug: 'classic-90s-authentic-straight-leg-denim',
    tagline: 'Timeless Mid-Rise Straight Cut with Light Whiskering',
    description: 'The quintessential pair that never goes out of style. Clean lines, balanced leg opening that pairs flawlessly with boots, loafers, or sneakers.',
    category: 'Straight Cut',
    price: 1799,
    originalPrice: 3199,
    discountPercentage: 44,
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Classic Sky Indigo', hex: '#3b82f6', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80' },
      { name: 'Fade Black Shadow', hex: '#27272a', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80' }
    ],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80'
    ],
    stock: 50,
    rating: 4.9,
    reviewCount: 61,
    fabricDetails: ['98% Ring-Spun Cotton, 2% Stretch', 'Standard 16-inch Leg Opening', 'Reinforced Rivets'],
    washCare: ['Machine wash cold with similar colors', 'Hang dry recommended']
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    authorName: 'Aarav Patel',
    rating: 5,
    comment: 'The quality of this Japanese selvedge is mind-blowing! Heavyweight denim, beautiful red selvedge line when cuffed. Unboxing video condition was very clear and packaging was top-notch.',
    fitFeedback: 'True to Size',
    verifiedPurchase: true,
    createdAt: '2026-09-24T14:20:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    authorName: 'Devang Sharma',
    rating: 5,
    comment: 'Worth every single rupee. Pure raw indigo that breaks in smoothly. Customer support also immediately confirmed order on email.',
    fitFeedback: 'True to Size',
    verifiedPurchase: true,
    createdAt: '2026-09-22T10:15:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    authorName: 'Rohan Mehta',
    rating: 5,
    comment: 'Exact 90s baggy fit I was hunting for! Fabric is heavy yet soft, sits so well over Jordans. Will order again in another wash.',
    fitFeedback: 'Runs Large',
    verifiedPurchase: true,
    createdAt: '2026-09-26T18:40:00Z'
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'SFH-88214',
    customerName: 'Karan Joshi',
    customerPhone: '+91 98251 44210',
    customerEmail: 'karan.joshi@example.com',
    shippingAddress: '402, Shivalik Highstreet, Near Judges Bunglow, Bodakdev',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380054',
    items: [
      {
        productId: 'prod-1',
        title: 'Midnight Raw Japanese Selvedge Jeans',
        size: '32',
        colorName: 'Raw Deep Indigo',
        colorHex: '#0f1f38',
        quantity: 1,
        price: 2499,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80'
      }
    ],
    subtotal: 2499,
    shippingFee: 0,
    totalAmount: 2499,
    paymentMethod: 'COD',
    status: 'Confirmed',
    unboxingPolicyAccepted: true,
    createdAt: '2026-09-28T09:12:00Z'
  }
];

function ensureDataFile(): StoreData {
  if (inMemoryStore) {
    return inMemoryStore;
  }

  const initialData: StoreData = {
    products: DEFAULT_PRODUCTS,
    orders: DEFAULT_ORDERS,
    reviews: DEFAULT_REVIEWS
  };

  const targetPath = getStoreFilePath();

  // 1. Try reading from target file
  try {
    if (fs.existsSync(targetPath)) {
      const raw = fs.readFileSync(targetPath, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemoryStore = {
        products: parsed.products || DEFAULT_PRODUCTS,
        orders: parsed.orders || DEFAULT_ORDERS,
        reviews: parsed.reviews || DEFAULT_REVIEWS
      };
      return inMemoryStore;
    }
  } catch (err) {
    console.warn('[db] Could not read target store file:', err);
  }

  // 2. Try seeding from local repository data file if reading target file failed
  if (targetPath !== LOCAL_DATA_FILE) {
    try {
      if (fs.existsSync(LOCAL_DATA_FILE)) {
        const raw = fs.readFileSync(LOCAL_DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        inMemoryStore = {
          products: parsed.products || DEFAULT_PRODUCTS,
          orders: parsed.orders || DEFAULT_ORDERS,
          reviews: parsed.reviews || DEFAULT_REVIEWS
        };
        writeData(inMemoryStore);
        return inMemoryStore;
      }
    } catch (err) {
      console.warn('[db] Could not read local seed file:', err);
    }
  }

  inMemoryStore = initialData;
  writeData(initialData);
  return inMemoryStore;
}

function writeData(data: StoreData) {
  inMemoryStore = data;
  const targetPath = getStoreFilePath();
  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Graceful fallback to memory - never crash the serverless function
    console.warn('[db] Write to disk skipped (using in-memory store):', err);
  }
}

export function getProducts(): Product[] {
  const data = ensureDataFile();
  return data.products;
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.id === id || p.slug === id);
}

export function saveProduct(product: Product): Product {
  const data = ensureDataFile();
  const index = data.products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    data.products[index] = product;
  } else {
    data.products.unshift(product);
  }
  writeData(data);
  return product;
}

export function deleteProduct(id: string): boolean {
  const data = ensureDataFile();
  const initialLength = data.products.length;
  data.products = data.products.filter(p => p.id !== id);
  if (data.products.length !== initialLength) {
    writeData(data);
    return true;
  }
  return false;
}

export function getOrders(): Order[] {
  const data = ensureDataFile();
  return data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
  const data = ensureDataFile();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber: `SFH-${randomSuffix}`,
    createdAt: new Date().toISOString()
  };

  data.orders.unshift(newOrder);

  // Update product stock counts
  orderData.items.forEach(item => {
    const prod = data.products.find(p => p.id === item.productId);
    if (prod && prod.stock >= item.quantity) {
      prod.stock -= item.quantity;
    }
  });

  writeData(data);
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order | null {
  const data = ensureDataFile();
  const order = data.orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    writeData(data);
    return order;
  }
  return null;
}

export function getReviews(productId?: string): Review[] {
  const data = ensureDataFile();
  if (productId) {
    return data.reviews.filter(r => r.productId === productId);
  }
  return data.reviews;
}

export function addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
  const data = ensureDataFile();
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  data.reviews.unshift(newReview);

  // recalculate product rating & count
  const prodReviews = data.reviews.filter(r => r.productId === reviewData.productId);
  const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
  const prod = data.products.find(p => p.id === reviewData.productId);
  if (prod) {
    prod.rating = Number(avg.toFixed(1));
    prod.reviewCount = prodReviews.length;
  }

  writeData(data);
  return newReview;
}
