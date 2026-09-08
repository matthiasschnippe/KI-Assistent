import { useRef, useState } from 'react';
import { Archive, FileText, Printer } from 'lucide-react';
import { Button, Field, LiveRegion, StatusMessage, inputClass, selectClass } from '../../components/ui';
import { Modal } from '../../components/Dialog';
import { getProtocolTypeInfo } from '../../data/models';
import { exportDocx, exportPdf } from '../../lib/export';
import { formatDateTime } from '../../lib/format';
import { useAppStore } from '../../store/useAppStore';

const AKTEN_TARGETS = [
  'Referat Z 3 / Lenkungskreis Digitalisierung, Sitzungen 2026',
  'Referat Z 2 / Haushaltsaufstellung 2027',
  'Abteilung R / Fachaufsicht, Grundsatzfragen',
  'Leitungsstab / Gremien und Beteiligung',
];

export function ExportPanel() {
  const protocol = useAppStore((s) => s.protocol);
  const meta = useAppStore((s) => s.meetingMeta);
  const eAkteResult = useAppStore((s) => s.eAkteResult);
  const transfer = useAppStore((s) => s.transferToEAkte);
  const resetEAkte = useAppStore((s) => s.resetEAkte);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [target, setTarget] = useState(AKTEN_TARGETS[0]);
  const [fileNumber, setFileNumber] = useState('');
  const [fileNumberError, setFileNumberError] = useState<string | undefined>();
  const [status, setStatus] = useState('');
  const fileNumberRef = useRef<HTMLInputElement>(null);
  const eAkteButtonRef = useRef<HTMLButtonElement>(null);

  if (!protocol) {
    return (
      <StatusMessage tone="info">
        <p>
          Für den Export wird ein erzeugtes Protokoll benötigt. Wechseln Sie zur Aufnahme und
          erzeugen Sie zunächst ein Protokoll.
        </p>
      </StatusMessage>
    );
  }

  const typeInfo = getProtocolTypeInfo(protocol.type);
  const editedCount = protocol.sections.filter((s) => s.edited).length;

  return (
    <div className="max-w-4xl">
      <h2 className="mb-1">Export</h2>
      <p className="mb-6 max-w-prose text-neutral-700">
        Exportiert wird der aktuelle Bearbeitungsstand: {typeInfo.name} zur Sitzung „{meta.title}“
        {editedCount > 0
          ? ' mit ' +
            editedCount +
            (editedCount === 1 ? ' bearbeiteten Abschnitt' : ' bearbeiteten Abschnitten') +
            '.'
          : ' in der unveränderten KI-Fassung.'}
      </p>

      <ul className="grid gap-4 md:grid-cols-3">
        <li>
          <Button
            variant="primary"
            className="w-full justify-center"
            onClick={() => {
              const name = exportDocx(meta, protocol);
              setStatus('Word-Datei erzeugt und heruntergeladen: ' + name);
            }}
          >
            <FileText aria-hidden="true" className="h-5 w-5" />
            Als Word herunterladen
          </Button>
        </li>

        <li>
          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() => {
              exportPdf(meta, protocol);
              setStatus('Druckfassung erzeugt. Der Druckdialog wurde geöffnet.');
            }}
          >
            <Printer aria-hidden="true" className="h-5 w-5" />
            Als PDF öffnen
          </Button>
        </li>

        <li>
          <Button
            ref={eAkteButtonRef}
            variant="secondary"
            className="w-full justify-center"
            onClick={() => setDialogOpen(true)}
          >
            <Archive aria-hidden="true" className="h-5 w-5" />
            In E-Akte übergeben
          </Button>
        </li>
      </ul>

      {eAkteResult && (
        <StatusMessage tone="success" role="status" className="mt-6" title="Übergabe erfolgreich">
          <p>
            Das Protokoll wurde an die E-Akte übergeben.
          </p>
          <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-[auto_1fr]">
            <dt className="font-semibold">Ablageort</dt>
            <dd>{eAkteResult.target}</dd>
            <dt className="font-semibold">Aktenzeichen</dt>
            <dd>{eAkteResult.fileNumber}</dd>
            <dt className="font-semibold">Übergabe</dt>
            <dd>{formatDateTime(eAkteResult.transferredAt)}</dd>
            <dt className="font-semibold">Quittung</dt>
            <dd>{eAkteResult.receipt}</dd>
          </dl>
          <Button
            size="sm"
            variant="ghost"
            className="mt-3"
            onClick={() => {
              resetEAkte();
              eAkteButtonRef.current?.focus();
            }}
          >
            Weitere Übergabe vorbereiten
          </Button>
        </StatusMessage>
      )}

      <StatusMessage tone="warning" className="mt-6">
        <p>
          Die Aufnahme wird nach Freigabe des Protokolls gelöscht, längstens nach 30 Tagen.
          Unterlagen, die in die Akte gehören, sind dort abzulegen – die Dokumentenablage von F13
          ersetzt die Aktenführung nicht.
        </p>
      </StatusMessage>

      <Modal
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setFileNumberError(undefined);
        }}
        title="In E-Akte übergeben"
        description="Wählen Sie den Ablageort und geben Sie das Aktenzeichen an. Die Übergabe wird anschließend bestätigt."
        width="md"
        initialFocus={fileNumberRef}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!fileNumber.trim()) {
                  setFileNumberError(
                    'Bitte geben Sie ein Aktenzeichen an, z. B. 61.2-113/26.',
                  );
                  fileNumberRef.current?.focus();
                  return;
                }
                transfer(target, fileNumber.trim());
                setStatus(
                  'Protokoll an die E-Akte übergeben: ' + target + ', ' + fileNumber.trim() + '.',
                );
                setDialogOpen(false);
              }}
            >
              Übergabe ausführen
            </Button>
          </>
        }
      >
        <Field
          id="eakte-ablageort"
          label="Ablageort"
          description="Struktur des angebundenen Dokumentenmanagements."
        >
          {(props) => (
            <select
              {...props}
              className={selectClass}
              value={target}
              onChange={(event) => setTarget(event.target.value)}
            >
              {AKTEN_TARGETS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          id="eakte-aktenzeichen"
          label="Aktenzeichen"
          description="Format nach der Aktenordnung Ihres Hauses."
          error={fileNumberError}
          required
        >
          {(props) => (
            <input
              {...props}
              ref={fileNumberRef}
              type="text"
              className={inputClass}
              value={fileNumber}
              placeholder="61.2-113/26"
              onChange={(event) => {
                setFileNumber(event.target.value);
                if (fileNumberError) setFileNumberError(undefined);
              }}
            />
          )}
        </Field>

        <StatusMessage tone="info">
          <p>
            Übergeben wird der aktuelle Bearbeitungsstand als PDF und als Word-Datei. Die
            Schnittstelle zum Dokumentenmanagement ist im Prototyp nicht angebunden.
          </p>
        </StatusMessage>
      </Modal>

      <LiveRegion message={status} />
    </div>
  );
}
