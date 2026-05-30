'use client';

import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileSpreadsheet, Loader2, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  ACCEPT_ATTR,
  ACCEPTED_EXTENSIONS,
  analyzeFile,
  isAcceptedFile,
} from '@/lib/dashboard/api';
import type { AnalysisResult } from '@/lib/dashboard/types';

type UploadDialogProps = {
  onAnalyzed: (result: AnalysisResult) => void;
  trigger?: React.ReactNode;
};

export function UploadDialog({ onAnalyzed, trigger }: UploadDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (f: File) => analyzeFile(f),
    onSuccess: (result) => {
      onAnalyzed(result);
      toast.success('Análisis completado', {
        description: `${result.meta.rows.toLocaleString('es-AR')} filas procesadas`,
      });
      setOpen(false);
      setFile(null);
    },
    onError: () => {
      toast.error('No se pudo analizar el archivo', {
        description: 'Verificá el formato e intentá nuevamente.',
      });
    },
  });

  function selectFile(next: File | null) {
    if (!next) return;
    if (!isAcceptedFile(next.name)) {
      toast.error('Formato no soportado', {
        description: `Subí un archivo ${ACCEPTED_EXTENSIONS.join(', ')}`,
      });
      return;
    }
    setFile(next);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    selectFile(e.dataTransfer.files[0] ?? null);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !mutation.isPending && setOpen(o)}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <UploadCloud className="size-4" />
            Subir Excel
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir archivo para análisis</DialogTitle>
          <DialogDescription>
            La IA analizará tus datos y detectará oportunidades de mejora
            operativa. Formatos: {ACCEPTED_EXTENSIONS.join(', ')}.
          </DialogDescription>
        </DialogHeader>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          disabled={mutation.isPending}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors',
            dragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-accent/50',
            mutation.isPending && 'pointer-events-none opacity-60',
          )}
        >
          <UploadCloud className="size-8 text-muted-foreground" />
          <span className="text-sm font-medium">
            Arrastrá tu archivo aquí o hacé clic para elegirlo
          </span>
          <span className="text-xs text-muted-foreground">
            Excel o CSV, hasta ~10&nbsp;MB
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_ATTR}
            className="hidden"
            onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
          />
        </button>

        {file ? (
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2">
            <FileSpreadsheet className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="flex-1 truncate text-sm">{file.name}</span>
            {!mutation.isPending ? (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Quitar archivo"
                onClick={() => setFile(null)}
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>
        ) : null}

        <Button
          className="w-full"
          disabled={!file || mutation.isPending}
          onClick={() => file && mutation.mutate(file)}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analizando…
            </>
          ) : (
            'Analizar con IA'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
