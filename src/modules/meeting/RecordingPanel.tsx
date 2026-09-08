import { useRef, useState } from 'react';
import { Bot, CircleDot, Download, FileCheck2, Pause, Play, Send, Square, User } from 'lucide-react';
import { Badge, Button, LiveRegion, StatusMessage, cx, inputClass } from '../../components/ui';
import { TranscriptList } from './TranscriptList';
import { TRANSCRIPT, formatTimecode } from '../../data/transcript';
import { exportTranscriptTxt } from '../../lib/export';
import { formatDuration, spokenDuration } from '../../lib/format';
import { useAppStore } from '../../store/useAppStore';

export function RecordingPanel({ onProtocolReady }: { onProtocolReady: () => void }) {
  const recordingState = useAppStore((s) => s.recordingState);
  const visibleEntries = useAppStore((s) => s.visibleEntries);
  const elapsed = useAppStore((s) => s.elapsedSeconds);
  const transcriptStatus = useAppStore((s) => s.transcriptStatus);
  const start = useAppStore((s) => s.startRecording);
  const pause = useAppStore((s) => s.pauseRecording);
  const resume = useAppStore((s) => s.resumeRecording);
  const stop = useAppStore((s) => s.stopRecording);
  const speakers = useAppStore((s) => s.speakers);
  const meta = useAppStore((s) => s.meetingMeta);
  const generate = useAppStore((s) => s.generateProtocolNow);

  const entries = TRANSCRIPT.slice(0, visibleEntries);
  const assigned = speakers.filter((s) => s.name).length;

  const statusLabel =
    recordingState === 'recording'
      ? 'Aufnahme läuft'
      : recordingState === 'paused'
        ? 'Aufnahme pausiert'
        : recordingState === 'stopped'
          ? 'Aufnahme beendet'
          : 'Aufnahme noch nicht gestartet';

  return (
    <div className="flex min-h-0 flex-1 gap-6">
      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="mb-1">Aufnahme und Live-Transkription</h2>
        <p className="mb-4 max-w-prose text-neutral-700">{meta.title}</p>

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded border border-neutral-300 bg-white p-3">
          <p className="flex items-center gap-2 font-semibold">
            <CircleDot
              aria-hidden="true"
              className={cx(
                'h-5 w-5',
                recordingState === 'recording'
                  ? 'animate-pulse text-danger-700'
                  : recordingState === 'paused'
                    ? 'text-warning-800'
                    : 'text-neutral-600',
              )}
            />
            {statusLabel}
          </p>
          <p className="font-mono text-lg">
            <span className="sr-only">Aufnahmedauer: </span>
            <span aria-hidden="true">{formatDuration(elapsed)}</span>
            <span className="sr-only">{spokenDuration(elapsed)}</span>
          </p>
          <Badge tone="neutral">
            {entries.length} von {TRANSCRIPT.length} Beiträgen
          </Badge>

          <div className="ml-auto flex flex-wrap gap-2">
            {recordingState === 'idle' && (
              <Button variant="primary" onClick={start}>
                <Play aria-hidden="true" className="h-4 w-4" />
                Aufnahme starten
              </Button>
            )}
            {recordingState === 'recording' && (
              <Button variant="secondary" onClick={pause}>
                <Pause aria-hidden="true" className="h-4 w-4" />
                Pausieren
              </Button>
            )}
            {recordingState === 'paused' && (
              <Button variant="secondary" onClick={resume}>
                <Play aria-hidden="true" className="h-4 w-4" />
                Fortsetzen
              </Button>
            )}
            {(recordingState === 'recording' || recordingState === 'paused') && (
              <Button variant="danger" onClick={stop}>
                <Square aria-hidden="true" className="h-4 w-4" />
                Beenden
              </Button>
            )}
            {recordingState === 'stopped' && (
              <>
                <Button
                  variant="ghost"
                  onClick={() =>
                    exportTranscriptTxt(
                      meta,
                      TRANSCRIPT.map(
                        (e) =>
                          formatTimecode(e.t) +
                          '\t' +
                          (speakers.find((s) => s.key === e.speaker)?.name ??
                            'Sprecher ' + e.speaker) +
                          ': ' +
                          e.text,
                      ),
                    )
                  }
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  Transkript sichern
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    generate(meta.protocolType);
                    onProtocolReady();
                  }}
                >
                  <FileCheck2 aria-hidden="true" className="h-4 w-4" />
                  Protokoll erzeugen
                </Button>
              </>
            )}
          </div>
        </div>

        {recordingState === 'stopped' && assigned < speakers.length && (
          <StatusMessage tone="warning" className="mb-4">
            <p>
              {assigned} von {speakers.length} Sprechern sind zugeordnet. Ordnen Sie die restlichen
              über den Dialog rechts oder direkt im Transkript zu, bevor Sie das Protokoll
              erzeugen.
            </p>
          </StatusMessage>
        )}

        <div className="f13-scroll min-h-0 flex-1 overflow-y-auto rounded border border-neutral-200 bg-white">
          <h3 className="sr-only">Transkript</h3>
          {entries.length === 0 ? (
            <p className="p-6 text-neutral-700">
              Sobald die Aufnahme läuft, erscheinen die Beiträge hier fortlaufend mit Zeitmarke und
              Sprechererkennung.
            </p>
          ) : (
            <TranscriptList entries={entries} autoScroll={recordingState === 'recording'} />
          )}
        </div>
      </div>

      <SpeakerAssignmentChat />
      <LiveRegion message={transcriptStatus} />
    </div>
  );
}

