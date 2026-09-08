# F13 – Klick-Prototyp

KI-Assistent für Beschäftigte der öffentlichen Verwaltung. Läuft ausschließlich
im Browser gegen Mock-Daten: kein Backend, keine API-Aufrufe, kein
Netzwerkzugriff.

## Starten

```bash
npm install && npm run dev
```

Die Anwendung öffnet unter http://localhost:5173. Angemeldet wird sich mit einer
dienstlichen E-Mail-Adresse und einem beliebigen Passwort; geprüft wird nichts.
Adressen, die mit `admin` beginnen (etwa `admin.andrea.dahlke@mvcr.landesverwaltung.de`),
erhalten die Rolle Administration und damit den Bereich „Verwaltung“.
Voraussetzung ist Node.js 18 oder neuer.

Fachlicher Rahmen der Beispieldaten ist das (fiktive) Ministerium für Vibe
Coding und Reaktorsicherheit als oberste Landesbehörde.

## Was funktioniert

- **Chat** – simuliertes Streaming zeichenweise, unterbrechbar; Modellauswahl als
  Radiogruppe (GPT-OSS 120B / Gemma 4, beide on-premise); Anhänge per
  Büroklammer-Menü, Drag & Drop und aus der Dokumentenablage; Verlauf in der
  linken Spalte, nach Datum gruppiert, mit Suche, Umbenennen, Löschen und
  Ein-/Ausblenden; Kopieren, Neu generieren und Bewertung je Antwort.
- **Meetingassistenz** – vier Phasen; fortlaufend wachsendes Transkript mit
  Zeitmarken; Sprecherzuordnung über Chatdialog *und* direkt am Transkript; alle
  vier Protokolltypen aus demselben Transkript erzeugbar und wechselbar;
  abschnittsweiser Rich-Text-Editor im Protokollformat des Hauses (Kopfbogen mit
  Aktenzeichen, Verteiler) mit einblendbarem Transkript, Sprung zur Transkript-
  stelle und Rückkehr zur KI-Fassung; Export als Word (echtes `.docx`), als PDF über den Druckdialog
  und simulierte Übergabe in die E-Akte.
- **Dokumente** – sortierbare Tabelle mit `aria-sort`, Suche, Filter nach Typ und
  Sammlung, Vorschau, Verwendung im Chat, Umbenennen, Löschen mit Rückfrage,
  Upload per Schaltfläche und Drag & Drop mit Fortschritt und Fehlerbehandlung.
- **Hilfe & Support** – Kontaktblock (Anwendungssupport, Servicedesk, Datenschutz,
  Barrierefreiheit) und 19 ausformulierte Fragen in fünf Bereichen, Accordion,
  Suche über alle Fragen, direkt verlinkbare Einzelfragen (`/hilfe?frage=<id>`).
- **Tipps & Tricks** – sieben Artikel mit Detailansicht, Lesedauer, Kategorie,
  Gegenüberstellung schwacher und starker Prompts und Verweisen auf verwandte
  Artikel.
- **Login, Einstellungen, Verwaltung** – Standardmodell, Standard-Protokolltyp,
  Aufbewahrungsdauer; für die Rolle Administration zusätzlich Nutzungszahlen,
  Modellfreigaben und Protokollvorlagen.

## Tastatur

Alles ist ohne Maus bedienbar. Übersicht über die Schaltfläche
„Tastaturkürzel“ im Kopfbereich oder mit `Alt + 0`; `Alt + 1` bis `Alt + 5`
springen in die Module, `Alt + M` klappt die Navigation ein und aus. Im Chat
sendet die Eingabetaste, `Umschalt + Eingabetaste` erzeugt einen Zeilenumbruch,
`Esc` bricht eine laufende Antwort ab.

## Aufbau

```
src/
  components/   Layout, Navigation, Dialoge, gemeinsame Bausteine
  modules/      chat, meeting, documents, faq, tips, auth, settings, admin, legal
  data/         Mock-Daten und Textinhalte
  hooks/        Seitentitel, Fokus bei Routenwechsel
  lib/          Formatierung, Word- und PDF-Export
  store/        Zustand (zustand)
  types/        Typdefinitionen
```

Entscheidungen zu mehrdeutigen Anforderungen stehen in
[ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md).

## Grenzen des Prototyps

Keine Mobilansicht, kein dunkles Farbschema, keine Persistenz über einen
Seiten-Neuladen hinaus. Die PDF-Ausgabe entsteht im Druckdialog des Browsers und
ist deshalb nicht getaggt. Alle Namen, Aktenzeichen und Vorgänge sind erfunden.
