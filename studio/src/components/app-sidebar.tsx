'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, ListChecks, PanelLeftClose, PanelLeftOpen, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Item {
  href: string;
  label: string;
  icon: typeof ListChecks;
  /** Routes that belong to this item even though the path is different. */
  owns: (path: string) => boolean;
}

const KEY = 'neetcode-studio:sidebar';

const ITEMS: Item[] = [
  {
    href: '/',
    label: 'Problems',
    icon: ListChecks,
    owns: (path) => path === '/' || path.startsWith('/c/'),
  },
  {
    href: '/courses',
    label: 'Courses',
    icon: GraduationCap,
    owns: (path) => path.startsWith('/courses'),
  },
];

export function AppSidebar() {
  const path = usePathname();
  const [wide, setWide] = useState(true);

  /** The board is a workspace, not a page: it keeps its own header and every pixel it has. */
  const inside = path.startsWith('/c/');

  useEffect(() => {
    setWide(window.localStorage.getItem(KEY) !== 'narrow');
  }, []);

  const handleToggle = () => {
    window.localStorage.setItem(KEY, wide ? 'narrow' : 'wide');
    setWide(!wide);
  };

  const renderItem = (item: Item) => {
    const active = item.owns(path);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? 'page' : undefined}
        title={wide ? undefined : item.label}
        className={cn(
          'relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] transition-colors',
          active ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground',
        )}
      >
        {active && <span aria-hidden className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-primary" />}
        <Icon className={cn('size-4 shrink-0', active && 'text-primary')} />
        {wide && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  if (inside) return null;

  return (
    <nav
      aria-label="Sections"
      className={cn(
        'flex shrink-0 flex-col gap-1 border-r border-line bg-sidebar/70 p-2 transition-[width] duration-200',
        wide ? 'w-52' : 'w-14',
      )}
    >
      <div className="flex items-center gap-2 px-1 py-2">
        <span className="relative flex size-8 shrink-0 -skew-x-6 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">
          P
          <span className="absolute -right-0.5 -bottom-0.5 size-1.5 rounded-full bg-hot" />
        </span>

        {wide && (
          <span className="truncate font-heading text-sm font-semibold tracking-[0.14em] text-primary uppercase">
            Problems
          </span>
        )}

        <button
          type="button"
          onClick={handleToggle}
          aria-label={wide ? 'Collapse the menu' : 'Expand the menu'}
          title={wide ? 'Collapse the menu' : 'Expand the menu'}
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground',
            wide && 'ml-auto',
          )}
        >
          {wide ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
        </button>
      </div>

      <div className="flex flex-col gap-1">{ITEMS.map(renderItem)}</div>

      <Link
        href="/settings"
        aria-current={path === '/settings' ? 'page' : undefined}
        title={wide ? undefined : 'Settings'}
        className={cn(
          'mt-auto flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] transition-colors',
          path === '/settings'
            ? 'bg-primary/10 text-foreground'
            : 'text-muted-foreground hover:bg-white/[0.04] hover:text-foreground',
        )}
      >
        <Settings2 className="size-4 shrink-0" />
        {wide && <span className="truncate">Settings</span>}
      </Link>
    </nav>
  );
}
