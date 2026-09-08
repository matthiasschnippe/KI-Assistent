import type { AttachmentKind } from '../types';

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' Byte';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0).replace('.', ',') + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1).replace('.', ',') + ' MB';
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return (
    d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ', ' +
    d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) +
    ' Uhr'
  );
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (h > 0 ? pad(h) + ':' : '') + pad(m) + ':' + pad(s);
}

/** Gesprochene Fassung der Zeitanzeige für die Statusansage. */
export function spokenDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const parts: string[] = [];
  if (m > 0) parts.push(m + (m === 1 ? ' Minute' : ' Minuten'));
  parts.push(s + (s === 1 ? ' Sekunde' : ' Sekunden'));
  return parts.join(' ');
}

export type DateGroup = 'Heute' | 'Diese Woche' | 'Älter';

export function dateGroup(iso: string, now = new Date()): DateGroup {
  const d = new Date(iso);
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) return 'Heute';
  const diffDays = (now.getTime() - d.getTime()) / 86_400_000;
  if (diffDays < 7) return 'Diese Woche';
  return 'Älter';
}

export const DATE_GROUP_ORDER: DateGroup[] = ['Heute', 'Diese Woche', 'Älter'];

export function kindFromName(name: string): AttachmentKind | null {
  const ext = name.toLowerCase().split('.').pop() ?? '';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx') return 'docx';
  if (ext === 'txt') return 'txt';
  if (ext === 'xlsx') return 'xlsx';
  return null;
}

export const KIND_LABEL: Record<AttachmentKind, string> = {
  pdf: 'PDF-Dokument',
  docx: 'Word-Dokument',
  txt: 'Textdatei',
  xlsx: 'Tabelle',
};

export function pluralize(count: number, one: string, many: string): string {
  return count + ' ' + (count === 1 ? one : many);
}
