'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Info, Search, X } from 'lucide-react';
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

const PER_PAGE = 14;

export function TagStrip({ title, hint, placeholder, tags, picked, onPick }: TagStripProps) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const matching = tags.filter((tag) => tag.name.toLowerCase().includes(query.trim().toLowerCase()));
  const pages = Math.max(1, Math.ceil(matching.length / PER_PAGE));
  const safePage = Math.min(page, pages - 1);
  const shown = matching.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);

  useEffect(() => setPage(0), [query]);

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
        <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {safePage + 1} / {pages}
        </p>

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
            Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="previous page"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
            className="rounded-md border border-line p-1.5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground disabled:opacity-40"
          >
            <ArrowLeft className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="next page"
            disabled={safePage >= pages - 1}
            onClick={() => setPage(safePage + 1)}
            className="rounded-md border border-line p-1.5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground disabled:opacity-40"
          >
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">Nothing matches “{query}”.</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-1.5">{shown.map(renderTag)}</div>
      )}

      <p className="mt-3 flex items-center gap-2 rounded-lg border border-line bg-black/20 px-3 py-2 text-xs text-muted-foreground">
        <Info className="size-3.5 shrink-0 text-cool" />
        {hint}
      </p>
    </section>
  );
}
