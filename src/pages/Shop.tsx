import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Search, Star, Sparkles, RefreshCcw, Tag } from "lucide-react";
import { Product, Category } from "../types";
import ProductCard from "../components/ProductCard";

interface ShopProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (prodId: string, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (prodId: string) => void;
  wishlist: string[];
  searchFilter: string;
  onSearch: (text: string) => void;
}

type SortOption = "default" | "low-to-high" | "high-to-low" | "rating" | "bestsellers";

export default function Shop({
  products,
  categories,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlist,
  searchFilter,
  onSearch
}: ShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort computation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter match
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory.toLowerCase()
      );
    }

    // Live search query match
    if (searchFilter.trim() !== "") {
      const q = searchFilter.toLowerCase();
      result = result.filter(
        (p) => 
          p.name.toLowerCase().includes(q) || 
          p.tagline.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q)
      );
    }

    // Price range match
    result = result.filter((p) => {
      const activePrice = p.salePrice || p.price;
      return activePrice <= priceRange;
    });

    // Sorting algorithm
    if (sortBy === "low-to-high") {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "bestsellers") {
      result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, searchFilter, priceRange, sortBy]);

  // Related products sidebar (random suggestion)
  const healthBoosters = useMemo(() => {
    return products.filter((p) => p.isBestseller || p.rating >= 4.8).slice(0, 3);
  }, [products]);

  return (
    <div id="shopv-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      
      {/* Dynamic Header details */}
      <div className="bg-forest-900 text-cream-100 p-8 rounded-3xl border border-gold-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('/src/assets/images/haryana_farms_1780232128905.png')] bg-cover bg-center"></div>
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400 font-bold">100% TRADITIONAL SEED SOURCED</span>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Ancient Hariana Sourcing</h1>
          <p className="text-xs text-cream-300 max-w-xl">
            Clean boutique organic harvests delivered to high-profile Indian families. Sourced locally using eco-conscious packages.
          </p>
        </div>

        {/* Small floating helper */}
        <div className="relative z-10 bg-forest-950/45 p-4 rounded-2xl border border-gold-500/10 text-center">
          <p className="font-serif text-lg font-bold text-gold-500 leading-none">FREE Shipping</p>
          <p className="text-[10px] text-cream-300 mt-1">on orders above ₹1,000 across India</p>
        </div>
      </div>

      {/* Main Filter and products grid blocks */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side Sidebar - Filters controls (hidden on small devices by default) */}
        <aside className={`w-full lg:w-72 bg-white ring-1 ring-forest-950/5 p-6 rounded-2xl border border-cream-300/40 space-y-6 shrink-0 lg:block ${showFilters ? "block" : "hidden"}`}>
          
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="font-serif font-black text-sm text-forest-900">Custom Filters</h3>
            <button 
              onClick={() => {
                setSelectedCategory("all");
                setPriceRange(3000);
                setSortBy("default");
                onSearch("");
              }}
              className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400 hover:text-red-500 duration-150"
            >
              Reset All
            </button>
          </div>

          {/* Search box within sidebar */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-semibold">Live Keyword Search</label>
            <div className="relative text-xs">
              <Search className="w-4.5 h-4.5 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search name, benefits..."
                className="w-full bg-stone-50 border p-2.5 pl-10 rounded-xl focus:outline-none focus:border-gold-500 text-xs text-forest-950"
              />
            </div>
          </div>

          {/* Categories Selector list */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-semibold">Select Collection</label>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg flex justify-between items-center font-bold tracking-wide transition-all ${
                  selectedCategory === "all" 
                    ? "bg-forest-900 text-gold-500 shadow-sm" 
                    : "text-gray-500 hover:bg-stone-50 hover:text-forest-900"
                }`}
              >
                <span>Complete Archives</span>
                <span className="font-mono text-[10px] font-light">({products.length})</span>
              </button>
              {categories.map((c) => {
                const count = products.filter(
                  (p) => p.category.toLowerCase().replace(/\s+/g, "-") === c.id.toLowerCase()
                ).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg flex justify-between items-center font-bold tracking-wide capitalize transition-all ${
                      selectedCategory === c.id 
                        ? "bg-forest-900 text-gold-500 shadow-sm text-left" 
                        : "text-gray-500 hover:bg-stone-50 hover:text-forest-900 text-left"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-[10px] font-light">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing range slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-semibold">Filter by Price</label>
              <span className="text-xs font-mono font-bold text-forest-900">Up to ₹{priceRange}</span>
            </div>
            <input
              type="range"
              min={100}
              max={3000}
              step={50}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-900"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>₹100</span>
              <span>₹3,000</span>
            </div>
          </div>

          {/* Health Boosters related widget block */}
          <div className="pt-4 border-t border-cream-300">
            <h4 className="font-serif font-black text-xs text-forest-900 mb-3 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
              <span>Vaidya Recommendation</span>
            </h4>
            <div className="space-y-3.5">
              {healthBoosters.map((hb) => (
                <div key={hb.id} onClick={() => onQuickView(hb)} className="flex items-center gap-2.5 cursor-pointer hover:bg-stone-50 p-1.5 rounded-lg duration-150">
                  <img src={hb.image} referrerPolicy="no-referrer" alt={hb.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100 border shrink-0" />
                  <div className="min-w-0 font-sans">
                    <p className="text-[11px] font-bold text-forest-900 truncate">{hb.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">₹{hb.salePrice || hb.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right side items stream */}
        <section className="flex-1 w-full space-y-6">
          {/* Top Sorting option tools */}
          <div className="bg-white p-4 rounded-2xl border border-cream-300/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-xs">
            
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-forest-900 text-cream-100 flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              <p className="text-gray-500 font-medium">
                Revealing <span className="text-forest-900 font-black font-mono">{filteredProducts.length}</span> wholesome products
              </p>
            </div>

            {/* Sorting trigger */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-stone-50 border border-gray-250 p-2 rounded-xl text-xs font-bold text-forest-900 focus:outline-none"
              >
                <option value="default">Vedic Relevance</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
                <option value="rating">Top Rated Seekers</option>
                <option value="bestsellers">Bestsellers and Featured</option>
              </select>
            </div>
          </div>

          {/* Catalogue Card Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.includes(prod.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-16 rounded-3xl text-center border space-y-4 max-w-lg mx-auto">
              <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto animate-bounce" />
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-forest-900">No divine harvests found</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                  We currently do not possess stock matching these filters. Try relaxing your parameters or consult our Vaidya Shree Advisor.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
