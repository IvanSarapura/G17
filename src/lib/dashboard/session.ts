import { AnalysisResultSchema, type AnalysisResult } from './types';

/**
 * Hand-off del resultado entre el asistente (`/analizar`) y el dashboard
 * (`/dashboard`). Usamos `sessionStorage` porque el resultado deriva de un
 * `File` (no serializable a la URL), no hay backend que lo persista todavía y
 * sobrevive a un refresh dentro de la misma pestaña. La lectura se valida con
 * el mismo contrato del dashboard, así nunca confiamos en datos crudos.
 */
const KEY = 'lupia:last-analysis';

const hasStorage = (): boolean =>
  typeof window !== 'undefined' && 'sessionStorage' in window;

export function saveAnalysis(result: AnalysisResult): void {
  if (!hasStorage()) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(result));
  } catch {
    // Quota / modo privado: el dashboard caerá al estado vacío.
  }
}

export function loadAnalysis(): AnalysisResult | null {
  if (!hasStorage()) return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = AnalysisResultSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function clearAnalysis(): void {
  if (!hasStorage()) return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // no-op
  }
}
