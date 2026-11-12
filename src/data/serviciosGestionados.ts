/**
 * Los doce servicios gestionados, tal como los cuenta el menú comercial de
 * Nexus (src/lib/prospectos/material/servicios.ts en global-talent-platform-v2,
 * 12-nov-2026): nombre, «lo que dejas de hacer», cómo se mide y el precio
 * «desde» (alcance Esencial, al mes y sin impuestos).
 *
 * Si el menú cambia allá, se copia acá: la web no puede prometer otra cosa
 * que lo que dice el equipo comercial.
 *
 * Sin imports: lo lee también scripts/verificar-diagnostico.mjs con Node.
 */

type Texto = { es: string; en: string }

export type ServicioId =
  | 'ventas-prospeccion'
  | 'reactivacion-clientes'
  | 'marketing-digital'
  | 'atencion-cliente'
  | 'administracion-gestion'
  | 'contabilidad-cobros'
  | 'operaciones-logistica'
  | 'contenidos-redes'
  | 'diseno-grafico-video'
  | 'oficina-tecnica-obra'
  | 'desarrollo-web-software'
  | 'automatizacion-ia'

export interface ServicioGestionado {
  id: ServicioId
  nombre: Texto
  /** Lo que el dueño deja de hacer: es la casilla del diagnóstico. */
  dejas: Texto
  /** Cómo lo medimos, textual del menú. */
  mide: Texto[]
  /** Precio desde, en euros al mes (alcance Esencial). */
  desde: number
  /** Opción del campo «Qué quieres delegar» del formulario (FormularioLead). */
  perfilFormulario: string
}