function SpeakerAssignmentChat() {
  const dialog = useAppStore((s) => s.speakerDialog);
  const send = useAppStore((s) => s.sendSpeakerDialogMessage);
  const speakers = useAppStore((s) => s.speakers);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  /* Nur die jeweils letzte Rückfrage des Assistenten wird angesagt,
     nicht der gesamte Dialogverlauf. */
  const lastAssistantMessage =
    [...dialog].reverse().find((m) => m.author === 'assistant')?.text ?? '';

  function sendAnswer() {
    if (!draft.trim()) return;
    send(draft);
    setDraft('');
    endRef.current?.scrollIntoView({ block: 'end' });
  }

  return (
    <section
      aria-labelledby="sprecher-dialog-titel"
      className="flex w-[380px] shrink-0 flex-col rounded border border-neutral-200 bg-white"
    >
      <div className="border-b border-neutral-200 p-4">
        <h3 id="sprecher-dialog-titel" className="mb-1">
          Sprecherzuordnung
        </h3>
        <p className="text-sm text-neutral-700">
          Der Assistent fragt die Zuordnung im Gespräch ab. Sie können jede Zuordnung auch direkt
          im Transkript ändern – über den Sprechernamen.
        </p>
      </div>

      <ul className="mb-2 flex flex-wrap gap-2 border-b border-neutral-200 p-3">
        {speakers.map((speaker) => (
          <li key={speaker.key}>
            <Badge tone={speaker.name ? 'success' : 'warning'}>
              {speaker.name ? '✓ ' : '? '}
              Sprecher {speaker.key}
              {speaker.name ? ': ' + speaker.name : ' offen'}
            </Badge>
          </li>
        ))}
      </ul>

      <div className="f13-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {dialog.length === 0 && (
          <p className="text-sm text-neutral-700">
            Der Dialog beginnt, sobald die Aufnahme beendet ist und die Sprechertrennung vorliegt.
          </p>
        )}
        <ol className="space-y-3">
          {dialog.map((message) => (
            <li
              key={message.id}
              className={cx(
                'rounded border-l-4 p-3 text-sm',
                message.author === 'assistant'
                  ? 'border-l-primary-600 bg-primary-50'
                  : 'border-l-neutral-500 bg-neutral-50',
              )}
            >
              <p className="mb-1 flex items-center gap-2 font-bold">
                {message.author === 'assistant' ? (
                  <Bot aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <User aria-hidden="true" className="h-4 w-4" />
                )}
                {message.author === 'assistant' ? 'Assistent' : 'Ihre Antwort'}
              </p>
              <p>{message.text}</p>
            </li>
          ))}
        </ol>
        <div ref={endRef} />
      </div>

      <form
        className="border-t border-neutral-200 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          sendAnswer();
        }}
      >
        <label htmlFor="sprecher-eingabe" className="mb-1 block text-sm font-semibold">
          Antwort an den Assistenten
        </label>
        <div className="flex gap-2">
          <input
            id="sprecher-eingabe"
            type="text"
            value={draft}
            disabled={dialog.length === 0}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              /* Absenden ausdrücklich behandeln und nicht auf die implizite
                 Formularabsendung des Browsers verlassen. */
              if (event.key === 'Enter') {
                event.preventDefault();
                sendAnswer();
              }
            }}
            placeholder="z. B. Ja, das ist Frau Dr. Berger."
            className={inputClass}
          />
          <Button type="submit" variant="primary" size="icon" disabled={!draft.trim()} aria-label="Antwort senden">
            <Send aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      </form>
      <LiveRegion message={lastAssistantMessage} />
    </section>
  );
}
