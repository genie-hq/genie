'use client';

import { useTheme } from 'next-themes';

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Check, Monitor, Moon, Sun } from 'lucide-react';

export function ThemeDropdownItems() {
  const { theme, systemTheme, setTheme } = useTheme();

  const isSystem = theme === 'system' || theme === null;

  const primaryTheme = theme?.split('-')?.[0] as
    | 'light'
    | 'dark'
    | 'system'
    | undefined;

  const secondaryTheme = theme?.split('-')?.[1] as
    | 'pink'
    | 'purple'
    | 'yellow'
    | 'orange'
    | 'green'
    | 'blue'
    | undefined;

  const updateTheme = ({
    primary = primaryTheme,
    secondary = secondaryTheme,
  }: {
    primary?: 'light' | 'dark' | 'system';
    secondary?:
      | 'pink'
      | 'purple'
      | 'yellow'
      | 'orange'
      | 'green'
      | 'blue'
      | null;
  }) => {
    let theme = '';

    if (primary) theme += primary === 'system' ? systemTheme : primary;
    if (secondary) theme += `-${secondary}`;

    // remove leading dash
    if (theme.startsWith('-')) theme = theme.slice(1);

    setTheme(theme);
  };

  return (
    <>
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => updateTheme({ primary: 'light' })}
        disabled={primaryTheme === 'light'}
      >
        {primaryTheme === 'light' ? (
          <Check className="mr-2 h-4 w-4" />
        ) : (
          <Sun className="mr-2 h-4 w-4" />
        )}
        Light
      </DropdownMenuItem>

      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => updateTheme({ primary: 'dark' })}
        disabled={primaryTheme === 'dark'}
      >
        {primaryTheme === 'dark' ? (
          <Check className="mr-2 h-4 w-4" />
        ) : (
          <Moon className="mr-2 h-4 w-4" />
        )}
        Dark
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => setTheme('system')}
        disabled={isSystem}
      >
        {isSystem ? (
          <Check className="mr-2 h-4 w-4" />
        ) : (
          <Monitor className="mr-2 h-4 w-4" />
        )}
        System
      </DropdownMenuItem>
    </>
  );
}
