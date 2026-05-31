import { useState, useRef, useEffect } from "react";
import { Sparkles, MessageSquare, Send, X, ShieldAlert, Heart, Sprout, ArrowRight } from "lucide-react";
import { Product } from "../types";

interface Message {
  role: "user" | "model";
  text: string;
}

interface AiAdvisorProps {
  onClose: () => void;
  products: Product[];
  onAddToCart: (prodId: string) => void;
  onQuickView: (product: Product) => void;
}

export default function AiAdvisor({ onClose, products, onAddToCart, onQuickView }: AiAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "### Namaste, seeker of natural wellness!\n\nI am **Acharya Shree**, your traditional wellness advisor at **Hariana Organic Farm**. \n\nTell me, are you looking to balance a specific bodily energy (*Dosha*), improve your daily energy levels, or need a wholesome Vedic culinary recipe incorporating our authentic Bilona Ghee or wild honey?\n\nSelect your *Dosha* or state your query below, and let us embark on your organic healing journey."
    }
  ]);
  const [selectedDosha, setSelectedDosha] = useState<string>("Unknown");
  const [chosenGoal, setChosenGoal] = useState<string>("General Wellness");
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const promo = (customPrompt || inputMsg).trim();
    if (!promo) return;

    const userMessage: Message = { role: "user", text: promo };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInputMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promo,
          chatHistory: messages,
          dosha: selectedDosha,
          healthGoal: chosenGoal
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        throw new Error("API call error");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I apologize, a temporary disturbance in the natural network energies occurred. Let us breathe deeply and try to query again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Golden Milk Recipe",
    "Ghee for gut fire (Agni)",
    "Which oils are wood-pressed?",
    "Balancing Pitta dosha"
  ];

  // Helper to extract product name from Acharya's advice and offer smart buy buttons
  const findMentionedProducts = (text: string) => {
    return products.filter((p) => {
      const pNameShort = p.name.split(" ")[0].toLowerCase();
      const pFullName = p.name.toLowerCase();
      return text.toLowerCase().includes(pFullName) || text.toLowerCase().includes(pNameShort);
    });
  };

  const lastModelMsg = [...messages].reverse().find((m) => m.role === "model");
  const matchedProducts = lastModelMsg ? findMentionedProducts(lastModelMsg.text) : [];

  return (
    <div id="ai-advisor-sidebar" className="fixed inset-y-0 right-0 z-50 w-full max-w-[500px] bg-cream-100 shadow-2xl border-l border-gold-500/10 flex flex-col justify-between font-sans animate-in slide-in-from-right duration-300">
      
      {/* Header section */}
      <div className="bg-forest-900 text-cream-100 p-5 border-b border-gold-500/25 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600')] bg-cover"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500 flex items-center justify-center text-gold-400">
              <Sprout className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base tracking-wide text-white flex items-center gap-1.5">
                <span>Acharya Shree</span>
                <span className="text-[9px] uppercase font-mono bg-gold-500 text-forest-950 px-1.5 py-0.5 rounded leading-none font-bold">Ayurvedic AI</span>
              </h3>
              <p className="text-[10px] text-cream-300">Hariana Farm Traditional Wellness Advisor</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-cream-100">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ayurvedic Configurator Panel */}
      <div className="bg-cream-200/50 p-4 border-b border-forest-900/5 grid grid-cols-2 gap-3 text-xs">
        {/* Dosha Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-forest-800 uppercase tracking-widest font-bold">Personal Dosha</label>
          <select
            value={selectedDosha}
            onChange={(e) => setSelectedDosha(e.target.value)}
            className="w-full bg-white p-2.5 rounded-xl border border-forest-900/10 focus:outline-none focus:border-gold-500 font-medium"
          >
            <option value="Unknown">Don't Know / Unbalanced</option>
            <option value="Vata">Vata (Wind & Space)</option>
            <option value="Pitta">Pitta (Fire & Water)</option>
            <option value="Kapha">Kapha (Earth & Water)</option>
          </select>
        </div>

        {/* Health goals */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-forest-800 uppercase tracking-widest font-bold">Wellness Focus</label>
          <select
            value={chosenGoal}
            onChange={(e) => setChosenGoal(e.target.value)}
            className="w-full bg-white p-2.5 rounded-xl border border-forest-900/10 focus:outline-none focus:border-gold-500 font-medium"
          >
            <option value="General Wellness">General Family Vitality</option>
            <option value="Digestion">Digestive Agni Fire</option>
            <option value="Energy & Joints">Joint Care & Muscle Strength</option>
            <option value="Immunity">Ojas / High Immunity</option>
          </select>
        </div>
      </div>

      {/* Conversations Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-stone-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <span className="text-[9px] font-mono uppercase tracking-widest mb-1 text-gray-400">
              {msg.role === "user" ? "My Inquiry" : "Acharya Shree"}
            </span>
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-[12px] leading-relaxed shadow-sm font-sans ${
                msg.role === "user"
                  ? "bg-forest-900 text-cream-100 rounded-tr-none"
                  : "bg-white text-forest-950 border border-cream-300/40 rounded-tl-none whitespace-pre-wrap"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-forest-800/60 font-medium italic animate-pulse">
            <Sprout className="w-4 h-4 animate-spin text-gold-500" />
            <span>Chanting recipes and consulting scriptures...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Products Panel (Appears dynamically if matched) */}
      {matchedProducts.length > 0 && !loading && (
        <div className="bg-cream-200/80 p-4 border-t border-forest-900/5 space-y-2.5 animate-in slide-in-from-bottom duration-300">
          <p className="text-[10px] font-mono text-forest-700 tracking-wider flex items-center gap-1 uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-spin-slow" />
            <span>Recommended Botanical Remedies</span>
          </p>
          <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
            {matchedProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-xl p-3 border border-cream-300/50 flex justify-between items-center gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={p.image} referrerPolicy="no-referrer" alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0 bg-cream-100" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-forest-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono">₹{p.salePrice || p.price} • {p.weight}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => onQuickView(p)} className="text-[9px] px-2.5 py-1.5 border border-forest-900/10 text-forest-900 hover:bg-forest-900/5 rounded-lg font-serif">
                    Details
                  </button>
                  <button onClick={() => onAddToCart(p.id)} className="text-[9px] px-3 py-1.5 bg-forest-900 text-gold-500 hover:text-gold-400 rounded-lg font-bold">
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Action and suggest queries panel */}
      <div className="bg-white p-4 border-t border-forest-900/10 space-y-3 relative z-10">
        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="text-[10px] bg-cream-200/80 hover:bg-forest-900 hover:text-gold-300 border border-cream-300/40 text-forest-900 px-3 py-1.5 rounded-full shrink-0 font-medium active:scale-95 duration-100"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            required
            disabled={loading}
            placeholder="Pitta pacifying lifestyle? Recipe for A2 Ghee..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-cream-100 text-forest-950 text-xs px-4 py-3 rounded-xl focus:ring-1 focus:ring-gold-500 focus:outline-none focus:bg-white border border-forest-900/10 focus:border-gold-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputMsg.trim()}
            className="w-11 h-11 bg-forest-900 hover:bg-forest-950 text-gold-500 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[9px] text-center text-gray-400">
          * Ayurvedic advice is educational. Always align with a licensed medical practitioner.
        </p>
      </div>
    </div>
  );
}
