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
  name: 'Optimia',
  tagline: 'Inteligencia operativa para PyMEs',
} as const;

export const HERO = {
  badge: 'Análisis con IA · sin instalar nada',
  title: 'Convertí tus Excel en',
  highlight: 'decisiones que ahorran plata',
  subtitle:
    'Subí tus planillas de ventas, costos o producción y dejá que la IA encuentre las fugas de eficiencia. Recibí oportunidades de mejora priorizadas por impacto, en minutos.',
  primaryCta: 'Analizá tu Excel',
  secondaryCta: 'Cómo funciona',
  trust: ['Sin tarjeta de crédito', 'Resultados en 5 minutos', 'Tus datos no se comparten'],
} as const;

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: '32%', label: 'reducción de costos detectada en promedio' },
  { value: '+1.200', label: 'planillas analizadas' },
  { value: '5 min', label: 'hasta tu primer análisis' },
  { value: '4,8/5', label: 'satisfacción de las PyMEs' },
];

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const FEATURES: Feature[] = [
  {
    icon: Upload,
    title: 'Cargá tu Excel',
    description:
      'Arrastrá tus planillas tal cual las tenés. Sin integraciones, sin migrar de sistema.',
  },
  {
    icon: Brain,
    title: 'La IA las analiza',
    description:
      'Detecta patrones, ineficiencias y fugas de costo que pasan desapercibidas a simple vista.',
  },
  {
    icon: Lightbulb,
    title: 'Recibí oportunidades',
    description:
      'Acciones concretas, priorizadas por impacto y con el ahorro mensual estimado de cada una.',
  },
  {
    icon: TrendingUp,
    title: 'Medí el impacto',
    description:
      'Seguí la evolución de tu eficiencia y tus costos en un dashboard claro y accionable.',
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
    title: 'Subí tu archivo',
    description:
      'Formatos .xlsx, .xls o .csv. Tu información se procesa de forma privada.',
  },
  {
    icon: Wand,
    title: 'La IA procesa los datos',
    description:
      'En segundos cruza tus métricas y compara contra patrones del sector.',
  },
  {
    icon: TrendingUp,
    title: 'Aplicá las mejoras',
    description:
      'Obtené un panel con las oportunidades de mayor impacto, listas para ejecutar.',
  },
];

export const TESTIMONIAL = {
  quote:
    'En la primera semana detectamos que estábamos comprando el mismo insumo a cuatro proveedores distintos. Consolidar nos ahorró más de lo que esperábamos del mes.',
  author: 'María Fernández',
  role: 'Dueña',
  company: 'Distribuidora del Sur',
} as const;

export const FINAL_CTA = {
  title: 'Descubrí cuánto podés ahorrar este mes',
  subtitle:
    'Explorá un análisis de ejemplo y mirá cómo se ven las oportunidades de mejora sobre datos reales de una PyME.',
  cta: 'Abrir el dashboard',
} as const;
