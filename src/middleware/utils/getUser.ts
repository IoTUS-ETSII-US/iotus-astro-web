import { createSupabaseServerClient } from '@/lib/supabase'
import { $user } from '@/store/user'
import { createClient, type User } from '@supabase/supabase-js'

interface Props {
  request: Request
  cookies: any
}

export async function getUser(context: Props): Promise<User | null> {
  const usuario: User | null = $user.get()

  if (usuario) return usuario

  const supabaseClient = createSupabaseServerClient(context)

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  if (user) {
    $user.set(user)
    context.cookies.user = user

    return user
  }

  return null
}
