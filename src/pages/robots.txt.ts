import type { APIRoute } from 'astro'

const getRobotsTxt = (sitemapURL: URL) =>
  `
User-agent: *
Allow: /
Disallow: /admin
Disallow: /perfil
Disallow: /login
Disallow: /signup

Sitemap: ${sitemapURL.href}
`.trim()

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('site configuration is missing in astro.config.mjs', {
      status: 500,
    })
  }

  const sitemapURL = new URL('sitemap-index.xml', site)

  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
