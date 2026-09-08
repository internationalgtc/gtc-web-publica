import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { captureUTMs } from '@/lib/utm'
import { captureCountry } from '@/lib/geo'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/shared/ScrollToTop'

// Variante CANDIDATOS (rama `candidatos`, deploy gtc-empleos):
// la home ES el portal de vacantes. Sin páginas de clientes ni ChatWidget
// (ese chatbot captura leads de empresas, no aplica acá).
const HomeCandidatos = lazy(() => import('@/pages/HomeCandidatos'))
const Empleos = lazy(() => import('@/pages/Empleos'))
const DetallesDeEmpleo = lazy(() => import('@/pages/DetallesDeEmpleo'))
const Areas = lazy(() => import('@/pages/Areas'))
const PoliticaPrivacidad = lazy(() => import('@/pages/PoliticaPrivacidad'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-8 h-8 border border-navy/20 border-t-coral rounded-full animate-spin" />
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
          <Route element={<Layout />}>
            <Route path="/" element={<HomeCandidatos />} />
            <Route path="/empleos" element={<Empleos />} />
            <Route path="/empleos/:id" element={<DetallesDeEmpleo />} />
            <Route path="/areas" element={<Areas />} />
            {/* «Únete al equipo» y «Oportunidades» eran la misma cosa con dos nombres:
                la página se retiró y los enlaces viejos caen en la bolsa de empleos. */}
            <Route path="/beneficios" element={<Navigate to="/empleos" replace />} />
            <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
