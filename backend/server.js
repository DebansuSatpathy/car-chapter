import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// Import controllers after env vars are loaded (required for Supabase client init)
const { getApprovedCars, createCarListing } = await import('./controllers/carController.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Multer setup (memory storage for upload to Supabase)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API running' });
});

// API Routes
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'CarChapter API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      carListings: '/api/cars',
      sellCar: '/api/cars/sell',
      inquiries: '/api/inquiries',
      csdAssistance: '/api/csd-assistance'
    }
  });
});

// Cars listing endpoints
app.get('/api/cars', getApprovedCars);
app.post('/api/cars', upload.array('images', 10), createCarListing);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`✓ CarChapter API server running on http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);

  // Import the database helper after env vars are loaded.
  const { testConnection } = await import('./config/db.js');

  try {
    await testConnection();
    console.log('✓ Connected to Supabase database');
  } catch (err) {
    console.error('❌ Supabase connection test failed:', err.message || err);
  }
});
