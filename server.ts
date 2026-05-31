import express from "express";
import path from "path";
import dns from "dns";
import { db } from "./server-db";
import { GoogleGenAI } from "@google/genai";

// Ensure localhost or general DNS works nicely
dns.setDefaultResultOrder && dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // If key not configured, fallback or explain nicely, but never crash on startup lazily
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Products: Get List
app.get("/api/products", (req, res) => {
  let products = db.getProducts();

  // Search filter
  const search = req.query.search as string;
  if (search) {
    const s = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.tagline.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s)
    );
  }

  // Category filter
  const category = req.query.category as string;
  if (category && category !== "all") {
    products = products.filter((p) => p.category === category);
  }

  // Price filter
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : null;
  if (maxPrice !== null && !isNaN(maxPrice)) {
    products = products.filter((p) => (p.salePrice || p.price) <= maxPrice);
  }

  // Sorting
  const sort = req.query.sort as string;
  if (sort) {
    if (sort === "price-asc") {
      products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sort === "price-desc") {
      products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sort === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === "bestseller") {
      products.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
  }

  res.json(products);
});

// Products: Get Single
app.get("/api/products/:id", (req, res) => {
  const prod = db.getProduct(req.params.id);
  if (!prod) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(prod);
});

// Products: CREATE (Admin)
app.post("/api/products", (req, res) => {
  const { name, tagline, description, category, price, salePrice, image, images, stock, weight, bilonaProcess, benefits, ingredients, storage, isBestseller, subscriptionAvailable } = req.body;
  
  if (!name || !category || !price) {
    return res.status(400).json({ error: "Missing required product details" });
  }

  const newProd = {
    id: "prod_" + Date.now(),
    name,
    tagline: tagline || "Direct from Heritage Farms",
    description,
    category,
    price: Number(price),
    salePrice: salePrice ? Number(salePrice) : undefined,
    image: image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
    images: images && images.length ? images : [image],
    rating: 5.0,
    reviewsCount: 0,
    reviews: [],
    stock: stock ? Number(stock) : 10,
    weight: weight || "500g",
    bilonaProcess: !!bilonaProcess,
    benefits: benefits || [],
    ingredients: ingredients || "Pure Organic Ingredient",
    storage: storage || "Store in room temperature away from moisture",
    featured: true,
    isBestseller: !!isBestseller,
    subscriptionAvailable: !!subscriptionAvailable
  };

  db.saveProduct(newProd);
  res.status(201).json(newProd);
});

// Products: UPDATE (Admin)
app.put("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const existing = db.getProduct(id);
  if (!existing) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updated = {
    ...existing,
    ...req.body,
    price: req.body.price ? Number(req.body.price) : existing.price,
    salePrice: req.body.salePrice === "" ? undefined : (req.body.salePrice ? Number(req.body.salePrice) : existing.salePrice),
    stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock
  };

  db.saveProduct(updated);
  res.json(updated);
});

// Products: DELETE (Admin)
app.delete("/api/products/:id", (req, res) => {
  db.deleteProduct(req.params.id);
  res.json({ success: true });
});

// Categories: List
app.get("/api/categories", (req, res) => {
  res.json(db.getCategories());
});

// Blogs: List
app.get("/api/blogs", (req, res) => {
  res.json(db.getBlogs());
});

