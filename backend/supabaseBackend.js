import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carga las variables desde el archivo .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export const supabaseService = createClient(supabaseUrl, supabaseServiceKey);