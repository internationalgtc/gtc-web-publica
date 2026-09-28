import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import { DEPARTMENTS, type Job } from '@/data/jobs'
import { urlPostulacion } from '@/lib/nexus'
import { useT } from '@/hooks/useT'
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/EditorialReveal'
import { TuSeguridad } from '@/components/portal/TuSeguridad'
import { pad, partirPuesto, useTextosVacante } from '@/components/portal/textosVacante'

/* Lista de vacantes del diseño «A · Revista» (lienzo A-portal, sección 01):
   buscador + áreas, filas agrupadas por área y, en escritorio, la ficha de la
   vacante señalada a la derecha.

   Lo que NO cambia respecto de la bolsa anterior: las vacantes llegan de fuera
   (Nexus, con src/data/jobs.ts de reserva), el filtro es el mismo (texto contra
   título o área + un área a la vez) y «Postularme» abre el mismo formulario de
   Nexus con el puesto preseleccionado (urlPostulacion). Cada fila sigue siendo
   un enlace a /empleos/:id: pasar el ratón o el foco solo cambia la ficha. */

const PASOS = [1, 2, 3, 4].map(n => ({ tKey: `cand_proc_${n}_t`, dKey: `cand_proc_${n}_d` }))

export function VacantesPortal({ jobs, deptInicial = '', limite }: { jobs: Job[]; deptInicial?: string; limite?: number }) {
  const t = useT()
  const { lang, titulo, descripcion, area, lugar } = useTextosVacante()
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState(deptInicial)
  const [senalada, setSenalada] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase())
      const matchDept = !dept || j.department === dept
      return matchSearch && matchDept
    })
  }, [jobs, search, dept])

  const visibles = limite ? filtered.slice(0, limite) : filtered

  // Filas agrupadas por área, en orden alfabético del nombre que se muestra.
  const porArea = new Map<string, Job[]>()
  for (const j of visibles) {
    const lista = porArea.get(j.department) ?? []
    lista.push(j)
    porArea.set(j.department, lista)
  }
  const grupos = [...porArea.entries()].sort(([a], [b]) => area(a).localeCompare(area(b), lang))

  const ordenadas = grupos.flatMap(([, lista]) => lista)
  const ficha = ordenadas.find(j => j.id === senalada) ?? ordenadas[0]

  const chip = (activo: boolean) =>
    `font-label text-[14px] min-h-[44px] px-[18px] rounded-full border transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-2 ${
      activo ? 'bg-navy text-cream border-navy font-semibold' : 'bg-transparent text-navy border-navy/30 hover:border-navy font-medium'
    }`

  const verTodas = `/empleos${dept ? `?area=${encodeURIComponent(dept)}` : ''}`

  return (
    <>
      {/* Buscador + áreas */}
      <Reveal delay={0.1} className="mt-10 lg:mt-14">
        <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3.5 lg:items-center">
          <label htmlFor="portal-busca" className="sr-only">
            {t('portal_buscar_label')}
          </label>
          <div className="flex items-center gap-3 border border-navy/25 rounded-full px-5 bg-white w-full lg:w-[420px] focus-within:border-navy">
            <Search className="w-[18px] h-[18px] text-ink-soft shrink-0" aria-hidden="true" />
            <input
              id="portal-busca"
              type="search"
              placeholder={t('emp_ph_buscar')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-0 outline-none bg-transparent text-[16px] py-[15px] grow min-w-0 text-ink placeholder:text-sand"
            />
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={() => setDept('')} className={chip(dept === '')} aria-pressed={dept === ''}>
              {t('emp_todos')}
            </button>
            {DEPARTMENTS.filter(d => d !== 'Todos').map(d => (
              <button key={d} type="button" onClick={() => setDept(dept === d ? '' : d)} className={chip(dept === d)} aria-pressed={dept === d}>
                {area(d)}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {ordenadas.length === 0 ? (
        <Reveal>
          <p className="ed-serif-it text-[clamp(22px,2.4vw,32px)] text-ink-soft py-[70px] lg:py-[90px] text-center">{t('emp_vacio')}</p>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-10 mt-10 lg:mt-12 items-start">
          {/* Filas por área */}
          <div className="flex flex-col">
            {grupos.map(([dep, lista], gi) => (
              <div key={dep} className={gi > 0 ? 'mt-[30px]' : ''}>
                <Reveal y={20}>
                  <div className="grid grid-cols-[44px_minmax(0,1fr)] lg:grid-cols-[70px_minmax(0,1fr)] border-t-[1.5px] border-navy pt-[18px]">
                    <span className="ed-serif text-[18px] lg:text-[20px] text-gold-deep">{pad(gi + 1)}</span>
                    <h3 className="ed-label text-navy !font-semibold">{area(dep)}</h3>
                  </div>
                </Reveal>
                <RevealGroup>
                  {lista.map(job => {
                    const activa = ficha?.id === job.id
                    return (
                      <RevealItem key={job.id}>
                        <Link
                          to={`/empleos/${job.id}`}
                          onMouseEnter={() => setSenalada(job.id)}
                          onFocus={() => setSenalada(job.id)}
                          className={`grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[70px_minmax(0,1fr)_auto] items-center no-underline py-[18px] lg:py-[22px] border-b border-navy/15 text-navy hover:text-navy transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy focus-visible:[outline-offset:2px] ${
                            activa ? 'lg:bg-navy lg:text-cream lg:hover:text-cream lg:border-transparent lg:rounded-[14px] lg:-mx-5 lg:px-5' : ''
                          }`}
                        >
                          <span className={`ed-label hidden ${activa ? 'lg:block text-gold' : ''}`}>{t('portal_tag_abierta')}</span>
                          <span className="flex flex-col gap-1.5 min-w-0 lg:col-start-2">
                            <span className="ed-serif text-[22px] sm:text-[24px] lg:text-[28px] leading-[1.15]">{titulo(job)}</span>
                            {descripcion(job) && (
                              <span className={`text-[14px] lg:text-[15px] leading-[1.5] line-clamp-2 ${activa ? 'text-ink-soft lg:text-cream/80' : 'text-ink-soft'}`}>
                                {descripcion(job)}
                              </span>
                            )}
                          </span>
                          <span aria-hidden="true" className="ed-serif text-[22px] lg:text-[26px] pl-4">
                            <span className={activa ? 'lg:hidden' : ''}>↗</span>
                            {activa && <span className="hidden lg:inline text-gold">→</span>}
                          </span>
                        </Link>
                      </RevealItem>
                    )
                  })}
                </RevealGroup>
              </div>
            ))}

            {limite && filtered.length > limite && (
              <Reveal>
                <Link className="ed-pill ed-pill-line self-start mt-10" to={verTodas}>
                  {t('portal_ver_todas_n').replace('{n}', String(filtered.length))} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
                </Link>
              </Reveal>
            )}
          </div>

          {/* Ficha de la vacante señalada (solo escritorio) */}
          {ficha && fichaDe(ficha)}
        </div>
      )}
    </>
  )

  function fichaDe(job: Job) {
    const [inicio, final] = partirPuesto(titulo(job))
    return (
      <aside
        aria-label={t('portal_ficha_aria')}
        className="hidden lg:flex lg:sticky lg:top-[100px] flex-col gap-[22px] bg-white rounded-[30px] p-9 xl:p-10 border border-navy/[0.08] shadow-[0_40px_80px_-48px_rgba(6,46,85,0.45)]"
      >
        <div className="flex gap-2 flex-wrap">
          <span className="ed-label bg-cream-2 text-navy px-3 py-2 rounded-full">{area(job.department)}</span>
          <span className="ed-label bg-cream-2 text-navy px-3 py-2 rounded-full">{lugar(job.location)}</span>
          <span className="ed-label bg-navy text-cream px-3 py-2 rounded-full">{t('cand_v1_t')}</span>
        </div>
        <h3 className="ed-serif font-[340] text-navy leading-[1.02] tracking-[-0.02em] text-[clamp(36px,3.3vw,48px)] [text-wrap:balance]">
          {inicio} <span className="ed-serif-it">{final}</span>
        </h3>
        {descripcion(job) && <p className="text-[17px] leading-[1.6] text-ink-soft line-clamp-4">{descripcion(job)}</p>}
        <div className="flex flex-col border-t border-navy/15">
          <span className="ed-label text-ink-soft pt-[18px] pb-1.5">{t('portal_ficha_proceso')}</span>
          <ol>
            {PASOS.map((p, i) => (
              <li key={p.tKey} className={`grid grid-cols-[34px_minmax(0,1fr)] gap-1.5 py-3 text-[15px] leading-[1.5] ${i < PASOS.length - 1 ? 'border-b border-navy/10' : ''}`}>
                <span className="ed-serif text-gold-deep">{pad(i + 1)}</span>
                <span>
                  <strong className="text-navy">{t(p.tKey)}.</strong> <span className="text-ink-soft">{t(p.dKey)}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <TuSeguridad puesto={job.title} />
        <div className="flex flex-col gap-3">
          <a
            className="ed-pill bg-coral text-navy hover:bg-coral-hover hover:text-navy w-full !text-[17px] !min-h-[60px]"
            href={urlPostulacion(job.title, lang)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('det_postular')} <ArrowRight className="w-[18px] h-[18px] arrow" aria-hidden="true" />
          </a>
          <p className="text-center text-[14px] text-ink-soft">{t('det_48h')}</p>
          <Link
            to={`/empleos/${job.id}`}
            className="self-center inline-flex items-center gap-2 py-2 font-label font-semibold text-[15px] text-navy underline decoration-coral decoration-2 underline-offset-[6px] hover:text-navy-deep"
          >
            {t('portal_ficha_ver')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </aside>
    )
  }
}
