import { Lightbulb } from 'lucide-react';

import { MetricCard } from '@/components/dashboard/metric-card';
import { getMockAnalysis } from '@/lib/dashboard/mock';

const ACCENTS = ['var(--chart-1)', 'var(--chart-2)'] as const;

/**
 * Vista previa del producto para el hero: usa los componentes y datos reales
 * del dashboard, enmarcados en una ventana, para que la landing muestre el
 * producto auténtico en vez de un mockup falso.
 */
export function HeroPreview() {
  const analysis = getMockAnalysis();
  const topInsight = analysis.insights[0];

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-linear-to-tr from-primary/10 via-transparent to-emerald-500/10 blur-2xl"
      />
      <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/5">
        <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-3">
          <span className="size-3 rounded-full bg-red-400/70" />
          <span className="size-3 rounded-full bg-amber-400/70" />
          <span className="size-3 rounded-full bg-emerald-400/70" />
          <span className="ml-3 truncate text-xs text-muted-foreground">
            {PRODUCT_PATH}
          </span>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2">
          {analysis.metrics.map((metric, i) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          ))}
        </div>

        <div className="border-t bg-muted/30 px-4 py-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{topInsight.title}</p>
              {topInsight.expectedGain ? (
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Ganancia esperada: {topInsight.expectedGain}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRODUCT_PATH = 'lupia.app/dashboard';
