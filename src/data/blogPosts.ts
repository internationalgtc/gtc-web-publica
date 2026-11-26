export interface BlogPost {
  id: string
  title: { es: string; en: string }
  excerpt: { es: string; en: string }
  author: string
  date: { es: string; en: string }
  /** La misma fecha en formato ISO, para los datos estructurados. */
  isoDate: string
  readTime: string
  category: { es: string; en: string }
  image: string
  content?: { es: string; en: string }
}

// Vacío desde el 26-nov-2026: los dos artículos propios usaban vocabulario que la
// guía del 16-nov deja fuera. Sus direcciones van a /blog (vercel.json).
export const blogPosts: BlogPost[] = []
