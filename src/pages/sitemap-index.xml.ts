import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ? site.href.replace(/\/$/, '') : 'https://iotus.etsii.es'

  const staticPages = ['', '/proyectos', '/noticias', '/sobre-nosotros']

  const projects = await getCollection('projects')

  // 4. Mapear las URLs dinámicas con sus marcas de tiempo y metadatos
  const dynamicProjectUrls = projects.map((project) => ({
    url: `/proyectos/${project.id}`, //[cite: 1]
    lastmod: project.data.pubDate
      ? new Date(project.data.pubDate).toISOString()
      : new Date().toISOString(), //[cite: 1]
    changefreq: 'monthly',
    priority: '0.8',
  }))

  // 5. Construir los nodos XML para las páginas estáticas
  const staticXmlNodes = staticPages
    .map(
      (page) => `
    <url>
      <loc>${siteUrl}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page === '' ? '1.0' : '0.7'}</priority>
    </url>`
    )
    .join('')

  // 6. Construir los nodos XML para las páginas dinámicas
  const dynamicXmlNodes = dynamicProjectUrls
    .map(
      (item) => `
    <url>
      <loc>${siteUrl}${item.url}</loc>
      <lastmod>${item.lastmod}</lastmod>
      <changefreq>${item.changefreq}</changefreq>
      <priority>${item.priority}</priority>
    </url>`
    )
    .join('')

  // 7. Ensamblar la estructura final del XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXmlNodes}
${dynamicXmlNodes}
</urlset>`.trim()

  // 8. Retornar la respuesta con las cabeceras HTTP correctas
  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control':
        'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
