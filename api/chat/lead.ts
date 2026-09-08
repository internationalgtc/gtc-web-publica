/// <reference types="node" />
import type { VercelRequest, VercelResponse } from '@vercel/node'

const CLIENT_FORM_URL = 'https://www.globaltalentconnections.online/solicitar-asistente?origen=chatbot&utm_source=web&utm_medium=chatbot&utm_campaign=chatbot-web&utm_content=form%3Achatbot'

const ALLOWED_ORIGINS = [
  'https://www.globaltalent-connections.com',
  'https://globaltalent-connections.com',
  'https://mockup-gtc-azul.vercel.app',
  'http://localhost:5173',
]

export default function handler(req: VercelRequest, res: VercelResponse) {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : null
  if (origin && ALLOWED_ORIGINS.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const lang = req.body?.lang === 'en' ? 'en' : 'es'
  return res.json({
    message: lang === 'en'
      ? 'Complete the company request so our team receives all the information needed to help you.'
      : 'Completa la solicitud de empresa para que el equipo reciba toda la información necesaria para ayudarte.',
    leadCreated: false,
    redirect: CLIENT_FORM_URL,
    redirectLabel: lang === 'en' ? 'Complete request' : 'Completar solicitud',
  })
}
