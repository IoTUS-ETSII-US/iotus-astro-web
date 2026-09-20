import type { APIRoute } from 'astro'
import { createClient } from '@supabase/supabase-js'

export const POST: APIRoute = async (context) => {
  // Instanciamos el cliente con la Service Role Key para tener permisos de escritura
  const supabaseAdmin = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    const { productId, userId, type, quantity } = await context.request.json()

    // 1. Validar que vengan todos los datos
    if (!productId || !userId || !type || !quantity) {
      return new Response(
        JSON.stringify({ error: 'Faltan datos obligatorios' }),
        { status: 400 }
      )
    }

    // 2. Obtener el stock actual desde la base de datos (más seguro que confiar en el frontend)
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('total_stock, available_stock')
      .eq('id', productId)
      .single()

    if (fetchError || !product) throw new Error('Producto no encontrado')

    let newAvailable = product.available_stock
    let newTotal = product.total_stock

    // 3. Calcular los nuevos valores según el tipo de movimiento
    if (type === 'loan') {
      if (quantity > newAvailable)
        throw new Error('No hay suficiente stock disponible')
      newAvailable -= quantity
    }
    if (type === 'return') newAvailable += quantity
    if (type === 'restock') {
      newAvailable += quantity
      newTotal += quantity
    }

    // 4. Registrar el movimiento en inventory_movements
    const { error: moveError } = await supabaseAdmin
      .from('inventory_movements')
      .insert([
        {
          product_id: productId,
          user_id: userId,
          type: type,
          quantity: quantity,
        },
      ])

    if (moveError) throw moveError

    // 5. Actualizar la tabla de productos
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ available_stock: newAvailable, total_stock: newTotal })
      .eq('id', productId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ message: 'Movimiento registrado correctamente' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error en la operación'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
