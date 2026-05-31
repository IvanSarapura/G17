'use client';

import { Progress } from '@/components/ui/progress';

type IntakeProgressProps = {
  /** Paso actual (base 0). */
  current: number;
  total: number;
  label: string;
};

export function IntakeProgress({ current, total, label }: IntakeProgressProps) {
  const value = Math.round(((current + 1) / total) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">
          Paso {current + 1} de {total}
        </span>
      </div>
      <Progress value={value} />
    </div>
  );
}