// Blogs: Create (Admin)
app.post("/api/blogs", (req, res) => {
  const { title, excerpt, content, readTime, image, tags, category, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  const newBlog = {
    id: "blog_" + Date.now(),
    title,
    excerpt: excerpt || content.substring(0, 150) + "...",
    content,
    readTime: readTime || "5 mins read",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    author: author || "Hariana Wellness Lead",
    image: image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
    tags: tags || ["Organic", "Health"],
    category: category || "Organic Life"
  };
  db.saveBlog(newBlog);
  res.status(201).json(newBlog);
});

// Blogs: Delete (Admin)
app.delete("/api/blogs/:id", (req, res) => {
  db.deleteBlog(req.params.id);
  res.json({ success: true });
});

// Coupons: List
app.get("/api/coupons", (req, res) => {
  res.json(db.getCoupons());
});

// Coupons: Create (Admin)
app.post("/api/coupons", (req, res) => {
  const { code, discountPercentage, minOrderAmount, description } = req.body;
  if (!code || !discountPercentage) {
    return res.status(400).json({ error: "Code and percentage required" });
  }
  const newCoupon = {
    code: code.toUpperCase().trim(),
    discountPercentage: Number(discountPercentage),
    minOrderAmount: Number(minOrderAmount || 0),
    description: description || `Save ${discountPercentage}% on your order!`,
    active: true
  };
  db.saveCoupon(newCoupon);
  res.status(201).json(newCoupon);
});

// Coupons: Delete (Admin)
app.delete("/api/coupons/:code", (req, res) => {
  db.deleteCoupon(req.params.code);
  res.json({ success: true });
});

// Orders: Create (Check out)
app.post("/api/orders", (req, res) => {
  const { userId, customerName, customerEmail, items, subtotal, couponCode, discount, shipping, total, paymentMethod, shippingAddress, notes } = req.body;
  
  if (!customerName || !customerEmail || !items || !items.length || !shippingAddress) {
    return res.status(400).json({ error: "Required fields missing for placing order" });
  }

  const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
  const newOrder = {
    id: orderId,
    userId: userId || "user_customer",
    customerName,
    customerEmail,
    items,
    subtotal: Number(subtotal),
    couponCode,
    discount: Number(discount || 0),
    shipping: Number(shipping || 0),
    total: Number(total),
    status: "pending" as const,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "pending" as const : "paid" as const,
    shippingAddress,
    date: new Date().toISOString(),
    trackingCode: "TRAK-HRI-" + Math.floor(10000 + Math.random() * 90000),
    notes
  };

  db.saveOrder(newOrder);

  // Reduce inventory stock
  const allProds = db.getProducts();
  items.forEach((item: any) => {
    const prod = allProds.find(p => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
      db.saveProduct(prod);
    }
  });

  res.status(201).json(newOrder);
});

// Orders: List All (Admin or User specific)
app.get("/api/orders", (req, res) => {
  const email = req.query.email as string;
  let oList = db.getOrders();
  if (email) {
    oList = oList.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
  }
  // Sort by date descending
  oList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json(oList);
});

// Orders: Update Details / Status (Admin)
app.put("/api/orders/:id", (req, res) => {
  const order = db.getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  
  const { status, paymentStatus, trackingCode } = req.body;
  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (trackingCode !== undefined) order.trackingCode = trackingCode;

  db.saveOrder(order);
  res.json(order);
});

// Reviews: Create
app.post("/api/products/:id/review", (req, res) => {
  const { userName, rating, comment } = req.body;
  if (!userName || !rating || !comment) {
    return res.status(400).json({ error: "Missing review fields" });
  }

  const review = db.addProductReview(req.params.id, {
    userName,
    rating: Number(rating),
    comment
  });

  if (!review) {
    return res.status(404).json({ error: "Product not found to supplement review" });
  }

  res.status(201).json(review);
});

// Auth: Login / Simulation
app.post("/api/auth/login", (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  let user = db.getUserByEmail(email);
  if (!user) {
    // Dynamically auto-create user on first login so it is seamless
    const id = "user_" + Date.now();
    user = {
      id,
      name: name || email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      email: email.toLowerCase(),
      role: email === "rmehra38@gmail.com" || email.includes("admin") ? "admin" : "customer",
      addresses: []
    };
    db.saveUser(user);
  }

  res.json({ success: true, user });
});

// Auth: Update Profile Addresses
app.post("/api/auth/profile", (req, res) => {
  const { userId, addresses } = req.body;
  const users = db.getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.addresses = addresses;
  db.saveUser(user);
  res.json({ success: true, user });
});

// Contact Queries API
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const query = db.addContactQuery({ name, email, message });
  res.status(201).json(query);
});

app.get("/api/contact", (req, res) => {
  res.json(db.getContactQueries());
});

