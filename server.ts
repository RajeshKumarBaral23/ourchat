import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON middleware with high limit for optional mock photo uploads (base64)
app.use(express.json({ limit: "20mb" }));

// Embedded mock database for Our Universe
let db = {
  // Users: Partner A (Leo) & Partner B (Luna)
  users: {
    leo: { name: "Leo", avatar: "👨‍🚀", role: "partner", email: "leo@ouruniverse.app" },
    luna: { name: "Luna", avatar: "👩‍🚀", role: "partner", email: "luna@ouruniverse.app" }
  },
  // Couple global settings & lock info
  settings: {
    creationDate: "2025-01-01",
    anniversaryDate: "2025-02-14",
    biometricEnabled: true,
    disappearingMessagesDuration: "none", // 'none', '10s', '1m', '1hr', '24hr'
    screenshotLog: [] as { user: string; timestamp: string; type: string }[]
  },
  // Private encrypted-like chat entries
  messages: [
    { id: "msg_1", sender: "leo", text: "Hey space traveler! Did you look at the stars tonight? 🌌", timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), isPinned: false, isDisappearing: false },
    { id: "msg_2", sender: "luna", text: "Yes! They reminded me of our universe. Can't wait for our trip next month! 🚀❤️", timestamp: new Date(Date.now() - 3600000 * 2.8).toISOString(), isPinned: false, isDisappearing: false },
    { id: "msg_3", sender: "leo", text: "I already deposited my half for the travel savings goal! Let's fill up the progress bar. 🏝️", timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(), isPinned: true, isDisappearing: false }
  ] as { id: string; sender: string; text: string; timestamp: string; isPinned: boolean; isDisappearing: boolean }[],
  // Memories shared timeline
  memories: [
    {
      id: "mem_1",
      title: "Our First Coffee Date ☕",
      date: "2025-02-14",
      description: "It was raining outside, but inside that tiny coffee shop felt like pure sunshine. We talked for 4 hours straight about physics, retro-gaming, and future travels. That's when I knew.",
      category: "Anniversary",
      uploader: "leo",
      imageUrl: "https://picsum.photos/seed/coffeecouple/800/600",
      reactions: { heart: 4, hug: 2, kiss: 3 },
      comments: [
        { id: "c1", sender: "luna", text: "You spilled half your latte out of nervousness! 🤭❤️", timestamp: "2025-02-14T18:30:00Z" }
      ]
    },
    {
      id: "mem_2",
      title: "Under Lake Como's Skies ✨",
      date: "2025-04-20",
      description: "Laying on the wooden dock, listening to the lake ripples, and looking up at the clear beautiful night sky. We promised to build our own universe together. Here it is.",
      category: "Travel",
      uploader: "luna",
      imageUrl: "https://picsum.photos/seed/lakecomo/800/600",
      reactions: { heart: 8, hug: 5, kiss: 6 },
      comments: []
    }
  ],
  // Relationship rules with dual approval tracking
  rules: [
    {
      id: "rule_1",
      text: "Never go to sleep with an unresolved disagreement. Take a breath and resolve it together.",
      createdBy: "luna",
      approvedByLeo: true,
      approvedByLuna: true,
      status: "approved",
      category: "Emotional Commitment",
      lastUpdated: "2025-02-15T12:00:00Z"
    },
    {
      id: "rule_2",
      text: "Every Friday night is official date night. No work emails, no standard phones allowed (except Our Universe app!).",
      createdBy: "leo",
      approvedByLeo: true,
      approvedByLuna: true,
      status: "approved",
      category: "Quality Time",
      lastUpdated: "2025-02-16T14:30:00Z"
    },
    {
      id: "rule_3",
      text: "We will learn one new hobby together every six months. Leo wants pottery, Luna wants scuba diving!",
      createdBy: "luna",
      approvedByLeo: true,
      approvedByLuna: false,
      status: "pending_approval",
      category: "Growth & Adventure",
      lastUpdated: "2025-05-20T09:15:00Z"
    }
  ],
  // Savings & joint financial tracking
  finances: {
    targetAmount: 5000,
    currentSavings: 3200,
    contributions: [
      { id: "fin_1", contributor: "leo", amount: 1600, date: "2025-03-01", description: "Initial deposit for Europe trip ✈️" },
      { id: "fin_2", contributor: "luna", amount: 1600, date: "2025-03-15", description: "Luna matches initial travel deposit!" }
    ] as { id: string; contributor: string; amount: number; date: string; description: string }[]
  },
  // Future Planning goals
  goals: [
    { id: "goal_1", title: "Plan our cozy cabin wedding 💍", category: "Marriage", targetDate: "2026-06-12", isCompleted: false, description: "Small gathering under fairy lights, acoustic guitar music, and vegan cake." },
    { id: "goal_2", title: "Adopt a golden retriever pup 🐕", category: "Dreams", targetDate: "2025-10-01", isCompleted: false, description: "We will name him Cosmos or Nebula!" },
    { id: "goal_3", title: "Buy a classic camper van 🚐", category: "Travel", targetDate: "2027-05-01", isCompleted: false, description: "Rebuild it ourselves with custom wood paneled interior and solar panels!" }
  ],
  // Mood entries
  moods: {
    leo: { emoji: "😊", label: "Happy", timestamp: new Date().toISOString(), text: "Feeling productive and super excited for the weekend." },
    luna: { emoji: "🥰", label: "Loved", timestamp: new Date().toISOString(), text: "Thinking about our first date anniversary today." }
  } as Record<string, { emoji: string; label: string; timestamp: string; text: string } | null>
};

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// Get unified synchronized database state
app.get("/api/state", (req, res) => {
  res.json(db);
});

