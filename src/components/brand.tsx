import Link from 'next/link';
import { Gauge } from 'lucide-react';

import { cn } from '@/lib/utils';
import { PRODUCT } from '@/lib/landing/content';

/**
 * Lockup de marca reutilizable (icono + nombre del producto).
 * Compartido por la landing (`SiteHeader`) y el navbar del dashboard.
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
        <Gauge className="size-5" />
      </span>
      <span className="text-base font-semibold tracking-tight">
        {PRODUCT.name}
      </span>
    </Link>
  );
}
