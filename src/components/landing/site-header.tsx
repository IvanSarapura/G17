import Link from 'next/link';
import { Gauge } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { PRODUCT } from '@/lib/landing/content';

const NAV_LINKS = [
  { href: '#features', label: 'Características' },
  { href: '#how', label: 'Cómo funciona' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Gauge className="size-5" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            {PRODUCT.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/dashboard">Ver demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