// Clear/Reset DB
app.post("/api/reset", (req, res) => {
  db.messages = [
    { id: "msg_1", sender: "leo", text: "Hey space traveler! Did you look at the stars tonight? 🌌", timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), isPinned: false, isDisappearing: false },
    { id: "msg_2", sender: "luna", text: "Yes! They reminded me of our universe. Can't wait for our trip next month! 🚀❤️", timestamp: new Date(Date.now() - 3600000 * 2.8).toISOString(), isPinned: false, isDisappearing: false },
    { id: "msg_3", sender: "leo", text: "I already deposited my half for the travel savings goal! Let's fill up the progress bar. 🏝️", timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(), isPinned: true, isDisappearing: false }
  ];
  db.memories = [
    {
      id: "mem_1",
      title: "Our First Coffee Date ☕",
      date: "2025-02-14",
      description: "It was raining outside, but inside that tiny coffee shop felt like pure sunshine. We talked for 4 hours straight about physics, retro-gaming, and future travels. That's when I knew.",
      category: "Anniversary",
      uploader: "leo",
      imageUrl: "https://picsum.photos/seed/coffeecouple/800/600",
      reactions: { heart: 4, hug: 2, kiss: 3 },
      comments: [
        { id: "c1", sender: "luna", text: "You spilled half your latte out of nervousness! 🤭❤️", timestamp: "2025-02-14T18:30:00Z" }
      ]
    },
    {
      id: "mem_2",
      title: "Under Lake Como's Skies ✨",
      date: "2025-04-20",
      description: "Laying on the wooden dock, listening to the lake ripples, and looking up at the clear beautiful night sky. We promised to build our own universe together. Here it is.",
      category: "Travel",
      uploader: "luna",
      imageUrl: "https://picsum.photos/seed/lakecomo/800/600",
      reactions: { heart: 8, hug: 5, kiss: 6 },
      comments: []
    }
  ];
  db.rules[2].approvedByLuna = false;
  db.finances.currentSavings = 3200;
  db.finances.contributions = [
    { id: "fin_1", contributor: "leo", amount: 1600, date: "2025-03-01", description: "Initial deposit for Europe trip ✈️" },
    { id: "fin_2", contributor: "luna", amount: 1600, date: "2025-03-15", description: "Luna matches initial travel deposit!" }
  ];
  db.moods = {
    leo: { emoji: "😊", label: "Happy", timestamp: new Date().toISOString(), text: "Feeling productive and super excited for the weekend." },
    luna: { emoji: "🥰", label: "Loved", timestamp: new Date().toISOString(), text: "Thinking about our first date anniversary today." }
  };
  db.settings.screenshotLog = [];
  res.json({ success: true, db });
});

