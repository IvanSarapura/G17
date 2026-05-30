'use client';

import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { Area, AreaChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { formatDelta, formatMetricValue } from '@/lib/dashboard/format';
import type { Metric } from '@/lib/dashboard/types';

type MetricCardProps = {
  metric: Metric;
  /** Variable CSS de color del gráfico, p.ej. "var(--chart-1)". */
  accent: string;
  className?: string;
};

export function MetricCard({ metric, accent, className }: MetricCardProps) {
  const isGood = metric.trend === metric.goodWhen;
  const TrendIcon =
    metric.trend === 'up'
      ? ArrowUpRight
      : metric.trend === 'down'
        ? ArrowDownRight
        : Minus;

  const chartConfig = {
    value: { label: metric.label, color: accent },
  } satisfies ChartConfig;

  return (
    <Card
      className={cn(
        'justify-between gap-4 overflow-hidden transition-shadow hover:shadow-md',
        className,
      )}
    >
      <CardHeader className="gap-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {formatMetricValue(metric.value, metric.unit)}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-sm font-medium',
              isGood
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-destructive',
            )}
          >
            <TrendIcon className="size-4" />
            {formatDelta(metric.delta)}
          </span>
        </div>
        {metric.hint ? (
          <p className="text-xs text-muted-foreground">{metric.hint}</p>
        ) : null}
      </CardHeader>
      <CardContent className="px-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-20 w-full"
        >
          <AreaChart
            data={metric.series}
            margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient
                id={`fill-${metric.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="value"
              type="natural"
              stroke={accent}
              strokeWidth={2}
              fill={`url(#fill-${metric.id})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
