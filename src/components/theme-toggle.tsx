'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

/**
 * `true` solo después de montar en el cliente. Usa `useSyncExternalStore` —en
 * vez de un `useEffect` con `setState`— para distinguir servidor de cliente sin
 * provocar hydration mismatch ni renders en cascada.
 */
function useMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === 'dark';

  // Hasta montar, el tema real es desconocido: usamos una etiqueta estable para
  // que el HTML del servidor coincida con el primer render del cliente.
  const label = !mounted
    ? 'Cambiar tema'
    : isDark
      ? 'Activar modo claro'
      : 'Activar modo oscuro';

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