// Logs screenshot attempts in security tab
app.post("/api/security/log", (req, res) => {
  const { user, type } = req.body;
  const newLog = {
    user: user || "unknown",
    timestamp: new Date().toISOString(),
    type: type || "Screenshot Blocked"
  };
  db.settings.screenshotLog.unshift(newLog);
  res.json({ success: true, log: newLog });
});

// Send Chat Message
app.post("/api/chat/send", (req, res) => {
  const { sender, text, isDisappearing } = req.body;
  if (!sender || !text) {
    return res.status(400).json({ error: "Missing sender or text" });
  }
  const newMessage = {
    id: "msg_" + Math.random().toString(36).substr(2, 9),
    sender,
    text,
    timestamp: new Date().toISOString(),
    isPinned: false,
    isDisappearing: !!isDisappearing
  };

  db.messages.push(newMessage);

  // If disappearing, simulate backend expiration in 10 seconds for standard live tabs,
  // but frontend can also clear it instantly based on the timestamp.
  res.json({ success: true, message: newMessage });
});

// Toggle Pin Message
app.post("/api/chat/pin", (req, res) => {
  const { id } = req.body;
  const msg = db.messages.find(m => m.id === id);
  if (msg) {
    msg.isPinned = !msg.isPinned;
    return res.json({ success: true, message: msg });
  }
  res.status(404).json({ error: "Message not found" });
});

// Clear chat history
app.post("/api/chat/clear", (req, res) => {
  db.messages = [];
  res.json({ success: true });
});

// Add Memory post
app.post("/api/memories/add", (req, res) => {
  const { title, description, category, uploader, imageUrl } = req.body;
  if (!title || !description || !uploader) {
    return res.status(400).json({ error: "Missing title, description or uploader" });
  }

  const newMemory = {
    id: "mem_" + Math.random().toString(36).substr(2, 9),
    title,
    date: new Date().toISOString().split('T')[0],
    description,
    category: category || "Memories",
    uploader,
    imageUrl: imageUrl || "https://picsum.photos/seed/" + Math.random() + "/800/600",
    reactions: { heart: 0, hug: 0, kiss: 0 },
    comments: [] as { id: string; sender: string; text: string; timestamp: string }[]
  };

  db.memories.unshift(newMemory);
  res.json({ success: true, memory: newMemory });
});

// React on a memory
app.post("/api/memories/react", (req, res) => {
  const { id, type } = req.body; // type is 'heart', 'hug', or 'kiss'
  const memory = db.memories.find(m => m.id === id);
  if (memory) {
    if (type === 'heart' || type === 'hug' || type === 'kiss') {
      memory.reactions[type] = (memory.reactions[type] || 0) + 1;
      return res.json({ success: true, reactions: memory.reactions });
    }
  }
  res.status(404).json({ error: "Memory not found or invalid reaction" });
});

// Add Comment to memory
app.post("/api/memories/comment", (req, res) => {
  const { id, sender, text } = req.body;
  const memory = db.memories.find(m => m.id === id);
  if (memory) {
    const comment = {
      id: "comment_" + Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp: new Date().toISOString()
    };
    memory.comments.push(comment);
    return res.json({ success: true, comment });
  }
  res.status(404).json({ error: "Memory not found" });
});

// Create or update rules
app.post("/api/rules/add", (req, res) => {
  const { text, category, createdBy } = req.body;
  if (!text || !createdBy) {
    return res.status(400).json({ error: "Missing physical rule text or creator" });
  }

  const newRule = {
    id: "rule_" + Math.random().toString(36).substr(2, 9),
    text,
    category: category || "Promise",
    createdBy,
    approvedByLeo: createdBy === "leo",
    approvedByLuna: createdBy === "luna",
    status: "pending_approval",
    lastUpdated: new Date().toISOString()
  };

  db.rules.push(newRule);
  res.json({ success: true, rule: newRule });
});

