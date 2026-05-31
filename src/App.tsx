import { useState, useEffect } from "react";
import { 
  Heart, Trash2, ArrowLeft, MoveRight, ShoppingBag, Landmark, Key, 
  HelpCircle, Sparkles, RefreshCw, Star, Info, ShieldAlert
} from "lucide-react";
import { Product, Category, BlogPost, CartItem, Coupon } from "./types";

// Page modules
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";

// Auxiliary components
import Header from "./components/Header";
import AnnouncementBar from "./components/AnnouncementBar";
import WhatsAppButton from "./components/WhatsAppButton";
import NewsletterPopup from "./components/NewsletterPopup";
import ExitIntentPopup from "./components/ExitIntentPopup";
import ProductQuickView from "./components/ProductQuickView";
import AiAdvisor from "./components/AiAdvisor";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  // DB Lists state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Navigation / Auth States
  const [activePage, setActivePage] = useState<string>("home");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("ayurvedic.seeker@gmail.com");

  // Cart / Wishlist States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orderNotes, setOrderNotes] = useState<string>("");

  // Overlays / Modals States
  const [showAdvisor, setShowAdvisor] = useState<boolean>(false);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters connected with Header Search
  const [searchText, setSearchText] = useState<string>("");

  // Fetch core lists from full-stack Express API on mount
  const refreshProductsAndDetails = async () => {
    try {
      const [resProducts, resCategories, resBlogs, resOrders] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/blogs"),
        fetch("/api/orders")
      ]);

      if (resProducts.ok) setProducts(await resProducts.ok ? await resProducts.json() : []);
      if (resCategories.ok) setCategories(await resCategories.json());
      if (resBlogs.ok) setBlogs(await resBlogs.json());
      if (resOrders.ok) setOrders(await resOrders.json());
    } catch (err) {
      console.error("Could not fetch data lists.", err);
    }
  };

  useEffect(() => {
    refreshProductsAndDetails();
  }, []);

  // Sync orders whenever profile page is navigated
  useEffect(() => {
    if (activePage === "profile") {
      fetch("/api/orders")
        .then((res) => { if (res.ok) return res.json(); })
        .then((data) => { if (data) setOrders(data); })
        .catch((e) => console.error(e));
    }
  }, [activePage]);

  // Action methods: Cart operations
  const handleAddToCart = (productId: string, quantity: number = 1, isSubscription: boolean = false) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId && item.isSubscription === isSubscription);
      if (existing) {
        return prev.map((item) => 
          item.productId === productId && item.isSubscription === isSubscription
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity, isSubscription }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) => prev.map((item) => item.productId === productId ? { ...item, quantity } : item));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Toggle wishlist
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => 
      prev.includes(productId) 
        ? prev.filter((id) => id !== productId) 
        : [...prev, productId]
    );
  };

  // Switch pages
  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSearchText(""); // reset matching search when jumping sections
  };

  // Toggle active accounts simulation roles easily
  const handleToggleAdminRole = () => {
    const nextRole = !isAdmin;
    setIsAdmin(nextRole);
    if (nextRole) {
      setUserEmail("admin@harianaorganic.com");
    } else {
      setUserEmail("ayurvedic.seeker@gmail.com");
    }
  };

  // Handle Order Saved response
  const handleSaveOrderDone = (o: any) => {
    setOrders((prev) => [o, ...prev]);
    setActivePage("profile");
  };

  return (
    <div className="min-h-screen bg-cream-100/35 text-forest-950 flex flex-col selection:bg-gold-500 selection:text-forest-950">
      
      {/* 1. MARKETING AND ACCENT OVERLAYS */}
      <AnnouncementBar />
      <WhatsAppButton />
      <NewsletterPopup />
      <ExitIntentPopup />

      {/* 2. MAIN HEADER HUD */}
      <Header
        cart={cart}
        wishlist={wishlist}
        products={products}
        onSearch={setSearchText}
        searchText={searchText}
        onOpenAdvisor={() => setShowAdvisor(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        onNavigate={handleNavigate}
        activePage={activePage}
        isAdmin={isAdmin}
        onToggleAdminRole={handleToggleAdminRole}
        userEmail={userEmail}
      />

      {/* 3. DYNAMIC SCREEN ROUTING BLOCKS */}
      <main className="flex-1">
        {activePage === "home" && (
          <Home
            products={products}
            categories={categories}
            blogs={blogs}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onQuickView={setQuickViewProduct}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        )}

        {activePage === "shop" && (
          <Shop
            products={products}
            categories={categories}
            onAddToCart={handleAddToCart}
            onQuickView={setQuickViewProduct}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
            searchFilter={searchText}
            onSearch={setSearchText}
          />
        )}

        {activePage === "blog" && (
          <Blog blogs={blogs} />
        )}

        {activePage === "about" && (
          <About />
        )}

        {activePage === "contact" && (
          <Contact />
        )}

        {activePage === "cart" && (
          <Cart
            cart={cart}
            products={products}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onNavigate={handleNavigate}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
            orderNotes={orderNotes}
            onUpdateNotes={setOrderNotes}
          />
        )}

        {activePage === "checkout" && (
          <Checkout
            cart={cart}
            products={products}
            appliedCoupon={appliedCoupon}
            onClearCart={handleClearCart}
            onNavigate={handleNavigate}
            orderNotes={orderNotes}
            onSaveNewOrder={handleSaveOrderDone}
            userEmail={userEmail}
          />
        )}

        {activePage === "wishlist" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
            <h1 className="text-3xl font-serif font-bold text-forest-900 border-b pb-2">My Wholesome Wishlist</h1>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products
                  .filter((p) => wishlist.includes(p.id))
                  .map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl border p-4 space-y-3 relative shadow-sm hover:shadow-md">
                      <img src={p.image} referrerPolicy="no-referrer" alt={p.name} className="w-full aspect-square object-cover rounded-xl bg-stone-100" />
                      <h4 className="font-serif font-black text-xs text-forest-950 truncate cursor-pointer" onClick={() => setQuickViewProduct(p)}>{p.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono">₹{p.salePrice || p.price}</p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(p.id)}
                          className="flex-1 bg-forest-900 text-gold-500 font-serif uppercase tracking-wider text-[10px] py-2 rounded-xl text-center"
                        >
                          Add to Box
                        </button>
                        <button
                          onClick={() => handleToggleWishlist(p.id)}
                          className="px-2.5 hover:bg-red-50 text-red-500 border rounded-xl"
                          title="Exclude item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 italic text-xs leading-relaxed space-y-4">
                <Heart className="w-12 h-12 text-gray-300 mx-auto animate-pulse" />
                <div>
                  <p className="font-serif font-bold text-sm text-forest-900">Your Wishlist has no remedies queued</p>
                  <p className="text-[11px] text-gray-400 max-w-xs mx-auto">Explore the traditional products catalog and tap the heart icon to save items here.</p>
                </div>
                <button onClick={() => handleNavigate("shop")} className="bg-forest-900 text-gold-500 font-serif uppercase text-[10px] tracking-widest font-bold py-3 px-8 rounded-xl">
                  Inspect Shop Catalogue
                </button>
              </div>
            )}
          </div>
        )}

        {activePage === "profile" && (
          <Profile
            orders={orders}
            products={products}
            userEmail={userEmail}
            onChangeEmail={setUserEmail}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* 4. MODALS & OVERLAYS RENDERS */}
      
      {/* Quick View Item specs modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={(prodId, quantity, sub) => {
            handleAddToCart(prodId, quantity, sub);
            setQuickViewProduct(null);
          }}
          isWishlisted={wishlist.includes(quickViewProduct.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Acharya Vedic Chat Advisor Drawer */}
      {showAdvisor && (
        <AiAdvisor
          onClose={() => setShowAdvisor(false)}
          products={products}
          onAddToCart={(prodId) => {
            handleAddToCart(prodId, 1);
            setShowAdvisor(false);
          }}
          onQuickView={(prod) => {
            setQuickViewProduct(prod);
            setShowAdvisor(false);
          }}
        />
      )}

      {/* Modern SaaS Admin Panel modal overlay */}
      {showAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-100">
          <AdminPanel
            onClose={() => {
              setShowAdmin(false);
              refreshProductsAndDetails(); // Refresh product catalogue list in case updates were edited!
            }}
            products={products}
            onRefreshProducts={refreshProductsAndDetails}
          />
        </div>
      )}

    </div>
  );
}
