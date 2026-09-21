import { defineMiddleware } from 'astro:middleware'
import { createSupabaseServerClient } from '@/lib/supabase'
import { isInventoryAvailable } from './utils/checkInventory'

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context
  const supabase = createSupabaseServerClient(context)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Expone el usuario en context.locals para consumirlo en paginas
  context.locals.user = user

  // Protege la ruta de Perfil (requiere cualquier usuario autenticado)
  if (url.pathname.startsWith('/perfil') && !user) {
    return redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
  }

  // Ruta inventario requiere ser ADMIN o MEMBER
  if (url.pathname.startsWith('/inventario')) {
    if (!user) {
      return redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
    }

    // Consultar roles en Supabase
    const hasPermission = await isInventoryAvailable(supabase, user)

    if (!hasPermission) {
      return redirect('/?error=unauthorized')
    }
  }

  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      return redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
    }

    // Consultar roles en Supabase
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', user.id)

    const allowedRoles = ['ADMIN']
    const hasPermission = userRoles?.some((r) =>
      allowedRoles.includes(r.role_id)
    )

    if (!hasPermission) {
      return redirect('/?error=unauthorized')
    }
  }

  return next()
})
