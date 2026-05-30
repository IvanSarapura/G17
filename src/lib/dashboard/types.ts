import { z } from 'zod';

/**
 * Contrato de datos del análisis de IA.
 *
 * Este esquema es la única fuente de verdad que comparten el mock (Fase 1/2) y
 * la respuesta real del backend (Fase 3). Cambiar de mock a real solo cambia el
 * origen de los datos, no la UI.
 */

/** Dirección de la tendencia de una métrica respecto al período anterior. */
export const TrendDirectionSchema = z.enum(['up', 'down', 'flat']);
export type TrendDirection = z.infer<typeof TrendDirectionSchema>;

/** Cómo se interpreta la métrica: ¿subir es bueno (eficiencia) o malo (costo)? */
export const GoodWhenSchema = z.enum(['up', 'down']);
export type GoodWhen = z.infer<typeof GoodWhenSchema>;

/** Unidad de formato para mostrar el valor de la métrica. */
export const MetricUnitSchema = z.enum(['percent', 'currency', 'number']);
export type MetricUnit = z.infer<typeof MetricUnitSchema>;

/** Punto de la mini-serie (sparkline) de cada KPI. */
export const SparkPointSchema = z.object({
  period: z.string(),
  value: z.number(),
});
export type SparkPoint = z.infer<typeof SparkPointSchema>;

/** Una métrica/KPI mostrada como tarjeta del bento. */
export const MetricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  unit: MetricUnitSchema,
  /** Variación porcentual vs. el período anterior (p.ej. 4.2 => +4.2%). */
  delta: z.number(),
  trend: TrendDirectionSchema,
  goodWhen: GoodWhenSchema,
  series: z.array(SparkPointSchema).min(2),
  hint: z.string().optional(),
});
export type Metric = z.infer<typeof MetricSchema>;

/** Punto de la serie temporal del gráfico principal (dos métricas combinadas). */
export const TrendPointSchema = z.object({
  period: z.string(),
  eficiencia: z.number(),
  costo: z.number(),
});
export type TrendPoint = z.infer<typeof TrendPointSchema>;

/** Nivel de impacto estimado de una oportunidad detectada por la IA. */
export const ImpactSchema = z.enum(['alto', 'medio', 'bajo']);
export type Impact = z.infer<typeof ImpactSchema>;

/** Oportunidad de mejora operativa detectada por la IA. */
export const InsightSchema = z.object({
  id: z.string(),
  title: z.string(),
  detail: z.string(),
  impact: ImpactSchema,
  /** Ahorro mensual estimado, en la moneda del negocio. */
  estimatedSaving: z.number(),
  /** A qué métrica afecta principalmente (id de Metric). */
  relatedMetric: z.string(),
});
export type Insight = z.infer<typeof InsightSchema>;

/** Metadatos del análisis ejecutado. */
export const AnalysisMetaSchema = z.object({
  fileName: z.string(),
  /** Fecha ISO 8601 del análisis. */
  analyzedAt: z.string(),
  /** Filas procesadas del Excel. */
  rows: z.number(),
});
export type AnalysisMeta = z.infer<typeof AnalysisMetaSchema>;

/** Resultado completo del análisis: lo que pinta el dashboard. */
export const AnalysisResultSchema = z.object({
  /** Exactamente 2 KPIs en esta iteración. */
  metrics: z.array(MetricSchema).length(2),
  trend: z.array(TrendPointSchema).min(2),
  insights: z.array(InsightSchema),
  meta: AnalysisMetaSchema,
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
