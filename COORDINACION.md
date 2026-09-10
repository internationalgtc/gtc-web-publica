# COORDINACION.md — GTC Azul Mockup

> Fuente de verdad del estado actual del sitio.
> Actualizar al cerrar cada sesión con `/website-nueva`.
> Git pull lo sincroniza automáticamente al abrir Claude Code.

---

## ⚠️ PROTOCOLO OBLIGATORIO — Cerrar sesión sin hacer esto = cambios perdidos

### Al terminar cualquier sesión de trabajo, estos pasos son NO NEGOCIABLES:

```
1. git add -A
2. git commit -m "content/feat/fix: descripción breve"
3. git push
4. Verificar en https://github.com/internationalgtc/mockup-gtc-azul que el commit aparece
5. Deployar manualmente: npm run deploy:prod
6. Verificar en https://mockup-gtc-azul.vercel.app que los cambios están visibles
```

> **¿Por qué el deploy manual?** El webhook automático de Vercel está roto — el push a main NO dispara deploy automático. Si no se corre `vercel --prod`, los cambios quedan en GitHub pero NO se ven en producción.

> **Historial:** El 11 mayo 2026 Larisa dejó el sitio en "perfecto estado" pero no hizo deploy manual. Al día siguiente los cambios no estaban y había errores en Empleos. Todo el trabajo de la sesión se perdió.

---

## Estado actual del sitio (12 mayo 2026)

**Deploy:** Vercel — **⚠️ MANUAL solamente** (`npm run deploy:prod`, NO `vercel --prod` — ver README)
**Repo:** https://github.com/internationalgtc/mockup-gtc-azul
**Branch principal:** `main`

| Sección | Estado | Responsable |
|---------|--------|-------------|
| Nav / Header | ✅ Completo | - |
| Hero | ✅ Completo | - |
| Stats bar | ✅ Visible | MatheoTe |
| Servicios | ✅ Completo | - |
| Testimonios (video) | ✅ Unificado | MatheoTe |
| Equipo (nosotros) | ✅ Completo | Larisa |
| Calculadora de ahorro | ✅ Funcional | - |
| Blog | ✅ 5 artículos completos con contenido real | MatheoTe |
| Empleos | ✅ Sincronizado con sitio viejo | MatheoTe |
| Footer | ✅ Completo | - |
| i18n ES/EN | ✅ Completo en translations.ts | Larisa + Mateo |
| Reseñas de Google | ✅ 5 reseñas + botón «déjanos tu reseña» (4 sep 2026) | MatheoTe |

---

## Equipo visible en el sitio

