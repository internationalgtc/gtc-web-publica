import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import SEO from '@/components/shared/SEO'
import { Reveal } from '@/components/shared/EditorialReveal'
import { TituloEntrada, Wrap } from '@/components/shared/EditorialPiezas'
import { FormularioLead } from '@/components/shared/FormularioLead'
import { useLang, useT } from '@/hooks/useT'
import { SERVICIOS_GESTIONADOS, type ServicioGestionado, type ServicioId } from '@/data/serviciosGestionados'
import {
  calcular,
  euros,
  horas,
  resumenParaSolicitud,
  OPCIONES_DESTINO,
  OPCIONES_HORAS_DUENO,
  OPCIONES_HORAS_TAREAS,
  OPCIONES_VALOR_HORA,
  RESPUESTAS_VACIAS,
  VALOR_HORA_POR_DEFECTO,
  type Cuadrante,
  type Destino,
  type HorasDueno,
  type Respuestas,
} from '@/lib/diagnosticoDelegar'

/* Diagnóstico «¿Qué deberías delegar?» (12-nov-2026). Un lead magnet que le
   muestra al dueño, con sus propias respuestas, qué le sobra en el día y cuánto
   vale ese tiempo frente al precio del servicio. Mecánica de Get Staffed Up
   (matriz de 4) y The Virtual Hub (horas y euros); textos y precios del menú
   comercial (src/data/serviciosGestionados.ts).

   Nada sale del navegador hasta que la persona envía el formulario: entonces
   el resultado viaja como texto delante de su mensaje. La medición (gtag) solo
   existe si aceptó las cookies (index.html, __gtcCargarMedicion). */

const TOTAL = 7
const RESULTADO = TOTAL + 1

const CLAVE_HORAS_DUENO: Record<HorasDueno, string> = {
  'menos-40': 'diag_q1_menos_40',
  '40-50': 'diag_q1_40_50',
  '50-60': 'diag_q1_50_60',
  'mas-60': 'diag_q1_mas_60',
}
const CLAVE_DESTINO: Record<Destino, string> = {
  vender: 'diag_q7_vender',
  clientes: 'diag_q7_clientes',
  dirigir: 'diag_q7_dirigir',
  descansar: 'diag_q7_descansar',
}
const CLAVE_DESTINO_RES: Record<Destino, string> = {
  vender: 'diag_res_destino_vender',
  clientes: 'diag_res_destino_clientes',
  dirigir: 'diag_res_destino_dirigir',
  descansar: 'diag_res_destino_descansar',
}
const CUADRO: Record<Cuadrante, { t: string; d: string; ejeA: string; ejeB: string }> = {
  primero: { t: 'diag_c_primero', d: 'diag_c_primero_d', ejeA: 'diag_eje_sin_criterio', ejeB: 'diag_eje_tiempo' },
  agrupar: { t: 'diag_c_agrupar', d: 'diag_c_agrupar_d', ejeA: 'diag_eje_sin_criterio', ejeB: 'diag_eje_poco' },
  repartir: { t: 'diag_c_repartir', d: 'diag_c_repartir_d', ejeA: 'diag_eje_criterio', ejeB: 'diag_eje_tiempo' },
  quedarte: { t: 'diag_c_quedarte', d: 'diag_c_quedarte_d', ejeA: 'diag_eje_criterio', ejeB: 'diag_eje_poco' },
}
const ORDEN_CUADRO: Cuadrante[] = ['primero', 'agrupar', 'repartir', 'quedarte']

/** Evento de medición: no hace nada si la persona no aceptó las cookies. */
function medir(evento: string, datos: Record<string, string | number>) {
  window.gtag?.('event', evento, { event_category: 'diagnostico_delegar', ...datos })
}

/* ——— Piezas ——— */

