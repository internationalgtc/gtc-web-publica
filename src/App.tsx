import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { captureUTMs } from '@/lib/utm'
import { captureCountry } from '@/lib/geo'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import ChatWidget from '@/components/ChatWidget'
import HomePage from '@/pages/Index'

const Nosotros = lazy(() => import('@/pages/Nosotros'))
const Contacto = lazy(() => import('@/pages/Contacto'))
const Servicios = lazy(() => import('@/pages/Servicios'))
const CalculadoraAhorro = lazy(() => import('@/pages/CalculadoraAhorro'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const PoliticaPrivacidad = lazy(() => import('@/pages/PoliticaPrivacidad'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const AsistenteVirtual = lazy(() => import('@/pages/AsistenteVirtual'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white">
      <div className="w-8 h-8 border-2 border-blue-prime border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  useEffect(() => { captureUTMs(); captureCountry() }, [])

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing de pago: sin Header/Footer a propósito */}
          <Route path="/asistente-virtual" element={<AsistenteVirtual />} />
          {/* Empleos y beneficios NO viven acá: el portal de candidatos es
              empleos.globaltalent-connections.com. Esta web es solo de
              empresas (Ariel, 8-sep-2026: «que no quede linkeada, que no
              exista, que no redirija»). */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/servicios" element={<Servicios />} />            <Route path="/calculadora-ahorro" element={<CalculadoraAhorro />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <ChatWidget />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
