'use client';

import * as React from 'react';
import { CalendarClock, FileSpreadsheet, Rows3 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { env } from '@/lib/env';
import type { AnalysisResult } from '@/lib/dashboard/types';
import { InsightsPanel } from './insights-panel';
import { MetricCard } from './metric-card';
import { TrendChart } from './trend-chart';
import { UploadDialog } from './upload-dialog';

const ACCENTS = ['var(--chart-1)', 'var(--chart-2)'] as const;

const dateFmt = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

export function DashboardShell({ initialData }: { initialData: AnalysisResult }) {
  const [data, setData] = React.useState(initialData);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard operativo
          </h1>
          <p className="text-sm text-muted-foreground">
            {env.NEXT_PUBLIC_APP_NAME} · Oportunidades de mejora detectadas por IA
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UploadDialog onAnalyzed={setData} />
        </div>
      </header>

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
            <CardDescription>Resumen del archivo procesado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-muted-foreground" />
              <span className="truncate font-medium">{data.meta.fileName}</span>
            </div>
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
              Eficiencia vs. costo en los últimos meses
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
  );
}
