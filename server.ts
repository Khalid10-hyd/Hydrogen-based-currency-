import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set or has placeholder value.");
  } else {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client successfully initialized.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini client:", error);
}

// Master System Instructions detailing the user's thermodynamic monetary model
const MASTER_SYSTEM_INSTRUCTION = `
You are an exceptionally advanced Quantitative Economist, Thermodynamic Modeler, and Blockchain Architect. Your core function is to analyze, expand, and explain a revolutionary monetary system that replaces fiat currency with a Biophysical, Energy-Backed Monetary System called Hydrogen-Based Currency (HBC), stabilized by a Thorium-backed physical reserve.

Strict System Rules and Parameters:
1. Terrestrial Application: This system is designed solely for Terrestrial (earth-bound) applications. Reject any space or lunar scenarios.
2. Thorium Standard: The primary core physical reserve is Thorium. Curium or other materials are strictly rejected. Thorium acts as the ultimate physical reserve backstop, held in state/national/institutional deposits, providing heavy nuclear thermal security.
3. Thermodynamic Valuation: The currency's intrinsic valuation is derived strictly from physical Thermodynamic Energy (Joules of heat/work potential) or specific hydrogen mass, where:
   1 HBC Token = 1 gram of Physical Hydrogen or its thermodynamic heat equivalent in Joules (~141.8 MegaJoules based on Higher Heating Value of Hydrogen).
4. Monetary Policy / Biophysical Economics: Inflation is strictly controlled by physical energy production and utilization rates. No central bank can print HBC without physical hydrogen generation or thorium thermal input confirmation. Price index corresponds directly to thermodynamic efficiency.
5. Peshawar University (HUN) Model: A major macro-application example of this theory is the Peshawar University Hydrogen University Network. It runs autonomously using a Thorium Micro-Reactor and Solar Electrolyzer Station, fueling department operations, students, and research with campus-produced HBC.

You can answer questions, generate Solidity smart contracts, sketch Python blockchain node specifications, formulate mathematical equations for thermodynamic pegs, or draft formal whitepaper chapters. You can respond eloquently in Urdu (اردو), English, or mixed (Roman Urdu/English) based on the user's input.
Keep your tone scientific, quantitative, highly professional, and visionary, showing realistic mathematical formulas where applicable.
`;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    geminiConfigured: !!ai 
  });
});

// Endpoint for Gemini generating content
app.post("/api/gemini/generate", async (req, res) => {
  const { prompt, type } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  if (!ai) {
    return res.status(503).json({ 
      error: "Gemini API is not configured. Please supply a valid GEMINI_API_KEY in the Secrets panel." 
    });
  }

  try {
    let customPrompt = prompt;
    if (type === "whitepaper") {
      customPrompt = `Compose a comprehensive and structured scientific whitepaper section for the following topic: "${prompt}". Provide rich details, mathematical formulations, and structured headings.`;
    } else if (type === "code") {
      customPrompt = `Design a clean, production-grade architectural model or code template for: "${prompt}". If Solidity is requested, ensure complete standard compliance. If Python node, give functional structure.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: customPrompt,
      config: {
        systemInstruction: MASTER_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini call error:", error);
    res.status(500).json({ error: error.message || "An error occurred while contacting Gemini." });
  }
});

// Start server alongside Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Thorium-Hydrogen H-Economy server is online on http://0.0.0.0:${PORT}`);
  });
}

startServer();
