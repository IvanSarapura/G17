import { AnalysisResultSchema, type AnalysisResult } from './types';

const PERIODS = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'] as const;

const EFICIENCIA = [71, 73, 72, 76, 79, 82];
const COSTO = [48200, 47100, 47800, 45300, 43900, 42100];

/**
 * Datos de ejemplo que cumplen `AnalysisResultSchema`.
 *
 * Genéricos a propósito (placeholders) para iterar el diseño. En Fase 3 se
 * reemplaza por la respuesta real del endpoint de IA, que cumple el mismo
 * esquema, así que la UI no cambia.
 */
const MOCK_ANALYSIS: AnalysisResult = {
  metrics: [
    {
      id: 'eficiencia',
      label: 'Eficiencia operativa',
      value: EFICIENCIA[EFICIENCIA.length - 1],
      unit: 'percent',
      delta: 3.8,
      trend: 'up',
      goodWhen: 'up',
      series: PERIODS.map((period, i) => ({ period, value: EFICIENCIA[i] })),
      hint: 'Producción real sobre capacidad instalada',
    },
    {
      id: 'costo',
      label: 'Costo operativo mensual',
      value: COSTO[COSTO.length - 1],
      unit: 'currency',
      delta: -4.1,
      trend: 'down',
      goodWhen: 'down',
      series: PERIODS.map((period, i) => ({ period, value: COSTO[i] })),
      hint: 'Suma de costos directos e indirectos del mes',
    },
  ],
  trend: PERIODS.map((period, i) => ({
    period,
    eficiencia: EFICIENCIA[i],
    costo: COSTO[i],
  })),
  insights: [
    {
      id: 'turnos',
      title: 'Reorganizar turnos en planta',
      detail:
        'Los martes y jueves concentran 38% de las horas ociosas. Redistribuir la carga elevaría la eficiencia ~5 puntos sin contratar personal.',
      impact: 'alto',
      estimatedSaving: 6200,
      relatedMetric: 'eficiencia',
    },
    {
      id: 'proveedor',
      title: 'Consolidar compras de insumos',
      detail:
        'Se detectaron 4 proveedores para el mismo insumo con precios dispares. Consolidar en el más competitivo reduce el costo unitario un 9%.',
      impact: 'alto',
      estimatedSaving: 3100,
      relatedMetric: 'costo',
    },
    {
      id: 'merma',
      title: 'Controlar merma de materia prima',
      detail:
        'La merma supera el promedio del sector (7,4% vs. 4,5%). Un control de inventario semanal recuperaría parte de esa pérdida.',
      impact: 'medio',
      estimatedSaving: 1800,
      relatedMetric: 'costo',
    },
    {
      id: 'mantenimiento',
      title: 'Mantenimiento preventivo de equipos',
      detail:
        'Las paradas no planificadas explican 12% del tiempo perdido. Un plan preventivo mensual reduce las fallas inesperadas.',
      impact: 'bajo',
      estimatedSaving: 950,
      relatedMetric: 'eficiencia',
    },
  ],
  meta: {
    fileName: 'operaciones_2026.xlsx',
    analyzedAt: '2026-05-30T18:00:00.000Z',
    rows: 1248,
  },
};

/**
 * Devuelve el análisis simulado, validado contra el esquema.
 * @param fileName opcional, para reflejar el archivo subido por el usuario.
 */
export function getMockAnalysis(fileName?: string): AnalysisResult {
  const result: AnalysisResult = fileName
    ? { ...MOCK_ANALYSIS, meta: { ...MOCK_ANALYSIS.meta, fileName } }
    : MOCK_ANALYSIS;

  // Falla ruidosamente en dev si el mock deja de cumplir el contrato.
  return AnalysisResultSchema.parse(result);
}
