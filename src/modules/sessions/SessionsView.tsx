import { useMemo, useState } from 'react';
import { ArrowRight, FileText, Mic, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Modal } from '../../components/Dialog';
import { Badge, Button, EmptyState, Field, inputClass } from '../../components/ui';
import {
  ARCHIVED_SESSIONS,
  PROTOCOL_STATUS_LABEL,
  type ArchivedSession,
  type ProtocolStatus,
} from '../../data/sessions';
import { getProtocolTypeInfo } from '../../data/models';
import { formatDate } from '../../data/protocol';
import { formatDuration, pluralize } from '../../lib/format';
import { useAppStore } from '../../store/useAppStore';

const STATUS_TONE: Record<ProtocolStatus, 'neutral' | 'success' | 'primary'> = {
  entwurf: 'neutral',
  gezeichnet: 'success',
  'e-akte': 'primary',
};

export function SessionsView() {
  const navigate = useNavigate();
  const meta = useAppStore((s) => s.meetingMeta);
  const protocol = useAppStore((s) => s.protocol);
  const visibleEntries = useAppStore((s) => s.visibleEntries);
  const elapsed = useAppStore((s) => s.elapsedSeconds);
  const speakers = useAppStore((s) => s.speakers);

  const [query, setQuery] = useState('');
  const [transcriptOf, setTranscriptOf] = useState<ArchivedSession | null>(null);
  const [protocolOf, setProtocolOf] = useState<ArchivedSession | null>(null);

  /* Die laufende Sitzung erscheint oben, sobald ein Transkript vorliegt. */
  const hasCurrent = visibleEntries > 0;

  const needle = query.trim().toLowerCase();
  const archived = useMemo(
    () =>
      ARCHIVED_SESSIONS.filter((session) =>
        needle ? session.title.toLowerCase().includes(needle) : true,
      ).sort((a, b) => b.date.localeCompare(a.date)),
    [needle],
  );

  const currentMatches = hasCurrent && (!needle || meta.title.toLowerCase().includes(needle));
  const total = archived.length + (currentMatches ? 1 : 0);

  return (
    <Page
      title="Protokolle & Transkripte"
      intro="Alle aufgezeichneten Sitzungen des Hauses mit den daraus erzeugten Protokollen."
      actions={
        <Button variant="primary" onClick={() => navigate('/meeting')}>
          <Mic aria-hidden="true" className="h-5 w-5" />
          Neue Sitzung aufnehmen
        </Button>
      }
    >
      <div className="max-w-6xl">
        <div className="md:max-w-md">
          <Field id="sitzungen-suche" label="Sitzungen durchsuchen">
            {(props) => (
              <input
                {...props}
                type="search"
                className={inputClass}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Titel der Sitzung"
              />
            )}
          </Field>
        </div>

        <p className="mb-3 text-sm text-neutral-700" role="status">
          {pluralize(total, 'Sitzung', 'Sitzungen')}
        </p>

        {total === 0 ? (
          <EmptyState
            icon={ScrollText}
            title="Keine Sitzung gefunden"
            action={
              <Button variant="secondary" onClick={() => setQuery('')}>
                Suche zurücksetzen
              </Button>
            }
          >
            <p>Passen Sie den Suchbegriff an oder nehmen Sie eine neue Sitzung auf.</p>
          </EmptyState>
        ) : (
          <div className="f13-scroll overflow-x-auto rounded border border-neutral-200 bg-white">
            <table className="w-full border-collapse text-base">
              <caption className="sr-only">
                Aufgezeichnete Sitzungen mit Transkript und erzeugten Protokollen
              </caption>
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-50 text-left">
                  <th scope="col" className="px-3 py-2">Sitzung</th>
                  <th scope="col" className="w-[7rem] px-3 py-2">Datum</th>
                  <th scope="col" className="w-[8rem] px-3 py-2">Transkript</th>
                  <th scope="col" className="px-3 py-2">Protokolle</th>
                  <th scope="col" className="w-[16rem] px-3 py-2">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {currentMatches && (
                  <tr className="border-b border-neutral-200 bg-primary-50">
                    <th scope="row" className="px-3 py-2 text-left font-normal">
                      <span className="block font-semibold">{meta.title}</span>
                      <Badge tone="primary">Laufende Sitzung</Badge>
                    </th>
                    <td className="px-3 py-2">{formatDate(meta.date)}</td>
                    <td className="px-3 py-2">
                      {visibleEntries} Beiträge
                      <span className="block text-sm text-neutral-700">
                        {formatDuration(elapsed)}, {speakers.length} Sprecher
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {protocol ? (
                        <Badge tone="neutral">
                          {getProtocolTypeInfo(protocol.type).name} · Entwurf
                        </Badge>
                      ) : (
                        <span className="text-neutral-700">noch keines erzeugt</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Button size="sm" variant="secondary" onClick={() => navigate('/meeting')}>
                        In der Meetingassistenz öffnen
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )}

                {archived.map((session) => (
                  <tr key={session.id} className="border-b border-neutral-200 last:border-b-0">
                    <th scope="row" className="px-3 py-2 text-left font-normal">
                      <span className="block font-semibold">{session.title}</span>
                      <span className="block text-sm text-neutral-700">
                        {session.startTime} Uhr, Dauer {formatDuration(session.durationSeconds)}
                      </span>
                    </th>
                    <td className="px-3 py-2">{formatDate(session.date)}</td>
                    <td className="px-3 py-2">
                      {session.entries} Beiträge
                      <span className="block text-sm text-neutral-700">
                        {session.speakers} Sprecher
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <ul className="flex flex-wrap gap-1.5">
                        {session.protocols.map((p) => (
                          <li key={p.type}>
                            <Badge tone={STATUS_TONE[p.status]}>
                              {getProtocolTypeInfo(p.type).name}
                              <span aria-hidden="true"> · </span>
                              <span className="sr-only">, Status: </span>
                              {PROTOCOL_STATUS_LABEL[p.status]}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setTranscriptOf(session)}
                        >
                          <ScrollText aria-hidden="true" className="h-4 w-4" />
                          Transkript
                          <span className="sr-only"> von {session.title} anzeigen</span>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setProtocolOf(session)}>
                          <FileText aria-hidden="true" className="h-4 w-4" />
                          Protokolle
                          <span className="sr-only"> von {session.title} anzeigen</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={transcriptOf !== null}
        onOpenChange={(open) => !open && setTranscriptOf(null)}
        title="Transkript"
        description={transcriptOf?.title}
        width="lg"
      >
        <p className="mb-4 text-sm text-neutral-700">
          {transcriptOf?.entries} Beiträge, {transcriptOf?.speakers} Sprecher, Dauer{' '}
          {transcriptOf ? formatDuration(transcriptOf.durationSeconds) : ''}. Angezeigt wird der
          Beginn der Aufzeichnung.
        </p>
        <ol className="divide-y divide-neutral-200 border-y border-neutral-200">
          {transcriptOf?.transcriptExcerpt.map((line, index) => (
            <li key={index} className="flex gap-4 py-2">
              <span className="w-14 shrink-0 font-mono text-sm text-neutral-700">{line.t}</span>
              <span className="min-w-0">
                <span className="block font-semibold">{line.speaker}</span>
                <span className="block">{line.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-neutral-700">
          Im Prototyp ist je Sitzung nur der Anfang des Transkripts hinterlegt. Vollständig liegt
          nur die laufende Sitzung vor.
        </p>
      </Modal>

      <Modal
        open={protocolOf !== null}
        onOpenChange={(open) => !open && setProtocolOf(null)}
        title="Erzeugte Protokolle"
        description={protocolOf?.title}
        width="md"
      >
        <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
          {protocolOf?.protocols.map((p) => (
            <li key={p.type} className="py-3">
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{getProtocolTypeInfo(p.type).name}</span>
                <Badge tone={STATUS_TONE[p.status]}>{PROTOCOL_STATUS_LABEL[p.status]}</Badge>
              </p>
              <p className="mt-1 text-sm text-neutral-700">
                Erzeugt am {formatDate(p.generatedAt.slice(0, 10))}
                {p.fileNumber ? ' · Aktenzeichen ' + p.fileNumber : ''}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-neutral-700">
          Abgelegte Protokolle sind im Prototyp nicht editierbar. Bearbeiten und exportieren lässt
          sich das Protokoll der laufenden Sitzung in der Meetingassistenz.
        </p>
      </Modal>
    </Page>
  );
}
