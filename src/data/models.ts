import type { AiModel, ModelId, ProtocolTypeInfo } from '../types';

export const MODELS: AiModel[] = [
  {
    id: 'gpt-oss-120b',
    name: 'GPT-OSS 120B',
    suitability: 'Gründliche Analyse, langsamer',
    detail:
      'Großes Modell für längere Vermerke, Rechtsauslegung, Argumentationsketten und mehrseitige Zusammenfassungen. Antwortet erkennbar langsamer.',
    hosting: 'Betrieb im Rechenzentrum des Landesbetriebs für Informationstechnik',
    hostingBadge: 'On-Premise',
    dataNotice:
      'Verarbeitung ausschließlich auf Servern im Landesverwaltungsnetz. Keine Weitergabe an Dritte, keine Nutzung der Eingaben zum Training.',
    msPerChar: 11,
  },
  {
    id: 'gemma-4',
    name: 'Gemma 4',
    suitability: 'Schnelle Entwürfe',
    detail:
      'Kompaktes Modell für kurze Texte: Antwortentwürfe, Umformulierungen, Stichwortlisten, Betreffzeilen. Antwortet spürbar schneller, bei komplexen Fragen weniger belastbar.',
    hosting: 'Betrieb im Rechenzentrum des Landesbetriebs für Informationstechnik',
    hostingBadge: 'On-Premise',
    dataNotice:
      'Verarbeitung ausschließlich auf Servern im Landesverwaltungsnetz. Keine Weitergabe an Dritte, keine Nutzung der Eingaben zum Training.',
    msPerChar: 5,
  },
];

export function getModel(id: ModelId): AiModel {
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}

export const PROTOCOL_TYPES: ProtocolTypeInfo[] = [
  {
    id: 'ergebnis',
    name: 'Ergebnisprotokoll',
    short: 'Beschlüsse, Ergebnisse, To-dos',
    description:
      'Hält je Tagesordnungspunkt fest, was entschieden wurde. Aufgaben werden mit Verantwortlichen und Fristen tabellarisch geführt. Der Diskussionsverlauf wird nicht wiedergegeben.',
  },
  {
    id: 'verlauf',
    name: 'Verlaufsprotokoll',
    short: 'Chronologischer Ablauf der Diskussion',
    description:
      'Gibt den Gang der Beratung in indirekter Rede wieder: wer was eingebracht hat, welche Einwände kamen, wie die Entscheidung zustande kam. Umfangreicher als das Ergebnisprotokoll.',
  },
  {
    id: 'beschluss',
    name: 'Beschlussprotokoll',
    short: 'Nur formale Beschlüsse mit Abstimmung',
    description:
      'Enthält ausschließlich die gefassten Beschlüsse im Wortlaut mit Abstimmungsergebnis (Ja / Nein / Enthaltung). Übliche Form für Gremien mit Beschlusskompetenz.',
  },
  {
    id: 'wort',
    name: 'Wortprotokoll',
    short: 'Wortwörtliche Mitschrift',
    description:
      'Vollständige, sprecherbezogene Mitschrift aller Redebeiträge mit Zeitstempel. Nur dort sinnvoll, wo der genaue Wortlaut rechtlich erheblich ist.',
  },
];

export function getProtocolTypeInfo(id: string): ProtocolTypeInfo {
  return PROTOCOL_TYPES.find((p) => p.id === id) ?? PROTOCOL_TYPES[0];
}
