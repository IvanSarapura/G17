'use client';

import {
  ArrowLeft,
  ClipboardList,
  FileSpreadsheet,
  ScanSearch,
  Sparkles,
  WandSparkles,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QUESTIONS, choiceLabel } from '@/lib/intake/questions';
import type { AnalysisContext, AnalysisResult } from '@/lib/dashboard/types';

type InterpretationPreviewProps = {
  result: AnalysisResult;
  context: Partial<AnalysisContext>;
  onConfirm: () => void;
  onBack: () => void;
  disabled?: boolean;
};

export function InterpretationPreview({
  result,
  context,
  onConfirm,
  onBack,
  disabled,
}: InterpretationPreviewProps) {
  const { interpretation } = result;
  const rows = contextRows(context);

  return (
    <div className="flex flex-col gap-4">
      {/* A · Planillas leídas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileSpreadsheet className="size-4 text-primary" />
            Planillas leídas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {interpretation.files.map((file) => (
            <div
              key={file.fileName}
              className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <FileSpreadsheet className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate text-sm font-medium">
                  {file.fileName}
                </span>
                <Badge variant="secondary" className="font-normal">
                  {file.kind}
                </Badge>
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                  {file.rows.toLocaleString('es-AR')} filas
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {file.columns.map((col) => (
                  <span
                    key={col}
                    className="rounded-md border bg-background px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* B · Lo que detecté */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScanSearch className="size-4 text-primary" />
            Lo que detecté
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {interpretation.entities.map((entity) => (
            <div
              key={entity.label}
              className="flex flex-col gap-0.5 rounded-lg border p-3"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {entity.label}
              </span>
              <span className="text-sm font-medium">{entity.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* C · Lo que ordené por vos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <WandSparkles className="size-4 text-primary" />
            Lo que ordené por vos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2.5">
            {interpretation.normalizations.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* D · El contexto que nos diste */}
      {rows.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="size-4 text-primary" />
              El contexto que nos diste
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-0">
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={cnRow(i)}
              >
                <span className="shrink-0 text-sm text-muted-foreground sm:w-44">
                  {row.label}
                </span>
                <span className="text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {/* Acciones */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <Button variant="ghost" onClick={onBack} disabled={disabled}>
          <ArrowLeft className="size-4" />
          Volver a editar
        </Button>
        <Button onClick={onConfirm} disabled={disabled}>
          <Sparkles className="size-4" />
          Ver mi tablero
        </Button>
      </div>
    </div>
  );
}

function cnRow(index: number): string {
  return index === 0
    ? 'flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-3'
    : 'flex flex-col gap-0.5 border-t py-2.5 sm:flex-row sm:gap-3';
}

/** Etiqueta legible de un campo de selección (dataKind / chat) vía `QUESTIONS`. */
function labelFor(field: string, value: string): string {
  const question = QUESTIONS.find((q) => q.field === field);
  return question ? choiceLabel(question, value) : value;
}

/** Arma las filas de "contexto que diste", omitiendo los campos vacíos. */
function contextRows(
  context: Partial<AnalysisContext>,
): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];

  const shifts = (context.shifts ?? []).filter((s) => s.start && s.end);
  if (shifts.length > 0) {
    rows.push({
      label: shifts.length > 1 ? 'Turnos' : 'Turno',
      value: shifts.map((s) => `${s.start}–${s.end}`).join(' · '),
    });
  }

  if (context.products?.trim()) {
    rows.push({ label: 'Productos', value: context.products.trim() });
  }

  if (typeof context.employees === 'number') {
    rows.push({ label: 'Empleados en planta', value: String(context.employees) });
  }

  const resources = (context.resources ?? []).filter((r) => r.name || r.use);
  if (resources.length > 0) {
    rows.push({
      label: 'Recursos materiales',
      value: resources
        .map((r) => (r.use ? `${r.name} (${r.use})` : r.name))
        .join(' · '),
    });
  }

  const processes = (context.processes ?? []).filter((p) => p.trim());
  if (processes.length > 0) {
    rows.push({ label: 'Procesos', value: processes.join(' · ') });
  }

  if (context.dataKind) {
    const value =
      context.dataKind === 'mixto'
        ? context.dataKindDetail?.trim() || 'Lo aclaro aparte'
        : labelFor('dataKind', context.dataKind);
    rows.push({ label: 'Tipo de datos', value });
  }

  if (context.dataKindNotes?.trim()) {
    rows.push({ label: 'Detalle de la planilla', value: context.dataKindNotes.trim() });
  }

  // Campos del modo Chat (si se usó ese modo).
  if (context.businessType) {
    rows.push({ label: 'Rubro', value: labelFor('businessType', context.businessType) });
  }
  if (context.objective) {
    rows.push({ label: 'Objetivo', value: labelFor('objective', context.objective) });
  }
  if (context.currency) {
    rows.push({ label: 'Moneda', value: labelFor('currency', context.currency) });
  }

  if (context.notes?.trim()) {
    rows.push({ label: 'Nota para la IA', value: context.notes.trim() });
  }

  return rows;
}
