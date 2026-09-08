import { useEffect, useRef, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { FileAudio, Mic, Monitor, Play, Plus } from 'lucide-react';
import { RadioCard } from '../../components/RadioCard';
import { Button, Field, LiveRegion, StatusMessage, inputClass, selectClass } from '../../components/ui';

import { useAppStore } from '../../store/useAppStore';
import type { AudioSource } from '../../types';

const AUDIO_SOURCES: { id: AudioSource; label: string; hint: string; icon: typeof Mic }[] = [
  {
    id: 'mikrofon',
    label: 'Mikrofon',
    hint: 'Raummikrofon oder Headset am Arbeitsplatz. Für Sitzungen vor Ort.',
    icon: Mic,
  },
  {
    id: 'systemton',
    label: 'Systemton',
    hint: 'Ton der laufenden Videokonferenz. Für hybride und reine Onlinesitzungen.',
    icon: Monitor,
  },
  {
    id: 'datei',
    label: 'Datei hochladen',
    hint: 'Vorhandene Aufnahme im Format MP3, WAV oder M4A.',
    icon: FileAudio,
  },
];

export const MICROPHONES = [
  'Raummikrofon Sitzungsraum 3.14 (Konferenzsystem)',
  'Headset – Jabra Evolve 40 (USB)',
  'Mikrofonarray – integriert (Notebook)',
  'Webcam-Mikrofon – Logitech C925e',
];

/** Zahl der Eingabezeilen, die ohne Aufklappen sichtbar sind. */
const VISIBLE_PARTICIPANT_ROWS = 5;

function ParticipantFields({
  participants,
  onChange,
}: {
  participants: string[];
  onChange: (next: string[]) => void;
}) {
  /* Es werden immer mindestens fünf Zeilen angeboten; weitere kommen einzeln
     über die Schaltfläche darunter hinzu. */
  const [rowCount, setRowCount] = useState(
    Math.max(VISIBLE_PARTICIPANT_ROWS, participants.length),
  );
  const [status, setStatus] = useState('');
  const lastFieldRef = useRef<HTMLInputElement>(null);
  const focusLast = useRef(false);

  useEffect(() => {
    if (focusLast.current) {
      lastFieldRef.current?.focus();
      focusLast.current = false;
    }
  }, [rowCount]);

  const rows = Array.from({ length: rowCount }, (_, index) => participants[index] ?? '');

  function setRow(index: number, value: string) {
    const next = [...rows];
    next[index] = value;
    onChange(next.filter((entry) => entry.trim() !== ''));
  }

  return (
    <fieldset className="mb-6">
      <legend className="mb-1 text-sm font-semibold text-neutral-800">Teilnehmende</legend>
      <p className="mb-3 max-w-prose text-sm text-neutral-700">
        Eine Person je Zeile, mit Funktion in Klammern. Die Liste erscheint im Protokollabschnitt
        „Anwesende“.
      </p>

      <div className="max-w-xl space-y-2">
        {rows.map((value, index) => (
          <div key={index}>
            <label htmlFor={'teilnehmende-' + index} className="sr-only">
              {'Teilnehmende Person ' + (index + 1)}
            </label>
            <input
              id={'teilnehmende-' + index}
              ref={index === rowCount - 1 ? lastFieldRef : undefined}
              type="text"
              className={inputClass}
              value={value}
              placeholder={index === 0 ? 'z. B. Dr. Katrin Berger (Vorsitz)' : undefined}
              onChange={(event) => setRow(index, event.target.value)}
            />
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-2"
        onClick={() => {
          focusLast.current = true;
          setRowCount((count) => count + 1);
          setStatus('Zeile ' + (rowCount + 1) + ' hinzugefügt.');
        }}
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
        Weitere Teilnehmende hinzufügen
      </Button>

      <LiveRegion message={status} />
    </fieldset>
  );
}

export function PreparationPanel({ onStarted }: { onStarted: () => void }) {
  const meta = useAppStore((s) => s.meetingMeta);
  const update = useAppStore((s) => s.updateMeetingMeta);
  const startRecording = useAppStore((s) => s.startRecording);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function start() {
    const next: Record<string, string> = {};
    if (!meta.title.trim()) next.title = 'Bitte geben Sie einen Titel für die Sitzung ein.';
    if (!meta.date) next.date = 'Bitte geben Sie das Sitzungsdatum an.';
    if (meta.audioSource === 'datei' && !meta.fileName) {
      next.file = 'Bitte wählen Sie eine Audiodatei aus.';
    }
    setErrors(next);

    if (Object.keys(next).length > 0) {
      setStatus(
        'Das Formular enthält ' +
          Object.keys(next).length +
          (Object.keys(next).length === 1 ? ' Fehler.' : ' Fehler.') +
          ' Der Fokus steht im ersten fehlerhaften Feld.',
      );
      if (next.title) titleRef.current?.focus();
      else if (next.date) dateRef.current?.focus();
      else fileRef.current?.focus();
      return;
    }

    setStatus('');
    startRecording();
    onStarted();
  }

  return (
    <div className="max-w-4xl">
      <h2 className="mb-1">Vorbereitung</h2>
      <p className="mb-6 max-w-prose text-neutral-700">
        Erfassen Sie die Angaben zur Sitzung. Sie erscheinen später im Protokollkopf und lassen
        sich in der Nachbearbeitung noch ändern.
      </p>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          start();
        }}
      >
        <div className="grid gap-x-6 md:grid-cols-2">
          <Field id="meeting-titel" label="Titel der Sitzung" error={errors.title} required>
            {(props) => (
              <input
                {...props}
                ref={titleRef}
                type="text"
                className={inputClass}
                value={meta.title}
                onChange={(event) => update({ title: event.target.value })}
              />
            )}
          </Field>

          <Field id="meeting-ort" label="Ort">
            {(props) => (
              <input
                {...props}
                type="text"
                className={inputClass}
                value={meta.location}
                onChange={(event) => update({ location: event.target.value })}
              />
            )}
          </Field>

          <Field id="meeting-datum" label="Datum" error={errors.date} required>
            {(props) => (
              <input
                {...props}
                ref={dateRef}
                type="date"
                className={inputClass}
                value={meta.date}
                onChange={(event) => update({ date: event.target.value })}
              />
            )}
          </Field>

          <Field id="meeting-zeit" label="Beginn">
            {(props) => (
              <input
                {...props}
                type="time"
                className={inputClass}
                value={meta.startTime}
                onChange={(event) => update({ startTime: event.target.value })}
              />
            )}
          </Field>
        </div>

        <ParticipantFields
          participants={meta.participants}
          onChange={(participants) => update({ participants })}
        />

        <fieldset className="mb-6">
          <legend className="mb-2 text-sm font-semibold text-neutral-800">Audioquelle</legend>
          <RadioGroup.Root
            value={meta.audioSource}
            onValueChange={(value) => update({ audioSource: value as AudioSource })}
            aria-label="Audioquelle"
            className="grid gap-3 md:grid-cols-3"
          >
            {AUDIO_SOURCES.map((source) => {
              const Icon = source.icon;
              return (
                <RadioCard
                  key={source.id}
                  value={source.id}
                  idPrefix={'vorb-audio-' + source.id}
                  label={
                    <span className="flex items-center gap-2">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                      {source.label}
                    </span>
                  }
                  description={source.hint}
                />
              );
            })}
          </RadioGroup.Root>

          {meta.audioSource === 'mikrofon' && (
            <Field
              id="meeting-mikrofon"
              label="Mikrofon"
              description="Erkannte Aufnahmegeräte an diesem Arbeitsplatz."
              className="mt-4 max-w-md"
            >
              {(props) => (
                <select
                  {...props}
                  className={selectClass}
                  value={meta.microphone}
                  onChange={(event) => update({ microphone: event.target.value })}
                >
                  {MICROPHONES.map((device) => (
                    <option key={device} value={device}>
                      {device}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          )}

          {meta.audioSource === 'datei' && (
            <Field
              id="meeting-datei"
              label="Audiodatei"
              error={errors.file}
              className="mt-4 max-w-md"
              required
            >
              {(props) => (
                <div>
                  <input
                    {...props}
                    ref={fileRef}
                    type="file"
                    accept=".mp3,.wav,.m4a"
                    className={inputClass + ' py-1.5'}
                    onChange={(event) =>
                      update({ fileName: event.target.files?.[0]?.name ?? null })
                    }
                  />
                  {meta.fileName && (
                    <p className="mt-1 text-sm text-neutral-700">
                      Ausgewählt: {meta.fileName}
                    </p>
                  )}
                </div>
              )}
            </Field>
          )}
        </fieldset>

        <StatusMessage tone="warning" className="mb-6 max-w-prose">
          <p>
            Teilnehmende sind vor Beginn der Aufzeichnung zu informieren, und ein Widerspruch ist
            zu beachten. Kündigen Sie die Aufzeichnung zu Sitzungsbeginn an und halten Sie das im
            Eröffnungsteil des Protokolls fest.
          </p>
        </StatusMessage>

        <Button type="submit" variant="primary">
          <Play aria-hidden="true" className="h-5 w-5" />
          {meta.audioSource === 'datei' ? 'Transkription starten' : 'Aufnahme starten'}
        </Button>
      </form>

      <LiveRegion message={status} assertive />
    </div>
  );
}
