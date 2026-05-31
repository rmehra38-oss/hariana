import { useState, useEffect } from "react";
import { X, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Exit intent detection for desktops
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("hariana_exit_intent_shown", "true");
      }
    };

    // Check if shown in current session
    const shown = sessionStorage.getItem("hariana_exit_intent_shown");
    if (shown) {
      setHasShown(true);
    } else {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div id="exit-intent-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/65 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-cream-100 text-forest-950 rounded-2xl overflow-hidden max-w-[480px] w-full shadow-2xl border-2 border-gold-500/30 relative animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-full text-forest-900/60 hover:text-forest-900 hover:bg-forest-900/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto border border-gold-500/30">
            <ShoppingBag className="w-8 h-8 text-gold-500 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-gold-600 font-bold">WAIT, PURE SOUL!</span>
            <h3 className="text-2xl font-serif font-bold text-forest-900 leading-tight">Divine Nutrition Awaits You</h3>
            <p className="text-xs text-forest-850 leading-relaxed max-w-[340px] mx-auto">
              Do not walk away from centuries-old traditional healing. Take a step towards Vedic health today with an exclusive gift.
            </p>
          </div>

          {/* Golden Promo box */}
          <div className="bg-forest-900 text-cream-100 rounded-2xl p-5 border border-gold-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-at-t from-forest-850 to-forest-950 opacity-90"></div>
            <div className="relative z-10 space-y-1.5Packed">
              <p className="text-[10px] text-gold-400 font-mono tracking-widest uppercase">EXCLUSIVE RETURNING GIFT</p>
              <h4 className="text-xl font-serif font-semibold text-white">Save 15% Instantly</h4>
              <p className="text-xs text-cream-300">Apply this sacred discount code at the checkout desk:</p>
              <div className="mt-2 inline-block">
                <span className="font-mono text-gold-500 font-bold text-sm tracking-wider border-2 border-dashed border-gold-500 bg-gold-500/10 px-4 py-1.5 rounded-lg select-all">
                  PUREHEALTH
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleClose}
              className="group inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-950 text-gold-500 hover:text-gold-400 py-3.5 px-8 rounded-xl text-xs font-serif tracking-widest uppercase w-full font-semibold transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-[9px] text-forest-900/40">
            * This offer is valid across our entire catalog of cold-churned Bilona Ghees, raw honeys, and spices.
          </p>
        </div>
      </div>
    </div>
  );
}
