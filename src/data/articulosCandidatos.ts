import type { BlogPost } from './blogPosts'

/**
 * Artículos para candidatos del portal de empleos (/blog/:id).
 * Migrados desde el blog de la web de clientes el 28-sep-2026 (decidido por
 * Larisa): allí redirigen con 301 a estas rutas. Mismo texto, salvo la moneda:
 * los profesionales cobran en dólares.
 *
 * Archivo aparte a propósito: importar blogPosts.ts metería en el portal los
 * artículos de clientes y el retirado sobre trabajo en euros.
 */
export const articulosCandidatos: BlogPost[] = [
  {
    id: 'herramientas-vacantes-internacionales',
    title: {
      es: '¿Qué herramientas necesito para postular a vacantes internacionales?',
      en: 'What Tools Do I Need to Apply for International Jobs?',
    },
    excerpt: {
      es: 'Para destacar frente a cientos de candidatos, no basta con enviar tu CV: necesitas las herramientas adecuadas que te ayuden a postular de manera profesional y confiable.',
      en: 'To stand out among hundreds of candidates, sending your CV is not enough: you need the right tools to help you apply in a professional and reliable way.',
    },
    author: 'Global Talent Connections',
    date: { es: '17 Septiembre 2025', en: 'September 17, 2025' },
    readTime: '6 min',
    category: { es: 'Recursos', en: 'Resources' },
    image: '/images/blog-herramientas-internacionales.jpg',
    content: {
      es: `
<p>Cada vez más empresas en Europa, especialmente en España, están contratando talento latinoamericano para roles remotos. Pero, para destacar frente a cientos de candidatos, no basta con enviar tu CV: necesitas las herramientas adecuadas que te ayuden a postular de manera profesional y confiable.</p>
<p>En esta guía descubrirás las herramientas esenciales para <strong>aplicar a vacantes internacionales y aumentar tus posibilidades de éxito</strong>.</p>

<h2>1. Un CV profesional y adaptado al mercado internacional</h2>
<ul>
  <li><strong>Canva</strong> o <strong>Novoresume</strong>: Plataformas que ofrecen plantillas modernas, listas para personalizar.</li>
  <li><strong>Tip extra</strong>: utiliza formatos claros (PDF) y resalta logros con cifras ("Aumenté ventas en un 25% en 3 meses").</li>
</ul>

<h2>2. Portafolio online</h2>
<p>Esto muestra tu trabajo de forma tangible y genera confianza.</p>
<ul>
  <li><strong>Behance, Dribbble</strong> o <strong>Notion</strong>: si eres diseñador, marketer o creativo.</li>
  <li><strong>Google Drive / Dropbox</strong>: para compartir proyectos organizados.</li>
  <li><strong>GitHub</strong>: para perfiles técnicos y de desarrollo web.</li>
</ul>

<h2>3. Plataformas de búsqueda de empleo internacional</h2>
<ul>
  <li><strong>LinkedIn</strong>: Imprescindible para conectar con reclutadores y empresas.</li>
  <li><strong>RemoteOK, We Work Remotely</strong> y <strong>FlexJobs</strong>: portales especializados en empleo remoto global.</li>
  <li><strong>Global Talent Connections</strong>: conecta directamente con empresas en España que buscan talento latinoamericano.</li>
</ul>

<h2>4. Herramientas de comunicación y entrevistas</h2>
<ul>
  <li><strong>Zoom, Google Meet</strong> o <strong>Microsoft Teams</strong>: prepárate para entrevistas virtuales.</li>
  <li><strong>Calendly</strong>: agenda tus entrevistas de manera profesional.</li>
  <li><strong>Grammarly</strong> o <strong>LanguageTool</strong>: corrige tu gramática y redacción en inglés o español.</li>
</ul>

<h2>5. Habilidades digitales y organización</h2>
<ul>
  <li><strong>Trello, Asana</strong> o <strong>Notion</strong>: para demostrar que sabes trabajar en equipo remoto.</li>
  <li><strong>Slack</strong> o <strong>Discord</strong>: herramientas de comunicación interna muy usadas en equipos internacionales.</li>
  <li><strong>Google Workspace</strong>: imprescindible para documentos compartidos y colaboración.</li>
</ul>

<h2>6. Métodos de pago y facturación internacional</h2>
<ul>
  <li><strong>Payoneer, Wise</strong> o <strong>PayPal</strong>: plataformas seguras para recibir pagos en dólares.</li>
  <li><strong>Factura online</strong>: herramientas como FacturaDirecta o Zoho Invoice facilitan el envío de comprobantes.</li>
</ul>

<h2>Conclusión</h2>
<p>Para postular a vacantes internacionales no solo necesitas motivación, sino también las <strong>herramientas correctas</strong>. Un buen CV, un portafolio atractivo, presencia en plataformas globales y manejo de herramientas digitales aumentan tus posibilidades de conseguir el trabajo remoto que sueñas.</p>
      `,
      en: `
<p>More and more companies in Europe, especially in Spain, are hiring Latin American talent for remote roles. But to stand out among hundreds of candidates, sending your CV is not enough: you need the right tools to help you apply in a professional and reliable way.</p>
<p>In this guide you will discover the essential tools to <strong>apply for international jobs and increase your chances of success</strong>.</p>

<h2>1. A Professional CV Tailored to the International Market</h2>
<ul>
  <li><strong>Canva</strong> or <strong>Novoresume</strong>: Platforms that offer modern templates, ready to customize.</li>
  <li><strong>Extra tip</strong>: use clear formats (PDF) and highlight achievements with numbers ("Increased sales by 25% in 3 months").</li>
</ul>

<h2>2. Online Portfolio</h2>
<p>This showcases your work in a tangible way and builds trust.</p>
<ul>
  <li><strong>Behance, Dribbble</strong> or <strong>Notion</strong>: if you are a designer, marketer, or creative.</li>
  <li><strong>Google Drive / Dropbox</strong>: to share organized projects.</li>
  <li><strong>GitHub</strong>: for technical and web development profiles.</li>
</ul>

<h2>3. International Job Search Platforms</h2>
<ul>
  <li><strong>LinkedIn</strong>: Essential for connecting with recruiters and companies.</li>
  <li><strong>RemoteOK, We Work Remotely</strong> and <strong>FlexJobs</strong>: portals specializing in global remote employment.</li>
  <li><strong>Global Talent Connections</strong>: connects you directly with companies in Spain looking for Latin American talent.</li>
</ul>

<h2>4. Communication and Interview Tools</h2>
<ul>
  <li><strong>Zoom, Google Meet</strong> or <strong>Microsoft Teams</strong>: prepare for virtual interviews.</li>
  <li><strong>Calendly</strong>: schedule your interviews professionally.</li>
  <li><strong>Grammarly</strong> or <strong>LanguageTool</strong>: correct your grammar and writing in English or Spanish.</li>
</ul>

<h2>5. Digital Skills and Organization</h2>
<ul>
  <li><strong>Trello, Asana</strong> or <strong>Notion</strong>: to demonstrate you know how to work in a remote team.</li>
  <li><strong>Slack</strong> or <strong>Discord</strong>: internal communication tools widely used in international teams.</li>
  <li><strong>Google Workspace</strong>: essential for shared documents and collaboration.</li>
</ul>

<h2>6. International Payment and Invoicing Methods</h2>
<ul>
  <li><strong>Payoneer, Wise</strong> or <strong>PayPal</strong>: secure platforms for receiving payments in US dollars.</li>
  <li><strong>Online invoicing</strong>: tools like FacturaDirecta or Zoho Invoice make it easy to send receipts.</li>
</ul>

<h2>Conclusion</h2>
<p>To apply for international jobs you need more than motivation — you also need the <strong>right tools</strong>. A strong CV, an attractive portfolio, a presence on global platforms, and proficiency with digital tools will increase your chances of landing the remote job you dream of.</p>
      `,
    },
  },
  {
    id: 'oferta-trabajo-remoto-confiable-estafa',
    title: {
      es: '¿Cómo sé si una oferta de trabajo remoto es confiable o estafa?',
      en: 'How Do I Know If a Remote Job Offer Is Legitimate or a Scam?',
    },
    excerpt: {
      es: 'El trabajo remoto abre oportunidades increíbles, pero con tantas ofertas circulando en internet, también aparecen las estafas. En este blog te comparto señales de alerta y consejos prácticos para postular con seguridad.',
      en: 'Remote work opens incredible opportunities, but with so many listings circulating online, scams also appear. In this blog I share warning signs and practical tips to apply safely.',
    },
    author: 'Global Talent Connections',
    date: { es: '17 Septiembre 2025', en: 'September 17, 2025' },
    readTime: '7 min',
    category: { es: 'Seguridad', en: 'Security' },
    image: '/images/blog-oferta-estafa.jpg',
    content: {
      es: `
<p>El trabajo remoto abre oportunidades increíbles: ganar en dólares, trabajar desde casa y colaborar con empresas internacionales. Pero con tantas ofertas circulando en internet, también aparecen las estafas. Y aquí viene la gran pregunta: ¿cómo diferenciar una vacante confiable de una trampa?</p>
<p>En este blog te comparto señales de alerta y consejos prácticos para postular con seguridad.</p>

<h2>1. Revisa la fuente de la vacante</h2>
<ul>
  <li><strong>Oferta confiable</strong>: publicada en sitios reconocidos (LinkedIn, portales de empleo serios o webs oficiales de empresas).</li>
  <li><strong>Posible estafa</strong>: anuncios en grupos de Facebook sin información clara, links sospechosos o páginas sin identidad empresarial.</li>
  <li><strong>Consejo</strong>: siempre valida que la empresa tenga sitio web activo y presencia en redes sociales profesionales.</li>
</ul>

<h2>2. Cuidado con las ofertas "demasiado buenas para ser verdad"</h2>
<ul>
  <li><strong>Oferta real</strong>: salario competitivo pero dentro de lo lógico según el rol y el país.</li>
  <li><strong>Posible estafa</strong>: "Gana $5,000 USD al mes trabajando 2 horas diarias, sin experiencia".</li>
  <li><strong>Consejo</strong>: compara el salario con estándares del mercado en portales como Glassdoor o Indeed.</li>
</ul>

<h2>3. Analiza el proceso de selección</h2>
<ul>
  <li><strong>Oferta confiable</strong>: entrevista formal por Zoom/Meet, solicitud de CV, a veces pruebas técnicas.</li>
  <li><strong>Posible estafa</strong>: te contratan de inmediato sin revisar tu perfil o te piden solo hablar por WhatsApp/Telegram.</li>
  <li><strong>Consejo</strong>: desconfía si no hay entrevistas o si todo se maneja de forma improvisada.</li>
</ul>

<h2>4. Nunca pagues por trabajar</h2>
<ul>
  <li><strong>Oferta real</strong>: la empresa paga por tus servicios, nunca al revés.</li>
  <li><strong>Posible estafa</strong>: te piden dinero para "activar tu contrato", comprar un software obligatorio o pagar la capacitación inicial.</li>
  <li><strong>Consejo</strong>: cualquier oferta que te exija un pago adelantado es una señal clara de fraude.</li>
</ul>

<h2>5. Verifica los métodos de pago y contrato</h2>
<ul>
  <li><strong>Oferta confiable</strong>: pago a través de plataformas seguras (Payoneer, Wise, transferencia bancaria) y contrato digital.</li>
  <li><strong>Posible estafa</strong>: pagos en gift cards, criptomonedas no reguladas o promesas vagas de "te pagamos después".</li>
  <li><strong>Consejo</strong>: pide siempre un contrato escrito, aunque sea digital, donde se detallen funciones, horarios y condiciones de pago.</li>
</ul>

<h2>6. Investiga la reputación de la empresa</h2>
<ul>
  <li><strong>Oferta confiable</strong>: reseñas en Glassdoor, comentarios en LinkedIn, casos de éxito visibles.</li>
  <li><strong>Posible estafa</strong>: empresa sin historial, con datos que no aparecen en Google o con quejas frecuentes en foros.</li>
  <li><strong>Consejo</strong>: busca en Google "nombre de la empresa + estafa" y revisa reseñas en foros laborales.</li>
</ul>

<h2>7. Confía en tu intuición</h2>
<p>Muchas veces el instinto no falla: si algo suena extraño, la comunicación es poco profesional o las promesas parecen irreales, es mejor alejarse.</p>

<h2>Conclusión</h2>
<p>El trabajo remoto internacional es una gran oportunidad, pero también requiere estar alerta.</p>
<ul>
  <li>Verifica la fuente.</li>
  <li>Evita pagos por adelantado.</li>
  <li>Revisa contrato y métodos de pago.</li>
  <li>Investiga siempre la reputación de la empresa.</li>
</ul>
<p>Así protegerás tu tiempo, tu dinero y tu carrera profesional.</p>
      `,
      en: `
<p>Remote work opens incredible opportunities: earning in US dollars, working from home, and collaborating with international companies. But with so many listings circulating online, scams also appear. And here comes the big question: how do you tell a legitimate opening from a trap?</p>
<p>In this blog I share warning signs and practical tips to apply safely.</p>

<h2>1. Check the Source of the Job Listing</h2>
<ul>
  <li><strong>Legitimate offer</strong>: posted on recognized sites (LinkedIn, reputable job portals, or official company websites).</li>
  <li><strong>Possible scam</strong>: ads in Facebook groups with no clear information, suspicious links, or pages with no company identity.</li>
  <li><strong>Tip</strong>: always verify that the company has an active website and a presence on professional social networks.</li>
</ul>

<h2>2. Beware of Offers That Are "Too Good to Be True"</h2>
<ul>
  <li><strong>Real offer</strong>: competitive salary but within reason for the role and country.</li>
  <li><strong>Possible scam</strong>: "Earn $5,000 USD per month working 2 hours a day, no experience needed".</li>
  <li><strong>Tip</strong>: compare the salary against market standards on portals like Glassdoor or Indeed.</li>
</ul>

<h2>3. Analyze the Selection Process</h2>
<ul>
  <li><strong>Legitimate offer</strong>: formal interview via Zoom/Meet, CV request, sometimes technical assessments.</li>
  <li><strong>Possible scam</strong>: they hire you immediately without reviewing your profile or only communicate via WhatsApp/Telegram.</li>
  <li><strong>Tip</strong>: be suspicious if there are no interviews or if everything is handled in an improvised manner.</li>
</ul>

<h2>4. Never Pay to Work</h2>
<ul>
  <li><strong>Real offer</strong>: the company pays for your services, never the other way around.</li>
  <li><strong>Possible scam</strong>: they ask you for money to "activate your contract", buy mandatory software, or pay for initial training.</li>
  <li><strong>Tip</strong>: any offer that requires an upfront payment is a clear sign of fraud.</li>
</ul>

<h2>5. Verify Payment Methods and Contract</h2>
<ul>
  <li><strong>Legitimate offer</strong>: payment through secure platforms (Payoneer, Wise, bank transfer) and a digital contract.</li>
  <li><strong>Possible scam</strong>: payments in gift cards, unregulated cryptocurrencies, or vague promises of "we'll pay you later".</li>
  <li><strong>Tip</strong>: always request a written contract, even if digital, that details your duties, schedule, and payment terms.</li>
</ul>

<h2>6. Research the Company's Reputation</h2>
<ul>
  <li><strong>Legitimate offer</strong>: reviews on Glassdoor, comments on LinkedIn, visible success stories.</li>
  <li><strong>Possible scam</strong>: company with no track record, data that does not appear on Google, or frequent complaints in forums.</li>
  <li><strong>Tip</strong>: search Google for "company name + scam" and check reviews on employment forums.</li>
</ul>

<h2>7. Trust Your Instincts</h2>
<p>Many times your gut feeling does not fail: if something sounds strange, communication is unprofessional, or promises seem unrealistic, it is better to walk away.</p>

<h2>Conclusion</h2>
<p>International remote work is a great opportunity, but it also requires staying alert.</p>
<ul>
  <li>Verify the source.</li>
  <li>Avoid upfront payments.</li>
  <li>Review the contract and payment methods.</li>
  <li>Always research the company's reputation.</li>
</ul>
<p>This way you will protect your time, your money, and your professional career.</p>
      `,
    },
  },
]
