import { createClient } from '@supabase/supabase-js'

// Estas credenciales las sacas de Settings > API en tu panel de Supabase
const supabaseUrl = 'https://rgzaydphzslxhedazyyr.supabase.co'
const supabaseAnonKey = 'sb_publishable_xphLxiiZmLego-6v1xzOzA_PKKT7uCc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)