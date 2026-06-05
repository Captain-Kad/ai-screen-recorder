const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3002;
const OUTPUT_DIR = path.join(__dirname, 'recordings');

app.use(cors());
app.use(express.json());

// Make sure recordings folder exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Host agent running' });
});

app.post('/record', (req, res) => {
  const { duration = 10 } = req.body;
  const filename = `recording-${Date.now()}.mp4`;
  const outputPath = path.join(OUTPUT_DIR, filename);

  // ffmpeg command to record screen on Windows using h264 codec for universal compatibility
const command = `ffmpeg -y -f gdigrab -framerate 30 -i desktop -t ${duration} -vcodec libx264 -pix_fmt yuv420p "${outputPath}"`;

  console.log(`Starting recording for ${duration}s...`);

  exec(command, (error) => {
    if (error) {
      console.error('Recording error:', error.message);
      return res.status(500).json({ status: 'error', message: error.message });
    }
    console.log(`Recording saved: ${filename}`);
    res.json({ status: 'done', filename });
  });
});

app.listen(PORT, () => {
  console.log(`Host agent running on port ${PORT}`);
});