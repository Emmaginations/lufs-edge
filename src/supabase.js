import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ehcugfvwktlnoqoouril.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoY3VnZnZ3a3Rsbm9xb291cmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODU5MzAsImV4cCI6MjA3Njk2MTkzMH0.7rOblwK4SueXmWVwvll96VziaMYZiruL96sDCkwA-I8';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;