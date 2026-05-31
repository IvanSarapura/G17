'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight, PencilLine, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { AnalysisContext, DataKind } from '@/lib/dashboard/types';
import { NOTES_STEP, QUESTIONS } from '@/lib/intake/questions';
import { FileDropzone } from './file-dropzone';
import { IntakeProgress } from './intake-progress';
import { OptionCard } from './option-card';
import { ContextStep } from './steps/context-step';
import { ShiftsStep } from './steps/shifts-step';

type GuidedFormProps = {
  files: File[];
  answers: Partial<AnalysisContext>;
  onFilesChange: (files: File[]) => void;
  onPatch: (patch: Partial<AnalysisContext>) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

// Pasos del flujo de producción: subir · turnos · contexto · tipo de datos · nota.
const STEP_UPLOAD = 0;
const STEP_SHIFTS = 1;
const STEP_CONTEXT = 2;
const STEP_DATAKIND = 3;
const STEP_NOTES = 4;
const TOTAL_STEPS = 5;

const STEP_LABELS = [
  'Subí tus planillas',
  'Turnos de producción',
  'Contame sobre tu planta',
  '¿Qué contienen tus planillas?',
  NOTES_STEP.title,
];

// La pregunta de tipo de datos se reutiliza del catálogo compartido con el chat.
const dataKindQuestion = QUESTIONS.find((q) => q.id === 'dataKind')!;

export function GuidedForm({
  files,
  answers,
  onFilesChange,
  onPatch,
  onSubmit,
  disabled,
}: GuidedFormProps) {
  const [step, setStep] = React.useState(STEP_UPLOAD);

  const shifts = answers.shifts ?? [];
  const shiftsValid = shifts.length > 0 && shifts.every((s) => s.start && s.end);

  const canAdvance =
    step === STEP_UPLOAD
      ? files.length > 0
      : step === STEP_SHIFTS
        ? shiftsValid
        : step === STEP_CONTEXT
          ? Boolean(answers.products?.trim())
          : step === STEP_DATAKIND
            ? Boolean(answers.dataKind) &&
              // Si eligió "Prefiero aclarar", pedimos la aclaración para avanzar.
              (answers.dataKind !== 'mixto' ||
                Boolean(answers.dataKindDetail?.trim()))
            : true; // la nota es opcional

  const isLastStep = step === STEP_NOTES;

  function next() {
    if (isLastStep) {
      onSubmit();
      return;
    }
    setStep((s) => Math.min(s + 1, STEP_NOTES));
  }

  return (
    <div className="flex flex-col gap-6">
      <IntakeProgress current={step} total={TOTAL_STEPS} label={STEP_LABELS[step]} />

      <div className="min-h-[280px]">
        {step === STEP_UPLOAD ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Subí tus Excel o CSV (producción, asistencia, lo que tengas). No
              importa cómo los tengas armados: la IA los interpreta.
            </p>
            <FileDropzone
              files={files}
              onSelect={onFilesChange}
              disabled={disabled}
            />
          </div>
        ) : null}

        {step === STEP_SHIFTS ? (
          <ShiftsStep
            shifts={answers.shifts}
            onChange={(s) => onPatch({ shifts: s })}
            disabled={disabled}
          />
        ) : null}

        {step === STEP_CONTEXT ? (
          <ContextStep answers={answers} onPatch={onPatch} disabled={disabled} />
        ) : null}

        {step === STEP_DATAKIND ? (
          <div className="flex flex-col gap-4">
            {dataKindQuestion.subtitle ? (
              <p className="text-sm text-muted-foreground">
                {dataKindQuestion.subtitle}
              </p>
            ) : null}
            <div
              role="radiogroup"
              aria-label={dataKindQuestion.title}
              className="grid gap-3 sm:grid-cols-2"
            >
              {dataKindQuestion.choices.map((choice) => (
                <OptionCard
                  key={choice.value}
                  icon={choice.icon}
                  label={choice.label}
                  description={choice.description}
                  selected={answers.dataKind === choice.value}
                  onSelect={() => onPatch({ dataKind: choice.value as DataKind })}
                />
              ))}
            </div>

            {answers.dataKind === 'mixto' ? (
              <div className="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
                <Label htmlFor="dataKindDetail" className="text-primary">
                  <PencilLine className="size-4" />
                  Contanos qué contienen tus planillas
                </Label>
                <Input
                  id="dataKindDetail"
                  value={answers.dataKindDetail ?? ''}
                  onChange={(e) => onPatch({ dataKindDetail: e.target.value })}
                  placeholder="Ej.: avance de producción y asistencia, en planillas separadas"
                  maxLength={200}
                  disabled={disabled}
                  className="bg-background"
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dataKindNotes">
                ¿Algo más sobre tus planillas? (opcional)
              </Label>
              <Textarea
                id="dataKindNotes"
                value={answers.dataKindNotes ?? ''}
                onChange={(e) => onPatch({ dataKindNotes: e.target.value })}
                placeholder="Ej.: la columna 'monto' incluye IVA; los meses están en filas"
                rows={3}
                maxLength={500}
                disabled={disabled}
              />
            </div>
          </div>
        ) : null}

        {step === STEP_NOTES ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">{NOTES_STEP.subtitle}</p>
            <Textarea
              value={answers.notes ?? ''}
              onChange={(e) => onPatch({ notes: e.target.value })}
              placeholder={NOTES_STEP.placeholder}
              rows={4}
              maxLength={500}
              disabled={disabled}
            />
            <div className="flex flex-wrap gap-2">
              {NOTES_STEP.examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => onPatch({ notes: example })}
                  disabled={disabled}
                  className="rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-4">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(s - 1, STEP_UPLOAD))}
          disabled={step === STEP_UPLOAD || disabled}
        >
          <ArrowLeft className="size-4" />
          Atrás
        </Button>

        <Button onClick={next} disabled={!canAdvance || disabled}>
          {isLastStep ? (
            <>
              <Sparkles className="size-4" />
              Analizar con IA
            </>
          ) : (
            <>
              Siguiente
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
