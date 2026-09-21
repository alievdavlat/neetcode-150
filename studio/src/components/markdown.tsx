import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The little bit of Markdown a stage description actually uses: fenced blocks,
 * inline code, bold, bullets and paragraphs.
 *
 * A library would be two hundred kilobytes and a client component for text
 * that is written in this repository and rendered on the server. What it does
 * not understand, it prints - which is the right failure for prose.
 */

interface MarkdownProps {
  text: string;
  className?: string;
}

const FENCE = /^```[\w]*\n([\s\S]*?)```$/;

/** `inline code`, **bold**, and everything else as it was written. */
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={index} className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[0.92em] text-foreground/90">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-medium text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

/** A heading is dropped: the page already shows the title above the text. */
const isHeading = (block: string) => block.startsWith('#');

export function Markdown({ text, className }: MarkdownProps) {
  const blocks = text.trim().split(/\n{2,}/);

  return (
    <div className={cn('space-y-2', className)}>
      {blocks.map((block, index) => {
        const fenced = block.match(FENCE);

        if (fenced) {
          return (
            <pre
              key={index}
              className="overflow-x-auto rounded-lg border border-line bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground"
            >
              {fenced[1].replace(/\n$/, '')}
            </pre>
          );
        }

        if (isHeading(block)) return null;

        if (/^[-*] /m.test(block)) {
          const items = block.split('\n').filter((line) => /^[-*] /.test(line.trim()));

          return (
            <ul key={index} className="list-disc space-y-1 pl-4">
              {items.map((item, at) => (
                <li key={at}>{inline(item.trim().slice(2))}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{inline(block.replace(/\n/g, ' '))}</p>;
      })}
    </div>
  );
}
