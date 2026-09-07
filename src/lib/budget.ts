// Presupuesto declarado por el lead en los formularios de la web.
// Nexus (`/api/leads/public`) guarda `budget_option` como número en `budget_min`,
// así que mandamos el suelo del tramo; la etiqueta legible va en `description`
// para que la gestora la vea en la ficha y en el aviso de Slack.
export const BUDGET_MIN: Record<string, string> = {
  menos_1200: '0',
  '1200_2000': '1200',
  mas_2000: '2000',
}

const BUDGET_LABEL: Record<string, string> = {
  menos_1200: 'Menos de 1.200 €',
  '1200_2000': '1.200 – 2.000 €',
  mas_2000: 'Más de 2.000 €',
}

export function withBudget(description: string | undefined, budget: string): string {
  const label = BUDGET_LABEL[budget]
  if (!label) return description ?? ''
  return [description, `Presupuesto declarado: ${label}/mes`].filter(Boolean).join(' · ')
}
