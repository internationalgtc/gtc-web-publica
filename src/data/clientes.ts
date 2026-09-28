/**
 * Empresas que se muestran en la web («Ya trabajan con GTC») — FUENTE ÚNICA.
 *
 * Elegidas por Larisa el 28-sep-2026 entre los clientes con asistentes
 * trabajando ese día (contados en Nexus): las de más asistentes o más tiempo.
 * Afuera a propósito: clientes que son personas, fichas de prueba y clientes
 * con temas de cobro abiertos. Cedes Agua se sacó porque no tiene logo.
 *
 * Los logos están en public/img/clientes/, pasados a un solo color (azul
 * marino, con transparencia) desde la web de cada empresa. Conxuro dos Druidas
 * aparece con su marca, Paladar de Galicia.
 *
 * Antes de publicar: mostrar logos de clientes necesita el visto bueno de Daniel.
 */

export type Cliente = { nombre: string; logo: string; web: string }

export const CLIENTES: Cliente[] = [
  { nombre: 'Recoautos', logo: '/img/clientes/recoautos.png', web: 'https://recoautos.com/' },
  { nombre: 'Eco Cero', logo: '/img/clientes/ecocero.png', web: 'https://ecocero.com/' },
  { nombre: 'Level UP', logo: '/img/clientes/levelup.png', web: 'https://levelupdesarrollo.com/' },
  { nombre: 'Paladar de Galicia', logo: '/img/clientes/paladar.png', web: 'https://www.paladardegalicia.com/' },
  { nombre: 'FDSA', logo: '/img/clientes/fdsa.png', web: 'https://www.fdsa.es/' },
  { nombre: 'Taktics', logo: '/img/clientes/taktics.png', web: 'https://taktics.net/' },
  { nombre: 'AreaCad', logo: '/img/clientes/areacad.png', web: 'https://areacad.com/' },
  { nombre: 'Construcciones Ramírez', logo: '/img/clientes/ramirez.png', web: 'https://construccionesramirez2014.es/' },
  { nombre: 'PMV Factory', logo: '/img/clientes/pmv.png', web: 'https://pmvfactory.com/' },
  { nombre: 'Miramar', logo: '/img/clientes/miramar.png', web: 'https://www.miramarmenorca.com/' },
  { nombre: 'Cocinahogar', logo: '/img/clientes/cocinahogar.png', web: 'https://cocinahogar.com/' },
]
