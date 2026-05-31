import React, { useState } from "react";
import { Trash2, ShieldCheck, Ticket, Sparkles, RefreshCcw, Landmark, MoveRight, ShoppingBag } from "lucide-react";
import { CartItem, Product, Coupon } from "../types";

interface CartProps {
  cart: CartItem[];
  products: Product[];
  onUpdateQuantity: (prodId: string, qty: number) => void;
  onRemoveItem: (prodId: string) => void;
  onClearCart: () => void;
  onNavigate: (page: string) => void;
  // Coupon applied states
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  orderNotes: string;
  onUpdateNotes: (value: string) => void;
}

export default function Cart({
  cart,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
  appliedCoupon,
  onApplyCoupon,
  orderNotes,
  onUpdateNotes
}: CartProps) {
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [applying, setApplying] = useState(false);

  const getProductDetails = (id: string) => products.find((p) => p.id === id);

  // Cart Metrics Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const prod = getProductDetails(item.productId);
    if (!prod) return sum;
    // Apply subscription savings (10% off) directly if item.isSubscription is flagged!
    let activePrice = prod.salePrice || prod.price;
    if (item.isSubscription) activePrice = activePrice * 0.9;
    return sum + activePrice * item.quantity;
  }, 0);

  const totalCouponDiscount = appliedCoupon 
    ? Math.round(cartSubtotal * (appliedCoupon.discountPercentage / 100)) 
    : 0;

  const totalSum = cartSubtotal - totalCouponDiscount;

  // Real-time server coupon validation
  const handleApplyCouponClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;

    setApplying(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const response = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, orderAmount: cartSubtotal })
      });

      if (response.ok) {
        const validatedCoupon: Coupon = await response.json();
        onApplyCoupon(validatedCoupon);
        setCouponSuccess(`✨ Code ${validatedCoupon.code.toUpperCase()} applied! Save ${validatedCoupon.discountPercentage}% discount.`);
        setCouponInput("");
      } else {
        const errData = await response.json();
        setCouponError(errData.error || "Invalid promo code structure.");
      }
    } catch (err) {
      setCouponError("Service offline. Coupon checking bypassed.");
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponSuccess("");
    setCouponError("");
  };

  if (cart.length === 0) {
    return (
      <div id="empty-cart-root" className="max-w-xl mx-auto py-24 text-center px-4 font-sans space-y-6">
        <div className="w-20 h-20 bg-forest-900/5 text-forest-905 border border-forest-900/10 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-9 h-9" />
        </div>
        <div className="space-y-1.5Packed pb-4">
          <h2 className="text-2xl font-serif font-bold text-forest-900">Your Traditional Basket is Empty</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            There are no organic ghee jars or wildflower honey reserves in your active checkout. Take some moments to explore our boutique harvests.
          </p>
        </div>
        <button
          onClick={() => onNavigate("shop")}
          className="bg-forest-900 hover:bg-forest-950 text-gold-500 font-serif tracking-widest text-xs uppercase font-bold py-4 px-10 rounded-xl cursor-pointer"
        >
          Discover Pure Harvests
        </button>
      </div>
    );
  }

  return (
    <div id="cartv-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-10 animate-in fade-in duration-300">
      
      <div className="text-center sm:text-left space-y-1">
        <h1 className="text-3xl font-serif font-black text-forest-950">Your Ayurvedic Basket</h1>
        <p className="text-xs text-gray-500">Inspect weights, quantifiers, and activate wholesome coupon strategies prior to dispatch.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Items stream list */}
        <section className="lg:col-span-8 bg-white rounded-3xl border border-cream-300 shadow-sm p-4 md:p-6 space-y-6">
          <div className="divide-y divide-gray-100 pr-1">
            {cart.map((item, idx) => {
              const product = getProductDetails(item.productId);
              if (!product) return null;
              
              let baseItemPrice = product.salePrice || product.price;
              if (item.isSubscription) baseItemPrice = baseItemPrice * 0.9; // direct 10% sub coupon savings

              return (
                <div key={idx} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Title & Graphic selection */}
                  <div className="flex gap-4 items-center min-w-0 flex-1">
                    <img src={product.image} referrerPolicy="no-referrer" alt={product.name} className="w-16 h-16 rounded-xl object-cover bg-stone-100 border shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-sm text-forest-950 truncate">{product.name}</h3>
                      <p className="text-[10px] text-teal-800 font-mono tracking-wide mt-0.5">Net weight: {product.weight}</p>
                      
                      {item.isSubscription && (
                        <span className="text-[9px] uppercase font-mono bg-emerald-950/10 text-emerald-800 px-2.2 py-0.5 rounded-full font-bold mt-1 inline-block">
                          Recurring Sub Delivery (10% Saved)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity manager */}
                  <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center border border-gray-200 rounded-xl h-10 bg-white font-mono text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="px-3 hover:bg-stone-50 h-full rounded-l-xl text-stone-600 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-forest-900">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        className="px-3 hover:bg-stone-50 h-full rounded-r-xl text-stone-600 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Cost aggregate */}
                    <div className="text-right min-w-[70px] font-sans">
                      <p className="text-xs font-mono font-bold text-forest-900">₹{baseItemPrice * item.quantity}</p>
                      {item.quantity > 1 && <p className="text-[10px] text-gray-400 font-mono">₹{baseItemPrice} each</p>}
                    </div>

                    {/* Exclude item */}
                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="p-2 text-gray-400 hover:text-red-500 duration-150"
                      title="Exclude Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => onNavigate("shop")}
              className="text-xs font-serif uppercase tracking-widest text-forest-900 font-bold hover:text-forest-750"
            >
              ← Add physical items
            </button>
            <button
              onClick={onClearCart}
              className="text-xs uppercase font-mono tracking-wider font-bold text-gray-400 hover:text-red-500 duration-150"
            >
              Clear Basket
            </button>
          </div>

          {/* Checkout feedback / order notes */}
          <div className="space-y-1.5 font-sans">
            <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">Order Dispatch Instruction Notes (Optional)</label>
            <textarea
              rows={2}
              value={orderNotes}
              onChange={(e) => onUpdateNotes(e.target.value)}
              placeholder="e.g. Leave glass jars with neighbor, call before arriving..."
              className="w-full bg-stone-50 border p-3 rounded-xl focus:outline-none focus:border-gold-500 text-xs text-forest-950"
            ></textarea>
          </div>
        </section>

        {/* Right Side: Total metrics & checkout coupons */}
        <section className="lg:col-span-4 bg-white rounded-3xl border border-cream-300 shadow-sm p-6 space-y-6">
          <h3 className="font-serif font-bold text-base text-forest-950 pb-2 border-b">Order Summary</h3>

          <div className="space-y-3 text-xs leading-none">
            <div className="flex justify-between text-gray-500">
              <span>Boutique Subtotal:</span>
              <span className="font-mono font-semibold">₹{cartSubtotal}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-800">
                <span className="flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Promo {appliedCoupon.code.toUpperCase()} ({appliedCoupon.discountPercentage}%):</span>
                </span>
                <span className="font-mono font-bold">-₹{totalCouponDiscount}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-500">
              <span>Delivery Shipping:</span>
              <span className="font-mono text-emerald-700 font-bold uppercase tracking-wider text-[10px]">
                {cartSubtotal >= 1000 ? "FREE Sourcing" : "₹120 Sourcing charge"}
              </span>
            </div>

            <div className="border-t pt-3 mt-1 flex justify-between items-center font-bold text-base text-forest-950">
              <span>Aggregate Total:</span>
              <span className="font-mono text-lg">
                ₹{totalSum + (cartSubtotal >= 1000 ? 0 : 120)}
              </span>
            </div>
          </div>

          {/* Coupons input field */}
          <div className="pt-4 border-t space-y-2">
            <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">Apply Farm Coupon</label>
            
            {appliedCoupon ? (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-dashed border-emerald-300 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold">{appliedCoupon.code.toUpperCase()} activated</p>
                  <p className="text-[10px] text-emerald-700">{appliedCoupon.description}</p>
                </div>
                <button onClick={handleRemoveCoupon} className="text-red-500 font-mono font-bold hover:underline select-none">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCouponClick} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. BILONA20"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="bg-stone-50 border p-2.5 rounded-xl text-xs uppercase font-mono tracking-wide w-full"
                />
                <button
                  type="submit"
                  disabled={applying}
                  className="bg-forest-900 text-gold-500 text-[10px] font-sans font-bold uppercase px-4 rounded-xl shrink-0 cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && <p className="text-[10px] text-red-500">{couponError}</p>}
            {couponSuccess && <p className="text-[10px] text-emerald-800 font-medium">{couponSuccess}</p>}
            
            {/* Quick help hints for testing */}
            {!appliedCoupon && (
              <p className="text-[9px] text-gray-400 leading-relaxed font-sans">
                💡 Tip: Try typing <span className="font-mono font-bold bg-gray-100 text-gray-600 px-1 hover:bg-gray-200">BILONA20</span> (Save 20% on any basket!) or configure coupons in admin controls.
              </p>
            )}
          </div>

          {/* Checkout core redirect button */}
          <button
            onClick={() => onNavigate("checkout")}
            className="w-full bg-forest-900 hover:bg-forest-950 text-gold-500 font-serif uppercase tracking-widest text-xs font-bold py-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] duration-200 cursor-pointer"
          >
            <span>Proceed to Dispatch</span>
            <MoveRight className="w-4 h-4" />
          </button>

          {/* Trust assurances */}
          <div className="pt-2 flex gap-2 items-center justify-center text-[10px] text-gray-450 font-sans border-t">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
            <span>Guaranteed secure payment gates setup.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