export const SERVICIOS_GESTIONADOS: readonly ServicioGestionado[] = [
  {
    id: 'ventas-prospeccion',
    nombre: { es: 'Ventas y prospección', en: 'Sales and prospecting' },
    dejas: {
      es: 'Buscar a quién llamar, hacer el primer contacto y perseguir cada presupuesto enviado.',
      en: 'Finding who to call, making first contact and chasing every quote you sent.',
    },
    mide: [
      { es: 'Citas agendadas', en: 'Meetings booked' },
      { es: 'Propuestas enviadas con precio', en: 'Priced proposals sent' },
      { es: 'Ventas confirmadas', en: 'Confirmed sales' },
    ],
    desde: 1300,
    perfilFormulario: 'Ventas',
  },
  {
    id: 'reactivacion-clientes',
    nombre: { es: 'Reactivación de clientes', en: 'Customer reactivation' },
    dejas: {
      es: 'Revisar la lista de clientes inactivos, llamarlos uno a uno y anotar qué pasó.',
      en: 'Going through inactive customers, calling them one by one and noting what happened.',
    },
    mide: [
      { es: 'Clientes reactivados', en: 'Customers reactivated' },
      { es: 'Importe recuperado', en: 'Revenue recovered' },
      { es: 'Motivos de inactividad recogidos', en: 'Reasons for inactivity recorded' },
    ],
    desde: 1300,
    perfilFormulario: 'Ventas',
  },
  {
    id: 'marketing-digital',
    nombre: { es: 'Marketing digital y anuncios', en: 'Digital marketing and ads' },
    dejas: {
      es: 'Montar y seguir las campañas, revisar los contactos que llegan y pelear con el posicionamiento.',
      en: 'Setting up and tracking campaigns, reviewing incoming contacts and fighting with SEO.',
    },
    mide: [
      { es: 'Contactos cualificados entregados', en: 'Qualified contacts delivered' },
      { es: 'Citas generadas', en: 'Meetings generated' },
      { es: 'Campañas lanzadas en fecha', en: 'Campaigns launched on time' },
    ],
    desde: 1300,
    perfilFormulario: 'Marketing Digital',
  },
  {
    id: 'atencion-cliente',
    nombre: { es: 'Atención al cliente y posventa', en: 'Customer service and after-sales' },
    dejas: {
      es: 'Contestar cada consulta, perseguir las incidencias y avisar al cliente cuando algo se retrasa.',
      en: 'Answering every enquiry, chasing issues and telling customers when something is late.',
    },
    mide: [
      { es: 'Incidencias resueltas', en: 'Issues resolved' },
      { es: 'Avisos por demora', en: 'Delay notices sent' },
      { es: 'Ventas cerradas desde atención', en: 'Sales closed from support' },
    ],
    desde: 1300,
    perfilFormulario: 'Atención al Cliente',
  },
  {
    id: 'administracion-gestion',
    nombre: { es: 'Administración y gestión', en: 'Administration and management' },
    dejas: {
      es: 'Preparar documentación, mover la agenda, hacer trámites y armar presupuestos.',
      en: 'Preparing paperwork, juggling the calendar, handling formalities and putting quotes together.',
    },
    mide: [
      { es: 'Expedientes cerrados', en: 'Files closed' },
      { es: 'Pendientes y su antigüedad', en: 'Open items and how old they are' },
      { es: 'Encargos cerrados en plazo', en: 'Requests closed on time' },
    ],
    desde: 1300,
    perfilFormulario: 'Administrativo',
  },
  {
    id: 'contabilidad-cobros',
    nombre: { es: 'Contabilidad, facturación y cobros', en: 'Accounting, invoicing and collections' },
    dejas: {
      es: 'Registrar facturas, conciliar el banco, reclamar cobros y cerrar el mes.',
      en: 'Recording invoices, reconciling the bank, chasing payments and closing the month.',
    },
    mide: [
      { es: 'Cierre mensual entregado en fecha', en: 'Month-end close delivered on time' },
      { es: 'Bancos conciliados', en: 'Bank accounts reconciled' },
      { es: 'Cobros recuperados', en: 'Payments collected' },
    ],
    desde: 1300,
    perfilFormulario: 'Financiero / Contable',
  },
  {
    id: 'operaciones-logistica',
    nombre: { es: 'Operaciones, logística y comercio electrónico', en: 'Operations, logistics and e-commerce' },
    dejas: {
      es: 'Procesar pedidos, seguir envíos, resolver incidencias y mantener la tienda en línea y los marketplaces.',
      en: 'Processing orders, tracking shipments, fixing issues and keeping the online store and marketplaces up to date.',
    },
    mide: [
      { es: 'Envíos sin incidencia', en: 'Shipments without issues' },
      { es: 'Incidencias resueltas en plazo', en: 'Issues resolved on time' },
      { es: 'Catálogo publicado', en: 'Catalogue published' },
    ],
    desde: 1300,
    perfilFormulario: 'Otro',
  },
  {
    id: 'contenidos-redes',
    nombre: { es: 'Contenidos y redes sociales', en: 'Content and social media' },
    dejas: {
      es: 'Pensar qué publicar, escribirlo, programarlo y mandar el correo a tus clientes.',
      en: 'Deciding what to post, writing it, scheduling it and sending the newsletter to your customers.',
    },
    mide: [
      { es: 'Plan de publicaciones cumplido', en: 'Content plan delivered' },
      { es: 'Seguidores al cierre del mes', en: 'Followers at month end' },
      { es: 'Artículos publicados en fecha', en: 'Articles published on time' },
    ],
    desde: 1300,
    perfilFormulario: 'Marketing Digital',
  },
  {
    id: 'diseno-grafico-video',
    nombre: { es: 'Diseño gráfico y vídeo', en: 'Graphic design and video' },
    dejas: {
      es: 'Diseñar piezas, montar presentaciones y catálogos y editar los vídeos.',
      en: 'Designing pieces, building presentations and catalogues and editing videos.',
    },
    mide: [
      { es: 'Piezas y vídeos entregados en plazo', en: 'Pieces and videos delivered on time' },
      { es: 'Aprobados con una ronda o menos', en: 'Approved in one round or less' },
    ],
    desde: 1300,
    perfilFormulario: 'Otro',
  },
  {
    id: 'oficina-tecnica-obra',
    nombre: { es: 'Oficina técnica y gestión de obra', en: 'Technical office and project paperwork' },
    dejas: {
      es: 'Delinear planos, medir, armar presupuestos y preparar la documentación de cada proyecto.',
      en: 'Drafting plans, taking measurements, building estimates and preparing each project’s documents.',
    },
    mide: [
      { es: 'Presupuestos entregados en plazo', en: 'Estimates delivered on time' },
      { es: 'Rondas de corrección', en: 'Correction rounds' },
      { es: 'Entregables en fecha', en: 'Deliverables on time' },
    ],
    desde: 1300,
    perfilFormulario: 'Otro',
  },
  {
    id: 'desarrollo-web-software',
    nombre: { es: 'Desarrollo web y de software', en: 'Web and software development' },
    dejas: {
      es: 'Mantener la web, pedir funciones nuevas, conectar herramientas y perseguir cada error.',
      en: 'Maintaining the website, asking for new features, connecting tools and chasing every bug.',
    },
    mide: [
      { es: 'Entregables comprometidos y entregados', en: 'Deliverables committed and delivered' },
      { es: 'Incidencias resueltas en plazo', en: 'Issues resolved on time' },
      { es: 'Fallos tras entregar', en: 'Bugs after delivery' },
    ],
    desde: 1300,
    perfilFormulario: 'Desarrollo Web',
  },
  {
    id: 'automatizacion-ia',
    nombre: { es: 'Automatización con IA', en: 'AI automation' },
    dejas: {
      es: 'Copiar datos de una herramienta a otra, mandar avisos a mano y preparar los mismos informes cada mes.',
      en: 'Copying data between tools, sending reminders by hand and preparing the same reports every month.',
    },
    mide: [
      { es: 'Flujos pasados a producción', en: 'Workflows put live' },
      { es: 'Flujos sin incidencia en el mes', en: 'Workflows without issues this month' },
      { es: 'Hitos cumplidos', en: 'Milestones met' },
    ],
    desde: 1450,
    perfilFormulario: 'Automatización e IA',
  },
]
