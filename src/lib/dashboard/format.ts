import type { MetricUnit } from './types';

const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat('es-AR', {
  maximumFractionDigits: 1,
});

const number = new Intl.NumberFormat('es-AR');

/** Formatea el valor de una métrica según su unidad. */
export function formatMetricValue(value: number, unit: MetricUnit): string {
  switch (unit) {
    case 'currency':
      return currency.format(value);
    case 'percent':
      return `${percent.format(value)}%`;
    case 'number':
      return number.format(value);
  }
}

/** Formatea un delta porcentual con signo explícito (p.ej. "+3.8%"). */
export function formatDelta(delta: number): string {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${percent.format(delta)}%`;
}

/** Formatea un ahorro estimado mensual como moneda. */
export function formatSaving(value: number): string {
  return currency.format(value);
}
