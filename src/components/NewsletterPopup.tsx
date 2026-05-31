import React, { useState, useEffect } from "react";
import { X, Sparkles, Mail, CheckCircle } from "lucide-react";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Show popup after 4 seconds if not dismissed previously
    const isDismissed = sessionStorage.getItem("hariana_newsletter_dismissed");
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("hariana_newsletter_dismissed", "true");
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      handleDismiss();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div id="newsletter-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/65 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-cream-100 text-forest-950 rounded-2xl overflow-hidden max-w-[500px] w-full shadow-2xl border border-gold-500/20 relative animate-in zoom-in-95 duration-300">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-full text-forest-900/60 hover:text-forest-900 hover:bg-forest-900/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Illustration Background */}
        <div className="bg-forest-900 text-cream-100 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('/src/assets/images/haryana_farms_1780232128905.png')] bg-cover bg-center"></div>
          <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-3 animate-bounce" />
          <p className="text-gold-500 font-mono text-[10px] tracking-widest uppercase mb-1">HARIANA ORGANIC ESSENTIALS</p>
          <h3 className="text-2xl font-serif font-semibold tracking-tight text-white mb-2">Claim Your ₹150 Voucher</h3>
          <p className="text-xs text-cream-300 max-w-[320px] mx-auto leading-relaxed">
            Join our inner circle for weekly Ayurvedic nutrition insights, traditional medicinal recipe launches, and boutique farm discounts.
          </p>
        </div>

        <div className="p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-forest-900/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for blessings"
                  className="w-full bg-white text-forest-950 text-xs pl-10 pr-4 py-3.5 rounded-xl border border-forest-900/10 focus:border-gold-500 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-forest-900 hover:bg-forest-950 text-gold-400 hover:text-gold-500 font-serif tracking-widest text-xs uppercase py-3.5 rounded-xl shadow-lg transition-all font-semibold hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                Access Organic Voucher
              </button>

              <p className="text-[10px] text-center text-forest-900/50">
                A2 Ghee is packed traditionally with zero chemicals. No spam. Unsubscribe at any time.
              </p>
            </form>
          ) : (
            <div className="text-center py-6 space-y-3 animate-in fade-in duration-300">
              <CheckCircle className="w-12 h-12 text-emerald-700 mx-auto" />
              <h4 className="font-serif text-lg font-semibold text-forest-900">Ayurvedic Code Unlocked!</h4>
              <p className="text-xs text-forest-850">
                Welcome, seeker of pure wellness. We have sent the code <span className="font-mono text-gold-600 font-bold bg-gold-500/10 px-2 py-0.5 rounded">HARIANA150</span> to your inbox. Enjoy!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
