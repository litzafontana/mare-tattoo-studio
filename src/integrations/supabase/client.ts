// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://muceojsxjdbrouirlusw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Y2VvanN4amRicm91aXJsdXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMTczMzcsImV4cCI6MjA2NTY5MzMzN30.a7QyiJ75ihH8Rctz01oLsZ6iNJhSA5szqhc1PQZtc0I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);