/** Opción de respuesta: radio o casilla nativa con la tarjeta de hairline encima. */
function Opcion({
  tipo,
  name,
  marcada,
  onChange,
  children,
}: {
  tipo: 'radio' | 'checkbox'
  name: string
  marcada: boolean
  onChange: () => void
  children: ReactNode
}) {
  return (
    <label className="relative flex cursor-pointer">
      <input type={tipo} name={name} checked={marcada} onChange={onChange} className="peer sr-only" />
      <span
        className={`flex w-full items-start gap-3.5 rounded-2xl border px-5 py-4 lg:py-[18px] min-h-[56px] text-[16px] lg:text-[17px] leading-[1.45] transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy ${
          marcada ? 'bg-navy border-navy text-cream' : 'bg-cream border-navy/20 text-ink hover:border-navy/50 hover:bg-cream-2'
        }`}
      >
        <span
          aria-hidden="true"
          className={`mt-[3px] grid place-items-center shrink-0 w-[18px] h-[18px] border-[1.5px] ${tipo === 'radio' ? 'rounded-full' : 'rounded-[5px]'} ${
            marcada ? 'border-gold bg-gold text-navy' : 'border-navy/40'
          }`}
        >
          {marcada && (tipo === 'radio' ? <span className="w-[7px] h-[7px] rounded-full bg-navy" /> : (
            <svg viewBox="0 0 12 12" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 6.2l2.3 2.3 4.7-5" /></svg>
          ))}
        </span>
        <span className="flex flex-col gap-0.5">{children}</span>
      </span>
    </label>
  )
}

function Progreso({ paso }: { paso: number }) {
  const t = useT()
  return (
    <div className="flex flex-col gap-3">
      <div className="ed-label flex justify-between text-ink-soft">
        <span>
          <span className="font-semibold text-navy">{t('diag_label')}</span> · {t('diag_paso')} {paso} {t('diag_de')} {TOTAL}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1.5" aria-hidden="true">
        {Array.from({ length: TOTAL }, (_, i) => (
          <span key={i} className={`h-[3px] rounded-full ${i < paso ? 'bg-coral' : 'bg-navy/15'}`} />
        ))}
      </div>
    </div>
  )
}

