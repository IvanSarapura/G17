import type { Metadata } from 'next';

import { IntakeWizard } from '@/components/intake/intake-wizard';

export const metadata: Metadata = {
  title: 'Analizá tu Excel — Optimia',
  description:
    'Subí tu planilla y respondé unas preguntas simples para que la IA arme tu tablero de KPIs.',
};

export default function AnalizarPage() {
  return <IntakeWizard />;
}
