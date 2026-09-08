import { Page } from '../../components/Page';
import { StatusMessage } from '../../components/ui';


export function DatenschutzView() {
  return (
    <Page
      title="Datenschutz"
      intro="Informationen zur Verarbeitung personenbezogener Daten bei der Nutzung von F13."
    >
      <div className="max-w-prose space-y-4">
        <StatusMessage tone="info">
          <p>
            Beispieltext eines Prototyps. Die verbindliche Datenschutzinformation stellt Ihre
            Behörde bereit.
          </p>
        </StatusMessage>

        <section aria-labelledby="ds-zweck">
          <h2 id="ds-zweck" className="mb-2">
            Zweck der Verarbeitung
          </h2>
          <p>
            F13 unterstützt Beschäftigte bei Entwurfs- und Vorarbeiten: Zusammenfassen von
            Unterlagen, Formulieren von Entwürfen, Transkribieren und Protokollieren von Sitzungen.
            Verarbeitet werden die von Ihnen eingegebenen Texte, die angehängten Dokumente sowie
            Aufzeichnungen, die Sie selbst starten.
          </p>
        </section>

        <section aria-labelledby="ds-ort">
          <h2 id="ds-ort" className="mb-2">
            Ort der Verarbeitung
          </h2>
          <p>
            Die Sprachmodelle werden auf Servern des Landesbetriebs für Informationstechnik in
            Rechenzentren in Deutschland betrieben. Eine Übermittlung an Anbieter außerhalb der
            Verwaltung findet nicht statt. Die Eingaben werden nicht zum Training der Modelle
            verwendet.
          </p>
        </section>

        <section aria-labelledby="ds-dauer">
          <h2 id="ds-dauer" className="mb-2">
            Speicherdauer
          </h2>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              Chatverläufe: nach der in den Einstellungen gewählten Dauer, voreingestellt 30 Tage.
            </li>
            <li>
              Aufzeichnungen und Transkripte: nach Freigabe des Protokolls, längstens nach 30
              Tagen.
            </li>
            <li>Hochgeladene Dokumente: bis zur Löschung durch Sie.</li>
            <li>
              Protokolldaten des Betriebs (Anmeldezeitpunkt, technische Fehler): 90 Tage.
            </li>
          </ul>
        </section>

        <section aria-labelledby="ds-rechte">
          <h2 id="ds-rechte" className="mb-2">
            Ihre Rechte
          </h2>
          <p>
            Ihnen stehen die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der
            Verarbeitung und Beschwerde bei der Aufsichtsbehörde zu. Wenden Sie sich dazu an die
            behördliche Datenschutzbeauftragte.
          </p>
        </section>

        <section aria-labelledby="ds-beteiligung">
          <h2 id="ds-beteiligung" className="mb-2">
            Beteiligung der Personalvertretung
          </h2>
          <p>
            Der Einsatz von F13 beruht auf einer Dienstvereinbarung. Eine Auswertung der Nutzung
            einzelner Beschäftigter ist ausgeschlossen; Nutzungszahlen werden ausschließlich
            aggregiert je Organisationseinheit ausgewertet.
          </p>
        </section>
      </div>
    </Page>
  );
}

export function BarrierefreiheitView() {
  return (
    <Page
      title="Erklärung zur Barrierefreiheit"
      intro="Stand der Barrierefreiheit von F13 und Wege zur Meldung von Hindernissen."
    >
      <div className="max-w-prose space-y-4">
        <StatusMessage tone="info">
          <p>
            Beispieltext eines Prototyps. Eine verbindliche Erklärung setzt einen abgeschlossenen
            BITV-Test voraus.
          </p>
        </StatusMessage>

        <section aria-labelledby="bf-stand">
          <h2 id="bf-stand" className="mb-2">
            Angestrebter Stand
          </h2>
          <p>
            F13 wird nach der Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) und damit
            nach WCAG 2.1 Stufe AA entwickelt. Die Anwendung ist vollständig ohne Maus bedienbar,
            der Fokus ist durchgängig sichtbar, und dynamische Inhalte wie der Antwortstream und
            die Live-Transkription werden über gebündelte Statusmeldungen angesagt.
          </p>
        </section>

        <section aria-labelledby="bf-einschraenkungen">
          <h2 id="bf-einschraenkungen" className="mb-2">
            Bekannte Einschränkungen im Prototyp
          </h2>
          <ul className="ml-6 list-disc space-y-1">
            <li>
              Der Rich-Text-Editor für Protokolle unterstützt Fett, Kursiv, Überschriften, Listen
              und Tabellen. Komplexe Tabellenoperationen wie das Verbinden von Zellen fehlen.
            </li>
            <li>
              Die PDF-Ausgabe erfolgt über den Druckdialog des Browsers. Eine getaggte, vollständig
              barrierefreie PDF-Datei entsteht dabei nicht.
            </li>
            <li>Es sind keine Mobilansicht und kein dunkles Farbschema umgesetzt.</li>
          </ul>
        </section>

        <section aria-labelledby="bf-meldung">
          <h2 id="bf-meldung" className="mb-2">
            Hindernisse melden
          </h2>
          <p>
            Melden Sie Hindernisse an die Administration Ihres Hauses. Hilfreich sind: betroffene
            Ansicht und Bedienelement, erwartetes und tatsächliches Verhalten, verwendetes
            Hilfsmittel mit Version sowie Browser und Betriebssystem. Solche Meldungen werden
            vorrangig behandelt.
          </p>
        </section>

        <section aria-labelledby="bf-durchsetzung">
          <h2 id="bf-durchsetzung" className="mb-2">
            Durchsetzungsverfahren
          </h2>
          <p>
            Wenn Ihre Meldung nicht zufriedenstellend bearbeitet wird, können Sie die
            Durchsetzungsstelle für Barrierefreiheit Ihres Landes einschalten.
          </p>
        </section>
      </div>
    </Page>
  );
}
