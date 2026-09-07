import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { captureUTMs } from '@/lib/utm'
import { captureCountry } from '@/lib/geo'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/shared/ScrollToTop'

// Variante CANDIDATOS (rama `candidatos`, deploy gtc-empleos):
// la home ES el portal de vacantes. Sin páginas de clientes ni ChatWidget
// (ese chatbot captura leads de empresas, no aplica acá).
const Empleos = lazy(() => import('@/pages/Empleos'))
const DetallesDeEmpleo = lazy(() => import('@/pages/DetallesDeEmpleo'))
const Beneficios = lazy(() => import('@/pages/Beneficios'))
const PoliticaPrivacidad = lazy(() => import('@/pages/PoliticaPrivacidad'))
const NotFound = lazy(() => import('@/pages/NotFound'))

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
          <Route element={<Layout />}>
            <Route path="/" element={<Empleos />} />
            <Route path="/empleos" element={<Empleos />} />
            <Route path="/empleos/:id" element={<DetallesDeEmpleo />} />
            <Route path="/beneficios" element={<Beneficios />} />
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
