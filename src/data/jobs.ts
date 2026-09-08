// =============================================================================
// src/data/jobs.ts
// =============================================================================
// FUENTE ÚNICA DE VERDAD para todas las vacantes.
//
// ¿Cómo agregar una vacante nueva?
//   1. Copia el bloque de plantilla al final del array JOBS.
//   2. Asigna un id único (string, número siguiente al último).
//   3. Pon active: true para que aparezca en el listado.
//   4. Listo. No hay que tocar ningún otro archivo.
//
// ¿Cómo desactivar una vacante?
//   Cambia active: false. No la borres para conservar el historial.
//
// ¿Cómo agregar un nuevo departamento al filtro?
//   Añádelo al array DEPARTMENTS al final de este archivo.
// =============================================================================

export interface Responsibility {
  titulo: string;
  detalle?: string[];
}

export interface Job {
  // --- Campos obligatorios ---
  id: string;
  active: boolean;
  title: string;
  department: string;
  location: string;
  type: string;
  imageUrl: string;       // Usa rutas públicas: "/img-empleos/imagen.jpg"
  description: string;
  responsibilities: Responsibility[];
  requirements: string[];
  /** Perfil general (sin cliente detrás): se postula para entrar al banco de
   *  talento, no a una búsqueda abierta. Lo marca Nexus (`is_evergreen`). */
  esPerfilGeneral?: boolean;
  /** @deprecated No se usa — el botón "Aplicar" apunta a Nexus /postular-express */
  url?: string;

  // --- Campos opcionales ---
  residence?: string;
  experience?: string;
  education?: string;
  softSkills?: string[];
  benefits?: string[];
  otherSkills?: string[];
  kpis?: string[];
  applicants?: number;
}

// =============================================================================
// PLANTILLA — Copia esto para agregar una vacante nueva:
// =============================================================================
// {
//   id: "81",           ← número siguiente al último
//   active: true,       ← true = visible, false = oculta
//   title: "",
//   department: "",     ← debe coincidir con uno de DEPARTMENTS
//   location: "Remoto",
//   type: "Jornada Completa",
//   imageUrl: "/img-empleos/imagen.jpg",
//   description: "",
//   responsibilities: [
//     { titulo: "" },
//   ],
//   requirements: [""],
//   (url ya no es necesario — el botón "Aplicar" redirige a Nexus /postular-express)
//   residence: "",
//   experience: "",
//   education: "",
//   softSkills: [""],
//   benefits: [""],
// },
// =============================================================================

