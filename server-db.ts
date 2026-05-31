import fs from "fs";
import path from "path";
import { CATEGORIES, PRODUCTS, BLOGS, COUPONS } from "./src/db/mock-data";
import { Product, Category, BlogPost, Coupon, Order, User, Review } from "./src/types";

const DB_FILE = path.join(process.cwd(), "db.json");

interface DBState {
  products: Product[];
  categories: Category[];
  blogs: BlogPost[];
  coupons: Coupon[];
  orders: Order[];
  users: User[];
  contactQueries: {
    id: string;
    name: string;
    email: string;
    message: string;
    date: string;
    status: "new" | "replied";
  }[];
}

const DEFAULT_USERS: User[] = [
  {
    id: "user_customer",
    name: "Raman Mehra",
    email: "rmehra38@gmail.com",
    role: "admin", // Let's give them admin rights directly or make it togglable so they see everything!
    addresses: [
      {
        fullName: "Raman Mehra",
        street: "77, Luxury Green Farms, Sector 45",
        city: "Gurugram",
        state: "Haryana",
        pincode: "122003",
        phone: "+91 98123 45678",
        type: "Home"
      }
    ]
  },
  {
    id: "user_customer_2",
    name: "Ayush Patel",
    email: "ayush@example.com",
    role: "customer",
    addresses: []
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ORD-94812",
    userId: "user_customer",
    customerName: "Raman Mehra",
    customerEmail: "rmehra38@gmail.com",
    items: [
      {
        productId: "prod_1",
        name: "Premium Vedic A2 Gir Cow Ghee (Bilona)",
        price: 1650,
        quantity: 2,
        weight: "500ml",
        image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=600"
      },
      {
        productId: "prod_2",
        name: "Golden Nectar Wild Forest Honey",
        price: 720,
        quantity: 1,
        weight: "500g",
        image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=600"
      }
    ],
    subtotal: 4020,
    discount: 402,
    couponCode: "HARIANA10",
    shipping: 0,
    total: 3618,
    status: "processing",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    shippingAddress: {
      fullName: "Raman Mehra",
      street: "77, Luxury Green Farms, Sector 45",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122003",
      phone: "+91 98123 45678",
      type: "Home"
    },
    date: "2026-05-26T14:32:00Z",
    trackingCode: "TRAK-HRI-90412",
    notes: "Please pack properly to prevent ghee jar damage during transit."
  },
  {
    id: "ORD-83905",
    userId: "user_customer_2",
    customerName: "Ayush Patel",
    customerEmail: "ayush@example.com",
    items: [
      {
        productId: "prod_3",
        name: "Traditional Murrah Buffalo Ghee (Amrit)",
        price: 1250,
        quantity: 1,
        weight: "1 Litre",
        image: "https://images.unsplash.com/photo-1622484211140-7e1329d47917?auto=format&fit=crop&q=80&w=600"
      }
    ],
    subtotal: 1250,
    discount: 0,
    shipping: 100,
    total: 1350,
    status: "delivered",
    paymentMethod: "COD",
    paymentStatus: "paid",
    shippingAddress: {
      fullName: "Ayush Patel",
      street: "Block C-4, DLF Phase 1",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122002",
      phone: "+91 98989 12345",
      type: "Work"
    },
    date: "2026-05-24T10:15:00Z",
    trackingCode: "TRAK-HRI-11053"
  }
];

function readDB(): DBState {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const state: DBState = {
        products: PRODUCTS,
        categories: CATEGORIES,
        blogs: BLOGS,
        coupons: COUPONS,
        orders: DEFAULT_ORDERS,
        users: DEFAULT_USERS,
        contactQueries: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
      return state;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, returning defaults:", err);
    return {
      products: PRODUCTS,
      categories: CATEGORIES,
      blogs: BLOGS,
      coupons: COUPONS,
      orders: DEFAULT_ORDERS,
      users: DEFAULT_USERS,
      contactQueries: []
    };
  }
}

function writeDB(state: DBState): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database file:", err);
  }
}

