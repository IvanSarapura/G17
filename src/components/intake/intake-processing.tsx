'use client';

import * as React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const MESSAGES = [
  'Leyendo tus planillas…',
  'Normalizando fechas y estados…',
  'Cruzando producción con asistencia…',
  'Detectando cuellos de botella…',
  'Armando tu tablero…',
] as const;

export function IntakeProcessing({ summary }: { summary: string }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <span className="relative flex size-16 items-center justify-center rounded-2xl bg-primary/10">
        <Sparkles className="size-7 text-primary" />
        <Loader2 className="absolute size-16 animate-spin text-primary/30" />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-lg font-semibold">Analizando con IA</p>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {MESSAGES[index]}
        </p>
      </div>
      <p className="max-w-xs truncate text-xs text-muted-foreground">
        {summary}
      </p>
    </div>
  );
}