export const JOBS: Job[] = [
  // ---------------------------------------------------------------------------
  // VACANTES ACTIVAS
  // ---------------------------------------------------------------------------
  {
    id: "9",
    active: true,
    title: "Asistente de Automatización e Inteligencia Artificial (IA)",
    department: "Tecnología",
    location: "Remoto",
    type: "Jornada Completa",
    applicants: 0,
    imageUrl: "/img-empleos/automatizador.jpg",
    description:
      "Buscamos el motor de innovación operativa de nuestra empresa. Tu misión será identificar cuellos de botella y transformarlos en flujos de trabajo autónomos mediante herramientas No-Code/Low-Code e Inteligencia Artificial. El objetivo es maximizar la productividad y garantizar que la información fluya sin errores entre departamentos.",
    responsibilities: [
      { titulo: "Diseñar, testear y desplegar automatizaciones complejas en Make (excluyente) y Zapier." },
      { titulo: "Implementar y optimizar agentes de IA basados en LLMs (ChatGPT, Gemini) para tareas operativas." },
      { titulo: "Conectar sistemas internos y externos mediante integración de APIs (JSON) y Webhooks." },
      { titulo: "Realizar mantenimiento y optimización de flujos existentes (error handling) para reducir costos." },
      { titulo: "Gestionar datos entre plataformas y generar tableros de control en Power BI." },
      { titulo: "Configurar y automatizar espacios de trabajo en herramientas colaborativas (Notion, Trello, M365)." },
    ],
    requirements: [
      "Dominio experto de Make (Integromat) - Excluyente.",
      "Formación en Ingeniería de Sistemas, Informática o certificaciones avanzadas equivalentes.",
      "Experiencia en Prompt Engineering y configuración de asistentes vía API.",
      "Conocimientos en análisis de datos (Excel avanzado y Power BI).",
      "Valorable: Conocimientos básicos de programación (Python o JavaScript) para scripts personalizados.",
    ],
    benefits: [
      "Trabajo 100 % remoto con flexibilidad horaria.",
      "Acceso a herramientas de IA y automatización de vanguardia.",
      "Entorno tech-first orientado a resultados e innovación continua.",
      "Oportunidades de crecimiento profesional en proyectos de alcance global.",
    ],
  },
  {
    id: "10",
    active: false,
    title: "Asistente Técnico/a de Proyectos Acústicos",
    department: "Proyectos Acústicos",
    location: "Remoto",
    type: "Tiempo Completo",
    applicants: 0,
    imageUrl: "/img-empleos/sonido.jpeg",
    description:
      "Buscamos talento junior entusiasta para participar en proyectos acústicos reales de alcance internacional. Si manejas AutoCAD, dominas un idioma europeo y quieres aprender a marcar la diferencia con planos y presupuestos impecables, esta oportunidad es para ti. Ofrecemos formación técnica y mentoría desde el primer día.",
    responsibilities: [
      { titulo: "Desarrollo de planos detallados en AutoCAD para proyectos acústicos." },
      { titulo: "Elaboración y estructuración de presupuestos según requerimientos." },
      { titulo: "Preparación de piezas gráficas y documentación técnica necesaria." },
      { titulo: "Coordinación básica de proyectos y comunicación con clientes internacionales." },
    ],
    requirements: [
      "Perfil Junior: Estudiantes de últimos semestres o recién graduados.",
      "Manejo fluido de AutoCAD (Indispensable).",
      "Dominio de al menos uno de estos idiomas: Italiano, Portugués, Francés o Alemán.",
      "Alto nivel de orden, atención al detalle y capacidad de comunicación.",
    ],
    benefits: [
      "Formación técnica especializada y mentoría constante.",
      "Plan de crecimiento profesional dentro de la empresa.",
      "Participación en proyectos de arquitectura y acústica con alcance internacional.",
    ],
  },
  {
    id: "16",
    active: false,
    title: "Asistente Virtual de Recursos Humanos (Recruiting Specialist)",
    department: "Recursos Humanos",
    location: "100% Remoto (Exclusivo LATAM)",
    type: "Jornada Completa (Horario España)",
    applicants: 0,
    imageUrl: "/img-empleos/atencion.jpg",
    description:
      "Buscamos un Asistente Virtual especializado en Recruiting para conectar el mejor talento de LATAM con empresas líderes en España. Tu misión será alimentar y gestionar las etapas iniciales del funnel de reclutamiento, asegurando un flujo constante de candidatos cualificados mediante sourcing estratégico, screening técnico y entrevistas por competencias.",
    responsibilities: [
      { titulo: "Realizar sourcing estratégico en LinkedIn Recruiter, portales y bases de datos." },
      { titulo: "Ejecutar el screening inicial y análisis de CVs para validar requisitos técnicos." },
      { titulo: "Liderar entrevistas estructuradas y por competencias para evaluar el ajuste cultural." },
      { titulo: "Gestionar y mantener actualizado el pipeline en el ATS/CRM de la compañía." },
      { titulo: "Garantizar una Candidate Experience impecable y profesional en todas las fases iniciales." },
    ],
    requirements: [
      "Experiencia mínima de 2 años en reclutamiento y selección.",
      "Conocimiento en entrevistas por competencias.",
      "Manejo de herramientas digitales de selección (LinkedIn Recruiter, ATS, etc.).",
    ],
    softSkills: [
      "Habilidades de comunicación y orientación al detalle.",
      "Dinamismo y proactividad.",
      "Organización y capacidad de gestión.",
      "Pasión por conectar talento con oportunidades.",
    ],
  },
  {
    id: "57",
    active: false,
    title: "Asistente Marketing & Growth Manager (Social Media Strategist 360)",
    department: "Marketing",
    location: "100% Remoto",
    type: "Jornada Completa",
    applicants: 0,
    imageUrl: "/img-empleos/marketing.jpg",
    description:
      "Buscamos el motor estratégico que impulse nuestro pipeline hacia las 40 ventas mensuales. Tu misión será diseñar y ejecutar la estrategia de captación 360°, gobernando la pauta pagada, el contenido orgánico y los embudos de conversión. Buscamos un perfil data-driven con inglés bilingüe, capaz de liderar equipos creativos para maximizar el ROI en mercados internacionales.",
    responsibilities: [
      { titulo: "Diseñar y ejecutar la estrategia de captación 360° enfocada en el mercado anglosajón." },
      { titulo: "Liderar y coordinar al equipo de Content Manager y Responsable de Marca." },
      { titulo: "Optimizar constantemente el CPL (Costo por Lead) y el CAC (Costo de Adquisición)." },
      { titulo: "Gestionar el presupuesto de pauta en Meta, Google y LinkedIn Ads (B2B)." },
      { titulo: "Sincronizar con RRHH para alinear la captación de talento con las vacantes activas." },
      { titulo: "Diseñar, testear y optimizar funnels de conversión de alto rendimiento." },
    ],
    requirements: [
      "Inglés Bilingüe (C1) - Indispensable para redacción de copys en mercados internacionales.",
      "Experiencia de +5 años en Growth Marketing o Marketing Digital liderando equipos.",
      "Experto en Meta Ads, Google Ads y LinkedIn Ads con enfoque a conversión.",
      "Conocimientos sólidos en automatización de marketing, SEO y analítica de datos.",
      "Visión de negocio orientada a objetivos de ventas netas (40 ventas/mes).",
    ],
  },
  {
  id: "65",
  active: true,
  title: "Asistente Líder de Gestión y Calidad Operativa",
  department: "Gestión y Calidad",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/gestion.jpg",
  residence: "Remoto",
  experience: "4+ años liderando equipos de Calidad u Operaciones en BPOs, staffing o startups.",
  description:
    "Buscamos un estratega de retención para asegurar la excelencia en el servicio de nuestros asistentes remotos, garantizando un valor excepcional para clientes en Australia, UK y EE. UU.",
  education: "Ingeniería Industrial, Administración de Empresas, Negocios Internacionales o similares.",
  requirements: [
    "Inglés Bilingüe C1/C2 (Indispensable para auditar contextos en Australia/UK).",
    "Dominio avanzado de Hubstaff, Zoho CRM y creación de tableros de métricas.",
    "Experiencia liderando equipos de especialistas de calidad en entornos remotos.",
  ],
  softSkills: [
    "Atención al detalle extrema y enfoque en la resolución de conflictos.",
    "Capacidad analítica para transformar datos en planes de acción estratégicos.",
  ],
  benefits: [
    "Liderazgo con impacto global en mercados de alto nivel (AU/UK/US).",
    "Entorno de trabajo autónomo y basado en resultados (Data-driven).",
    "Flexibilidad total 100% remota.",
  ],
  responsibilities: [
    { titulo: "Gobernanza del Health Score: Gestionar el índice de salud de las cuentas para prevenir cancelaciones." },
    { titulo: "Liderazgo de Equipo: Supervisar y mentorizar a los especialistas de calidad en LatAm y Miami." },
    { titulo: "Auditoría de Desempeño: Evaluar la interacción de asistentes bilingües con clientes angloparlantes." },
    { titulo: "Gestión de Crisis: Liderar sesiones de feedback y planes de mejora ante banderas rojas de desempeño." },
    { titulo: "Reporting Estratégico: Convertir métricas de Hubstaff y Zoho en dashboards para la dirección operativa." },
  ],
},
  {
    id: "60",
    active: false,
    title: "Asistente Virtual de Ventas y Comercio Electrónico",
    department: "Ventas y Comercial",
    location: "Remoto",
    type: "Jornada Completa",
    applicants: 0,
    imageUrl: "/img-empleos/ecomerce.jpg",
    description:
      "Buscamos un perfil híbrido con mentalidad comercial y enfoque estratégico en e-commerce. Tu misión será gestionar prospectos interesados en mejorar su autoridad digital, optimizar tiendas online para maximizar la conversión y ejecutar tácticas de PR digital para impactar los rankings de Google.",
    responsibilities: [
      { titulo: "Gestionar prospectos y ejecutar el cierre de ventas para servicios de autoridad digital." },
      { titulo: "Optimizar tiendas online en Shopify y WooCommerce para mejorar visibilidad y ventas." },
      { titulo: "Ejecutar estrategias de PR digital (publicación de artículos y menciones en medios)." },
      { titulo: "Realizar el monitoreo y trazabilidad de enlaces para medir el impacto en rankings." },
      { titulo: "Brindar atención al cliente y acompañamiento integral en el embudo de ventas." },
    ],
    requirements: [
      "Experiencia comprobable en ventas digitales y gestión de clientes.",
      "Manejo fluido de plataformas de e-commerce (Shopify / WooCommerce).",
      "Conocimientos básicos de SEO, autoridad de dominio y PR digital.",
      "Perfil analítico con capacidad para medir resultados y rankings.",
      "Excelentes habilidades de comunicación persuasiva y atención al detalle.",
    ],
    softSkills: [
      "Mentalidad Comercial: Foco constante en la detección de oportunidades de cierre.",
      "Enfoque Estratégico: Capacidad para asesorar al cliente sobre qué mejora su visibilidad real.",
      "Atención al Cliente: Empatía y profesionalismo para acompañar al usuario en su compra.",
      "Organización: Rigor en la trazabilidad de tareas técnicas y seguimientos comerciales.",
    ],
    benefits: [
      "Oportunidad de trabajar con marcas internacionales en crecimiento.",
      "Entorno dinámico que combina marketing técnico con ventas reales.",
      "Flexibilidad total y trabajo orientado a resultados.",
    ],
  },

  // ---------------------------------------------------------------------------
  // VACANTES INACTIVAS (historial — no aparecen en el listado)
  // Para reactivar: cambia active: true
  // ---------------------------------------------------------------------------
  {
    id: "1",
    active: false,
    title: "Asistente Administrativo",
    department: "Soporte Administrativo",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/administrativo.jpg",
    residence: "Latinoamérica",
    experience: "Mínimo 1 año",
    description:
      "Buscamos un(a) Asistente Administrativo Inteligente y proactivo(a) para un rol clave y remoto enfocado en la optimización y automatización de procesos operativos utilizando estratégicamente herramientas de IA y tecnología.",
    education: "No especificado",
    requirements: [
      "Dominio de Google Workspace (o Microsoft 365).",
      "Experiencia con herramientas de gestión de proyectos como Asana o Trello.",
      "Conocimiento avanzado de Excel y Word.",
      "Familiaridad con herramientas de automatización, IA y sistemas CRM.",
      "Experiencia previa en gestión de facturación y trámites administrativos.",
      "Manejo de herramientas de colaboración y comunicación (ej. Discord, Toggl).",
    ],
    softSkills: [
      "Organización y atención al detalle.",
      "Proactividad, pensamiento analítico y adaptabilidad para el aprendizaje continuo.",
      "Excelentes habilidades de comunicación para la coordinación con equipos y proveedores.",
    ],
    responsibilities: [
      { titulo: "Solicitar correcciones de facturas a proveedores y freelance." },
      { titulo: "Tramitar facturas en plataformas (Renfe, Edreams, Booking, Iberia, etc.)." },
      { titulo: "Coordinar cambios de titularidad y altas en líneas móviles." },
      { titulo: "Realizar compras de herramientas siguiendo un proceso ágil." },
      { titulo: "Rellenar y actualizar tablas de métricas y RRHH." },
      { titulo: "Asignar/quitar accesos en Discord, Asana y Toggl." },
      { titulo: "Enviar mail de bienvenida con accesos y enlaces." },
    ],
  },
  {
    id: "2",
    active: false,
    title: "Asistente de Arquitectura",
    department: "Arquitectura",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/arquitectura.jpg",
    residence: "Latinoamérica",
    experience: "1 año",
    description:
      "Buscamos un Asistente proactivo y detallista para sumarse a nuestro equipo. Esta posición es ideal para alguien con un sólido dominio de software CAD y BIM.",
    education: "Título técnico o universitario en Arquitectura, Diseño de Interiores o campo relacionado.",
    requirements: [
      "Dominio avanzado de AutoCAD.",
      "Manejo experto de Revit (modelado, familias, documentación).",
      "Familiaridad con SketchUp para modelado y visualización.",
      "Habilidad para interpretar y crear planos arquitectónicos.",
    ],
    softSkills: [
      "Precisión y atención meticulosa al detalle.",
      "Excelente capacidad de organización y gestión del tiempo.",
      "Proactividad e iniciativa.",
    ],
    responsibilities: [
      { titulo: "Modelado 3D de proyectos arquitectónicos utilizando Revit y SketchUp." },
      { titulo: "Creación y edición de planos técnicos y detalles constructivos en AutoCAD." },
      { titulo: "Generación de renders y visualizaciones arquitectónicas de alta calidad." },
      { titulo: "Soporte en la preparación de presentaciones y documentación para clientes y permisos." },
    ],
  },
  {
    id: "3",
    active: false,
    title: "Asistente de Gestión y Calidad",
    department: "Gestión y Calidad",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/gestion.jpg",
    residence: "Remoto",
    experience: "Experiencia previa en gestión administrativa, control de calidad o soporte en auditorías bajo normas ISO.",
    description:
      "El Asistente de Gestión y Calidad es la pieza clave para garantizar la estandarización y la mejora continua.",
    education: "Formación en Administración de Empresas, Ingeniería Industrial, Gestión de Calidad o áreas afines.",
    requirements: [
      "Dominio avanzado de Excel para el seguimiento de indicadores y reporting.",
      "Experiencia en el uso de ERP/CRM y software de gestión documental.",
      "Conocimientos técnicos en normas ISO 9001 y protocolos de seguridad industrial.",
      "Habilidad en el uso de herramientas de gestión de proyectos (JIRA, Trello, Asana).",
    ],
    softSkills: [
      "Alta capacidad de organización, orden y atención al detalle.",
      "Comunicación profesional y asertiva.",
      "Pensamiento analítico para la detección de incidencias.",
    ],
    responsibilities: [
      { titulo: "Monitorear que los procesos internos cumplan con las normas ISO y las regulaciones locales vigentes." },
      { titulo: "Coordinar la logística de auditorías internas/externas y organizar la documentación requerida." },
      { titulo: "Analizar KPIs de rendimiento, gestionar el registro de incidencias y dar seguimiento a planes de mejora." },
      { titulo: "Archivar y controlar la vigencia de certificados, licencias y normativas de seguridad laboral." },
    ],
  },
  {
    id: "4",
    active: false,
    title: "Asistente Comercial",
    department: "Ventas y Comercial",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/ventas.jpg",
    residence: "Latinoamérica",
    experience: "1-2 años",
    description:
      "Buscamos un(a) Asistente Comercial proactivo(a) para apoyar a nuestro equipo de ventas.",
    education: "No especificado",
    requirements: [
      "Mínimo de 1 a 2 años en roles de ventas, telemarketing o soporte comercial.",
      "Manejo de herramientas de CRM (como Salesforce o HubSpot), Google Workspace y Excel.",
    ],
    softSkills: [
      "Excelentes habilidades de comunicación, proactividad y orientación a resultados.",
      "Capacidad de Negociación.",
      "Gestión del tiempo y manejo de múltiples tareas.",
    ],
    responsibilities: [
      { titulo: "Realizar llamadas a prospectos y clientes, incluyendo ventas cruzadas y seguimiento." },
      { titulo: "Apoyar en la investigación de leads y mantener la base de datos actualizada." },
      { titulo: "Colaborar en la creación de reportes y la organización de información comercial." },
    ],
  },
  {
    id: "5",
    active: false,
    title: "Asistente en Identidad Visual y Contenido",
    department: "Marketing",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/marketing.jpg",
    residence: "Remoto",
    experience: "Mínimo 2 años en áreas de marketing digital, comunicación o diseño de contenido.",
    description:
      "Persona proactiva y creativa, clave en el crecimiento de la marca mediante la creación de materiales visuales de alto impacto.",
    education: "Formación en Marketing, Comunicación, Diseño o experiencia equivalente en áreas digitales.",
    requirements: [
      "Perfil Creativo con Capacidad para diseñar contenido estético, profesional y de alto impacto.",
      "Dominio de Herramientas de IA para la creación de imágenes, videos y textos.",
      "Manejo avanzado de Canva y Meta Business Suite.",
      "Mínimo 2 años trabajando en áreas digitales o de comunicación.",
    ],
    softSkills: [
      "Proactividad y dinamismo para impulsar el crecimiento de la marca.",
      "Enfoque en Resultados y la mejora continua del alcance orgánico.",
    ],
    responsibilities: [
      { titulo: "Diseñar y crear Presentaciones visuales de alto nivel, cuidando la imagen corporativa." },
      { titulo: "Gestión de Redes Sociales: Planificar, publicar y moderar comunidades." },
      { titulo: "Generación de Contenido con IA: Producir imágenes, videos (reels) y textos creativos." },
      { titulo: "Análisis y Estrategia: Monitorear el rendimiento de las publicaciones." },
    ],
  },
  {
    id: "6",
    active: false,
    title: "Asistente para E-commerce",
    department: "Comercio Electrónico",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/ecomerce.jpg",
    residence: "Latinoamérica",
    experience: "1-3 años",
    description:
      "Responsable de asegurar la excelencia operativa en la gestión de tiendas online, impulsando las ventas y optimizando la experiencia del cliente.",
    education: "Título universitario.",
    requirements: [
      "Dominio de plataformas de e-commerce (Prestashop, Shopify, WooCommerce, etc.).",
      "Conocimiento en herramientas de marketing digital (Meta Ads, Google Ads, Mailchimp, etc.) y Excel.",
      "Capacidad analítica para optimizar la estrategia de ventas.",
    ],
    softSkills: ["Proactivo(a), detallista y organizado(a).", "Capacidad analítica."],
    responsibilities: [
      { titulo: "Administrar plataformas de e-commerce (Prestashop, Shopify, WooCommerce, etc.)." },
      { titulo: "Actualizar catálogos, precios e inventario." },
      { titulo: "Procesar pedidos, coordinar envíos y devoluciones." },
      { titulo: "Implementar y monitorear campañas de marketing digital." },
      { titulo: "Analizar datos de ventas y tráfico para optimizar la estrategia." },
    ],
  },
  {
    id: "7",
    active: false,
    title: "Asistente de Desarrollo Web",
    department: "Tecnología y Desarrollo Web",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/desarrollo.jpg",
    residence: "Latinoamérica",
    experience: "1-2 años",
    description:
      "Brindar soporte remoto en proyectos digitales, participando en el diseño, desarrollo e implementación de aplicaciones web.",
    education: "Técnico o profesional en Ingeniería de Sistemas, Informática o experiencia equivalente.",
    requirements: [
      "Experiencia comprobable en desarrollo Fullstack: Frontend (React) y Backend (Python).",
    ],
    responsibilities: [
      { titulo: "Desarrollo y mantenimiento de aplicaciones web fullstack." },
      { titulo: "Integración de APIs y gestión de bases de datos." },
    ],
  },
  {
    id: "13",
    active: false,
    title: "Asistente Contable",
    department: "Finanzas y Contabilidad",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/contable.jpg",
    residence: "Latinoamérica",
    experience: "1-2 años",
    description:
      "Buscamos un Asistente Contable proactivo, preciso y con excelentes habilidades de organización.",
    education: "Título técnico o universitario en Administración, Contabilidad, Finanzas o carreras afines.",
    requirements: [
      "Mínimo 1-2 años desempeñando roles similares.",
      "Dominio intermedio-avanzado de Excel.",
      "Manejo de software contable, CRM, Google Drive y plataformas colaborativas.",
    ],
    softSkills: [
      "Precisión y autonomía en la gestión de tareas.",
      "Proactividad e iniciativa para identificar mejoras.",
      "Discreción y organización en el manejo de información sensible.",
    ],
    responsibilities: [
      { titulo: "Contabilidad General", detalle: ["Registrar ingresos y egresos.", "Realizar conciliaciones bancarias."] },
      { titulo: "Gestión de Documentación Financiera", detalle: ["Organizar facturas, contratos y archivos contables."] },
      { titulo: "Informes Financieros", detalle: ["Elaborar y analizar informes financieros.", "Calcular márgenes por línea de producto e indicadores clave."] },
    ],
  },
  {
    id: "14",
    active: false,
    title: "Asistente de Atención al Cliente",
    department: "Servicio al Cliente",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/atencion.jpg",
    residence: "Latinoamérica",
    experience: "Experiencia previa en roles de atención al cliente",
    description:
      "Buscamos un Asistente de Atención al Cliente empático y proactivo. Esta persona será la voz de nuestra marca y el punto de contacto principal para nuestros clientes.",
    education: "No especificado",
    requirements: [
      "Experiencia previa en atención al cliente.",
      "Se valorará el manejo del idioma inglés.",
    ],
    softSkills: [
      "Empatía y paciencia.",
      "Comunicación asertiva, oral y escrita.",
      "Organización y capacidad de gestionar múltiples canales.",
    ],
    responsibilities: [
      { titulo: "Gestión de Consultas", detalle: ["Atender preguntas, dudas e incidencias por teléfono, correo, chat y WhatsApp."] },
      { titulo: "Resolución de Problemas", detalle: ["Registrar y dar seguimiento a incidencias.", "Coordinar con otros departamentos."] },
      { titulo: "Gestión de Redes Sociales", detalle: ["Monitorear y responder a comentarios y mensajes en redes sociales."] },
    ],
  },
  {
    id: "15",
    active: false,
    title: "Asistente de Ventas de Alto Impacto",
    department: "Ventas Comercial",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/ecomerce.jpg",
    residence: "Remoto",
    experience: "Experiencia consolidada en ventas consultivas, cierre de tratos y manejo de indicadores comerciales.",
    description:
      "Buscamos a la 'cara' y el 'motor' de nuestras ventas. Este rol requiere a una profesional capaz de proyectar confianza y autoridad en entornos virtuales.",
    education: "Formación en Ventas, Marketing, Administración o Comunicación.",
    requirements: [
      "Venta por Naturaleza: Dominio de técnicas de persuasión y cierre efectivo.",
      "Excel Power User: Capacidad para gestionar bases de datos, cruces de información y tablas dinámicas.",
      "Imagen Corporativa: Presencia Pro y dicción impecable para liderar reuniones de alto nivel.",
      "Entorno Digital: Manejo experto de herramientas de videoconferencia (Zoom, Meet, Teams).",
    ],
    softSkills: [
      "Alta capacidad de persuasión y carisma frente a cámara.",
      "Orientación a resultados y cumplimiento de metas comerciales.",
    ],
    responsibilities: [
      { titulo: "Cierre de Ventas: Ejecutar el ciclo de contacto y negociación hasta la conversión final." },
      { titulo: "Presentaciones Ejecutivas: Realizar demostraciones comerciales de alto impacto visual y verbal." },
      { titulo: "Control de Datos: Asegurar que cada interacción quede registrada en los reportes de Excel." },
    ],
  },
  {
    id: "17",
    active: false,
    title: "Asistente de Soporte TI y Software",
    department: "Soporte Técnico / TI",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/desarrollo.jpg",
    residence: "Latinoamérica",
    experience: "1-2 años",
    description:
      "Responsable de brindar soporte técnico de primer nivel, abarcando tanto la infraestructura (hardware, software, redes) como la resolución de incidencias en plataformas de software de negocio (SaaS, ERP, CRM).",
    education: "Título técnico o universitario en Sistemas, Informática o campo relacionado.",
    requirements: [
      "Experiencia comprobada en soporte técnico (hardware, software, redes).",
      "Dominio de sistemas operativos (Windows/Mac/Linux) y suites ofimáticas.",
      "Conocimiento básico de redes TCP/IP y diagnóstico de conectividad.",
      "Habilidad para leer errores, logs, o interpretar pantallazos técnicos.",
      "Idealmente, familiaridad con herramientas de ticketing (Zendesk, Freshdesk, Jira).",
    ],
    softSkills: [
      "Excelente capacidad de comunicación y atención al cliente.",
      "Habilidad para documentar procesos y soluciones.",
      "Resolución de problemas de forma rápida y efectiva.",
    ],
    responsibilities: [
      { titulo: "Brindar soporte técnico de primer nivel a usuarios remotos (hardware, software y plataformas de negocio)." },
      { titulo: "Gestionar y resolver incidencias a través del sistema de tickets." },
      { titulo: "Administrar cuentas de usuario y permisos en sistemas y plataformas." },
      { titulo: "Mantener y actualizar la documentación técnica y las guías de usuario." },
    ],
  },
  {
    id: "18",
    active: false,
    title: "Asistente Técnico-Operativo con enfoque en automatización",
    department: "Operaciones y Tecnología",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/automatizador.jpg",
    residence: "Latinoamérica",
    experience: "Mínimo 2 años",
    description:
      "Buscamos un perfil técnico-operativo con un fuerte enfoque en la automatización y el soporte al cliente.",
    education: "Título técnico o universitario en Sistemas, Marketing Digital o afines.",
    requirements: [
      "Dominio de herramientas de automatización de workflows (ej. Zapier, Make).",
      "Experiencia comprobable en la configuración de embudos de venta (funnels) y sistemas CRM.",
      "Habilidad para realizar integraciones de herramientas externas (ej. Stripe, WhatsApp Business API).",
    ],
    softSkills: [
      "Actitud proactiva y orientación a la innovación.",
      "Pensamiento analítico y capacidad para resolver problemas complejos.",
    ],
    responsibilities: [
      { titulo: "Configuración y mantenimiento de workflows y embudos de venta en plataformas CRM." },
      { titulo: "Implementación y gestión de integraciones con sistemas de pago (Stripe) y comunicación (WhatsApp)." },
      { titulo: "Documentación de procesos técnicos y funcionales para asegurar la escalabilidad." },
    ],
  },
  {
    id: "19",
    active: false,
    title: "Asistente Especialista de Plataforma Go High Level",
    department: "Go High Level (GHL)",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/ghl.jpg",
    residence: "Latinoamérica",
    experience: "Mínimo 2 años (comprobable en GHL)",
    description:
      "Buscamos un Experto/a en Go High Level (GHL) para liderar la automatización de los procesos de marketing y ventas.",
    education: "Título técnico o universitario en Marketing Digital, Sistemas o afines.",
    requirements: [
      "Dominio avanzado de Go High Level (GHL): Configuración de workflows, funnels y pipelines.",
      "Experiencia en la implementación de SaaS white label dentro de GHL.",
      "Experiencia comprobable en integraciones clave: Stripe, WhatsApp Business API, Zapier, Google Calendar.",
      "Conocimientos sólidos de automatización de marketing y ventas.",
    ],
    softSkills: [
      "Proactividad y resolución de problemas.",
      "Comunicación clara y profesional con clientes y equipo.",
      "Autonomía y responsabilidad para trabajar sin supervisión constante.",
    ],
    responsibilities: [
      { titulo: "Configuración avanzada y optimización continua de workflows, funnels y pipelines dentro de GHL." },
      { titulo: "Implementación y gestión técnica de integraciones externas para asegurar el flujo de datos." },
      { titulo: "Documentación exhaustiva de los procesos y creación de manuales de uso para clientes finales." },
      { titulo: "Brindar soporte especializado y capacitación sobre el uso de la plataforma a clientes." },
    ],
  },
  {
    id: "20",
    active: false,
    title: "Asistente Arquitecto Técnico",
    department: "Arquitectura",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/arquitectura.jpg",
    residence: "A determinar (Preferiblemente en la zona de la obra)",
    experience: "Mínimo 3 años",
    description:
      "Buscamos un profesional Arquitecto Técnico o Aparejador para la gestión técnica, económica y documental de proyectos de obra nueva y reforma.",
    education: "Título de Arquitecto Técnico, Aparejador o Grado en Ingeniería de Edificación.",
    requirements: [
      "Dominio avanzado de Mediciones y Presupuestos de obra nueva y reformas.",
      "Manejo experto de software de gestión de costes como Presto, Arquímides o similares.",
      "Dominio de AutoCAD para la lectura y modificación de planos.",
      "Manejo de Excel avanzado aplicado al control de costes y desviaciones económicas.",
    ],
    softSkills: [
      "Fuerte orientación al detalle y precisión en mediciones.",
      "Capacidad de negociación con proveedores y subcontratistas.",
      "Organización y gestión del tiempo para el cumplimiento de hitos.",
    ],
    responsibilities: [
      { titulo: "Elaboración de Mediciones, Presupuestos y Estudios de Coste para las distintas fases del proyecto." },
      { titulo: "Realización de Seguimiento Económico de Obra (control de desviaciones) y gestión de las certificaciones." },
      { titulo: "Garantizar la correcta documentación técnica y legal del proyecto (licencias, permisos)." },
      { titulo: "Negociar y gestionar ofertas de proveedores y subcontratistas." },
    ],
  },
  {
    id: "21",
    active: false,
    title: "Asistente Valoración Inmobiliaria y Tasación",
    department: "Inmobiliaria y Tasación",
    location: "Remoto",
    type: "Tiempo Completo",
    imageUrl: "/img-empleos/inmobiliaria.jpg",
    residence: "Latinoamérica",
    experience: "Mínimo 2 años (Acreditable en valoración y tasación)",
    description:
      "El rol se centra en la aplicación del conocimiento técnico al ámbito financiero e inmobiliario.",
    education: "Ingeniero/a Civil, Arquitecto/a, Arquitecto/a Técnico/a o Ingenierías con especialización en Real Estate.",
    requirements: [
      "Conocimiento técnico y experiencia acreditable de mínimo 2 años en valoración y tasación.",
      "Dominio de modelos avanzados en Excel para estudios de viabilidad económica y financiera.",
      "Habilidad para redactar informes técnicos rigurosos, económicos y de due diligence.",
    ],
    softSkills: [
      "Rigurosidad y precisión en la elaboración de informes.",
      "Capacidad de análisis financiero y técnico.",
    ],
    responsibilities: [
      { titulo: "Realizar valoración y tasación de activos inmobiliarios." },
      { titulo: "Redactar informes rigurosos, económicos y de due diligence técnica." },
      { titulo: "Apoyar al equipo en la gestión integral del ciclo de vida del inmueble." },
    ],
  },
  {
    id: "22",
    active: false,
    title: "Asistente Diseñador UX/UI",
    department: "Diseño UX/UI",
    location: "Remoto",
    type: "Media Jornada con Proyección a Completa",
    imageUrl: "/img-empleos/ux-ui.jpg",
    residence: "A Consultar / Remoto (Latinoamérica)",
    experience: "Comprobable y enfocada en plataformas complejas (ERP/ecommerce/SaaS)",
    description:
      "Rol enfocado en la arquitectura de la experiencia de usuario y la interfaz para plataformas digitales complejas.",
    education: "Licenciatura en Diseño Gráfico, Diseño de Interacción, Informática o campos relacionados.",
    requirements: [
      "Experiencia indispensable en diseño de pantallas y flujos web/móvil enfocados a SaaS/ERP/ecommerce.",
      "Dominio de herramientas de diseño (ej. Figma) para la generación y gestión de componentes.",
      "Experiencia en el desarrollo y mantenimiento de librerías de componentes y Design Systems.",
    ],
    softSkills: [
      "Habilidad para trabajar en equipo y colaborar con desarrolladores y stakeholders.",
      "Proactividad y pensamiento analítico para resolver problemas complejos de usabilidad.",
    ],
    responsibilities: [
      { titulo: "Diseñar interfaces de usuario (UI) atractivas y funcionales." },
      { titulo: "Desarrollar, mantener y documentar librerías de componentes y Design Systems." },
      { titulo: "Participar en la investigación de usuarios y pruebas de usabilidad." },
      { titulo: "Colaborar con el equipo de Front-End." },
    ],
  },
  {
    id: "23",
    active: false,
    title: "Desarrollador/a CMS Java (Magnolia)",
    department: "Tecnología",
    location: "Remoto",
    type: "Contrato Estable",
    imageUrl: "/img-empleos/desarrollo.jpg",
    residence: "LATAM",
    experience: "Experiencia en CMS basados en Java (Magnolia, Liferay, Jahia o similares).",
    description:
      "Únete a nuestro equipo para liderar el desarrollo de soluciones modulares y robustas en el entorno de CMS Java.",
    education: "Formación en Ingeniería de Software, Sistemas o experiencia equivalente.",
    requirements: [
      "Experiencia comprobable en CMS Java (se valorará Magnolia; se acepta Liferay, Jahia, etc.).",
      "Dominio del lenguaje Java para el desarrollo de componentes personalizados.",
      "Experiencia en integración de APIs y sistemas externos.",
    ],
    softSkills: [
      "Proactividad y autonomía para liderar el desarrollo.",
      "Habilidad para colaborar con equipos multifuncionales (UX, diseño, producto).",
    ],
    responsibilities: [
      { titulo: "Desarrollar componentes personalizados y soluciones modulares en el CMS Java." },
      { titulo: "Realizar la integración de APIs y sistemas externos." },
      { titulo: "Configurar plantillas y estructuras de contenido reutilizables." },
      { titulo: "Documentar el código y proveer soporte a otros desarrolladores." },
    ],
  },
  {
    id: "24",
    active: false,
    title: "Asistente Delineante técnico – Arquitectura e Ingeniería",
    department: "Arquitectura",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/arquitectura.jpg",
    residence: "Remoto",
    experience: "Mínimo 3 años de experiencia en delineación de proyectos de construcción o ingeniería civil.",
    description:
      "Rol enfocado en la producción de documentación gráfica de alta calidad y precisión para proyectos de gran escala.",
    education: "Formación profesional superior (FP) o Grado en Delineación, Arquitectura Técnica o Ingeniería Civil.",
    requirements: [
      "Dominio experto y comprobable de AutoCAD y Revit (se requerirá prueba práctica).",
      "Experiencia en la elaboración de planos técnicos y constructivos.",
      "Familiaridad con normativas técnicas de construcción y urbanismo locales.",
    ],
    softSkills: [
      "Alta precisión y atención al detalle en la ejecución de planos.",
      "Habilidad de organización para gestionar archivos, nomenclaturas y versiones.",
    ],
    responsibilities: [
      { titulo: "Elaboración de planos técnicos y constructivos para proyectos de arquitectura e ingeniería." },
      { titulo: "Desarrollo y ajuste de modelos en AutoCAD y Revit." },
      { titulo: "Organización de archivos, nomenclatura y versiones en plataformas colaborativas." },
    ],
  },
  {
    id: "25",
    active: false,
    title: "Asistente Ingeniero/a de Caminos, Canales y Puertos",
    department: "Ingeniería",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/caminos.jpg",
    residence: "Remoto",
    experience: "Mínimo 5 años de experiencia en diseño, dirección o supervisión de proyectos de infraestructura civil.",
    description:
      "Buscamos un Ingeniero/a Senior para liderar y gestionar proyectos de infraestructura civil, desde la fase de planificación hasta la ejecución.",
    education: "Grado o Máster en Ingeniería de Caminos, Canales y Puertos.",
    requirements: [
      "Colegiación vigente y capacidad de firmar proyectos.",
      "Experiencia comprobable en el desarrollo y supervisión de proyectos de infraestructura civil.",
      "Dominio de software de cálculo estructural y modelado (ej. CYPE, Civil 3D).",
    ],
    softSkills: [
      "Capacidad de gestión de equipos multidisciplinarios y contratistas.",
      "Liderazgo, toma de decisiones bajo presión y resolución de problemas.",
    ],
    responsibilities: [
      { titulo: "Desarrollo y supervisión integral de proyectos de infraestructura civil." },
      { titulo: "Elaboración de estudios técnicos, cálculos estructurales, presupuestos y memorias justificativas." },
      { titulo: "Coordinación con equipos multidisciplinarios (arquitectura, topografía, medio ambiente)." },
    ],
  },
  {
    id: "26",
    active: false,
    title: "Asistente de SEO",
    department: "Marketing Digital/SEO",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/marketing.jpg",
    residence: "Remoto",
    experience: "Mínima 2 años",
    description:
      "Buscamos un Experto en SEO para impulsar el posicionamiento orgánico, liderando estrategias de crecimiento orientadas a resultados.",
    education: "Se valorarán estudios en Marketing Digital, Comunicación o similar.",
    requirements: [
      "Experiencia previa comprobable en SEO (mínimo 1–3 años).",
      "Conocimiento actualizado en algoritmos y tendencias de buscadores.",
      "Dominio en la gestión de métricas y reportes (Search Console, Google Analytics, SEMrush o Ahrefs).",
    ],
    softSkills: [
      "Capacidad de análisis para interpretar métricas.",
      "Orientación a resultados y crecimiento orgánico.",
    ],
    responsibilities: [
      { titulo: "Auditar y optimizar sitios web para mejorar el posicionamiento en buscadores." },
      { titulo: "Crear y ejecutar estrategias SEO basadas en objetivos reales de negocio." },
      { titulo: "Gestionar métricas y reportes en herramientas como Search Console y Google Analytics." },
    ],
  },
  {
    id: "27",
    active: false,
    title: "Asistente Contable (España)",
    department: "Administración y Finanzas",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/contable.jpg",
    residence: "Remoto",
    experience: "Experiencia previa en contabilidad y fiscalidad española.",
    description:
      "Buscamos un Asistente Contable proactivo y metódico para gestionar las operaciones diarias de contabilidad y asegurar el cumplimiento de la fiscalidad española.",
    education: "Grado o FP en Administración y Dirección de Empresas, Contabilidad, o similar.",
    requirements: [
      "Experiencia comprobable en la fiscalidad española (impuestos, modelos tributarios, normativa vigente).",
      "Dominio de la Contabilidad General y Analítica (cuentas, conciliaciones, balances, cierres).",
      "Manejo avanzado de herramientas contables (Sage, A3, Holded, o similares) y Excel avanzado.",
    ],
    softSkills: [
      "Atención al detalle y precisión numérica.",
      "Capacidad de organización y gestión documental.",
      "Proactividad y discreción en el manejo de información sensible.",
    ],
    responsibilities: [
      { titulo: "Asegurar el cumplimiento de la fiscalidad española, preparando y presentando los modelos tributarios." },
      { titulo: "Realizar la contabilidad general y analítica, incluyendo conciliaciones bancarias y cierres contables." },
      { titulo: "Gestionar la documentación y realizar trámites con organismos oficiales españoles (AEAT, Seguridad Social)." },
    ],
  },
  {
    id: "28",
    active: false,
    title: "Asistente de Gestión de Proyectos",
    department: "Gestión y Calidad",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/gestion-proyectos.jpg",
    residence: "Remoto",
    experience: "Experiencia en gestión de proyectos formativos, desarrollo de negocio y sectores industriales de alta complejidad.",
    description:
      "Buscamos un profesional para la Gestión de Proyectos, responsable de coordinar y ejecutar la estrategia de formación.",
    education: "Ingeniería o Administración.",
    requirements: [
      "Formación en Ingeniería o Administración.",
      "Experiencia en gestión de proyectos formativos.",
      "Experiencia en desarrollo de negocio y captación/conversión de leads.",
    ],
    softSkills: [
      "Liderazgo y motivación de equipos.",
      "Visión estratégica para el diseño de formación.",
      "Orientación a resultados (monitoreo de KPIs y OKRs).",
    ],
    responsibilities: [
      { titulo: "Diseñar y ejecutar la estrategia de formación." },
      { titulo: "Coordinar la captación de clientes y la conversión de leads." },
      { titulo: "Supervisar el desarrollo y la entrega de programas formativos." },
      { titulo: "Monitorear KPIs y OKRs para asegurar los resultados del área." },
    ],
  },
  {
    id: "29",
    active: false,
    title: "Asistente Virtual Ejecutiva",
    department: "Soporte Ejecutivo",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/negocio.jpg",
    residence: "Remoto",
    experience: "Experiencia previa en roles de soporte ejecutivo, gestión interdepartamental y Back Office.",
    description:
      "Rol de alta confianza, buscando la mano derecha del CEO. Requiere una visión integral del negocio, capacidad de anticipación y liderazgo en la coordinación transversal.",
    education: "A definir (Se valora formación en Gestión Empresarial o similar).",
    requirements: [
      "Experiencia comprobable como soporte ejecutivo o mano derecha de dirección.",
      "Capacidad para la coordinación y gestión interdepartamental.",
      "Conocimiento sólido en gestión operativa, procesos administrativos, contables y logísticos.",
    ],
    softSkills: [
      "Rol de confianza, con visión integral y capacidad de anticipación.",
      "Liderazgo en la coordinación transversal.",
      "Proactividad y enfoque en la escalabilidad y precisión.",
    ],
    responsibilities: [
      { titulo: "Actuar como mano derecha del CEO, anticipando necesidades y manteniendo una visión integral del negocio." },
      { titulo: "Liderar la coordinación transversal de departamentos." },
      { titulo: "Gestionar operativamente procesos administrativos, contables y logísticos." },
    ],
  },
  {
    id: "30",
    active: false,
    title: "Asistente Project Manager",
    department: "Tecnología",
    location: "A Consultar",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/desarrollo.jpg",
    residence: "A Consultar",
    experience: "Experiencia comprobada en gestión de proyectos de desarrollo de software utilizando metodologías ágiles.",
    description:
      "Liderar, planificar y ejecutar proyectos de software, asegurando la entrega exitosa dentro del plazo y presupuesto.",
    education: "Ingeniería en Sistemas, Informática o Computación.",
    requirements: [
      "Dominio de herramientas de Gestión de proyectos: Jira, Trello, Asana o Monday.com.",
      "Certificación o experiencia sólida en Metodologías ágiles (Scrum y Kanban).",
      "Manejo de herramientas de Analítica (Power BI, Tableau, Excel avanzado).",
    ],
    softSkills: [
      "Liderazgo y motivación de equipos técnicos.",
      "Excelentes habilidades de comunicación interpersonal y gestión de stakeholders.",
      "Pensamiento analítico para el monitoreo de métricas (KPIs).",
    ],
    responsibilities: [
      { titulo: "Planificar, ejecutar y cerrar proyectos de software bajo metodologías ágiles." },
      { titulo: "Gestionar el backlog y los sprints utilizando herramientas como Jira o Trello." },
      { titulo: "Facilitar la comunicación y colaboración entre los equipos de desarrollo y otros departamentos." },
    ],
  },
  {
    id: "39",
    active: false,
    title: "Asistente Comercial – Remodelaciones, Reformas y Construcción",
    department: "Ventas y Comercial",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/ventas.jpg",
    residence: "Remoto",
    experience: "2 a 5 años en ventas consultivas en sectores de remodelaciones, acabados, ferretería o construcción.",
    description:
      "Gestionar el ciclo comercial completo, desde la prospección hasta el cierre de proyectos de remodelación y construcción.",
    education: "Técnico o tecnólogo en Construcción, Arquitectura, Ingeniería Civil, Diseño Interior, Marketing o carreras afines.",
    requirements: [
      "Experiencia de 2 a 5 años en ventas consultivas en el sector de la construcción/remodelación.",
      "Conocimientos en Materiales de construcción, Procesos de obra civil y acabados.",
      "Habilidad de negociación y orientación al cierre de ventas.",
    ],
    softSkills: [
      "Capacidad de gestión comercial y atención al cliente.",
      "Habilidades de asesoría técnica para recomendar materiales y soluciones.",
    ],
    responsibilities: [
      { titulo: "Captación activa y desarrollo de nuevos clientes empresariales y residenciales." },
      { titulo: "Realizar visitas técnicas y levantamiento de necesidades y medidas en sitio." },
      { titulo: "Elaborar cotizaciones, presupuestos y propuestas personalizadas de alta calidad." },
    ],
  },
  {
    id: "40",
    active: false,
    title: "Asistente de Seguridad y Salud Laboral",
    department: "Recursos Humanos",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/atencion.jpg",
    residence: "Remoto",
    experience: "Experiencia en prevención de riesgos laborales, cumplimiento normativo y gestión documental.",
    description:
      "Buscamos un Asistente Virtual especializado en Seguridad y Salud Laboral para apoyar la cultura preventiva de la organización.",
    education: "Formación en Seguridad y Salud en el Trabajo o áreas afines.",
    requirements: [
      "Experiencia en prevención de riesgos laborales y conocimiento de la normativa vigente.",
      "Manejo de herramientas digitales y sistemas de gestión (ERP, plataformas de formación online).",
    ],
    softSkills: [
      "Habilidades de comunicación para formar e informar a equipos en remoto.",
      "Organización y rigor para la gestión documental y el cumplimiento legal.",
    ],
    responsibilities: [
      { titulo: "Elaborar y coordinar planes de prevención en colaboración directa con responsables de cada área." },
      { titulo: "Analizar documentación de riesgos, investigar incidentes reportados y proponer medidas correctoras." },
      { titulo: "Gestionar el control horario de los trabajadores a través del ERP, incluyendo el registro de horas extras." },
    ],
  },
  {
    id: "41",
    active: false,
    title: "Asistente Desarrollador Odoo + Shopify",
    department: "Tecnología",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/desarrollo.jpg",
    residence: "Remoto",
    experience: "Experiencia en configuración/personalización de Odoo, integración de plataformas e-commerce (Shopify) y automatización de marketing (Klaviyo).",
    description:
      "Rol clave para la transformación digital, enfocado en el desarrollo de soluciones inteligentes y la automatización.",
    education: "Formación en Ingeniería de Sistemas, Informática, o experiencia comprobable en consultoría ERP/E-commerce.",
    requirements: [
      "Experiencia comprobada en la Configuración y personalización de Odoo.",
      "Dominio de la integración y optimización del flujo entre Shopify y Odoo.",
      "Conocimiento avanzado en el Diseño de automatismos y flujos de marketing en Klaviyo.",
    ],
    softSkills: ["ADN Innovador: pasión por la tecnología y las soluciones inteligentes.", "Orientación a resultados."],
    benefits: [
      "Participación en un proyecto dinámico, con enfoque en transformación digital.",
      "Ambiente innovador, donde se valoran las ideas frescas y la creatividad.",
    ],
    responsibilities: [
      { titulo: "Configurar y personalizar Odoo para maximizar la eficiencia operativa del ERP." },
      { titulo: "Integrar Shopify con Odoo, optimizando el flujo de datos entre el e-commerce y el sistema de gestión." },
      { titulo: "Diseñar, implementar y mantener automatismos y flujos avanzados en Klaviyo." },
    ],
  },
  {
    id: "42",
    active: false,
    title: "Asistente Programador web (Power BI + Integración ERP/CRM)",
    department: "Tecnología",
    location: "A Consultar",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/desarrollo.jpg",
    residence: "A definir",
    experience: "Experiencia en desarrollo, Business Intelligence (Power BI) e integración de sistemas (ERP/CRM).",
    description:
      "Rol clave para transformar datos en información valiosa, centrado en conectar sistemas y crear soluciones que aseguren una visión global y precisa del negocio.",
    education: "Formación en Ingeniería de Sistemas, Informática, o experiencia comprobable en desarrollo y BI.",
    requirements: [
      "Experiencia en el Diseño y creación de dashboards en Power BI.",
      "Conocimiento en Integración de APIs y sincronización de datos entre sistemas (ERP/CRM como Dynamics 365, Odoo).",
      "Habilidades para la Automatización de reportes, métricas y alertas clave.",
    ],
    softSkills: [
      "Detallista, curioso y con pasión por los datos y la integración de sistemas.",
      "Orientación a la automatización y la mejora continua.",
    ],
    benefits: [
      "Incorporación a un proyecto en pleno crecimiento, orientado a la innovación y la digitalización empresarial.",
      "Acceso a tecnologías avanzadas y posibilidad de liderar desarrollos de integración.",
    ],
    responsibilities: [
      { titulo: "Diseñar y crear dashboards en Power BI, conectando múltiples herramientas como Dynamics 365 y Odoo." },
      { titulo: "Asegurar la Integración y sincronización de datos entre plataformas." },
      { titulo: "Automatizar la generación de reportes, métricas y alertas clave." },
    ],
  },
  {
    id: "43",
    active: false,
    title: "Asistente en Gestión WordPress & SEO",
    department: "Tecnología",
    location: "100% Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/desarrollo.jpg",
    residence: "Remoto",
    experience: "Experiencia en desarrollo y optimización de sitios web con WordPress y aplicación de estrategias SEO.",
    description:
      "Serás un/a Especialista en WordPress & SEO que impulsa proyectos digitales, con enfoque en la creación, mantenimiento y optimización de sitios web.",
    education: "Formación en Desarrollo Web, Marketing Digital o experiencia comprobable en el área.",
    requirements: [
      "Experiencia comprobable en WordPress y manejo avanzado de maquetadores como DIVI y Elementor.",
      "Conocimientos avanzados en SEO (Estrategias On-Page y Off-Page).",
      "Capacidad técnica para el mantenimiento y resolución de incidencias.",
    ],
    softSkills: ["Actitud proactiva.", "Orientación a resultados y al cumplimiento de objetivos."],
    responsibilities: [
      { titulo: "Diseñar, desarrollar y optimizar sitios web utilizando WordPress y maquetadores (DIVI/Elementor)." },
      { titulo: "Implementar estrategias de SEO On-Page y Off-Page." },
      { titulo: "Garantizar la velocidad de carga, seguridad y la mejor experiencia de usuario (UX)." },
    ],
  },
  {
    id: "51",
    active: false,
    title: "Experto en Ads (Media Buyer / Estratega de Tráfico Digital)",
    department: "Marketing",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/marketing.jpg",
    residence: "LATAM",
    experience: "Mínimo 2 años gestionando campañas pagas con enfoque en conversión y escalabilidad.",
    description:
      "Buscamos a un estratega que entienda el comportamiento humano detrás de la pantalla. Tu misión será liderar la estrategia de tráfico pagado.",
    education: "Formación en Marketing Digital, Publicidad, Negocios o experiencia comprobable con certificaciones de Ads.",
    requirements: [
      "Experiencia comprobable en gestión de presupuestos publicitarios y optimización de campañas.",
      "Dominio técnico de herramientas de seguimiento: Píxeles, API de Conversiones y GTM.",
      "Experiencia en lectura y reporte de métricas avanzadas (ROAS, CPA, LTV, CTR).",
    ],
    softSkills: [
      "Mentalidad analítica: pasión por entender el 'porqué' de los resultados.",
      "Autonomía y proactividad.",
    ],
    benefits: [
      "100% remoto con libertad geográfica (enfoque LATAM).",
      "Cultura basada en resultados y confianza mutua.",
    ],
    responsibilities: [
      { titulo: "Diseño Estratégico de Embudos: Crear la ruta completa del cliente desde el tráfico frío hasta la conversión." },
      { titulo: "Optimización Técnica: Configurar y auditar píxeles, APIs de conversión y eventos." },
      { titulo: "Análisis de Datos: Monitorear diariamente el rendimiento de las campañas." },
    ],
  },
  {
    id: "52",
    active: false,
    title: "Asistente Desarrollador/a especializado/a en Zoho One",
    department: "Tecnología",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/desarrollo.jpg",
    residence: "LATAM",
    experience: "Experiencia sólida y demostrable en personalización avanzada y automatización dentro del ecosistema Zoho One.",
    description:
      "Buscamos a un experto/a técnico/a que actúe como el arquitecto de nuestro ecosistema Zoho.",
    education: "Ingeniería de Sistemas, Informática o certificaciones oficiales de Zoho (Creator, CRM, Books).",
    requirements: [
      "Experiencia avanzada en Zoho CRM: Configuración de reglas de negocio, Blueprints y Layouts.",
      "Dominio técnico de Zoho Books: Configuración contable, plantillas de facturación y flujos de cobro.",
      "Conocimientos en Integraciones: Uso de Zoho Flow, APIs REST y Webhooks para flujos end-to-end.",
      "Capacidad para escribir funciones personalizadas (Deluge script) para automatizaciones complejas.",
    ],
    softSkills: [
      "Orden y método para la gestión de tareas y documentación técnica.",
      "Comunicación efectiva para reportar avances y explicar funcionalidades.",
    ],
    responsibilities: [
      { titulo: "Optimización de Zoho CRM: Diseñar y mantener la estructura comercial (módulos, pipelines y reglas de aprobación)." },
      { titulo: "Automatización de Procesos: Implementar workflows y alertas que reduzcan la carga operativa manual." },
      { titulo: "Ecosistema Financiero: Configurar Zoho Books para una facturación impecable." },
    ],
  },
  {
    id: "53",
    active: false,
    title: "Asistente Comercial – Reformas y Proyectos (Especialista en Conversión)",
    department: "Ventas y Comercial",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/ventas.jpg",
    residence: "A definir",
    experience: "Mínimo 2 años de trayectoria en atención comercial técnica, idealmente en construcción o reformas integrales.",
    description:
      "El Asistente Comercial es el puente entre el sueño de remodelación del cliente y la ejecución técnica.",
    education: "Formación en Administración, Comercial, Arquitectura técnica o experiencia equivalente en el sector de la edificación.",
    requirements: [
      "Habilidades de Comunicación Premium: Expresión oral y escrita impecable.",
      "Conocimiento del Sector: Entendimiento de partidas de obra, tipos de materiales y fases de reformas.",
      "Dominio de Herramientas Digitales: Excel avanzado y gestión de CRM/WhatsApp Business.",
    ],
    softSkills: [
      "Vocación de Servicio y Paciencia Pedagógica.",
      "Proactividad orientada al seguimiento activo y cierre de operaciones.",
      "Orientación a Resultados.",
    ],
    responsibilities: [
      { titulo: "Captación y Cualificación: Filtrar leads y detectar el potencial real de los proyectos de reforma solicitados." },
      { titulo: "Ingeniería de Propuestas: Confeccionar el desglose de partidas y materiales para entregar presupuestos profesionales." },
      { titulo: "Seguimiento de Funnel: Monitorizar cada presupuesto enviado, resolviendo dudas y empujando hacia la firma del contrato." },
    ],
  },
  {
    id: "54",
    active: false,
    title: "Asistente Técnico/a de Arquitectura y Visualización 3D",
    department: "Arquitectura",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/arquitectura.jpg",
    residence: "Remoto",
    experience: "Junior o Semi-Senior con un portafolio que demuestre habilidades en dibujo técnico y representación visual.",
    description:
      "En este rol, serás el responsable de dar vida a los proyectos arquitectónicos.",
    education: "Arquitectura, Diseño de Interiores, Edificaciones o carreras técnicas de diseño arquitectónico.",
    requirements: [
      "Dibujo Técnico: Manejo fluido de AutoCAD y/o Revit para la creación de documentación de obra.",
      "Visualización 3D: Dominio de software de modelado (SketchUp) y motores de renderizado (Lumion, V-Ray, Twinmotion o Enscape).",
      "Criterio Estético: Buen gusto para la decoración, selección de paletas de colores, texturas e iluminación.",
    ],
    softSkills: [
      "Atención al detalle: Rigor en las medidas y la coherencia visual.",
      "Orientación a la calidad: Búsqueda constante del fotorrealismo y la armonía en los espacios.",
    ],
    responsibilities: [
      { titulo: "Planimetría Técnica: Producir planos ejecutivos que sirvan como base sólida para la construcción o reforma." },
      { titulo: "Modelado 3D: Construir volúmenes digitales precisos que reflejen la realidad del proyecto." },
      { titulo: "Visualización Fotorrealista: Generar imágenes (renders) que transmitan materialidad, luz y atmósfera." },
    ],
  },
  {
    id: "55",
    active: false,
    title: "Asistente de Prospección y Ventas (Mercado Portugal/Brasil)",
    department: "Ventas y Comercial",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/prospeccion.jpg",
    residence: "Remoto",
    experience: "Experto en ventas Outbound, telemarketing estratégico y análisis de mercados internacionales.",
    description:
      "Buscamos la 'punta de lanza' de nuestra fuerza comercial en los mercados de habla portuguesa.",
    education: "Formación en Comercio Internacional, Marketing, Ventas o experiencia equivalente demostrable.",
    requirements: [
      "Competencia Lingüística: Portugués nivel C1 o Nativo con excelente dicción.",
      "Habilidades Comerciales: Experiencia en gestión de objeciones y cierres telefónicos.",
      "Dominio Tecnológico: Uso avanzado de CRM y herramientas de búsqueda de leads (LinkedIn Sales Navigator, etc.).",
    ],
    softSkills: [
      "Resiliencia: Actitud positiva frente al rechazo y perseverancia en la prospección.",
      "Adaptabilidad Cultural: Sensibilidad para alternar entre la formalidad lusa y el dinamismo brasileño.",
    ],
    benefits: [
      "Impacto directo en el crecimiento global de la empresa.",
      "Cultura de confianza y autonomía basada en resultados.",
    ],
    responsibilities: [
      { titulo: "Inteligencia de Negocio: Detectar oportunidades analizando las debilidades y fortalezas de la competencia local." },
      { titulo: "Prospección Outbound: Liderar el esfuerzo de Cold Calling para abrir puertas en empresas de Portugal y Brasil." },
      { titulo: "Cualificación de Leads: Asegurar que los prospectos en el pipeline cumplen con el perfil de cliente ideal." },
    ],
  },
  {
    id: "56",
    active: false,
    title: "Asistente de Backoffice Logístico y Control de Datos",
    department: "Tecnología",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/gestion.jpg",
    residence: "A definir",
    experience: "Perfil con experiencia en procesamiento masivo de datos, validación de inventarios o soporte administrativo logístico.",
    description:
      "El objetivo de este rol es ser el guardián de la consistencia de los datos operativos.",
    education: "Formación técnica o profesional en Administración, Logística, Contabilidad o áreas afines.",
    requirements: [
      "Habilidades de Data Entry: Velocidad y precisión comprobable en carga de datos alfanuméricos.",
      "Excel Operativo: Capacidad para organizar datos, aplicar filtros y detectar inconsistencias.",
      "Sistemas de Gestión: Familiaridad con entornos ERP o WMS para la trazabilidad de stock.",
    ],
    softSkills: [
      "Atención al Detalle: Capacidad para detectar discrepancias mínimas en grandes volúmenes de datos.",
      "Alta Concentración: Resiliencia para ejecutar tareas repetitivas manteniendo el estándar de calidad.",
    ],
    responsibilities: [
      { titulo: "Transcripción y digitalización de documentos operativos (albaranes, facturas, packing lists)." },
      { titulo: "Carga y validación de datos en el sistema ERP o WMS siguiendo los SOPs definidos." },
      { titulo: "Identificación y reporte de anomalías o discrepancias en la documentación." },
    ],
  },
  {
    id: "58",
    active: false,
    title: "Asistente Desarrollador/a Full Stack (React + .NET)",
    department: "Tecnología",
    location: "Remoto",
    type: "Jornada Completa",
    imageUrl: "/img-empleos/desarrollo.jpg",
    residence: "Remoto",
    experience: "Experiencia real y reciente en React y .NET (Indispensable/Limitativo).",
    description:
      "Buscamos un/a Desarrollador/a Full Stack para construir y evolucionar funcionalidades end-to-end, asegurando calidad, performance y despliegues confiables.",
    education: "Ingeniería de Sistemas, Informática o experiencia equivalente.",
    requirements: [
      "Experiencia real y reciente con React + .NET (Indispensable/Limitativo).",
      "Conocimientos sólidos en desarrollo Frontend (componentización, gestión de estado).",
      "Experiencia avanzada en desarrollo Backend (APIs, patrones de arquitectura y seguridad).",
    ],
    softSkills: [
      "Agilidad Técnica: Capacidad para resolver retos complejos en plazos breves.",
      "Atención al Detalle: Rigor en la escritura de código limpio y documentado.",
    ],
    benefits: [
      "Entorno de trabajo enfocado en las mejores prácticas de ingeniería.",
      "Flexibilidad total y trabajo 100% remoto.",
    ],
    responsibilities: [
      { titulo: "Desarrollo End-to-End: Liderar la creación de nuevas características desde la base de datos hasta la interfaz de usuario." },
      { titulo: "Optimización de Sistemas: Identificar cuellos de botella en performance y proponer refactorizaciones." },
      { titulo: "Garantía de Calidad: Implementar estrategias de testing que aseguren la estabilidad de los despliegues." },
    ],
  },
  {
  id: "59",
  active: false,
  title: "Asistente Comercial – Desarrollo de Negocio",
  department: "Ventas y Comercial",
  location: "Remoto",
  type: "Media Jornada (Evolutivo a Completa)",
  imageUrl: "/img-empleos/negocio.jpg",
  residence: "Remoto",
  experience: "Experiencia en ventas consultivas B2B y cierre de negocios.",
  description:
    "Buscamos un profesional orientado a resultados para convertir leads en clientes activos, asegurando el crecimiento sostenible y la escalabilidad de uno de nuestros clientes más estratégicos.",
  education: "Formación en Ventas, Negocios, Tecnología o experiencia equivalente.",
  requirements: [
    "Mentalidad comercial con fuerte enfoque en el cierre de ventas.",
    "Capacidad para realizar consultoría técnica (rentabilidad, coste por copia, soporte).",
    "Manejo avanzado de herramientas CRM para control de flujo comercial.",
  ],
  softSkills: [
    "Autogestión: Capacidad para organizar tiempos y cumplir objetivos de escalabilidad.",
    "Comunicación Consultiva: Habilidad para generar confianza y seguridad en el cliente.",
  ],
  benefits: [
    "Posibilidad real de pasar a jornada completa según cumplimiento de objetivos.",
    "Entorno dinámico en el sector de consultoría tecnológica.",
    "Modalidad 100% remota con autonomía de gestión.",
  ],
  responsibilities: [
    { titulo: "Cierre de Ventas: Convertir leads interesados en clientes activos como prioridad actual." },
    { titulo: "Gestión de CRM: Control total del flujo comercial en Zynk, reportes y seguimientos." },
    { titulo: "Consultoría Técnica: Comunicar la rentabilidad del servicio y el valor del soporte técnico." },
    { titulo: "Prospección B2B: Identificación futura de nuevas oportunidades y contacto en frío." },
  ],
},
{
  id: "66",
  active: true,
  title: "Asistente SDR / Comercial Telefónica",
  department: "Ventas y Comercial",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/comunicacion.jpg",
  residence: "Remoto",
  experience: "Mínimo 2 años en roles de prospección activa, televenta o SDR.",
  description:
    "Buscamos una profesional con marcada orientación a resultados y comunicación verbal impecable para liderar la prospección activa y generación de citas en el mercado español.",
  education: "Formación en Comunicación, Mercadeo o carreras afines.",
  requirements: [
    "Experta en Cold Calling con alta capacidad de persuasión y resiliencia.",
    "Excelente dicción y manejo de modismos de España (Indispensable para generar confianza).",
    "Manejo de CRM para reporte de actividad y seguimiento riguroso de leads.",
  ],
  softSkills: [
    "Inteligencia de Negocio: Capacidad para investigar prospectos y adaptar el discurso.",
    "Resiliencia: Mentalidad positiva y persistencia ante el rechazo comercial.",
  ],
  benefits: [
    "Oportunidad de crecimiento en un entorno comercial de alto rendimiento.",
    "Trabajo 100% remoto con objetivos claros y medibles.",
    "Estabilidad profesional en un equipo orientado a la expansión internacional.",
  ],
  responsibilities: [
    { titulo: "Prospección Activa: Ejecución de fuerza comercial mediante llamadas en frío a empresas objetivo." },
    { titulo: "Generación de Citas: Agendamiento de reuniones cualificadas mediante una comunicación impecable." },
    { titulo: "Investigación de Mercado: Detección de necesidades y adaptación del discurso según perfil B2B/B2C." },
    { titulo: "Gestión de Datos: Registro y seguimiento exhaustivo de la actividad comercial en el CRM." },
  ],
},

{
  id: "67",
  active: false,
  title: "Asistente de Desarrollo Full Stack",
  department: "Tecnología",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/desarrollo.jpg",
  residence: "Remoto",
  experience: "Base técnica sólida en desarrollo web y resolución de bugs en entornos exigentes.",
  description:
    "Buscamos un perfil proactivo para dar soporte al ciclo de vida de aplicaciones web, desde la implementación de componentes en el frontend hasta el mantenimiento de lógica compleja en el backend.",
  education: "Ingeniería de Sistemas, Programación o experiencia técnica demostrable.",
  requirements: [
    "Stack Tecnológico: Dominio sólido de Node.js, Express y React.",
    "Bases de Datos: Experiencia en MySQL (diseño, optimización y consultas).",
    "Lógica de Servidor: Conocimiento indispensable en paginación, filtrado y validaciones.",
    "Entornos: Familiaridad con Linux, AWS y gestión de versiones (GitLab/GitHub).",
    "Inglés Técnico: Nivel suficiente para lectura y aplicación de documentación.",
  ],
  softSkills: [
    "Pensamiento Lógico: Capacidad para desglosar problemas complejos en soluciones sencillas.",
    "Comunicación en Remoto: Habilidad para reportar bloqueos y proponer mejoras técnicas.",
  ],
  benefits: [
    "Integración en un equipo remoto profesional y colaborativo.",
    "Oportunidad de crecimiento técnico bajo estándares de alta calidad.",
    "Participación directa en proyectos de lógica de negocio (ERP/CRM).",
  ],
  responsibilities: [
    { titulo: "Soporte en Desarrollo: Colaborar en la construcción de apps completas usando React y Node.js." },
    { titulo: "Gestión de Datos: Implementar lógicas de paginación y filtrado desde el servidor." },
    { titulo: "Mantenimiento y Debugging: Diagnosticar y resolver bugs mediante análisis lógico profundo." },
    { titulo: "Documentación y Orden: Escribir código estructurado, limpio y comentado para trabajo colaborativo." },
    { titulo: "Adaptabilidad Tecnológica: Capacidad para trabajar con frameworks como AngularJS o Loopback si el proyecto lo requiere." },
  ],
},
{
  id: "68",
  active: true,
  title: "Asistente Especialista en ERP Odoo",
  department: "Tecnología",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/odo.jpg",
  residence: "Remoto",
  experience: "Experiencia avanzada en personalización, desarrollo y mantenimiento de ecosistemas Odoo.",
  description:
    "Liderar la gestión, optimización y mantenimiento del ecosistema Odoo para garantizar la fluidez de las operaciones globales, asegurando la integración perfecta entre ventas, inventario y finanzas.",
  education: "Ingeniería de Sistemas, Informática o certificaciones especializadas en Odoo.",
  requirements: [
    "Desarrollo Técnico: Dominio de Python y XML para la creación y modificación de flujos (herencia de Odoo).",
    "Gestión de Módulos: Conocimiento profundo en Ventas, Inventario, Compras, Contabilidad y CRM.",
    "Infraestructura: Experiencia gestionando Odoo.sh o servidores propios y conexiones vía API.",
    "Integraciones Externas: Capacidad para supervisar conexiones con Shopify, Amazon y operadores logísticos.",
  ],
  softSkills: [
    "Resolución de Problemas: Capacidad para actuar como nivel máximo de soporte ante fallos críticos.",
    "Visión Global: Entendimiento de la trazabilidad de stock y control de pedidos internacionales.",
  ],
  benefits: [
    "Rol estratégico liderando la transformación digital de una marca global.",
    "Entorno de trabajo remoto de alto impacto técnico.",
    "Oportunidad de gestionar integraciones complejas con grandes canales de venta.",
  ],
  responsibilities: [
    { titulo: "Configuración y Parametrización: Personalización avanzada de módulos clave según necesidades del negocio." },
    { titulo: "Desarrollo y Adaptación: Creación de workflows, vistas y reportes personalizados." },
    { titulo: "Gestión Multialmacén: Supervisión técnica de la trazabilidad y control de stock internacional." },
    { titulo: "Soporte Técnico: Resolución de incidencias críticas, errores de sistema y duplicidades de datos." },
    { titulo: "Mantenimiento de Sistemas: Gestión de servidores y supervisión de integraciones API externas." },
  ],
},
{
  id: "69",
  active: true,
  title: "Asistente Comercial – Sector Juguetes (Mercado Europa)",
  department: "Ventas y Comercial",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/ventas.jpg",
  residence: "Remoto",
  experience: "Experiencia sólida en ventas B2B internacionales y apertura de mercados europeos.",
  description:
    "No buscamos un vendedor convencional, sino un estratega capaz de posicionar una marca premium en toda Europa mediante la captación de distribuidores clave y la gestión de grandes cuentas.",
  education: "Negocios Internacionales, Comercio, Marketing o experiencia equivalente en el sector.",
  requirements: [
    "Experiencia comprobable en ventas B2B internacionales (idealmente sector juguete o lifestyle).",
    "Conocimiento profundo del mercado europeo y sus dinámicas de consumo.",
    "Habilidad avanzada para negociar márgenes, condiciones logísticas y acuerdos anuales.",
    "Capacidad para representar la marca en ferias internacionales del sector.",
  ],
  softSkills: [
    "Visión Estratégica: Capacidad para convertir relaciones en crecimiento sostenible.",
    "Autonomía: Perfil orientado a resultados con alta capacidad de autogestión.",
    "Habilidades Relacionales: Disfrute por construir y mantener vínculos comerciales a largo plazo.",
  ],
  benefits: [
    "Liderazgo en la expansión de una marca Premium/Vintage con gran proyección.",
    "Rol de alto nivel con enfoque en estrategia y expansión, no operativo.",
    "Oportunidad de desarrollo en mercados internacionales de primer nivel.",
  ],
  responsibilities: [
    { titulo: "Apertura de Mercados: Identificar y captar distribuidores, concept stores y tiendas boutique en Europa." },
    { titulo: "Gestión de Cuentas B2B: Asegurar la rotación, recompra y cumplimiento de objetivos anuales." },
    { titulo: "Negociación Estratégica: Definir tarifas y condiciones logísticas competitivas." },
    { titulo: "Análisis de Tendencias: Colaborar con marketing para adaptar la estrategia a las necesidades locales europeas." },
    { titulo: "Representación de Marca: Actuar como embajador en los eventos y ferias más importantes del sector infantil." },
  ],
},

{
  id: "70",
  active: false,
  title: "Asistente Analista Ecommerce & Marketplaces",
  department: "Ecommerce",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/ecomerce.jpg",
  residence: "Remoto",
  experience: "Experiencia comprobable en gestión de pedidos y operación en marketplaces (Amazon, eBay, etc.).",
  description:
    "Buscamos un perfil operativo y analítico enfocado en la calidad. Tu misión será la gestión y procesamiento integral de pedidos, asegurando la precisión de los datos y la trazabilidad en cada orden.",
  education: "Administración, Logística, Comercio Electrónico o experiencia equivalente.",
  requirements: [
    "Experiencia real trabajando con alto volumen de pedidos en Amazon, eBay u otros marketplaces.",
    "Dominio de Excel nivel intermedio-avanzado para control y conciliación de información.",
    "Capacidad de transcripción y validación de datos con alta precisión.",
    "Conocimiento en el flujo de procesamiento de pedidos end-to-end.",
  ],
  softSkills: [
    "Atención al Detalle: Perfil metódico y organizado con un enfoque obsesivo en la calidad.",
    "Disciplina: Capacidad para mantener el orden en tareas operativas repetitivas.",
    "Orientación a Resultados: Enfoque en el cumplimiento de tiempos y trazabilidad operativa.",
  ],
  benefits: [
    "Trabajo 100% remoto con autonomía en la gestión operativa.",
    "Oportunidad de integrarse a un ecosistema de ecommerce internacional.",
    "Estabilidad profesional en un rol crítico para la cadena de valor.",
  ],
  responsibilities: [
    { titulo: "Procesamiento de Órdenes: Gestión integral de pedidos desde la recepción hasta la validación final." },
    { titulo: "Operación de Marketplaces: Ejecución de tareas operativas en plataformas como Amazon y eBay." },
    { titulo: "Control de Calidad: Validar información crítica para evitar errores operativos y duplicidades." },
    { titulo: "Monitoreo de SLAs: Garantizar el cumplimiento de los tiempos de respuesta y entrega." },
    { titulo: "Apoyo Operativo: Colaborar en la conciliación de información y control del canal de ecommerce." },
  ],
},

{
  id: "71",
  active: true,
  title: "Diseñador/a Web + Creativo/a Digital",
  department: "Marketing",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/diseño.jpg",
  description:
    "Buscamos Diseñador/a Web + Creativo/a Digital. 60% creativo, 40% técnico. No buscamos a alguien que solo haga piezas lindas. Buscamos a una persona con criterio visual, mentalidad de marketing y capacidad real para ejecutar en web sin depender de terceros para cada ajuste.",
  requirements: [
    "Diseñar contenido para redes y ads con identidad de marca.",
    "Entender que diseñar también es convertir.",
    "Editar videos cortos y dinámicos para social media.",
    "Maquetar en WordPress + Elementor Pro con autonomía.",
    "Bases sólidas de HTML/CSS para resolver detalles que el editor visual no cubre.",
    "Pensar en UX/UI, orden visual, jerarquía y experiencia de usuario.",
  ],
  responsibilities: [
    { titulo: "Crear piezas para Instagram, LinkedIn y campañas Ads." },
    { titulo: "Diseñar y maquetar landing pages de alto impacto." },
    { titulo: "Actualizar contenidos web sin miedo a romper nada." },
    { titulo: "Optimizar imágenes, estructura y elementos visuales para mejorar conversión." },
    { titulo: "Editar Reels y videos cortos para dinamizar la marca." },
    { titulo: "Aportar criterio en diseño orientado a resultados." },
  ],
  otherSkills: [
    "Adobe Photoshop",
    "Illustrator",
    "Figma",
    "WordPress + Elementor Pro",
    "HTML/CSS",
  ],
  softSkills: [
    "Autonomía.",
    "Criterio visual y comercial.",
    "Velocidad de ejecución.",
    "Atención al detalle.",
    "Capacidad de proponer, no solo de ejecutar.",
  ],
  url: "",
},

{
  id: "72",
  active: true,
  title: "Paid Media Specialist",
  department: "Marketing",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/marketing.jpg",
  description:
    "Buscamos Paid Media Specialist para uno de nuestros clientes más estratégicos. No buscamos a alguien que solo monte campañas. Buscamos a alguien que entienda cómo vender con pauta, con pensamiento estratégico, criterio analítico y capacidad técnica para ejecutar, medir y optimizar campañas.",
  requirements: [
    "Creación de campañas en Meta Ads con enfoque en conversión.",
    "Segmentación por intereses, comportamientos y audiencias.",
    "Desarrollo de lookalikes y campañas de retargeting.",
    "Gestión de campañas en Google Ads Search para captar intención de compra.",
    "Implementación de campañas en Display y YouTube para reconocimiento de marca.",
    "Configuración de Meta Pixel, API de Conversiones y seguimiento con Google Tag Manager.",
    "Lectura e interpretación de métricas clave: CTR, CPC, CPA y ROAS.",
    "Optimización constante para bajar costo por resultado y mejorar retorno.",
    "Redacción de anuncios que conecten con el dolor, deseo o necesidad del cliente.",
  ],
  responsibilities: [
    { titulo: "No lanzar campañas a ciegas." },
    { titulo: "Saber medir antes de optimizar." },
    { titulo: "Entender el negocio detrás de los números." },
    { titulo: "Tener criterio para tomar decisiones, no solo seguir instrucciones." },
    { titulo: "Convertir datos en acciones concretas." },
  ],
  otherSkills: [
    "Meta Business Manager",
    "Google Ads",
    "Google Tag Manager",
    "Meta Pixel + API de Conversiones",
    "GA4",
    "Looker Studio",
  ],
  url: "",
},

{
  id: "73",
  active: true,
  title: "Asistente de Arquitectura",
  department: "Arquitectura",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/arquitectura.jpg",
  description:
    "No buscamos a alguien que solo modele en 3D. Buscamos a una persona capaz de transformar productos en activos digitales inteligentes, listos para que arquitectos e interioristas los integren en sus proyectos de forma técnica, precisa y profesional.",
  requirements: [
    "Crear y parametrizar familias en Revit e IFC.",
    "Cargar información técnica real: materiales, dimensiones, datos acústicos y acabados.",
    "Asegurar que los modelos encajen correctamente en proyectos arquitectónicos.",
    "Mantener actualizado el catálogo en pCon Planner.",
    "Configurar texturas, colores y acabados según nuevos lanzamientos.",
    "Mejorar la representación visual de los productos para uso comercial y técnico.",
    "Colaborar en la creación de manuales de montaje claros y funcionales.",
    "Diseñar pensando no solo en lo digital, sino también en la instalación real en obra.",
  ],
  responsibilities: [
    { titulo: "Criterio técnico y orden en la parametrización." },
    { titulo: "Visión práctica para reducir errores de instalación." },
    { titulo: "Atención al detalle en catálogos, modelos y acabados." },
    { titulo: "Capacidad para conectar diseño, producto y ejecución." },
  ],
  otherSkills: [
    "Revit",
    "IFC",
    "pCon Planner",
    "Modelado BIM",
  ],
  url: "",
},

{
  id: "74",
  active: true,
  title: "Asistente de Ventas y Comercio Electrónico (Sector Inmobiliario)",
  department: "Ventas y Comercial",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/inmobiliaria.jpg",
  description:
    "Buscamos un profesional eficiente para brindar soporte operativo y potenciar nuestras ventas mediante la gestión integral de plataformas e-commerce y atención al cliente.",
  requirements: [
    "Experiencia comprobable en ventas digitales, servicio al cliente y administración de tiendas online o marketplaces.",
    "Conocimientos prácticos en marketing digital básico y gestión de catálogos.",
    "Excelente comunicación escrita y verbal.",
    "Orientación al cliente, proactividad y capacidad de organización.",
    "Experiencia en el sector inmobiliario.",
  ],
  responsibilities: [
    { titulo: "Seguimiento integral de clientes y gestión operativa del ciclo de pedidos." },
    { titulo: "Manejo, actualización y optimización continua de plataformas de comercio electrónico." },
    { titulo: "Estructuración y preparación de propuestas comerciales y ofertas para prospectos." },
    { titulo: "Apoyo en la ejecución de estrategias de marketing digital básico, incluyendo la administración de catálogos, promociones y redes sociales corporativas." },
  ],
  url: "",
},

{
  id: "75",
  active: true,
  title: "Administrativo/a Bilingüe (Proyectos y Reformas)",
  department: "Administración",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/reformas.jpg",
  description:
    "Buscamos un profesional organizado y eficiente para brindar soporte integral a nuestros proyectos de reforma y montaje, asegurando el control operativo, financiero y de atención al cliente.",
  requirements: [
    "Dominio del idioma inglés (indispensable).",
    "Experiencia comprobable en roles de administración, facturación y trato directo con clientes o proveedores, preferiblemente en el sector de reformas o construcción.",
    "Alta capacidad de organización y atención al detalle.",
    "Habilidades para la resolución de incidencias en la postventa.",
  ],
  responsibilities: [
    { titulo: "Gestión integral de pedidos y coordinación directa con proveedores del sector." },
    { titulo: "Atención al cliente y administración eficiente de la agenda de mediciones." },
    { titulo: "Soporte administrativo continuo a la ejecución de proyectos de reforma y montaje." },
    { titulo: "Control riguroso del ciclo financiero: emisión y seguimiento de facturación, cobros y albaranes." },
    { titulo: "Gestión completa del servicio de postventa y tramitación de garantías." },
  ],
},

{
  id: "76",
  active: false,
  title: "Asistente de Ventas y Comercio Electrónico (Sector Inmobiliario)",
  department: "Ventas y Comercial",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/inmobiliaria.jpg",
  description:
    "Buscamos un profesional eficiente para brindar soporte operativo y potenciar nuestras ventas mediante la gestión integral de plataformas e-commerce y atención al cliente.",
  requirements: [
    "Experiencia comprobable en ventas digitales, servicio al cliente y administración de tiendas online o marketplaces.",
    "Conocimientos prácticos en marketing digital básico y gestión de catálogos.",
    "Excelente comunicación escrita y verbal.",
    "Orientación al cliente, proactividad y capacidad de organización para manejar múltiples requerimientos a la vez.",
    "Experiencia en el sector inmobiliario.",
  ],
  responsibilities: [
    { titulo: "Seguimiento integral de clientes y gestión operativa del ciclo de pedidos." },
    { titulo: "Manejo, actualización y optimización continua de plataformas de comercio electrónico." },
    { titulo: "Estructuración y preparación de propuestas comerciales y ofertas para prospectos." },
    { titulo: "Apoyo en la ejecución de estrategias de marketing digital básico, incluyendo la administración de catálogos, promociones y redes sociales corporativas." },
  ],
},

{
  id: "77",
  active: false,
  title: "Marketing Operations Specialist",
  department: "Marketing",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/marketing.jpg",
  description:
    "¿Tienes experiencia optimizando procesos de marketing, automatizando flujos y gestionando CRM a nivel avanzado? Buscamos un/a Marketing Operations Specialist con perfil estratégico, operativo y analítico, con foco en eficiencia, automatización y medición. Este rol NO es 100% creativo ni comercial.",
  requirements: [
    "Dominio administrador/avanzado de Zoho CRM.",
    "Manejo de herramientas de IA y productividad como Claude, ChatGPT y Notion.",
    "Inglés C1 obligatorio. Se valoran idiomas adicionales: Francés, Italiano o Alemán.",
    "Alta capacidad analítica y orientación a KPIs.",
    "Orden, autonomía y atención al detalle.",
    "Experiencia comprobable mejorando procesos de marketing y operaciones.",
  ],
  responsibilities: [
    { titulo: "Administrar y optimizar Zoho CRM a nivel avanzado, incluyendo creación y gestión de Blueprints y Workflows." },
    { titulo: "Integrar herramientas de IA y productividad para agilizar procesos operativos del área de marketing." },
    { titulo: "Monitorear y analizar KPIs clave: CAC (Coste de Adquisición de Cliente), ROI (Retorno de Inversión en Ferias y Showrooms) y NPS (Net Promoter Score)." },
    { titulo: "Dar seguimiento al rendimiento de campañas, ferias y showrooms." },
    { titulo: "Proponer mejoras continuas basadas en datos y resultados para optimizar conversión y experiencia del cliente." },
  ],
},
{
  id: "78",
  active: false,
  title: "Especialista SEO & Content Marketing",
  department: "Marketing",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/comunicacion.jpg",
  residence: "Remoto",
  description:
    "Buscamos un/a especialista en SEO y marketing de contenidos con capacidad para posicionar marcas en Google y construir estrategias editoriales que generen tráfico orgánico real. No queremos alguien que solo escriba blogs: necesitamos a quien sepa investigar keywords, auditar sitios, optimizar on-page y medir resultados con datos.",
  requirements: [
    "Experiencia comprobable en SEO on-page y off-page (mínimo 2 años).",
    "Dominio de herramientas como Ahrefs, SEMrush, Google Search Console y Google Analytics.",
    "Capacidad de redacción de contenido optimizado en español (inglés es un plus).",
    "Conocimientos de WordPress y/o editores web modernos.",
    "Experiencia con estrategias de link building y contenido evergreen.",
    "Autonomía, pensamiento analítico y orientación a resultados.",
  ],
  responsibilities: [
    { titulo: "Realizar auditorías SEO completas y proponer planes de acción con prioridades claras." },
    { titulo: "Investigar keywords y crear calendarios editoriales alineados a la estrategia comercial del cliente." },
    { titulo: "Redactar y optimizar contenido para blogs, landing pages y fichas de producto." },
    { titulo: "Monitorear rankings, tráfico orgánico y conversiones, reportando resultados mensualmente." },
    { titulo: "Coordinar con equipos de diseño y desarrollo para implementar mejoras técnicas de SEO." },
  ],
},
{
  id: "79",
  active: true,
  title: "Social Media Manager",
  department: "Marketing",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/marketing.jpg",
  residence: "Remoto",
  description:
    "Buscamos un/a Social Media Manager con ojo creativo y mentalidad estratégica. No buscamos a alguien que solo programe posts: necesitamos a quien entienda audiencias, construya comunidad y convierta seguidores en clientes reales. Vas a gestionar las redes de clientes en sectores diversos, desde retail hasta servicios profesionales.",
  requirements: [
    "Experiencia mínima de 2 años gestionando redes sociales para marcas o empresas.",
    "Dominio de Meta Business Suite, Instagram, LinkedIn, TikTok y herramientas de programación (Metricool, Hootsuite o similar).",
    "Capacidad de creación de contenido visual básico (Canva, CapCut o similar).",
    "Conocimientos de copywriting y storytelling para redes.",
    "Capacidad analítica para interpretar métricas y ajustar estrategia.",
    "Español nativo. Inglés intermedio es un plus.",
  ],
  responsibilities: [
    { titulo: "Diseñar y ejecutar estrategias de contenido para redes sociales de múltiples clientes." },
    { titulo: "Crear calendarios editoriales mensuales alineados a los objetivos comerciales de cada cuenta." },
    { titulo: "Gestionar comunidades: responder comentarios, mensajes y generar engagement real." },
    { titulo: "Analizar métricas semanales (alcance, interacciones, conversiones) y proponer mejoras basadas en datos." },
    { titulo: "Coordinar con equipos de diseño y paid media para campañas integradas." },
  ],
},
{
  id: "80",
  active: true,
  title: "Asistente de Marketing Digital Integral",
  department: "Marketing",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/prospeccion.jpg",
  residence: "Remoto",
  description:
    "Buscamos un perfil versátil de marketing digital que pueda cubrir múltiples frentes: desde redes sociales y email marketing hasta automatizaciones básicas y reportes. Ideal para alguien que domina varias herramientas y se adapta rápido a distintos sectores. Si te gusta tocar un poco de todo y hacerlo bien, esta posición es para ti.",
  requirements: [
    "Experiencia mínima de 1 año en marketing digital (agencia o in-house).",
    "Manejo de al menos 3 de estas herramientas: Google Ads, Meta Ads, Mailchimp/ActiveCampaign, Canva, Google Analytics, CRM (Zoho/HubSpot).",
    "Capacidad de redacción publicitaria en español.",
    "Nociones de SEO, email marketing y automatización de flujos.",
    "Proactividad, organización y capacidad de gestionar múltiples cuentas simultáneamente.",
    "Español nativo. Inglés básico-intermedio.",
  ],
  responsibilities: [
    { titulo: "Ejecutar campañas de marketing digital end-to-end: desde la planificación hasta el reporte de resultados." },
    { titulo: "Gestionar redes sociales, email marketing y pauta digital según las necesidades de cada cliente." },
    { titulo: "Configurar automatizaciones básicas en CRM y herramientas de email marketing." },
    { titulo: "Generar reportes mensuales de rendimiento con métricas clave y recomendaciones accionables." },
    { titulo: "Apoyar en la creación de contenido gráfico y copywriting para distintos canales." },
  ],
},

{
  id: "81",
  active: true,
  title: "Marketing Lead",
  department: "Marketing",
  location: "Remoto",
  type: "Jornada Completa",
  imageUrl: "/img-empleos/negocio.jpg",
  description:
    "Líder estratégico de la operación de marketing automatizado para PYMEs en España. No ejecuta contenido: analiza, diseña estrategia por cliente, y dirige al equipo que ejecuta. Es el DT del área.",
  responsibilities: [
    { titulo: "Analizar cada cliente nuevo: industria, puntos de dolor, competencia, oportunidades." },
    { titulo: "Definir estrategia de contenido y automatización por cliente (canales, frecuencia, mensaje)." },
    { titulo: "Bajar la estrategia al equipo de ejecución (mid + junior)." },
    { titulo: "Monitorear KPIs y resultados por cliente, ajustar estrategia en base a datos." },
    { titulo: "Gestionar encuestas de satisfacción y feedback loops con clientes." },
    { titulo: "Reportar resultados mensuales y proponer mejoras." },
  ],
  requirements: [
    "3+ años gestionando estrategia de marketing digital para múltiples clientes o marcas (portfolio obligatorio).",
    "Experiencia liderando equipos o freelancers de contenido/diseño.",
    "Capacidad analítica: sabe leer métricas, sacar conclusiones y cambiar rumbo.",
    "Experiencia con herramientas de analytics (Google Analytics o similares).",
    "Conocimiento de email marketing y automatización (Brevo, Mailchimp, ActiveCampaign).",
    "Español nativo + inglés intermedio-avanzado.",
  ],
  softSkills: [
    "Familiaridad con herramientas de IA generativa (ChatGPT, Claude).",
    "Visión de automatización.",
    "Proactivo.",
    "Versatilidad entre industrias.",
  ],
},


];

