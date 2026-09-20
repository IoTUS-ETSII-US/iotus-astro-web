import { createClient } from '@supabase/supabase-js'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async (context) => {
  // 1. Instanciar cliente administrativo
  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    // 2. Ejecutar la consulta
    const { data, error } = await supabase.from('products').select('*')

    // 3. Comprobar si hubo un error en la base de datos
    if (error) {
      throw new Error(error.message)
    }

    // 4. Devolver los datos reales con las cabeceras HTTP correctas
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    // 5. Capturar y devolver cualquier error (Status 500)
    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Error desconocido al obtener productos'

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
