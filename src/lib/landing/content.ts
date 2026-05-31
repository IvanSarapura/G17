import {
  Brain,
  FileSpreadsheet,
  Lightbulb,
  TrendingUp,
  Upload,
  Wand,
  type LucideIcon,
} from 'lucide-react';

/**
 * Contenido de marketing simulado para la landing.
 * Datos de ejemplo (mock) — ajustar cuando haya copy/branding definitivos.
 */

export const PRODUCT = {
  name: 'lupia',
  tagline: 'Inteligencia de producción para PyMEs',
} as const;

export const HERO = {
  badge: 'Análisis con IA · sin instalar nada',
  title: 'Convertí tus planillas en',
  highlight: 'claridad para tu planta',
  subtitle:
    'Subí las planillas de tu producción —tal como las tenés— y dejá que la IA las ordene y te muestre dónde se traba el trabajo: cuellos de botella, retrabajos y faltas. Recibí mejoras priorizadas por impacto, en minutos.',
  primaryCta: 'Analizá tus planillas',
  secondaryCta: 'Cómo funciona',
  trust: [
    'Funciona con tus Excel tal cual',
    'Resultados en minutos',
    'Tus datos no se comparten',
  ],
} as const;

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: '5 min', label: 'hasta tu primer tablero' },
  { value: 'Cero', label: 'integraciones o migraciones' },
  { value: '+1.000', label: 'filas ordenadas por análisis' },
  { value: 'Privado', label: 'tus planillas no se comparten' },
];

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const FEATURES: Feature[] = [
  {
    icon: Upload,
    title: 'Cargá tus planillas',
    description:
      'Arrastrá tus Excel de producción tal cual los tenés. Sin integraciones ni migrar de sistema.',
  },
  {
    icon: Brain,
    title: 'La IA las ordena',
    description:
      'Unifica fechas, estados y horarios cargados de mil formas distintas, y cruza una planilla con otra.',
  },
  {
    icon: Lightbulb,
    title: 'Encontrá dónde se traba',
    description:
      'Detecta estaciones lentas, retrabajos y faltas que te comen tiempo, priorizados por impacto.',
  },
  {
    icon: TrendingUp,
    title: 'Seguí la mejora',
    description:
      'Mirá la evolución de tu eficiencia y tus tiempos en un tablero claro y accionable.',
  },
];

export type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const STEPS: Step[] = [
  {
    icon: FileSpreadsheet,
    title: 'Subí tus archivos',
    description:
      'Formatos .xlsx, .xls o .csv. Podés subir varias planillas juntas y se procesan de forma privada.',
  },
  {
    icon: Wand,
    title: 'La IA procesa los datos',
    description:
      'En segundos ordena tus columnas y cruza tu producción con la asistencia de la planta.',
  },
  {
    icon: TrendingUp,
    title: 'Aplicá las mejoras',
    description:
      'Obtené un tablero con las oportunidades de mayor impacto, listas para ejecutar.',
  },
];

export const TESTIMONIAL = {
  quote:
    'En la primera semana vimos que la estación de soldadura nos comía el doble de tiempo que el resto. Reordenamos los turnos ahí y las órdenes empezaron a salir a horario.',
  author: 'Jorge Medina',
  role: 'Jefe de planta',
  company: 'Metalúrgica del Litoral',
} as const;

export const FINAL_CTA = {
  title: 'Mirá tu producción con claridad',
  subtitle:
    'Explorá un análisis de ejemplo y mirá cómo se ven las oportunidades de mejora sobre datos reales de una planta.',
  cta: 'Analizá tus planillas',
} as const;
