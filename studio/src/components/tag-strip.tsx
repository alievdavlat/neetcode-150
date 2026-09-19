'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface Tag {
  name: string;
  count: number;
}

interface TagStripProps {
  title: ReactNode;
  hint: string;
  placeholder: string;
  tags: Tag[];
  picked: string | null;
  onPick: (tag: string | null) => void;
}

const SHOWN = 14;

export function TagStrip({ title, hint, placeholder, tags, picked, onPick }: TagStripProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [all, setAll] = useState(false);

  const matching = tags.filter((tag) => tag.name.toLowerCase().includes(query.trim().toLowerCase()));
  const shown = all ? matching : matching.slice(0, SHOWN);
  const rest = matching.length - shown.length;

  useEffect(() => setAll(false), [query]);

  const renderTag = (tag: Tag) => (
    <button
      key={tag.name}
      type="button"
      aria-pressed={picked === tag.name}
      onClick={() => onPick(picked === tag.name ? null : tag.name)}
      className={cn(
        'flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[13px] transition-colors',
        picked === tag.name
          ? 'border-primary/50 bg-primary/10 text-primary'
          : 'border-line bg-raised/60 text-foreground/80 hover:border-primary/30 hover:text-foreground',
      )}
    >
      {tag.name}
      <span
        className={cn(
          'rounded-full px-1.5 font-mono text-[10px] tabular-nums',
          picked === tag.name ? 'bg-primary/20 text-primary' : 'bg-white/[0.06] text-muted-foreground',
        )}
      >
        {tag.count}
      </span>
    </button>
  );

  return (
    <section className="rounded-2xl border border-line bg-panel/60 p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-10 border-0 bg-transparent pl-10 text-sm shadow-none"
        />
      </div>

      <div className="mt-2 flex items-center gap-3 border-t border-line pt-3">
        {title}
        <span title={hint} aria-label={hint} className="text-muted-foreground/70">
          <Info className="size-3.5 text-cool" />
        </span>
        <p className="font-mono text-[11px] text-muted-foreground tabular-nums">{matching.length}</p>

        {(picked || query) && (
          <button
            type="button"
            onClick={() => {
              onPick(null);
              setQuery('');
            }}
            className="flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-fail/40 hover:text-fail"
          >
            <X className="size-3" />
            {t('rail.tags.clear')}
          </button>
        )}

      </div>

      {shown.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">{t('rail.tags.empty', { query })}</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {shown.map(renderTag)}

          {(rest > 0 || all) && (
            <button
              type="button"
              onClick={() => setAll(!all)}
              className="rounded-lg border border-dashed border-line px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {all ? t('rail.tags.showFewer') : t('rail.tags.more', { value: rest })}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
