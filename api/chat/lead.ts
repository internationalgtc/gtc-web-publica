/// <reference types="node" />
import type { VercelRequest, VercelResponse } from '@vercel/node'

type Message = { role: 'user' | 'assistant'; content: string }

const ALLOWED_ORIGINS = [
  'https://www.globaltalentconnections.es',
  'https://globaltalentconnections.es',
  'https://www.globaltalent-connections.com',
  'https://globaltalent-connections.com',
  'https://mockup-gtc-azul.vercel.app',
  'https://websiteglobaltalentconnections-wine.vercel.app',
  'https://websiteglobaltalentconnections-gtc2.vercel.app',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:3000',
]

function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin !== null && (
    ALLOWED_ORIGINS.includes(origin) ||
    /^https:\/\/websiteglobaltalentconnections.*\.vercel\.app$/.test(origin) ||
    /^https:\/\/mockup-gtc-azul-.*\.vercel\.app$/.test(origin)
  )
  const allowedOrigin = isAllowed ? origin! : ALLOWED_ORIGINS[0]!
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

type Lang = 'es' | 'en'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const STRINGS = {
  es: {
    greeting:              '¡Hola! Soy el asistente virtual de Global Talent Connections. ¿Con quién tengo el placer de hablar?',
    budgetQuestion:        `¿Cuál es el rango de inversión mensual que tenés contemplado para el asistente?\n\nEsto nos ayuda a recomendarte el perfil que mejor se ajusta.`,
    urgencyQuestion:       `¿Para cuándo necesitarías que el asistente se incorpore a tu equipo?`,
    assistantTypeQuestion: `¿Qué tipo de perfil estás buscando?`,
    budgetOptions: [
      { key: '1', label: 'Entre 1.100€ y 1.300€/mes', value: '1100' },
      { key: '2', label: 'Entre 1.300€ y 1.500€/mes', value: '1300' },
      { key: '3', label: 'Entre 1.500€ y 2.000€/mes', value: '1500' },
    ],
    urgencyOptions: [
      { key: '1', label: 'Esta semana' },
      { key: '2', label: 'Este mes' },
      { key: '3', label: 'En los próximos 2-3 meses' },
      { key: '4', label: 'Estoy explorando opciones' },
    ],
    assistantTypeOptions: [
      { key: '1', label: 'Administrativo' },
      { key: '2', label: 'Marketing Digital' },
      { key: '3', label: 'Financiero / Contable' },
      { key: '4', label: 'Desarrollo Web' },
      { key: '5', label: 'Diseño Gráfico' },
      { key: '6', label: 'Atención al Cliente' },
      { key: '7', label: 'RRHH / Reclutamiento' },
      { key: '8', label: 'Otro' },
    ],
    namePrompt:     (name: string) => `¡Encantado, ${name}! ¿A qué empresa pertenece?`,
    companyPrompt:  () => `Perfecto. ¿Cuál es su correo electrónico de contacto?`,
    invalidEmail:   (val: string) => `"${val}" no es un email válido. Necesito tu dirección de correo electrónico (ejemplo: nombre@empresa.com).`,
    emailPrompt:    (company: string) => `Gracias. ¿Cuál es su cargo o función en ${company}?`,
    invalidBudget:  () => `Ese no parece un email válido. Por favor ingresá tu dirección de correo (ejemplo: nombre@empresa.com).`,
    confirmation:   (name: string) => `¡Perfecto, ${name}! Su consulta ha quedado registrada ✅ Un asesor de GTC se pondrá en contacto a la brevedad.`,
    // El chatbot de la web de clientes NO ofrece empleo; si alguien se delata
    // como candidato, se lo redirige a /empleos sin más conversación.
    candidateMsg:     '¡Genial! En GTC ayudamos a empresas a contratar talento remoto, así que del otro lado de la mesa estás vos 🙌 Mirá nuestras vacantes abiertas y postulate desde ahí 👇',
    seeJobsLabel:     'Ver vacantes abiertas',
  },
  en: {
    greeting:              'Hello! I\'m the virtual assistant for Global Talent Connections. Who do I have the pleasure of speaking with?',
    budgetQuestion:        `What is the monthly investment range you have in mind for the assistant?\n\nThis helps us recommend the best-fit profile for you.`,
    urgencyQuestion:       `When would you need the assistant to join your team?`,
    assistantTypeQuestion: `What type of profile are you looking for?`,
    budgetOptions: [
      { key: '1', label: 'Between €1,100 and €1,300/month', value: '1100' },
      { key: '2', label: 'Between €1,300 and €1,500/month', value: '1300' },
      { key: '3', label: 'Between €1,500 and €2,000/month', value: '1500' },
    ],
    urgencyOptions: [
      { key: '1', label: 'This week' },
      { key: '2', label: 'This month' },
      { key: '3', label: 'In the next 2-3 months' },
      { key: '4', label: 'I\'m exploring options' },
    ],
    assistantTypeOptions: [
      { key: '1', label: 'Administrative' },
      { key: '2', label: 'Digital Marketing' },
      { key: '3', label: 'Finance / Accounting' },
      { key: '4', label: 'Web Development' },
      { key: '5', label: 'Graphic Design' },
      { key: '6', label: 'Customer Service' },
      { key: '7', label: 'HR / Recruitment' },
      { key: '8', label: 'Other' },
    ],
    namePrompt:     (name: string) => `Nice to meet you, ${name}! What company do you work for?`,
    companyPrompt:  () => `Perfect. What is your contact email address?`,
    invalidEmail:   (val: string) => `"${val}" is not a valid email. Please enter your email address (e.g. name@company.com).`,
    emailPrompt:    (company: string) => `Thank you. What is your role or position at ${company}?`,
    invalidBudget:  () => `That doesn't look like a valid email. Please enter your email address (e.g. name@company.com).`,
    confirmation:   (name: string) => `All set, ${name}! Your inquiry has been registered ✅ A GTC advisor will be in touch shortly.`,
    candidateMsg:     'Great! At GTC we help companies hire remote talent — so you\'re exactly the talent we love to place 🙌 Check our open positions and apply right there 👇',
    seeJobsLabel:     'View open positions',
  },
}

