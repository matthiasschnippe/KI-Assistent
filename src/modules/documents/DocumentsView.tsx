import { useMemo, useRef, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  FolderOpen,
  MessageSquarePlus,
  MoreVertical,
  Pencil,
  Trash2,
  Upload,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../components/Page';
import {
  Badge,
  Button,
  EmptyState,
  Field,
  LiveRegion,
  StatusMessage,
  cx,
  inputClass,
  selectClass,
} from '../../components/ui';
import { ConfirmDialog, Modal } from '../../components/Dialog';
import { validateFile } from '../chat/AttachControls';
import { KIND_LABEL, formatBytes, formatDateShort, kindFromName, pluralize } from '../../lib/format';
import { useAppStore } from '../../store/useAppStore';
import type { AttachmentKind, StoredDocument } from '../../types';

type SortKey = 'name' | 'kind' | 'size' | 'uploadedAt' | 'lastUsedAt';
type SortDir = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'kind', label: 'Typ', className: 'w-[9rem]' },
  { key: 'size', label: 'Größe', className: 'w-[7rem]' },
  { key: 'uploadedAt', label: 'Hochgeladen am', className: 'w-[10rem]' },
  { key: 'lastUsedAt', label: 'Zuletzt verwendet', className: 'w-[11rem]' },
];

const menuItemClass =
  'flex min-h-[44px] w-full cursor-pointer items-center gap-3 px-3 py-2 text-base text-neutral-800 ' +
  'outline-none data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-700';

