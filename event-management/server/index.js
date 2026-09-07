const express = require('express');
const cors = require('cors');

const eventsRouter = require('./routes/events');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Whitelist your frontend origins
const allowedOrigins = [
  'http://localhost:5173', // Local Vite dev server
  'https://event-management-app-tmts-orcin.vercel.app/', // Your actual Vercel production domain (no trailing slash)
  process.env.CLIENT_URL, // Optional: pass via hosting env variables
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or curl) or matched frontend
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Required if using auth cookies or Authorization headers
  })
);

app.use(express.json());

// 2. API Routes
app.use('/api/events', eventsRouter);
app.use('/api/stats', statsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 3. Fallback for unhandled API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 4. Bind to 0.0.0.0 for cloud providers (Render, Railway, Fly.io, etc.)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});