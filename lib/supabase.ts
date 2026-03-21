import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = 'https://ppwtwcngrchvupmhvtfn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwd3R3Y25ncmNodnVwbWh2dGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTUxMjEsImV4cCI6MjA4OTU3MTEyMX0.gdvMf4W4ZoeyEebbhuilEjZ2F3isCHPn_QR5WpA62Ws'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
