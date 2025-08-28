import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvnjaxbrlvvdufbcaysd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bmpheGJybHZ2ZHVmYmNheXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NjkxMDAsImV4cCI6MjA3MTQ0NTEwMH0.lYH5EVW66A4FwFnCKTvchmiSpZTvbvvDwxu1rC3rZfA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);