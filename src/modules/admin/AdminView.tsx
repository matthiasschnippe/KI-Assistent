import * as Tabs from '@radix-ui/react-tabs';
import { Navigate } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Badge, StatusMessage, cx } from '../../components/ui';
import { MODELS, PROTOCOL_TYPES } from '../../data/models';
import { useAppStore } from '../../store/useAppStore';

const USAGE = [
  { unit: 'Abteilung Z – Zentrale Angelegenheiten', users: 34, requests: 1284, meetings: 11 },
  { unit: 'Referat Z 2 – Haushalt', users: 19, requests: 962, meetings: 4 },
  { unit: 'Leitungsstab', users: 27, requests: 1531, meetings: 18 },
  { unit: 'Abteilung R – Reaktorsicherheit', users: 22, requests: 704, meetings: 2 },
  { unit: 'Referat Z 4 – Personal', users: 12, requests: 213, meetings: 6 },
];

export function AdminView() {
  const user = useAppStore((s) => s.user);
  if (!user) return null;
  if (user.role !== 'Administration') return <Navigate to="/chat" replace />;

  const triggerClass = cx(
    'flex min-h-[44px] items-center gap-2 border-b-4 px-4 py-2 text-base',
    'data-[state=active]:border-b-primary-600 data-[state=active]:font-bold data-[state=active]:text-primary-700',
    'data-[state=inactive]:border-b-transparent data-[state=inactive]:text-neutral-800 hover:bg-neutral-100',
  );

  return (
    <Page
      title="Verwaltung"
      intro="Nutzungszahlen, Modellfreigaben und Protokollvorlagen. Nur für die Rolle Administration sichtbar."
    >
      <Tabs.Root defaultValue="nutzung" className="max-w-5xl">
        <Tabs.List
          aria-label="Verwaltungsbereiche"
          className="mb-6 flex flex-wrap gap-1 border-b border-neutral-300"
        >
          <Tabs.Trigger value="nutzung" className={triggerClass}>
            Nutzung
          </Tabs.Trigger>
          <Tabs.Trigger value="modelle" className={triggerClass}>
            Modellfreigaben
          </Tabs.Trigger>
          <Tabs.Trigger value="vorlagen" className={triggerClass}>
            Protokollvorlagen
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="nutzung">
          <h2 className="mb-2">Nutzung im laufenden Quartal</h2>
          <p className="mb-4 max-w-prose text-neutral-700">
            Aggregierte Zahlen je Organisationseinheit. Inhalte von Unterhaltungen, Dokumenten und
            Aufnahmen sind für die Administration nicht einsehbar.
          </p>
          <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
            <table className="w-full border-collapse">
              <caption className="sr-only">
                Nutzungszahlen je Organisationseinheit im laufenden Quartal
              </caption>
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-50 text-left">
                  <th scope="col" className="px-3 py-2">
                    Organisationseinheit
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Freigeschaltete Personen
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Anfragen
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Protokollierte Sitzungen
                  </th>
                </tr>
              </thead>
              <tbody>
                {USAGE.map((row) => (
                  <tr key={row.unit} className="border-b border-neutral-200 last:border-b-0">
                    <th scope="row" className="px-3 py-2 text-left font-semibold">
                      {row.unit}
                    </th>
                    <td className="px-3 py-2">{row.users}</td>
                    <td className="px-3 py-2">{row.requests}</td>
                    <td className="px-3 py-2">{row.meetings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <StatusMessage tone="info" className="mt-4 max-w-prose">
            <p>
              Die Auswertung ist auf Organisationseinheiten begrenzt. Eine Auswertung einzelner
              Beschäftigter ist nach der Dienstvereinbarung ausgeschlossen und technisch nicht
              vorgesehen.
            </p>
          </StatusMessage>
        </Tabs.Content>

        <Tabs.Content value="modelle">
          <h2 className="mb-4">Modellfreigaben</h2>
          <ul className="space-y-4">
            {MODELS.map((model) => (
              <li key={model.id} className="rounded border border-neutral-200 bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-base">{model.name}</h3>
                  <Badge tone="success">freigegeben</Badge>
                  <Badge tone="primary">{model.hostingBadge}</Badge>
                </div>
                <p className="mb-1 text-sm text-neutral-800">{model.detail}</p>
                <p className="text-sm text-neutral-700">{model.hosting}</p>
              </li>
            ))}
          </ul>
          <StatusMessage tone="warning" className="mt-4 max-w-prose">
            <p>
              Die Freigabe weiterer Modelle setzt eine Datenschutz-Folgenabschätzung und die
              Beteiligung der Personalvertretung voraus. Im Prototyp sind Freigaben nicht
              änderbar.
            </p>
          </StatusMessage>
        </Tabs.Content>

        <Tabs.Content value="vorlagen">
          <h2 className="mb-4">Protokollvorlagen</h2>
          <ul className="space-y-4">
            {PROTOCOL_TYPES.map((type) => (
              <li key={type.id} className="rounded border border-neutral-200 bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-base">{type.name}</h3>
                  <Badge tone="success">aktiv</Badge>
                </div>
                <p className="text-sm text-neutral-800">{type.description}</p>
              </li>
            ))}
          </ul>
          <StatusMessage tone="info" className="mt-4 max-w-prose">
            <p>
              Vorlagen bestimmen Gliederung und Formulierungsmuster der erzeugten Protokolle.
              Anpassungen erfolgen im Betrieb über die zentrale Vorlagenverwaltung; im Prototyp
              sind sie nicht editierbar.
            </p>
          </StatusMessage>
        </Tabs.Content>
      </Tabs.Root>
    </Page>
  );
}
