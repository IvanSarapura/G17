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
import { InterpretationPreview } from './interpretation-preview';

type Mode = 'guided' | 'chat';

const MODES: { value: Mode; label: string; icon: typeof ListChecks }[] = [
  { value: 'guided', label: 'Guiado', icon: ListChecks },
  { value: 'chat', label: 'Chat', icon: MessagesSquare },
];

export function IntakeWizard() {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>('guided');
  const [files, setFiles] = React.useState<File[]>([]);
  const [answers, setAnswers] = React.useState<Partial<AnalysisContext>>({});

  const mutation = useMutation({
    mutationFn: () => analyzeFile(files, answers as AnalysisContext),
    onSuccess: (result) => {
      // Guardamos el análisis ya, pero no navegamos: primero el usuario revisa y
      // confirma la interpretación en la pantalla de previsualización.
      saveAnalysis(result);
    },
    onError: () => {
      toast.error('No se pudieron analizar las planillas', {
        description: 'Verificá el formato e intentá nuevamente.',
      });
    },
  });

  // Fases del asistente: completar el formulario → procesar → confirmar lo
  // interpretado → (al confirmar) ir al tablero.
  const phase = mutation.isPending
    ? 'processing'
    : mutation.isSuccess
      ? 'preview'
      : 'form';

  function onAnswer(field: keyof AnalysisContext, value: string) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }

  function onPatch(patch: Partial<AnalysisContext>) {
    setAnswers((prev) => ({ ...prev, ...patch }));
  }

  function onSubmit() {
    if (files.length === 0) {
      toast.error('Faltan las planillas', {
        description: 'Subí al menos un Excel o CSV para continuar.',
      });
      return;
    }
    mutation.mutate();
  }

  const baseProps = {
    files,
    answers,
    onFilesChange: setFiles,
    onSubmit,
    disabled: phase !== 'form',
  };

  const heading =
    phase === 'preview'
      ? {
          title: 'Revisá lo que entendí',
          subtitle: 'Confirmá que todo esté bien antes de ver tu tablero.',
        }
      : {
          title: 'Armemos tu tablero',
          subtitle:
            'Subí tus planillas y respondé unas preguntas simples. La IA se encarga del resto.',
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
            {heading.title}
          </h1>
          <p className="text-sm text-muted-foreground">{heading.subtitle}</p>
        </div>

        {phase === 'preview' && mutation.data ? (
          <InterpretationPreview
            result={mutation.data}
            context={answers}
            onConfirm={() => router.push('/dashboard')}
            onBack={() => mutation.reset()}
          />
        ) : (
          <Card>
            <CardHeader className="gap-4">
              <div className="flex flex-col gap-1.5">
                <CardTitle>Asistente de análisis</CardTitle>
                <CardDescription>
                  Elegí cómo preferís responder.
                </CardDescription>
              </div>
              {phase === 'form' ? (
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
              {phase === 'processing' ? (
                <IntakeProcessing
                  summary={
                    files.length === 1
                      ? files[0].name
                      : `${files.length} planillas`
                  }
                />
              ) : mode === 'guided' ? (
                <GuidedForm {...baseProps} onPatch={onPatch} />
              ) : (
                <ChatFlow {...baseProps} onAnswer={onAnswer} />
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
