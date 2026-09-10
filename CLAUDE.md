# CLAUDE.md — mockup-gtc-azul / Global Talent Connections Website

## Regla principal

Este proyecto tiene un design system definido y aprobado. Toda modificación — sin excepción — debe respetar ese sistema. Nunca introducir colores, tipografías o estilos distintos a los documentados.

Desde el rediseño editorial de la home (Sep 2026), el sistema vigente es el **editorial cream/navy/coral** documentado abajo. Las páginas internas (Servicios, Nosotros, Blog, Empleos, Calculadora, Contacto) siguen migradas solo en header/footer; su cuerpo conserva el sistema anterior y se irá portando al nuevo con el tiempo.

---

## Paleta de colores — Sistema editorial (vigente)

| Token Tailwind | Hex | Uso |
|---|---|---|
| `bg-navy` / `text-navy` | `#062E55` | Paneles oscuros (proceso, contacto), hover fill de filas-índice |
| `bg-navy-deep` | `#041E3A` | Footer y gradiente final de paneles navy |
| `bg-coral` / `text-coral` | `#FF5A39` | CTA primario, índices y acentos. Nunca texto largo. |
| `bg-coral-hover` | `#E8482A` | Hover del CTA primario |
| `text-gold-deep` | `#C98A2B` | Énfasis itálico Fraunces sobre fondos claros, estrellas |
| `text-gold` | `#F59E0B` | Énfasis itálico sobre fondos navy (mejor contraste que gold-deep) |
| `bg-cream` | `#F6F3EC` | Fondo base del sitio |
| `bg-cream-2` | `#EFEAE0` | Fondo alternado (marquee, testimonios, hover de columnas) |
| `text-ink` | `#0E2A47` | Texto principal sobre cream |
| `text-ink-soft` | `#48596D` | Texto secundario sobre cream |
| `text-sand` | `#8A948F` | Metadatos y notas |
| Hairlines | `rgba(6,46,85,.16)` / `rgba(246,243,236,.18)` | Bordes de 1px sobre claro / sobre navy. El sistema NO usa cards ni sombras de caja en secciones. |

Tokens legacy que persisten en páginas internas: `blue-prime #2280AD`, `blue-deep #1A6590`, `blue-light #4AADDB`, `navy-soft #0A2444`, `off-white #F7F7F7`, `dark-gray #37516B`, `border-soft #d9e2ec`.

---

## Tipografía — Sistema editorial (vigente)

```
Fraunces   → Display: H1/H2, números grandes, citas → font-display (300-400, itálica para énfasis)
Lato       → Cuerpo de texto, párrafos              → font-body
Montserrat → Caps editoriales (sec-tags, labels, botones, nav) → ed-caps / font-headline
Inter      → Solo UI legacy de páginas internas     → font-label
```

Patrones tipográficos del sistema:
- H1: `clamp(46px,7.6vw,118px)`, H2: `clamp(38px,5.6vw,84px)`, tracking -0.015em, line-height 1.02.
- Énfasis dentro de headings: `<em>` itálica gold-deep (sobre cream) o gold (sobre navy).
- `.ed-caps`: Montserrat 600, letter-spacing .22em, uppercase.
- Sec-tag editorial: `NN` (Fraunces itálica coral) + nombre de sección + meta a la derecha, sobre hairline.

---

## Reglas de implementación

1. Antes de crear cualquier componente nuevo: verificar si ya existe en `src/components/ui/` o `src/components/shared/`.
2. Las secciones nuevas usan hairlines y espacio en vez de cards/sombras. Nada de `rounded-xl + shadow` en la home.
3. Botones editoriales: `.ed-btn` (pill, Montserrat 700, uppercase, tracking .14em) en variantes `.ed-btn-primary` (coral) y `.ed-btn-outline` (hairline).
4. Clases editoriales viven en `src/styles/globals.css` con prefijo `ed-` (`.ed-sec-tag`, `.ed-prow`, `.ed-area-row`, `.ed-field`, `.ed-marquee`, `.ed-foot-word`).
5. Motion: **framer-motion** (ya instalado). El estado oculto lo pone el JS, nunca el CSS; respetar `useReducedMotion`. No agregar GSAP/Lenis.
6. Header: fijo, cream 85% + blur, logo negro (`src/assets/logos/logo-gtc-negro.png`), hairline inferior. Footer: navy-deep, logo blanco (`logo-gtc-blanco.png`), wordmark gigante "Global Talent".
7. Imágenes de stock: el sistema editorial las evita en la home; si una sección nueva las necesita, siempre con overlay navy encima.

---

## Stack

- React + TypeScript estricto (sin `any`)
- Vite + Tailwind CSS
- Componentes compartidos: `src/components/shared/`
- Datos estáticos: `src/data/`
- i18n: todas las cadenas en `src/lib/translations.ts` (ES + EN), consumidas con `useT()`

## Deploy

- Proyecto Vercel: `gtc2/mockup-gtc-azul`
- URL producción: `https://globaltalent-connections.com`
- Antes de deployar: `npm run build` debe pasar sin errores TypeScript
- Comando deploy: **`npm run deploy:prod`** (con nvm node v20.20.2 activo). El webhook de Vercel NO funciona: el deploy es siempre manual por CLI.
- **No usar `vercel --prod` a secas**: compila en el runtime de Vercel, donde el prerender está apagado, y publica la SPA vacía (mismo HTML de 6 KB en todas las rutas, sin `<h1>`). `deploy:prod` compila en local y sube el resultado ya compilado.
- La máquina que despliega necesita Chromium: `npx puppeteer browsers install chrome`. Si falta, el build no falla — avisa por consola y publica la SPA.
