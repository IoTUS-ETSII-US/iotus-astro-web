import { createClient } from '@supabase/supabase-js'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async (context) => {
  // 1. Instanciar cliente administrativo
  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  )

  

  return new Response(JSON.stringify({ error: `Error al leer el producto:` }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
