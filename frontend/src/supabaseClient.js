import { createClient } from '@supabase/supabase-js'

// Ambil URL dan Kunci Anon dari file environment (.env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Buat dan ekspor satu instance client Supabase
// Ini akan kita gunakan di seluruh aplikasi frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey)