import { useMemo, useRef, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Field, LiveRegion, cx, inputClass } from '../../components/ui';
import { ConfirmDialog, Modal } from '../../components/Dialog';
import { DATE_GROUP_ORDER, dateGroup, formatDateShort, pluralize } from '../../lib/format';
import { useAppStore } from '../../store/useAppStore';
import type { Conversation } from '../../types';

const menuItemClass =
  'flex min-h-[44px] w-full cursor-pointer items-center gap-3 px-3 py-2 text-base text-neutral-800 ' +
  'outline-none data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-700';

export function ChatHistory() {
  const conversations = useAppStore((s) => s.conversations);
  const activeId = useAppStore((s) => s.activeConversationId);
  const select = useAppStore((s) => s.selectConversation);
  const newConversation = useAppStore((s) => s.newConversation);
  const rename = useAppStore((s) => s.renameConversation);
  const remove = useAppStore((s) => s.deleteConversation);
  const search = useAppStore((s) => s.historySearch);
  const setSearch = useAppStore((s) => s.setHistorySearch);

  const [renameTarget, setRenameTarget] = useState<Conversation | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);
  const [status, setStatus] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  const needle = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      conversations.filter((c) => {
        if (!needle) return true;
        if (c.title.toLowerCase().includes(needle)) return true;
        return c.messages.some((m) => m.text.toLowerCase().includes(needle));
      }),
    [conversations, needle],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Conversation[]>();
    for (const conv of filtered) {
      const key = dateGroup(conv.updatedAt);
      const list = map.get(key) ?? [];
      list.push(conv);
      map.set(key, list);
    }
    return map;
  }, [filtered]);

  return (
    <aside
      aria-labelledby="verlauf-titel"
      className="f13-scroll flex w-[252px] shrink-0 flex-col overflow-y-auto border-r border-neutral-200 bg-white"
    >
      <div className="border-b border-neutral-200 p-3">
        <h2 id="verlauf-titel" className="sr-only">
          Chatverlauf
        </h2>
        <Button variant="primary" size="sm" className="mb-3 w-full" onClick={newConversation}>
          <Plus aria-hidden="true" className="h-4 w-4" />
          Neue Unterhaltung
        </Button>
        <label htmlFor="verlauf-suche" className="sr-only">
          Verlauf durchsuchen
        </label>
        <input
          id="verlauf-suche"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Verlauf durchsuchen"
          className={inputClass + ' min-h-[36px] py-1.5 text-sm'}
          aria-describedby="verlauf-treffer"
        />
        {/* Die Trefferzahl wird nur bei aktiver Suche gezeigt - und dann als
            Statusmeldung, damit die Suche auch ohne Blick auf die Liste
            nachvollziehbar bleibt. */}
        <p
          id="verlauf-treffer"
          className={needle ? 'mt-1.5 text-xs text-neutral-700' : 'sr-only'}
          role="status"
        >
          {needle ? pluralize(filtered.length, 'Treffer', 'Treffer') : ''}
        </p>
      </div>

      <nav aria-label="Gespeicherte Unterhaltungen" className="flex-1 p-1.5">
        {filtered.length === 0 && (
          <p className="p-3 text-sm text-neutral-700">
            Keine Unterhaltung gefunden. Passen Sie den Suchbegriff an.
          </p>
        )}
        {DATE_GROUP_ORDER.filter((group) => grouped.has(group)).map((group) => (
          <section key={group} className="mb-3">
            <h3 className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-neutral-700">
              {group}
            </h3>
            <ul>
              {(grouped.get(group) ?? []).map((conv) => {
                const active = conv.id === activeId;
                return (
                  <li key={conv.id} className="flex items-stretch gap-1">
                    <button
                      type="button"
                      onClick={() => select(conv.id)}
                      aria-current={active ? 'true' : undefined}
                      className={cx(
                        'min-h-[44px] flex-1 border-l-4 px-2 py-1.5 text-left text-sm',
                        active
                          ? 'border-l-primary-600 bg-primary-50 font-bold text-primary-700'
                          : 'border-l-transparent hover:bg-neutral-100',
                      )}
                    >
                      <span className="block truncate">{conv.title}</span>
                      <span className="block text-xs font-normal text-neutral-700">
                        {formatDateShort(conv.updatedAt)}
                        {active && <span className="sr-only"> – aktuell geöffnet</span>}
                      </span>
                    </button>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <Button
                          variant="ghost"
                          size="iconSm"
                          className="self-center"
                          aria-label={'Aktionen für die Unterhaltung „' + conv.title + '“'}
                        >
                          <MoreVertical aria-hidden="true" className="h-4 w-4" />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          align="end"
                          sideOffset={4}
                          className="z-50 min-w-[220px] rounded border border-neutral-300 bg-white py-1"
                        >
                          <DropdownMenu.Item
                            className={menuItemClass}
                            onSelect={(event) => {
                              event.preventDefault();
                              setRenameTarget(conv);
                              setRenameValue(conv.title);
                              setRenameError(undefined);
                            }}
                          >
                            <Pencil aria-hidden="true" className="h-4 w-4" />
                            Umbenennen
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className={menuItemClass + ' text-danger-700'}
                            onSelect={(event) => {
                              event.preventDefault();
                              setDeleteTarget(conv);
                            }}
                          >
                            <Trash2 aria-hidden="true" className="h-4 w-4" />
                            Löschen
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      <Modal
        open={renameTarget !== null}
        onOpenChange={(open) => !open && setRenameTarget(null)}
        title="Unterhaltung umbenennen"
        description="Der Titel erscheint im Chatverlauf."
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
                  setRenameError('Bitte geben Sie einen Titel ein.');
                  renameInputRef.current?.focus();
                  return;
                }
                if (renameTarget) {
                  rename(renameTarget.id, renameValue);
                  setStatus('Unterhaltung umbenannt in „' + renameValue.trim() + '“.');
                }
                setRenameTarget(null);
              }}
            >
              Speichern
            </Button>
          </>
        }
      >
        <Field id="rename-titel" label="Titel" error={renameError} required>
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
        title="Unterhaltung löschen?"
        description={
          'Die Unterhaltung „' +
          (deleteTarget?.title ?? '') +
          '“ wird endgültig gelöscht. Das kann nicht rückgängig gemacht werden.'
        }
        confirmLabel="Endgültig löschen"
        destructive
        onConfirm={() => {
          if (!deleteTarget) return;
          remove(deleteTarget.id);
          setStatus('Unterhaltung „' + deleteTarget.title + '“ gelöscht.');
          setDeleteTarget(null);
        }}
      />

      <LiveRegion message={status} />
    </aside>
  );
}
