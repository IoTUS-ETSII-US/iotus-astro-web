import { $user } from '@/store/user'
import { useStore } from '@nanostores/react'

export default function ProfileButton() {
  const user = useStore($user)

  return user ? (
    <a
      href="/perfil"
      className="flex items-center gap-2 border-2 border-black bg-yellow-300 p-1 font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
      title={user.email}
    >
      <img
        src={user.user_metadata?.avatar_url}
        alt="Perfil"
        className="h-8 w-8 border border-black object-cover"
      />
      <div className="flex h-8 w-full items-center justify-center overflow-x-clip border border-black bg-pink-200 px-2 text-sm text-black">
        {user.email}
      </div>
    </a>
  ) : (
    <a
      href="/register"
      className="border-2 border-black bg-yellow-300 px-4 py-2 text-sm font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
    >
      Únete a nosotros
    </a>
  )
}
