'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CalendarClock, FileSpreadsheet, Loader2, Rows3 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { loadAnalysis } from '@/lib/dashboard/session';
import type { AnalysisResult } from '@/lib/dashboard/types';
import { DashboardNavbar } from './dashboard-navbar';
import { InsightsPanel } from './insights-panel';
import { ProductivityCard } from './productivity-card';

const dateFmt = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

export function DashboardShell() {
  const router = useRouter();
  // El dashboard se alimenta del análisis generado en `/analizar` (guardado en
  // sessionStorage). Sin análisis cargado, redirigimos al asistente: no hay
  // vista de ejemplo, el flujo siempre pasa por el asistente.
  const [data, setData] = React.useState<AnalysisResult | null>(null);

  React.useEffect(() => {
    const stored = loadAnalysis();
    if (stored) {
      setData(stored);
    } else {
      router.replace('/analizar');
    }
  }, [router]);

  if (!data) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <DashboardNavbar />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard operativo
          </h1>
          <p className="text-sm text-muted-foreground">
            Productividad de tu planta, leída por IA desde tus planillas
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Reporte principal: productividad de mano de obra (HH por puerta) */}
          <ProductivityCard
            productivity={data.productivity}
            className="lg:col-span-2"
          />

          {/* Columna derecha: resumen del análisis + recomendaciones de la IA */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Último análisis
                </CardTitle>
                <CardDescription>
                  {data.meta.files.length > 1
                    ? 'Resumen de las planillas procesadas'
                    : 'Resumen de la planilla procesada'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm">
                <ul className="flex flex-col gap-1.5">
                  {data.meta.files.map((name) => (
                    <li key={name} className="flex items-center gap-2">
                      <FileSpreadsheet className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate font-medium">{name}</span>
                    </li>
                  ))}
                </ul>
                <Separator />
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Rows3 className="size-4" /> Filas procesadas
                  </span>
                  <span className="font-medium text-foreground tabular-nums">
                    {data.meta.rows.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CalendarClock className="size-4" /> Fecha
                  </span>
                  <span className="font-medium text-foreground">
                    {dateFmt.format(new Date(data.meta.analyzedAt))}
                  </span>
                </div>
              </CardContent>
            </Card>

            <InsightsPanel
              insights={data.insights}
              recommendation={data.recommendation}
            />
          </div>
        </div>
      </div>
    </>
  );
}
