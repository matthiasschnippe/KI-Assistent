import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button, cx } from './ui';

/* Dialoge auf Basis von Radix: Fokusfalle, Rückgabe des Fokus an das
   auslösende Element und Schließen mit Esc sind dort umgesetzt und
   werden hier nicht nachgebaut. */

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  width = 'md',
  initialFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
  initialFocus?: React.RefObject<HTMLElement>;
}) {
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-neutral-900/50" />
        <RadixDialog.Content
          className={cx(
            'fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92vw] -translate-x-1/2 -translate-y-1/2',
            'overflow-y-auto rounded border border-neutral-300 bg-white p-6 shadow-none',
            widths[width],
          )}
          onOpenAutoFocus={(event) => {
            if (initialFocus?.current) {
              event.preventDefault();
              initialFocus.current.focus();
            }
          }}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <RadixDialog.Title className="text-xl font-bold text-neutral-900">
                {title}
              </RadixDialog.Title>
              {description && (
                <RadixDialog.Description className="mt-1 max-w-prose text-sm text-neutral-700">
                  {description}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Dialog schließen">
                <X aria-hidden="true" className="h-5 w-5" />
              </Button>
            </RadixDialog.Close>
          </div>
          {children}
          {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Abbrechen',
  destructive = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  const confirmRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      width="sm"
      footer={
        <>
          <RadixDialog.Close asChild>
            <Button variant="ghost">{cancelLabel}</Button>
          </RadixDialog.Close>
          <Button
            ref={confirmRef}
            variant={destructive ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
