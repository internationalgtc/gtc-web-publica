# Avance — Matheo

Dos líneas al cerrar cada sesión: hecho y verificado, siguiente paso exacto, decisiones tomadas. Lo lee Ariel al día siguiente. Orden de trabajo: `spec-webs-al-100-matheo-2026-10-16.pdf`.

## 2026-10-16

- **Hecho y verificado.** PR 0: #61 mergeado y publicado con `npm run deploy:prod` (#63 sacó /calculadora-ahorro del prerender y puso 301 a /servicios). Comprobado: /, /contacto, /servicios, /nosotros, /que-es-gtc y /asistente-virtual entre 30 y 80 KB con `<h1>`; el JS publicado sin «52 %». PR 1: #62 (contra `candidatos`) publicado en gtc-empleos; `curl -sL https://empleos.globaltalent-connections.com/ | grep -c "GTM-W66\|AW-18022"` → 0, solo G-J6SJCJ1PK7; evento `candidato_postula` en los 5 enlaces a Nexus.
- **Siguiente paso.** Lunes 19: PR 2 (vocabulario del portal con el archivo de Antonio y las `etiquetas` de la API) y PR 3 (restos de vocabulario en la pública), con la prueba automática de vocabulario copiada de Nexus.
- **Decisiones.** Ramas (sección 5): `git diff --stat origin/main origin/candidatos -- src/components` → 13 de 16 archivos distintos, lejos del 80 % compartido ⇒ opción B, dos ramas sincronizadas con check de rama atrasada (PR 7). En el portal no va ninguna conversión de Ads, solo GA4.
