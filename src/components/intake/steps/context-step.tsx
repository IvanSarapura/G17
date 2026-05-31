'use client';

import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { AnalysisContext, MaterialResource } from '@/lib/dashboard/types';

type ContextStepProps = {
  answers: Partial<AnalysisContext>;
  onPatch: (patch: Partial<AnalysisContext>) => void;
  disabled?: boolean;
};

const EMPTY_RESOURCE: MaterialResource = { name: '', use: '' };

/**
 * Paso "Contame sobre tu planta": captura el contexto de producción que la IA
 * usa para orientar los KPIs (productos, dotación, recursos y procesos).
 */
export function ContextStep({ answers, onPatch, disabled }: ContextStepProps) {
  const resources =
    answers.resources && answers.resources.length > 0
      ? answers.resources
      : [EMPTY_RESOURCE];

  const processes =
    answers.processes && answers.processes.length > 0 ? answers.processes : [''];

  function setEmployees(value: string) {
    const n = value === '' ? undefined : Number(value);
    onPatch({ employees: n !== undefined && Number.isFinite(n) ? n : undefined });
  }

  function updateResource(index: number, patch: Partial<MaterialResource>) {
    onPatch({
      resources: resources.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    });
  }

  function addResource() {
    onPatch({ resources: [...resources, { ...EMPTY_RESOURCE }] });
  }

  function removeResource(index: number) {
    onPatch({ resources: resources.filter((_, i) => i !== index) });
  }

  function updateProcess(index: number, value: string) {
    onPatch({ processes: processes.map((p, i) => (i === index ? value : p)) });
  }

  function addProcess() {
    onPatch({ processes: [...processes, ''] });
  }

  function removeProcess(index: number) {
    onPatch({ processes: processes.filter((_, i) => i !== index) });
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        Contame un poco de tu planta para que la IA entienda mejor tus números.
      </p>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="products">¿Qué productos fabricás?</Label>
        <Textarea
          id="products"
          value={answers.products ?? ''}
          onChange={(e) => onPatch({ products: e.target.value })}
          placeholder="Ej.: puertas y portones metálicos a medida"
          rows={2}
          maxLength={300}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="employees">¿Cuántos empleados hay en planta?</Label>
        <Input
          id="employees"
          type="number"
          min={0}
          inputMode="numeric"
          value={answers.employees ?? ''}
          onChange={(e) => setEmployees(e.target.value)}
          placeholder="Ej.: 7"
          disabled={disabled}
          className="sm:max-w-40"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">¿Qué recursos materiales usás?</span>
          <span className="text-xs text-muted-foreground">
            Opcional. Materias primas, insumos o máquinas, y para qué los usás.
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="flex items-end gap-3 rounded-lg border p-3"
            >
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor={`resource-${index}-name`}>Nombre</Label>
                <Input
                  id={`resource-${index}-name`}
                  value={resource.name}
                  onChange={(e) => updateResource(index, { name: e.target.value })}
                  placeholder="Ej.: Chapa"
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor={`resource-${index}-use`}>Uso</Label>
                <Input
                  id={`resource-${index}-use`}
                  value={resource.use}
                  onChange={(e) => updateResource(index, { use: e.target.value })}
                  placeholder="Ej.: Hojas y marcos"
                  disabled={disabled}
                />
              </div>
              {resources.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeResource(index)}
                  disabled={disabled}
                  aria-label={`Eliminar recurso ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              ) : null}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addResource}
            disabled={disabled}
            className="self-start"
          >
            <Plus className="size-4" />
            Agregar recurso
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">
            ¿Qué procesos de producción tenés?
          </span>
          <span className="text-xs text-muted-foreground">
            Opcional. Las etapas por las que pasa tu producción.
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {processes.map((process, index) => (
            <div key={index} className="flex items-center gap-3">
              <Label htmlFor={`process-${index}`} className="sr-only">
                Proceso {index + 1}
              </Label>
              <Input
                id={`process-${index}`}
                value={process}
                onChange={(e) => updateProcess(index, e.target.value)}
                placeholder="Ej.: Corte, Plegado, Soldado, Lijado, Armado final"
                disabled={disabled}
              />
              {processes.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProcess(index)}
                  disabled={disabled}
                  aria-label={`Eliminar proceso ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              ) : null}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addProcess}
            disabled={disabled}
            className="self-start"
          >
            <Plus className="size-4" />
            Agregar proceso
          </Button>
        </div>
      </div>
    </div>
  );
}
