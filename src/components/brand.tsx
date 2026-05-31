import Link from 'next/link';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { PRODUCT } from '@/lib/landing/content';

/**
 * Lockup de marca reutilizable: lupa (icono) a la izquierda + el nombre "lupia"
 * a la derecha. Compartido por la landing (`SiteHeader`) y el navbar del dashboard.
 */
export function Brand({
  href = '/',
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn('flex items-center gap-2', className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Search className="size-5" strokeWidth={2.5} />
      </span>
      <span className="text-base font-semibold lowercase tracking-tight">
        {PRODUCT.name}
      </span>
    </Link>
  );
}
