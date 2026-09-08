import { useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../components/Page';
import { RadioCard } from '../../components/RadioCard';
import { Button, Field, LiveRegion, StatusMessage, selectClass } from '../../components/ui';
import { ConfirmDialog } from '../../components/Dialog';
import { MODELS, PROTOCOL_TYPES } from '../../data/models';
import { useAppStore } from '../../store/useAppStore';
import type { ModelId, ProtocolType, RetentionOption } from '../../types';

const RETENTION_OPTIONS: { value: RetentionOption; label: string }[] = [
  { value: '7', label: '7 Tage' },
  { value: '30', label: '30 Tage (Voreinstellung)' },
  { value: '90', label: '90 Tage' },
  { value: '365', label: '365 Tage' },
  { value: 'manuell', label: 'Nur manuell löschen' },
];

export function SettingsView() {
  const user = useAppStore((s) => s.user);
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const logout = useAppStore((s) => s.logout);
  const navigate = useNavigate();

  const [status, setStatus] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(false);

  if (!user) return null;

  return (
    <Page
      title="Einstellungen"
      intro="Profil, Voreinstellungen und Aufbewahrung. Änderungen wirken sofort."
    >
      <div className="max-w-3xl space-y-8">
        <section aria-labelledby="profil-titel" className="rounded border border-neutral-200 bg-white p-5">
          <h2 id="profil-titel" className="mb-4">
            Profil
          </h2>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[12rem_1fr]">
            <dt className="font-semibold">Name</dt>
            <dd>{user.fullName}</dd>
            <dt className="font-semibold">Organisationseinheit</dt>
            <dd>{user.orgUnit}</dd>
            <dt className="font-semibold">Behörde</dt>
            <dd>{user.authority}</dd>
            <dt className="font-semibold">Rolle</dt>
            <dd>{user.role}</dd>
            <dt className="font-semibold">Behördenkennung</dt>
            <dd>{user.id}</dd>
          </dl>
          <p className="mt-4 text-sm text-neutral-700">
            Name, Organisationseinheit und Rolle stammen aus der Benutzerverwaltung und werden
            nicht in F13 gepflegt. Änderungen beantragen Sie über den IT-Service Ihres Hauses.
          </p>
        </section>

        <section aria-labelledby="modell-titel" className="rounded border border-neutral-200 bg-white p-5">
          <h2 id="modell-titel" className="mb-2">
            Standardmodell
          </h2>
          <p className="mb-4 max-w-prose text-neutral-700">
            Das Standardmodell ist bei jeder neuen Unterhaltung vorausgewählt und lässt sich im
            Chat jederzeit wechseln.
          </p>
          <RadioGroup.Root
            value={settings.defaultModel}
            onValueChange={(value) => {
              updateSettings({ defaultModel: value as ModelId });
              setStatus(
                'Standardmodell gespeichert: ' +
                  (MODELS.find((m) => m.id === value)?.name ?? value) +
                  '.',
              );
            }}
            aria-label="Standardmodell"
            className="grid gap-3 md:grid-cols-2"
          >
            {MODELS.map((model) => (
              <RadioCard
                key={model.id}
                value={model.id}
                idPrefix={'einst-modell-' + model.id}
                label={model.name}
                description={
                  <>
                    {model.suitability}
                    <span aria-hidden="true"> · </span>
                    <span className="sr-only">, </span>
                    {model.hostingBadge}
                  </>
                }
              />
            ))}
          </RadioGroup.Root>
        </section>

        <section
          aria-labelledby="protokoll-titel"
          className="rounded border border-neutral-200 bg-white p-5"
        >
          <h2 id="protokoll-titel" className="mb-2">
            Standard-Protokolltyp
          </h2>
          <p className="mb-4 max-w-prose text-neutral-700">
            Vorauswahl in der Meetingassistenz. Der Typ ist dort und nach der Erstellung
            wechselbar.
          </p>
          <div className="max-w-md">
            <Field id="standard-protokolltyp" label="Protokolltyp">
              {(props) => (
                <select
                  {...props}
                  className={selectClass}
                  value={settings.defaultProtocolType}
                  onChange={(event) => {
                    updateSettings({ defaultProtocolType: event.target.value as ProtocolType });
                    setStatus(
                      'Standard-Protokolltyp gespeichert: ' +
                        (PROTOCOL_TYPES.find((p) => p.id === event.target.value)?.name ?? '') +
                        '.',
                    );
                  }}
                >
                  {PROTOCOL_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} – {type.short}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        </section>

        <section
          aria-labelledby="aufbewahrung-titel"
          className="rounded border border-neutral-200 bg-white p-5"
        >
          <h2 id="aufbewahrung-titel" className="mb-2">
            Aufbewahrungsdauer für Chatverläufe
          </h2>
          <p className="mb-4 max-w-prose text-neutral-700">
            Nach Ablauf werden Verläufe automatisch und ohne Wiederherstellungsmöglichkeit
            gelöscht. Aufnahmen der Meetingassistenz werden unabhängig davon nach Freigabe des
            Protokolls gelöscht, längstens nach 30 Tagen.
          </p>
          <div className="max-w-md">
            <Field id="aufbewahrung" label="Verläufe löschen nach">
              {(props) => (
                <select
                  {...props}
                  className={selectClass}
                  value={settings.retention}
                  onChange={(event) => {
                    updateSettings({ retention: event.target.value as RetentionOption });
                    setStatus(
                      'Aufbewahrungsdauer gespeichert: ' +
                        (RETENTION_OPTIONS.find((o) => o.value === event.target.value)?.label ??
                          '') +
                        '.',
                    );
                  }}
                >
                  {RETENTION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
          {settings.retention === 'manuell' && (
            <StatusMessage tone="warning" className="mt-2 max-w-prose">
              <p>
                Ohne automatische Löschung bleiben Verläufe dauerhaft gespeichert. Prüfen Sie
                regelmäßig, ob personenbezogene Angaben darin enthalten sind, und löschen Sie
                nicht mehr benötigte Unterhaltungen selbst.
              </p>
            </StatusMessage>
          )}
        </section>

        <section aria-labelledby="abmelden-titel" className="rounded border border-neutral-200 bg-white p-5">
          <h2 id="abmelden-titel" className="mb-2">
            Abmelden
          </h2>
          <p className="mb-4 max-w-prose text-neutral-700">
            Die Abmeldung beendet die Sitzung an diesem Arbeitsplatz. Nicht gespeicherte Entwürfe
            im Eingabefeld gehen verloren.
          </p>
          <Button variant="dangerGhost" onClick={() => setLogoutOpen(true)}>
            <LogOut aria-hidden="true" className="h-5 w-5" />
            Von F13 abmelden
          </Button>
        </section>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Abmelden?"
        description="Die Sitzung wird beendet. Nicht abgesendete Eingaben gehen verloren."
        confirmLabel="Abmelden"
        onConfirm={() => {
          logout();
          navigate('/anmeldung', { replace: true });
        }}
      />

      <LiveRegion message={status} />
    </Page>
  );
}
