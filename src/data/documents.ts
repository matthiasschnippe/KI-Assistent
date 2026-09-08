import type { DocumentCollection, StoredDocument } from '../types';

export const COLLECTIONS: DocumentCollection[] = [
  { id: 'allgemein', name: 'Ohne Sammlung', description: 'Dokumente, die keiner Sammlung zugeordnet sind' },
  { id: 'haushalt-2027', name: 'Haushalt 2027', description: 'Unterlagen zur Aufstellung des Einzelplans 14' },
  { id: 'lenkungskreis', name: 'Lenkungskreis Digitalisierung', description: 'Sitzungsunterlagen des Lenkungskreises' },
  { id: 'personal', name: 'Personal und Beteiligung', description: 'Vorlagen und Stellungnahmen zur Personalvertretung' },
  { id: 'buergeranfragen', name: 'Bürger- und Landtagsanfragen', description: 'Eingänge und Antwortentwürfe' },
];

export const DOCUMENTS: StoredDocument[] = [
  {
    id: 'doc-1',
    name: 'Zwischenbericht_F13_Rollout_nachgeordneter_Bereich.pdf',
    kind: 'pdf',
    size: 486_312,
    uploadedAt: '2026-09-03T08:14:00',
    lastUsedAt: '2026-09-08T07:52:00',
    collectionId: 'lenkungskreis',
    pages: 14,
    preview:
      'Zwischenbericht des Referats Z 3, Az. Z3-0271/26. Sachstand der Einführung von F13 im nachgeordneten Bereich. Von den 18 geplanten Ausbaustufen sind sieben abgeschlossen, fünf befinden sich in der technischen Umsetzung, sechs sind zurückgestellt. Die Zurückstellung betrifft überwiegend Dienststellen, deren Fachverfahren beim Landesbetrieb IT betrieben werden und für die dessen Freigabe erforderlich ist.',
  },
  {
    id: 'doc-2',
    name: 'Haushaltsentwurf_2027_Kapitel_1403.xlsx',
    kind: 'xlsx',
    size: 1_284_940,
    uploadedAt: '2026-08-28T15:33:00',
    lastUsedAt: '2026-09-05T11:20:00',
    collectionId: 'haushalt-2027',
    preview:
      'Tabellenblatt „Kap. 1403“: Ansätze 2027 gegenüber 2026. Ausgaben von 14.820.000 EUR (2026: 13.640.000 EUR). Größte Steigerung in Titel 518 01 durch den Betrieb der KI-Infrastruktur beim Landesbetrieb IT. Weitere Blätter: Verpflichtungsermächtigungen, Stellenplan, Fortbildung.',
  },
  {
    id: 'doc-3',
    name: 'Buergeranfrage_Messwerte_Zwischenlager.pdf',
    kind: 'pdf',
    size: 132_004,
    uploadedAt: '2026-09-04T09:41:00',
    lastUsedAt: '2026-09-07T14:07:00',
    collectionId: 'buergeranfragen',
    pages: 3,
    preview:
      'Eingang vom 04.09.2026, Az. R4-1208/26. Anfrage zur Umgebungsüberwachung am Standortzwischenlager: Stand der Messungen, Veröffentlichung der Ergebnisse und Frage nach zusätzlichen Messstellen im Umkreis von fünf Kilometern. Verweis auf den Jahresbericht des Landesamts für Strahlenschutz.',
  },
  {
    id: 'doc-4',
    name: 'Stellungnahme_Personalvertretung_Dienstvereinbarung_KI.docx',
    kind: 'docx',
    size: 74_820,
    uploadedAt: '2026-08-25T13:02:00',
    lastUsedAt: null,
    collectionId: 'personal',
    preview:
      'Stellungnahme der Personalvertretung vom 19.08.2026 zum Entwurf der Dienstvereinbarung über den Einsatz KI-gestützter Assistenzsysteme. Sieben Punkte, darunter die Auswertung von Nutzungszahlen, die Rufbereitschaft im Referat Z 1 und die Anpassung der Aufgabenzuschnitte in der Fachaufsicht.',
  },
  {
    id: 'doc-5',
    name: 'Niederschrift_Lenkungskreis_2026-06-16.pdf',
    kind: 'pdf',
    size: 298_115,
    uploadedAt: '2026-06-24T10:25:00',
    lastUsedAt: '2026-09-01T16:44:00',
    collectionId: 'lenkungskreis',
    pages: 9,
    preview:
      'Ergebnisniederschrift der 13. Sitzung des Lenkungskreises Digitalisierung und KI-Einsatz am 16.06.2026. TOP 3: Vertagung der Entscheidung über weitere Modellfreigaben. TOP 5: Beschluss über eine Schulungsreihe für Führungskräfte, einstimmig. TOP 6: Kenntnisnahme des Berichts zur Datenschutz-Folgenabschätzung.',
  },
  {
    id: 'doc-6',
    name: 'Datenschutz-Folgenabschaetzung_F13_Fassung_2026.pdf',
    kind: 'pdf',
    size: 3_412_780,
    uploadedAt: '2026-07-09T11:10:00',
    lastUsedAt: '2026-09-07T14:10:00',
    collectionId: 'allgemein',
    pages: 62,
    preview:
      'Datenschutz-Folgenabschätzung für den Einsatz von F13 in Entwurfs- und Vorarbeiten, Stand Juli 2026. Bewertet werden Verarbeitungszwecke, Rechtsgrundlagen, Risiken für Betroffene und Abhilfemaßnahmen. Nicht erfasst ist der Einsatz in aufsichtlichen Verfahren; hierfür ist eine ergänzende Prüfung vorgesehen.',
  },
  {
    id: 'doc-7',
    name: 'Eckdaten_Einzelplan_14_Kapitel_1403.txt',
    kind: 'txt',
    size: 8_940,
    uploadedAt: '2026-09-01T07:55:00',
    lastUsedAt: '2026-09-05T09:12:00',
    collectionId: 'haushalt-2027',
    preview:
      'Ausgaben 2027: 14.820.000 EUR, davon Personalausgaben 9.240.000 EUR. Steigerung gegenüber 2026: 1.180.000 EUR, davon 620.000 EUR Tarif und 480.000 EUR Betrieb KI-Infrastruktur. Verpflichtungsermächtigungen 6.800.000 EUR. Titel 525 01 Fortbildung: 240.000 EUR, unverändert seit 2025. Deckungslücke im Einzelplan: 5.450.000 EUR.',
  },
  {
    id: 'doc-8',
    name: 'Dienstanweisung_KI-Nutzung_Fassung_2026.pdf',
    kind: 'pdf',
    size: 214_660,
    uploadedAt: '2026-05-14T09:00:00',
    lastUsedAt: '2026-09-03T08:31:00',
    collectionId: 'allgemein',
    pages: 11,
    preview:
      'Dienstanweisung über den Einsatz KI-gestützter Assistenzsysteme im Geschäftsbereich, in Kraft seit 01.06.2026. Regelt zulässige Anwendungsfälle, das Verbot der Eingabe besonderer Kategorien personenbezogener Daten nach Art. 9 DSGVO, die Dokumentationspflicht bei KI-Unterstützung im Entwurf sowie die Beteiligung der Personalvertretung.',
  },
  {
    id: 'doc-9',
    name: 'Teilnehmendenliste_Lenkungskreis_September.docx',
    kind: 'docx',
    size: 31_204,
    uploadedAt: '2026-09-05T16:48:00',
    lastUsedAt: null,
    collectionId: 'lenkungskreis',
    preview:
      'Anwesenheitsliste zur 14. Sitzung des Lenkungskreises am 08.09.2026: Dr. Katrin Berger (Abteilungsleitung Z, Vorsitz), Michael Wendt (Referat Z 2), Ayşe Yıldırım (Referat Z 3), Hans-Peter Lorenz (Referat R 4), Renate Kohlmeyer (Schriftführung), zwei Gäste des Landesbetriebs IT ohne Stimmrecht.',
  },
  {
    id: 'doc-10',
    name: 'Kleine_Anfrage_KI-Einsatz_Fachaufsicht.docx',
    kind: 'docx',
    size: 512_318,
    uploadedAt: '2026-09-03T14:16:00',
    lastUsedAt: '2026-09-06T10:02:00',
    collectionId: 'buergeranfragen',
    preview:
      'Kleine Anfrage aus dem Landtag, zugeleitet über den Leitungsstab am 03.09.2026. Sechs Fragen zum Einsatz KI-gestützter Systeme in der Fachaufsicht: Zahl der Zugänge, Verarbeitungsort der Modelle, Einsatz in aufsichtlichen Verfahren, Schulungsstand, Kosten und Beteiligung der Personalvertretung. Frist für die Zuarbeit an das Justiziariat: 19.09.2026.',
  },
];

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export const ALLOWED_KINDS = ['pdf', 'docx', 'txt', 'xlsx'] as const;
