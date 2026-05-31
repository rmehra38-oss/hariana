import { Sprout, Award, Shovel, MapPin, Heart, ShieldAlert } from "lucide-react";

export default function About() {
  const statistics = [
    { label: "Village Families Supported", value: "115+" },
    { label: "Native Bovines (Gir/Haryana)", value: "240+" },
    { label: "Eco-Preservation Acres", value: "320" },
    { label: "Ancestral Family Generations", value: "3" }
  ];

  return (
    <div id="about-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans animate-in fade-in duration-300">
      
      {/* Cinematic Banner Intro */}
      <section className="bg-forest-900 text-cream-100 p-8 md:p-14 rounded-3xl border border-gold-500/20 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=700')] bg-cover"></div>
        
        <div className="md:col-span-8 space-y-4 relative z-10">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400 font-bold block">SINCE 1982 CHRONICLES</span>
          <h1 className="text-3xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight">
            A Heritage Sourced on <span className="text-gold-500 italic block">Truth & Ancestral Devotion</span>
          </h1>
          <p className="text-xs text-cream-300 max-w-2xl leading-relaxed">
            Hariana Organic Farm is not simply a business enterprise; it is our ancestral homestead. Over three generations, our clan has rejected synthetic fertilizers and heavy mechanical steel separators to safeguard the core healing tenets of true Ayurveda.
          </p>
        </div>

        <div className="md:col-span-4 relative z-10 flex justify-center">
          <div className="w-28 h-28 rounded-full border-2 border-gold-500/30 flex items-center justify-center bg-forest-950 p-2 text-center text-gold-500">
            <div>
              <p className="font-serif font-black text-2xl leading-none">100%</p>
              <p className="text-[8px] uppercase tracking-wider font-mono text-cream-300 mt-1">Vedic Genuinity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative grid (Village Sourcing + Gir Pastures) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-gold-600 block">THE BILONA MANDATE</span>
            <h2 className="text-3xl font-serif font-bold text-forest-900 tracking-tight leading-tight">Bi-churning with wooden rods. No high-speed metallurgy.</h2>
          </div>

          <p className="text-xs text-forest-850 leading-relaxed font-sans">
            Have you ever wondered why factory-packaged ghee smells flat and uniform? It's because mechanical steel separators spin at high RPMs, generating high-friction heat that breaks the biological enzyme bindings of the butterfats.
          </p>
          <p className="text-xs text-forest-850 leading-relaxed font-sans">
            Our cows—predominantly grass-fed native Gir and Haryana breeds—are treated as relatives. The milk is boiled gently over slow firewood, turned into wholesome curd overnight, and bi-churned bidirectionally at sunrise using ancient neem-wood cylinders. This creates the precious golden granular texture and nutty fragrance mentioned in early texts.
          </p>
          <p className="text-xs text-forest-850 leading-relaxed font-sans">
            Similarly, our wild mustard, sesame, and yellow mustard seeds are cold-pressed gently inside wood-framed compact mills (*wooden kolhu ghani*), completely bypassing heat-treatment or extraction solvents.
          </p>

          <div className="p-4 bg-emerald-950/5 rounded-2xl border flex items-start gap-3">
            <Award className="w-5 h-5 text-emerald-800 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-serif font-bold text-forest-900">Ayurvedic Verification Seal</p>
              <p className="text-[11px] text-gray-550 leading-relaxed">Our processes are checked and verified to align with Vedic specifications, ensuring maximum digestive Agni and high Ojas properties.</p>
            </div>
          </div>
        </div>

        <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-xl border border-cream-300">
          <img
            src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600"
            alt="Organic Indian cattle care"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* Numeric Highlights section */}
      <section className="bg-cream-100 rounded-3xl p-8 border border-cream-300/40 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center shadow-inner">
        {statistics.map((stat, i) => (
          <div key={i} className="space-y-1 font-sans">
            <p className="text-3xl md:text-4xl font-serif font-black text-forest-900">{stat.value}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Sourcing maps village locator block */}
      <section className="bg-forest-900 text-cream-100 rounded-3xl p-6 md:p-10 border border-gold-500/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=600')] bg-cover"></div>
        
        <div className="lg:col-span-8 space-y-4 relative z-10 font-sans">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gold-500 font-bold block flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gold-500" />
            <span>Map Coordinates: Jhajjar Village, Haryana</span>
          </span>
          <h3 className="font-serif font-bold text-2xl text-white">Ethical, Accountable, Traceable Sourcing</h3>
          <p className="text-xs text-cream-300 leading-relaxed">
            By avoiding large generic multi-brand collection houses, we trade directly with local village agricultural families in Jhajjar, Haryana. This guarantees complete quality control from fodder grazing to packaging, and ensures that premium income goes straight back to native soil farmers.
          </p>
        </div>

        <div className="lg:col-span-4 relative z-10 flex justify-center">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl w-full text-center space-y-3 font-mono text-xs">
            <p className="text-gold-500 font-black">VISITING THE SOIL</p>
            <p className="text-cream-300 text-[10px]">Hariana Heritage Farm Gate No.2, Jhajjar Road, Jhajjar, Haryana.</p>
            <p className="text-[10px] text-gray-400">Open for seekers & academic students by appointment.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
