import { useRef, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FileText, FolderOpen, Paperclip, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, cx } from '../../components/ui';
import { Modal } from '../../components/Dialog';
import { KIND_LABEL, formatBytes, formatDateShort, kindFromName } from '../../lib/format';
import { MAX_UPLOAD_BYTES } from '../../data/documents';
import { useAppStore } from '../../store/useAppStore';
import type { Attachment, StoredDocument } from '../../types';

const menuItemClass =
  'flex min-h-[44px] w-full cursor-pointer items-center gap-3 px-3 py-2 text-base text-neutral-800 ' +
  'outline-none data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-700';

export function validateFile(name: string, size: number): string | null {
  const kind = kindFromName(name);
  if (!kind) {
    return (
      'Die Datei „' + name + '“ hat ein nicht unterstütztes Format. Zulässig sind PDF, DOCX, TXT und XLSX.'
    );
  }
  if (size > MAX_UPLOAD_BYTES) {
    return (
      'Die Datei „' +
      name +
      '“ ist ' +
      formatBytes(size) +
      ' groß und überschreitet die Grenze von 20 MB.'
    );
  }
  return null;
}

export function AttachMenu({ onError }: { onError: (message: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const attachFile = useAppStore((s) => s.attachFile);
  const navigate = useNavigate();

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.xlsx"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          const errors: string[] = [];
          files.forEach((file) => {
            const error = validateFile(file.name, file.size);
            if (error) {
              errors.push(error);
              return;
            }
            attachFile(file.name, kindFromName(file.name)!, file.size);
          });
          if (errors.length) onError(errors.join(' '));
          event.target.value = '';
        }}
      />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost" size="icon" aria-label="Dokument anhängen">
            <Paperclip aria-hidden="true" className="h-5 w-5" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={6}
            className="z-50 min-w-[300px] rounded border border-neutral-300 bg-white py-1"
          >
            <DropdownMenu.Item
              className={menuItemClass}
              onSelect={() => fileInputRef.current?.click()}
            >
              <Upload aria-hidden="true" className="h-5 w-5" />
              Datei vom Arbeitsplatz auswählen
            </DropdownMenu.Item>
            {/* preventDefault: der Fokus soll in den Dialog wandern, nicht
                zurück auf die auslösende Schaltfläche. */}
            <DropdownMenu.Item
              className={menuItemClass}
              onSelect={(event) => {
                event.preventDefault();
                setPickerOpen(true);
              }}
            >
              <FileText aria-hidden="true" className="h-5 w-5" />
              Aus der Dokumentenablage wählen
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-neutral-200" />
            <DropdownMenu.Item className={menuItemClass} onSelect={() => navigate('/dokumente')}>
              <FolderOpen aria-hidden="true" className="h-5 w-5" />
              Dokumentenablage öffnen
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <DocumentPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} />
    </>
  );
}

function DocumentPickerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const documents = useAppStore((s) => s.documents);
  const attachDocument = useAppStore((s) => s.attachDocument);
  const pending = useAppStore((s) => s.pendingAttachments);
  const [query, setQuery] = useState('');

  const filtered = documents.filter((d) =>
    d.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Dokument aus der Ablage anhängen"
      description="Die Auswahl hängt das Dokument an die nächste Nachricht an."
      width="lg"
      footer={<Button variant="primary" onClick={() => onOpenChange(false)}>Fertig</Button>}
    >
      <div className="mb-4">
        <label htmlFor="doc-picker-search" className="mb-1 block text-sm font-semibold">
          Dokumente durchsuchen
        </label>
        <input
          id="doc-picker-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Dateiname"
          className="w-full min-h-[44px] rounded border border-neutral-500 px-3 py-2"
        />
      </div>

      <p className="mb-2 text-sm text-neutral-700" role="status">
        {filtered.length === 1 ? '1 Dokument gefunden' : filtered.length + ' Dokumente gefunden'}
      </p>

      <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
        {filtered.map((doc) => {
          const alreadyAttached = pending.some((a) => a.documentId === doc.id);
          return (
            <li key={doc.id} className="flex items-center justify-between gap-4 py-2">
              <div className="min-w-0">
                <p className="truncate font-semibold">{doc.name}</p>
                <p className="text-sm text-neutral-700">
                  {KIND_LABEL[doc.kind]}, {formatBytes(doc.size)}, hochgeladen am{' '}
                  {formatDateShort(doc.uploadedAt)}
                </p>
              </div>
              <Button
                size="sm"
                variant={alreadyAttached ? 'ghost' : 'secondary'}
                disabled={alreadyAttached}
                onClick={() => attachDocument(doc)}
              >
                {alreadyAttached ? 'Angehängt' : 'Anhängen'}
                <span className="sr-only"> – {doc.name}</span>
              </Button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="py-4 text-neutral-700">
            Kein Dokument gefunden. Passen Sie den Suchbegriff an.
          </li>
        )}
      </ul>
    </Modal>
  );
}

export function AttachmentChips({
  attachments,
  onRemove,
  className,
}: {
  attachments: Attachment[];
  onRemove?: (id: string) => void;
  className?: string;
}) {
  if (attachments.length === 0) return null;
  return (
    <ul className={cx('flex flex-wrap gap-2', className)} aria-label="Angehängte Dokumente">
      {attachments.map((att) => (
        <li
          key={att.id}
          className="flex items-center gap-2 rounded border border-neutral-300 bg-neutral-50 py-1 pl-3 pr-1 text-sm"
        >
          <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-neutral-700" />
          <span className="max-w-[22rem] truncate font-medium">{att.name}</span>
          <span className="text-neutral-700">
            {KIND_LABEL[att.kind]}, {formatBytes(att.size)}
          </span>
          {onRemove && (
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => onRemove(att.id)}
              aria-label={'Anhang entfernen: ' + att.name}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}

export function documentToAttachment(doc: StoredDocument): Attachment {
  return { id: 'att-' + doc.id, documentId: doc.id, name: doc.name, kind: doc.kind, size: doc.size };
}
