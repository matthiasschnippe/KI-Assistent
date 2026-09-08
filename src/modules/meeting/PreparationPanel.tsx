import { useRef, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { FileAudio, Mic, Monitor, Play } from 'lucide-react';
import { RadioCard } from '../../components/RadioCard';
import { Button, Field, LiveRegion, StatusMessage, inputClass } from '../../components/ui';
import { PROTOCOL_TYPES } from '../../data/models';
import { useAppStore } from '../../store/useAppStore';
import type { AudioSource, ProtocolType } from '../../types';

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

        <Field
          id="meeting-teilnehmende"
          label="Teilnehmende"
          description="Eine Person je Zeile, mit Funktion in Klammern. Die Liste erscheint im Abschnitt „Anwesende“."
        >
          {(props) => (
            <textarea
              {...props}
              rows={6}
              className={inputClass + ' min-h-[9rem]'}
              value={meta.participants.join('\n')}
              onChange={(event) =>
                update({
                  participants: event.target.value.split('\n').filter((line) => line.trim() !== ''),
                })
              }
            />
          )}
        </Field>

        <fieldset className="mb-6">
          <legend className="mb-2 text-sm font-semibold text-neutral-800">
            Protokolltyp vorauswählen
          </legend>
          <p className="mb-3 max-w-prose text-sm text-neutral-700">
            Der Typ lässt sich nach der Erstellung wechseln; das Protokoll wird dann neu erzeugt.
          </p>
          <RadioGroup.Root
            value={meta.protocolType}
            onValueChange={(value) => update({ protocolType: value as ProtocolType })}
            aria-label="Protokolltyp"
            className="grid gap-3 md:grid-cols-2"
          >
            {PROTOCOL_TYPES.map((type) => (
              <RadioCard
                key={type.id}
                value={type.id}
                idPrefix={'vorb-protokoll-' + type.id}
                label={type.name}
                description={type.description}
              />
            ))}
          </RadioGroup.Root>
        </fieldset>

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