export function DocumentsView() {
  const documents = useAppStore((s) => s.documents);
  const collections = useAppStore((s) => s.collections);
  const addDocument = useAppStore((s) => s.addDocument);
  const renameDocument = useAppStore((s) => s.renameDocument);
  const deleteDocument = useAppStore((s) => s.deleteDocument);
  const attachDocument = useAppStore((s) => s.attachDocument);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<'alle' | AttachmentKind>('alle');
  const [collectionFilter, setCollectionFilter] = useState('alle');
  const [sortKey, setSortKey] = useState<SortKey>('uploadedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const [previewDoc, setPreviewDoc] = useState<StoredDocument | null>(null);
  const [renameTarget, setRenameTarget] = useState<StoredDocument | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<StoredDocument | null>(null);

  const [uploads, setUploads] = useState<{ id: string; name: string; progress: number }[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return documents.filter((doc) => {
      if (needle && !doc.name.toLowerCase().includes(needle) && !doc.preview.toLowerCase().includes(needle)) {
        return false;
      }
      if (kindFilter !== 'alle' && doc.kind !== kindFilter) return false;
      if (collectionFilter !== 'alle' && doc.collectionId !== collectionFilter) return false;
      return true;
    });
  }, [documents, query, kindFilter, collectionFilter]);

  const sorted = useMemo(() => {
    const factor = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortKey === 'size') return (a.size - b.size) * factor;
      const av = (a[sortKey] ?? '') as string;
      const bv = (b[sortKey] ?? '') as string;
      return av.localeCompare(bv, 'de') * factor;
    });
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      const next = sortDir === 'asc' ? 'desc' : 'asc';
      setSortDir(next);
      setStatus(
        'Nach ' +
          COLUMNS.find((c) => c.key === key)?.label +
          (next === 'asc' ? ' aufsteigend' : ' absteigend') +
          ' sortiert.',
      );
    } else {
      setSortKey(key);
      setSortDir('asc');
      setStatus('Nach ' + COLUMNS.find((c) => c.key === key)?.label + ' aufsteigend sortiert.');
    }
  }

  function handleFiles(files: File[]) {
    const errors: string[] = [];
    const accepted: File[] = [];
    files.forEach((file) => {
      const error = validateFile(file.name, file.size);
      if (error) errors.push(error);
      else accepted.push(file);
    });
    setUploadErrors(errors);

    accepted.forEach((file) => {
      const id = 'up-' + file.name + '-' + Date.now();
      setUploads((list) => [...list, { id, name: file.name, progress: 0 }]);
      let progress = 0;
      const timer = window.setInterval(() => {
        progress = Math.min(100, progress + 20);
        setUploads((list) => list.map((u) => (u.id === id ? { ...u, progress } : u)));
        if (progress >= 100) {
          window.clearInterval(timer);
          addDocument({
            id: 'doc-' + Math.random().toString(36).slice(2, 9),
            name: file.name,
            kind: kindFromName(file.name)!,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            lastUsedAt: null,
            collectionId: collectionFilter === 'alle' ? 'allgemein' : collectionFilter,
            preview:
              'Für neu hochgeladene Dateien liegt im Prototyp kein Vorschautext vor. Im Betrieb erscheint hier der Beginn des erkannten Textes.',
          });
          setUploads((list) => list.filter((u) => u.id !== id));
          setStatus('Hochladen abgeschlossen: ' + file.name);
        }
      }, 260);
    });

    if (errors.length > 0) {
      setStatus(
        pluralize(errors.length, 'Datei wurde abgelehnt', 'Dateien wurden abgelehnt') +
          '. Die Meldung steht über der Tabelle.',
      );
    }
  }

  return (
    <Page
      title="Dokumente"
      intro="Ablage der Dateien, die Sie in F13 verwenden. Die Ablage ersetzt die Aktenführung nicht."
      actions={
        <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
          <Upload aria-hidden="true" className="h-5 w-5" />
          Dokumente hochladen
        </Button>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.xlsx"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          handleFiles(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFiles(Array.from(event.dataTransfer.files));
        }}
        className={cx(
          'rounded border border-dashed p-4',
          dragActive ? 'border-primary-600 bg-primary-50' : 'border-neutral-500 bg-white',
        )}
      >
        <p className="text-sm text-neutral-700">
          Dateien können hierher gezogen werden. Zulässig sind PDF, DOCX, TXT und XLSX bis 20 MB je
          Datei. Ohne Maus: Schaltfläche „Dokumente hochladen“ oben rechts.
        </p>
      </div>

      {uploadErrors.length > 0 && (
        <StatusMessage tone="error" role="alert" className="mt-4" title="Hochladen nicht möglich">
          <ul className="ml-5 list-disc space-y-1">
            {uploadErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
          <Button size="sm" variant="ghost" className="mt-2" onClick={() => setUploadErrors([])}>
            Meldung ausblenden
          </Button>
        </StatusMessage>
      )}

      {uploads.length > 0 && (
        <section aria-label="Laufende Uploads" className="mt-4 space-y-2">
          {uploads.map((upload) => (
            <div key={upload.id} className="rounded border border-neutral-200 bg-white p-3">
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-semibold">{upload.name}</span>
                <span>{upload.progress} Prozent</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={upload.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={'Hochladen von ' + upload.name}
                className="h-3 w-full border border-neutral-500 bg-neutral-100"
              >
                <div
                  className="h-full bg-primary-600"
                  style={{ width: upload.progress + '%' }}
                />
              </div>
            </div>
          ))}
        </section>
      )}

      <div className="mt-6 grid gap-x-6 md:grid-cols-3">
        <Field id="dok-suche" label="Dokumente durchsuchen">
          {(props) => (
            <input
              {...props}
              type="search"
              className={inputClass}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Dateiname oder Inhalt"
            />
          )}
        </Field>
        <Field id="dok-typ" label="Nach Typ filtern">
          {(props) => (
            <select
              {...props}
              className={selectClass}
              value={kindFilter}
              onChange={(event) => setKindFilter(event.target.value as 'alle' | AttachmentKind)}
            >
              <option value="alle">Alle Typen</option>
              <option value="pdf">PDF-Dokument</option>
              <option value="docx">Word-Dokument</option>
              <option value="txt">Textdatei</option>
              <option value="xlsx">Tabelle</option>
            </select>
          )}
        </Field>
        <Field id="dok-sammlung" label="Sammlung">
          {(props) => (
            <select
              {...props}
              className={selectClass}
              value={collectionFilter}
              onChange={(event) => setCollectionFilter(event.target.value)}
            >
              <option value="alle">Alle Sammlungen</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <p className="mb-3 text-sm text-neutral-700" role="status">
        {pluralize(sorted.length, 'Dokument', 'Dokumente')} in der Ansicht, insgesamt{' '}
        {pluralize(documents.length, 'Dokument', 'Dokumente')} in der Ablage.
      </p>

      {sorted.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={documents.length === 0 ? 'Noch keine Dokumente' : 'Kein Dokument passt zur Auswahl'}
          action={
            documents.length === 0 ? (
              <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
                <Upload aria-hidden="true" className="h-5 w-5" />
                Erstes Dokument hochladen
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('');
                  setKindFilter('alle');
                  setCollectionFilter('alle');
                }}
              >
                Filter zurücksetzen
              </Button>
            )
          }
        >
          <p>
            {documents.length === 0
              ? 'Laden Sie Vermerke, Vorlagen oder Sitzungsunterlagen hoch, um sie im Chat auswerten zu lassen. Zulässig sind PDF, DOCX, TXT und XLSX bis 20 MB.'
              : 'Setzen Sie Suchbegriff und Filter zurück, um alle Dokumente zu sehen.'}
          </p>
        </EmptyState>
      ) : (
        <div className="f13-scroll overflow-x-auto rounded border border-neutral-200 bg-white">
          <table className="w-full border-collapse text-base">
            <caption className="sr-only">
              Hochgeladene Dokumente. Die Spaltenüberschriften sind Schaltflächen zum Sortieren.
            </caption>
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-50">
                {COLUMNS.map((column) => {
                  const active = sortKey === column.key;
                  const SortIcon = active ? (sortDir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
                  return (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                      className={cx('p-0 text-left', column.className)}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className="flex min-h-[44px] w-full items-center gap-2 px-3 py-2 text-left font-bold hover:bg-neutral-200"
                      >
                        {column.label}
                        <SortIcon aria-hidden="true" className="h-4 w-4 text-neutral-700" />
                        <span className="sr-only">
                          {active
                            ? sortDir === 'asc'
                              ? '– aufsteigend sortiert, zum Umschalten aktivieren'
                              : '– absteigend sortiert, zum Umschalten aktivieren'
                            : '– zum Sortieren aktivieren'}
                        </span>
                      </button>
                    </th>
                  );
                })}
                <th scope="col" className="w-[6rem] px-3 py-2 text-left font-bold">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((doc) => (
                <tr key={doc.id} className="border-b border-neutral-200 last:border-b-0">
                  <th scope="row" className="px-3 py-2 text-left font-normal">
                    <span className="block font-semibold">{doc.name}</span>
                    <span className="block text-sm text-neutral-700">
                      {collections.find((c) => c.id === doc.collectionId)?.name ?? 'Ohne Sammlung'}
                    </span>
                  </th>
                  <td className="px-3 py-2">
                    <Badge tone="neutral">{KIND_LABEL[doc.kind]}</Badge>
                  </td>
                  <td className="px-3 py-2">{formatBytes(doc.size)}</td>
                  <td className="px-3 py-2">{formatDateShort(doc.uploadedAt)}</td>
                  <td className="px-3 py-2">
                    {doc.lastUsedAt ? formatDateShort(doc.lastUsedAt) : 'noch nicht verwendet'}
                  </td>
                  <td className="px-3 py-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={'Aktionen für ' + doc.name}
                        >
                          <MoreVertical aria-hidden="true" className="h-5 w-5" />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          align="end"
                          sideOffset={4}
                          className="z-50 min-w-[240px] rounded border border-neutral-300 bg-white py-1"
                        >
                          <DropdownMenu.Item
                            className={menuItemClass}
                            onSelect={(event) => {
                              event.preventDefault();
                              setPreviewDoc(doc);
                            }}
                          >
                            <Eye aria-hidden="true" className="h-4 w-4" />
                            Vorschau
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className={menuItemClass}
                            onSelect={() => {
                              attachDocument(doc);
                              setStatus(doc.name + ' wurde als Anhang für den Chat übernommen.');
                              navigate('/chat');
                            }}
                          >
                            <MessageSquarePlus aria-hidden="true" className="h-4 w-4" />
                            Im Chat verwenden
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className={menuItemClass}
                            onSelect={(event) => {
                              event.preventDefault();
                              setRenameTarget(doc);
                              setRenameValue(doc.name);
                              setRenameError(undefined);
                            }}
                          >
                            <Pencil aria-hidden="true" className="h-4 w-4" />
                            Umbenennen
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator className="my-1 h-px bg-neutral-200" />
                          <DropdownMenu.Item
                            className={menuItemClass + ' text-danger-700'}
                            onSelect={(event) => {
                              event.preventDefault();
                              setDeleteTarget(doc);
                            }}
                          >
                            <Trash2 aria-hidden="true" className="h-4 w-4" />
                            Löschen
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={previewDoc !== null}
        onOpenChange={(open) => !open && setPreviewDoc(null)}
        title={previewDoc?.name ?? 'Vorschau'}
        description={
          previewDoc
            ? KIND_LABEL[previewDoc.kind] +
              ', ' +
              formatBytes(previewDoc.size) +
              (previewDoc.pages ? ', ' + previewDoc.pages + ' Seiten' : '')
            : undefined
        }
        width="lg"
        footer={
          previewDoc && (
            <Button
              variant="primary"
              onClick={() => {
                attachDocument(previewDoc);
                setStatus(previewDoc.name + ' wurde als Anhang für den Chat übernommen.');
                setPreviewDoc(null);
                navigate('/chat');
              }}
            >
              <MessageSquarePlus aria-hidden="true" className="h-4 w-4" />
              Im Chat verwenden
            </Button>
          )
        }
      >
        <h3 className="mb-2 text-base">Textauszug</h3>
        <p className="max-w-prose">{previewDoc?.preview}</p>
        <p className="mt-4 text-sm text-neutral-700">
          Im Prototyp wird nur der Textbeginn angezeigt. Eine Seitenvorschau ist nicht enthalten.
        </p>
      </Modal>

      <Modal
        open={renameTarget !== null}
        onOpenChange={(open) => !open && setRenameTarget(null)}
        title="Dokument umbenennen"
        width="sm"
        initialFocus={renameInputRef}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRenameTarget(null)}>
              Abbrechen
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!renameValue.trim()) {
                  setRenameError('Bitte geben Sie einen Dateinamen ein.');
                  renameInputRef.current?.focus();
                  return;
                }
                if (!kindFromName(renameValue)) {
                  setRenameError(
                    'Die Endung muss erhalten bleiben: .pdf, .docx, .txt oder .xlsx.',
                  );
                  renameInputRef.current?.focus();
                  return;
                }
                if (renameTarget) {
                  renameDocument(renameTarget.id, renameValue);
                  setStatus('Dokument umbenannt in ' + renameValue.trim() + '.');
                }
                setRenameTarget(null);
              }}
            >
              Speichern
            </Button>
          </>
        }
      >
        <Field id="dok-name" label="Dateiname" error={renameError} required>
          {(props) => (
            <input
              {...props}
              ref={renameInputRef}
              type="text"
              className={inputClass}
              value={renameValue}
              onChange={(event) => {
                setRenameValue(event.target.value);
                if (renameError) setRenameError(undefined);
              }}
            />
          )}
        </Field>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Dokument löschen?"
        description={
          'Das Dokument „' +
          (deleteTarget?.name ?? '') +
          '“ wird aus der Ablage entfernt. Bereits erzeugte Antworten bleiben erhalten. Das Löschen kann nicht rückgängig gemacht werden.'
        }
        confirmLabel="Endgültig löschen"
        destructive
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteDocument(deleteTarget.id);
          setStatus('Dokument ' + deleteTarget.name + ' gelöscht.');
          setDeleteTarget(null);
        }}
      />

      <LiveRegion message={status} />
    </Page>
  );
}
