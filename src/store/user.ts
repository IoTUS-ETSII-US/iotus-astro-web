import { persistentAtom } from '@nanostores/persistent'
import type { User } from '@supabase/supabase-js'

export const $user = persistentAtom<User | null>(
  'user',
  null,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
)
