'use client';

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { TrendPoint } from '@/lib/dashboard/types';

const chartConfig = {
  eficiencia: { label: 'Eficiencia (%)', color: 'var(--chart-1)' },
  costo: { label: 'Costo ($)', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const compact = new Intl.NumberFormat('es-AR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="fill-eficiencia" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="period"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          yAxisId="eficiencia"
          tickLine={false}
          axisLine={false}
          width={36}
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          yAxisId="costo"
          orientation="right"
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v) => `$${compact.format(v as number)}`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          yAxisId="costo"
          dataKey="costo"
          fill="var(--color-costo)"
          radius={[4, 4, 0, 0]}
          barSize={28}
          isAnimationActive={false}
        />
        <Area
          yAxisId="eficiencia"
          dataKey="eficiencia"
          type="natural"
          stroke="var(--color-eficiencia)"
          strokeWidth={2}
          fill="url(#fill-eficiencia)"
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}
