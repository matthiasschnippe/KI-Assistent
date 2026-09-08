import { useEffect, useRef, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {
  Bold,
  FileText,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  PencilLine,
  RotateCcw,
  Table,
  Undo2,
  X,
} from 'lucide-react';
import { RadioCard } from '../../components/RadioCard';
import { Badge, Button, LiveRegion, StatusMessage } from '../../components/ui';
import { ConfirmDialog } from '../../components/Dialog';
import { TranscriptList } from './TranscriptList';
import { PROTOCOL_TYPES, getProtocolTypeInfo } from '../../data/models';
import { TRANSCRIPT } from '../../data/transcript';
import { useAppStore } from '../../store/useAppStore';
import type { ProtocolType } from '../../types';

export function ProtocolEditor({ onExport }: { onExport: () => void }) {
  const protocol = useAppStore((s) => s.protocol);
  const generate = useAppStore((s) => s.generateProtocolNow);
  const updateSection = useAppStore((s) => s.updateProtocolSection);
  const resetSection = useAppStore((s) => s.resetProtocolSection);

  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<ProtocolType | null>(null);
  const [status, setStatus] = useState('');
  /* Das Transkript wird nur bei Bedarf eingeblendet - in der Nachbearbeitung
     zählt der Platz für das Protokoll. */
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  if (!protocol) {
    return (
      <StatusMessage tone="info">
        <p>
          Es liegt noch kein Protokoll vor. Beenden Sie die Aufnahme und wählen Sie dort „Protokoll
          erzeugen“.
        </p>
      </StatusMessage>
    );
  }

  const edited = protocol.sections.filter((s) => s.edited).length;
  const typeInfo = getProtocolTypeInfo(protocol.type);

  function switchType(next: ProtocolType) {
    if (next === protocol!.type) return;
    if (edited > 0) {
      setPendingType(next);
      return;
    }
    generate(next);
    setStatus('Protokoll neu erzeugt als ' + getProtocolTypeInfo(next).name + '.');
  }

  return (
    <div className="flex min-h-0 flex-1 gap-6">
      <div className="f13-scroll min-h-0 flex-1 overflow-y-auto pr-1">
        <h2 className="mb-1">Nachbearbeitung</h2>
        <p className="mb-4 max-w-prose text-neutral-700">
          Das Protokoll ist ein Entwurf und direkt bearbeitbar. Bearbeitete Abschnitte werden
          gekennzeichnet; die KI-Fassung lässt sich je Abschnitt wiederherstellen.
        </p>

        <fieldset className="mb-6 rounded border border-neutral-200 bg-white p-4">
          <legend className="px-1 text-sm font-semibold">Protokolltyp</legend>
          <RadioGroup.Root
            value={protocol.type}
            onValueChange={(value) => switchType(value as ProtocolType)}
            aria-label="Protokolltyp wechseln"
            className="grid gap-2 md:grid-cols-2"
          >
            {PROTOCOL_TYPES.map((type) => (
              <RadioCard
                key={type.id}
                value={type.id}
                idPrefix={'nachb-protokoll-' + type.id}
                label={type.name}
                description={type.short}
              />
            ))}
          </RadioGroup.Root>
          <p className="mt-3 text-sm text-neutral-700">{typeInfo.description}</p>
        </fieldset>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge tone="primary">{typeInfo.name}</Badge>
          {edited > 0 ? (
            <Badge tone="warning">
              <PencilLine aria-hidden="true" className="h-3 w-3" />
              {edited === 1 ? '1 Abschnitt bearbeitet' : edited + ' Abschnitte bearbeitet'}
            </Badge>
          ) : (
            <Badge tone="neutral">Unveränderte KI-Fassung</Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            aria-expanded={transcriptOpen}
            aria-controls="transkript-panel"
            onClick={() => setTranscriptOpen((v) => !v)}
          >
            <FileText aria-hidden="true" className="h-4 w-4" />
            {transcriptOpen ? 'Transkript ausblenden' : 'Transkript einblenden'}
          </Button>
          <Button variant="primary" size="sm" onClick={onExport}>
            Weiter zum Export
          </Button>
        </div>

        <StatusMessage tone="warning" className="mb-6">
          <p>
            Prüfen Sie vor der Weitergabe den Wortlaut jedes Beschlusses, alle
            Abstimmungsergebnisse, die Anwesenheitsliste sowie Namen, Zahlen und Fristen. Das
            Protokoll wird erst mit der Zeichnung der Schriftführung verbindlich.
          </p>
        </StatusMessage>

        <div className="space-y-6">
          {protocol.sections.map((section) => (
            <SectionEditor
              key={section.id}
              sectionId={section.id}
              heading={section.heading}
              html={section.html}
              edited={!!section.edited}
              hasSource={!!section.sourceEntryId}
              onChange={(html) => updateSection(section.id, html)}
              onReset={() => {
                resetSection(section.id);
                setStatus('Abschnitt „' + section.heading + '“ auf die KI-Fassung zurückgesetzt.');
              }}
              onJump={() => {
                setTranscriptOpen(true);
                setHighlightId(section.sourceEntryId ?? null);
                setStatus(
                  'Transkript eingeblendet und zur Stelle des Abschnitts „' +
                    section.heading +
                    '“ gesprungen.',
                );
              }}
            />
          ))}
        </div>
      </div>

      <section
        id="transkript-panel"
        hidden={!transcriptOpen}
        aria-labelledby="transkript-panel-titel"
        className="flex w-[380px] shrink-0 flex-col rounded border border-neutral-200 bg-white"
      >
        <div className="flex items-start justify-between gap-2 border-b border-neutral-200 p-3">
          <div>
            <h3 id="transkript-panel-titel" className="mb-1">
              Transkript
            </h3>
            <p className="text-sm text-neutral-700">
              Sprechernamen sind hier direkt änderbar.
            </p>
          </div>
          <Button
            variant="ghost"
            size="iconSm"
            aria-label="Transkript ausblenden"
            onClick={() => setTranscriptOpen(false)}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
        <div className="f13-scroll min-h-0 flex-1 overflow-y-auto">
          <TranscriptList entries={TRANSCRIPT} highlightId={highlightId} />
        </div>
      </section>

      <ConfirmDialog
        open={pendingType !== null}
        onOpenChange={(open) => !open && setPendingType(null)}
        title="Protokoll neu erzeugen?"
        description={
          'Es liegen ' +
          edited +
          (edited === 1 ? ' bearbeiteter Abschnitt' : ' bearbeitete Abschnitte') +
          ' vor. Beim Wechsel des Protokolltyps wird das Protokoll neu erzeugt; Ihre Änderungen gehen dabei verloren.'
        }
        confirmLabel="Neu erzeugen"
        destructive
        onConfirm={() => {
          if (!pendingType) return;
          generate(pendingType);
          setStatus('Protokoll neu erzeugt als ' + getProtocolTypeInfo(pendingType).name + '.');
          setPendingType(null);
        }}
      />

      <LiveRegion message={status} />
    </div>
  );
}

/* ---------- Abschnittseditor mit Formatierleiste ---------- */

function SectionEditor({
  sectionId,
  heading,
  html,
  edited,
  hasSource,
  onChange,
  onReset,
  onJump,
}: {
  sectionId: string;
  heading: string;
  html: string;
  edited: boolean;
  hasSource: boolean;
  onChange: (html: string) => void;
  onReset: () => void;
  onJump: () => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const headingId = 'abschnitt-' + sectionId;

  /* Der Inhalt wird nur geschrieben, wenn er sich ausserhalb des Editors
     geaendert hat. Dadurch bleibt die Schreibmarke beim Tippen erhalten. */
  useEffect(() => {
    const el = editorRef.current;
    if (el && el.innerHTML !== html) el.innerHTML = html;
  }, [html]);

  function saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        savedRange.current = range.cloneRange();
      }
    }
  }

  function exec(command: string, value?: string) {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const selection = window.getSelection();
    if (savedRange.current && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }
    document.execCommand(command, false, value);
    onChange(el.innerHTML);
    saveSelection();
  }

  const toolButton = (
    label: string,
    Icon: typeof Bold,
    action: () => void,
  ) => (
    <Button
      key={label}
      size="iconSm"
      variant="ghost"
      aria-label={label}
      title={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={action}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </Button>
  );

  return (
    <section aria-labelledby={headingId} className="rounded border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 px-3 py-2">
        <h3 id={headingId} className="mr-auto text-base font-bold">
          {heading}
          {edited && (
            <>
              {' '}
              <Badge tone="warning">bearbeitet</Badge>
            </>
          )}
        </h3>
        {hasSource && (
          <Button size="sm" variant="ghost" onClick={onJump}>
            <Undo2 aria-hidden="true" className="h-4 w-4" />
            Zur Transkriptstelle
          </Button>
        )}
        {edited && (
          <Button size="sm" variant="ghost" onClick={onReset}>
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            KI-Fassung wiederherstellen
          </Button>
        )}
      </div>

      <div
        role="toolbar"
        aria-label={'Formatierung für den Abschnitt ' + heading}
        aria-controls={'editor-' + sectionId}
        className="flex flex-wrap gap-1 border-b border-neutral-200 bg-neutral-50 px-2 py-1"
      >
        {toolButton('Fett', Bold, () => exec('bold'))}
        {toolButton('Kursiv', Italic, () => exec('italic'))}
        {toolButton('Überschrift zweite Ebene', Heading2, () => exec('formatBlock', 'h2'))}
        {toolButton('Überschrift dritte Ebene', Heading3, () => exec('formatBlock', 'h3'))}
        {toolButton('Aufzählung', List, () => exec('insertUnorderedList'))}
        {toolButton('Nummerierte Liste', ListOrdered, () => exec('insertOrderedList'))}
        {toolButton('Tabelle mit drei Spalten einfügen', Table, () =>
          exec(
            'insertHTML',
            '<table><thead><tr><th scope="col">Spalte 1</th><th scope="col">Spalte 2</th>' +
              '<th scope="col">Spalte 3</th></tr></thead><tbody><tr><td>&nbsp;</td><td>&nbsp;</td>' +
              '<td>&nbsp;</td></tr></tbody></table><p>&nbsp;</p>',
          ),
        )}
      </div>

      <div
        id={'editor-' + sectionId}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-labelledby={headingId}
        className="f13-richtext min-h-[6rem] px-4 py-3 text-base"
        onInput={() => {
          const el = editorRef.current;
          if (el) onChange(el.innerHTML);
        }}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onBlur={saveSelection}
      />
    </section>
  );
}
