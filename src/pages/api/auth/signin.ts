import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '@/lib/supabase'

interface LoginForm {
  email: string
  password: string
}

export const POST: APIRoute = async (context) => {
  const { email, password }: LoginForm = await context.request.json()

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'Email y contraseña requeridos' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createSupabaseServerClient(context)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log(data)

  return new Response(
    JSON.stringify({
      user: data.user,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