// Página de vacantes — adonde mandamos a los candidatos que se delatan
// (NO se crea lead de cliente; el chatbot nunca les ofrece empleo)
const CANDIDATE_URL = '/empleos'

// Frases que delatan a alguien buscando trabajo (no una empresa que quiere contratar)
const CANDIDATE_PATTERNS = /busco\s+(empleo|trabajo|laburo)|buscando\s+(empleo|trabajo)|necesito\s+(empleo|trabajo)|empleo\s+remoto|quiero\s+trabajar|postul|enviar\s+(mi\s+)?cv|mi\s+(cv|curriculum|currículum)|hoja\s+de\s+vida|looking\s+for\s+(a\s+)?(job|work|employment)|need\s+(a\s+)?job|job\s*seeker|hire\s+me|apply\s+for/i

function looksLikeCandidate(...fields: (string | undefined)[]): boolean {
  return fields.some(f => f != null && CANDIDATE_PATTERNS.test(f))
}

function extractName(text: string): string {
  const clean = text.trim()
  const match = clean.match(
    /(?:me llamo|soy|mi nombre es|i am|i'm|my name is|name:)\s+([A-Za-záéíóúÁÉÍÓÚüÜñÑ]+(?:\s+[A-Za-záéíóúÁÉÍÓÚüÜñÑ]+)*)/i
  )
  return match ? match[1]!.trim() : clean
}

function parseBudget(text: string, lang: Lang): { label: string; value: string } | null {
  const clean = text.trim()
  return STRINGS[lang].budgetOptions.find(o => o.key === clean || o.label.toLowerCase() === clean.toLowerCase()) ?? null
}

async function callGemini(messages: Message[], lang: Lang): Promise<string> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const apiKey = process.env.GEMINI_CHATBOT_KEY ?? process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('No Gemini key')

  const genAI = new GoogleGenerativeAI(apiKey)

  const s = STRINGS[lang]
  const systemPrompt = lang === 'en'
    ? `You are a recruitment assistant for Global Talent Connections. You help North American and European companies hire high-quality remote Latin American talent.

Your mission is to collect exactly 7 data points from the visitor (a business owner or decision-maker who wants to hire), in this strict order, one at a time:
1. Full name
2. Company or business name
3. Contact email
4. Role or position at the company
5. Monthly investment range — ALWAYS present the exact text: "${s.budgetQuestion}" — the system will show buttons automatically. If the user types instead of clicking a button, remind them to select one of the 3 options: ${s.budgetOptions.map(o => o.label).join(', ')}.
6. Start date — ALWAYS present the exact text: "${s.urgencyQuestion}" — the system will show buttons automatically. If the user types instead, remind them to select one of the 4 options: ${s.urgencyOptions.map(o => o.label).join(', ')}.
7. Profile type — ALWAYS present the exact text: "${s.assistantTypeQuestion}" — the system will show buttons automatically. If the user types instead, remind them to select one of the options: ${s.assistantTypeOptions.map(o => o.label).join(', ')}.

Strict rules:
- Ask ONE question at a time, in the indicated order, without skipping any step
- Do not advance to the next item until you have a valid answer for the current one
- EMAIL VALIDATION: a valid email MUST contain @ and a domain. If the user types something without @, it is NOT an email — ask again
- Use a professional but friendly tone in English

When you have all 7 valid data points, confirm the registration with a short friendly message. Then, in the SAME response on a separate line at the end, write exactly (no markdown):
GTC_LEAD:{"name":"[name]","company":"[company]","email":"[email]","role":"[role]","need":"[profile type]","budget":"[1100|1300|1500]","budget_label":"[chosen option]","urgency":"[chosen option]"}`
    : `Eres un asistente de reclutamiento de Global Talent Connections. Ayudás a empresas norteamericanas y europeas a contratar talento remoto latinoamericano de alta calidad.

Tu misión es recopilar exactamente 7 datos del visitante (dueño o responsable de una empresa que quiere contratar), en este orden estricto, uno por vez:
1. Nombre completo
2. Empresa o nombre del negocio
3. Email de contacto
4. Cargo o función en la empresa
5. Rango de inversión mensual — SIEMPRE presentar el texto exacto: "${s.budgetQuestion}" — el sistema mostrará botones automáticamente. Si el usuario escribe algo en vez de elegir un botón, recordale que debe seleccionar una de las 3 opciones: ${s.budgetOptions.map(o => o.label).join(', ')}.
6. Disponibilidad de incorporación — SIEMPRE presentar el texto exacto: "${s.urgencyQuestion}" — el sistema mostrará botones automáticamente. Si el usuario escribe algo en vez de elegir un botón, recordale que debe seleccionar una de las 4 opciones: ${s.urgencyOptions.map(o => o.label).join(', ')}.
7. Tipo de perfil — SIEMPRE presentar el texto exacto: "${s.assistantTypeQuestion}" — el sistema mostrará botones automáticamente. Si el usuario escribe algo en vez de elegir un botón, recordale que debe seleccionar una de las opciones: ${s.assistantTypeOptions.map(o => o.label).join(', ')}.

Reglas estrictas:
- Haz UNA sola pregunta a la vez, en el orden indicado, sin saltarte ningún paso
- No avances al siguiente dato hasta obtener una respuesta válida del anterior
- VALIDACIÓN DE EMAIL: un email válido DEBE contener @ y un dominio. Si el usuario escribe algo sin @, NO es un email — pedilo de nuevo
- Usa español neutro, tono profesional pero cercano

Cuando tengas los 7 datos válidos, confirmá el registro con un mensaje corto y amigable. Después, en la MISMA respuesta en una línea separada al final, escribí exactamente (sin markdown):
GTC_LEAD:{"name":"[nombre]","company":"[empresa]","email":"[email]","role":"[cargo]","need":"[tipo de perfil]","budget":"[1100|1300|1500]","budget_label":"[opción elegida]","urgency":"[opción elegida]"}`

  // systemInstruction va en el modelo (no en startChat, ahí Google lo rechaza con 400)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: systemPrompt })

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' as const : 'model' as const,
    parts: [{ text: m.content }],
  }))
  // Gemini exige que el historial arranque con un turno 'user'; la charla empieza
  // con el saludo del bot ('model'), así que descartamos los model iniciales.
  while (history.length && history[0]!.role === 'model') history.shift()

  const chat = model.startChat({ history })
  const result = await chat.sendMessage(messages[messages.length - 1]!.content)
  return result.response.text()
}

