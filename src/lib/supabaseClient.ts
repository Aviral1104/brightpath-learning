import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://sqoznfxhpirahsuaaezi.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxb3puZnhocGlyYWhzdWFhZXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwOTA3NDAsImV4cCI6MjA4NzY2Njc0MH0.bk5Ty3Fz0AC5ejl8LJaEV6jyoxHJJpYmo7s9JS9jm1Y"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
