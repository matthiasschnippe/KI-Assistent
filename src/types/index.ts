/* Zentrale Typdefinitionen des F13-Prototyps. */

export type ModelId = 'gpt-oss-120b' | 'gemma-4';

export interface AiModel {
  id: ModelId;
  name: string;
  /** Kurze Eignungsbeschreibung fuer die Auswahl */
  suitability: string;
  /** Ausfuehrlichere Erlaeuterung, nur in der Verwaltung sichtbar */
  detail: string;
  hosting: string;
  hostingBadge: string;
  /** Wissensstand des Modells */
  knowledgeCutoff: string;
  /** Millisekunden pro Zeichen im simulierten Streaming */
  msPerChar: number;
}

export type Role = 'Nutzer' | 'Administration';

export interface User {
  id: string;
  initials: string;
  fullName: string;
  orgUnit: string;
  authority: string;
  role: Role;
  email: string;
}

export type AttachmentKind = 'pdf' | 'docx' | 'txt' | 'xlsx';

export interface StoredDocument {
  id: string;
  name: string;
  kind: AttachmentKind;
  /** Groesse in Byte */
  size: number;
  uploadedAt: string;
  lastUsedAt: string | null;
  collectionId: string;
  /** Vorschautext (Mock) */
  preview: string;
  pages?: number;
}

export interface DocumentCollection {
  id: string;
  name: string;
  description: string;
}

export interface Attachment {
  id: string;
  documentId?: string;
  name: string;
  kind: AttachmentKind;
  size: number;
}

export type Rating = 'up' | 'down' | null;

export interface ChatMessage {
  id: string;
  author: 'user' | 'assistant';
  text: string;
  createdAt: string;
  modelId?: ModelId;
  attachments?: Attachment[];
  rating?: Rating;
  /** true, solange der Text simuliert gestreamt wird */
  streaming?: boolean;
  /** true, wenn der Stream durch die Nutzerin abgebrochen wurde */
  aborted?: boolean;
  paragraphs?: number;
}

export interface Conversation {
  id: string;
  title: string;
  /** ISO-Datum der letzten Aktivitaet */
  updatedAt: string;
  modelId: ModelId;
  messages: ChatMessage[];
}

/* ---------- Meetingassistenz ---------- */

export type SpeakerKey = 'A' | 'B' | 'C' | 'D';

export interface Speaker {
  key: SpeakerKey;
  /** Zugeordneter Klarname, null solange unbekannt */
  name: string | null;
  functionLabel: string | null;
  contributions: number;
}

export interface TranscriptEntry {
  id: string;
  /** Sekunden seit Aufnahmebeginn */
  t: number;
  speaker: SpeakerKey;
  text: string;
  /** Zugehoeriger Tagesordnungspunkt */
  agendaItem: number;
}

export type ProtocolType = 'ergebnis' | 'verlauf' | 'beschluss' | 'wort';

export interface ProtocolTypeInfo {
  id: ProtocolType;
  name: string;
  short: string;
  description: string;
}

export interface ProtocolSection {
  id: string;
  heading: string;
  /** HTML-Inhalt des Abschnitts (Rich-Text) */
  html: string;
  /** Transkript-Eintrag, zu dem dieser Abschnitt gehoert */
  sourceEntryId?: string;
  /** true, sobald die Nutzerin den Abschnitt geaendert hat */
  edited?: boolean;
  /** KI-Fassung zum Zuruecksetzen */
  originalHtml?: string;
}

export interface Protocol {
  type: ProtocolType;
  generatedAt: string;
  sections: ProtocolSection[];
}

export type MeetingPhase = 'vorbereitung' | 'aufnahme' | 'nachbearbeitung' | 'export';

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

export type AudioSource = 'mikrofon' | 'systemton' | 'datei';

export interface MeetingMeta {
  title: string;
  date: string;
  startTime: string;
  location: string;
  participants: string[];
  audioSource: AudioSource;
  /** Ausgewaehltes Aufnahmegeraet, nur bei audioSource "mikrofon" relevant */
  microphone: string;
  fileName: string | null;
  protocolType: ProtocolType;
}

export interface SpeakerDialogMessage {
  id: string;
  author: 'assistant' | 'user';
  text: string;
}

/* ---------- FAQ / Tipps ---------- */

export type FaqCategory =
  | 'Erste Schritte'
  | 'Datenschutz & Sicherheit'
  | 'Chat'
  | 'Meetingassistenz'
  | 'Technische Probleme';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  /** Antwort als Absaetze; Listen werden mit "- " eingeleitet */
  answer: string[];
}

export interface TipArticle {
  id: string;
  title: string;
  category: string;
  teaser: string;
  readingMinutes: number;
  related: string[];
  body: TipBlock[];
}

export type TipBlock =
  | { kind: 'para'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'ordered'; items: string[] }
  | { kind: 'compare'; weak: string; strong: string; note?: string }
  | { kind: 'callout'; tone: 'info' | 'warning' | 'success'; title: string; text: string };

/* ---------- Einstellungen ---------- */

export type RetentionOption = '7' | '30' | '90' | '365' | 'manuell';

export interface Settings {
  defaultModel: ModelId;
  defaultProtocolType: ProtocolType;
  retention: RetentionOption;
}

/* ---------- E-Akte ---------- */

export interface EAktenTransferResult {
  target: string;
  fileNumber: string;
  transferredAt: string;
  receipt: string;
}