function qualificationFlow(messages: Message[], lang: Lang): string {
  const s = STRINGS[lang]
  const user = messages.filter(m => m.role === 'user')
  if (user.length === 0) return s.greeting
  if (user.length === 1) return s.namePrompt(extractName(user[0]!.content))
  if (user.length === 2) return s.companyPrompt()

  const emailIndex = user.findIndex((m, i) => i >= 2 && EMAIL_REGEX.test(m.content.trim()))
  if (emailIndex === -1) return s.invalidBudget()

  const email = user[emailIndex]!.content.trim()
  if (user.length === emailIndex + 1) return s.emailPrompt(user[1]!.content.trim())
  if (user.length === emailIndex + 2) return s.budgetQuestion

  const budget = parseBudget(user[emailIndex + 2]!.content.trim(), lang)
  if (!budget) return s.budgetQuestion
  if (user.length === emailIndex + 3) return s.urgencyQuestion

  const urgency = user[emailIndex + 3]!.content.trim()
  if (!s.urgencyOptions.some(o => o.label.toLowerCase() === urgency.toLowerCase())) return s.urgencyQuestion
  if (user.length === emailIndex + 4) return s.assistantTypeQuestion

  const needRaw = user[emailIndex + 4]!.content.trim()
  if (!s.assistantTypeOptions.some(o => o.label.toLowerCase() === needRaw.toLowerCase())) return s.assistantTypeQuestion

  const name = extractName(user[0]!.content)
  const company = user[1]!.content.trim()
  const role = user[emailIndex + 1]!.content.trim()
  return `${s.confirmation(name)}\nGTC_LEAD:{"name":"${name}","company":"${company}","email":"${email}","role":"${role}","need":"${needRaw}","budget":"${budget.value}","budget_label":"${budget.label}","urgency":"${urgency}"}`
}

