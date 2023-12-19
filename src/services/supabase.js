import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hjyitfupsynbpkuuqqks.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWl0ZnVwc3luYnBrdXVxcWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5NzIzMjEsImV4cCI6MjAxODU0ODMyMX0.oQcDrkInPtInvKTi0e4D6IJNacp0eZNPsOr80ZV-MgE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
