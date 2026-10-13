import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/student/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/student/', '/api/'],
      },
    ],
    sitemap: 'https://puera.in/sitemap.xml',
    host: 'https://puera.in',
  }
}