type LeadTemperature = { label: string; emoji: string; score: number }

function qualifyLead(role: string, budget: string, need: string, urgency: string): LeadTemperature {
  // Authority — can this person say yes without approval?
  const roleLower = role.toLowerCase()
  let authorityScore = 15
  if (/ceo|founder|co-?founder|dueñ|owner|propietari|president|director general|socio|dueno/.test(roleLower)) {
    authorityScore = 35
  } else if (/director|vp |vice|cto|cmo|coo|cfo|c[a-z]o\b|gerente general/.test(roleLower)) {
    authorityScore = 28
  } else if (/gerente|manager|jefe|head of|head /.test(roleLower)) {
    authorityScore = 20
  } else if (/coordinador|supervisor/.test(roleLower)) {
    authorityScore = 12
  } else if (/analista|asistente|especialista|ejecutiv/.test(roleLower)) {
    authorityScore = 6
  }

  // Budget — financial capacity
  const budgetScore = budget === '1500' ? 35 : budget === '1300' ? 25 : 15

  // Clarity of need — specific profile (0-15) + timeline commitment (0-15)
  const needLower = need.toLowerCase()
  const profileScore = needLower !== 'otro' && needLower !== 'other' ? 15 : 5

  const urgencyLower = urgency.toLowerCase()
  const timelineScore =
    urgencyLower.includes('esta semana') || urgencyLower.includes('this week')   ? 15 :
    urgencyLower.includes('este mes')    || urgencyLower.includes('this month')  ? 12 :
    urgencyLower.includes('2-3')                                                  ? 8  : 2

  const clarityScore = profileScore + timelineScore

  const score = authorityScore + budgetScore + clarityScore

  const label =
    score >= 80 ? 'Caliente' :
    score >= 55 ? 'Tibio'    :
    score >= 30 ? 'Templado' : 'Frío'

  const emoji =
    score >= 80 ? '🔥' :
    score >= 55 ? '♨️'  :
    score >= 30 ? '🌡️' : '❄️'

  return { label, emoji, score }
}

