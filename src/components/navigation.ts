import {
  BookOpenText,
  CircleHelp,
  FolderOpen,
  Mic,
  MessagesSquare,
  ScrollText,
  ShieldCheck,
} from 'lucide-react';
import type { Role } from '../types';

export interface NavItem {
  to: string;
  label: string;
  /** Kurzbeschreibung für den zugänglichen Namen im eingeklappten Zustand */
  hint: string;
  icon: typeof MessagesSquare;
  adminOnly?: boolean;
  /** Positionsnummer für Alt+Zifferntaste */
  shortcut?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: '/chat',
    label: 'Chat',
    hint: 'Fragen stellen, Texte entwerfen',
    icon: MessagesSquare,
    shortcut: '1',
  },
  {
    to: '/meeting',
    label: 'Meetingassistenz',
    hint: 'Sitzungen aufnehmen und protokollieren',
    icon: Mic,
    shortcut: '2',
  },
  {
    to: '/protokolle',
    label: 'Protokolle',
    hint: 'Übersicht aller Transkripte und erzeugten Protokolle',
    icon: ScrollText,
    shortcut: '3',
  },
  {
    to: '/dokumente',
    label: 'Dokumente',
    hint: 'Ablage der hochgeladenen Dateien',
    icon: FolderOpen,
    shortcut: '4',
  },
  {
    to: '/hilfe',
    label: 'Hilfe & Support',
    hint: 'Häufige Fragen und Kontakt zum Support',
    icon: CircleHelp,
    shortcut: '5',
  },
  {
    to: '/tipps',
    label: 'Tipps & Tricks',
    hint: 'Anleitungen für die tägliche Arbeit',
    icon: BookOpenText,
    shortcut: '6',
  },
  {
    to: '/verwaltung',
    label: 'Verwaltung',
    hint: 'Nutzung, Modellfreigaben, Protokollvorlagen',
    icon: ShieldCheck,
    adminOnly: true,
  },
];

export function navItemsForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.adminOnly || role === 'Administration');
}
