// src/pages/api/products/[id].ts
import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export const DELETE: APIRoute = async (context) => {
  const productId = context.params.id

  if (!productId) {
    return new Response(JSON.stringify({ error: 'Falta el ID del producto' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 1. Verificar la sesión del usuario que hace la solicitud
  const supabase = createSupabaseServerClient(context)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 2. Verificar que tenga rol ADMIN
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', user.id)

  const roles = userRoles?.map((r) => r.role_id) || []
  const hasPermission = roles.includes('ADMIN')

  if (!hasPermission) {
    return new Response(
      JSON.stringify({
        error: 'Permisos insuficientes para eliminar productos',
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // 3. Usar cliente Service Role para saltar la regla RLS y ejecutar el borrado
  const supabaseAdmin = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { error, count } = await supabaseAdmin
    .from('products')
    .delete({ count: 'exact' }) // Para verificar cuántas filas se borraron
    .eq('id', productId)

  if (error) {
    return new Response(
      JSON.stringify({
        error: `Error al eliminar el producto: ${error.message}`,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (count === 0) {
    return new Response(
      JSON.stringify({ error: 'No se encontró el producto a eliminar' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ message: 'Producto eliminado correctamente' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
