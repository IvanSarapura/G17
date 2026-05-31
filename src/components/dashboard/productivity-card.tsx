'use client';

import { Sparkles } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import type { Productivity, StatTone } from '@/lib/dashboard/types';

// Paleta de estado del reporte original (idéntica al HTML de referencia).
const GOOD = '#1D9E75';
const MID = '#378ADD';
const BAD = '#E24B4A';
const TARGET = '#3B6D11';

const efConfig = {
  efficiency: { label: 'Eficiencia' },
} satisfies ChartConfig;

const TONE_CLASS: Record<StatTone, string> = {
  good: 'text-emerald-600 dark:text-emerald-400',
  bad: 'text-destructive',
  neutral: 'text-foreground',
};

/** Color de la barra de HH según el desvío respecto al objetivo. */
function hhColor(hh: number, target: number): string {
  const ratio = hh / target;
  return ratio <= 1 ? GOOD : ratio <= 1.3 ? MID : BAD;
}

/** Color de la barra de eficiencia según el % alcanzado. */
function efColor(efficiency: number): string {
  return efficiency >= 90 ? GOOD : efficiency >= 65 ? MID : BAD;
}

const SECTION_LABEL =
  'text-[11px] font-medium uppercase tracking-wide text-muted-foreground';

export function ProductivityCard({
  productivity,
  className,
}: {
  productivity: Productivity;
  className?: string;
}) {
  const { title, subtitle, target, points, stats, insight } = productivity;

  // Escala de las barras horizontales (idéntica al HTML: max * 1.06).
  const max = Math.max(...points.map((p) => p.hhPerUnit)) * 1.06;
  const objPos = (target / max) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-7">
        {/* Tarjetas-resumen */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p
                className={cn(
                  'text-2xl font-semibold tabular-nums',
                  TONE_CLASS[stat.tone],
                )}
              >
                {stat.value}
              </p>
              {stat.unit ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {stat.unit}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {/* Gráfico 1 — HH por puerta (barras horizontales, idéntico al HTML) */}
        <section className="flex flex-col gap-3">
          <p className={SECTION_LABEL}>
            HH por puerta equivalente — semana a semana (menor es mejor)
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {[
              { color: GOOD, label: 'En objetivo o mejor' },
              { color: MID, label: 'Hasta 30% sobre objetivo' },
              { color: BAD, label: 'Más de 30% sobre objetivo' },
            ].map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span
                  className="size-2.5 rounded-[2px]"
                  style={{ background: item.color }}
                />
                {item.label}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="h-[3px] w-3 rounded-full"
                style={{ background: TARGET }}
              />
              Objetivo {target} hh
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {points.map((p) => {
              const pct = (p.hhPerUnit / max) * 100;
              return (
                <div key={p.week} className="flex items-center gap-2">
                  <span className="w-11 shrink-0 text-xs text-muted-foreground">
                    {p.week}
                  </span>
                  <div className="relative h-6 flex-1 overflow-hidden rounded bg-muted">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${pct}%`,
                        background: hhColor(p.hhPerUnit, target),
                      }}
                    />
                    <div
                      className="absolute inset-y-0 z-10 w-0.5"
                      style={{ left: `${objPos}%`, background: TARGET }}
                      aria-hidden
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {p.hhPerUnit} hh
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gráfico 2 — Eficiencia semanal (barras verticales + línea objetivo) */}
        <section className="flex flex-col gap-2.5">
          <p className={SECTION_LABEL}>
            Eficiencia semanal — real vs. objetivo (100% = llega al objetivo)
          </p>
          <ChartContainer
            config={efConfig}
            className="aspect-auto h-[200px] w-full"
          >
            <BarChart data={points} margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                domain={[0, 120]}
                ticks={[0, 25, 50, 75, 100]}
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(v) => `${v}%`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine
                y={100}
                stroke={TARGET}
                strokeDasharray="5 4"
                strokeWidth={2}
                label={{
                  value: 'Objetivo 100%',
                  position: 'insideTopRight',
                  fontSize: 11,
                  fill: TARGET,
                }}
              />
              <Bar dataKey="efficiency" radius={[4, 4, 0, 0]} barSize={34}>
                {points.map((p) => (
                  <Cell key={p.week} fill={efColor(p.efficiency)} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </section>

        {/* Interpretación de la IA (callout idéntico al HTML: borde rojo izquierdo) */}
        <div
          className="rounded-r-lg bg-muted/40 px-4 py-3"
          style={{ borderLeft: `3px solid ${BAD}` }}
        >
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-amber-500" />
            Interpretación de la IA
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              Lo que muestran los datos:{' '}
            </span>
            {insight}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