- Daniel Crespo (CEO)
- Ariel Jimenez (AI & Automation Lead)
- Gladymar Torres (HR Business Partner)
- Ana Martinez (Marketing & Sales Lead)
- Pilar Marin (HR & Commercial Lead)
- Reyna Contreras (HR & Commercial Lead)
- Sebastian Acevedo (Quality & Operations Lead)
- Fabiola Lozano (Quality Analyst)
- Suany Artica (Quality Analyst)
- Rocio (Quality Analyst — agregada en PR #7)
- Antonio Cabello (Head of Finance)
- Larisa Spatafora (Dev)
- Nelson Alonso (Dev)
- Javier Martinez (Dev)
- Delfina Palacio (Community Manager)

**Eliminados:** Victor Dominguez, Andersson Figueroa (PR #7, 9 mayo 2026)

---

## Reseñas de Google (4 sep 2026)

El perfil está en **5,0 con 7 opiniones**. En la home se publican **5**: las dos
que faltan puntuaron sin dejar texto.

**Se actualizan A MANO** en `src/data/resenasGoogle.ts`, copiándolas del panel
de Google Business → «Leer opiniones». La fecha se guarda absoluta; el «hace N
meses» lo calcula la pantalla sola.

**Por qué a mano:** la Places API pide cuenta de Google Cloud con facturación,
cobra por consulta y devuelve como mucho 5 — menos de las que hay. Con este
volumen no compensa.

**Para que se actualicen solas** (cuando el perfil crezca): basta con poner
`GOOGLE_PLACES_API_KEY` en las variables de Vercel. `api/resenas.ts` ya está
escrito con el Place ID adentro (`ChIJZR-nyJgOwoARUkVGDGJIOiY`); en cuanto
conteste, lo local se apaga solo. No hay que tocar código.

**El enlace para pedir reseñas** (el que va en los correos de Romina):
`https://g.page/r/CVJFRgxiSDomEBM/review`

---

## PRs recientes

- PR #6 MERGED — i18n contenido rebased
- PR #7 OPEN — quitar Victor + Andersson, agregar Rocio

---

## Convenciones del proyecto

### Fotos del equipo
- Archivo: `assets/equipo/nombre.png` (minúsculas, sin espacios)
- Fuente de datos: `src/data/equipo.ts`
- Cambiar foto = reemplazar el PNG con el **mismo nombre exacto**. No tocar imports.

### Textos / i18n
- **Regla de oro:** ES y EN siempre en el mismo commit
- Archivo: `src/lib/translations.ts` — formato `clave: { es: '...', en: '...' }`
- Agrupar por sección con comentarios `// ── NOMBRE ──`

### Vacantes
- Fuente única: `src/data/jobs.ts`
- Próximo ID disponible: **82**
- Activar/desactivar: campo `active: true/false`

### Git
- Ramas: `feat/<nombre>/<descripcion>` o `fix/<descripcion>`
- Pull Request → revisión → merge a main
- Nunca pushear directo a main salvo hotfixes urgentes
- Prefijos de commit: `feat:` `fix:` `content:` `style:` `i18n:`

---

## Log de cambios

| Fecha | Quién | Qué cambió |
|-------|-------|------------|
| 2026-07-21 | Larisa | Fix grilla de la barra de stats: quedaba armada para 4 columnas con 3 datos, así que las tres quedaban corridas a la izquierda. Ahora la grilla se ajusta sola a la cantidad de stats. |
| 2026-07-21 | Larisa | Stats del home y de Nosotros actualizados contra Nexus: 56 empresas activas (clientes con al menos un asistente trabajando) y 101 profesionales. Se eliminó el KPI de retención 95%: solo 10 clientes tienen 12 meses de antigüedad, no hay base para sostener esa cifra. Leyenda a Julio 2026 (ES+EN). |
| 2026-07-21 | Larisa | Videos de testimonios: la cuenta de Cloudinary `dax2r7ro2` quedó deshabilitada (devolvía 401 en toda la cuenta) y la sección se veía sin videos. Los 4 videos + posters pasaron a `public/videos/`, recomprimidos a 720p30 MP4 (63 MB → 17,8 MB). Ya no dependen de un servicio externo. |
| 2026-05-12 | MatheoTe | SEO: OG tags en index.html, imágenes blog a public/images/, fix DEFAULT_IMAGE en SEO.tsx |
| 2026-05-12 | MatheoTe | Blog: 5 artículos con contenido completo sincronizados con página vieja |
| 2026-05-12 | MatheoTe | Fix empleos: agregar job 81 Marketing Lead, desactivar 77/78 |
| 2026-05-12 | Ariel | Setup inicial: .claude/settings.json + /website-nueva + COORDINACION.md |
| 2026-05-12 | MatheoTe | Fix: unificó sección testimonios + visibilidad stats bar |
| 2026-05-12 | MatheoTe | Merge PR #6: i18n + contenido (rama Larisa) rebased |
| 2026-05-06 | MatheoTe | Backup snapshot producción Vercel |
| 2026-05-06 | Larisa | PR #3: sección testimonios en video |

---

## Tareas pendientes

- [ ] Mergear PR #7 (quitar Victor/Andersson, agregar Rocio) — Larisa tiene acceso
- [x] Blog: 5 artículos con contenido completo (sincronizado con página vieja)
- [ ] Contenido real de las tarjetas de Servicios (textos finales)
- [x] SEO: OG tags estáticos en index.html + meta tags por página via Helmet + imágenes blog descargadas a public/images/
- [ ] Revisar performance mobile (imágenes pesadas)
- [ ] Larisa + Mateo: aceptar invitación GitHub y clonar repo

---

## Equipo dev

| Persona | GitHub | Rol |
|---------|--------|-----|
| Admin | internationalgtc | Owner |
| Larisa | spataforalarisa-work | Maintain |
| Mateo | MatheoTe | Maintain |
