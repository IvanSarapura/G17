import type { Metadata } from 'next';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export const metadata: Metadata = {
  title: 'Dashboard operativo',
  description:
    'Oportunidades de mejora operativa detectadas por IA a partir de tus datos.',
};

export default function DashboardPage() {
  // El análisis se genera en `/analizar` y viaja por sessionStorage; el shell lo
  // lee en el cliente y, si no hay ninguno, redirige al asistente.
  return (
    <main className="min-h-svh bg-muted/30">
      <DashboardShell />
    </main>
  );
}