// Helper function to formulate response in case of external API issues (e.g. 503 Overload)
function getLocalAyurvedicResponse(prompt: string, dosha: string, healthGoal: string): string {
  const p = (prompt || "").toLowerCase();
  
  let reply = `### ✨ Namaste, Seeker of Wholesome Wellness!
  
Under our current elevated celestial alignments and network traffic demand, I, **Acharya Shree**, am offering custom wellness insights directly sourced from our ancient repository of Ayurvedic wisdom. Here is your personalized guidance:

`;

  if (p.includes("recipe") || p.includes("milk") || p.includes("golden")) {
    reply += `#### 🥛 Golden Ojas Milk Recipe (Ayurvedic Elixir)

To strengthen your digestive fire (*Agni*) and boost vitality (*Ojas*), prepare this soothing evening beverage:
1. **Heat Milk:** Warm 250ml of organic milk (cow or plant-based) in a brass pot.
2. **Add Spices:** Whisk in 1/2 tsp of *Organic Lakadong Turmeric* (famous for its high cumin/curcumin concentration), a pinch of black pepper (to activate turmeric absorptivity), and 1/4 tsp of crushed cardamom.
3. **The Vedic Touch:** Turn off the flame and stir in 1 tsp of our ancient **Premium Vedic A2 Gir Cow Ghee (Bilona)**.
4. **Sweetener:** Once the mixture is lukewarm, add 1 tsp of **Ethical Raw Wild Forest Honey** (never heat honey directly, as heated honey creates *Ama* or toxins).

**Recommended Product Integrations:**
* **Premium Vedic A2 Gir Cow Ghee (Bilona)** (500g, ₹899 or 1L, ₹1699) - Essential for joint lubrication and absorption of nutrients.
* **Ethical Raw Wild Forest Honey** (500g, ₹490) - Packed with raw antioxidants and enzymes.`;
  } else if (p.includes("ghee") || p.includes("bilona")) {
    reply += `#### 🧈 The Healing Properties of Vedic Bilona Ghee

The Bilona churned ghee is not a simple fat; it is described in the *Charaka Samhita* as *Amrit* (nectar) for the physical body:
* **True Churning:** Prepared by boiling pure A2 milk, setting it to curd, and hand-churning the curd with a wooden bi-directional churn (Bilona) to retrieve butter (*Makkhan*). This butter is then melted slowly over cow-dung fire to produce golden medicinal Ghee.
* **Gut Rejuvenation:** It is the richest natural source of butyric acid, which nourishes the gut lining and keeps digestive tract lubricated.
* **Vedic Usage:** Consume 1 spoon in warm water or warm milk in the morning, or apply it to flatbreads to lower their glycemic load.

**Recommended Product Integrations:**
* **Premium Vedic A2 Gir Cow Ghee (Bilona)** (500g, ₹899 or 1L, ₹1699) - Churned traditionally directly from curd.
* **A2 Bold Murrah Buffalo Ghee** (1L, ₹1190) - Exceptionally rich in healthy fats, ideal for Pitta and building muscle tissue.`;
  } else if (p.includes("pitta") || p.includes("heat")) {
    reply += `#### 🔥 Pacifying Pitta (The Fire Element)

With your chosen focus on the Pitta dosha to reduce bodily heat and soothe inflammation:
1. **Avoid Heat:** Restrain from highly salted, extremely spicy, and sour foods.
2. **Accept Sweet & Bitter:** Introduce sweet, bitter, and cooling organic remedies.
3. **Cooling Elixirs:** Drink coconut water mixed with a spoonful of cool **Ethical Raw Wild Forest Honey**.
4. **Favorable Fats:** Incorporate organic **Premium Vedic A2 Gir Cow Ghee (Bilona)** generously in your meals. Ghee is the premier cooling fat in Ayurveda; it cools the physical and energetic fire without dampening digestion.

**Recommended Product Integrations:**
* **Premium Vedic A2 Gir Cow Ghee (Bilona)** (500g, ₹899) - Churned naturally, possesses cooling attributes for the liver and skin.
* **Ethical Raw Wild Forest Honey** (500g, ₹490) - A cooling sweet element when consumed lukewarm or cold.`;
  } else if (p.includes("vata") || p.includes("wind") || p.includes("joint")) {
    reply += `#### 🌬️ Calming Vata (The Air & Space Element)

To balance Vata characteristics (dryness, coldness, joint pain, cracking bones, and anxiety):
1. **Warm & Moist:** Choose hot, cooked, oily, and heavy foods over raw vegetables and cold drinks.
2. **Nourish with Oils:** Massage daily is beneficial, but internal lubrication is crucial. Use wood-pressed oils.
3. **The Ghee Shield:** Add hot Bilona ghee to your warm soups, dhal, and rice. The heavy, sweet, oily nature of ghee is the literal absolute cure for dry Vata.
4. **Vata Spices:** Use warming spices like ginger, cumin, cardamom, and fennel in combination with **Pure Cold Pressed Yellow Mustard Oil** for traditional Indian cooking.

**Recommended Product Integrations:**
* **Premium Vedic A2 Gir Cow Ghee (Bilona)** (500g, ₹899) - Lubricates Vata joints, calms the nervous system, and resolves internal dryness.
* **Pure Cold Pressed Yellow Mustard Oil** (1L, ₹280) - Ideal warm base oil for digestive and physical vitality.`;
  } else if (p.includes("kapha") || p.includes("congest") || p.includes("sluggish")) {
    reply += `#### 🌿 Balancing Kapha (The Earth & Water Element)

For clearing Kapha sluggishness, water retention, and respiratory heaviness:
1. **Warm & Dry:** Choose warm, light, spicy, and bitter foods. Minimize sweets and heavy fats.
2. **Antioxidant Boost:** Consume warm herbal infusions with honey. Ethical raw forest honey is highly drying and scraping (*Lekhana*), which is fantastic for dissolving congestion.
3. **Warming Cooking:** Cook with highly activating spices such as Lakadong Turmeric, mustard seeds, and black pepper. Use minimal oil.
4. **Active Ghee:** Limit Ghee intake to 1/2 tsp daily, preferably with warming herbs.

**Recommended Product Integrations:**
* **Ethical Raw Wild Forest Honey** (500g, ₹490) - The perfect Kapha-scraper, rich in raw enzymes.
* **Pure Cold Pressed Yellow Mustard Oil** (1L, ₹280) - Activates metabolic circulation and clears mucus from the body.`;
  } else if (p.includes("oil") || p.includes("mustard") || p.includes("wood") || p.includes("ghani")) {
    reply += `#### 🪵 Traditional Wood Ghani Cold-Pressed Oils

Our oils are extracted exactly how our ancestors did it, using a wooden mortar and pestle (*Kolu / Ghani*):
1. **Strictly Cold:** No heat is generated during wood pressing. Conventional steel presses exceed 100°C, stripping nutrients, healthy fats, and aromatic esters.
2. **Yellow Mustard Advantage:** Unlike black mustard, yellow mustard yields a milder, nutritionally superior oil that regulates cholesterol, enhances digestion, and possesses strong warming benefits for the joints.
3. **Purity Sealed:** Unfiltered, unrefined, and containing zero chemical preservatives.

**Recommended Product Integrations:**
* **Pure Cold Pressed Yellow Mustard Oil (Wood Ghani)** (1L, ₹280) - Traditional wooden press extraction, high smoke point, exquisite aroma.
* **Premium Vedic A2 Gir Cow Ghee (Bilona)** (1L, ₹1699) - Ideal companion fat for heavy subzis and traditional cooking.`;
  } else {
    reply += `#### 🌟 Personalized Ayurvedic Wellness Strategy

To help you with your chosen wellness goal of **${healthGoal}** and align any potential **${dosha}** imbalances, here is our expert custom regime:

1. **Morning Dinacharya (Routine):**
   * Wake up before sunrise. Drink a tall copper tumbler of warm water mixed with 1 tsp of **Ethical Raw Wild Forest Honey** to flush accumulated digestive residue (*Ama*).
   * Ten minutes later, take 1 tsp of lukewarm **Premium Vedic A2 Gir Cow Ghee (Bilona)** directly on an empty stomach to coat the intestinal villi and stimulate digestive fire.

2. **Satvic Nourishment (Diet):**
   * Keep your meals freshly cooked, warm, and moderately spiced. Avoid ultra-processed packages.
   * Integrate organic cooking bases, prioritizing **Cold Pressed Wood Ghani Yellow Mustard Oil** for rich, raw nutrition.

3. **Restorative Sleep:**
   * Prior to sleeping, massage the soles of your feet with a drops of warm Bilona Ghee to experience calm sleep, especially for Vata-disturbed nights.

**Recommended Botanical Remedies:**
* **Premium Vedic A2 Gir Cow Ghee (Bilona)** (500g, ₹899 or 1L, ₹1699) - Churned via traditional Bilona method, enhances longevity, wisdom, and digestive warmth.
* **Ethical Raw Wild Forest Honey** (500g, ₹490) - Wild nectar gathered sustainably, rich in natural pollen and organic minerals.

I hope these traditional pearls of wisdom illuminate your path! May your health, happiness, and peace thrive. Done with warm blessings.`;
  }

  return reply;
}

