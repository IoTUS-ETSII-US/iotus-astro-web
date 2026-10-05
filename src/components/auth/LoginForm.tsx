import { $user } from '@/store/user'
import type { User } from '@supabase/supabase-js'
import React, { useState } from 'react'

interface AuthResponse {
  error?: string
  message?: string
  user?: User
}

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = (await response
        .json()
        .catch(() => null)) as AuthResponse | null

      if (!response.ok) {
        throw new Error(
          data?.error || 'Credenciales inválidas o error en el servidor.'
        )
      }

      if (data?.user) {
        $user.set(data.user)
      }

      window.location.href = '/'
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al iniciar sesión'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full font-mono text-black">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs font-black uppercase"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="usuario@iotus.com"
            className="w-full border-4 border-black bg-slate-100 p-3 text-sm font-bold placeholder-slate-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-xs font-black uppercase"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full border-4 border-black bg-slate-100 p-3 text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full cursor-pointer border-4 border-black bg-yellow-300 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-pink-400 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? 'INGRESANDO...' : 'ENTRAR'}
        </button>
      </form>

      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm border-4 border-black bg-red-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-2 flex items-center justify-between border-b-4 border-black pb-2">
              <span className="text-sm font-black uppercase">
                ⚠️ Error de Inicio de sesión
              </span>
            </div>
            <p className="my-4 text-xs font-bold text-black uppercase">
              {errorMessage}
            </p>
            <button
              onClick={() => setErrorMessage(null)}
              type="button"
              className="w-full cursor-pointer border-3 border-black bg-white py-2 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              ENTENDIDO
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