export const db = {
  // Products CRUD
  getProducts: () => readDB().products,
  getProduct: (id: string) => readDB().products.find(p => p.id === id),
  saveProduct: (product: Product) => {
    const s = readDB();
    const idx = s.products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      s.products[idx] = product;
    } else {
      s.products.push(product);
    }
    writeDB(s);
    return product;
  },
  deleteProduct: (id: string) => {
    const s = readDB();
    s.products = s.products.filter(p => p.id !== id);
    writeDB(s);
  },

  // Categories CRUD
  getCategories: () => readDB().categories,
  saveCategory: (cat: Category) => {
    const s = readDB();
    const idx = s.categories.findIndex(c => c.id === cat.id);
    if (idx >= 0) {
      s.categories[idx] = cat;
    } else {
      s.categories.push(cat);
    }
    writeDB(s);
    return cat;
  },
  deleteCategory: (id: string) => {
    const s = readDB();
    s.categories = s.categories.filter(c => c.id !== id);
    writeDB(s);
  },

  // Blogs CRUD
  getBlogs: () => readDB().blogs,
  saveBlog: (blog: BlogPost) => {
    const s = readDB();
    const idx = s.blogs.findIndex(b => b.id === blog.id);
    if (idx >= 0) {
      s.blogs[idx] = blog;
    } else {
      s.blogs.push(blog);
    }
    writeDB(s);
    return blog;
  },
  deleteBlog: (id: string) => {
    const s = readDB();
    s.blogs = s.blogs.filter(b => b.id !== id);
    writeDB(s);
  },

  // Coupons CRUD
  getCoupons: () => readDB().coupons,
  saveCoupon: (coupon: Coupon) => {
    const s = readDB();
    const idx = s.coupons.findIndex(c => c.code === coupon.code);
    if (idx >= 0) {
      s.coupons[idx] = coupon;
    } else {
      s.coupons.push(coupon);
    }
    writeDB(s);
    return coupon;
  },
  deleteCoupon: (code: string) => {
    const s = readDB();
    s.coupons = s.coupons.filter(c => c.code !== code);
    writeDB(s);
  },

  // Orders CRUD
  getOrders: () => readDB().orders,
  getOrder: (id: string) => readDB().orders.find(o => o.id === id),
  saveOrder: (order: Order) => {
    const s = readDB();
    const idx = s.orders.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      s.orders[idx] = order;
    } else {
      s.orders.push(order);
    }
    writeDB(s);
    return order;
  },

  // Users CRUD / Auth Mocking
  getUsers: () => readDB().users,
  getUserByEmail: (email: string) => readDB().users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  saveUser: (user: User) => {
    const s = readDB();
    const idx = s.users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      s.users[idx] = user;
    } else {
      s.users.push(user);
    }
    writeDB(s);
    return user;
  },

  // Contact Queries
  getContactQueries: () => readDB().contactQueries,
  addContactQuery: (q: { name: string; email: string; message: string }) => {
    const s = readDB();
    const newQuery = {
      id: "q_" + Date.now(),
      ...q,
      date: new Date().toISOString(),
      status: "new" as const
    };
    s.contactQueries.push(newQuery);
    writeDB(s);
    return newQuery;
  },
  updateQueryStatus: (id: string, status: "new" | "replied") => {
    const s = readDB();
    const q = s.contactQueries.find(item => item.id === id);
    if (q) {
      q.status = status;
      writeDB(s);
    }
  },

  // Reviews integration directly on product
  addProductReview: (productId: string, review: { userName: string; rating: number; comment: string }) => {
    const s = readDB();
    const pIdx = s.products.findIndex(p => p.id === productId);
    if (pIdx >= 0) {
      const parentProd = s.products[pIdx];
      const newReview: Review = {
        id: "rev_" + Date.now(),
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        date: new Date().toISOString().split("T")[0],
        verifiedPurchase: true
      };
      
      const prevReviews = parentProd.reviews || [];
      const updatedReviews = [newReview, ...prevReviews];
      
      // Re-calculate rating
      const totalRating = updatedReviews.reduce((sum, item) => sum + item.rating, 0);
      const avg = Number((totalRating / updatedReviews.length).toFixed(1));
      
      parentProd.reviews = updatedReviews;
      parentProd.reviewsCount = updatedReviews.length;
      parentProd.rating = avg;
      
      s.products[pIdx] = parentProd;
      writeDB(s);
      return newReview;
    }
    return null;
  }
};
