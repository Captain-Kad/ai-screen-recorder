const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST_AGENT_URL = "http://host.docker.internal:3002";

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI Screen Recorder server is running" });
});

// Parse command and forward to host agent
app.post("/api/record", async (req, res) => {
  const { command } = req.body;

  // NLP parser — extract duration from command
  const match = command.match(/(\d+)\s*(second|sec|minute|min)/i);
  if (!match) {
    return res.status(400).json({
      status: "error",
      message:
        'Could not understand command. Try: "record my screen for 10 seconds"',
    });
  }

  let duration = parseInt(match[1]);
  if (/minute|min/i.test(match[2])) duration *= 60;

  console.log(`Parsed command: "${command}" → ${duration}s`);

  // Forward to host agent
  try {
    const response = await fetch(`${HOST_AGENT_URL}/record`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration }),
    });
    const data = await response.json();
    console.log("Host agent response:", JSON.stringify(data));
    res.json(data);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Could not reach host agent — is it running?",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
