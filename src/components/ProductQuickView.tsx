import React, { useState } from "react";
import { X, Star, Calendar, Shield, ShoppingCart, RefreshCcw, BellRing, MessageSquare, Heart } from "lucide-react";
import { Product, Review } from "../types";

interface ProductQuickViewProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (prodId: string, quantity: number, subscription?: boolean) => void;
  isWishlisted: boolean;
  onToggleWishlist: (prodId: string) => void;
}

export default function ProductQuickView({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}: ProductQuickViewProps) {
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "storage">("benefits");
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  
  // Review submission state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || []);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    setSubmittingReview(true);
    setReviewMessage("");
    try {
      const response = await fetch(`/api/products/${product.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      if (response.ok) {
        const newReview: Review = await response.json();
        setReviewsList([newReview, ...reviewsList]);
        setReviewName("");
        setReviewComment("");
        setReviewRating(5);
        setReviewMessage("✨ Thank you! Your review has been added to our farm register.");
      }
    } catch (err) {
      console.error(err);
      setReviewMessage("Could not publish review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(product.id, quantity, isSubscription);
  };

  return (
    <div id="quickview-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-cream-100 ring-1 ring-gold-500/10 text-forest-950 rounded-2xl overflow-hidden max-w-5xl w-full shadow-2xl relative my-8 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Switch */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-cream-100 hover:bg-forest-900 text-forest-950 hover:text-gold-500 shadow-md transition-all duration-200 z-30 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Column 1: Multi-Image Showcase (left) */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-cream-200/45 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-[90vh]">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-cream-300/40 relative">
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.bilonaProcess && (
                <div className="absolute bottom-4 left-4 bg-forest-950/90 text-gold-400 border border-gold-500/20 text-[10px] font-mono py-1 px-3.5 rounded-full flex items-center gap-1.5 shadow">
                  <RefreshCcw className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Vedic Bilona Certified</span>
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 pb-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                      selectedImage === img ? "border-gold-500 shadow-md" : "border-cream-300/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Botanical attributes */}
          <div className="bg-forest-900 text-cream-100 rounded-xl p-5 border border-gold-500/20 mt-6 space-y-3 relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[url('/src/assets/images/haryana_farms_1780232128905.png')] bg-cover bg-center"></div>
            <div className="relative z-10 flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-serif font-semibold text-xs uppercase tracking-wider text-gold-400">100% Traditional Integrity</h5>
                <p className="text-[11px] text-cream-300 leading-relaxed mt-1">
                  Hariana products are harvested only in auspicious cycles. We strictly ban all chemical fertilizers, artificial coloring, and bulk-processing plastic dispensers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Detailed Attributes & Reviews Form (right) */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-[90vh]">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-teal-800 bg-emerald-950/5 px-2.5 py-1 rounded w-fit">
                {product.category} Essence
              </span>
              <h2 className="text-2xl font-serif font-bold text-forest-900 tracking-tight leading-tight pt-1">
                {product.name}
              </h2>
              <p className="text-xs italic text-amber-800 font-medium">“{product.tagline}”</p>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2 pb-4 border-b border-forest-900/10">
              <span className="text-2xl font-serif font-bold text-forest-950">
                ₹{product.salePrice || product.price}
              </span>
              {product.salePrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.price}
                </span>
              )}
              <span className="text-xs text-forest-800/70 ml-2">Net Weight: {product.weight}</span>
            </div>

            {/* Description */}
            <p className="text-xs text-forest-850 leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Selector Tabs (Benefits, Ingredients, Storage) */}
            <div className="space-y-3 font-sans">
              <div className="flex gap-2 border-b border-forest-900/5 pb-2">
                {(["benefits", "ingredients", "storage"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs uppercase font-serif tracking-widest pb-1 border-b-2 transition-all ${
                      activeTab === tab
                        ? "border-gold-500 font-bold text-forest-900"
                        : "border-transparent text-gray-400 hover:text-forest-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="text-xs text-forest-850 leading-relaxed min-h-[60px]">
                {activeTab === "benefits" && (
                  <ul className="list-disc pl-4 space-y-1.5">
                    {product.benefits.map((b, idx) => (
                      <li key={idx} className="text-[11px]">{b}</li>
                    ))}
                  </ul>
                )}
                {activeTab === "ingredients" && (
                  <p className="text-[11px] font-mono italic">{product.ingredients}</p>
                )}
                {activeTab === "storage" && (
                  <p className="text-[11px]">{product.storage}</p>
                )}
              </div>
            </div>

            {/* SUB SUBSCRIPTION OPTION */}
            {product.subscriptionAvailable && (
              <div className="bg-emerald-950/5 rounded-2xl p-4 border border-teal-850/15 space-y-3 font-sans">
                <div className="flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span className="text-xs font-serif font-bold text-forest-900">Custom Subscription Delivery</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsSubscription(false)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      !isSubscription 
                        ? "border-emerald-800 bg-white shadow-sm" 
                        : "border-cream-300 bg-cream-200/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <p className="text-xs font-bold">One-Time Buy</p>
                    <p className="text-[10px] text-gray-500">Pay standard price</p>
                  </button>
                  <button
                    onClick={() => setIsSubscription(true)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSubscription 
                        ? "border-emerald-800 bg-white shadow-sm" 
                        : "border-cream-300 bg-cream-200/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <p className="text-xs font-bold text-emerald-800">Subscribe & Save 10%</p>
                    <p className="text-[10px] text-emerald-700">Delivered every 30 days</p>
                  </button>
                </div>
              </div>
            )}

            {/* Quantity Selector & Action row */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-forest-900/15 rounded-xl h-11 bg-white font-mono">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 hover:bg-forest-900/5 h-full rounded-l-xl text-forest-900 text-sm"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 hover:bg-forest-900/5 h-full rounded-r-xl text-forest-900 text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCartClick}
                className="flex-1 bg-forest-900 hover:bg-forest-950 text-gold-500 hover:text-gold-400 font-serif tracking-widest text-xs uppercase h-11 rounded-xl shadow-md flex items-center justify-center gap-2 font-bold cursor-pointer transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add To Cart • ₹{(product.salePrice || product.price) * quantity * (isSubscription ? 0.9 : 1)}</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
                  isWishlisted 
                    ? "bg-red-500 border-red-500 text-white" 
                    : "border-forest-900/15 hover:bg-forest-900/5 text-forest-900"
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Review and Community testimonials sections */}
            <div className="border-t border-forest-900/10 pt-6 space-y-4">
              <h4 className="font-serif font-bold text-sm text-forest-900 flex items-center gap-1.5Packed pb-2 border-b border-forest-100">
                <MessageSquare className="w-4 h-4 text-gold-500" />
                <span>Ayurvedic Community Journal (+{reviewsList.length})</span>
              </h4>

              {/* Review List */}
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 pb-2">
                {reviewsList.length > 0 ? (
                  reviewsList.map((rev) => (
                    <div key={rev.id} className="text-xs bg-white/70 p-3.5 rounded-xl border border-cream-300/40">
                      <div className="flex items-center justify-between mb-1.5 font-sans">
                        <span className="font-bold text-forest-900">{rev.userName}</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, rIdx) => (
                            <Star key={rIdx} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 italic leading-relaxed text-[11px]">“{rev.comment}”</p>
                      <div className="flex justify-between items-center mt-2 text-[10px] text-gray-400">
                        <span>{rev.date}</span>
                        {rev.verifiedPurchase && <span className="text-teal-800 font-semibold uppercase font-mono bg-emerald-950/5 px-2 py-0.5 rounded">Verified Seeker</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-gray-500 italic text-center py-4">No journal entries written yet. Be the first to share your experience!</p>
                )}
              </div>

              {/* Submission Form */}
              <form onSubmit={handleReviewSubmit} className="bg-forest-950/5 p-4 rounded-xl space-y-3 border border-forest-900/10">
                <h5 className="font-serif font-bold text-xs text-forest-900">Add Your Pure Experience</h5>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="bg-white p-2.5 rounded-lg border focus:ring-1 focus:ring-gold-500 focus:outline-none focus:border-gold-500"
                  />
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="bg-white p-2.5 rounded-lg border focus:outline-none font-mono"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                    <option value={2}>⭐⭐ (2/5)</option>
                    <option value={1}>⭐ (1/5)</option>
                  </select>
                </div>

                <textarea
                  required
                  rows={2}
                  placeholder="Share details on texture, aroma, energy levels or digestive improvements..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs bg-white p-2.5 rounded-lg border focus:ring-1 focus:ring-gold-500 focus:outline-none focus:border-gold-500"
                ></textarea>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-forest-900 hover:bg-forest-950 text-gold-500 text-xs py-2.5 rounded-lg font-serif tracking-wider uppercase font-semibold cursor-pointer transition-all"
                >
                  {submittingReview ? "Documenting in register..." : "Submit Experience Entry"}
                </button>

                {reviewMessage && <p className="text-[11px] text-blue-900 text-center font-sans mt-2">{reviewMessage}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
