import { AnalysisResultSchema, type AnalysisResult } from './types';

const PERIODS = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'] as const;

// % de piezas OK sobre el total producido en la semana.
const EFICIENCIA = [84, 86, 85, 88, 90, 91];
// Tiempo promedio por pieza (min), sumando todas las estaciones.
const TIEMPO = [29, 28, 28, 25, 24, 22];

/**
 * Datos de ejemplo que cumplen `AnalysisResultSchema`.
 *
 * Operativos a propósito (sin pesos): reflejan el tipo de planillas de
 * producción que sube el usuario (avance por pieza/estación + asistencia). En
 * Fase 3 se reemplaza por la respuesta real del endpoint de IA, que cumple el
 * mismo esquema, así que la UI no cambia.
 */
const MOCK_ANALYSIS: AnalysisResult = {
  metrics: [
    {
      id: 'eficiencia',
      label: 'Eficiencia de producción',
      value: EFICIENCIA[EFICIENCIA.length - 1],
      unit: 'percent',
      delta: 3.4,
      trend: 'up',
      goodWhen: 'up',
      series: PERIODS.map((period, i) => ({ period, value: EFICIENCIA[i] })),
      hint: 'Piezas OK sobre el total producido',
    },
    {
      id: 'tiempo',
      label: 'Tiempo promedio por pieza',
      value: TIEMPO[TIEMPO.length - 1],
      unit: 'number',
      delta: -8.3,
      trend: 'down',
      goodWhen: 'down',
      series: PERIODS.map((period, i) => ({ period, value: TIEMPO[i] })),
      hint: 'Minutos promedio sumando las 5 estaciones',
    },
  ],
  trend: PERIODS.map((period, i) => ({
    period,
    eficiencia: EFICIENCIA[i],
    tiempo: TIEMPO[i],
  })),
  insights: [
    {
      id: 'cuello-soldado',
      title: 'Cuello de botella en Soldado',
      detail:
        'Soldado promedia 70 min por pieza, contra 8–20 min del resto de las estaciones. Concentra cerca del 60% del tiempo de cada orden y frena el avance hacia Armado final.',
      impact: 'alto',
      expectedGain: '−25% tiempo por orden',
      relatedMetric: 'tiempo',
    },
    {
      id: 'retrabajos',
      title: 'Retrabajos concentrados en Lijado y Soldado',
      detail:
        '1 de cada 12 piezas vuelve a proceso (estados "retrabajo" / "rehacer"), sobre todo en Lijado y Soldado. Estandarizar el control al cierre de cada etapa reduce los reprocesos.',
      impact: 'alto',
      expectedGain: '−40% reprocesos',
      relatedMetric: 'eficiencia',
    },
    {
      id: 'ausentismo',
      title: 'Ausentismo en el turno Mañana',
      detail:
        'Las faltas (incluidas las injustificadas) se concentran en el sector Soldado durante el turno Mañana, justo donde está el cuello de botella. Reforzar ese turno sostiene el ritmo.',
      impact: 'medio',
      expectedGain: '+3% asistencia',
      relatedMetric: 'eficiencia',
    },
    {
      id: 'horas-extra',
      title: 'Horas extra recurrentes en Soldado',
      detail:
        'El sobretiempo se repite semana a semana en Soldado para compensar el atraso. Balancear la carga entre los turnos Mañana y Tarde evitaría buena parte de esas horas extra.',
      impact: 'medio',
      expectedGain: '−1 turno extra/semana',
      relatedMetric: 'tiempo',
    },
    {
      id: 'datos-mezclados',
      title: 'Planillas cargadas con formatos mezclados',
      detail:
        'Las fechas, los estados y los horarios vienen en varios formatos distintos. La IA ya los normalizó para este análisis; unificarlos en origen agilizaría las próximas cargas.',
      impact: 'bajo',
      expectedGain: 'cargas más limpias',
      relatedMetric: 'eficiencia',
    },
  ],
  interpretation: {
    files: [],
    entities: [
      { label: 'Estaciones', value: 'Corte, Plegado, Soldado, Lijado, Armado final' },
      { label: 'Operarios', value: '7 operarios' },
      { label: 'Turnos', value: 'Mañana y Tarde' },
      { label: 'Órdenes de producción', value: '63 (OP-301 a OP-360)' },
      { label: 'Período', value: 'Oct – Nov 2024' },
    ],
    normalizations: [
      'Unifiqué 5 formatos de fecha distintos (08-10-2024, 09/10/24, 2024-10-10…).',
      'Agrupé 18 variantes de "Estado" en OK y Retrabajo (listo, pasa, term., rehacer…).',
      'Normalicé los horarios cargados de 6 formas distintas (7.26, 15h13, 16:07…).',
      'Unifiqué las horas extra ("1 hora", "1", "2") a un único formato numérico.',
    ],
    period: 'Oct – Nov 2024',
  },
  meta: {
    files: ['Avance_Produccion.csv', 'Asistencia_Horarios.csv'],
    analyzedAt: '2026-05-30T18:00:00.000Z',
    rows: 1062,
  },
};

/**
 * Plantillas de lectura por planilla (estructura detectada de los dos CSV de
 * ejemplo). Se mapean por índice sobre los nombres reales que sube el usuario.
 */
const FILE_TEMPLATES: ReadonlyArray<{ kind: string; rows: number; columns: string[] }> = [
  {
    kind: 'Avance de producción por pieza',
    rows: 780,
    columns: [
      'Fecha',
      'N° Orden',
      'Pieza',
      'Estación',
      'Operario',
      'Tiempo (min)',
      'Cant. OK',
      'Cant. rechazada',
      'Estado',
      'Turno',
    ],
  },
  {
    kind: 'Asistencia y horarios',
    rows: 282,
    columns: [
      'Fecha',
      'Operario',
      'Sector',
      'Entrada',
      'Salida',
      'Horas extra',
      'Ausencia',
      'Legajo',
      'Categoría',
    ],
  },
];

/** Construye la lectura por archivo a partir de los nombres reales subidos. */
function buildFileInterpretations(fileNames: string[]) {
  return fileNames.map((fileName, i) => {
    const template = FILE_TEMPLATES[i % FILE_TEMPLATES.length];
    return { fileName, ...template };
  });
}

/**
 * Devuelve el análisis simulado, validado contra el esquema.
 * @param fileNames opcional, para reflejar las planillas subidas por el usuario.
 */
export function getMockAnalysis(fileNames?: string[]): AnalysisResult {
  const names =
    fileNames && fileNames.length > 0 ? fileNames : MOCK_ANALYSIS.meta.files;

  const files = buildFileInterpretations(names);
  const rows = files.reduce((sum, f) => sum + f.rows, 0);

  const result: AnalysisResult = {
    ...MOCK_ANALYSIS,
    interpretation: { ...MOCK_ANALYSIS.interpretation, files },
    meta: { ...MOCK_ANALYSIS.meta, files: names, rows },
  };

  // Falla ruidosamente en dev si el mock deja de cumplir el contrato.
  return AnalysisResultSchema.parse(result);
}
