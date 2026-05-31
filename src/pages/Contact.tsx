import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle, Sparkles, Sprout, Send } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consultNeeded, setConsultNeeded] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setAlertMsg("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, consultNeeded })
      });

      if (response.ok) {
        setAlertMsg("✨ Thank you! Your pure inquiry is registered. Our Vaidya team will reply within 12 hours.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error("API submit error");
      }
    } catch (err) {
      console.error(err);
      setAlertMsg("❌ System offline. Please contact directly via Vaidya phone.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="contact-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans animate-in fade-in duration-300">
      
      {/* Intro section */}
      <div className="text-center space-y-2 max-w-2xl mx-auto pb-4">
        <span className="text-[10px] font-mono tracking-widest uppercase text-gold-600 font-bold block">
          WELLNESS CONSULTATIONS & DIALOGUES
        </span>
        <h1 className="text-3xl font-serif font-bold text-forest-900 tracking-tight">Consult with our Traditional Farm</h1>
        <p className="text-xs text-gray-500 leading-relaxed font-sans">
          Need guidance on choosing between A2 Gir Cow Ghee, Buffalo Ghee or Saffron honey? Send your queries or wholesale requests, and our on-farm Ayurvedic practitioners will guide you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Info Column (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-forest-900 text-cream-100 rounded-3xl p-6 md:p-8 space-y-6 border border-gold-500/20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[url('/src/assets/images/haryana_farms_1780232128905.png')] bg-cover bg-center"></div>
            
            <div className="space-y-1 relative z-10">
              <h3 className="font-serif font-black text-lg text-white">Direct Sourcing Office</h3>
              <p className="text-xs text-cream-300">Reach the farmers directly for verified traditional purities.</p>
            </div>

            <div className="space-y-4 pt-2 relative z-10 text-xs">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0" />
                <div>
                  <p className="font-semibold text-white">The Hariana Farm Homestead</p>
                  <p className="text-cream-300 mt-0.5">Gate No. 2, Jhajjar Road, Jhajjar, Haryana (124103), India.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Vaidya Direct Hotline</p>
                  <p className="text-cream-300 mt-0.5">+91 98123 45678 (WhatsApp Support Enabled)</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Electronic Sourcing Inquiries</p>
                  <p className="text-cream-300 mt-0.5">contact@harianaorganic.com</p>
                </div>
              </div>
            </div>

            {/* Ayurvedic advice quote */}
            <div className="p-4 bg-forest-950/45 rounded-2xl border border-white/5 space-y-2 relative z-10">
              <p className="text-[11px] font-mono font-bold text-gold-450 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>RITU CHARYA CONSULTATION</span>
              </p>
              <p className="text-[10px] text-cream-300 leading-relaxed font-sans">
                For seasonal bulk orders (such as fresh sugarcane blocks or specific herbal saffron ghees harvested during precise astronomical constellations), pre-orders must be completed at least 3 months in advance.
              </p>
            </div>
          </div>
        </div>

        {/* Form Column (Right) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-cream-300 shadow-sm p-6 md:p-8 space-y-6">
          <h3 className="font-serif font-bold text-lg text-forest-950">Record Your Inquiry / Request</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seema Sharma"
                  className="w-full bg-stone-50 border p-3 rounded-xl focus:outline-none focus:border-gold-500 text-xs text-forest-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">Electronic Mail Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seema.sharma@gmail.com"
                  className="w-full bg-stone-50 border p-3 rounded-xl focus:outline-none focus:border-gold-500 text-xs text-forest-950"
                />
              </div>
            </div>

            <div className="space-y-1 font-sans text-xs">
              <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">Your Inquiry / Message Details</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Indicate your health objectives, digestive fires, specific items, or if you seek a bespoke ghee subscription schedule..."
                className="w-full bg-stone-50 border p-3 rounded-xl focus:outline-none focus:border-gold-500 text-xs text-forest-950"
              ></textarea>
            </div>

            <div className="p-3.5 bg-emerald-950/5 rounded-xl border border-teal-850/10 flex items-center justify-between select-none font-sans">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="consult"
                  checked={consultNeeded}
                  onChange={(e) => setConsultNeeded(e.target.checked)}
                  className="accent-forest-900 rounded"
                />
                <label htmlFor="consult" className="text-xs font-semibold text-forest-900 cursor-pointer">
                  Request direct response from on-farm Ayurvedic practitioner
                </label>
              </div>
              <Sprout className="w-5 h-5 text-emerald-800 shrink-0" />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-forest-900 hover:bg-forest-950 text-gold-500 font-serif uppercase tracking-widest text-xs font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Documenting in village logs..." : "Submit Wholesome Inquiry"}</span>
            </button>

            {alertMsg && (
              <div className="bg-emerald-50 text-emerald-800 border-2 border-emerald-300 p-4 rounded-xl text-center text-xs font-bold animate-pulse">
                {alertMsg}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
