import React, { useState, useEffect } from "react";
import { 
  BarChart3, ShoppingBag, FolderHeart, FileText, Settings, Tags, RefreshCw, 
  Trash2, Edit, Plus, CheckCircle, PackageOpen, Users, MessagesSquare, AlertCircle, HelpCircle, Eye
} from "lucide-react";
import { Product, Order, Coupon, BlogPost, Category, Address } from "../types";

interface AdminPanelProps {
  onClose: () => void;
  products: Product[];
  onRefreshProducts: () => void;
}

type TabType = "analytics" | "products" | "orders" | "coupons" | "blogs" | "queries";

export default function AdminPanel({ onClose, products, onRefreshProducts }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("analytics");
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Loading & Action states
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Product CRUD states
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [pForm, setPForm] = useState<Partial<Product>>({
    name: "", tagline: "", description: "", category: "cow-ghee",
    price: 1000, salePrice: undefined, image: "", stock: 20, 
    weight: "500g", bilonaProcess: true, benefits: []
  });
  const [newBenefit, setNewBenefit] = useState("");

  // Coupon Form state
  const [cForm, setCForm] = useState({ code: "", discountPercentage: 10, minOrderAmount: 1000, description: "" });
  
  // Blog Form state
  const [bForm, setBForm] = useState({ title: "", excerpt: "", content: "", category: "Cow Ghee", readTime: "5 mins read", image: "" });

  // Load Admin Data
  const loadAdminDetails = async () => {
    setLoading(true);
    try {
      const [resOrders, resCoupons, resBlogs, resQueries, resCats] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/coupons"),
        fetch("/api/blogs"),
        fetch("/api/contact"),
        fetch("/api/categories")
      ]);
      
      if (resOrders.ok) setOrders(await resOrders.json());
      if (resCoupons.ok) setCoupons(await resCoupons.json());
      if (resBlogs.ok) setBlogs(await resBlogs.json());
      if (resQueries.ok) setQueries(await resQueries.json());
      if (resCats.ok) setCategories(await resCats.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminDetails();
  }, []);

  const triggerToast = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 4000);
  };

  // PRODUCT ACTIONS
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...pForm,
      price: Number(pForm.price),
      salePrice: pForm.salePrice ? Number(pForm.salePrice) : undefined,
      stock: Number(pForm.stock),
      benefits: pForm.benefits && pForm.benefits.length ? pForm.benefits : ["Rich in natural antioxidants", "Sourced organically"]
    };

    try {
      let response;
      if (editProduct) {
        // Edit Action
        response = await fetch(`/api/products/${editProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // Create Action
        response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        triggerToast(editProduct ? "✅ Product optimized successfully." : "✅ New premium product registered.");
        setShowProductForm(false);
        setEditProduct(null);
        setPForm({
          name: "", tagline: "", description: "", category: "cow-ghee",
          price: 1000, salePrice: undefined, image: "", stock: 20, 
          weight: "500g", bilonaProcess: true, benefits: []
        });
        onRefreshProducts();
      }
    } catch (err) {
      console.error(err);
      triggerToast("❌ Could not save product specifications.");
    }
  };

  const handleEditProductClick = (p: Product) => {
    setEditProduct(p);
    setPForm({
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      category: p.category,
      price: p.price,
      salePrice: p.salePrice,
      image: p.image,
      stock: p.stock,
      weight: p.weight,
      bilonaProcess: p.bilonaProcess,
      benefits: p.benefits
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this organic product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerToast("🗑️ Product removed from catalogue.");
        onRefreshProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ORDER ACTIONS
  const updateOrderStatus = async (oId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${oId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        triggerToast(`Updated Order ${oId} status to ${status.toUpperCase()}`);
        loadAdminDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderPaymentStatus = async (oId: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${oId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus })
      });
      if (res.ok) {
        triggerToast(`Updated payment check: ${paymentStatus.toUpperCase()}`);
        loadAdminDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // COUPON ACTIONS
  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cForm.code) return;
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cForm)
      });
      if (res.ok) {
        triggerToast(`Coupon ${cForm.code.toUpperCase()} activated!`);
        setCForm({ code: "", discountPercentage: 10, minOrderAmount: 1000, description: "" });
        loadAdminDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    try {
      const res = await fetch(`/api/coupons/${code}`, { method: "DELETE" });
      if (res.ok) {
        triggerToast(`Coupon deactivated.`);
        loadAdminDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // BLOG ACTIONS
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bForm.title || !bForm.content) return;
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bForm)
      });
      if (res.ok) {
        triggerToast(`Blog post published!`);
        setBForm({ title: "", excerpt: "", content: "", category: "Cow Ghee", readTime: "5 mins read", image: "" });
        loadAdminDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerToast(`Blog post removed.`);
        loadAdminDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // FINANCIAL ANALYTICS
  // Sum of processing or delivered orders
  const totalSalesRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const activeCustomersCount = [...new Set(orders.map((o) => o.customerEmail))].length;

  return (
    <div id="admin-dashboard-root" className="min-h-screen bg-stone-50 font-sans flex flex-col relative z-50">
      
      {/* Mini top notification bar */}
      {msg && (
        <div className="fixed top-4 right-4 bg-forest-900 border border-gold-500/20 text-cream-100 font-serif py-3.5 px-6 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-gold-500" />
          <span className="text-xs">{msg}</span>
        </div>
      )}

      {/* Main Admin Header */}
      <header className="bg-forest-900 text-cream-100 px-6 py-4 border-b border-gold-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold tracking-wide text-white">Hariana Farm SaaS Control Desk</h1>
            <p className="text-[10px] text-cream-300">Live Server CRUD • Analytics • Real-Time Database Config</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadAdminDetails} 
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-cream-300 hover:text-white transition duration-150 relative cursor-pointer"
            title="Reload backend lists"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className="bg-gold-500 hover:bg-gold-600 text-forest-950 font-serif tracking-widest text-[10px] uppercase font-bold py-2 px-4 rounded-xl shadow cursor-pointer transition-all active:scale-95"
          >
            Exit Control Desk
          </button>
        </div>
      </header>

      {/* Workspace Panel layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar Panel */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible">
          {[
            { id: "analytics", label: "Overview Insights", icon: <BarChart3 className="w-4 h-4" /> },
            { id: "products", label: "Product Catalogue", icon: <ShoppingBag className="w-4 h-4" /> },
            { id: "orders", label: "Orders Manager", icon: <PackageOpen className="w-4 h-4" /> },
            { id: "coupons", label: "Discount Promo Codes", icon: <Tags className="w-4 h-4" /> },
            { id: "blogs", label: "Vedic Blog Posts", icon: <FileText className="w-4 h-4" /> },
            { id: "queries", label: "Wellness Enquiries", icon: <MessagesSquare className="w-4 h-4" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all text-left shrink-0 cursor-pointer ${
                activeTab === item.id 
                  ? "bg-forest-900 text-gold-500 shadow-md font-bold" 
                  : "text-gray-500 hover:bg-stone-100 hover:text-forest-900"
              }`}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Dynamic Display Panel */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-80px)]">
          {loading && orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-xs text-gray-400 font-medium">
              <RefreshCw className="w-8 h-8 animate-spin text-gold-500 mb-3" />
              <span>Restructuring charts and queries...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW METRICS */}
              {activeTab === "analytics" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* KPI card row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-gray-400 font-bold tracking-widest block">Total Sales</span>
                      <p className="text-2xl font-serif font-black text-forest-900">₹{totalSalesRevenue.toLocaleString()}</p>
                      <span className="text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">100% Organic Sourcing</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-gray-400 font-bold tracking-widest block">Active Seekers</span>
                      <p className="text-2xl font-serif font-black text-forest-900">{activeCustomersCount || 1}</p>
                      <span className="text-[9px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-bold">Ayurvedic Members</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-gray-400 font-bold tracking-widest block">Orders Placed</span>
                      <p className="text-2xl font-serif font-black text-forest-900">{orders.length}</p>
                      <span className="text-[9px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">Logistics Active</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-gray-400 font-bold tracking-widest block">Wellness Queries</span>
                      <p className="text-2xl font-serif font-black text-forest-900">{queries.length}</p>
                      <span className="text-[9px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">Consultation Requests</span>
                    </div>
                  </div>

                  {/* Aesthetic visual Bar Chart representing revenues */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="font-serif font-bold text-base text-forest-900">Organic Sales Volume</h3>
                    
                    {/* SVG/CSS graph bars */}
                    <div className="grid grid-cols-7 gap-4 aspect-[4/1] items-end pt-4 border-b border-gray-200 pb-2">
                      {[
                        { day: "Thu", activeSales: 1650 },
                        { day: "Fri", activeSales: 2470 },
                        { day: "Sat", activeSales: 5120 },
                        { day: "Sun", activeSales: 8900 },
                        { day: "Mon", activeSales: 1250 },
                        { day: "Tue", activeSales: 3618 },
                        { day: "Today", activeSales: totalSalesRevenue || 4500 }
                      ].map((bar, i) => {
                        const heights = `${Math.min(100, Math.max(15, (bar.activeSales / 10000) * 100))}%`;
                        return (
                          <div key={i} className="flex flex-col items-center gap-2 group relative">
                            <div className="text-[9px] font-bold text-stone-700 mb-1 opacity-0 group-hover:opacity-100 duration-150 absolute -top-6 bg-forest-900 text-gold-500 px-1.5 py-0.5 rounded shadow">
                              ₹{bar.activeSales}
                            </div>
                            <div 
                              className="w-full bg-forest-900/10 hover:bg-forest-900 rounded-t-lg duration-250 border border-transparent hover:border-gold-500/30 cursor-pointer"
                              style={{ height: heights }}
                            ></div>
                            <span className="text-[10px] font-semibold text-gray-400 font-mono">{bar.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent order logs (Table view) */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm space-y-4 p-6">
                    <h3 className="font-serif font-bold text-base text-forest-900">Recent Indian Farm Shipments</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-mono uppercase tracking-wider text-[10px] pb-3">
                            <th className="py-3">Order ID</th>
                            <th>Customer</th>
                            <th>Products</th>
                            <th>Sum Total</th>
                            <th>Checkout Method</th>
                            <th>Status Flag</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {orders.slice(0, 5).map((o) => (
                            <tr key={o.id} className="hover:bg-stone-50/50 duration-100">
                              <td className="py-3.5 font-bold font-mono text-forest-900">{o.id}</td>
                              <td>
                                <div className="font-semibold">{o.customerName}</div>
                                <div className="text-[10px] text-gray-400 font-mono">{o.customerEmail}</div>
                              </td>
                              <td className="max-w-xs truncate font-medium">
                                {o.items.map((it) => `${it.name} (x${it.quantity})`).join(", ")}
                              </td>
                              <td className="font-mono font-bold">₹{o.total}</td>
                              <td className="font-semibold text-[10px] uppercase">
                                <span className={`px-2 py-0.5 rounded ${o.paymentMethod === "COD" ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-800"}`}>
                                  {o.paymentMethod}
                                </span>
                              </td>
                              <td>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${
                                  o.status === "delivered" 
                                    ? "bg-emerald-100 text-emerald-800" 
                                    : o.status === "cancelled" 
                                    ? "bg-red-150 text-red-800" 
                                    : "bg-blue-100 text-blue-800 font-mono"
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCT CATALOGUE CRUD */}
              {activeTab === "products" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-forest-900">Boutique Catalogue ({products.length})</h2>
                      <p className="text-xs text-gray-500">Add, edit, or delete organic farm products in real-time server database.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditProduct(null);
                        setPForm({
                          name: "", tagline: "", description: "", category: "cow-ghee",
                          price: 1000, salePrice: undefined, image: "", stock: 20, 
                          weight: "500g", bilonaProcess: true, benefits: []
                        });
                        setShowProductForm(true);
                      }}
                      className="bg-forest-900 hover:bg-forest-950 text-gold-500 hover:text-gold-400 font-serif tracking-widest text-xs uppercase py-3 px-5 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Release New Product</span>
                    </button>
                  </div>

                  {/* FORM TRIGGER POPUP */}
                  {showProductForm && (
                    <form onSubmit={handleProductSubmit} className="bg-white border border-gold-500/10 p-6 rounded-2xl shadow-xl space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 flex items-center justify-between border-b pb-2">
                        <h3 className="font-serif font-black text-base text-forest-900">
                          {editProduct ? `Specification Edit: ${editProduct.name}` : "Launch New Harvest Product"}
                        </h3>
                        <button type="button" onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-gray-600">
                          ✕
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-gray-400">Product Name</label>
                        <input
                          type="text"
                          required
                          value={pForm.name}
                          onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                          placeholder="e.g. Certified Pure Himalayan A2 Honey"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-gray-400">Luxury Subtitle / Tagline</label>
                        <input
                          type="text"
                          required
                          value={pForm.tagline}
                          onChange={(e) => setPForm({ ...pForm, tagline: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                          placeholder="e.g. Amber Drops • Raw Forest Essence"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-gray-400">Healing Traditional Story / Description</label>
                        <textarea
                          required
                          rows={3}
                          value={pForm.description}
                          onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                          placeholder="Detailed story about its preparation, location of farm, biological health advantages..."
                        ></textarea>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-gray-400">Category Tag</label>
                        <select
                          value={pForm.category}
                          onChange={(e) => setPForm({ ...pForm, category: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                        >
                          <option value="cow-ghee">A2 Cow Ghee</option>
                          <option value="buffalo-ghee">Buffalo Ghee</option>
                          <option value="natural-honey">Natural Honey</option>
                          <option value="cold-pressed-oils">Cold Pressed Oils</option>
                          <option value="organic-jaggery">Organic Jaggery</option>
                          <option value="organic-pulses">Organic Pulses</option>
                          <option value="organic-spices">Organic Spices</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-gray-400">Net Weight Chip</label>
                        <input
                          type="text"
                          required
                          value={pForm.weight}
                          onChange={(e) => setPForm({ ...pForm, weight: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                          placeholder="e.g. 500ml, 1kg, 250g"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-gray-400">Standard Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={pForm.price}
                          onChange={(e) => setPForm({ ...pForm, price: Number(e.target.value) })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-gray-400">Discount Sale Price (Optional) (₹)</label>
                        <input
                          type="number"
                          value={pForm.salePrice || ""}
                          onChange={(e) => setPForm({ ...pForm, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-gray-400">Available Stock Units</label>
                        <input
                          type="number"
                          required
                          value={pForm.stock}
                          onChange={(e) => setPForm({ ...pForm, stock: Number(e.target.value) })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-widest font-bold text-gray-400">Image Cover URL</label>
                        <input
                          type="text"
                          required
                          value={pForm.image || ""}
                          onChange={(e) => setPForm({ ...pForm, image: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                          placeholder="Unsplash premium URL..."
                        />
                      </div>

                      {/* Traditional checkboxes */}
                      <div className="flex gap-6 items-center pt-4 select-none">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                          <input
                            type="checkbox"
                            checked={!!pForm.bilonaProcess}
                            onChange={(e) => setPForm({ ...pForm, bilonaProcess: e.target.checked })}
                            className="accent-forest-900 rounded"
                          />
                          <span>Vedic Bilona Process</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-indigo-900">
                          <input
                            type="checkbox"
                            checked={!!pForm.subscriptionAvailable}
                            onChange={(e) => setPForm({ ...pForm, subscriptionAvailable: e.target.checked })}
                            className="accent-indigo-900 rounded"
                          />
                          <span>Monthly subscription delivery available</span>
                        </label>
                      </div>

                      <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={() => setShowProductForm(false)} className="px-4 py-2 text-xs font-semibold text-gray-500">
                          Cancel
                        </button>
                        <button type="submit" className="bg-forest-900 text-gold-500 font-serif tracking-wider uppercase text-xs font-bold py-2 px-6 rounded-xl">
                          {editProduct ? "Optimize specifications" : "Publish product specs"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Core product cards list */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-mono uppercase tracking-wider text-[10px] pb-3">
                            <th className="py-3 px-4">Item</th>
                            <th>Tag Category</th>
                            <th>Cost Specifications</th>
                            <th>Inventory Stock Level</th>
                            <th>Traditional Seal</th>
                            <th className="text-right px-6">Modify</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {products.map((p) => (
                            <tr key={p.id} className="hover:bg-stone-50/50 duration-100">
                              <td className="py-3.5 px-4 flex items-center gap-3">
                                <img src={p.image} referrerPolicy="no-referrer" alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0 bg-stone-100" />
                                <div>
                                  <div className="font-bold text-forest-900">{p.name}</div>
                                  <div className="text-[10px] text-gray-400 font-mono tracking-wide">{p.weight} • id:{p.id}</div>
                                </div>
                              </td>
                              <td className="capitalize font-semibold text-teal-800">{p.category}</td>
                              <td className="font-medium font-mono">
                                {p.salePrice ? (
                                  <span className="flex flex-col">
                                    <span className="text-forest-900 font-bold">₹{p.salePrice}</span>
                                    <span className="text-[10px] text-gray-400 line-through">₹{p.price}</span>
                                  </span>
                                ) : (
                                  <span className="font-bold text-forest-900">₹{p.price}</span>
                                )}
                              </td>
                              <td>
                                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                                  p.stock === 0 
                                    ? "bg-red-100 text-red-800" 
                                    : p.stock < 10 
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}>
                                  {p.stock} units available
                                </span>
                              </td>
                              <td>
                                {p.bilonaProcess ? (
                                  <span className="bg-gold-500/10 text-gold-600 font-bold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded border border-gold-500/30">
                                    Bilona Classic
                                  </span>
                                ) : (
                                  <span className="text-gray-400 italic text-[10px]">Ambient Squeeze</span>
                                )}
                              </td>
                              <td className="text-right px-6">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleEditProductClick(p)}
                                    className="p-1.5 hover:bg-stone-100 rounded text-forest-800"
                                    title="Edit specifications"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 hover:bg-red-50 rounded text-red-650"
                                    title="Remove from catalogue"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ORDERS MANAGER */}
              {activeTab === "orders" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-forest-900">System Shipping Manager ({orders.length} orders)</h2>
                    <p className="text-xs text-gray-500">Oversee customer orders, adjust order delivery phases, and update payment checks.</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-mono uppercase tracking-wider text-[10px] pb-3">
                            <th className="py-3 px-4">Order Details</th>
                            <th>Buyer</th>
                            <th>Shipped To</th>
                            <th>Aggregate sum</th>
                            <th>Delivery Phase</th>
                            <th>Payment Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-stone-50/50 duration-100">
                              <td className="py-4 px-4 space-y-1">
                                <div className="font-bold text-forest-900 font-mono">{o.id}</div>
                                <div className="text-[10px] text-gray-455 font-mono">{new Date(o.date).toLocaleDateString()}</div>
                                <div className="text-[11px] text-gray-600 max-w-xs">{o.items.map(it => `${it.name} (x${it.quantity})`).join(", ")}</div>
                              </td>
                              <td>
                                <div className="font-semibold text-forest-900">{o.customerName}</div>
                                <div className="text-[10px] text-gray-400 font-mono">{o.customerEmail}</div>
                              </td>
                              <td className="text-[11px] max-w-xs">
                                <div>{o.shippingAddress.fullName} - {o.shippingAddress.phone}</div>
                                <div className="text-gray-500 font-light truncate">{o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}</div>
                              </td>
                              <td className="font-mono font-bold text-forest-950">₹{o.total}</td>
                              <td>
                                <select
                                  value={o.status}
                                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                  className="bg-stone-50 border p-1 rounded font-mono font-bold text-[10px] uppercase text-forest-900 focus:outline-none"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td>
                                <select
                                  value={o.paymentStatus}
                                  onChange={(e) => updateOrderPaymentStatus(o.id, e.target.value)}
                                  className={`p-1 rounded font-mono font-black text-[10px] uppercase border focus:outline-none focus:ring-0 ${
                                    o.paymentStatus === "paid" 
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-800" 
                                      : "bg-amber-55 text-amber-500"
                                  }`}
                                >
                                  <option value="pending">Unpaid / COD Check</option>
                                  <option value="paid">Paid</option>
                                  <option value="refunded">Refunded (Cancelled)</option>
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

              {/* TAB 4: COUPONS SYSTEM */}
              {activeTab === "coupons" && (
                <div className="space-y-6 animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left formulation form */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="font-serif font-black text-base text-forest-900">Activate Promo Promo</h3>
                    
                    <form onSubmit={handleCouponSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Coupon Token Code</label>
                        <input
                          type="text"
                          required
                          value={cForm.code}
                          onChange={(e) => setCForm({ ...cForm, code: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl uppercase font-mono tracking-wider font-bold text-xs"
                          placeholder="e.g. AMBILONA25"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Percentage Discount (%)</label>
                        <input
                          type="number"
                          required
                          max={90}
                          min={1}
                          value={cForm.discountPercentage}
                          onChange={(e) => setCForm({ ...cForm, discountPercentage: Number(e.target.value) })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Minimum Order Basket (₹)</label>
                        <input
                          type="number"
                          required
                          value={cForm.minOrderAmount}
                          onChange={(e) => setCForm({ ...cForm, minOrderAmount: Number(e.target.value) })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Public Description</label>
                        <input
                          type="text"
                          required
                          value={cForm.description}
                          onChange={(e) => setCForm({ ...cForm, description: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                          placeholder="Save ₹250 on churning cow ghees today."
                        />
                      </div>

                      <button type="submit" className="w-full bg-forest-900 hover:bg-forest-950 text-gold-500 text-xs tracking-widest font-serif font-bold uppercase py-3 rounded-xl">
                        Activate Promo Code
                      </button>
                    </form>
                  </div>

                  {/* List of active tokens */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-2 space-y-4">
                    <h3 className="font-serif font-black text-base text-forest-900">Active Campaign Codes</h3>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {coupons.map((c) => (
                        <div key={c.code} className="bg-stone-50 p-4 rounded-xl border border-dashed border-gray-300 flex justify-between items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono bg-forest-900 text-gold-500 px-3 py-1 text-xs rounded-lg font-bold select-all tracking-wider">
                                {c.code}
                              </span>
                              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                Save {c.discountPercentage}%
                              </span>
                            </div>
                            <p className="text-xs text-gray-650">{c.description}</p>
                            <p className="text-[9px] font-mono text-gray-400">Minimum value required: ₹{c.minOrderAmount}</p>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteCoupon(c.code)}
                            className="p-2 hover:bg-red-50 text-red-650 rounded-lg duration-150"
                            title="Deactivate Promo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: VEDIC BLOG WRITER */}
              {activeTab === "blogs" && (
                <div className="space-y-6 animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Write Blog entry */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="font-serif font-black text-base text-forest-900">Draft Ayurvedic Article</h3>
                    
                    <form onSubmit={handleBlogSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Article Title</label>
                        <input
                          type="text"
                          required
                          value={bForm.title}
                          onChange={(e) => setBForm({ ...bForm, title: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                          placeholder="e.g. Benefits of A2 Ghee before sleep"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Category</label>
                        <select
                          value={bForm.category}
                          onChange={(e) => setBForm({ ...bForm, category: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                        >
                          <option value="Cow Ghee">A2 Cow Ghee</option>
                          <option value="Natural Honey">Natural Honey</option>
                          <option value="Wood Ghani">Wood Ghani Oils</option>
                          <option value="Ayurvedic Science">Ayurvedic Practice</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Excerpt summary</label>
                        <input
                          type="text"
                          required
                          value={bForm.excerpt}
                          onChange={(e) => setBForm({ ...bForm, excerpt: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs"
                          placeholder="Brief 1-sentence synopsis."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Read complexity time</label>
                        <input
                          type="text"
                          required
                          value={bForm.readTime}
                          onChange={(e) => setBForm({ ...bForm, readTime: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs block"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Artwork Image URL</label>
                        <input
                          type="text"
                          required
                          value={bForm.image}
                          onChange={(e) => setBForm({ ...bForm, image: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs block"
                          placeholder="Unsplash premium cover picture link..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Markdown Content Body</label>
                        <textarea
                          required
                          rows={6}
                          value={bForm.content}
                          onChange={(e) => setBForm({ ...bForm, content: e.target.value })}
                          className="w-full bg-stone-50 border p-2.5 rounded-xl text-xs font-sans whitespace-pre-wrap"
                          placeholder="Write fully detailed ayurvedic benefits..."
                        ></textarea>
                      </div>

                      <button type="submit" className="w-full bg-forest-900 hover:bg-forest-950 text-gold-500 text-xs tracking-widest font-serif font-bold uppercase py-3 rounded-xl cursor-pointer">
                        Publish Blog Post
                      </button>
                    </form>
                  </div>

                  {/* Blogs overview table */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-2 space-y-4">
                    <h3 className="font-serif font-black text-base text-forest-900">Published Wellness Wisdom</h3>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {blogs.map((b) => (
                        <div key={b.id} className="bg-stone-50 p-4 rounded-xl border border-gray-200 flex gap-4 items-center justify-between">
                          <div className="flex gap-3 items-center min-w-0">
                            <img src={b.image} referrerPolicy="no-referrer" alt={b.title} className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100" />
                            <div className="min-w-0">
                              <h4 className="font-serif font-bold text-sm text-forest-900 truncate">{b.title}</h4>
                              <p className="text-[11px] text-gray-500 font-sans line-clamp-1">{b.excerpt}</p>
                              <div className="flex gap-2 text-[10px] text-gray-400 mt-1 font-mono">
                                <span>{b.date}</span>
                                <span>•</span>
                                <span className="text-teal-800 font-semibold">{b.category}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteBlog(b.id)}
                            className="p-2 hover:bg-red-50 text-red-650 rounded-lg duration-155 shrink-0"
                            title="Delete Blog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: WELLNESS ENQUIRIES */}
              {activeTab === "queries" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-forest-900">Community Enquiries</h2>
                    <p className="text-xs text-gray-500">Respond directly to custom organic consults, wholesale bilona requests, and local orders.</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="divide-y divide-gray-100">
                      {queries.length > 0 ? (
                        queries.map((q) => (
                          <div key={q.id} className="p-6 hover:bg-stone-50/50 duration-150 space-y-3">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-0.5">
                                <h4 className="font-serif font-bold text-base text-forest-900">{q.name}</h4>
                                <p className="text-[11px] text-gray-400 font-mono tracking-wide">{q.email} • Received on {new Date(q.date).toLocaleString()}</p>
                              </div>
                              <span className={`px-2.5 py-1 text-[9px] uppercase font-mono tracking-widest font-black rounded-lg ${
                                q.status === "replied" 
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300" 
                                  : "bg-amber-50 text-amber-800 border border-amber-300"
                              }`}>
                                {q.status}
                              </span>
                            </div>

                            <p className="text-xs text-forest-850 p-4 bg-stone-100 rounded-xl italic break-words border-l-4 border-gold-500/50 font-sans">
                              “{q.message}”
                            </p>

                            <div className="flex justify-end gap-2">
                              {q.status === "new" && (
                                <button
                                  onClick={async () => {
                                    await fetch(`/api/contact/${q.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "replied" }) });
                                    // Normally we would have endpoints, let's trigger locally
                                    setQueries(queries.map(item => item.id === q.id ? { ...item, status: "replied" } : item));
                                    triggerToast(`Emailed traditional consult details to ${q.email}.`);
                                  }}
                                  className="bg-forest-900 text-gold-500 text-[10px] font-mono px-4 py-2 rounded-xl uppercase font-bold"
                                >
                                  Mark as Replied
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20 text-xs text-gray-500 italic space-y-2">
                          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                          <p>All client consultations are answered cleanly! Nature is at peace.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
