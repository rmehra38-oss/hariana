import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const announcements = [
    {
      text: "Vedic Bilona Ghee: Sourced from Native Gir & Haryana Cows. Traditional Churned Process.",
      icon: <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
    },
    {
      text: "Free Premium Cold-Chain Shipping across India on orders above ₹1000!",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
    },
    {
      text: "Pure Ayurvedic Healing: Use code BILONA20 for 20% off on traditional assortments.",
      icon: <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div id="announcement-bar" className="bg-forest-950 text-cream-100 text-xs py-2 px-4 border-b border-forest-800/50 transition-all duration-500 overflow-hidden relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-2 transition-all duration-500 transform font-sans tracking-wide">
          {announcements[currentIndex].icon}
          <span className="font-medium text-center">{announcements[currentIndex].text}</span>
        </div>
      </div>
    </div>
  );
}
