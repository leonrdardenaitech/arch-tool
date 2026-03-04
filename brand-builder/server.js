require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// --- ROUTE 1: Image Generation Prompts ---
app.post('/api/generate-images', async (req, res) => {
    try {
        const { idea } = req.body;
        console.log(`Agent 007: Visualizing brand: ${idea}`);

        // Since we don't have a direct Image API connected (like DALL-E or Midjourney)
        // for this prototype, we'll simulate the URLs.
        // In a real prod environment, you'd use genAI to create the PROMPTS first,
        // then send those prompts to an Image Gen API.
        
        const simulatedUrls = [
            "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=800&auto=format&fit=crop&text=Billboard_" + encodeURIComponent(idea), // Billboard
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop&text=Newspaper_" + encodeURIComponent(idea), // Newspaper
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop&text=Social_" + encodeURIComponent(idea)    // Social
        ];

        // Give it a small artificial delay to feel like AI is working
        setTimeout(() => {
            res.json({ urls: simulatedUrls });
        }, 2000);

    } catch (error) {
        console.error("Image Logic Error:", error);
        res.status(500).json({ error: "Failed to visualize brand." });
    }
});

// --- ROUTE 2: Agent 007 Intelligence Report ---
app.post('/api/generate-report', async (req, res) => {
    try {
        const { idea, why } = req.body;
        console.log(`Agent 007: Analyzing market for: ${idea}`);

        const model = genAI.getGenerativeModel({ 
            model: "gemini-flash-latest",
            systemInstruction: "You are AI Agent 007, an elite brand strategist and market researcher. " +
            "The user has provided a Brand Idea and a Value Proposition (Why the brand is needed). " +
            "Analyze the current market landscape for this concept. " +
            "Format your response EXACTLY as structured HTML snippets (using <h3> and <p> tags) under these exact headings: " +
            "<h3>Market Research</h3> [Competitive analysis] " +
            "<h3>Confirm Demand</h3> [Trends and niche interest] " +
            "<h3>Customer Need</h3> [Problem being solved and edge] " +
            "<h3>Brand Value</h3> [What it stands for and stands against] " +
            "Do not use markdown backticks like html. Just return the raw HTML string."
        });

        const prompt = "Brand Idea: " + idea + ". Value Proposition: " + why + ". Generate the Intelligence Report.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ report: text });

    } catch (error) {
        console.error("Report Logic Error:", error);
        res.status(500).json({ error: "Agent 007 failed to compile the report." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Brand Builder Engine online at http://localhost:${PORT}`);
});
