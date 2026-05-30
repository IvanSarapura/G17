import { Lightbulb, TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { formatSaving } from '@/lib/dashboard/format';
import type { Impact, Insight } from '@/lib/dashboard/types';

const IMPACT_STYLES: Record<Impact, string> = {
  alto: 'border-transparent bg-emerald-600/15 text-emerald-700 dark:text-emerald-400',
  medio: 'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400',
  bajo: 'border-transparent bg-muted text-muted-foreground',
};

const IMPACT_LABEL: Record<Impact, string> = {
  alto: 'Impacto alto',
  medio: 'Impacto medio',
  bajo: 'Impacto bajo',
};

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  const totalSaving = insights.reduce((sum, i) => sum + i.estimatedSaving, 0);

  return (
    <Card className="gap-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="size-4 text-amber-500" />
          Oportunidades detectadas
        </CardTitle>
        <CardDescription>
          Análisis de IA sobre tus datos operativos
        </CardDescription>
        <div className="col-start-1 mt-3 flex items-center gap-2 rounded-lg bg-emerald-600/10 px-3 py-2 text-sm">
          <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-muted-foreground">Ahorro potencial mensual</span>
          <span className="ml-auto font-semibold text-emerald-700 tabular-nums dark:text-emerald-400">
            {formatSaving(totalSaving)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <ScrollArea className="h-[320px]">
          <ul className="px-6">
            {insights.map((insight, index) => (
              <li key={insight.id}>
                {index > 0 ? <Separator className="my-1" /> : null}
                <article className="flex flex-col gap-1.5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-medium leading-snug">
                      {insight.title}
                    </h3>
                    <Badge className={cn('shrink-0', IMPACT_STYLES[insight.impact])}>
                      {IMPACT_LABEL[insight.impact]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {insight.detail}
                  </p>
                  <p className="text-xs font-medium text-emerald-700 tabular-nums dark:text-emerald-400">
                    Ahorro estimado: {formatSaving(insight.estimatedSaving)}/mes
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