/** La matriz en miniatura de la entrada: muestra lo que se lleva la persona. */
function MatrizMuestra() {
  const t = useT()
  const celdas: { c: Cuadrante; destacada?: boolean }[] = [{ c: 'primero', destacada: true }, { c: 'agrupar' }, { c: 'repartir' }, { c: 'quedarte' }]
  return (
    <div className="grid grid-cols-2 border-t border-l border-navy/20" aria-hidden="true">
      {celdas.map(({ c, destacada }, i) => (
        <div key={c} className={`border-r border-b border-navy/20 p-5 lg:p-7 min-h-[150px] lg:min-h-[210px] flex flex-col justify-between gap-6 ${destacada ? 'bg-coral text-navy' : 'text-navy'}`}>
          <span className={`ed-label ${destacada ? 'text-navy' : 'text-ink-soft'}`}>/ {String(i + 1).padStart(2, '0')}</span>
          <span className="flex flex-col gap-1.5">
            <span className="ed-serif font-[360] text-[22px] lg:text-[30px] leading-[1.1]">{t(CUADRO[c].t)}</span>
            <span className={`text-[13px] lg:text-[14px] leading-snug ${destacada ? 'text-navy/80' : 'text-ink-soft'}`}>{t(CUADRO[c].d)}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

/* ——— Página ——— */

export default function DiagnosticoDelegar() {
  const t = useT()
  const lang = useLang()
  const [paso, setPaso] = useState(0)
  const [r, setR] = useState<Respuestas>(RESPUESTAS_VACIAS)
  const [aviso, setAviso] = useState(false)
  const tituloRef = useRef<HTMLHeadingElement>(null)
  const arriba = useRef<HTMLDivElement>(null)

  const marcados = useMemo(() => SERVICIOS_GESTIONADOS.filter(s => r.tareas.includes(s.id)), [r.tareas])
  const res = useMemo(() => calcular(r, SERVICIOS_GESTIONADOS), [r])

  // Al cambiar de paso: arriba del bloque y el foco en la pregunta (lectores de pantalla).
  useEffect(() => {
    if (paso === 0) return
    arriba.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    tituloRef.current?.focus({ preventScroll: true })
    if (paso === RESULTADO) medir('diagnostico_resultado', { horas_semana: res.horasSemana, tareas: r.tareas.length })
    else medir('diagnostico_paso', { paso })
    // Solo al cambiar de paso: el resultado se mide una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso])

  const alternar = (campo: 'tareas' | 'criterio' | 'tiempo', id: ServicioId) =>
    setR(prev => {
      const lista = prev[campo].includes(id) ? prev[campo].filter(x => x !== id) : [...prev[campo], id]
      return { ...prev, [campo]: lista }
    })

  const puedeSeguir =
    (paso === 1 && r.horasDueno !== null) ||
    (paso === 2 && r.tareas.length > 0) ||
    paso === 3 ||
    paso === 4 ||
    (paso === 5 && r.horasTareas !== null) ||
    (paso === 6 && r.valorHora !== null) ||
    (paso === 7 && r.destino !== null)

  const siguiente = () => {
    if (!puedeSeguir) { setAviso(true); return }
    setAviso(false)
    if (paso === 5 && r.valorHora === null) setR(prev => ({ ...prev, valorHora: VALOR_HORA_POR_DEFECTO }))
    setPaso(p => Math.min(p + 1, RESULTADO))
  }
  const anterior = () => { setAviso(false); setPaso(p => Math.max(p - 1, 1)) }
  const empezar = () => { medir('diagnostico_inicio', { paso: 0 }); setPaso(1) }
  const reiniciar = () => { setR(RESPUESTAS_VACIAS); setPaso(1) }

  const H_PREGUNTA = 'ed-serif font-[330] text-navy leading-[1.08] tracking-[-0.02em] text-[clamp(30px,4.4vw,60px)] [text-wrap:balance] outline-none'

  const pregunta = (clave: string, ayuda?: string) => (
    <div className="flex flex-col gap-3 lg:gap-4">
      <h2 id="diag-pregunta" ref={tituloRef} tabIndex={-1} className={H_PREGUNTA}>{t(clave)}</h2>
      {ayuda && <p className="text-[16px] lg:text-[18px] leading-[1.55] text-ink-soft max-w-[40em]">{t(ayuda)}</p>}
    </div>
  )

  const textoServicio = (s: ServicioGestionado) => (
    <>
      <span className="ed-label !text-[11px] opacity-70">{s.nombre[lang]}</span>
      <span>{s.dejas[lang]}</span>
    </>
  )

  const cuerpo = () => {
    switch (paso) {
      case 1:
        return (
          <fieldset aria-labelledby="diag-pregunta" className="flex flex-col gap-8">
            {pregunta('diag_q1')}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OPCIONES_HORAS_DUENO.map(op => (
                <Opcion key={op} tipo="radio" name="horas-dueno" marcada={r.horasDueno === op} onChange={() => setR(p => ({ ...p, horasDueno: op }))}>
                  {t(CLAVE_HORAS_DUENO[op])} {t('diag_horas_sufijo')}
                </Opcion>
              ))}
            </div>
          </fieldset>
        )
      case 2:
        return (
          <fieldset aria-labelledby="diag-pregunta" className="flex flex-col gap-8">
            {pregunta('diag_q2', 'diag_q2_ayuda')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SERVICIOS_GESTIONADOS.map(s => (
                <Opcion key={s.id} tipo="checkbox" name="tareas" marcada={r.tareas.includes(s.id)} onChange={() => alternar('tareas', s.id)}>
                  {textoServicio(s)}
                </Opcion>
              ))}
            </div>
          </fieldset>
        )
      case 3:
      case 4: {
        const campo = paso === 3 ? 'criterio' : 'tiempo'
        return (
          <fieldset aria-labelledby="diag-pregunta" className="flex flex-col gap-8">
            {pregunta(paso === 3 ? 'diag_q3' : 'diag_q4', paso === 3 ? 'diag_q3_ayuda' : 'diag_q4_ayuda')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {marcados.map(s => (
                <Opcion key={s.id} tipo="checkbox" name={campo} marcada={r[campo].includes(s.id)} onChange={() => alternar(campo, s.id)}>
                  {textoServicio(s)}
                </Opcion>
              ))}
              <Opcion tipo="checkbox" name={`${campo}-ninguna`} marcada={r[campo].length === 0} onChange={() => setR(p => ({ ...p, [campo]: [] }))}>
                {t('diag_ninguna')}
              </Opcion>
            </div>
          </fieldset>
        )
      }
      case 5:
        return (
          <fieldset aria-labelledby="diag-pregunta" className="flex flex-col gap-8">
            {pregunta('diag_q5', 'diag_q5_ayuda')}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {OPCIONES_HORAS_TAREAS.map((h, i) => (
                <Opcion key={h} tipo="radio" name="horas-tareas" marcada={r.horasTareas === h} onChange={() => setR(p => ({ ...p, horasTareas: h }))}>
                  <span className="ed-serif text-[24px] leading-none">{h} {t('diag_horas_sufijo')}</span>
                  {i === OPCIONES_HORAS_TAREAS.length - 1 && <span className="text-[13px] opacity-75">{t('diag_q5_mas')}</span>}
                </Opcion>
              ))}
            </div>
          </fieldset>
        )
      case 6:
        return (
          <fieldset aria-labelledby="diag-pregunta" className="flex flex-col gap-8">
            {pregunta('diag_q6', 'diag_q6_ayuda')}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {OPCIONES_VALOR_HORA.map(v => (
                <Opcion key={v} tipo="radio" name="valor-hora" marcada={r.valorHora === v} onChange={() => setR(p => ({ ...p, valorHora: v }))}>
                  <span className="ed-serif text-[24px] leading-none">{euros(v, lang)}</span>
                </Opcion>
              ))}
            </div>
          </fieldset>
        )
      case 7:
        return (
          <fieldset aria-labelledby="diag-pregunta" className="flex flex-col gap-8">
            {pregunta('diag_q7')}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OPCIONES_DESTINO.map(op => (
                <Opcion key={op} tipo="radio" name="destino" marcada={r.destino === op} onChange={() => setR(p => ({ ...p, destino: op }))}>
                  {t(CLAVE_DESTINO[op])}
                </Opcion>
              ))}
            </div>
          </fieldset>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-cream text-ink">
      <SEO title={t('diag_seo_titulo')} description={t('diag_seo_desc')} path="/diagnostico-delegar" />

      <div ref={arriba} className="scroll-mt-[90px]" />

      {paso === 0 && (
        <section className="pt-[112px] sm:pt-[140px] lg:pt-[172px] pb-16 lg:pb-[110px]">
          <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
            <div className="flex flex-col">
              <Reveal y={0}>
                <div className="ed-label flex flex-wrap gap-x-3.5 gap-y-1 pb-3.5 border-b border-navy/15 text-ink-soft">
                  <span className="font-semibold text-navy">{t('diag_label')}</span>
                  <span>· {t('diag_meta')}</span>
                </div>
              </Reveal>
              <TituloEntrada
                className="ed-serif font-[330] text-navy leading-[0.98] tracking-[-0.025em] mt-10 lg:mt-[52px] text-[clamp(44px,11.4vw,64px)] sm:text-[clamp(62px,9vw,88px)] lg:text-[clamp(72px,7vw,108px)] [text-wrap:balance]"
                tramos={[{ texto: t('diag_titulo_a') }, { texto: t('diag_titulo_b'), subraya: true }]}
              />
              <Reveal delay={0.6} y={26}>
                <p className="mt-8 lg:mt-10 max-w-[30em] text-[18px] sm:text-[20px] leading-[1.55] text-ink-soft [text-wrap:pretty]">{t('diag_intro')}</p>
              </Reveal>
              <Reveal delay={0.72} y={26}>
                <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row sm:items-center gap-5">
                  <button type="button" onClick={empezar} className="ed-pill ed-pill-navy">
                    {t('diag_empezar')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
                  </button>
                  <p className="text-[14px] leading-relaxed text-ink-soft max-w-[30em]">{t('diag_privacidad')}</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.3} y={0}>
              <MatrizMuestra />
            </Reveal>
          </Wrap>
        </section>
      )}

      {paso >= 1 && paso <= TOTAL && (
        <section className="pt-[104px] sm:pt-[124px] lg:pt-[150px] pb-20 lg:pb-[120px]">
          <Wrap className="max-w-[1100px] flex flex-col gap-10 lg:gap-14">
            <Progreso paso={paso} />
            {cuerpo()}
            <div className="flex flex-col gap-3">
              {aviso && !puedeSeguir && <p role="alert" className="text-[14.5px] font-semibold text-navy">{t('diag_elige_una')}</p>}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3.5 border-t border-navy/15 pt-7">
                {paso > 1 ? (
                  <button type="button" onClick={anterior} className="ed-pill ed-pill-line">
                    <ArrowLeft className="w-[18px] h-[18px]" aria-hidden="true" /> {t('diag_anterior')}
                  </button>
                ) : <span />}
                <button type="button" onClick={siguiente} aria-disabled={!puedeSeguir} className={`ed-pill ed-pill-navy ${puedeSeguir ? '' : 'opacity-50'}`}>
                  {t(paso === TOTAL ? 'diag_ver_resultado' : 'diag_siguiente')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
                </button>
              </div>
            </div>
          </Wrap>
        </section>
      )}

      {paso === RESULTADO && <ResultadoVista r={r} res={res} tituloRef={tituloRef} onReiniciar={reiniciar} />}
    </div>
  )
}

/* ——— Resultado ——— */

function ResultadoVista({
  r,
  res,
  tituloRef,
  onReiniciar,
}: {
  r: Respuestas
  res: ReturnType<typeof calcular>
  tituloRef: React.RefObject<HTMLHeadingElement | null>
  onReiniciar: () => void
}) {
  const t = useT()
  const lang = useLang()
  const nombre = (id: ServicioId) => SERVICIOS_GESTIONADOS.find(s => s.id === id)?.nombre[lang] ?? id
  const desde = res.desdeMinimo ?? Math.min(...SERVICIOS_GESTIONADOS.map(s => s.desde))
  const resumen = resumenParaSolicitud(r, res, SERVICIOS_GESTIONADOS)
  const valorHora = r.valorHora ?? VALOR_HORA_POR_DEFECTO

  return (
    <>
      {/* 01 · La cifra */}
      <section className="pt-[104px] sm:pt-[124px] lg:pt-[150px] pb-14 lg:pb-20">
        <Wrap className="flex flex-col gap-8 lg:gap-10">
          <div className="ed-label flex flex-wrap gap-x-3.5 gap-y-1 pb-3.5 border-b border-navy/15 text-ink-soft">
            <span className="font-semibold text-navy">01</span>
            <span>{t('diag_res_label')}</span>
          </div>
          <h2 ref={tituloRef} tabIndex={-1} className="ed-serif font-[330] text-navy leading-[1.02] tracking-[-0.025em] text-[clamp(40px,7vw,100px)] [text-wrap:balance] outline-none">
            {t('diag_res_titulo_a')} <span className="ed-serif-it ed-subraya">{horas(res.horasSemana, lang)}</span> {t('diag_res_titulo_b')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 border-t border-navy/20 pt-8 lg:pt-10">
            <p className="ed-serif font-[330] text-navy leading-[1.3] text-[clamp(22px,2.4vw,34px)] [text-wrap:pretty]">
              {t('diag_res_valor')} {euros(valorHora, lang)} {t('diag_res_valor_b')}{' '}
              <span className="ed-serif-it text-gold-deep">{euros(res.valorMes, lang)} {t('diag_res_al_mes')}</span>.
              {r.destino && <> {t('diag_res_destino')} {t(CLAVE_DESTINO_RES[r.destino])}</>}
            </p>
            <div className="flex flex-col gap-3 text-[16px] lg:text-[18px] leading-[1.6] text-ink-soft">
              <p>
                {t('diag_res_servicio')} <strong className="text-navy font-semibold">{euros(desde, lang)} {t('diag_rec_mes')}</strong>.{' '}
                {res.horasSemana > 0 && t(res.valorMes >= desde ? 'diag_res_compara_mas' : 'diag_res_compara_menos')}
              </p>
              <p className="text-[13.5px] leading-relaxed text-sand">{t('diag_aviso')}</p>
            </div>
          </div>
        </Wrap>
      </section>

      {/* 02 · La matriz */}
      <section className="pb-16 lg:pb-24">
        <Wrap className="flex flex-col gap-8 lg:gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-5 lg:gap-14 items-end">
            <div className="ed-label flex gap-x-3.5 text-ink-soft"><span className="font-semibold text-navy">02</span><span>{t('diag_label')}</span></div>
            <h2 className="ed-serif font-[320] text-navy leading-none tracking-[-0.02em] text-[clamp(34px,4.6vw,66px)] [text-wrap:balance]">
              {t('diag_matriz_t')} <span className="ed-serif-it">{t('diag_matriz_t_b')}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-navy/20">
            {ORDEN_CUADRO.map((c, i) => {
              const ids = res.porCuadrante[c]
              const destacada = c === 'primero'
              return (
                <div key={c} className={`border-r border-b border-navy/20 p-6 lg:p-9 flex flex-col gap-5 min-h-[220px] ${destacada ? 'bg-coral text-navy' : 'text-navy'}`}>
                  <div className={`ed-label flex flex-wrap gap-x-2 ${destacada ? 'text-navy' : 'text-ink-soft'}`}>
                    <span className="font-semibold">/ {String(i + 1).padStart(2, '0')}</span>
                    <span>{t(CUADRO[c].ejeA)} · {t(CUADRO[c].ejeB)}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="ed-serif font-[360] text-[28px] lg:text-[38px] leading-[1.08]">{t(CUADRO[c].t)}</h3>
                    <p className={`text-[15px] lg:text-[16px] leading-snug ${destacada ? 'text-navy/80' : 'text-ink-soft'}`}>{t(CUADRO[c].d)}</p>
                  </div>
                  {ids.length ? (
                    <ul className={`mt-auto flex flex-col border-t ${destacada ? 'border-navy/25' : 'border-navy/15'}`}>
                      {ids.map(id => (
                        <li key={id} className={`py-2.5 border-b text-[16px] lg:text-[17px] ${destacada ? 'border-navy/25 font-semibold' : 'border-navy/15'}`}>{nombre(id)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`mt-auto text-[15px] ${destacada ? 'text-navy/70' : 'text-sand'}`}>{t('diag_c_vacio')}</p>
                  )}
                </div>
              )
            })}
          </div>
        </Wrap>
      </section>

      {/* 03 · Por dónde empezar */}
      <section className="bg-cream-2 pt-16 lg:pt-24 pb-16 lg:pb-24">
        <Wrap className="flex flex-col gap-8 lg:gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-5 lg:gap-14 items-end">
            <div className="ed-label flex gap-x-3.5 text-ink-soft"><span className="font-semibold text-navy">03</span><span>{t('home_sec_servicio')}</span></div>
            <h2 className="ed-serif font-[320] text-navy leading-none tracking-[-0.02em] text-[clamp(34px,4.6vw,66px)] [text-wrap:balance]">
              {t('diag_rec_t')} <span className="ed-serif-it">{t('diag_rec_t_b')}</span>
            </h2>
          </div>
          {res.recomendados.length ? (
            <ol className="border-t border-navy/20">
              {res.recomendados.map((s, i) => (
                <li key={s.id} className="grid grid-cols-[40px_minmax(0,1fr)] lg:grid-cols-[72px_minmax(0,1.3fr)_minmax(0,1.4fr)_200px] gap-x-3 lg:gap-x-8 gap-y-2 py-6 lg:py-8 border-b border-navy/20 items-baseline">
                  <span className="ed-serif text-lg lg:text-xl text-ink-soft">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="ed-serif font-[340] text-navy text-[26px] lg:text-[34px] leading-[1.1]">{s.nombre[lang]}</h3>
                  <p className="col-start-2 lg:col-start-3 text-[15px] lg:text-[16px] leading-[1.55] text-ink-soft">
                    <span className="ed-label !text-[11px] text-navy">{t('diag_rec_mide')}</span>{' '}
                    {s.mide.map(m => m[lang]).join(' · ')}
                  </p>
                  <p className="col-start-2 lg:col-start-4 text-[15px] text-navy lg:text-right">
                    {t('diag_rec_desde')} <strong className="ed-serif font-normal text-[22px]">{euros(s.desde, lang)}</strong> {t('diag_rec_mes')}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-[17px] lg:text-[19px] leading-[1.6] text-ink-soft max-w-[40em]">{t('diag_rec_vacio')}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3.5">
            <button type="button" onClick={onReiniciar} className="ed-pill ed-pill-line">
              <RotateCcw className="w-[17px] h-[17px]" aria-hidden="true" /> {t('diag_rehacer')}
            </button>
            <Link to="/#como-funciona" className="ed-pill ed-pill-line">
              {t('diag_volver_inicio')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
            </Link>
          </div>
        </Wrap>
      </section>

      {/* 04 · Hablarlo */}
      <section id="contacto" className="bg-navy text-cream py-20 lg:py-[110px]">
        <Wrap className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-12 lg:gap-20">
          <div className="flex flex-col gap-6">
            <div className="ed-label flex gap-x-3.5 text-cream/70"><span className="font-semibold text-gold">04</span><span>{t('contacto_label')}</span></div>
            <h2 className="ed-serif font-light text-cream leading-[1.02] tracking-[-0.02em] text-[clamp(36px,5vw,72px)] [text-wrap:balance]">
              {t('diag_form_t_a')} <span className="ed-serif-it text-gold">{t('diag_form_t_b')}</span>
            </h2>
            <p className="text-[17px] lg:text-[19px] leading-[1.6] text-cream/80 max-w-[28em]">{t('diag_form_d')}</p>
          </div>
          <div className="bg-cream text-ink rounded-[24px] lg:rounded-[28px] p-5 sm:p-8 lg:p-11">
            <FormularioLead
              formulario="diagnostico-delegar"
              tono="claro"
              cta={t('diag_form_cta')}
              contexto={resumen}
              perfilInicial={res.recomendados[0]?.perfilFormulario}
            />
          </div>
        </Wrap>
      </section>
    </>
  )
}
