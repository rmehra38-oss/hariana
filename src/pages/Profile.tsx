import React, { useState, useMemo } from "react";
import { User, Shield, HelpCircle, Star, PackageOpen, LayoutGrid, CheckCircle, RefreshCw, ChevronRight, X } from "lucide-react";
import { Order, Product } from "../types";

interface ProfileProps {
  orders: Order[];
  products: Product[];
  userEmail: string;
  onChangeEmail: (value: string) => void;
  onNavigate: (page: string) => void;
}

export default function Profile({
  orders,
  products,
  userEmail,
  onChangeEmail,
  onNavigate
}: ProfileProps) {
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [emailInput, setEmailInput] = useState(userEmail);
  const [contextSwapped, setContextSwapped] = useState(false);

  const getProductDetails = (id: string) => products.find((p) => p.id === id);

  // Filter ordered items specifically for active customer email address
  const customerOrders = useMemo(() => {
    return orders.filter((o) => o.customerEmail.toLowerCase() === userEmail.toLowerCase());
  }, [orders, userEmail]);

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) return;
    onChangeEmail(emailInput);
    setContextSwapped(true);
    setTimeout(() => setContextSwapped(false), 3000);
  };

  // Derive tracking stepper milestones
  const getStepperIndex = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return 0;
      case "processing": return 1;
      case "shipped": return 3;
      case "delivered": return 4;
      default: return 0;
    }
  };

  const steps = [
    { title: "Ordered", desc: "Auspicious morning queue" },
    { title: "Curd Churning", desc: "慢 bi-churning on slow firewood" },
    { title: "Pure Packing", desc: "Secured high-grade dark amber glass" },
    { title: "Soil Dispatch", desc: "Custom courier loaded" },
    { title: "Delivered", desc: "Organic bliss arrived" }
  ];

  return (
    <div id="profile-area-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-10 animate-in fade-in duration-300">
      
      {/* Intro visual header details */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 rounded-full bg-forest-900 border-2 border-gold-500/20 text-gold-500 flex items-center justify-center shadow-md">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-black text-forest-950">My Sourcing Registry</h1>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{userEmail}</p>
          </div>
        </div>

        {/* Swap user simulation */}
        <div className="flex flex-col gap-1.5 items-end">
          <form onSubmit={handleUpdateEmail} className="flex gap-2 items-center text-xs">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="bg-stone-50 border p-2.5 rounded-xl font-mono text-xs w-60 focus:outline-none"
              placeholder="swap.customer@gmail.com"
            />
            <button type="submit" className="bg-forest-900 hover:bg-forest-950 text-gold-500 font-serif text-[10px] uppercase font-bold px-4 py-2.5 rounded-xl cursor-pointer">
              Swap Buyer Context
            </button>
          </form>
          {contextSwapped && (
            <span className="text-[10px] font-mono font-bold text-emerald-800 animate-pulse">
              ✓ Buyer context aligned instantly!
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column past orders listing */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-cream-300 shadow-sm p-6 space-y-6">
          <h2 className="font-serif font-bold text-base text-forest-950 border-b pb-2">Completed Sourcing Chronicles</h2>

          {customerOrders.length > 0 ? (
            <div className="space-y-4">
              {customerOrders.map((o) => (
                <div key={o.id} className="bg-stone-50 p-4.5 rounded-2xl border border-dashed border-gray-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-forest-900 text-[12.5px] select-all">
                        {o.id}
                      </span>
                      <span className="font-mono text-xs text-gray-400">
                        {new Date(o.date).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="font-semibold text-gray-650 max-w-sm">
                      {o.items.map((it) => `${it.name} (x${it.quantity})`).join(", ")}
                    </p>

                    <div className="flex gap-3 text-[10.5px] font-mono uppercase tracking-wider text-gray-400">
                      <span>Total valuation: ₹{o.total}</span>
                      <span>•</span>
                      <span>Payment: {o.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setActiveTrackingOrder(o)}
                      className="bg-forest-900 hover:bg-forest-950 text-gold-500 text-[10px] uppercase tracking-wider font-mono px-4 py-2 rounded-xl font-bold cursor-pointer"
                    >
                      Track Shipment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <PackageOpen className="w-12 h-12 text-gray-350 mx-auto animate-pulse" />
              <div className="space-y-1">
                <p className="text-xs font-serif font-bold text-forest-900">No ancestral orders discovered</p>
                <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Our farm dispatch register does not possess records logged under this email address. Try swapping buyer context above to view mock ORD codes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right column: general account/Vaidya helpful resources */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-forest-900 text-cream-100 rounded-3xl p-6 border border-gold-500/20 space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500')] bg-cover"></div>
            
            <h3 className="font-serif font-black text-sm text-white relative z-10">Direct Sourcing Guarantee</h3>
            <p className="text-xs text-cream-300 leading-relaxed relative z-10">
              Hariana products are packed inside special custom heavy leadless glass to preserve organic energies against environmental humidity and rapid temperature fluctuations.
            </p>
            <div className="p-3 bg-forest-950/45 rounded-xl border border-white/5 relative z-10 font-mono text-[10px] space-y-1">
              <p className="text-gold-500 font-bold block">LOGISTICS SUPPORT</p>
              <p className="text-cream-300">Mon-Sat (7:00 AM - 6:00 PM)</p>
              <p className="text-cream-300">Email: help@harianaorganic.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* TRACKING STEPPER DRAW MODEL POPUP */}
      {activeTrackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm">
          <div className="bg-cream-100 text-forest-950 rounded-2xl overflow-hidden max-w-2xl w-full p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-230">
            <button
              onClick={() => setActiveTrackingOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-forest-900/5 text-forest-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] bg-gold-500 text-forest-950 font-bold font-mono py-0.5 px-2.5 rounded-full uppercase">
                  ORDER STATUS: {activeTrackingOrder.status.toUpperCase()}
                </span>
                <h3 className="font-serif font-bold text-lg text-forest-900 pt-1">
                  Active Sourcing Pipeline
                </h3>
                <p className="text-[11px] text-gray-500 font-mono">CODE: {activeTrackingOrder.id}</p>
              </div>

              {/* CANCELLED CASE SPECIFIC WARNING */}
              {activeTrackingOrder.status === "cancelled" ? (
                <div className="p-4 bg-red-100 text-red-800 rounded-xl border border-red-200 text-xs font-sans">
                  🚨 This traditional sourcing shipment has been cancelled by the packing operator or customer request. No transaction dispatch charges apply. Refund settled.
                </div>
              ) : (
                /* Stepper track visual stepper index line */
                <div className="space-y-6 pt-4">
                  {steps.map((st, i) => {
                    const activeIndex = getStepperIndex(activeTrackingOrder.status);
                    const isDone = i <= activeIndex;
                    const isCurrent = i === activeIndex;

                    return (
                      <div key={i} className="flex gap-4 items-start relative select-none">
                        
                        {/* Connecting Line */}
                        {i < steps.length - 1 && (
                          <div className={`absolute top-6 left-3 w-0.5 h-10 ${
                            i < activeIndex ? "bg-emerald-800" : "bg-gray-250"
                          }`} />
                        )}

                        {/* circle indicator */}
                        <div className={`w-6.5 h-6.5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-mono font-bold ${
                          isDone 
                            ? "bg-emerald-800 border-emerald-800 text-white shadow" 
                            : "bg-white border-gray-300 text-gray-400"
                        }`}>
                          {isDone ? "✓" : i + 1}
                        </div>

                        {/* description details */}
                        <div className="font-sans">
                          <p className={`text-xs font-bold leading-none ${
                            isCurrent ? "text-forest-900 font-black" : isDone ? "text-gray-650" : "text-gray-400"
                          }`}>
                            {st.title}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1 leading-normal font-light">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-6 border-t flex justify-end gap-2">
                <button
                  onClick={() => setActiveTrackingOrder(null)}
                  className="bg-forest-900 text-gold-500 font-serif uppercase tracking-widest text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer"
                >
                  Dismiss Track
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
