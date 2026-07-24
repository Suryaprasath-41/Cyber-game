const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL || 'https://evykoyrlayhwjsxzsjpg.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.warn('WARNING: SUPABASE_KEY is not defined in your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey || 'dummy_key_to_prevent_crash_at_startup', {
  global: {
    WebSocket: WebSocket
  }
});

module.exports = supabase;
