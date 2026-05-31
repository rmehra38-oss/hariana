import { useState } from "react";
import { BlogPost } from "../types";
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Share2, Sparkles } from "lucide-react";

interface BlogProps {
  blogs: BlogPost[];
}

export default function Blog({ blogs }: BlogProps) {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [blogCategory, setBlogCategory] = useState<string>("All");
  const [wisdomCopied, setWisdomCopied] = useState(false);

  const categories = ["All", "Cow Ghee", "Natural Honey", "Wood Ghani", "Ayurvedic Science"];

  const filteredBlogs = blogs.filter((b) => {
    if (blogCategory === "All") return true;
    return b.category.toLowerCase() === blogCategory.toLowerCase();
  });

  return (
    <div id="blog-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      
      {/* Detail overlay if a specific post is loaded */}
      {selectedBlog ? (
        <article className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden border border-cream-300 shadow-xl p-6 md:p-10 space-y-8 animate-in zoom-in-95 duration-250">
          <button
            onClick={() => setSelectedBlog(null)}
            className="flex items-center gap-1.5 text-xs font-serif font-bold text-forest-900 pb-2 border-b w-fit hover:text-forest-750 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Chronicles archives</span>
          </button>

          {/* Banner Graphic */}
          <div className="aspect-video rounded-2xl overflow-hidden bg-stone-100 border relative">
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-4 left-4 bg-forest-900 text-gold-500 font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              {selectedBlog.category}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-center text-xs text-gray-400 font-mono pb-2 border-b">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {selectedBlog.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> By {selectedBlog.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedBlog.readTime}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-black text-forest-950 tracking-tight leading-tight">
              {selectedBlog.title}
            </h1>
            
            <p className="text-xs text-gray-500 italic font-semibold border-l-4 border-gold-500 pl-4">
              “{selectedBlog.excerpt}”
            </p>
          </div>

          {/* Body Content */}
          <div className="text-xs text-forest-850 leading-relaxed font-sans space-y-4 whitespace-pre-line border-t pt-6 bg-stone-50/50 p-6 rounded-2xl">
            {selectedBlog.content}
          </div>

          <div className="flex justify-between items-center bg-forest-900 text-cream-100 p-4 rounded-xl border border-gold-500/20 text-xs">
            <p className="font-serif">Verified Organic Farmer Chronicles • Pure Ayurveda</p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setWisdomCopied(true);
                setTimeout(() => setWisdomCopied(false), 2500);
              }}
              className="flex items-center gap-1.5 hover:text-gold-400 font-serif font-bold text-[10px] uppercase tracking-widest transition-colors"
            >
              <Share2 className="w-4 h-4 text-gold-500" />
              <span>{wisdomCopied ? "Wisdom Link Copied!" : "Share Wisdom"}</span>
            </button>
          </div>
        </article>
      ) : (
        <>
          {/* Main List view */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-widest uppercase text-gold-600 font-bold block">
              VEDIC CHRONICLES & REMEDIES
            </span>
            <h1 className="text-3xl font-serif font-bold text-forest-900 tracking-tight">Ancient Health Chronicles</h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              Explore documented practices on bilona churning rituals, chemical-free wooden cold pressing techniques, and wholesome dietary habits written by verified Ayurvedic experts.
            </p>
          </div>

          {/* Horizontal Category Pill buttons */}
          <div className="flex gap-2 justify-center pb-2 overflow-x-auto select-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setBlogCategory(cat)}
                className={`text-[10px] uppercase font-serif tracking-widest px-4 py-2 rounded-full border transition-all cursor-pointer ${
                  blogCategory === cat
                    ? "bg-forest-900 border-forest-950 text-gold-500 shadow-md font-bold"
                    : "bg-white hover:bg-stone-50 border-gray-200 text-gray-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBlog(b)}
                className="bg-white rounded-3xl overflow-hidden border border-cream-300 shadow-sm hover:shadow-xl group cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="aspect-video overflow-hidden bg-stone-100 relative">
                  <img
                    src={b.image}
                    alt={b.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-forest-900 text-gold-500 text-[9px] uppercase font-mono tracking-wider font-bold px-3 py-1 rounded shadow">
                    {b.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 font-mono block">
                      {b.date} • {b.readTime}
                    </span>
                    <h3 className="font-serif font-semibold text-base text-forest-950 line-clamp-2 leading-snug hover:text-forest-750 duration-150">
                      {b.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed font-sans">
                      {b.excerpt}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-cream-300/30 text-[10px] font-mono uppercase tracking-wider font-bold text-forest-900">
                    <span>By {b.author}</span>
                    <span className="flex items-center gap-1 group-hover:text-gold-600 duration-150">
                      <span>Read article</span>
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Callout banner */}
          <div className="bg-forest-900 text-cream-100 rounded-3xl p-8 border border-gold-500/20 grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 opacity-15 bg-[url('/src/assets/images/haryana_farms_1780232128905.png')] bg-cover bg-center"></div>
            
            <div className="md:col-span-8 space-y-1.5 relative z-10">
              <h3 className="font-serif font-black text-lg text-white">Subscribe to Ayurveda Circular</h3>
              <p className="text-xs text-cream-300">
                Receive traditional organic farming updates, season-specific diets (Ritu Charya) and special promo launches in your email box twice monthly.
              </p>
            </div>

            <div className="md:col-span-4 relative z-10 flex gap-2">
              <input
                type="email"
                placeholder="your.email@gmail.com"
                className="bg-forest-950 border border-white/10 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:border-gold-500 text-white w-full"
              />
              <button className="bg-gold-500 text-forest-950 font-serif text-[10px] uppercase font-bold px-4 rounded-xl shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
