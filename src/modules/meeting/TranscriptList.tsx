import { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button, Field, LiveRegion, cx, inputClass } from '../../components/ui';
import { Modal } from '../../components/Dialog';
import { formatTimecode } from '../../data/transcript';
import { useAppStore } from '../../store/useAppStore';
import type { SpeakerKey, TranscriptEntry } from '../../types';

/**
 * Fortlaufend wachsende Transkriptansicht.
 * Sprechernamen sind direkt am Transkript änderbar: der Name ist eine
 * Schaltfläche, die die Zuordnung für alle Beiträge dieses Sprechers öffnet.
 */
export function TranscriptList({
  entries,
  highlightId,
  autoScroll,
}: {
  entries: TranscriptEntry[];
  highlightId?: string | null;
  autoScroll?: boolean;
}) {
  const speakers = useAppStore((s) => s.speakers);
  const assignSpeaker = useAppStore((s) => s.assignSpeaker);
  const [editKey, setEditKey] = useState<SpeakerKey | null>(null);
  const [nameValue, setNameValue] = useState('');
  const [functionValue, setFunctionValue] = useState('');
  const [nameError, setNameError] = useState<string | undefined>();
  const [status, setStatus] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (autoScroll) endRef.current?.scrollIntoView({ block: 'end' });
  }, [entries.length, autoScroll]);

  useEffect(() => {
    if (!highlightId) return;
    const target = document.getElementById('transkript-' + highlightId);
    target?.scrollIntoView({ block: 'center' });
  }, [highlightId]);

  function openEdit(key: SpeakerKey) {
    const speaker = speakers.find((s) => s.key === key);
    setEditKey(key);
    setNameValue(speaker?.name ?? '');
    setFunctionValue(speaker?.functionLabel ?? '');
    setNameError(undefined);
  }

  function speakerName(key: SpeakerKey): string {
    const speaker = speakers.find((s) => s.key === key);
    return speaker?.name ?? 'Sprecher ' + key;
  }

  function speakerFunction(key: SpeakerKey): string | null {
    return speakers.find((s) => s.key === key)?.functionLabel ?? null;
  }

  return (
    <>
      <ol ref={listRef} className="divide-y divide-neutral-200">
        {entries.map((entry) => {
          const fn = speakerFunction(entry.speaker);
          return (
            <li
              key={entry.id}
              id={'transkript-' + entry.id}
              className={cx(
                'flex gap-4 px-3 py-2.5',
                highlightId === entry.id && 'bg-warning-50 outline outline-2 outline-warning-700',
              )}
            >
              <span className="w-14 shrink-0 pt-1 font-mono text-sm text-neutral-700">
                <span className="sr-only">Zeitmarke </span>
                {formatTimecode(entry.t)}
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="-ml-2 font-bold"
                    onClick={() => openEdit(entry.speaker)}
                    aria-label={
                      'Zuordnung von ' +
                      speakerName(entry.speaker) +
                      ' ändern, betrifft alle Beiträge dieses Sprechers'
                    }
                  >
                    {speakerName(entry.speaker)}
                    <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                  </Button>
                  {fn && <span className="text-sm text-neutral-700">{fn}</span>}
                </p>
                <p className="max-w-prose text-base">{entry.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <div ref={endRef} />

      <Modal
        open={editKey !== null}
        onOpenChange={(open) => !open && setEditKey(null)}
        title={editKey ? 'Sprecher ' + editKey + ' zuordnen' : 'Sprecher zuordnen'}
        description="Die Zuordnung wirkt sofort auf alle Beiträge dieses Sprechers – im Transkript und im Protokoll."
        width="sm"
        initialFocus={nameRef}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditKey(null)}>
              Abbrechen
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!nameValue.trim()) {
                  setNameError('Bitte geben Sie einen Namen ein.');
                  nameRef.current?.focus();
                  return;
                }
                if (editKey) {
                  const count =
                    speakers.find((s) => s.key === editKey)?.contributions ?? 0;
                  assignSpeaker(editKey, nameValue, functionValue.trim() || null);
                  setStatus(
                    'Sprecher ' +
                      editKey +
                      ' wird als ' +
                      nameValue.trim() +
                      ' geführt. ' +
                      count +
                      ' Beiträge aktualisiert.',
                  );
                }
                setEditKey(null);
              }}
            >
              Zuordnung speichern
            </Button>
          </>
        }
      >
        <Field id="sprecher-name" label="Name" error={nameError} required>
          {(props) => (
            <input
              {...props}
              ref={nameRef}
              type="text"
              className={inputClass}
              value={nameValue}
              placeholder="z. B. Dr. Katrin Berger"
              onChange={(event) => {
                setNameValue(event.target.value);
                if (nameError) setNameError(undefined);
              }}
            />
          )}
        </Field>
        <Field
          id="sprecher-funktion"
          label="Funktion"
          description="Optional, erscheint im Protokoll hinter dem Namen."
        >
          {(props) => (
            <input
              {...props}
              type="text"
              className={inputClass}
              value={functionValue}
              placeholder="z. B. Sitzungsleitung"
              onChange={(event) => setFunctionValue(event.target.value)}
            />
          )}
        </Field>
      </Modal>

      <LiveRegion message={status} />
    </>
  );
}
