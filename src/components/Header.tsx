import { useState } from "react";
import { 
  ShoppingBag, Heart, Sprout, Search, ShieldAlert, User, Menu, X, ArrowLeftRight
} from "lucide-react";
import { CartItem, Product } from "../types";

interface HeaderProps {
  cart: CartItem[];
  wishlist: string[];
  products: Product[];
  onSearch: (text: string) => void;
  searchText: string;
  onOpenAdvisor: () => void;
  onOpenAdmin: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
  isAdmin: boolean;
  onToggleAdminRole: () => void;
  userEmail: string;
}

export default function Header({
  cart,
  wishlist,
  products,
  onSearch,
  searchText,
  onOpenAdvisor,
  onOpenAdmin,
  onNavigate,
  activePage,
  isAdmin,
  onToggleAdminRole,
  userEmail
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCartDrop, setShowCartDrop] = useState(false);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Derive cart valuation details
  const getProductDetails = (id: string) => products.find((p) => p.id === id);
  const cartSubtotalVal = cart.reduce((sum, item) => {
    const prod = getProductDetails(item.productId);
    if (!prod) return sum;
    return sum + (prod.salePrice || prod.price) * item.quantity;
  }, 0);

  return (
    <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-cream-300/30 transition-all font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Identity / Home Trigger */}
          <div 
            onClick={() => { onNavigate("home"); }} 
            className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-forest-900 border border-gold-500/25 flex items-center justify-center text-gold-500 group-hover:bg-forest-950 duration-300">
              <Sprout className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-emerald-950 uppercase tracking-widest font-mono">
                Hariana
              </span>
              <h1 className="text-base font-serif font-bold text-forest-900 tracking-tight leading-none">
                Organic Farm
              </h1>
            </div>
          </div>

          {/* Desktop Search Engine Bar */}
          <div className="hidden lg:flex items-center max-w-xs w-full relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-900/40" />
            <input
              type="text"
              placeholder="Search bilona ghee, honey..."
              value={searchText}
              onChange={(e) => {
                onSearch(e.target.value);
                if (activePage !== "shop") onNavigate("shop");
              }}
              className="w-full bg-cream-200/50 text-forest-950 text-xs pl-10 pr-4 py-3 rounded-xl border border-forest-100 focus:outline-none focus:bg-white focus:border-gold-500/50"
            />
          </div>

          {/* Navigation Links for Large Devices */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-forest-900/80 font-bold tracking-wider uppercase">
            {[
              { id: "home", label: "Home" },
              { id: "shop", label: "Shop Boutique" },
              { id: "blog", label: "Vedic Wisdom" },
              { id: "about", label: "Our Story" },
              { id: "contact", label: "Contact Us" }
            ].map((navLink) => (
              <button
                key={navLink.id}
                onClick={() => { onNavigate(navLink.id); }}
                className={`transition-all duration-200 border-b-2 pb-1 cursor-pointer ${
                  activePage === navLink.id 
                    ? "border-gold-500 text-forest-900 font-bold" 
                    : "border-transparent text-gray-500 hover:text-forest-900 hover:border-gold-500/30"
                }`}
              >
                {navLink.label}
              </button>
            ))}
          </nav>

          {/* User action cluster (Cart, Wishlist, Advisor, Admin controls) */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Quick switcher to test administration side */}
            <button
              onClick={onToggleAdminRole}
              className="hidden sm:flex items-center gap-1.5 text-[9px] uppercase font-mono tracking-wider font-bold bg-forest-950/5 hover:bg-forest-950/10 text-forest-900 px-3 py-2 rounded-xl duration-150 border border-forest-900/10"
              title="Toggle role to experience full CRM actions."
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-gold-600" />
              <span>Role: {isAdmin ? "Admin View" : "User View"}</span>
            </button>

            {/* Launch admin Control Desk if check isAdmin is true */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="bg-forest-900 text-gold-500 border border-gold-500/20 text-[10px] font-mono uppercase tracking-wider font-bold px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-forest-950 duration-150"
              >
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden md:inline">Control Desk</span>
              </button>
            )}

            {/* Smart virtual Ayurvedic Advisor button */}
            <button
              onClick={onOpenAdvisor}
              className="relative p-2.5 bg-gold-500/10 hover:bg-gold-500 hover:text-forest-950 text-gold-600 rounded-xl border border-gold-500/20 transition duration-150 group cursor-pointer flex items-center gap-1.5 text-xs font-serif font-black"
              title="Consult Acharya Shree"
            >
              <Sprout className="w-4 h-4 text-emerald-800 shrink-0" />
              <span className="hidden md:inline">Vaidya AI</span>
            </button>

            {/* Wishlist Heart representation */}
            <button
              onClick={() => onNavigate("wishlist")}
              className="relative p-2.5 hover:bg-forest-900/5 text-forest-900 rounded-xl transition duration-150 cursor-pointer"
              title="My Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart representation with details dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  onNavigate("cart");
                  setShowCartDrop(!showCartDrop);
                }}
                onMouseEnter={() => setShowCartDrop(true)}
                className="relative p-2.5 hover:bg-forest-900/5 text-forest-900 rounded-xl transition duration-150 cursor-pointer"
                title="View Basket"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-800 text-gold-300 font-mono text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none">
                    {cartTotalItems}
                  </span>
                )}
              </button>

              {/* Cart Quick dropdown preview */}
              {showCartDrop && cart.length > 0 && (
                <div 
                  onMouseLeave={() => setShowCartDrop(false)}
                  className="absolute right-0 mt-2 bg-cream-100 ring-1 ring-gold-500/15 p-5 rounded-2xl w-80 shadow-2xl z-50 border border-cream-300/50 animate-in fade-in duration-200"
                >
                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <span className="text-xs font-bold text-forest-900">Ayurvedic Basket Summary</span>
                    <span className="text-[10px] font-mono text-gray-400">({cartTotalItems} boxes)</span>
                  </div>

                  <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                    {cart.map((item, idx) => {
                      const prod = getProductDetails(item.productId);
                      if (!prod) return null;
                      return (
                        <div key={idx} className="flex gap-3 justify-between items-center">
                          <img src={prod.image} alt={prod.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover bg-stone-100" />
                          <div className="flex-1 min-w-0 pr-1">
                            <p className="text-xs font-bold truncate text-forest-900">{prod.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono">₹{prod.salePrice || prod.price} x {item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t pt-3 mt-4 space-y-3 text-xs flex flex-col">
                    <div className="flex justify-between items-center font-bold text-forest-950">
                      <span>Subtotal Valuation:</span>
                      <span className="font-mono">₹{cartSubtotalVal}</span>
                    </div>

                    <button
                      onClick={() => {
                        setShowCartDrop(false);
                        onNavigate("cart");
                      }}
                      className="bg-forest-900 hover:bg-forest-950 text-gold-500 font-serif tracking-widest text-[11px] uppercase font-bold text-center py-2.5 rounded-xl block cursor-pointer transition-all active:scale-[0.98]"
                    >
                      Inspect Shopping Cart
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile account representation */}
            <button
              onClick={() => onNavigate("profile")}
              className={`p-2.5 hover:bg-forest-900/5 rounded-xl transition duration-150 relative cursor-pointer ${
                activePage === "profile" ? "text-forest-950 font-bold bg-forest-950/5" : "text-forest-900"
              }`}
              title={`Logged in as ${userEmail}`}
            >
              <User className="w-4.5 h-4.5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-forest-900/5 text-forest-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-cream-100 border-b border-gray-200 py-4 px-6 shadow-xl space-y-4 z-50 animate-in slide-in-from-top-5 duration-200">
          {/* Mobile search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-forest-900/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => {
                onSearch(e.target.value);
                if (activePage !== "shop") onNavigate("shop");
              }}
              className="w-full bg-cream-200/50 text-forest-950 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-forest-100 focus:outline-none focus:bg-white"
            />
          </div>

          <nav className="flex flex-col gap-3 font-semibold text-xs text-forest-900 tracking-wide uppercase">
            {[
              { id: "home", label: "Home" },
              { id: "shop", label: "Shop Catalogue" },
              { id: "blog", label: "Organic Blog" },
              { id: "about", label: "About Farming" },
              { id: "contact", label: "Wellness Contact" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(item.id);
                }}
                className="text-left py-2 border-b border-forest-900/5 hover:text-gold-500 duration-150"
              >
                {item.label}
              </button>
            ))}
            
            {/* Role swap on mobile */}
            <button
              onClick={() => {
                onToggleAdminRole();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-forest-900/5 text-emerald-800 font-mono tracking-wider font-black flex items-center justify-between"
            >
              <span>Current Role Check:</span>
              <span className="bg-forest-900 text-gold-500 text-[9px] px-2 py-0.5 rounded uppercase font-bold">{isAdmin ? "Admin Desk Enabled" : "Customer Mode"}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
