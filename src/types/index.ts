export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: 'Slim Fit' | 'Relaxed Fit' | 'Baggy / Wide Leg' | 'Straight Cut' | 'Cargo Denim';
  price: number;
  originalPrice: number;
  discountPercentage: number;
  sizes: string[]; // e.g. ["28", "30", "32", "34", "36", "38"]
  colors: ProductColor[];
  images: string[];
  stock: number;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  rating: number;
  reviewCount: number;
  fabricDetails: string[];
  washCare: string[];
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  fitFeedback: 'Runs Small' | 'True to Size' | 'Runs Large';
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  size: string;
  color: ProductColor;
  image: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'UPI / Online';
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  unboxingPolicyAccepted: boolean;
  createdAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  authProvider: 'phone_otp' | 'google' | 'apple';
  role: 'customer' | 'admin';
}
