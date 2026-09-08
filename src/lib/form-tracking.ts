import { useEffect, useRef } from 'react'
import type { OrigenFormulario } from './enviar-lead'

const EVENTS_URL = 'https://www.globaltalentconnections.online/api/form-events'
const SESSION_KEY = 'gtc_company_form_session'

function sessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const created = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, created)
    return created
  } catch {
    return crypto.randomUUID()
  }
}

function send(formType: OrigenFormulario, eventType: 'open' | 'complete') {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return

  let referrer: string | null = null
  try {
    referrer = document.referrer ? new URL(document.referrer).hostname : null
  } catch {
    referrer = null
  }

  const payload = JSON.stringify({
    formType,
    eventType,
    sessionId: sessionId(),
    metadata: eventType === 'open' ? {
      path: window.location.pathname,
      referrer,
    } : undefined,
  })

  const blob = new Blob([payload], { type: 'text/plain;charset=UTF-8' })
  if (navigator.sendBeacon?.(EVENTS_URL, blob)) return
  void fetch(EVENTS_URL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: payload,
  }).catch(() => {})
}

export function useCompanyFormTracking(formType: OrigenFormulario) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    send(formType, 'open')
  }, [formType])

  return { trackComplete: () => send(formType, 'complete') }
}
