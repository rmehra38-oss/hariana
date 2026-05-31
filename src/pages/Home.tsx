import { Sparkles, Sprout, Calendar, Heart, ShieldCheck, ArrowRight, Star, Award, MessageSquare, Instagram, Shield, MoveRight } from "lucide-react";
import { Product, Category, BlogPost } from "../types";
import { useState } from "react";
import ProductCard from "../components/ProductCard";

interface HomeProps {
  products: Product[];
  categories: Category[];
  blogs: BlogPost[];
  onNavigate: (page: string) => void;
  onAddToCart: (prodId: string) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (prodId: string) => void;
  wishlist: string[];
}

export default function Home({
  products,
  categories,
  blogs,
  onNavigate,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlist
}: HomeProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const bestsellers = products.filter((p) => p.isBestseller || p.featured).slice(0, 4);

  const trustBadges = [
    { title: "Vedic Bilona Process", desc: "Bi-churned overnight curd on slow firewood.", icon: <Award className="w-6 h-6 text-gold-500" /> },
    { title: "100% Certified Organic", desc: "Zero synthetic weedicides, lead-chromates or sulfur.", icon: <ShieldCheck className="w-6 h-6 text-gold-500" /> },
    { title: "Direct Farm Sourcing", desc: "Ethical trade directly sustaining native farming families.", icon: <Sprout className="w-6 h-6 text-gold-500" /> },
    { title: "Ayurvedic Preservation", desc: "Packed in premium dark high-grade leak-proof glass.", icon: <Shield className="w-6 h-6 text-gold-500" /> }
  ];

  const testimonials = [
    {
      name: "Radhika Kulkarni",
      role: "Ayurvedic Practitioner",
      rating: 5,
      comment: "Highly granular, with a deep nutty fragrance that is completely absent in regular mechanical ghee. This is authentic A2 Gir Cow Bilona ghee in its absolute divine form. Healing for Vata types.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Chef Kunal Kapoor",
      role: "Gourmet Culinary Lead",
      rating: 5,
      comment: "The yellow wood-pressed mustard oil is fantastic; it has that genuine rustic punch and pungency needed for authentic North Indian recipes. Highly recommended.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
    }
  ];

  return (
    <div id="homepage-root" className="space-y-16 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* SECTION 1: CINEMATIC PREMIUM HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-forest-950 text-cream-100 overflow-hidden px-4 md:px-8">
        {/* Parallax background image with deep gradient veil */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/haryana_farms_1780232128905.png"
            alt="A2 Haryana Farms background"
            className="w-full h-full object-cover opacity-35 scale-105 animate-pulse-slow"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/85 to-forest-900/30"></div>
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-cream-100 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 md:space-y-8">
          {/* Micro announcement flag */}
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/25 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-semibold tracking-wider text-gold-400 uppercase animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold-500 animate-spin-slow" />
            <span>Traditionally Churned Liquid Gold Ghee</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-tight text-white max-w-4xl mx-auto">
              Pure Taste From <span className="text-gold-500 italic block mt-1">Nature’s Finest Farms</span>
            </h2>
            <p className="text-xs md:text-sm text-cream-300 max-w-2xl mx-auto leading-relaxed">
              Authentic A2 Cow Ghee, Buffalo Ghee, Natural Honey & Organic Products Crafted Traditionally in the auspicious hours of the morning using ancient Vedic processes.
            </p>
          </div>

          {/* Core Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate("shop")}
              className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-forest-950 font-serif tracking-widest text-xs uppercase font-bold py-4 px-10 rounded-xl shadow-2xl hover:scale-[1.03] transition-all cursor-pointer"
            >
              Shop Boutique ESSENTIALS
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="w-full sm:w-auto border border-cream-300/35 hover:bg-white/5 text-cream-100 font-serif tracking-widest text-xs uppercase font-bold py-4 px-10 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Explore Traditional methods</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Floating client trust ratings */}
          <div className="pt-6 flex justify-center items-center gap-2 text-xs text-cream-300">
            <div className="flex text-gold-500 font-mono">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span>•</span>
            <span className="font-semibold tracking-wide">Rated 4.9/5 by 2,000+ Wellness Seekers</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUST BADGES CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-80px] relative z-20">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border border-gray-100">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex gap-4 items-start p-4 hover:bg-stone-50 rounded-2xl duration-200">
              <div className="p-3 bg-forest-900/5 rounded-xl text-forest-900 shrink-0 border border-forest-900/10">
                {badge.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-serif font-bold text-sm text-forest-900">{badge.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: PRODUCT CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gold-600 font-semibold block">CHOOSE YOUR HEALING ESSENCE</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-900 tracking-tight">Ancient Farm Gatherings</h2>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onNavigate("shop");
                // Reset search triggers or filter categories
              }}
              className="bg-white rounded-2xl overflow-hidden border border-cream-300 shadow-sm hover:shadow-xl group cursor-pointer transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-100 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 font-serif font-bold text-white text-base">
                  {cat.name}
                </h3>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between font-sans">
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-teal-800 mt-3 inline-flex items-center gap-1 hover:text-emerald-900">
                  <span>Browse essentials</span>
                  <MoveRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: BESTSELLING INDULGENCES */}
      <section className="bg-cream-200/40 py-16 border-y border-cream-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest uppercase text-gold-600 font-bold block">COMMUNITY INDULGENCES</span>
              <h2 className="text-3xl font-serif font-bold text-forest-900 tracking-tight">Hariana Best-Sellers</h2>
            </div>
            <button
              onClick={() => onNavigate("shop")}
              className="text-xs font-serif tracking-widest uppercase text-forest-900 hover:text-forest-700 font-bold flex items-center gap-1.5 cursor-pointer pb-1 border-b-2 border-forest-900"
            >
              <span>Explore all items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.includes(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: STORYTELLING (ABOUT THE VEDIC bilLONA PROCESS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* visual column */}
          <div className="lg:col-span-5 relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden bg-stone-100 shadow-xl border border-cream-300">
            <img
              src="https://images.unsplash.com/photo-1622484211140-7e1329d47917?auto=format&fit=crop&q=80&w=600"
              alt="Ancestral organic farming"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* badge */}
            <div className="absolute top-4 right-4 bg-forest-900 text-gold-500 p-4 rounded-2xl border border-gold-500/10 text-center max-w-[140px] shadow-lg">
              <span className="font-serif font-bold text-xl block leading-none">1982</span>
              <span className="text-[9px] uppercase font-mono text-cream-300 tracking-wider">Ancestral Family Lineage</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/45 via-transparent to-transparent"></div>
          </div>

          {/* story column */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6 font-sans">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-gold-600 font-bold block">OUR DEEP ROOTED HEIRLOOM</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-900 leading-tight">Tradition churned with absolute devotion.</h2>
            </div>
            
            <p className="text-xs text-forest-850 leading-relaxed">
              At Hariana Organic Farm, we reject the high-speed high-temperature centrifuges that produce commercial butterfats. Our family believes in natural patience. Every batch of our A2 Cow Ghee is made on firewood following the sacred Vedic *Bilona* methodology. At sunrise, our curd—fermented overnight in heavy clay pots—is churned bi-directionally with wooden rods.
            </p>

            <blockquote className="border-l-4 border-gold-500 p-4 bg-cream-200/50 rounded-r-xl text-xs text-forest-900 italic font-mono">
              “True wellness isn't generated in heavy steel sterile factories. It is slow-boiled over firewood seeds, and gathered lovingly by local family hands.”
            </blockquote>

            <div className="grid grid-cols-2 gap-4 text-xs font-serif font-bold text-forest-900 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
                <span>Grass-Fed Native Cow Breeds</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
                <span>Handmade Small-Batch Saffron Churns</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
                <span>Zero Pesticides or Chemical Sulfur</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
                <span>Pure Heritage Indian Recipient Glass</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate("about")}
              className="bg-forest-900 hover:bg-forest-950 text-gold-500 py-3.5 px-8 rounded-xl text-xs font-serif uppercase tracking-widest font-bold shadow transition-all cursor-pointer inline-block"
            >
              Read our full chronicles
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE US BENTO LISTS */}
      <section className="bg-forest-900 text-cream-100 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=600')] bg-cover"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-gold-500 font-bold block">HARIANA STANDARD RULES</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">The Principles of Sacred Farming</h2>
            <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div className="bg-forest-950/50 p-6 rounded-2xl border border-white/5 space-y-3.5">
              <span className="font-mono text-xs text-gold-400 font-bold">PRINCIPIUM I</span>
              <h3 className="font-serif font-semibold text-lg text-white">Vedic Churned Cure (Agni)</h3>
              <p className="text-xs text-cream-300 leading-relaxed">
                By boiling milk slow on firewood, souring to whole milk curd, and bi-churning, we produce ghee containing intact butyric enzymes that strengthen digestive agni.
              </p>
            </div>

            <div className="bg-forest-950/50 p-6 rounded-2xl border border-white/5 space-y-3.5">
              <span className="font-mono text-xs text-gold-400 font-bold">PRINCIPIUM II</span>
              <h3 className="font-serif font-semibold text-lg text-white">True Ancestral Grazing</h3>
              <p className="text-xs text-cream-300 leading-relaxed">
                Our cows are native Gir and Haryana breeds, which enjoy green pasture grass, neem barks, and organic herbal stems daily. They are treated with warm relative concern.
              </p>
            </div>

            <div className="bg-forest-950/50 p-6 rounded-2xl border border-white/5 space-y-3.5">
              <span className="font-mono text-xs text-gold-400 font-bold">PRINCIPIUM III</span>
              <h3 className="font-serif font-semibold text-lg text-white">Chemical & Solvent Free</h3>
              <p className="text-xs text-cream-300 leading-relaxed">
                We forbid refineries. No bleaching clays, hexane washes, chemical deodorization steam or sulfur. Everything is crushed, cold wood-pressed, or hand harvested pure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: VEDIC BLOG INSIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gold-600 font-bold block">HARIANA CHRONICLES & REMEDIES</span>
          <h2 className="text-3xl font-serif font-bold text-forest-900 tracking-tight">Ancient Health Chronicles</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {blogs.slice(0, 3).map((blog) => (
            <div
              key={blog.id}
              onClick={() => onNavigate("blog")}
              className="bg-white rounded-2xl overflow-hidden border border-cream-300 shadow-sm hover:shadow-xl group cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="aspect-video overflow-hidden bg-stone-100 relative">
                <img src={blog.image} referrerPolicy="no-referrer" alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 duration-500" />
                <span className="absolute top-3 left-3 bg-forest-900 text-gold-500 text-[9px] uppercase font-mono tracking-wider font-bold px-2 py-0.5 rounded shadow">
                  {blog.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[10px] text-gray-400 font-mono block">{blog.date} • {blog.readTime}</span>
                  <h3 className="font-serif font-bold text-sm text-forest-900 line-clamp-2 hover:text-forest-700 duration-150">
                    {blog.title}
                  </h3>
                  <p className="text-[11.5px] text-gray-500 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-150 text-[10px] font-mono uppercase tracking-wider font-bold text-forest-900">
                  <span>Author: {blog.author}</span>
                  <span className="flex items-center gap-1 hover:text-emerald-800">
                    <span>Inspect article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: INSTAGRAM ARTWORK GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[9px] font-mono tracking-widest text-gold-600 block uppercase font-bold">@HARIANAORGANICFARM</span>
          <h2 className="text-xl font-serif font-bold text-forest-900 flex items-center justify-center gap-2">
            <Instagram className="w-5 h-5 text-gold-500" />
            <span>Sights of Ancient Village Life</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=300",
            "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300",
            "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=300",
            "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=300",
            "https://images.unsplash.com/photo-1622484211140-7e1329d47917?auto=format&fit=crop&q=80&w=300",
            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300"
          ].map((url, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-stone-100 rounded-xl relative group cursor-pointer border border-cream-300">
              <img src={url} referrerPolicy="no-referrer" alt="Life at farm" className="w-full h-full object-cover group-hover:scale-105 duration-500" />
              <div className="absolute inset-0 bg-forest-950/25 opacity-0 group-hover:opacity-100 duration-200 flex items-center justify-center text-cream-100">
                <Instagram className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: FOOTER WRARP */}
      <footer className="bg-forest-900 text-cream-100 rounded-3xl p-8 md:p-12 border-t border-gold-500/10 space-y-8 max-w-7xl mx-auto border-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-forest-850 to-forest-950 opacity-95"></div>
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600')] bg-cover"></div>
        
        {/* Core elements of footer */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sprout className="w-6 h-6 text-gold-500" />
              <h3 className="font-serif font-bold text-lg text-white">Hariana Organic Farm</h3>
            </div>
            <p className="text-xs text-cream-300 leading-relaxed font-sans max-w-[240px]">
              Sustaining ancestral traditions, Vedic bilona churning rituals, and wood-pressed organic wellness oils for modern high-profile families.
            </p>
          </div>

          <div className="space-y-3 font-sans">
            <h4 className="text-gold-500 font-serif font-black text-xs uppercase tracking-wider">Premium Collections</h4>
            <ul className="space-y-2 text-xs text-cream-300 select-none">
              <li><button onClick={() => onNavigate("shop")} className="hover:text-gold-500">Traditional Bilona Ghee</button></li>
              <li><button onClick={() => onNavigate("shop")} className="hover:text-gold-500">Unfiltered Wildflower Honey</button></li>
              <li><button onClick={() => onNavigate("shop")} className="hover:text-gold-500">Wood Kolhu pressed oils</button></li>
              <li><button onClick={() => onNavigate("shop")} className="hover:text-gold-500">Sulfur-Free Sugarcane Sweets</button></li>
            </ul>
          </div>

          <div className="space-y-3 font-sans">
            <h4 className="text-gold-500 font-serif font-black text-xs uppercase tracking-wider">Helpful Chronicles</h4>
            <ul className="space-y-2 text-xs text-cream-300 select-none">
              <li><button onClick={() => onNavigate("about")} className="hover:text-gold-500">Ancestral farming methods</button></li>
              <li><button onClick={() => onNavigate("blog")} className="hover:text-gold-500">Vedic Bilona Chronicles</button></li>
              <li><button onClick={() => onNavigate("contact")} className="hover:text-gold-500">Wholesale / Special Events</button></li>
              <li><button onClick={() => onNavigate("profile")} className="hover:text-gold-500">My Farm Order History</button></li>
            </ul>
          </div>

          <div className="space-y-3 font-sans">
            <h4 className="text-gold-500 font-serif font-black text-xs uppercase tracking-wider">The Village Office</h4>
            <p className="text-xs text-cream-200">
              Hariana Heritage Farms, Sector 12, Jhajjar Road, Jhajjar, Haryana (124103).
            </p>
            <p className="text-xs text-cream-350">
              Email: contact@harianaorganic.com <br />
              Vaidya Direct: +91 98123 45678
            </p>
            <div className="flex gap-4 pt-1">
              <a href="https://instagram.com" className="text-cream-300 hover:text-gold-500"><Instagram className="w-5 h-5" /></a>
              <a href="https://whatsapp.com" className="text-cream-300 hover:text-gold-500"><MessageSquare className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-6 text-center text-[10px] text-cream-300/60 font-mono tracking-wide">
          © {new Date().getFullYear()} Hariana Organic Farm & Wellness. Certified Ayurvedic Sourcing. Traditional Bilona Churned. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
