import { Modal } from './Dialog';

const GROUPS: { heading: string; rows: [string, string][] }[] = [
  {
    heading: 'Allgemein',
    rows: [
      ['Tabulator / Umschalt + Tabulator', 'Vorwärts und rückwärts durch alle Bedienelemente'],
      ['Eingabetaste oder Leertaste', 'Schaltflächen und Verweise auslösen'],
      ['Esc', 'Dialoge und Menüs schließen, Fokus kehrt zum auslösenden Element zurück'],
      ['Pfeiltasten', 'In Menüs, Radiogruppen, Registern und Aufklapplisten bewegen'],
      ['Alt + 1 bis Alt + 5', 'Direkt zu Chat, Meetingassistenz, Dokumente, Hilfe & Support, Tipps & Tricks'],
      ['Alt + 0', 'Diese Übersicht öffnen'],
      ['Alt + M', 'Linke Navigation ein- oder ausklappen'],
    ],
  },
  {
    heading: 'Chat',
    rows: [
      ['Eingabetaste', 'Nachricht absenden'],
      ['Umschalt + Eingabetaste', 'Zeilenumbruch im Eingabefeld'],
      ['Esc im Eingabefeld', 'Laufende Antwort abbrechen'],
      ['Pfeiltasten in der Modellauswahl', 'Zwischen den Modellen wechseln'],
    ],
  },
  {
    heading: 'Meetingassistenz',
    rows: [
      ['Pfeiltasten auf den Phasen', 'Zwischen Vorbereitung, Aufnahme, Nachbearbeitung, Export wechseln'],
      ['Eingabetaste auf einem Sprechernamen', 'Zuordnung direkt im Transkript ändern'],
      ['Strg + B / Strg + I', 'Im Protokolleditor fett bzw. kursiv'],
    ],
  },
  {
    heading: 'Dokumente',
    rows: [
      ['Eingabetaste auf einer Spaltenüberschrift', 'Nach dieser Spalte sortieren'],
      ['Menütaste oder Eingabetaste auf „Aktionen“', 'Aktionen zum Dokument öffnen'],
    ],
  },
];

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Tastaturkürzel"
      description="F13 ist vollständig ohne Maus bedienbar. Diese Übersicht ist über Alt + 0 jederzeit erreichbar."
      width="lg"
    >
      <div className="space-y-6">
        {GROUPS.map((group) => (
          <section key={group.heading}>
            <h3 className="mb-2">{group.heading}</h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-[42%] border border-neutral-300 bg-neutral-100 px-3 py-2 text-left"
                  >
                    Tastenfolge
                  </th>
                  <th
                    scope="col"
                    className="border border-neutral-300 bg-neutral-100 px-3 py-2 text-left"
                  >
                    Wirkung
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map(([keys, effect]) => (
                  <tr key={keys}>
                    <td className="border border-neutral-300 px-3 py-2 font-semibold">
                      <kbd className="font-sans">{keys}</kbd>
                    </td>
                    <td className="border border-neutral-300 px-3 py-2">{effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </Modal>
  );
}