async function forwardLead(leadData: {
  name: string; company: string; email: string
  role: string; need: string; budget: string; budget_label: string; urgency: string
  utm_source?: string; utm_medium?: string; utm_campaign?: string
  utm_content?: string; gclid?: string; fbclid?: string; landing_url?: string
}) {
  const temp = qualifyLead(leadData.role, leadData.budget, leadData.need, leadData.urgency)
  try {
    await fetch('https://www.globaltalentconnections.online/api/leads/public', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact_name:   leadData.name,
        contact_email:  leadData.email,
        company_name:   leadData.company,
        assistant_type: leadData.need,
        description:    `Cargo: ${leadData.role} | Incorporación: ${leadData.urgency} | Temperatura: ${temp.emoji} ${temp.label} (${temp.score}pts)`,
        budget_option:  leadData.budget,
        source:         'chatbot_web',
        utm_source:     leadData.utm_source,
        utm_medium:     leadData.utm_medium,
        utm_campaign:   leadData.utm_campaign,
        utm_content:    leadData.utm_content,
        gclid:          leadData.gclid,
        fbclid:         leadData.fbclid,
        landing_url:    leadData.landing_url,
      }),
    })
  } catch (err) {
    console.error('forwardLead failed', err)
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers['origin'] as string) ?? null
  const cors = getCorsHeaders(origin)
  Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v))

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { messages, lang: rawLang, utm_source, utm_medium, utm_campaign, utm_content, gclid, fbclid, landing_url } = req.body as {
      messages: Message[]; lang?: string
      utm_source?: string; utm_medium?: string; utm_campaign?: string
      utm_content?: string; gclid?: string; fbclid?: string; landing_url?: string
    }
    const lang: Lang = rawLang === 'en' ? 'en' : 'es'
    const s = STRINGS[lang]

    // Etapa 0 — apertura: saludo directo en modo cliente (nombre). La web de
    // clientes no ofrece empleo; el candidato se detecta solo más abajo.
    if (!messages?.length) {
      return res.json({ message: s.greeting, leadCreated: false })
    }

    const lastBotMsg  = [...messages].reverse().find(m => m.role === 'assistant')?.content ?? ''
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content ?? ''

    // Detector temprano: si en CUALQUIER paso el visitante se delata como candidato
    // (ej. "estoy buscando trabajo" en el campo de empresa), redirigir en el acto
    // en vez de seguir pidiéndole datos hasta el final.
    if (looksLikeCandidate(lastUserMsg)) {
      return res.json({
        message: s.candidateMsg,
        leadCreated: false,
        redirect: CANDIDATE_URL,
        redirectLabel: s.seeJobsLabel,
      })
    }

    if (/correo|e-?mail/i.test(lastBotMsg) && !EMAIL_REGEX.test(lastUserMsg.trim())) {
      return res.json({ message: s.invalidEmail(lastUserMsg.trim()), leadCreated: false })
    }

    const flowMessages = messages

    const apiKey = process.env.GEMINI_CHATBOT_KEY ?? process.env.GEMINI_API_KEY
    let rawMessage: string
    if (apiKey) {
      try { rawMessage = await callGemini(flowMessages, lang) }
      catch { rawMessage = qualificationFlow(flowMessages, lang) }
    } else {
      rawMessage = qualificationFlow(flowMessages, lang)
    }

    const leadMatch    = rawMessage.match(/GTC_LEAD:(\{[\s\S]*?\})/)
    const cleanMessage = rawMessage.replace(/\s*GTC_LEAD:\{[\s\S]*?\}/, '').trim()
    let leadCreated    = false

    if (leadMatch) {
      try {
        const leadData = JSON.parse(leadMatch[1]!)
        // Red de seguridad: si el nombre/empresa/cargo todavía huele a alguien
        // buscando empleo, NO se manda al canal de clientes.
        if (looksLikeCandidate(leadData.company, leadData.role, leadData.name)) {
          return res.json({
            message: s.candidateMsg,
            leadCreated: false,
            redirect: CANDIDATE_URL,
            redirectLabel: s.seeJobsLabel,
          })
        }
        if (leadData.email && EMAIL_REGEX.test(leadData.email)) {
          forwardLead({ ...leadData, utm_source, utm_medium, utm_campaign, utm_content, gclid, fbclid, landing_url })
          leadCreated = true
        }
      } catch {
        console.warn('Malformed GTC_LEAD JSON')
      }
    }

    const msg = cleanMessage.trim()
    const quickReplies =
      msg === s.budgetQuestion.trim()         ? s.budgetOptions.map(o => o.label) :
      msg === s.urgencyQuestion.trim()        ? s.urgencyOptions.map(o => o.label) :
      msg === s.assistantTypeQuestion.trim()  ? s.assistantTypeOptions.map(o => o.label) :
      null

    return res.json({ message: cleanMessage, leadCreated, ...(quickReplies ? { quickReplies } : {}) })
  } catch (err) {
    console.error('chat/lead error', err)
    return res.status(500).json({ error: 'Error interno' })
  }
}
