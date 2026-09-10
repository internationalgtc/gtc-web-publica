# gtc-web-publica

**Este repo es el sitio público de Global Talent Connections.** Es lo que ve un cliente que entra a buscar asistentes virtuales.

| | |
|---|---|
| **Dominio que sirve** | `globaltalent-connections.com` y `www.globaltalent-connections.com` |
| **Proyecto en Vercel** | `mockup-gtc-azul` (nombre viejo, se mantiene a propósito, ver abajo) |
| **Despliegue** | manual, **`npm run deploy:prod`** desde la terminal. No hay integración con GitHub ni workflow: mergear un PR **no publica nada**. |

> ⚠️ **No desplegar con `vercel --prod` a secas.** Ese camino compila en el runtime de Vercel, donde el prerender está apagado a propósito, y publica la SPA vacía: todas las rutas quedan con el mismo HTML de 6 KB sin `<h1>`. Las landings de tráfico pagado pierden la nota de «experiencia de la página de destino» de Google Ads. `npm run deploy:prod` compila en local con Chromium y sube el resultado ya compilado.
>
> Requisito de la máquina que despliega: `npm install` y `npx puppeteer browsers install chrome`. Sin Chromium el build NO falla — avisa por consola y publica la SPA, que es el fallo silencioso que hay que mirar.
| **Stack** | React + TypeScript estricto, Vite, Tailwind |

## No confundir con `gtc-academia`

Hay un segundo repo de web y la confusión ya costó tiempo. La diferencia:

| Repo | Dominio | Qué tiene |
|---|---|---|
| **gtc-web-publica** (este) | `globaltalent-connections.com` | El sitio comercial: portada, servicios, empleos, contacto, calculadora |
| **gtc-academia** | `www.globaltalentconnections.es` | Nexus Academy (formación, tableros, videollamada) + 8 landings |

Las diez páginas que existen en los dos sitios se redirigen con 301 desde el `.es` hacia acá, así que **este repo manda en todo lo comercial**. Las veinte rutas propias de la Academia no se redirigen y viven solo allá.

## Por qué el proyecto de Vercel sigue llamándose `mockup-gtc-azul`

Porque `mockup-gtc-azul.vercel.app` está en la lista de orígenes permitidos del endpoint de leads de Nexus (`src/app/api/leads/public/route.ts`, `ALLOWED_ORIGINS` y `ALLOWED_ORIGIN_PATTERNS`). Renombrar el proyecto cambia ese dominio y **los formularios de las vistas previas dejarían de poder enviar leads** por CORS. Producción no se vería afectada, pero no vale la pena por un nombre.

## Atribución de leads — leer antes de tocar los formularios

Los tres formularios (portada, contacto, calculadora) mandan a Nexus el origen de la visita: los parámetros de campaña y el referrer. Reglas que no se pueden romper:

- **Se captura al llegar, no al enviar.** `captureUTMs()` corre una vez en `App.tsx` y guarda en `sessionStorage`. Esto es una SPA: si se leyera la dirección en el momento de enviar, cualquier navegación previa la habría vaciado.
- **Gana el primer contacto de la visita**, no la página donde la persona terminó escribiendo.
- **El referrer del propio dominio se descarta**: si viene de acá, la persona ya estaba dentro y no dice nada del origen.
- El referrer importa más que los parámetros de campaña, porque estos solo existen si alguien etiquetó el enlace y quien llega buscando en Google nunca viene etiquetado. Ese tráfico produce el 98% de los clientes ganados.

Nexus recibe el campo, lo sanea y se queda con dominio y ruta, descartando la query a propósito (el referrer de un buscador arrastra el término buscado, que es dato personal).

## Diseño

Hay un sistema de diseño aprobado y cerrado: paleta, tipografías y patrones están en `CLAUDE.md`. No se introducen colores ni fuentes fuera de esa lista.

## Antes de desplegar

```bash
npm run build     # tiene que pasar sin errores de TypeScript
vercel --prod     # con node v20.20.2 activo
```
