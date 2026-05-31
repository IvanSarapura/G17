'use client';

import { Check, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type OptionCardProps = {
  icon: LucideIcon;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
};

/**
 * Tarjeta grande seleccionable: clic en vez de tipear. Semántica de radio para
 * que sea navegable por teclado dentro de un `role="radiogroup"`.
 */
export function OptionCard({
  icon: Icon,
  label,
  description,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'group relative flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-colors outline-none',
        'focus-visible:ring-[3px] focus-visible:ring-ring/50',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-accent/50',
      )}
    >
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors',
          selected
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground group-hover:text-foreground',
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="font-medium">{label}</span>
        {description ? (
          <span className="text-sm text-muted-foreground">{description}</span>
        ) : null}
      </span>
      {selected ? (
        <Check className="size-5 shrink-0 text-primary" aria-hidden />
      ) : null}
    </button>
  );
}
