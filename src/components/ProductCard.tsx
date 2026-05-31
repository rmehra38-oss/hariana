import React, { useState } from "react";
import { Star, Heart, Eye, ShoppingCart, Check, RefreshCw } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: any;
  product: Product;
  onAddToCart: (prodId: string, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (prodId: string) => void;
  isWishlisted: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = () => {
    setAdding(true);
    onAddToCart(product.id, 1);
    setTimeout(() => {
      setAdding(false);
    }, 1200);
  };

  const discount = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-cream-100 rounded-sm overflow-hidden border border-forest-900/10 hover:border-gold-500/40 shadow-xs transition-all duration-350 hover:shadow-md group flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-200/50 flex items-center justify-center border-b border-forest-900/10">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Cinematic Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 duration-300 pointer-events-none"></div>

        {/* Product Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 font-sans">
          {discount > 0 && (
            <span className="bg-gold-500 text-forest-950 text-[9px] font-bold px-3 py-1 uppercase tracking-widest shadow-xs">
              {discount}% OFF
            </span>
          )}
          {product.bilonaProcess && (
            <span className="bg-[#1B3022] text-[#FCFAF7] text-[8px] font-bold px-3 py-1 uppercase tracking-widest flex items-center gap-1 shadow-xs">
              <RefreshCw className="w-2.5 h-2.5 animate-spin-slow text-gold-500" />
              Bilona Method
            </span>
          )}
          {product.subscriptionAvailable && (
            <span className="bg-[#FCFAF7] text-[#1B3022] border border-[#1B3022]/20 text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
              Subscribe & Save
            </span>
          )}
        </div>

        {/* Micro-actions Overlay (slide-in from right) */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-x-4 md:group-hover:translate-x-0 z-10">
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-250 ${
              isWishlisted
                ? "bg-red-550 border-red-550 text-white"
                : "bg-cream-100 hover:bg-forest-900 border-forest-900/20 text-forest-900 hover:text-gold-500 shadow-sm"
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current text-white" : ""}`} />
          </button>
          <button
            onClick={() => onQuickView(product)}
            className="w-9 h-9 bg-cream-100 hover:bg-forest-900 rounded-full flex items-center justify-center border border-forest-900/20 text-forest-900 hover:text-gold-500 transition-all duration-250 shadow-sm"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile quick icons (visible by default on touch screens) */}
        <div className="absolute right-2 bottom-2 md:hidden flex gap-1 z-10">
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isWishlisted ? "bg-red-500 text-white" : "bg-cream-100/90 text-forest-950 shadow"
            }`}
          >
            <Heart className={`w-3 h-3 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => onQuickView(product)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-cream-100/90 text-forest-950 shadow"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 font-sans">
        <div className="space-y-1.5">
          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] text-[#1B3022]/60">
            <span className="flex items-center text-gold-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="ml-1 font-bold font-mono">{product.rating.toFixed(1)}</span>
            </span>
            <span>•</span>
            <span className="font-mono tracking-tight">{product.reviewsCount} reviews</span>
          </div>

          <h3 className="font-serif font-semibold text-lg text-forest-900 leading-snug group-hover:text-gold-500 duration-150 cursor-pointer" onClick={() => onQuickView(product)}>
            {product.name}
          </h3>

          <p className="text-xs text-[#1B3022]/70 font-sans leading-relaxed line-clamp-2">
            {product.tagline}
          </p>
        </div>

        {/* Weight chip & Pricing */}
        <div className="flex items-center justify-between border-t border-forest-900/10 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-forest-900 font-mono">
              {product.weight}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-semibold text-forest-950 font-serif">
                ₹{product.salePrice || product.price}
              </span>
              {product.salePrice && (
                <span className="text-[11px] text-gray-400 line-through font-serif">
                  ₹{product.price}
                </span>
              )}
            </div>
          </div>

          {/* Add To Cart Core Action */}
          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`flex items-center gap-1.5 text-[10px] uppercase font-sans tracking-widest font-bold py-3 px-4 rounded-none transition-all duration-300 border cursor-pointer ${
                adding
                  ? "bg-emerald-850 border-emerald-850 text-cream-100"
                  : "bg-forest-900 hover:bg-gold-500 border-forest-900 text-cream-100 hover:text-forest-950"
              }`}
            >
              {adding ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add To Basket</span>
                </>
              )}
            </button>
          ) : (
            <span className="text-[9px] uppercase tracking-wider font-bold text-red-700 bg-red-50 px-3 py-1.5 border border-red-200/50">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
