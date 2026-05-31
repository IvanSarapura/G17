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
  file: File | null;
  onSelect: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * Zona de carga (drag & drop + clic) reutilizable. Antes vivía dentro del modal
 * `UploadDialog`; ahora es la base de la experiencia de carga del asistente.
 */
export function FileDropzone({
  file,
  onSelect,
  disabled,
  className,
}: FileDropzoneProps) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function selectFile(next: File | null) {
    if (!next) return;
    if (!isAcceptedFile(next.name)) {
      toast.error('Formato no soportado', {
        description: `Subí un archivo ${ACCEPTED_EXTENSIONS.join(', ')}`,
      });
      return;
    }
    onSelect(next);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    selectFile(e.dataTransfer.files[0] ?? null);
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
          {!disabled ? (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Quitar archivo"
              onClick={() => onSelect(null)}
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
