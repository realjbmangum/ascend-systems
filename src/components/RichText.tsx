import { Fragment, type ReactNode } from 'react';

/**
 * Lightweight rich-text renderer for proposal/SOW content.
 *
 * Supports a small, predictable subset of Markdown so plain text typed into
 * the proposal form renders as a polished document:
 *   - blank line          -> new paragraph
 *   - lines "- " / "* "   -> bullet list
 *   - lines "1. " / "1)"  -> numbered list
 *   - **text**            -> bold
 *
 * Anything else renders as a normal paragraph, so legacy plain-text proposals
 * are unaffected.
 */

const BULLET = /^\s*[-*•]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <strong key={key++} className="font-semibold text-charcoal">
        {match[1]}
      </strong>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function RichText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const blocks = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter((l) => l.trim());

        if (lines.length > 0 && lines.every((l) => BULLET.test(l))) {
          return (
            <ul key={i} className="space-y-2.5">
              {lines.map((l, j) => (
                <li
                  key={j}
                  className="flex gap-3 text-charcoal leading-relaxed"
                >
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  <span>{renderInline(l.match(BULLET)![1])}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (lines.length > 0 && lines.every((l) => NUMBERED.test(l))) {
          return (
            <ol key={i} className="space-y-2.5">
              {lines.map((l, j) => (
                <li
                  key={j}
                  className="flex gap-3 text-charcoal leading-relaxed"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange/10 text-xs font-bold text-orange">
                    {j + 1}
                  </span>
                  <span>{renderInline(l.match(NUMBERED)![1])}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={i} className="text-charcoal leading-relaxed">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {renderInline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
