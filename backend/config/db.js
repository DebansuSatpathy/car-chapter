import { createClient } from '@supabase/supabase-js';

// NOTE: Ensure these environment variables are set (e.g. via a .env file):
//   SUPABASE_URL
//   SUPABASE_SERVICE_KEY
// The service role key is required for server-side operations.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase configuration. Ensure SUPABASE_URL and SUPABASE_SERVICE_KEY are set.'
  );
}

// Create a reusable Supabase client instance.
// Import this client in controllers like:
//   import { supabase } from '../config/db.js';
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Test Supabase connectivity by fetching a small sample from the `cars_listings` table.
 *
 * @returns {Promise<any[]>} - The fetched rows (typically limited to 1).
 * @throws If the query fails.
 */
export async function testConnection() {
  const { data, error } = await supabase
    .from('cars_listings')
    .select('*')
    .limit(1);

  if (error) {
    throw error;
  }

  return data;
}