// =============================================================================
// Helpers — usados directamente en los componentes
// =============================================================================

/** Todos los img-empleos activos, para el listado en Img-img-empleos.tsx */
export const ACTIVE_JOBS = JOBS.filter((j) => j.active);

/** Índice por id para búsqueda O(1) en DetallesDeEmpleo.tsx */
export const JOBS_BY_ID: Record<string, Job> = Object.fromEntries(
  JOBS.map((j) => [j.id, j])
);

// =============================================================================
// Departamentos para el filtro
// Agrega aquí los nuevos departamentos cuando sea necesario.
// =============================================================================
export const DEPARTMENTS = [
  "Todos",
  "Gestión y Calidad",
  "Marketing",
  "Tecnología",
  "Ventas y Comercial",
  "Proyectos Acústicos",
  "Ecommerce",
  "Arquitectura",
  "Administración",
  // "Recursos Humanos",
  // "Dirección Ejecutiva",
  // "Comercio Exterior",
];

// =============================================================================
// Traducciones EN — títulos, descripciones, departamentos, tipos
// =============================================================================

export const JOBS_EN: Record<string, { title: string; description: string; responsibilities?: { titulo: string; detalle?: string[] }[]; requirements?: string[]; experience?: string; education?: string; benefits?: string[] }> = {
  "9": {
    title: "AI & Automation Virtual Assistant",
    description: "We're looking for the driving force behind our company's operational innovation. Your mission will be to identify bottlenecks and transform them into autonomous workflows using No-Code/Low-Code tools and Artificial Intelligence. The goal is to maximize productivity and ensure seamless, error-free information flow across departments.",
    responsibilities: [
      { titulo: "Design, test and deploy complex automations in Make (required) and Zapier." },
      { titulo: "Implement and optimize AI agents based on LLMs (ChatGPT, Gemini) for operational tasks." },
      { titulo: "Connect internal and external systems through API (JSON) and Webhook integration." },
      { titulo: "Maintain and optimize existing workflows (error handling) to reduce costs." },
      { titulo: "Manage data across platforms and build dashboards in Power BI." },
      { titulo: "Configure and automate workspaces in collaborative tools (Notion, Trello, M365)." },
    ],
    requirements: [
      "Expert-level proficiency in Make (Integromat) - Required.",
      "Degree in Systems Engineering, Computer Science or equivalent advanced certifications.",
      "Experience in Prompt Engineering and API-based assistant configuration.",
      "Knowledge of data analysis (advanced Excel and Power BI).",
      "Desirable: Basic programming skills (Python or JavaScript) for custom scripts.",
    ],
    benefits: [
      "100% remote work with flexible hours.",
      "Access to cutting-edge AI and automation tools.",
      "Tech-first environment focused on results and continuous innovation.",
      "Professional growth opportunities in projects with global reach.",
    ],
  },
  "65": {
    title: "Operations & Quality Management Lead Assistant",
    description: "We're looking for a retention strategist to ensure service excellence across our remote assistants, delivering exceptional value for clients in Australia, UK and the US.",
    responsibilities: [
      { titulo: "Health Score Governance: Manage account health index to prevent cancellations." },
      { titulo: "Team Leadership: Supervise and mentor quality specialists across LatAm and Miami." },
      { titulo: "Performance Auditing: Evaluate bilingual assistants' interactions with English-speaking clients." },
      { titulo: "Crisis Management: Lead feedback sessions and improvement plans for performance red flags." },
      { titulo: "Strategic Reporting: Turn Hubstaff and Zoho metrics into dashboards for operations leadership." },
    ],
    requirements: [
      "Bilingual English C1/C2 (Required for auditing contexts in Australia/UK).",
      "Advanced proficiency in Hubstaff, Zoho CRM and metrics dashboard creation.",
      "Experience leading quality specialist teams in remote environments.",
    ],
    experience: "Minimum 1 year",
    education: "Not specified",
    benefits: [
      "Opportunity to work with growing international brands.",
      "Dynamic environment combining technical marketing with real sales.",
      "Full flexibility and results-oriented work.",
    ],
  },
  "66": {
    title: "SDR / Outbound Sales Assistant",
    description: "We're looking for a results-driven professional with impeccable verbal communication skills to lead outbound prospecting and appointment setting in the Spanish market.",
    responsibilities: [
      { titulo: "Active Prospecting: Execute outbound sales efforts through cold calls to target companies." },
      { titulo: "Appointment Setting: Schedule qualified meetings through impeccable communication." },
      { titulo: "Market Research: Detect needs and adapt the pitch based on B2B/B2C profile." },
      { titulo: "Data Management: Thorough logging and tracking of commercial activity in the CRM." },
    ],
    requirements: [
      "Expert in Cold Calling with strong persuasion skills and resilience.",
      "Excellent diction and command of Spain-specific expressions (Essential for building trust).",
      "CRM proficiency for activity reporting and rigorous lead follow-up.",
    ],
    experience: "Minimum 2 years in active prospecting, telesales or SDR roles.",
    education: "Background in Communication, Marketing or related fields.",
    benefits: [
      "Opportunity for growth in a high-performance commercial environment.",
      "100% remote work with clear and measurable objectives.",
      "Professional stability in a team focused on international expansion.",
    ],
  },
  "68": {
    title: "Odoo ERP Specialist Assistant",
    description: "Lead the management, optimization and maintenance of the Odoo ecosystem to ensure seamless global operations, guaranteeing flawless integration across sales, inventory and finance.",
    responsibilities: [
      { titulo: "Configuration & Parameterization: Advanced customization of key modules based on business needs." },
      { titulo: "Development & Adaptation: Creation of custom workflows, views and reports." },
      { titulo: "Multi-Warehouse Management: Technical oversight of international stock traceability and control." },
      { titulo: "Technical Support: Resolution of critical incidents, system errors and data duplications." },
      { titulo: "Systems Maintenance: Server management and supervision of external API integrations." },
    ],
    requirements: [
      "Technical Development: Proficiency in Python and XML for creating and modifying workflows (Odoo inheritance).",
      "Module Management: Deep knowledge of Sales, Inventory, Purchasing, Accounting and CRM.",
      "Infrastructure: Experience managing Odoo.sh or self-hosted servers and API connections.",
      "External Integrations: Ability to oversee connections with Shopify, Amazon and logistics operators.",
    ],
    experience: "Advanced experience in customization, development and maintenance of Odoo ecosystems.",
    education: "Systems Engineering, Computer Science or specialized Odoo certifications.",
    benefits: [
      "Strategic role leading the digital transformation of a global brand.",
      "High-impact technical remote work environment.",
      "Opportunity to manage complex integrations with major sales channels.",
    ],
  },
  "69": {
    title: "Sales Assistant – Toy Industry (European Market)",
    description: "We're not looking for a conventional salesperson — we need a strategist capable of positioning a premium brand across Europe by acquiring key distributors and managing major accounts.",
    responsibilities: [
      { titulo: "Market Expansion: Identify and acquire distributors, concept stores and boutique shops across Europe." },
      { titulo: "B2B Account Management: Ensure product rotation, repeat purchases and annual target fulfillment." },
      { titulo: "Strategic Negotiation: Define competitive pricing and logistics terms." },
      { titulo: "Trend Analysis: Collaborate with marketing to adapt strategy to local European market needs." },
      { titulo: "Brand Representation: Act as brand ambassador at the most important children's industry events and trade shows." },
    ],
    requirements: [
      "Proven experience in international B2B sales (ideally in the toy or lifestyle sector).",
      "Deep knowledge of the European market and its consumer dynamics.",
      "Advanced ability to negotiate margins, logistics terms and annual agreements.",
      "Ability to represent the brand at international industry trade shows.",
    ],
    experience: "Solid experience in international B2B sales and opening of European markets.",
    education: "International Business, Trade, Marketing or equivalent experience in the sector.",
    benefits: [
      "Lead the expansion of a Premium/Vintage brand with great projection.",
      "High-level role focused on strategy and expansion, not operational tasks.",
      "Development opportunity in top-tier international markets.",
    ],
  },
  "71": {
    title: "Web Designer + Digital Creative",
    description: "We're looking for a Web Designer + Digital Creative. 60% creative, 40% technical. We need a person with strong visual judgment, a marketing mindset and real ability to execute on the web without relying on others for every adjustment.",
    responsibilities: [
      { titulo: "Create assets for Instagram, LinkedIn and Ad campaigns." },
      { titulo: "Design and build high-impact landing pages." },
      { titulo: "Update web content confidently without breaking anything." },
      { titulo: "Optimize images, structure and visual elements to improve conversion." },
      { titulo: "Edit Reels and short videos to energize the brand." },
      { titulo: "Provide design judgment focused on results." },
    ],
    requirements: [
      "Design content for social media and ads with brand identity.",
      "Understand that design is also about converting.",
      "Edit short, dynamic videos for social media.",
      "Build layouts in WordPress + Elementor Pro autonomously.",
      "Solid foundation in HTML/CSS to resolve details the visual editor can't handle.",
      "Think in UX/UI terms: visual hierarchy, layout and user experience.",
    ],
  },
  "72": {
    title: "Paid Media Specialist",
    description: "We're looking for a Paid Media Specialist for one of our most strategic clients. We need someone who understands how to sell through paid media, with strategic thinking, analytical judgment and technical ability to execute, measure and optimize campaigns.",
    responsibilities: [
      { titulo: "Never launch campaigns blindly." },
      { titulo: "Know how to measure before optimizing." },
      { titulo: "Understand the business behind the numbers." },
      { titulo: "Have the judgment to make decisions, not just follow instructions." },
      { titulo: "Turn data into concrete actions." },
    ],
    requirements: [
      "Campaign creation in Meta Ads with a conversion focus.",
      "Segmentation by interests, behaviors and audiences.",
      "Development of lookalikes and retargeting campaigns.",
      "Google Ads Search campaign management to capture purchase intent.",
      "Display and YouTube campaign implementation for brand awareness.",
      "Meta Pixel, Conversions API and Google Tag Manager setup.",
      "Reading and interpreting key metrics: CTR, CPC, CPA and ROAS.",
      "Constant optimization to lower cost per result and improve return.",
      "Ad copywriting that connects with the customer's pain, desire or need.",
    ],
  },
  "73": {
    title: "Architecture Assistant",
    description: "We're not looking for someone who just models in 3D. We need a person capable of transforming products into intelligent digital assets, ready for architects and interior designers to integrate them into their projects with technical precision.",
    responsibilities: [
      { titulo: "Technical judgment and order in parameterization." },
      { titulo: "Practical vision to reduce installation errors." },
      { titulo: "Attention to detail in catalogs, models and finishes." },
      { titulo: "Ability to connect design, product and execution." },
    ],
    requirements: [
      "Create and parameterize families in Revit and IFC.",
      "Load real technical information: materials, dimensions, acoustic data and finishes.",
      "Ensure models fit correctly into architectural projects.",
      "Keep the catalog updated in pCon Planner.",
      "Configure textures, colors and finishes according to new releases.",
      "Improve product visual representation for commercial and technical use.",
      "Collaborate on creating clear and functional assembly manuals.",
      "Design thinking beyond digital — consider real on-site installation.",
    ],
  },
  "74": {
    title: "Sales & E-Commerce Assistant (Real Estate Sector)",
    description: "We're looking for an efficient professional to provide operational support and boost our sales through comprehensive e-commerce platform management and customer service.",
    responsibilities: [
      { titulo: "End-to-end client follow-up and operational management of the order cycle." },
      { titulo: "Management, updating and continuous optimization of e-commerce platforms." },
      { titulo: "Structuring and preparing commercial proposals and offers for prospects." },
      { titulo: "Support in executing basic digital marketing strategies, including catalog management, promotions and corporate social media." },
    ],
    requirements: [
      "Proven experience in digital sales, customer service and online store or marketplace administration.",
      "Practical knowledge of basic digital marketing and catalog management.",
      "Excellent written and verbal communication.",
      "Customer orientation, proactivity and organizational skills.",
      "Experience in the real estate sector.",
    ],
  },
  "75": {
    title: "Bilingual Administrative Assistant (Renovation Projects)",
    description: "We're looking for an organized and efficient professional to provide comprehensive support to our renovation and assembly projects, ensuring operational, financial and customer service excellence.",
    responsibilities: [
      { titulo: "End-to-end order management and direct coordination with sector suppliers." },
      { titulo: "Customer service and efficient management of the measurement scheduling agenda." },
      { titulo: "Ongoing administrative support for renovation and assembly project execution." },
      { titulo: "Rigorous control of the financial cycle: invoicing, collections and delivery notes." },
      { titulo: "Complete after-sales service management and warranty processing." },
    ],
    requirements: [
      "English proficiency (required).",
      "Proven experience in administration, invoicing and direct dealings with clients or suppliers, preferably in the renovation or construction sector.",
      "Strong organizational skills and attention to detail.",
      "Ability to handle after-sales issue resolution.",
    ],
  },
  "77": {
    title: "Marketing Operations Specialist",
    description: "We're looking for a Marketing Operations Specialist with a strategic, operational and analytical profile, focused on efficiency, automation and measurement. This role is NOT 100% creative or commercial.",
    responsibilities: [
      { titulo: "Administer and optimize Zoho CRM at an advanced level, including Blueprint and Workflow creation and management." },
      { titulo: "Integrate AI and productivity tools to streamline marketing operations processes." },
      { titulo: "Monitor and analyze key KPIs: CAC (Customer Acquisition Cost), ROI (Return on Investment for Trade Shows and Showrooms) and NPS (Net Promoter Score)." },
      { titulo: "Track campaign, trade show and showroom performance." },
      { titulo: "Propose continuous improvements based on data and results to optimize conversion and customer experience." },
    ],
    requirements: [
      "Administrator/advanced-level proficiency in Zoho CRM.",
      "Proficiency with AI and productivity tools such as Claude, ChatGPT and Notion.",
      "C1 English required. Additional languages valued: French, Italian or German.",
      "Strong analytical skills and KPI-driven mindset.",
      "Organized, autonomous and detail-oriented.",
      "Proven experience improving marketing and operations processes.",
    ],
  },
  "78": {
    title: "SEO & Content Marketing Specialist",
    description: "We're looking for an SEO and content marketing specialist with the ability to rank brands on Google and build editorial strategies that drive real organic traffic.",
    responsibilities: [
      { titulo: "Conduct full SEO audits and propose action plans with clear priorities." },
      { titulo: "Research keywords and create editorial calendars aligned with the client's commercial strategy." },
      { titulo: "Write and optimize content for blogs, landing pages and product pages." },
      { titulo: "Monitor rankings, organic traffic and conversions, reporting results monthly." },
      { titulo: "Coordinate with design and development teams to implement technical SEO improvements." },
    ],
    requirements: [
      "Proven experience in on-page and off-page SEO (minimum 2 years).",
      "Proficiency with tools such as Ahrefs, SEMrush, Google Search Console and Google Analytics.",
      "Ability to write optimized content in Spanish (English is a plus).",
      "Knowledge of WordPress and/or modern web editors.",
      "Experience with link building and evergreen content strategies.",
      "Autonomy, analytical thinking and results orientation.",
    ],
  },
  "79": {
    title: "Social Media Manager",
    description: "We're looking for a Social Media Manager with a creative eye and strategic mindset. We need someone who understands audiences, builds community and turns followers into real customers.",
    responsibilities: [
      { titulo: "Design and execute content strategies for multiple clients' social media channels." },
      { titulo: "Create monthly editorial calendars aligned with each account's commercial objectives." },
      { titulo: "Manage communities: respond to comments, messages and generate real engagement." },
      { titulo: "Analyze weekly metrics (reach, interactions, conversions) and propose data-driven improvements." },
      { titulo: "Coordinate with design and paid media teams for integrated campaigns." },
    ],
    requirements: [
      "Minimum 2 years of experience managing social media for brands or companies.",
      "Proficiency in Meta Business Suite, Instagram, LinkedIn, TikTok and scheduling tools (Metricool, Hootsuite or similar).",
      "Ability to create basic visual content (Canva, CapCut or similar).",
      "Copywriting and storytelling skills for social media.",
      "Analytical ability to interpret metrics and adjust strategy.",
      "Native Spanish. Intermediate English is a plus.",
    ],
  },
  "80": {
    title: "Full-Service Digital Marketing Assistant",
    description: "We're looking for a versatile digital marketing profile who can cover multiple fronts: from social media and email marketing to basic automations and reporting.",
    responsibilities: [
      { titulo: "Execute end-to-end digital marketing campaigns: from planning to results reporting." },
      { titulo: "Manage social media, email marketing and paid media based on each client's needs." },
      { titulo: "Set up basic automations in CRM and email marketing tools." },
      { titulo: "Generate monthly performance reports with key metrics and actionable recommendations." },
      { titulo: "Support graphic content creation and copywriting across multiple channels." },
    ],
    requirements: [
      "Minimum 1 year of experience in digital marketing (agency or in-house).",
      "Proficiency in at least 3 of these tools: Google Ads, Meta Ads, Mailchimp/ActiveCampaign, Canva, Google Analytics, CRM (Zoho/HubSpot).",
      "Ad copywriting ability in Spanish.",
      "Basic knowledge of SEO, email marketing and workflow automation.",
      "Proactivity, organization and ability to manage multiple accounts simultaneously.",
      "Native Spanish. Basic-intermediate English.",
    ],
  },
  "81": {
    title: "Marketing Lead",
    description: "Strategic lead for automated marketing operations for SMBs in Spain. Doesn't execute content — analyzes, designs strategy per client, and directs the execution team. The team's strategic director.",
    responsibilities: [
      { titulo: "Analyze each new client: industry, pain points, competition, opportunities." },
      { titulo: "Define content and automation strategy per client (channels, frequency, messaging)." },
      { titulo: "Brief the execution team (mid + junior) on the strategy." },
      { titulo: "Monitor KPIs and results per client, adjust strategy based on data." },
      { titulo: "Manage satisfaction surveys and client feedback loops." },
      { titulo: "Report monthly results and propose improvements." },
    ],
    requirements: [
      "3+ years managing digital marketing strategy for multiple clients or brands (portfolio required).",
      "Experience leading content/design teams or freelancers.",
      "Analytical ability: reads metrics, draws conclusions and changes course.",
      "Experience with analytics tools (Google Analytics or similar).",
      "Knowledge of email marketing and automation (Brevo, Mailchimp, ActiveCampaign).",
      "Native Spanish + intermediate-advanced English.",
    ],
  },
};

export const DEPT_EN: Record<string, string> = {
  "Todos": "All",
  "Gestión y Calidad": "Operations & Quality",
  "Marketing": "Marketing",
  "Tecnología": "Technology",
  "Ventas y Comercial": "Sales & Business",
  "Proyectos Acústicos": "Acoustic Projects",
  "Ecommerce": "E-commerce",
  "Arquitectura": "Architecture",
  "Administración": "Administration",
};

export const TYPE_EN: Record<string, string> = {
  "Jornada Completa": "Full Time",
  "Tiempo Completo": "Full Time",
  "Jornada Completa (Horario España)": "Full Time (Spain hours)",
};

export const LOCATION_EN: Record<string, string> = {
  "Remoto": "Remote",
  "100% Remoto": "100% Remote",
  "100% Remoto (Exclusivo LATAM)": "100% Remote (LATAM only)",
};