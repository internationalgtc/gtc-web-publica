import { useState, useEffect, useRef, FC } from 'react'
import { Maximize2, ArrowLeft, Quote, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RevealSection } from '@/components/shared/RevealSection'
import { useT } from '@/hooks/useT'

interface Testimonio {
  nombre: string
  cargoKey: string
  textoKey: string
  video: string
  thumbnail: string | null
}

// Los videos se sirven desde public/videos/ — antes vivían en Cloudinary y la
// cuenta quedó deshabilitada, dejando la sección sin videos (21-jul-2026).
const v = (n: number) => `/videos/testimonio-${n}.mp4`
const th = (n: number) => `/videos/testimonio-${n}.jpg`

const TESTIMONIOS: Testimonio[] = [
  { nombre: 'Miguel Ángel Ramírez', cargoKey: 'testi_t1_cargo', textoKey: 'testi_t1_texto', video: v(1), thumbnail: th(1) },
  { nombre: 'Arturo Sanz Santos', cargoKey: 'testi_t2_cargo', textoKey: 'testi_t2_texto', video: v(2), thumbnail: th(2) },
  { nombre: 'Alex Andreu Peinado', cargoKey: 'testi_t3_cargo', textoKey: 'testi_t3_texto', video: v(3), thumbnail: th(3) },
  { nombre: 'Curro Sabán', cargoKey: 'testi_t4_cargo', textoKey: 'testi_t4_texto', video: v(4), thumbnail: th(4) },
]

const VideoModal: FC<{ testimonio: Testimonio | null; cerrar: () => void }> = ({ testimonio, cerrar }) => {
  const t = useT()
  useEffect(() => {
    if (!testimonio) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', onKey)
    }
  }, [testimonio, cerrar])

  if (!testimonio) return null

  return (
    <div
      className="fixed inset-0 bg-navy/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-4xl mb-4">
        <button
          onClick={cerrar}
          className="flex items-center gap-2 bg-white text-navy px-5 py-2.5 rounded-lg font-label font-bold text-sm uppercase tracking-widest hover:bg-blue-prime hover:text-white transition-all duration-200 shadow-lg"
        >
          <ArrowLeft size={18} />
          {t('blog_volver')}
        </button>
      </div>

      <div className="relative bg-navy-soft rounded-2xl p-4 max-w-4xl w-full border border-blue-prime/30 shadow-2xl">
        <div className="aspect-video w-full rounded-xl overflow-hidden">
          <video
            src={testimonio.video}
            controls
            autoPlay
            className="w-full h-full bg-navy"
          />
        </div>
        <div className="mt-4 px-2">
          <p className="text-off-white font-headline text-lg">{testimonio.nombre}</p>
          <p className="text-blue-light text-xs font-label uppercase tracking-widest">{t(testimonio.cargoKey)}</p>
        </div>
      </div>
    </div>
  )
}

const TestimonioCard: FC<{ testimonio: Testimonio; abrirModal: (t: Testimonio) => void }> = ({ testimonio, abrirModal }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const t = useT()

  return (
    <div className="bg-white rounded-xl border border-border-soft hover:border-blue-prime/30 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full aspect-video bg-navy group">
        <video
          ref={videoRef}
          src={testimonio.video}
          poster={testimonio.thumbnail ?? undefined}
          controls
          preload="metadata"
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => abrirModal(testimonio)}
          className="absolute top-2 right-2 bg-navy/70 hover:bg-blue-prime text-white rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Expand"
          aria-label={testimonio.nombre}
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <Quote size={18} className="text-blue-prime mb-2" />
        <p className="text-dark-gray font-light leading-relaxed text-sm flex-1">
          "{t(testimonio.textoKey)}"
        </p>
        <div className="mt-4 pt-4 border-t border-border-soft">
          <p className="font-headline text-navy font-bold">{testimonio.nombre}</p>
          <p className="text-blue-prime text-xs font-label uppercase tracking-widest mt-0.5">{t(testimonio.cargoKey)}</p>
        </div>
      </div>
    </div>
  )
}

const Testimonials: FC = () => {
  const t = useT()
  const [testimonioAbierto, setTestimonioAbierto] = useState<Testimonio | null>(null)

  return (
    <RevealSection className="py-24 lg:py-32 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-prime/5 blur-[120px] rounded-full" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-prime text-base font-label uppercase tracking-[0.2em] font-extrabold mb-4 block">
            {t('testi_casos')}
          </span>
          <h2 className="text-navy font-headline text-4xl lg:text-5xl leading-tight">
            {t('testi_titulo_1')} <span className="serif-italic text-blue-deep">{t('testi_titulo_2')}</span>.
          </h2>
        </div>

        {/* Testimonios en video */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIOS.map((tm, i) => (
            <TestimonioCard key={i} testimonio={tm} abrirModal={setTestimonioAbierto} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-navy/70 text-lg mb-6">{t('testimonios_cta')}</p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-3 bg-coral text-white px-10 py-4 rounded-md font-label font-bold text-sm tracking-widest uppercase hover:bg-coral/90 transition-all shadow-lg shadow-coral/20"
          >
            {t('testimonios_cta_btn')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <VideoModal testimonio={testimonioAbierto} cerrar={() => setTestimonioAbierto(null)} />
    </RevealSection>
  )
}

export default Testimonials
