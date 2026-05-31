import {
  Banknote,
  Boxes,
  CircleHelp,
  DollarSign,
  Factory,
  Gauge,
  Package,
  PencilLine,
  ShoppingCart,
  Store,
  TrendingUp,
  Truck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import type { AnalysisContext } from '@/lib/dashboard/types';

/** Una opción seleccionable (tarjeta en modo guiado, chip en modo chat). */
export type Choice = {
  value: string;
  label: string;
  description?: string;
  icon: LucideIcon;
};

/**
 * Pregunta de opción única. Es la unidad que comparten el modo guiado y el modo
 * chat: las preguntas son datos, no JSX, así un solo lugar define el contenido
 * "a prueba de Juan Carlos" y ambos modos lo renderizan distinto.
 */
/** Campos de selección única (un enum de string) que usan las preguntas. */
export type ChoiceField = Extract<
  keyof AnalysisContext,
  'businessType' | 'objective' | 'dataKind' | 'currency'
>;

export type Question = {
  id: string;
  /** Campo de `AnalysisContext` que completa esta pregunta. */
  field: ChoiceField;
  /** Encabezado en modo guiado. */
  title: string;
  /** Cómo lo "dice" la IA en modo chat. */
  prompt: string;
  subtitle?: string;
  choices: Choice[];
};

export const QUESTIONS: Question[] = [
  {
    id: 'businessType',
    field: 'businessType',
    title: '¿A qué se dedica tu negocio?',
    prompt: 'Para arrancar, contame: ¿a qué se dedica tu negocio?',
    subtitle: 'Elegí la opción que más se parezca.',
    choices: [
      { value: 'comercio', label: 'Comercio', description: 'Vendo productos al público', icon: Store },
      { value: 'produccion', label: 'Producción', description: 'Fabrico o elaboro productos', icon: Factory },
      { value: 'servicios', label: 'Servicios', description: 'Ofrezco servicios o trabajos', icon: Wrench },
      { value: 'distribucion', label: 'Distribución', description: 'Reparto o mayorista', icon: Truck },
      { value: 'otro', label: 'Otro', description: 'Ninguna de las anteriores', icon: CircleHelp },
    ],
  },
  {
    id: 'objective',
    field: 'objective',
    title: '¿Qué te gustaría mejorar?',
    prompt: '¿Qué te gustaría mejorar con este análisis?',
    subtitle: 'La IA va a enfocar el tablero en esto.',
    choices: [
      { value: 'reducir_costos', label: 'Reducir costos', description: 'Gastar menos sin perder calidad', icon: Banknote },
      { value: 'aumentar_ventas', label: 'Aumentar ventas', description: 'Vender más y mejor', icon: TrendingUp },
      { value: 'mejorar_eficiencia', label: 'Mejorar eficiencia', description: 'Producir más con lo mismo', icon: Gauge },
      { value: 'controlar_stock', label: 'Controlar stock', description: 'Ni faltantes ni sobrantes', icon: Boxes },
    ],
  },
  {
    id: 'dataKind',
    field: 'dataKind',
    title: '¿Qué contiene tu planilla?',
    prompt: '¿Qué datos tiene la planilla que subiste?',
    subtitle: 'Así sabemos cómo leer tus columnas.',
    choices: [
      { value: 'ventas', label: 'Ventas', description: 'Facturación, pedidos', icon: ShoppingCart },
      { value: 'costos', label: 'Costos', description: 'Gastos, compras', icon: DollarSign },
      { value: 'produccion', label: 'Producción', description: 'Unidades, tiempos', icon: Factory },
      { value: 'inventario', label: 'Inventario', description: 'Stock, depósito', icon: Package },
      { value: 'mixto', label: 'Prefiero aclarar', description: 'Te lo cuento en una línea', icon: PencilLine },
    ],
  },
  {
    id: 'currency',
    field: 'currency',
    title: '¿En qué moneda están los montos?',
    prompt: 'Última cosa: ¿en qué moneda están los montos?',
    choices: [
      { value: 'ARS', label: 'Pesos (ARS)', icon: Banknote },
      { value: 'USD', label: 'Dólares (USD)', icon: DollarSign },
      { value: 'otra', label: 'Otra', icon: CircleHelp },
    ],
  },
];

/** Copy del paso de texto libre (la "opción a chat" liviana, siempre opcional). */
export const NOTES_STEP = {
  title: '¿Algo puntual que quieras que la IA mire?',
  prompt:
    '¿Hay algo puntual que quieras que mire? Podés contármelo en tus palabras (o saltearlo).',
  subtitle: 'Opcional. Por ejemplo: "fijate por qué subió el costo en marzo".',
  placeholder: 'Escribí acá lo que quieras… (opcional)',
  examples: [
    '¿Dónde se traba la producción?',
    '¿Qué estación es el cuello de botella?',
    '¿Quién falta más seguido?',
  ],
} as const;

/** Devuelve la etiqueta legible de un valor elegido (para los globos del chat). */
export function choiceLabel(question: Question, value: string): string {
  return question.choices.find((c) => c.value === value)?.label ?? value;
}
