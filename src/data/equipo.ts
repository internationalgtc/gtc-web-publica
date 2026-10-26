import fotoInma from '@/assets/equipo/inma.webp'
import fotoDaniel from '@/assets/equipo/daniel.webp'
import fotoAntonio from '@/assets/equipo/antonio.webp'
import fotoPilar from '@/assets/equipo/mariangel.webp'
import fotoAriel from '@/assets/equipo/ariel.webp'
import fotoGladymar from '@/assets/equipo/gladymar.webp'
import fotoReyna from '@/assets/equipo/reyna.webp'
import fotoFabiola from '@/assets/equipo/fabiola.webp'
import fotoLarisa from '@/assets/equipo/larisa.webp'
import fotoDelfina from '@/assets/equipo/delfina.webp'
import fotoNelson from '@/assets/equipo/nelson.webp'
import fotoJavier from '@/assets/equipo/javier-2.webp'
import fotoRocio from '@/assets/equipo/rocio.webp'
import fotoGiuliana from '@/assets/equipo/giuliana.webp'
import fotoCarolina from '@/assets/equipo/carolina.webp'
// Foto de Matheo: su selfie con la ropa cambiada a saco y camisa (Gemini, 28-sep-2026); cara y pelo sin tocar.
import fotoMatheo from '@/assets/equipo/matheo.webp'

export interface TeamMember {
  id: number
  nombre: string
  foto: string | null
  rol: string
  rolEn: string
  email: string
  linkedin: string
  nivel: 'direccion' | 'lider' | 'operativo'
}

export const equipo: TeamMember[] = [
  // DIRECCION EJECUTIVA
  { id: 18, nombre: 'Inma Romero', foto: fotoInma, rol: 'Managing Partner', rolEn: 'Managing Partner', email: 'iromero@globaltalent-connections.com', linkedin: '', nivel: 'direccion' },
  { id: 1, nombre: 'Daniel Crespo', foto: fotoDaniel, rol: 'CEO', rolEn: 'CEO', email: 'dcrespo@globaltalent-connections.com', linkedin: 'https://www.linkedin.com/in/daniel-crespo-garc%C3%ADa/', nivel: 'direccion' },

  // LIDERES
  { id: 3, nombre: 'Antonio Cabello', foto: fotoAntonio, rol: 'Head of Finance', rolEn: 'Head of Finance', email: 'acabello@globaltalent-connections.com', linkedin: 'https://www.linkedin.com/in/antonio-jesus-cabello-barea/', nivel: 'direccion' },
  { id: 4, nombre: 'M. Pilar Marin', foto: fotoPilar, rol: 'HR & Commercial Lead', rolEn: 'HR & Commercial Lead', email: 'mmarin@globaltalent-connections.com', linkedin: 'https://www.linkedin.com/in/mariangel-pilar-marin-a786a8148/', nivel: 'operativo' },
  { id: 5, nombre: 'Ariel Jimenez', foto: fotoAriel, rol: 'AI & Automation Lead', rolEn: 'AI & Automation Lead', email: 'ajimenez@globaltalent-connections.com', linkedin: '', nivel: 'lider' },
  { id: 6, nombre: 'Gladymar Torres', foto: fotoGladymar, rol: 'HR Business Partner', rolEn: 'HR Business Partner', email: 'gtorres@globaltalent-connections.com', linkedin: 'https://www.linkedin.com/in/gladymar-torres-825827188/', nivel: 'operativo' },

  // OPERATIVO
  { id: 9, nombre: 'Reyna Contreras', foto: fotoReyna, rol: 'HR Analyst', rolEn: 'HR Analyst', email: 'rcontreras@globaltalent-connections.com', linkedin: '', nivel: 'operativo' },
  { id: 21, nombre: 'Giuliana Lazzeretti', foto: fotoGiuliana, rol: 'HR Analyst', rolEn: 'HR Analyst', email: 'glazzeretti@globaltalent-connections.com', linkedin: '', nivel: 'operativo' },
  { id: 24, nombre: 'Carolina Portillo', foto: fotoCarolina, rol: 'Gestora de Cartera', rolEn: 'Account Manager', email: 'mportillo@globaltalent-connections.com', linkedin: '', nivel: 'operativo' },
  { id: 10, nombre: 'Larisa Spatafora', foto: fotoLarisa, rol: 'Developer', rolEn: 'Developer', email: 'lspatafora@globaltalent-connections.com', linkedin: '', nivel: 'operativo' },
  { id: 11, nombre: 'Nelson Alonso', foto: fotoNelson, rol: 'Developer', rolEn: 'Developer', email: 'nalonso@globaltalent-connections.com', linkedin: '', nivel: 'operativo' },
  { id: 12, nombre: 'Javier Martinez', foto: fotoJavier, rol: 'Developer', rolEn: 'Developer', email: 'jmartinez@globaltalent-connections.com', linkedin: 'https://www.linkedin.com/in/javierjmc/', nivel: 'operativo' },
  { id: 13, nombre: 'Fabiola Lozano', foto: fotoFabiola, rol: 'Quality Analyst', rolEn: 'Quality Analyst', email: 'flozano@globaltalent-connections.com', linkedin: 'https://www.linkedin.com/in/fabiolalozano/', nivel: 'operativo' },
  { id: 15, nombre: 'Delfina Palacio', foto: fotoDelfina, rol: 'Community Manager', rolEn: 'Community Manager', email: 'dpalacio@globaltalent-connections.com', linkedin: '', nivel: 'operativo' },
  { id: 23, nombre: 'Matheo Telesca', foto: fotoMatheo, rol: 'Developer', rolEn: 'Developer', email: 'mtelesca@globaltalent-connections.com', linkedin: '', nivel: 'operativo' },
  { id: 17, nombre: 'Rocío Rojas', foto: fotoRocio, rol: 'Quality Analyst', rolEn: 'Quality Analyst', email: 'rrojas@globaltalent-connections.com', linkedin: '', nivel: 'operativo' },
]

const porId = (ids: number[]) =>
  ids.map(id => equipo.find(m => m.id === id)).filter((m): m is TeamMember => !!m)

// Filas de la pagina /nosotros tal como las definio Ariel (18-ago-2026).
// El orden ES el layout: cada sub-array es una fila del grid.
// Gladymar reincorporada a la fila 4 (Ariel, 18-ago: 'sumala obvio').
export const direccion = porId([18, 1, 3, 5])           // Inma · Daniel · Antonio · Ariel
export const filasOperativo: TeamMember[][] = [
  porId([4, 9, 21, 24]),   // Pilar · Reyna · Giuliana · Carolina
  porId([12, 11, 10, 23]), // Javier · Nelson · Larisa · Matheo (equipo de desarrollo)
  porId([6, 13, 17, 15]),  // Gladymar · Fabiola · Rocio · Delfina
]
export const operativo = filasOperativo.flat()
