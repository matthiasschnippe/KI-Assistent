import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { cx } from './ui';

/**
 * Eine Auswahlkarte innerhalb einer Radiogruppe.
 *
 * Wichtig für die Bedienbarkeit: die ganze Karte ist das Radio-Bedienelement.
 * Ein `label` um ein Radix-Radio herum würde weder einen zugänglichen Namen
 * liefern (ein label beschriftet keine Schaltfläche) noch die Karte klickbar
 * machen. Name und Beschreibung werden deshalb über `aria-labelledby` und
 * `aria-describedby` an die sichtbaren Texte gebunden.
 */
export function RadioCard({
  value,
  idPrefix,
  label,
  description,
  children,
  className,
}: {
  value: string;
  /** Basis für die IDs von Name und Beschreibung, muss eindeutig sein */
  idPrefix: string;
  /** Sichtbarer Name, wird zum zugänglichen Namen */
  label: React.ReactNode;
  /** Sichtbare Beschreibung, wird zur zugänglichen Beschreibung */
  description?: React.ReactNode;
  /** Weitere Inhalte unterhalb der Beschreibung */
  children?: React.ReactNode;
  className?: string;
}) {
  const nameId = idPrefix + '-name';
  const descId = idPrefix + '-desc';

  return (
    <RadioGroup.Item
      value={value}
      aria-labelledby={nameId}
      aria-describedby={description ? descId : undefined}
      className={cx(
        'group flex w-full gap-3 rounded border border-neutral-500 bg-white p-3 text-left',
        'hover:bg-neutral-50',
        'data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-50',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
          'border-neutral-700 bg-white group-data-[state=checked]:border-primary-600',
        )}
      >
        <RadioGroup.Indicator className="block h-3 w-3 rounded-full bg-primary-600" />
      </span>
      <span className="min-w-0">
        <span id={nameId} className="block font-bold">
          {label}
        </span>
        {description && (
          <span id={descId} className="mt-1 block text-sm text-neutral-700">
            {description}
          </span>
        )}
        {children}
      </span>
    </RadioGroup.Item>
  );
}
