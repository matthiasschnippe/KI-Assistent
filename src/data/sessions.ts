import type { ProtocolType } from '../types';

/* Abgelegte Sitzungen des Hauses. Sie speisen die Übersicht über Transkripte
   und Protokolle; die laufende Sitzung kommt aus dem Store hinzu. */

export type ProtocolStatus = 'entwurf' | 'gezeichnet' | 'e-akte';

export interface ArchivedProtocol {
  type: ProtocolType;
  generatedAt: string;
  status: ProtocolStatus;
  /** Aktenzeichen der Ablage, sobald übergeben */
  fileNumber?: string;
}

export interface ArchivedSession {
  id: string;
  title: string;
  date: string;
  startTime: string;
  /** Länge der Aufnahme in Sekunden */
  durationSeconds: number;
  speakers: number;
  entries: number;
  protocols: ArchivedProtocol[];
  /** Erste Zeilen des Transkripts für die Vorschau */
  transcriptExcerpt: { t: string; speaker: string; text: string }[];
}

export const PROTOCOL_STATUS_LABEL: Record<ProtocolStatus, string> = {
  entwurf: 'Entwurf',
  gezeichnet: 'Gezeichnet',
  'e-akte': 'In E-Akte',
};

export const ARCHIVED_SESSIONS: ArchivedSession[] = [
  {
    id: 'sit-13',
    title: '13. Sitzung des Lenkungskreises Digitalisierung und KI-Einsatz',
    date: '2026-06-16',
    startTime: '10:00',
    durationSeconds: 4_920,
    speakers: 5,
    entries: 87,
    protocols: [
      { type: 'ergebnis', generatedAt: '2026-06-16T12:40:00', status: 'e-akte', fileNumber: 'Z3-0244/26' },
      { type: 'beschluss', generatedAt: '2026-06-17T09:12:00', status: 'gezeichnet' },
    ],
    transcriptExcerpt: [
      { t: '00:00', speaker: 'Dr. Katrin Berger', text: 'Ich eröffne die 13. Sitzung des Lenkungskreises. Elf von dreizehn Mitgliedern sind anwesend.' },
      { t: '02:14', speaker: 'Ayşe Yıldırım', text: 'Zum Sachstand der Modellfreigaben: Die Prüfung des dritten Modells ist noch nicht abgeschlossen.' },
      { t: '05:41', speaker: 'Michael Wendt', text: 'Für die Schulungsreihe sind im laufenden Jahr 60.000 Euro verfügbar, das reicht für vier Durchgänge.' },
    ],
  },
  {
    id: 'sit-dsfa',
    title: 'Abstimmung Datenschutz-Folgenabschätzung mit dem Landesbeauftragten',
    date: '2026-07-02',
    startTime: '14:00',
    durationSeconds: 3_180,
    speakers: 4,
    entries: 63,
    protocols: [
      { type: 'verlauf', generatedAt: '2026-07-02T15:20:00', status: 'gezeichnet' },
    ],
    transcriptExcerpt: [
      { t: '00:00', speaker: 'Ayşe Yıldırım', text: 'Vielen Dank, dass Sie sich die Zeit nehmen. Es geht um den Einsatz in Entwurfs- und Vorarbeiten.' },
      { t: '01:52', speaker: 'Dr. Ulrike Sandmann', text: 'Entscheidend ist für uns, wie die Zweckbindung technisch abgesichert wird.' },
      { t: '04:30', speaker: 'Ayşe Yıldırım', text: 'Die Verarbeitung findet ausschließlich im Rechenzentrum des Landesbetriebs statt, ohne externe Weitergabe.' },
    ],
  },
  {
    id: 'sit-referatsrunde',
    title: 'Referatsleiterrunde Abteilung Z – August',
    date: '2026-08-11',
    startTime: '09:30',
    durationSeconds: 2_640,
    speakers: 6,
    entries: 51,
    protocols: [
      { type: 'ergebnis', generatedAt: '2026-08-11T10:35:00', status: 'entwurf' },
    ],
    transcriptExcerpt: [
      { t: '00:00', speaker: 'Dr. Katrin Berger', text: 'Guten Morgen. Wir haben heute drei Punkte, ich schlage vor, mit dem Stellenplan zu beginnen.' },
      { t: '03:08', speaker: 'Michael Wendt', text: 'Die Nachbesetzung im Referat Z 2 ist ausgeschrieben, die Frist läuft Ende August ab.' },
      { t: '07:22', speaker: 'Renate Kohlmeyer', text: 'Für die Registratur bräuchten wir eine Entscheidung zur Ablagestruktur der Protokolle.' },
    ],
  },
  {
    id: 'sit-anhoerung',
    title: 'Anhörung Personalvertretung zur Dienstvereinbarung KI',
    date: '2026-08-19',
    startTime: '13:00',
    durationSeconds: 5_460,
    speakers: 7,
    entries: 104,
    protocols: [
      { type: 'wort', generatedAt: '2026-08-19T15:10:00', status: 'gezeichnet' },
      { type: 'ergebnis', generatedAt: '2026-08-20T08:05:00', status: 'e-akte', fileNumber: 'Z4-0117/26' },
    ],
    transcriptExcerpt: [
      { t: '00:00', speaker: 'Dr. Katrin Berger', text: 'Wir sind hier, um die Stellungnahme der Personalvertretung Punkt für Punkt zu erörtern.' },
      { t: '02:45', speaker: 'Bernd Rasche', text: 'Unser Hauptanliegen bleibt die Frage der Auswertung von Nutzungszahlen.' },
      { t: '06:19', speaker: 'Dr. Katrin Berger', text: 'Eine Auswertung einzelner Beschäftigter ist ausgeschlossen, das steht so in Paragraf 4 des Entwurfs.' },
    ],
  },
];
