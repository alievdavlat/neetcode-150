import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandProps {
  subtitle: string;
  large?: boolean;
}

/** The mark, shared by the home hero and the board header so they stay one product. */
export function Brand({ subtitle, large = false }: BrandProps) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Problems home">
      <span
        className={cn(
          'relative flex -skew-x-6 items-center justify-center rounded-lg bg-primary font-heading font-bold text-primary-foreground',
          large ? 'size-11 text-lg' : 'size-8 text-sm',
        )}
      >
        P
        <span className="absolute -right-0.5 -bottom-0.5 size-1.5 rounded-full bg-hot" />
      </span>

      <div className="leading-tight">
        <h1
          className={cn(
            'font-heading font-semibold tracking-[0.14em] uppercase',
            large ? 'text-lg' : 'text-sm',
          )}
        >
          <span className="text-primary">Problems</span>
        </h1>
        <p className={cn('text-muted-foreground', large ? 'text-xs' : 'text-[11px]')}>{subtitle}</p>
      </div>
    </Link>
  );
}
