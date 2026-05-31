'use client';

import Link from 'next/link';
import { Home, LogOut, Settings, UploadCloud } from 'lucide-react';

import { Brand } from '@/components/brand';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/** Cuenta de demostración (mock). */
const ACCOUNT = {
  name: 'Jorge Medina',
  company: 'Jefe de planta',
  initials: 'JM',
} as const;

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Brand />
          <nav className="hidden items-center gap-1 md:flex">
            <span
              aria-current="page"
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
            >
              Resumen
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/analizar">
              <UploadCloud className="size-4" />
              <span className="hidden sm:inline">Subir planillas</span>
            </Link>
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Menú de cuenta"
          className="rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar>
            <AvatarFallback className="bg-primary/10 font-medium text-primary">
              {ACCOUNT.initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{ACCOUNT.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {ACCOUNT.company}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">
            <Home />
            Volver al inicio
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings />
          Configuración
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" asChild>
          <Link href="/">
            <LogOut />
            Cerrar sesión
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
