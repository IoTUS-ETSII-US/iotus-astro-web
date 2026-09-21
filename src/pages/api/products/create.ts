import type { Product } from '@/types/Product.interface'
import { createClient } from '@supabase/supabase-js'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async (context) => {

    const supabaseAdmin = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    const {
      category_id,
      name,
      description,
      part_number,
      location,
      total_stock,
      available_stock,
    }: Product = await context.request.json()

    if (!name || !total_stock || !available_stock) {
      return new Response(
        JSON.stringify({ error: 'Nombre, stock o stock total no se han proporcionado' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // 2. Ejecutar la actualización filtrando por el ID
    const { data: product, error: updateError } = await supabaseAdmin
      .from('products')
      .update({
        category_id,
        name,
        description,
        part_number,
        location,
        total_stock,
        available_stock,
      })
      .eq('id', id)
      .select()
      .single()

    // 3. Comprobar errores de la base de datos
    if (updateError) {
      throw new Error(updateError.message)
    }

    // 4. Respuesta exitosa
    return new Response(
      JSON.stringify({ message: 'Producto actualizado con éxito', product }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error al actualizar el producto'

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
