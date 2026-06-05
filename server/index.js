const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Screen Recorder server is running' });
});

// Record endpoint placeholder
app.post('/api/record', (req, res) => {
  const { command } = req.body;
  res.json({ status: 'received', command });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});