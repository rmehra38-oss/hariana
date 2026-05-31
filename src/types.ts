/**
 * Types for Hariana Organic Farm Luxury E-Commerce Brand
 */

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string; // matches the category slug
  price: number;
  salePrice?: number;
  image: string;
  images: string[]; // multi-image support
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  stock: number;
  weight: string; // e.g. "500ml", "1kg", "250g"
  bilonaProcess: boolean;
  benefits: string[];
  ingredients: string;
  storage: string;
  featured: boolean;
  isBestseller: boolean;
  subscriptionAvailable?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minOrderAmount: number;
  description: string;
  active: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  category: string;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  type: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  addresses: Address[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  couponCode?: string;
  discount: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "UPI" | "Razorpay" | "COD";
  paymentStatus: "pending" | "paid" | "refunded";
  shippingAddress: Address;
  date: string;
  trackingCode?: string;
  notes?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string; // ID of product
  quantity: number;
  selectedWeight?: string;
  isSubscription?: boolean;
}
