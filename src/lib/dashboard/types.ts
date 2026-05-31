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
  /** Tiempo promedio por pieza, en minutos. */
  tiempo: z.number(),
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
  /** Ganancia operativa esperada, en términos llanos (p.ej. "−25% tiempo por orden"). */
  expectedGain: z.string().optional(),
  /** A qué métrica afecta principalmente (id de Metric). */
  relatedMetric: z.string(),
});
export type Insight = z.infer<typeof InsightSchema>;

/** Lectura de la IA de una planilla cargada (para la pantalla de confirmación). */
export const FileInterpretationSchema = z.object({
  fileName: z.string(),
  /** Tipo de planilla detectado, p.ej. "Avance de producción por pieza". */
  kind: z.string(),
  rows: z.number(),
  /** Columnas detectadas y normalizadas. */
  columns: z.array(z.string()),
});
export type FileInterpretation = z.infer<typeof FileInterpretationSchema>;

/** Un dato clave detectado cruzando las planillas (label → valor legible). */
export const DetectedEntitySchema = z.object({
  label: z.string(),
  value: z.string(),
});
export type DetectedEntity = z.infer<typeof DetectedEntitySchema>;

/**
 * Lo que la IA entendió de las planillas, para que el usuario lo confirme antes
 * de ver el tablero. Acompaña al `AnalysisResult` (mismo contrato mock/backend).
 */
export const InterpretationSchema = z.object({
  files: z.array(FileInterpretationSchema).min(1),
  /** Entidades detectadas (estaciones, operarios, turnos, órdenes…). */
  entities: z.array(DetectedEntitySchema),
  /** Normalizaciones aplicadas a datos cargados de forma inconsistente. */
  normalizations: z.array(z.string()),
  /** Rango temporal cubierto, p.ej. "Oct – Nov 2024". */
  period: z.string().optional(),
});
export type Interpretation = z.infer<typeof InterpretationSchema>;

/** Metadatos del análisis ejecutado. */
export const AnalysisMetaSchema = z.object({
  /** Nombres de las planillas procesadas (una o varias). */
  files: z.array(z.string()).min(1),
  /** Fecha ISO 8601 del análisis. */
  analyzedAt: z.string(),
  /** Filas procesadas en total. */
  rows: z.number(),
});
export type AnalysisMeta = z.infer<typeof AnalysisMetaSchema>;

/**
 * Contexto que aporta el usuario en el asistente previo al dashboard.
 *
 * Reemplaza al "prompt en blanco": en vez de pedirle a un usuario no técnico
 * que sepa qué escribir, capturamos respuestas guiadas y se las pasamos a la IA
 * para orientar qué KPIs e indicadores generar. Los `enum` coinciden con los
 * `value` de las opciones del formulario (`@/lib/intake/questions`).
 */
export const BusinessTypeSchema = z.enum([
  'comercio',
  'produccion',
  'servicios',
  'distribucion',
  'otro',
]);
export type BusinessType = z.infer<typeof BusinessTypeSchema>;

export const ObjectiveSchema = z.enum([
  'reducir_costos',
  'aumentar_ventas',
  'mejorar_eficiencia',
  'controlar_stock',
]);
export type Objective = z.infer<typeof ObjectiveSchema>;

export const DataKindSchema = z.enum([
  'ventas',
  'costos',
  'produccion',
  'inventario',
  'mixto',
]);
export type DataKind = z.infer<typeof DataKindSchema>;

export const CurrencyChoiceSchema = z.enum(['ARS', 'USD', 'otra']);
export type CurrencyChoice = z.infer<typeof CurrencyChoiceSchema>;

/** Un turno de planta, con hora de inicio y fin en formato "HH:MM". */
export const ShiftSchema = z.object({
  start: z.string(),
  end: z.string(),
});
export type Shift = z.infer<typeof ShiftSchema>;

/** Un recurso material usado en producción: qué es y para qué se usa. */
export const MaterialResourceSchema = z.object({
  name: z.string(),
  use: z.string(),
});
export type MaterialResource = z.infer<typeof MaterialResourceSchema>;

/**
 * El asistente Guiado se enfoca en producción y captura contexto de planta
 * (turnos, productos, empleados, recursos). El modo Chat sigue usando las
 * preguntas genéricas (`businessType/objective/currency`), por eso todos los
 * campos son opcionales: cada modo completa el subconjunto que le corresponde.
 */
export const AnalysisContextSchema = z.object({
  // Producción (modo Guiado · paso Turnos)
  shifts: z.array(ShiftSchema).optional(),
  // Producción (modo Guiado · paso Contexto)
  products: z.string().max(300).optional(),
  employees: z.number().int().nonnegative().optional(),
  resources: z.array(MaterialResourceSchema).optional(),
  processes: z.array(z.string()).optional(),
  // Compartido (Guiado + Chat)
  dataKind: DataKindSchema.optional(),
  /** Aclaración libre cuando se elige "Prefiero aclarar" (dataKind = 'mixto'). */
  dataKindDetail: z.string().max(200).optional(),
  /** Card de texto opcional del paso "¿Qué contiene tu planilla?". */
  dataKindNotes: z.string().max(500).optional(),
  // Solo modo Chat (se mantienen por compatibilidad).
  businessType: BusinessTypeSchema.optional(),
  objective: ObjectiveSchema.optional(),
  currency: CurrencyChoiceSchema.optional(),
  /** Texto libre opcional: la "opción a chat" para contar algo puntual. */
  notes: z.string().max(500).optional(),
});
export type AnalysisContext = z.infer<typeof AnalysisContextSchema>;

/** Pedido de análisis en el borde de la llamada (el File no es serializable). */
export type AnalysisRequest = { files: File[]; context: AnalysisContext };

/** Resultado completo del análisis: lo que pinta el dashboard. */
export const AnalysisResultSchema = z.object({
  /** Exactamente 2 KPIs en esta iteración. */
  metrics: z.array(MetricSchema).length(2),
  trend: z.array(TrendPointSchema).min(2),
  insights: z.array(InsightSchema),
  /** Lectura de la IA de las planillas, para la pantalla de confirmación previa. */
  interpretation: InterpretationSchema,
  meta: AnalysisMetaSchema,
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