// Approve a rule
app.post("/api/rules/approve", (req, res) => {
  const { id, user } = req.body; // user is 'leo' or 'luna'
  const rule = db.rules.find(r => r.id === id);
  if (rule) {
    if (user === "leo") rule.approvedByLeo = true;
    if (user === "luna") rule.approvedByLuna = true;

    if (rule.approvedByLeo && rule.approvedByLuna) {
      rule.status = "approved";
    }
    return res.json({ success: true, rule });
  }
  res.status(404).json({ error: "Rule not found" });
});

// Delete a rule
app.post("/api/rules/delete", (req, res) => {
  const { id } = req.body;
  db.rules = db.rules.filter(r => r.id !== id);
  res.json({ success: true });
});

// Add savings contribution
app.post("/api/savings/deposit", (req, res) => {
  const { contributor, amount, description } = req.body;
  const depositAmount = parseFloat(amount);
  if (!contributor || isNaN(depositAmount) || depositAmount <= 0) {
    return res.status(400).json({ error: "Invalid contributor or amount" });
  }

  const contribution = {
    id: "fin_" + Math.random().toString(36).substr(2, 9),
    contributor,
    amount: depositAmount,
    date: new Date().toISOString().split('T')[0],
    description: description || "Joint contribution"
  };

  db.finances.currentSavings += depositAmount;
  db.finances.contributions.unshift(contribution);
  res.json({ success: true, finances: db.finances, contribution });
});

// Update joint budget target
app.post("/api/savings/set-target", (req, res) => {
  const { target } = req.body;
  const targetVal = parseFloat(target);
  if (!isNaN(targetVal) && targetVal > 0) {
    db.finances.targetAmount = targetVal;
    return res.json({ success: true, finances: db.finances });
  }
  res.status(400).json({ error: "Invalid target amount" });
});

// Add a goal
app.post("/api/goals/add", (req, res) => {
  const { title, category, targetDate, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Goal title is required" });
  }
  const newGoal = {
    id: "goal_" + Math.random().toString(36).substr(2, 9),
    title,
    category: category || "Dreams",
    targetDate: targetDate || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    isCompleted: false,
    description: description || ""
  };
  db.goals.push(newGoal);
  res.json({ success: true, goal: newGoal });
});

// Complete a goal
app.post("/api/goals/toggle", (req, res) => {
  const { id } = req.body;
  const goal = db.goals.find(g => g.id === id);
  if (goal) {
    goal.isCompleted = !goal.isCompleted;
    return res.json({ success: true, goal });
  }
  res.status(404).json({ error: "Goal not found" });
});

// Update active partner daily mood
app.post("/api/moods/update", (req, res) => {
  const { user, emoji, label, text } = req.body;
  if (!user || !emoji || !label) {
    return res.status(400).json({ error: "Missing mood information" });
  }
  db.moods[user] = {
    emoji,
    label,
    text: text || "",
    timestamp: new Date().toISOString()
  };
  res.json({ success: true, moods: db.moods });
});

// ----------------------------------------------------
// EMOTIONAL AI FEATURES (GEMINI API)
// ----------------------------------------------------

