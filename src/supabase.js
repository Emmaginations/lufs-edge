import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oznhvbuovawiaosrhkvj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bmh2YnVvdmF3aWFvc3Joa3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODIyODEsImV4cCI6MjA2MDY1ODI4MX0.jzUG30-mLjWo-J7RyWztQGFx-dTTzIJh_MJifvB6iEw';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;