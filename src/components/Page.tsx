import React from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useFocusOnRouteChange } from '../hooks/useFocusOnRouteChange';
import { cx } from './ui';

/**
 * Rahmen für jede Ansicht: genau eine h1, eindeutiger Seitentitel und
 * Fokusverwaltung beim Routenwechsel.
 */
export function Page({
  title,
  documentTitle,
  intro,
  actions,
  children,
  className,
  contentClassName,
  compact = false,
}: {
  title: string;
  documentTitle?: string;
  intro?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** Schmaler Seitenkopf: für Ansichten, die den Platz für den Inhalt brauchen. */
  compact?: boolean;
}) {
  useDocumentTitle(documentTitle ?? title);
  const headingRef = useFocusOnRouteChange<HTMLHeadingElement>();

  return (
    <div className={cx('flex h-full min-h-0 flex-col', className)}>
      <div
        className={cx(
          'flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-white',
          compact ? 'px-5 py-2' : 'px-6 py-4',
        )}
      >
        <div className="min-w-0">
          <h1 ref={headingRef} tabIndex={-1} className={cx('scroll-mt-4', compact && 'text-xl')}>
            {title}
          </h1>
          {intro && <div className="mt-1.5 max-w-prose text-neutral-700">{intro}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
      <div
        className={cx('min-h-0 flex-1', contentClassName ?? 'f13-scroll overflow-y-auto px-6 py-5')}
      >
        {children}
      </div>
    </div>
  );
}
