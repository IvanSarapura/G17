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
import { MetricCard } from './metric-card';
import { TrendChart } from './trend-chart';

const ACCENTS = ['var(--chart-1)', 'var(--chart-2)'] as const;

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
            Oportunidades de mejora detectadas por IA
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {data.metrics.map((metric, i) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            accent={ACCENTS[i % ACCENTS.length]}
            className="md:col-span-1 xl:col-span-2"
          />
        ))}

        <Card className="justify-between md:col-span-2 xl:col-span-2">
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

        <Card className="md:col-span-2 xl:col-span-4">
          <CardHeader>
            <CardTitle>Tendencia operativa</CardTitle>
            <CardDescription>
              Eficiencia vs. tiempo por pieza en las últimas semanas
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[340px]">
            <TrendChart data={data.trend} />
          </CardContent>
        </Card>

          <div className="md:col-span-2 xl:col-span-2">
            <InsightsPanel insights={data.insights} />
          </div>
        </div>
      </div>
    </>
  );
}
