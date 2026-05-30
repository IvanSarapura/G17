import { env } from '@/lib/env';
import { ApiError } from '@/lib/api/client';
import { getMockAnalysis } from './mock';
import { AnalysisResultSchema, type AnalysisResult } from './types';

export const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.csv'] as const;
export const ACCEPT_ATTR = ACCEPTED_EXTENSIONS.join(',');

/** ¿El nombre de archivo tiene una extensión soportada? */
export function isAcceptedFile(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/**
 * FASE 3 — Análisis real: sube el Excel al backend de IA y valida la respuesta
 * contra el contrato. Usa `fetch` con `FormData` directamente porque `apiClient`
 * fuerza `Content-Type: application/json`, lo que rompe el multipart.
 */
export async function uploadAnalysis(file: File): Promise<AnalysisResult> {
  const body = new FormData();
  body.append('file', file);

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/analyze`, {
    method: 'POST',
    body,
  });

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}: ${res.statusText}`, res.status);
  }

  const data = (await res.json()) as unknown;
  const parsed = AnalysisResultSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError(
      `La respuesta del análisis no cumple el formato esperado: ${parsed.error.message}`,
      422,
    );
  }
  return parsed.data;
}

/**
 * FASE 2 — Análisis simulado: imita la latencia del backend y devuelve el mock
 * con el nombre del archivo subido. Reemplazar por `uploadAnalysis` en Fase 3.
 */
export async function simulateAnalysis(file: File): Promise<AnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 1400));
  return getMockAnalysis(file.name);
}

/**
 * Punto único de conmutación mock ↔ real.
 * Cuando el backend esté listo (Fase 3), cambiar a `uploadAnalysis`.
 */
export const analyzeFile = simulateAnalysis;
