import { $user } from '@/store/user'

export default function SignOutButton() {
  async function handleForm() {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        $user.set(null)
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Ha ocurrido un error al intentar borrar el usuario')
    }
  }

  return (
    <form action={handleForm}>
      <button
        type="submit"
        className="w-full cursor-pointer border-4 border-black bg-red-400 py-3 text-sm font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-red-500 active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        CERRAR SESIÓN
      </button>
    </form>
  )
}
