'use client';

import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Shift } from '@/lib/dashboard/types';

type ShiftsStepProps = {
  shifts: Shift[] | undefined;
  onChange: (shifts: Shift[]) => void;
  disabled?: boolean;
};

const EMPTY_SHIFT: Shift = { start: '', end: '' };

/**
 * Paso "Turnos": primero pregunta si hay más de un turno. Con "No" se configura
 * un único horario; con "Sí" se habilita una lista repetible de turnos.
 */
export function ShiftsStep({ shifts, onChange, disabled }: ShiftsStepProps) {
  // `multiple` es estado de UI; al volver al paso se reconstruye desde los datos.
  const [multiple, setMultiple] = React.useState<boolean | null>(() =>
    shifts && shifts.length > 1
      ? true
      : shifts && shifts.length === 1
        ? false
        : null,
  );

  const rows = shifts && shifts.length > 0 ? shifts : [EMPTY_SHIFT];

  function chooseSingle() {
    setMultiple(false);
    onChange([rows[0] ?? { ...EMPTY_SHIFT }]);
  }

  function chooseMultiple() {
    setMultiple(true);
    onChange(rows.length > 0 ? rows : [{ ...EMPTY_SHIFT }]);
  }

  function updateShift(index: number, patch: Partial<Shift>) {
    onChange(rows.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function addShift() {
    onChange([...rows, { ...EMPTY_SHIFT }]);
  }

  function removeShift(index: number) {
    const next = rows.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : [{ ...EMPTY_SHIFT }]);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Configurá los horarios de trabajo de tu planta.
        </p>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">¿Hay más de 1 turno?</span>
          <div
            role="radiogroup"
            aria-label="¿Hay más de 1 turno?"
            className="grid gap-3 sm:grid-cols-2"
          >
            <BinaryOption
              label="No, un solo turno"
              selected={multiple === false}
              onSelect={chooseSingle}
              disabled={disabled}
            />
            <BinaryOption
              label="Sí, varios turnos"
              selected={multiple === true}
              onSelect={chooseMultiple}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {multiple !== null ? (
        <div className="flex flex-col gap-3">
          {rows.map((shift, index) => (
            <ShiftRow
              key={index}
              shift={shift}
              index={index}
              numbered={multiple}
              removable={multiple && rows.length > 1}
              onChange={(patch) => updateShift(index, patch)}
              onRemove={() => removeShift(index)}
              disabled={disabled}
            />
          ))}

          {multiple ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addShift}
              disabled={disabled}
              className="self-start"
            >
              <Plus className="size-4" />
              Agregar turno
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function BinaryOption({
  label,
  selected,
  onSelect,
  disabled,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-colors outline-none',
        'focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'disabled:pointer-events-none disabled:opacity-50',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-accent/50',
      )}
    >
      {label}
    </button>
  );
}

function ShiftRow({
  shift,
  index,
  numbered,
  removable,
  onChange,
  onRemove,
  disabled,
}: {
  shift: Shift;
  index: number;
  numbered: boolean;
  removable: boolean;
  onChange: (patch: Partial<Shift>) => void;
  onRemove: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-end gap-3 rounded-lg border p-3">
      {numbered ? (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground">
          {index + 1}
        </span>
      ) : null}
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor={`shift-${index}-start`}>Inicio</Label>
        <Input
          id={`shift-${index}-start`}
          type="time"
          value={shift.start}
          onChange={(e) => onChange({ start: e.target.value })}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor={`shift-${index}-end`}>Fin</Label>
        <Input
          id={`shift-${index}-end`}
          type="time"
          value={shift.end}
          onChange={(e) => onChange({ end: e.target.value })}
          disabled={disabled}
        />
      </div>
      {removable ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Eliminar turno ${index + 1}`}
        >
          <Trash2 className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