// ==========================================
// GEMINI INTELLIGENT AYURVEDIC CHAT / RECIPE GPT
// ==========================================
app.post("/api/gemini/advisor", async (req, res) => {
  const { prompt, chatHistory, dosha, healthGoal } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: `### Namaste! (Demo Mode)
Grateful to have you here at **Hariana Organic Farm**! Our full-cycle AI Ayurvedic Wellness Adviser is temporarily running in **Demo Mode** because a Google Gemini API Key is not configured yet.

Once the secret key is provided, I can give you personalized dosha calculations, health benefits, and recipes! For now, here is a helpful tip:
* **For general wellness:** Try our *Premium Vedic A2 Gir Cow Ghee (Bilona)*. Take 1 tsp in warm water at sunrise on an empty stomach to lubricate the body joints, eliminate toxins, and strengthen digestive fire (Agni).`
      });
    }

    const productsContext = db.getProducts().map(p => 
      `- ${p.name} (${p.weight}, ₹${p.salePrice || p.price}): ${p.tagline}. Benefits: ${p.benefits.join(", ")}`
    ).join("\n");

    const systemInstruction = `You are "Acharya Shree", the ultra-premium AI Ayurvedic Wellness Consultant & Farm-to-Table Culinary Expert for "Hariana Organic Farm". 
Your tone is deeply elegant, tranquil, authentic, trustworthy, and Ayurvedic-inspired. Talk respectfully and passionately about high-quality traditions.

ABOUT HARIANA ORGANIC FARM:
We sell ultra-premium traditional products harvested strictly traditionally, specializing in:
- A2 Vedic Gir Cow Ghee prepared strictly via the bi-churned traditional Bilona method. (No cream centrifuges!)
- Bold Murrah Buffalo Ghee.
- Raw Wild Forest Honey gathered ethically.
- Cold, wood-pressed pure oils (Yellow Mustard, coconut, etc.).
- Natural, sulfur-free sugarcane Jaggery powder.
- Unpolished, stone-ground flour and pulses.
- Lakadong Turmeric (super high curcumin).

PRODUCTS LIST:
${productsContext}

YOUR MISSION:
1. Provide personalized nutrition advice, dosha matching (Vata, Pitta, Kapha), and healthy organic Indian recipes incorporating our products.
2. Politely recommend 1-2 exact matching products from our list to help them achieve their health goals. Mention their real pricing and weight options from the list.
3. Keep the layout exceptionally neat under clear headers, using bullet points and markdown. Keep responses concise and focused on high-quality organic wellness. Done with warm blessings.`;

    // Construct simple chat sequence
    const history = (chatHistory || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Add current context
    const currentPrompt = `User's selected Dosha: ${dosha || "Unknown"}. 
User's chosen Health Goal: ${healthGoal || "General Wellness"}.
User requested: "${prompt}"`;

    let reply = "";

    // 1st Attempt: Use Primary model (gemini-3.5-flash)
    try {
      console.log("Attempting Ayurvedic Advisor with gemini-3.5-flash...");
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        history: history,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      const response = await chat.sendMessage({
        message: currentPrompt
      });
      reply = response.text || "";
    } catch (primaryErr: any) {
      console.warn("Primary model 'gemini-3.5-flash' experienced high request volume, falling back to 'gemini-3.1-flash-lite'...", primaryErr.message || primaryErr);
      
      // 2nd Attempt: Use highly robust lighter model (gemini-3.1-flash-lite)
      try {
        const chat = ai.chats.create({
          model: "gemini-3.1-flash-lite",
          history: history,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });
        const response = await chat.sendMessage({
          message: currentPrompt
        });
        reply = response.text || "";
      } catch (fallbackErr: any) {
        console.error("Secondary fallback model also unavailable. Activating local scripture advisor engine.", fallbackErr.message || fallbackErr);
        // Clean fallback to smart local layout
        reply = getLocalAyurvedicResponse(prompt, dosha, healthGoal);
      }
    }

    if (!reply) {
      reply = getLocalAyurvedicResponse(prompt, dosha, healthGoal);
    }

    res.json({ reply });

  } catch (error: any) {
    console.error("Critical Gemini Route Failure, using guaranteed local response fallback:", error);
    res.json({
      reply: getLocalAyurvedicResponse(prompt, dosha, healthGoal)
    });
  }
});


// ==========================================
// VITE OR STATIC ASSETS ROUTING
// ==========================================
import { createServer as createViteServer } from "vite";

async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production static files from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=======================================================`);
    console.log(`   Hariana Organic Farm running on http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
