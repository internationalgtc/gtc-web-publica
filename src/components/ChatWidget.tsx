import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { trackLead } from '@/lib/tracking'
import { getUTMs, getLandingUrl } from '@/lib/utm'

type Message = { role: 'user' | 'assistant'; content: string }

const CHAT_API = import.meta.env.VITE_GTC_CHAT_URL
  ? `${import.meta.env.VITE_GTC_CHAT_URL}/api/chat/lead`
  : import.meta.env.DEV
    ? 'http://localhost:3000/api/chat/lead'
    // Sin var (preview de Vercel): mismo origen, pega contra el backend del propio deploy.
    : '/api/chat/lead'

function TypingDots() {
  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0 text-white text-xs font-label font-bold">
        G
      </div>
      <div className="bg-off-white border border-gray-200 rounded-lg rounded-tl-none px-3 py-2">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-blue-prime animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  const lines = msg.content.split('\n').filter(Boolean)

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0 text-white text-xs font-label font-bold">
          G
        </div>
      )}
      <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm font-body ${
        isUser
          ? 'bg-navy text-white rounded-tr-none'
          : 'bg-off-white border border-gray-200 text-dark-gray rounded-tl-none'
      }`}>
        {lines.map((line, i) => {
          if (line.startsWith('_') && line.endsWith('_')) {
            return <p key={i} className="text-blue-prime text-xs mt-1">{line.slice(1, -1)}</p>
          }
          return <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
        })}
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'es'

  const [isOpen, setIsOpen]           = useState(false)
  const [messages, setMessages]       = useState<Message[]>([])
  const [input, setInput]             = useState('')
  const [isTyping, setIsTyping]       = useState(false)
  const [hasStarted, setHasStarted]   = useState(false)
  const [finished, setFinished]       = useState(false)
  const [showBadge, setShowBadge]     = useState(true)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [redirect, setRedirect]       = useState<{ url: string; label: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendToAPI = useCallback(async (history: Message[], currentLang: string) => {
    setIsTyping(true)
    try {
      const res = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          lang: currentLang,
          ...getUTMs(),
          landing_url: getLandingUrl(),
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      setQuickReplies(data.quickReplies ?? [])
      if (data.redirect) {
        // El visitante es candidato: lo mandamos a vacantes, no se crea lead.
        setRedirect({ url: data.redirect, label: data.redirectLabel ?? 'Ver vacantes' })
        setFinished(true)
      }
      if (data.leadCreated) {
        setFinished(true)
        // Avisar a GA4 / Google Ads / Meta Pixel que el chatbot capturó un lead
        // (antes el chatbot creaba el lead en el backend pero no disparaba el
        // evento, así que esos leads eran invisibles para analytics/ads).
        trackLead('chatbot')
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: lang === 'en'
          ? 'Sorry, an error occurred. Please try again.'
          : 'Lo siento, ocurrió un error. Por favor intentá de nuevo.',
      }])
    } finally {
      setIsTyping(false)
    }
  }, [lang])

  const openChat = useCallback(async () => {
    setIsOpen(true)
    setShowBadge(false)
    if (!hasStarted) {
      setHasStarted(true)
      await sendToAPI([], lang)
    }
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [hasStarted, sendToAPI, lang])

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || isTyping || finished) return
    setInput('')
    setQuickReplies([])
    const userMsg: Message = { role: 'user', content }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    await sendToAPI(newHistory, lang)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const prevLangRef = useRef(lang)
  useEffect(() => {
    if (prevLangRef.current === lang) return
    prevLangRef.current = lang
    setMessages([])
    setQuickReplies([])
    setRedirect(null)
    setFinished(false)
    setHasStarted(false)
    if (isOpen) {
      setHasStarted(true)
      sendToAPI([], lang)
    }
  }, [lang, isOpen, sendToAPI])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* Chat window */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed z-[100] flex flex-col bg-white border border-gray-200 shadow-2xl rounded-2xl
          bottom-[84px] right-4 left-4 h-[420px] max-h-[calc(100vh-110px)]
          sm:left-auto sm:right-6 sm:w-96 sm:h-[480px]
          transition-all duration-200 ease-out
          ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ transformOrigin: 'bottom right' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-navy rounded-t-2xl flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center flex-shrink-0 text-white text-sm font-label font-bold">
            G
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-label font-semibold text-white">
              {lang === 'en' ? 'GTC Assistant' : 'Asistente GTC'}
            </p>
            <p className="text-xs font-body text-blue-light flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Online
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar chat"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isTyping && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm font-body text-dark-gray text-center px-6">
                {lang === 'en' ? 'Starting conversation...' : 'Iniciando conversación...'}
              </p>
            </div>
          )}
          {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
          {isTyping && <TypingDots />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0 md:rounded-b-2xl">
          {redirect ? (
            <a
              href={redirect.url}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-coral text-white text-sm font-label font-bold tracking-widest uppercase hover:opacity-90 transition-opacity mb-2"
            >
              {redirect.label}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          ) : quickReplies.length > 0 ? (
            <div className="flex flex-col gap-2 mb-2">
              {quickReplies.map(option => (
                <button
                  key={option}
                  onClick={() => handleSend(option)}
                  disabled={isTyping}
                  className="w-full text-left px-4 py-2.5 rounded-xl border border-blue-prime/30 bg-off-white text-sm font-body text-navy hover:bg-blue-prime hover:text-white hover:border-blue-prime transition-colors disabled:opacity-50"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping || finished}
                placeholder={finished
                  ? (lang === 'en' ? 'Inquiry registered! Goodbye 👋' : '¡Consulta registrada! Hasta pronto 👋')
                  : (lang === 'en' ? 'Type your message…' : 'Escribe tu mensaje…')
                }
                className="flex-1 bg-off-white border border-gray-200 rounded-full px-4 py-2 text-sm font-body text-navy placeholder:text-dark-gray/60 focus:outline-none focus:border-blue-prime transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim() || finished}
                className="w-9 h-9 rounded-full bg-coral flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity disabled:opacity-40"
                aria-label="Enviar"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          )}
          <p className="text-xs font-label text-dark-gray/60 mt-1.5 text-center tracking-wide uppercase">
            Global Talent Connections
          </p>
        </div>
      </div>


      {/* FAB */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : openChat}
        aria-label="Abrir asistente"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-coral text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        )}
        {showBadge && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 flex">
            <span className="animate-ping absolute h-4 w-4 rounded-full bg-navy opacity-75" />
            <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-navy border-2 border-white" />
          </span>
        )}
      </button>
    </>
  )
}
