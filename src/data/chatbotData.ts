import { ConversationFlow } from "@/types/chat";

export const WHATSAPP_LINK = "https://wa.me/34689539896";
export const CONTACT_LINK = "/contacto";
// El portal de candidatos es OTRO dominio: esta web no tiene vacantes.
export const JOBS_LINK = "https://empleos.globaltalent-connections.com/empleos";
export const WEBSITE_LINK = "/";

export const conversationFlow: ConversationFlow = {
  initial: {
    message: "👋 Hola, soy el asistente virtual de Global Talent Connections.\n¿En qué puedo ayudarte hoy?",
    options: [
      { id: "empresa", icon: "🔹", label: "Contratar asistente virtual calificado para mi empresa", action: "empresa" },
      { id: "postular", icon: "🔹", label: "¿Desea postularse a una vacante?", action: "postular" },
      { id: "servicios", icon: "🔹", label: "¿Busca información sobre nuestros servicios?", action: "servicios" },
      { id: "info", icon: "🔹", label: "¿Busca información sobre la empresa?", action: "info" },
      { id: "contacto", icon: "🔹", label: "Contacto / Soporte", action: "contacto" },
    ],
  },
  empresa: {
    message: "¡Excelente! Ayudamos a empresas a encontrar el talento perfecto.\n\n🎯 Nuestro proceso incluye:\n• Análisis de tus retos, cultura y metas\n• Búsqueda mundial de talento\n• Pruebas técnicas y psicológicas\n• Selección final y apoyo en negociación\n\n¿Qué tipo de asistente necesitas?",
    options: [
      { id: "admin", icon: "📋", label: "Asistente Administrativo", action: "detalle_admin" },
      { id: "marketing", icon: "📱", label: "Marketing Digital", action: "detalle_marketing" },
      { id: "finanzas", icon: "💰", label: "Financiero y Contable", action: "detalle_finanzas" },
      { id: "tech", icon: "💻", label: "Desarrollo Web / IA", action: "detalle_tech" },
      { id: "otros", icon: "✨", label: "Ver todas las áreas", action: "todas_areas" },
      { id: "contactar", icon: "📞", label: "Contactar ahora", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "Volver al inicio", action: "initial" },
    ],
  },
  postular: {
    message: "¡Nos encanta conocer nuevos talentos! 🌟\n\nEn Global Talent Connections buscamos asistentes virtuales profesionales para empresas en España.\n\n¿Tienes experiencia como asistente virtual?",
    options: [
      { id: "exp_si", icon: "✅", label: "Sí, tengo experiencia", action: "postular_exp" },
      { id: "exp_no", icon: "🌱", label: "No, pero quiero empezar", action: "postular_nuevo" },
      { id: "ver_vacantes", icon: "💼", label: "Ver vacantes disponibles", action: "open_jobs" },
      { id: "volver", icon: "🔙", label: "Volver al inicio", action: "initial" },
    ],
  },
  servicios: {
    message: "Ofrecemos Asistentes Virtuales especializados en diversas áreas:\n\n📋 Administrativo Inteligente\n🏛️ Arquitectura\n📢 Comunicación Corporativa\n💰 Financiero y Contable\n📱 Marketing Digital\n🛒 E-commerce\n💻 Desarrollo Web\n🎨 Diseño Gráfico\n🤖 Automatización con IA\n📊 Gestión y Calidad\n👥 Recursos Humanos\n\n¿Te interesa alguna área en particular?",
    options: [
      { id: "empresa", icon: "🏢", label: "Soy empresa, quiero contratar", action: "empresa" },
      { id: "postular", icon: "👤", label: "Quiero trabajar con ustedes", action: "postular" },
      { id: "web", icon: "🌐", label: "Visitar sitio web", action: "open_website" },
      { id: "volver", icon: "🔙", label: "Volver al inicio", action: "initial" },
    ],
  },
  info: {
    message: "🌐 En Global Talent Connections unimos tu ambición con talento de primer nivel.\n\nSomos el puente entre empresas que quieren crecer y profesionales que saben cómo hacerlo.\n\n💡 Nuestra misión: Empoderar a los líderes para que dediquen su energía a lo que de verdad mueve el mundo: la innovación.\n\n¿Qué más te gustaría saber?",
    options: [
      { id: "proceso", icon: "📋", label: "¿Cómo es su proceso?", action: "proceso" },
      { id: "empresa", icon: "🏢", label: "Quiero un asistente", action: "empresa" },
      { id: "web", icon: "🌐", label: "Visitar sitio web", action: "open_website" },
      { id: "volver", icon: "🔙", label: "Volver al inicio", action: "initial" },
    ],
  },
  contacto: {
    message: "¡Estaremos encantados de ayudarte! 😊\n\n¿Cómo prefieres contactarnos?",
    options: [
      { id: "formulario", icon: "📝", label: "Formulario de contacto", action: "open_contact" },
      { id: "volver", icon: "🔙", label: "Volver al inicio", action: "initial" },
    ],
  },
  proceso: {
    message: "📌 Nuestro proceso de selección:\n\n1️⃣ Profundizamos en tu realidad: retos, cultura y metas\n\n2️⃣ Búsqueda de talento a nivel mundial y valoración ágil\n\n3️⃣ Pruebas técnicas, entrevistas psicológicas y encaje cultural\n\n4️⃣ Selección final de candidatos destacados y apoyo en negociación\n\n¿Listo para empezar?",
    options: [
      { id: "contactar", icon: "🚀", label: "¡Sí, quiero empezar!", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "Volver al inicio", action: "initial" },
    ],
  },
  todas_areas: {
    message: "📋 Todas nuestras áreas de especialización:\n\n• Asistente Administrativo Inteligente\n• Asistente de Arquitectura\n• Asistente de Comunicación Corporativa\n• Asistente Financiero y Contable\n• Asistente de Marketing Digital\n• Asistente para E-commerce\n• Asistente de Desarrollo Web\n• Asistente de Diseño Gráfico\n• Asistente de Automatización con IA\n• Asistente de Gestión y Calidad\n• Asistente de Recursos Humanos\n\n¡Y muchas más áreas personalizadas según tu necesidad!",
    options: [
      { id: "contactar", icon: "📞", label: "Solicitar información", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "Volver al inicio", action: "initial" },
    ],
  },
  detalle_admin: {
    message: "📋 Asistente Administrativo Inteligente\n\n✓ Gestión de agenda y calendario\n✓ Organización de documentos\n✓ Atención de emails y comunicaciones\n✓ Coordinación de reuniones\n✓ Tareas administrativas automatizadas\n\n¿Te gustaría conocer más o hablar con un asesor?",
    options: [
      { id: "contactar", icon: "📞", label: "Solicitar este servicio", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "Ver otras áreas", action: "empresa" },
    ],
  },
  detalle_marketing: {
    message: "📱 Asistente de Marketing Digital\n\n✓ Gestión de redes sociales\n✓ Creación de contenido\n✓ Email marketing\n✓ Análisis de métricas\n✓ Campañas publicitarias\n\n¿Te gustaría conocer más o hablar con un asesor?",
    options: [
      { id: "contactar", icon: "📞", label: "Solicitar este servicio", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "Ver otras áreas", action: "empresa" },
    ],
  },
  detalle_finanzas: {
    message: "💰 Asistente Financiero y Contable\n\n✓ Gestión de facturación\n✓ Control de gastos e ingresos\n✓ Reportes financieros\n✓ Conciliaciones bancarias\n✓ Apoyo contable general\n\n¿Te gustaría conocer más o hablar con un asesor?",
    options: [
      { id: "contactar", icon: "📞", label: "Solicitar este servicio", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "Ver otras áreas", action: "empresa" },
    ],
  },
  detalle_tech: {
    message: "💻 Asistente de Desarrollo Web / IA\n\n✓ Desarrollo y mantenimiento web\n✓ Automatización de procesos\n✓ Integración de herramientas IA\n✓ Soporte técnico\n✓ Gestión de proyectos tech\n\n¿Te gustaría conocer más o hablar con un asesor?",
    options: [
      { id: "contactar", icon: "📞", label: "Solicitar este servicio", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "Ver otras áreas", action: "empresa" },
    ],
  },
  postular_exp: {
    message: "¡Genial! Buscamos profesionales con experiencia como tú. 🌟\n\nNuestros asistentes trabajan con empresas en España de forma remota.\n\n¿Quieres ver las vacantes disponibles o contactar directamente con RRHH?",
    options: [
      { id: "ver_vacantes", icon: "💼", label: "Ver vacantes disponibles", action: "open_jobs" },
      { id: "volver", icon: "🔙", label: "Volver al inicio", action: "initial" },
    ],
  },
  postular_nuevo: {
    message: "¡Todos empezamos en algún momento! 🌱\n\nValoraremos tu perfil y te orientaremos sobre cómo prepararte para esta carrera.\n\n¿Qué te gustaría hacer?",
    options: [
      { id: "ver_vacantes", icon: "💼", label: "Ver vacantes disponibles", action: "open_jobs" },
      { id: "volver", icon: "🔙", label: "Volver al inicio", action: "initial" },
    ],
  },
  contactar_empresa: {
    message: "¡Perfecto! 🎯\n\nTe llevaremos a nuestro formulario de contacto donde podrás dejarnos tus datos y requerimientos.\n\nUn asesor te contactará en menos de 24 horas.",
    options: [
      { id: "formulario", icon: "📝", label: "Ir al formulario de contacto", action: "open_contact" },
      { id: "volver", icon: "🔙", label: "Volver al inicio", action: "initial" },
    ],
  },
};

