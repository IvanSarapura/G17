'use client';

import * as React from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { AnalysisContext } from '@/lib/dashboard/types';
import {
  NOTES_STEP,
  QUESTIONS,
  choiceLabel,
} from '@/lib/intake/questions';
import { FileDropzone } from './file-dropzone';

type ChatFlowProps = {
  file: File | null;
  answers: Partial<AnalysisContext>;
  onFileChange: (file: File | null) => void;
  onAnswer: (field: keyof AnalysisContext, value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

// Etapas: 0 = subir · 1..N = preguntas · N+1 = nota · N+2 = listo para analizar.
const STAGE_UPLOAD = 0;
const STAGE_NOTES = QUESTIONS.length + 1;
const STAGE_READY = QUESTIONS.length + 2;

function Bubble({
  from,
  children,
}: {
  from: 'ai' | 'user';
  children: React.ReactNode;
}) {
  const isAi = from === 'ai';
  return (
    <div className={cn('flex gap-2.5', isAi ? 'justify-start' : 'justify-end')}>
      {isAi ? (
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="size-4" />
        </span>
      ) : null}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm',
          isAi
            ? 'rounded-tl-sm bg-muted text-foreground'
            : 'rounded-tr-sm bg-primary text-primary-foreground',
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ChatFlow({
  file,
  answers,
  onFileChange,
  onAnswer,
  onSubmit,
  disabled,
}: ChatFlowProps) {
  const [stage, setStage] = React.useState(STAGE_UPLOAD);
  const [notesDraft, setNotesDraft] = React.useState('');
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [stage]);

  function handleFile(next: File | null) {
    onFileChange(next);
    if (next) setStage((s) => Math.max(s, STAGE_UPLOAD + 1));
  }

  function handleChoice(field: keyof AnalysisContext, value: string) {
    onAnswer(field, value);
    setStage((s) => s + 1);
  }

  function submitNotes(value: string) {
    if (value.trim()) onAnswer('notes', value.trim());
    setStage(STAGE_READY);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-h-[52vh] min-h-[320px] flex-col gap-4 overflow-y-auto pr-1">
        <Bubble from="ai">
          ¡Hola! Soy tu asistente. Te hago unas preguntas cortas y armo tu
          tablero. Para empezar, subí tu planilla. 👇
        </Bubble>

        {/* Subida del archivo */}
        {stage === STAGE_UPLOAD ? (
          <FileDropzone file={file} onSelect={handleFile} disabled={disabled} />
        ) : file ? (
          <Bubble from="user">📄 {file.name}</Bubble>
        ) : null}

        {/* Preguntas guiadas, una a una */}
        {QUESTIONS.map((question, i) => {
          const questionStage = i + 1;
          if (stage < questionStage) return null;
          const answered = answers[question.field];

          return (
            <React.Fragment key={question.id}>
              <Bubble from="ai">{question.prompt}</Bubble>

              {answered ? (
                <Bubble from="user">{choiceLabel(question, answered)}</Bubble>
              ) : stage === questionStage ? (
                <div className="flex flex-wrap gap-2">
                  {question.choices.map((choice) => (
                    <button
                      key={choice.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleChoice(question.field, choice.value)}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-sm transition-colors hover:border-primary/60 hover:bg-accent"
                    >
                      <choice.icon className="size-3.5 text-muted-foreground" />
                      {choice.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </React.Fragment>
          );
        })}

        {/* Nota libre opcional */}
        {stage >= STAGE_NOTES ? (
          <>
            <Bubble from="ai">{NOTES_STEP.prompt}</Bubble>
            {answers.notes ? <Bubble from="user">{answers.notes}</Bubble> : null}
            {stage === STAGE_NOTES ? (
              <div className="flex flex-col gap-2">
                <Textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder={NOTES_STEP.placeholder}
                  rows={3}
                  maxLength={500}
                  disabled={disabled}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => submitNotes('')}
                    disabled={disabled}
                  >
                    Saltar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => submitNotes(notesDraft)}
                    disabled={disabled}
                  >
                    <Send className="size-4" />
                    Enviar
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        {/* Listo para analizar */}
        {stage >= STAGE_READY ? (
          <>
            <Bubble from="ai">
              ¡Genial! Ya tengo todo lo que necesito. Cuando quieras, genero tu
              tablero. 🚀
            </Bubble>
            <div className="flex justify-start">
              <Button onClick={onSubmit} disabled={disabled}>
                <Sparkles className="size-4" />
                Analizar con IA
              </Button>
            </div>
          </>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
