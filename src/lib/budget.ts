// Presupuesto declarado por el lead en los formularios de la web.
// Nexus (`/api/leads/public`) convierte cada opción al suelo del tramo en
// `budget_min`; la etiqueta legible va en `description` para que la gestora la
// vea en la ficha y en el aviso de Slack.
export const BUDGET_MIN: Record<string, string> = {
  menos_1200: '0',
  '1200_1800': '1200_1800',
  mas_2000: '2000',
}

const BUDGET_LABEL: Record<string, string> = {
  menos_1200: 'Menos de 1.200 €',
  '1200_1800': '1.200 € a 1.800 €',
  mas_2000: '+ 2.000 €',
}

export function withBudget(description: string | undefined, budget: string): string {
  const label = BUDGET_LABEL[budget]
  if (!label) return description ?? ''
  return [description, `Presupuesto declarado: ${label}/mes`].filter(Boolean).join(' · ')
}
