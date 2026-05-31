'use client';

import * as React from 'react';
import { FileSpreadsheet, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ACCEPT_ATTR,
  ACCEPTED_EXTENSIONS,
  isAcceptedFile,
} from '@/lib/dashboard/api';

type FileDropzoneProps = {
  files: File[];
  onSelect: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * Zona de carga (drag & drop + clic) reutilizable. Acepta varias planillas
 * (p.ej. producción + asistencia): valida cada archivo, descarta los de formato
 * no soportado y evita duplicados.
 */
export function FileDropzone({
  files,
  onSelect,
  disabled,
  className,
}: FileDropzoneProps) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function addFiles(incoming: File[]) {
    if (incoming.length === 0) return;

    const accepted = incoming.filter((f) => isAcceptedFile(f.name));
    const rejected = incoming.filter((f) => !isAcceptedFile(f.name));

    if (rejected.length > 0) {
      toast.error('Formato no soportado', {
        description: `Solo aceptamos ${ACCEPTED_EXTENSIONS.join(', ')}. Se omitió ${rejected
          .map((f) => f.name)
          .join(', ')}.`,
      });
    }

    // Evitar duplicados por nombre + tamaño.
    const key = (f: File) => `${f.name}:${f.size}`;
    const seen = new Set(files.map(key));
    const fresh = accepted.filter((f) => !seen.has(key(f)));
    if (fresh.length > 0) onSelect([...files, ...fresh]);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    addFiles(Array.from(e.dataTransfer.files));
  }

  function removeFile(index: number) {
    onSelect(files.filter((_, i) => i !== index));
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        disabled={disabled}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-accent/50',
          disabled && 'pointer-events-none opacity-60',
        )}
      >
        <UploadCloud className="size-8 text-muted-foreground" />
        <span className="text-sm font-medium">
          Arrastrá tus planillas aquí o hacé clic para elegirlas
        </span>
        <span className="text-xs text-muted-foreground">
          Excel o CSV · podés subir varias (hasta ~10&nbsp;MB c/u)
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = '';
          }}
        />
      </button>

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}:${file.size}`}
              className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2"
            >
              <FileSpreadsheet className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="flex-1 truncate text-sm">{file.name}</span>
              {!disabled ? (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Quitar ${file.name}`}
                  onClick={() => removeFile(index)}
                >
                  <X className="size-4" />
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
