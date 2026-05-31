import type { Metadata } from 'next';

import { IntakeWizard } from '@/components/intake/intake-wizard';

export const metadata: Metadata = {
  title: 'Analizá tus planillas — lupia',
  description:
    'Subí tus planillas y respondé unas preguntas simples para que la IA arme tu tablero de producción.',
};

export default function AnalizarPage() {
  return <IntakeWizard />;
}
