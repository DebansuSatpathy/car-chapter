# CarChapter Backend API

Backend server for the CarChapter car marketplace platform supporting car listings, selling, inquiries, and CSD assistance for defence personnel.

## Project Structure

```
backend/
├── server.js              # Main Express server
├── config/
│   └── supabase.js        # Supabase configuration
├── controllers/
│   ├── carController.js   # Car listing operations
│   ├── sellController.js  # Sell car operations
│   ├── inquiryController.js # Car inquiry operations
│   └── csdController.js   # CSD assistance operations
├── models/                # Database models (to be implemented)
└── routes/                # API routes (to be implemented)
```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

   Backend dependencies installed:
   - `express` - Web framework
   - `cors` - Cross-Origin Resource Sharing middleware
   - `dotenv` - Environment variable management
   - `nodemon` - Auto-restart server on file changes
   - `@supabase/supabase-js` - Supabase client library

## Configuration

1. **Create .env file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Update .env with your settings:**
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   NODE_ENV=development
   ```

## Running the Backend

### Development Mode
```bash
npm run backend
```

This starts the server with `nodemon` which automatically restarts the server when you make file changes.

The server will run on `http://localhost:5000`

### Terminal Output
```
✓ CarChapter API server running on http://localhost:5000
✓ Health check: http://localhost:5000/api/health
```

## API Endpoints

### Health Check
```
GET /api/health
Response: { "message": "API running" }
```

### API Info
```
GET /api
Response: 
{
  "message": "CarChapter API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "carListings": "/api/cars",
    "sellCar": "/api/cars/sell",
    "inquiries": "/api/inquiries",
    "csdAssistance": "/api/csd-assistance"
  }
}
```

## Running Frontend and Backend Together

### Terminal 1 - Frontend (Vite)
```bash
npm run dev
```
Frontend runs on `http://localhost:5173` (or next available port)

### Terminal 2 - Backend (Express)
```bash
npm run backend
```
Backend runs on `http://localhost:5000`

## Features to Implement

### 1. Car Listings
- [ ] Get all cars
- [ ] Search/filter cars by brand, budget, year, fuel type
- [ ] Get car details by ID

### 2. Sell a Car
- [ ] Create sell request
- [ ] Upload car images
- [ ] Update sell request
- [ ] Delete sell request

### 3. Car Inquiries
- [ ] Create inquiry for a car
- [ ] Get inquiries (for seller)
- [ ] Respond to inquiries

### 4. CSD Assistance
- [ ] Request CSD assistance (requires service number)
- [ ] Get CSD benefits information
- [ ] View CSD assistance requests (admin)
- [ ] Update CSD request status

## Database Setup (Supabase)

### Tables to Create

#### cars_listings
```sql
- id (UUID, primary key)
- seller_id (UUID, foreign key to users)
- title (varchar)
- brand (varchar)
- model (varchar)
- year (integer)
- price (decimal)
- mileage (integer)
- fuel_type (varchar)
- transmission (varchar)
- owner_type (varchar)
- location_city (varchar)
- description (text)
- images (jsonb array)
- is_verified (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### car_inquiries
```sql
- id (UUID, primary key)
- car_id (UUID, foreign key to cars_listings)
- buyer_name (varchar)
- buyer_email (varchar)
- buyer_phone (varchar)
- message (text)
- seller_response (text)
- status (varchar: pending, responded)
- created_at (timestamp)
```

#### csd_assistance_requests
```sql
- id (UUID, primary key)
- service_number (varchar, unique)
- rank (varchar)
- full_name (varchar)
- email (varchar)
- phone (varchar)
- car_preference (varchar)
- budget (decimal)
- message (text)
- status (varchar: pending, approved, rejected)
- assigned_agent (varchar)
- created_at (timestamp)
- updated_at (timestamp)
```

## Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase (Cloud Database & Auth)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key

# Optional: Local Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=car_marketplace
DB_USER=postgres
DB_PASSWORD=your_password
```

## CORS Configuration

The backend accepts requests from:
- `http://localhost:*` (all Vite dev ports)
- Frontend deployed URL (configure in production)

To modify CORS settings, edit `backend/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true
}));
```

## Next Steps

1. **Setup Supabase Account**
   - Create project at https://supabase.io
   - Get your URL and API key
   - Add to `.env` file

2. **Create Database Tables** (use SQL editor in Supabase)
   - Use the schema provided above

3. **Implement Routes**
   - Create route files in `backend/routes/`
   - Connect controllers to routes

4. **Add Database Models**
   - Create repository/query functions in `backend/models/`

5. **Test API Endpoints**
   - Use Postman or Insomnia
   - Test each endpoint

## Development

- **Auto-reload:** Nodemon watches for file changes
- **Logging:** Server logs requests and errors to console
- **Error Handling:** Basic error handling implemented

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use a production database
3. Enable HTTPS
4. Configure CORS for production domain
5. Deploy to Render, Heroku, Railway, or similar platform
