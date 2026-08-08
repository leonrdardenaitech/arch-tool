import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import multer from "multer";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// State management
const STATE_FILE = path.join(process.cwd(), "agent_state.json");

async function initFiles() {
  try {
    await fs.access(STATE_FILE);
  } catch {
    await fs.writeFile(STATE_FILE, JSON.stringify({
      agent_id: "ATLAS-01",
      status: "IDLE",
      uptime: 0,
      last_sync: new Date().toISOString(),
      logs: [{ timestamp: new Date().toISOString(), level: "INFO", message: "ATLAS CORE Initialized." }],
      hitl_queue: [],
      documents: []
    }, null, 2));
  }
}

// Ensure files exist
initFiles();

// State API
app.get("/api/state", async (req, res) => {
  try {
    const data = await fs.readFile(STATE_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read state" });
  }
});

app.post("/api/state", async (req, res) => {
  try {
    await fs.writeFile(STATE_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update state" });
  }
});

// Logs API (IPC simulation)
app.post("/api/logs", async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(STATE_FILE, "utf-8"));
    data.logs.push({
      timestamp: new Date().toISOString(),
      ...req.body
    });
    // Keep last 100 logs
    if (data.logs.length > 100) data.logs.shift();
    await fs.writeFile(STATE_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to log message" });
  }
});

// HITL signaling
app.post("/api/hitl/approve", async (req, res) => {
  const { taskId, action } = req.body;
  try {
    const data = JSON.parse(await fs.readFile(STATE_FILE, "utf-8"));
    const taskIndex = data.hitl_queue.findIndex((t: any) => t.id === taskId);
    if (taskIndex > -1) {
      data.hitl_queue[taskIndex].status = action === 'approve' ? 'APPROVED' : 'DENIED';
      data.hitl_queue[taskIndex].resolvedAt = new Date().toISOString();
      await fs.writeFile(STATE_FILE, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to resolve HITL" });
  }
});

// Document Management
const upload = multer({ dest: 'uploads/' });
app.post("/api/documents/upload", upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  
  try {
    const data = JSON.parse(await fs.readFile(STATE_FILE, "utf-8"));
    data.documents.push({
      id: req.file.filename,
      name: req.file.originalname,
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString()
    });
    await fs.writeFile(STATE_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, file: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: "Failed to process document" });
  }
});

// Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
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
    console.log(`ATLAS CORE Bastion Host active at http://localhost:${PORT}`);
  });
}

startServer();
