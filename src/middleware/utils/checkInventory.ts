import type { SupabaseClient, User } from '@supabase/supabase-js'

const allowedRoles = ['ADMIN', 'MEMBER']

export const isInventoryAvailable = async (
  supabase: SupabaseClient,
  user: User
): Promise<Boolean> => {
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', user.id)

  const hasPermission = userRoles?.some((r) => allowedRoles.includes(r.role_id))
  return hasPermission ?? false;
}
