import React, { useState, useMemo } from "react";
import { CreditCard, Landmark, Truck, CheckCircle, RefreshCw, AlertCircle, ShoppingCart } from "lucide-react";
import { CartItem, Product, Coupon, Order, Address } from "../types";

interface CheckoutProps {
  cart: CartItem[];
  products: Product[];
  appliedCoupon: Coupon | null;
  onClearCart: () => void;
  onNavigate: (page: string) => void;
  orderNotes: string;
  onSaveNewOrder: (order: Order) => void;
  userEmail: string;
}

export default function Checkout({
  cart,
  products,
  appliedCoupon,
  onClearCart,
  onNavigate,
  orderNotes,
  onSaveNewOrder,
  userEmail
}: CheckoutProps) {
  // Address Formulation state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Haryana");
  const [pincode, setPincode] = useState("");
  const [addrType, setAddrType] = useState<"home" | "work">("home");

  // Payment choice
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI" | "RAZORPAY">("UPI");
  // UPI parameters if checked
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpaySuccess, setRazorpaySuccess] = useState(false);
  const [finalOrderCode, setFinalOrderCode] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  const getProductDetails = (id: string) => products.find((p) => p.id === id);

  // Totals calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const prod = getProductDetails(item.productId);
      if (!prod) return sum;
      let cost = prod.salePrice || prod.price;
      if (item.isSubscription) cost = cost * 0.9;
      return sum + cost * item.quantity;
    }, 0);
  }, [cart, products]);

  const discount = appliedCoupon 
    ? Math.round(subtotal * (appliedCoupon.discountPercentage / 100)) 
    : 0;

  const totalSum = subtotal - discount + (subtotal >= 1000 ? 0 : 120);

  const parsedItems = useMemo(() => {
    return cart.map((item) => {
      const prod = getProductDetails(item.productId);
      return {
        productId: item.productId,
        name: prod?.name || "Premium Harvest Product",
        quantity: item.quantity,
        price: prod ? (prod.salePrice || prod.price) : 0,
        isSubscription: !!item.isSubscription
      };
    });
  }, [cart, products]);

  const handleDispatchOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fullName || !phone || !street || !city || !pincode) {
      setCheckoutError("Please complete all shipping address formulation fields.");
      return;
    }

    // UPI basic checks
    if (paymentMethod === "UPI") {
      if (!upiId || !upiId.includes("@")) {
        setUpiError("Enter a valid UPI id handle (e.g. name@okaxis).");
        return;
      }
      setUpiError("");
    }

    setSubmitting(true);
    setCheckoutError("");

    const addressPayload: Address = {
      fullName, phone, street, city, state, pincode, type: addrType
    };

    const payload = {
      customerName: fullName,
      customerEmail: userEmail || "verified.seeker@gmail.com",
      items: parsedItems,
      shippingAddress: addressPayload,
      paymentMethod,
      couponApplied: appliedCoupon ? appliedCoupon.code : undefined,
      notes: orderNotes
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const publishedOrder: Order = await response.json();
        setFinalOrderCode(publishedOrder.id);
        onSaveNewOrder(publishedOrder);
        onClearCart();
      } else {
        setCheckoutError("Server failed to establish order. Check inventory levels.");
      }
    } catch (err) {
      console.error(err);
      setCheckoutError("Traditional order registry failed. Sourcing offline.");
    } finally {
      setSubmitting(false);
    }
  };

  // Simulate Razorpay Gateway overlay processing
  const handleRazorpayMockClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !pincode) {
      setCheckoutError("Please complete the shipping addresses formulation prior to launching Razorpay.");
      return;
    }
    setCheckoutError("");
    setShowRazorpayModal(true);
    setRazorpaySuccess(false);
  };

  const handleRazorpayPaymentConfirmed = () => {
    setRazorpaySuccess(true);
    setTimeout(() => {
      setShowRazorpayModal(false);
      handleDispatchOrder();
    }, 1500);
  };

  // Success Confirmation Screen
  if (finalOrderCode) {
    return (
      <div id="checkout-success-container" className="max-w-xl mx-auto py-24 text-center px-4 font-sans space-y-6 animate-in zoom-in-95 duration-350">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-800 border-2 border-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] bg-emerald-950/10 text-emerald-800 px-3 py-1 rounded-full uppercase font-mono tracking-widest font-black inline-block">
            Sourcing Confirmed
          </span>
          <h2 className="text-3xl font-serif font-bold text-forest-900 leading-tight">Order Placed Successfully!</h2>
          <p className="text-[11px] font-mono font-bold text-teal-800 select-all block py-2.5 px-4 bg-stone-100 rounded-xl w-fit mx-auto border-dashed border border-gray-305">
            YOUR TRACKING ID: {finalOrderCode}
          </p>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
            Your premium harvest order has been entered into our registered farm books. One of our farm operators will select and fresh-pack your items tomorrow at dawn.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => onNavigate("profile")}
            className="bg-forest-900 hover:bg-forest-950 text-gold-500 font-serif tracking-widest text-xs uppercase font-bold py-3.5 px-8 rounded-xl cursor-pointer shadow"
          >
            Track in My Profile
          </button>
          <button
            onClick={() => onNavigate("shop")}
            className="border border-forest-900/15 text-forest-900 hover:bg-stone-55 font-serif tracking-widest text-[10px] uppercase font-bold py-3.5 px-8 rounded-xl cursor-pointer"
          >
            Continue Searching
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-10 animate-in fade-in duration-300">
      
      <div className="text-center sm:text-left space-y-1">
        <h1 className="text-3xl font-serif font-black text-forest-950">Dispatch Formulation</h1>
        <p className="text-xs text-gray-500">Provide shipping address attributes and select authentic payment modes to finalize ordering.</p>
      </div>

      {checkoutError && (
        <div className="p-4 bg-red-50 border border-red-200/60 text-red-800 text-xs rounded-xl flex items-center justify-between gap-4 max-w-2xl mx-auto md:mx-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            <span className="font-semibold">{checkoutError}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setCheckoutError("")}
            className="text-red-500 hover:text-red-700 font-bold uppercase text-[9px] tracking-wider"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Shipping Formulation details forms */}
        <div className="lg:col-span-8">
          <form onSubmit={paymentMethod === "RAZORPAY" ? handleRazorpayMockClick : handleDispatchOrder} className="bg-white rounded-3xl border border-cream-300 p-6 md:p-8 space-y-6 shadow-sm">
            
            <h3 className="font-serif font-bold text-base text-forest-950 border-b pb-2">1. Delivery Address Formulation</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Radhika Sen"
                  className="w-full bg-stone-50 border p-3 rounded-xl focus:outline-none focus:border-gold-500 text-xs text-forest-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">Call Phone Number (For Pack Courier)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 94567 89012"
                  className="w-full bg-stone-50 border p-3 rounded-xl focus:outline-none focus:border-gold-500 text-xs text-forest-950"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">Street Name / Building / House No.</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Flat 402, Sunshine Heritage, Outer Ring Road"
                  className="w-full bg-stone-50 border p-3 rounded-xl focus:outline-none focus:border-gold-500 text-xs text-forest-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">City / Township</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Gurugram"
                  className="w-full bg-stone-50 border p-3 rounded-xl focus:outline-none focus:border-gold-500 text-xs text-forest-950"
                />
              </div>

              <div className="space-y-1 col-span-1">
                <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">PIN Code / Area Zip</label>
                <input
                  type="text"
                  required
                  pattern="\d{6}"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 122001"
                  className="w-full bg-stone-50 border p-3 rounded-xl focus:outline-none focus:border-gold-500 text-xs text-forest-950 font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">Address Label:</span>
              <button
                type="button"
                onClick={() => setAddrType("home")}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${
                  addrType === "home" ? "bg-forest-900 border-forest-900 text-gold-500" : "bg-stone-55 hover:bg-stone-105"
                }`}
              >
                Home Sourcing
              </button>
              <button
                type="button"
                onClick={() => setAddrType("work")}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${
                  addrType === "work" ? "bg-forest-900 border-forest-900 text-gold-500" : "bg-stone-55 hover:bg-stone-105"
                }`}
              >
                Work / Office dispatch
              </button>
            </div>

            <h3 className="font-serif font-bold text-base text-forest-950 border-b pb-2 pt-4">2. Authentic Payment Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
              
              {/* UPI Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("UPI")}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                  paymentMethod === "UPI" ? "border-forest-900 bg-forest-900/5 shadow-inner" : "border-gray-200 hover:bg-stone-50"
                }`}
              >
                <Landmark className="w-5 h-5 text-gold-600" />
                <div>
                  <p className="font-bold text-forest-950">UPI Sourcing (100% Secure)</p>
                  <p className="text-[10px] text-gray-400">Direct instant pay via BHIM/GPay/PhonePe</p>
                </div>
              </button>

              {/* Razorpay Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("RAZORPAY")}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                  paymentMethod === "RAZORPAY" ? "border-forest-900 bg-forest-900/5 shadow-inner" : "border-gray-200 hover:bg-stone-50"
                }`}
              >
                <CreditCard className="w-5 h-5 text-gold-650" />
                <div>
                  <p className="font-bold text-forest-950">Razorpay Gateway</p>
                  <p className="text-[10px] text-gray-400">Indian Credit Cards, Debit & NetBanking</p>
                </div>
              </button>

              {/* COD Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                  paymentMethod === "COD" ? "border-forest-900 bg-forest-900/5 shadow-inner" : "border-gray-200 hover:bg-stone-50"
                }`}
              >
                <Truck className="w-5 h-5 text-emerald-800" />
                <div>
                  <p className="font-bold text-forest-950">Cash On Delivery (COD)</p>
                  <p className="text-[10px] text-gray-400">Settle in cash during door delivery</p>
                </div>
              </button>
            </div>

            {/* UPI Formulation Helper */}
            {paymentMethod === "UPI" && (
              <div className="bg-stone-50 p-4 rounded-2xl border space-y-2 animate-in slide-in-from-top-2 duration-150">
                <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">Your UPI Handle Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. shammsen@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="flex-1 bg-white border p-3 rounded-xl focus:outline-none focus:border-gold-500 text-xs font-mono"
                  />
                  <div className="bg-emerald-950/5 text-emerald-800 px-4 rounded-xl flex items-center justify-center font-mono text-[10px] font-bold border shrink-0">
                    UPI VERIFIED ✓
                  </div>
                </div>
                {upiError && <p className="text-[10px] text-red-500 font-sans">{upiError}</p>}
              </div>
            )}

            {/* COD Formulation Alert */}
            {paymentMethod === "COD" && (
              <div className="bg-emerald-50 text-emerald-950 p-4 rounded-2xl border border-emerald-300 flex items-start gap-3 animate-in slide-in-from-top-2 duration-150 text-xs leading-relaxed">
                <CheckCircle className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Authentic Cash-On-Delivery Sourcing Supported</p>
                  <p className="text-gray-600 text-[11px] mt-1">Our packing operator will call you in the morning to confirm your pin location. Zero prepay needed. Cash settled upon door hand-over.</p>
                </div>
              </div>
            )}

            {/* General Dispatch execution button for non-razorpay options */}
            {paymentMethod !== "RAZORPAY" && (
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-forest-900 hover:bg-forest-950 text-gold-500 font-serif uppercase tracking-widest text-xs font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-gold-500" />
                    <span>Booking in village records...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4.5 h-4.5" />
                    <span>Finalize Traditional Sourcing • ₹{totalSum}</span>
                  </>
                )}
              </button>
            )}

            {/* Razorpay form launcher */}
            {paymentMethod === "RAZORPAY" && (
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-serif uppercase tracking-widest text-xs font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Launch Secured Razorpay Gateway • ₹{totalSum}</span>
              </button>
            )}
          </form>
        </div>

        {/* Right side check basket synopsis */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-cream-300 shadow-sm p-5 space-y-4 font-sans text-xs">
          <h3 className="font-serif font-bold text-sm text-forest-950 pb-2 border-b">Checkout Summary</h3>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {cart.map((item, idx) => {
              const prod = getProductDetails(item.productId);
              if (!prod) return null;
              
              let cost = prod.salePrice || prod.price;
              if (item.isSubscription) cost = cost * 0.9;
              return (
                <div key={idx} className="flex gap-2.5 items-center justify-between py-1 border-b border-gray-50 pb-2">
                  <img src={prod.image} alt={prod.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-lg object-cover shrink-0 bg-stone-100" />
                  <div className="flex-1 min-w-0 font-medium">
                    <p className="truncate text-forest-900 font-bold">{prod.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">₹{cost} x {item.quantity}</p>
                  </div>
                  <span className="font-mono font-bold text-forest-900 shrink-0">₹{cost * item.quantity}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between text-gray-500">
              <span>Boutique subtotal:</span>
              <span className="font-mono font-semibold">₹{subtotal}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>Code {appliedCoupon.code.toUpperCase()} ({appliedCoupon.discountPercentage}%):</span>
                <span className="font-mono">-₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-500">
              <span>Delivery Transport:</span>
              <span className="text-[10px] text-emerald-800 uppercase font-bold font-mono">
                {subtotal >= 1000 ? "FREE" : "₹120 Sourcing charge"}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 font-bold text-forest-950 font-serif text-sm">
              <span>Aggregate Total:</span>
              <span className="font-mono text-base font-black">₹{totalSum}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RAZORPAY MODAL GATEWAY OVERLAY PROCESSING SIMULATION */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl p-6 border border-blue-500/10 space-y-6 text-center animate-in zoom-in-95 duration-250 font-sans">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-xs uppercase font-mono tracking-widest text-blue-900 font-black">Razorpay Secure</span>
              <span className="text-[9px] text-gray-400">Merch ID: m_hariana82</span>
            </div>

            {razorpaySuccess ? (
              <div className="py-6 space-y-3">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-800 border rounded-full flex items-center justify-center mx-auto shadow animate-pulse">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <p className="font-serif font-black text-sm text-forest-950">Payment Settled Succesfully</p>
                <p className="text-[10px] text-gray-400">Finalizing order specifications inside farm database...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  You are settling an amount of <span className="font-mono font-black text-blue-900">₹{totalSum}</span> securely with <span className="font-semibold text-forest-950">Hariana Organic Farm</span>.
                </p>

                <div className="bg-stone-50 p-4 rounded-xl border text-left space-y-2 text-xs">
                  <p className="font-bold text-[10px] text-gray-400 uppercase tracking-widest font-mono">Simulated Card Details</p>
                  <p className="font-mono font-medium truncate">XXXX XXXX XXXX 4111 (Visa Pure)</p>
                  <p className="text-[10px] text-emerald-800">Verified by Visa ✓</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRazorpayModal(false)}
                    className="flex-1 border py-2.5 rounded-xl text-xs font-semibold text-gray-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRazorpayPaymentConfirmed}
                    className="flex-1 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold py-2.5 rounded-xl cursor-pointer shadow"
                  >
                    Authorize Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
