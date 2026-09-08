import React, { forwardRef } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, type LucideIcon } from 'lucide-react';

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/* ---------------- Button ---------------- */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerGhost';
type Size = 'md' | 'sm' | 'icon' | 'iconSm';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white border border-primary-600 hover:bg-primary-700 hover:border-primary-700',
  secondary:
    'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 font-semibold',
  ghost: 'bg-transparent text-neutral-700 border border-transparent hover:bg-neutral-200',
  danger: 'bg-danger-700 text-white border border-danger-700 hover:bg-danger-800',
  dangerGhost: 'bg-white text-danger-700 border border-danger-700 hover:bg-danger-50 font-semibold',
};

const SIZES: Record<Size, string> = {
  md: 'min-h-[44px] px-4 py-2 text-base',
  sm: 'min-h-[36px] px-3 py-1.5 text-sm',
  icon: 'h-11 w-11 justify-center',
  iconSm: 'h-9 w-9 justify-center',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'inline-flex items-center gap-2 rounded font-medium',
        'disabled:bg-neutral-200 disabled:text-neutral-700 disabled:border-neutral-500',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    />
  );
});

/* ---------------- Badge ---------------- */

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-300',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    success: 'bg-success-50 text-success-800 border-success-200',
    warning: 'bg-warning-50 text-warning-800 border-warning-200',
    danger: 'bg-danger-50 text-danger-800 border-danger-200',
  } as const;
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Statusmeldung ----------------
   Status wird nie allein über Farbe vermittelt: Icon + Text gehören dazu. */

export type StatusTone = 'info' | 'success' | 'warning' | 'error';

const STATUS_STYLE: Record<StatusTone, { box: string; icon: typeof Info; label: string }> = {
  info: { box: 'bg-primary-50 border-primary-200 text-neutral-800', icon: Info, label: 'Hinweis' },
  success: {
    box: 'bg-success-50 border-success-200 text-neutral-800',
    icon: CheckCircle2,
    label: 'Erfolg',
  },
  warning: {
    box: 'bg-warning-50 border-warning-200 text-neutral-800',
    icon: TriangleAlert,
    label: 'Warnung',
  },
  error: { box: 'bg-danger-50 border-danger-200 text-neutral-800', icon: AlertCircle, label: 'Fehler' },
};

export function StatusMessage({
  tone = 'info',
  title,
  children,
  className,
  role,
}: {
  tone?: StatusTone;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  role?: 'status' | 'alert';
}) {
  const style = STATUS_STYLE[tone];
  const Icon = style.icon;
  return (
    <div className={cx('flex gap-3 rounded border p-3', style.box, className)} role={role}>
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 text-sm">
        <span className="sr-only">{style.label}: </span>
        {title && <p className="font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}

/* ---------------- Leerzustand ---------------- */

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="f13-card mx-auto max-w-2xl p-8 text-center">
      {Icon && <Icon aria-hidden="true" className="mx-auto mb-3 h-8 w-8 text-neutral-600" />}
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      {children && <div className="mx-auto max-w-prose text-neutral-700">{children}</div>}
      {action && <div className="mt-5 flex justify-center gap-3">{action}</div>}
    </div>
  );
}

/* ---------------- Formularfeld ----------------
   Label, Beschreibung und Fehlertext werden über aria-describedby verbunden. */

export interface FieldProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: (props: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': true | undefined;
    'aria-required': true | undefined;
  }) => React.ReactNode;
  className?: string;
}

export function Field({
  id,
  label,
  description,
  error,
  required,
  children,
  className,
}: FieldProps) {
  const descId = description ? id + '-desc' : undefined;
  const errId = error ? id + '-err' : undefined;
  const describedBy = [descId, errId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('mb-4', className)}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-neutral-800">
        {label}
        {required && (
          <>
            {' '}
            <span aria-hidden="true">*</span>
            <span className="sr-only">(Pflichtfeld)</span>
          </>
        )}
      </label>
      {description && (
        <p id={descId} className="mb-1 text-sm text-neutral-700">
          {description}
        </p>
      )}
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined,
      })}
      {error && (
        <p id={errId} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-danger-700">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="sr-only">Fehler: </span>
            {error}
          </span>
        </p>
      )}
    </div>
  );
}

export const inputClass =
  'w-full min-h-[44px] rounded border border-neutral-500 bg-white px-3 py-2 text-base text-neutral-900 ' +
  'placeholder:text-neutral-500 aria-[invalid=true]:border-danger-700 aria-[invalid=true]:border-2';

export const selectClass = inputClass + ' pr-8';

/* ---------------- Live-Region ----------------
   Gebündelte Statusmeldungen für Screenreader. */

export function LiveRegion({
  message,
  assertive = false,
}: {
  message: string;
  assertive?: boolean;
}) {
  return (
    <div
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      className="sr-only"
      role={assertive ? 'alert' : 'status'}
    >
      {message}
    </div>
  );
}

