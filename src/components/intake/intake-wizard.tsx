'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ListChecks, MessagesSquare } from 'lucide-react';
import { toast } from 'sonner';

import { Brand } from '@/components/brand';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { analyzeFile } from '@/lib/dashboard/api';
import { saveAnalysis } from '@/lib/dashboard/session';
import type { AnalysisContext } from '@/lib/dashboard/types';
import { ChatFlow } from './chat-flow';
import { GuidedForm } from './guided-form';
import { IntakeProcessing } from './intake-processing';

type Mode = 'guided' | 'chat';

const MODES: { value: Mode; label: string; icon: typeof ListChecks }[] = [
  { value: 'guided', label: 'Guiado', icon: ListChecks },
  { value: 'chat', label: 'Chat', icon: MessagesSquare },
];

export function IntakeWizard() {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>('guided');
  const [file, setFile] = React.useState<File | null>(null);
  const [answers, setAnswers] = React.useState<Partial<AnalysisContext>>({});

  const mutation = useMutation({
    mutationFn: () => analyzeFile(file!, answers as AnalysisContext),
    onSuccess: (result) => {
      saveAnalysis(result);
      toast.success('Análisis completado', {
        description: `${result.meta.rows.toLocaleString('es-AR')} filas procesadas`,
      });
      router.push('/dashboard');
    },
    onError: () => {
      toast.error('No se pudo analizar el archivo', {
        description: 'Verificá el formato e intentá nuevamente.',
      });
    },
  });

  const isSubmitting = mutation.isPending || mutation.isSuccess;

  function onAnswer(field: keyof AnalysisContext, value: string) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }

  function onPatch(patch: Partial<AnalysisContext>) {
    setAnswers((prev) => ({ ...prev, ...patch }));
  }

  function onSubmit() {
    if (!file) {
      toast.error('Falta el archivo', {
        description: 'Subí tu Excel o CSV para continuar.',
      });
      return;
    }
    mutation.mutate();
  }

  const baseProps = {
    file,
    answers,
    onFileChange: setFile,
    onSubmit,
    disabled: isSubmitting,
  };

  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Brand />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-6 flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Armemos tu tablero
          </h1>
          <p className="text-sm text-muted-foreground">
            Subí tu planilla y respondé unas preguntas simples. La IA se encarga
            del resto.
          </p>
        </div>

        <Card>
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-1.5">
              <CardTitle>Asistente de análisis</CardTitle>
              <CardDescription>
                Elegí cómo preferís responder.
              </CardDescription>
            </div>
            {!isSubmitting ? (
              <div
                role="tablist"
                aria-label="Modo de interacción"
                className="inline-flex w-fit gap-1 rounded-lg bg-muted p-1"
              >
                {MODES.map((m) => {
                  const active = mode === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setMode(m.value)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <m.icon className="size-4" />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </CardHeader>

          <CardContent>
            {isSubmitting ? (
              <IntakeProcessing fileName={file?.name ?? 'tu planilla'} />
            ) : mode === 'guided' ? (
              <GuidedForm {...baseProps} onPatch={onPatch} />
            ) : (
              <ChatFlow {...baseProps} onAnswer={onAnswer} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
