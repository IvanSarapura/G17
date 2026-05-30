import type { Metadata } from 'next';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { getMockAnalysis } from '@/lib/dashboard/mock';

export const metadata: Metadata = {
  title: 'Dashboard operativo',
  description:
    'Oportunidades de mejora operativa detectadas por IA a partir de tus datos.',
};

export default function DashboardPage() {
  // Fase 1/2: datos simulados. En Fase 3 esto se reemplaza por la respuesta
  // real del análisis (mismo contrato AnalysisResult).
  const analysis = getMockAnalysis();

  return (
    <main className="min-h-svh bg-muted/30">
      <DashboardShell initialData={analysis} />
    </main>
  );
}
