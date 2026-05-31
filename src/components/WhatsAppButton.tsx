import { useState } from "react";
import { MessageSquare, Calendar, ShieldCheck, X } from "lucide-react";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  // pre-filled message for premium client support
  const defaultMsg = encodeURIComponent(
    "Namaste Hariana Farm Team, I am looking to consult on traditional Vedic Bilona A2 Ghee and Wild Forest Honey for my family's Ayurvedic wellness. Please assist."
  );
  const waUrl = `https://wa.me/919812345678?text=${defaultMsg}`;

  return (
    <div id="whatsapp-support" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      {isOpen && (
        <div className="bg-cream-100 text-forest-950 rounded-2xl p-5 shadow-2xl border border-gold-500/30 max-w-[320px] animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between border-b border-forest-900/10 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-700 text-white rounded-full relative">
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight text-forest-900">Hariana Farm Consult</h4>
                <p className="text-[11px] text-emerald-800 font-medium">Online • Pure Ayurvedic Support</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-forest-900/50 hover:text-forest-900 duration-150"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-forest-850 leading-relaxed mb-4">
            Namaste. Speak directly to our traditional vaidyas and organic farming leads about Bilona processes or custom monthly deliveries.
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-cream-100 font-medium py-2.5 px-4 rounded-xl text-xs shadow-md shadow-emerald-950/20 duration-150 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            Start Wellness Consult
          </a>

          <div className="flex items-center gap-1.5 mt-3 pt-2 text-[10px] text-forest-900/60 border-t border-forest-900/5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
            <span>100% Certified Organic & Ayurvedic Sourced</span>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-800 hover:bg-emerald-900 text-gold-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-gold-500/20 group cursor-pointer"
        aria-label="Contact support on WhatsApp"
      >
        <MessageSquare className="w-7 h-7 text-cream-100 group-hover:rotate-12 duration-300" />
      </button>
    </div>
  );
}