// Endpoint to generate daily relationship summaries and growth insights based on couple data
app.post("/api/ai/growth-report", async (req, res) => {
  const ai = getAI();
  if (!ai) {
    return res.status(503).json({
      error: "Gemini API Key is not configured in Secrets.",
      fallbackData: "### ✨ Infinite Cosmic Connection (Preview Mode)\n\n" +
        "**Our Current Chemistry:** ⭐⭐⭐⭐⭐ **98% Match**\n\n" +
        "**Cosmic Growth Insight:**\n" +
        "You both have been remarkably supportive. Leo recently matches contributions toward your Travel Goal, and Luna initiated an essential rule about quality Friday Date Nights. Keep the open dialogue flow alive!\n\n" +
        "*To experience custom dynamically generated AI growth forecasts, make sure to add your personal GEMINI_API_KEY in the Settings Secrets tab!*"
    });
  }

  try {
    const coupleContext = {
      anniversary: db.settings.anniversaryDate,
      activeMoods: db.moods,
      recentMessages: db.messages.slice(-5).map(m => `${m.sender === "leo" ? "Leo" : "Luna"}: "${m.text}"`),
      memoriesCount: db.memories.length,
      currentSavings: db.finances.currentSavings,
      targetSavings: db.finances.targetAmount,
      approvedRules: db.rules.filter(r => r.status === "approved").map(r => r.text),
      pendingRules: db.rules.filter(r => r.status === "pending_approval").map(r => r.text)
    };

    const prompt = `
You are the "Our Universe AI" - an advanced romantic, humorous, and intuitive relationship mentor and companion.
Analyze the following private couple dynamics in our joint digital space and output a beautifully formatted Markdown relationship chemistry report, complete with advice, heart ratios, future goal predictions, and memory high points.

Here is the couple's active state:
- Anniversary Date: ${coupleContext.anniversary}
- Total Shared Memories Uploaded: ${coupleContext.memoriesCount} Memory Posts
- Savings Progress: $${coupleContext.currentSavings} saved out of a target of $${coupleContext.targetSavings}
- Established Commitments & Promises:
  ${coupleContext.approvedRules.map(r => `* ${r}`).join("\n")}
- Pending commitments seeking approval:
  ${coupleContext.pendingRules.map(r => `* ${r}`).join("\n")}
- Current Mood Check-ins:
  * Leo: ${coupleContext.activeMoods.leo ? `${coupleContext.activeMoods.leo.emoji} - ${coupleContext.activeMoods.leo.label} (${coupleContext.activeMoods.leo.text})` : "Not checked in"}
  * Luna: ${coupleContext.activeMoods.luna ? `${coupleContext.activeMoods.luna.emoji} - ${coupleContext.activeMoods.luna.label} (${coupleContext.activeMoods.luna.text})` : "Not checked in"}
- Recent encrypted private messages:
  ${coupleContext.recentMessages.join("\n")}

Respond with an inspirational cosmic/celestial themed assessment including:
1. **Cosmic Relationship Status & Chemistry Match** (a fun romantic percentage based on their shared activities and moods).
2. **Growth Insight**: Beautiful personalized feedback honoring their promises, rules and active mood check-ins.
3. **Cosmic Action Prompt**: A personalized tiny daily sweet action or surprise date topic challenge tailored just for them today to foster their connection.
4. Keep the tone warm, poetic, supportive, futuristic, and slightly playful.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the emotional guiding spirit of 'Our Universe', a private romantic couple platform. Write beautiful lyrical relationship reflections with an uplifting celestial mood."
      }
    });

    const aiText = response.text || "Could not generate universe report.";
    res.json({ success: true, report: aiText });
  } catch (err: any) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ error: "Failed to generate AI report", details: err.message });
  }
});

// Endpoint to generate romantic dynamic prompt/inspiration for the day
app.post("/api/ai/daily-inspiration", async (req, res) => {
  const ai = getAI();
  if (!ai) {
    const list = [
      "Let's play 'Would you rather: space edition'. Would you rather explore an uncharted nebula together or build a cozy cottage on a moon with microgravity? 🌌",
      "Challenge for Leo & Luna today: Draw each other as cosmic constellations and upload the sketch to your Memories! 🎨⭐",
      "Love prompt: Share one tiny thing your partner did in the last 48 hours that made you smile, write it in the secret vault! ✨",
      "Cosmic Reminder: The universe is 13.8 billion years old, and yet, somehow, you both landed on the exact same small rock, at the exact same fraction of a second, to meet each other."
    ];
    return res.json({ success: true, inspiration: list[Math.floor(Math.random() * list.length)] });
  }

  try {
    const prompt = "Generate a single, deeply romantic, slightly playful, short quote or interactive daily couple challenge to strengthen connection. It must fit in a single sentence and feel like a custom celestial greeting card.";
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the emotional guide of 'Our Universe', speaking to two deeply bonded partners. Return a short, magical one-line challenge or romantic reminder."
      }
    });

    res.json({ success: true, inspiration: response.text?.trim() || "Cherish each other under every star." });
  } catch (err) {
    res.json({ success: true, inspiration: "The cosmos brought you together. Take five minutes today to listen to each other's heartbeat." });
  }
});

// ----------------------------------------------------
// VITE DEV SERVER / PRODUCTION CONFIGURATION
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