export const BOT_NAME = "Asistente GTC";
export const BOT_NAME_EN = "GTC Assistant";
export const BOT_TYPING_DELAY = 800;

export const conversationFlowEN: ConversationFlow = {
  initial: {
    message: "👋 Hi, I'm the virtual assistant at Global Talent Connections.\nHow can I help you today?",
    options: [
      { id: "empresa", icon: "🔹", label: "Hire a qualified virtual assistant for my company", action: "empresa" },
      { id: "postular", icon: "🔹", label: "Want to apply for a position?", action: "postular" },
      { id: "servicios", icon: "🔹", label: "Looking for information about our services?", action: "servicios" },
      { id: "info", icon: "🔹", label: "Looking for information about the company?", action: "info" },
      { id: "contacto", icon: "🔹", label: "Contact / Support", action: "contacto" },
    ],
  },
  empresa: {
    message: "Excellent! We help companies find the perfect talent.\n\n🎯 Our process includes:\n• Analysis of your challenges, culture and goals\n• Worldwide talent search\n• Technical and psychological assessments\n• Final selection and negotiation support\n\nWhat type of assistant do you need?",
    options: [
      { id: "admin", icon: "📋", label: "Administrative Assistant", action: "detalle_admin" },
      { id: "marketing", icon: "📱", label: "Digital Marketing", action: "detalle_marketing" },
      { id: "finanzas", icon: "💰", label: "Finance & Accounting", action: "detalle_finanzas" },
      { id: "tech", icon: "💻", label: "Web Development / AI", action: "detalle_tech" },
      { id: "otros", icon: "✨", label: "View all areas", action: "todas_areas" },
      { id: "contactar", icon: "📞", label: "Contact us now", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "Back to start", action: "initial" },
    ],
  },
  postular: {
    message: "We love meeting new talent! 🌟\n\nAt Global Talent Connections we're looking for professional virtual assistants for companies in Spain.\n\nDo you have experience as a virtual assistant?",
    options: [
      { id: "exp_si", icon: "✅", label: "Yes, I have experience", action: "postular_exp" },
      { id: "exp_no", icon: "🌱", label: "No, but I want to start", action: "postular_nuevo" },
      { id: "ver_vacantes", icon: "💼", label: "View available positions", action: "open_jobs" },
      { id: "volver", icon: "🔙", label: "Back to start", action: "initial" },
    ],
  },
  servicios: {
    message: "We offer specialized Virtual Assistants in various areas:\n\n📋 Smart Administrative\n🏛️ Architecture\n📢 Corporate Communications\n💰 Finance & Accounting\n📱 Digital Marketing\n🛒 E-commerce\n💻 Web Development\n🎨 Graphic Design\n🤖 AI Automation\n📊 Management & Quality\n👥 Human Resources\n\nInterested in any particular area?",
    options: [
      { id: "empresa", icon: "🏢", label: "I'm a company, I want to hire", action: "empresa" },
      { id: "postular", icon: "👤", label: "I want to work with you", action: "postular" },
      { id: "web", icon: "🌐", label: "Visit website", action: "open_website" },
      { id: "volver", icon: "🔙", label: "Back to start", action: "initial" },
    ],
  },
  info: {
    message: "🌐 At Global Talent Connections we match your ambition with top-tier talent.\n\nWe are the bridge between companies that want to grow and professionals who know how to make it happen.\n\n💡 Our mission: Empower leaders to focus their energy on what truly moves the world: innovation.\n\nWhat else would you like to know?",
    options: [
      { id: "proceso", icon: "📋", label: "How does your process work?", action: "proceso" },
      { id: "empresa", icon: "🏢", label: "I want an assistant", action: "empresa" },
      { id: "web", icon: "🌐", label: "Visit website", action: "open_website" },
      { id: "volver", icon: "🔙", label: "Back to start", action: "initial" },
    ],
  },
  contacto: {
    message: "We'll be happy to help! 😊\n\nHow would you prefer to contact us?",
    options: [
      { id: "formulario", icon: "📝", label: "Contact form", action: "open_contact" },
      { id: "volver", icon: "🔙", label: "Back to start", action: "initial" },
    ],
  },
  proceso: {
    message: "📌 Our selection process:\n\n1️⃣ We dive deep into your reality: challenges, culture and goals\n\n2️⃣ Global talent search and agile assessment\n\n3️⃣ Technical tests, psychological interviews and cultural fit\n\n4️⃣ Final candidate selection and negotiation support\n\nReady to get started?",
    options: [
      { id: "contactar", icon: "🚀", label: "Yes, let's start!", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "Back to start", action: "initial" },
    ],
  },
  todas_areas: {
    message: "📋 All our specialization areas:\n\n• Smart Administrative Assistant\n• Architecture Assistant\n• Corporate Communications Assistant\n• Finance & Accounting Assistant\n• Digital Marketing Assistant\n• E-commerce Assistant\n• Web Development Assistant\n• Graphic Design Assistant\n• AI Automation Assistant\n• Management & Quality Assistant\n• Human Resources Assistant\n\nAnd many more areas customized to your needs!",
    options: [
      { id: "contactar", icon: "📞", label: "Request information", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "Back to start", action: "initial" },
    ],
  },
  detalle_admin: {
    message: "📋 Smart Administrative Assistant\n\n✓ Calendar and schedule management\n✓ Document organization\n✓ Email and communications handling\n✓ Meeting coordination\n✓ Automated administrative tasks\n\nWould you like to learn more or speak with an advisor?",
    options: [
      { id: "contactar", icon: "📞", label: "Request this service", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "View other areas", action: "empresa" },
    ],
  },
  detalle_marketing: {
    message: "📱 Digital Marketing Assistant\n\n✓ Social media management\n✓ Content creation\n✓ Email marketing\n✓ Metrics analysis\n✓ Ad campaigns\n\nWould you like to learn more or speak with an advisor?",
    options: [
      { id: "contactar", icon: "📞", label: "Request this service", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "View other areas", action: "empresa" },
    ],
  },
  detalle_finanzas: {
    message: "💰 Finance & Accounting Assistant\n\n✓ Invoicing management\n✓ Expense and income tracking\n✓ Financial reports\n✓ Bank reconciliations\n✓ General accounting support\n\nWould you like to learn more or speak with an advisor?",
    options: [
      { id: "contactar", icon: "📞", label: "Request this service", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "View other areas", action: "empresa" },
    ],
  },
  detalle_tech: {
    message: "💻 Web Development / AI Assistant\n\n✓ Website development and maintenance\n✓ Process automation\n✓ AI tool integration\n✓ Technical support\n✓ Tech project management\n\nWould you like to learn more or speak with an advisor?",
    options: [
      { id: "contactar", icon: "📞", label: "Request this service", action: "contactar_empresa" },
      { id: "volver", icon: "🔙", label: "View other areas", action: "empresa" },
    ],
  },
  postular_exp: {
    message: "Great! We're looking for experienced professionals like you. 🌟\n\nOur assistants work remotely with companies in Spain.\n\nWould you like to see available positions or contact HR directly?",
    options: [
      { id: "ver_vacantes", icon: "💼", label: "View available positions", action: "open_jobs" },
      { id: "volver", icon: "🔙", label: "Back to start", action: "initial" },
    ],
  },
  postular_nuevo: {
    message: "Everyone starts somewhere! 🌱\n\nWe'll evaluate your profile and guide you on how to prepare for this career.\n\nWhat would you like to do?",
    options: [
      { id: "ver_vacantes", icon: "💼", label: "View available positions", action: "open_jobs" },
      { id: "volver", icon: "🔙", label: "Back to start", action: "initial" },
    ],
  },
  contactar_empresa: {
    message: "Perfect! 🎯\n\nWe'll take you to our contact form where you can leave your details and requirements.\n\nAn advisor will contact you in less than 24 hours.",
    options: [
      { id: "formulario", icon: "📝", label: "Go to contact form", action: "open_contact" },
      { id: "volver", icon: "🔙", label: "Back to start", action: "initial" },
    ],
  },
};
