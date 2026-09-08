import type {
  MeetingMeta,
  Protocol,
  ProtocolSection,
  ProtocolType,
  Speaker,
  SpeakerKey,
  TranscriptEntry,
} from '../types';
import { getProtocolTypeInfo } from './models';
import { AGENDA, MINISTRY, formatTimecode } from './transcript';

/* Erzeugt aus demselben Transkript vier verschiedene Protokolltypen.
   Die "Erzeugung" ist regelbasiert und simuliert die Modellausgabe. */

export function speakerLabel(speakers: Speaker[], key: SpeakerKey): string {
  const s = speakers.find((x) => x.key === key);
  if (!s || !s.name) return 'Sprecher ' + key;
  return s.functionLabel ? s.name + ' (' + s.functionLabel + ')' : s.name;
}

export function speakerShort(speakers: Speaker[], key: SpeakerKey): string {
  const s = speakers.find((x) => x.key === key);
  return s?.name ?? 'Sprecher ' + key;
}

interface Decision {
  id: string;
  top: number;
  title: string;
  text: string;
  yes: number;
  no: number;
  abstain: number;
  sourceEntryId: string;
}

interface Task {
  id: string;
  top: number;
  text: string;
  responsible: SpeakerKey;
  due: string;
  sourceEntryId: string;
}

export const DECISIONS: Decision[] = [
  {
    id: 'b1',
    top: 2,
    title: 'Beschluss 1/14-2026 – Sammelabstimmung mit dem Landesbetrieb IT',
    text: 'Das Referat Z 3 wird gebeten, bis zum 31. Oktober 2026 einen Termin für eine Sammelabstimmung mit dem Landesbetrieb IT über die zurückgestellten Ausbaustufen 9 bis 14 der Einführung von F13 zu vereinbaren und dem Lenkungskreis in der Dezembersitzung zu berichten.',
    yes: 9,
    no: 0,
    abstain: 2,
    sourceEntryId: 't21',
  },
  {
    id: 'b2',
    top: 3,
    title: 'Beschluss 2/14-2026 – Ergänzende Datenschutz-Folgenabschätzung Fachaufsicht',
    text: 'Das Referat Z 3 wird beauftragt, eine ergänzende Datenschutz-Folgenabschätzung für den Einsatz von F13 in der Fachaufsicht zu vergeben. Die Finanzierung erfolgt über eine überplanmäßige Ausgabe in Höhe von bis zu 20.000 Euro mit Deckung aus Titel 511 03; die Einwilligung der Abteilung Z wird eingeholt. Die Zuarbeit zur Kleinen Anfrage weist auf die beauftragte Prüfung hin.',
    yes: 11,
    no: 0,
    abstain: 0,
    sourceEntryId: 't38',
  },
  {
    id: 'b3',
    top: 4,
    title: 'Beschluss 3/14-2026 – Empfehlung Titel 525 01, Fortbildung und Schulung',
    text: 'Der Lenkungskreis empfiehlt der Abteilungsleitung, den Ansatz in Titel 525 01 um 120.000 Euro auf 360.000 Euro zu erhöhen. Über die Deckung entscheidet die Abteilungsleitung. Im Übrigen nimmt der Lenkungskreis die Ansätze des Kapitels 1403 zur Kenntnis und leitet sie mit dieser Änderungsempfehlung weiter.',
    yes: 7,
    no: 3,
    abstain: 1,
    sourceEntryId: 't54',
  },
];

export const TASKS: Task[] = [
  {
    id: 'a1',
    top: 2,
    text: 'Zwischenbericht um eine Spalte mit dem Datum der jeweils letzten Abstimmung je Ausbaustufe ergänzen.',
    responsible: 'C',
    due: '30.09.2026',
    sourceEntryId: 't13',
  },
  {
    id: 'a2',
    top: 2,
    text: 'Termin für die Sammelabstimmung mit dem Landesbetrieb IT vereinbaren.',
    responsible: 'C',
    due: '31.10.2026',
    sourceEntryId: 't21',
  },
  {
    id: 'a3',
    top: 2,
    text: 'Verlängerungsantrag für die Mittel aus dem Digitalisierungsfonds vorbereiten, sobald die Position des Landesbetriebs bekannt ist (Volumen 640.000 Euro, Bewilligung bis 31.12.2027).',
    responsible: 'B',
    due: 'nach Sammelabstimmung',
    sourceEntryId: 't17',
  },
  {
    id: 'a4',
    top: 3,
    text: 'Ergänzende Datenschutz-Folgenabschätzung freihändig vergeben (Kostenschätzung 18.000 Euro, Bearbeitungszeit vier Monate).',
    responsible: 'C',
    due: '15.10.2026',
    sourceEntryId: 't31',
  },
  {
    id: 'a5',
    top: 3,
    text: 'Überplanmäßige Ausgabe mit Deckungsvorschlag aus Titel 511 03 der Abteilung Z zur Einwilligung vorlegen.',
    responsible: 'B',
    due: '30.09.2026',
    sourceEntryId: 't36',
  },
  {
    id: 'a6',
    top: 3,
    text: 'Zuarbeit zur Kleinen Anfrage an das Justiziariat übermitteln, mit Hinweis auf die beauftragte Prüfung.',
    responsible: 'C',
    due: '19.09.2026',
    sourceEntryId: 't39',
  },
  {
    id: 'a7',
    top: 5,
    text: 'Terminliste der Schulungsreihe versenden, einschließlich der abgelehnten Terminwünsche mit Begründung.',
    responsible: 'C',
    due: '14.09.2026',
    sourceEntryId: 't59',
  },
];

/* --- Bausteine --- */

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Kopfbogen nach der Protokollvorlage des Hauses: Behörde, Referat,
   Aktenzeichen und Sitzungsdaten stehen vor dem eigentlichen Protokolltext. */
function headSection(meta: MeetingMeta, typeName: string): ProtocolSection {
  return {
    id: 'sec-kopf',
    heading: 'Kopfbogen',
    html:
      '<p><strong>' +
      esc(MINISTRY.name) +
      '</strong><br />' +
      esc(MINISTRY.unit) +
      '</p>' +
      '<table><tbody>' +
      '<tr><th scope="row">Aktenzeichen</th><td>' +
      esc(MINISTRY.fileNumber) +
      '</td></tr>' +
      '<tr><th scope="row">Art der Niederschrift</th><td>' +
      esc(typeName) +
      '</td></tr>' +
      '<tr><th scope="row">Gegenstand</th><td>' +
      esc(meta.title) +
      '</td></tr>' +
      '<tr><th scope="row">Datum, Beginn</th><td>' +
      esc(formatDate(meta.date)) +
      ', ' +
      esc(meta.startTime) +
      ' Uhr</td></tr>' +
      '<tr><th scope="row">Ort</th><td>' +
      esc(meta.location) +
      '</td></tr>' +
      '<tr><th scope="row">Vorsitz</th><td>' +
      esc(meta.participants[0] ?? '') +
      '</td></tr>' +
      '<tr><th scope="row">Schriftführung</th><td>Referat Z 3</td></tr>' +
      '</tbody></table>' +
      '<p><em>Entwurf. Verbindlich erst mit Zeichnung der Schriftführung und Billigung durch den Vorsitz.</em></p>',
  };
}

function attendanceSection(meta: MeetingMeta): ProtocolSection {
  const rows = meta.participants.map((p) => '<li>' + esc(p) + '</li>').join('');
  return {
    id: 'sec-anwesende',
    heading: 'Anwesende',
    html:
      '<ul>' +
      rows +
      '</ul><p>Der Lenkungskreis war mit elf von dreizehn stimmberechtigten Mitgliedern beschlussfähig. Die Tagesordnung wurde ohne Änderung genehmigt. Ein Widerspruch gegen die Aufzeichnung der Sitzung wurde nicht erhoben.</p>',
  };
}

/* Verteiler schließt jede Niederschrift des Hauses ab. */
function distributionSection(): ProtocolSection {
  return {
    id: 'sec-verteiler',
    heading: 'Verteiler',
    html:
      '<ul>' +
      MINISTRY.distribution.map((entry) => '<li>' + esc(entry) + '</li>').join('') +
      '</ul><p>Einwendungen gegen die Niederschrift sind binnen zwei Wochen nach Zugang gegenüber dem Referat ' +
      esc(MINISTRY.unit.split('–')[0].trim()) +
      ' zu erheben. Danach gilt die Niederschrift als gebilligt.</p>',
  };
}

function decisionsSection(): ProtocolSection {
  const rows = DECISIONS.map(
    (d) =>
      '<tr><td>TOP ' +
      d.top +
      '</td><td><strong>' +
      esc(d.title) +
      '</strong><br />' +
      esc(d.text) +
      '</td><td>' +
      d.yes +
      ' Ja<br />' +
      d.no +
      ' Nein<br />' +
      d.abstain +
      ' Enthaltung' +
      (d.abstain === 1 ? '' : 'en') +
      '</td></tr>',
  ).join('');
  return {
    id: 'sec-beschluesse',
    heading: 'Beschlüsse',
    html:
      '<table><thead><tr><th scope="col">Punkt</th><th scope="col">Beschluss</th><th scope="col">Abstimmung</th></tr></thead><tbody>' +
      rows +
      '</tbody></table>',
    sourceEntryId: 't21',
  };
}

function tasksSection(speakers: Speaker[]): ProtocolSection {
  const rows = TASKS.map(
    (t) =>
      '<tr><td>TOP ' +
      t.top +
      '</td><td>' +
      esc(t.text) +
      '</td><td>' +
      esc(speakerShort(speakers, t.responsible)) +
      '</td><td>' +
      esc(t.due) +
      '</td></tr>',
  ).join('');
  return {
    id: 'sec-aufgaben',
    heading: 'Aufgaben',
    html:
      '<table><thead><tr><th scope="col">Punkt</th><th scope="col">Aufgabe</th><th scope="col">Verantwortlich</th><th scope="col">Frist</th></tr></thead><tbody>' +
      rows +
      '</tbody></table>',
    sourceEntryId: 't13',
  };
}

const ERGEBNIS_TEXT: Record<number, string> = {
  1: '<p>Der Vorsitz eröffnete die Sitzung um 10:00 Uhr, stellte die Beschlussfähigkeit fest und ließ die Tagesordnung ohne Änderung genehmigen. Auf die Aufzeichnung zur Protokollerstellung wurde hingewiesen; Widerspruch wurde nicht erhoben.</p>',
  2: '<p>Der Lenkungskreis nahm den Zwischenbericht zur Einführung von F13 im nachgeordneten Bereich zur Kenntnis. Von 18 Ausbaustufen sind 7 abgeschlossen, 5 befinden sich in der technischen Umsetzung, 6 sind zurückgestellt. Die Zurückstellung beruht auf der ausstehenden Freigabe des Landesbetriebs IT; die Anfrage datiert vom 14.02.2026, die Erinnerung vom 06.05.2026.</p><p>Für drei zurückgestellte Stufen bestehen Mittel aus dem Digitalisierungsfonds in Höhe von rund 640.000 Euro mit Bewilligung bis 31.12.2027. Der Lenkungskreis beschloss eine fristgebundene Sammelabstimmung mit dem Landesbetrieb IT (Beschluss 1/14-2026). Der Zwischenbericht wird um die Abstimmungsdaten je Ausbaustufe ergänzt.</p>',
  3: '<p>Der Lenkungskreis befasste sich mit der Kleinen Anfrage „KI-Einsatz in der Fachaufsicht“, zugeleitet über den Leitungsstab am 03.09.2026. Die Frist für die Zuarbeit an das Justiziariat endet am 19.09.2026. Die Fragen nach Zahl der Zugänge und Verarbeitungsort sind belastbar zu beantworten.</p><p>Für den Einsatz in aufsichtlichen Verfahren liegt keine eigene Datenschutz-Folgenabschätzung vor; die vorhandene deckt Entwurfs- und Vorarbeiten ab. Der Lenkungskreis beschloss die Vergabe einer ergänzenden Folgenabschätzung (Kostenschätzung 18.000 Euro, Bearbeitungszeit vier Monate) und die Finanzierung über eine überplanmäßige Ausgabe mit Deckung aus Titel 511 03 (Beschluss 2/14-2026).</p>',
  4: '<p>Kapitel 1403 weist für 2027 Ausgaben von 14.820.000 Euro aus (2026: 13.640.000 Euro), eine Steigerung von rund 8,7 Prozent. Davon entfallen 620.000 Euro auf die Tarifentwicklung und 480.000 Euro auf den Betrieb der KI-Infrastruktur; frei disponibel sind rund 80.000 Euro.</p><p>Auf Antrag aus dem Gremium empfiehlt der Lenkungskreis, den Ansatz in Titel 525 01 (Fortbildung und Schulung) um 120.000 Euro auf 360.000 Euro zu erhöhen; die Deckungsentscheidung bleibt der Abteilungsleitung überlassen (Beschluss 3/14-2026). Der als Deckung erwogene Ansatz für die Netzinfrastruktur wurde nicht gekürzt, da die Vergabe des zweiten Bauabschnitts sonst entfiele.</p>',
  5: '<p>Die Schulungsreihe für Führungskräfte aus dem Beschluss vom Juni 2026 beginnt in der zweiten Oktoberhälfte. Die Terminliste wird versandt und soll auf Wunsch des Gremiums auch die abgelehnten Terminwünsche mit Begründung enthalten. Die Sitzung endete um 10:24 Uhr.</p>',
};

function indirectSpeech(entry: TranscriptEntry, speakers: Speaker[]): string {
  const name = speakerShort(speakers, entry.speaker);
  return (
    '<p><strong>' +
    esc(name) +
    '</strong> (' +
    formatTimecode(entry.t) +
    '): ' +
    esc(toIndirect(entry.text)) +
    '</p>'
  );
}

/* Einfache Umformung in indirekte Rede. Bewusst schlicht gehalten:
   der Prototyp soll die Darstellungsform zeigen, nicht Grammatik lösen. */
function toIndirect(text: string): string {
  return text
    .replace(/^Ich /, 'Er oder sie erklärte, ')
    .replace(/^Wir /, 'Man ')
    .replace(/\bIch halte\b/g, 'man halte')
    .replace(/\bich halte\b/g, 'man halte')
    .replace(/\bIch bitte\b/g, 'es werde gebeten')
    .replace(/\bIch möchte\b/g, 'es solle');
}

export function generateProtocol(
  type: ProtocolType,
  meta: MeetingMeta,
  transcript: TranscriptEntry[],
  speakers: Speaker[],
): Protocol {
  /* Jede Niederschrift des Hauses beginnt mit dem Kopfbogen und endet mit
     dem Verteiler - unabhängig vom Protokolltyp. */
  const sections: ProtocolSection[] = [
    headSection(meta, getProtocolTypeInfo(type).name),
    attendanceSection(meta),
  ];

  if (type === 'ergebnis') {
    for (const item of AGENDA) {
      sections.push({
        id: 'sec-top-' + item.no,
        heading: 'TOP ' + item.no + ': ' + item.title,
        html: ERGEBNIS_TEXT[item.no],
        sourceEntryId: transcript.find((e) => e.agendaItem === item.no)?.id,
      });
    }
    sections.push(decisionsSection(), tasksSection(speakers));
  }

  if (type === 'verlauf') {
    for (const item of AGENDA) {
      const entries = transcript.filter((e) => e.agendaItem === item.no);
      sections.push({
        id: 'sec-top-' + item.no,
        heading: 'TOP ' + item.no + ': ' + item.title,
        html: entries.map((e) => indirectSpeech(e, speakers)).join(''),
        sourceEntryId: entries[0]?.id,
      });
    }
    sections.push(decisionsSection());
  }

  if (type === 'beschluss') {
    for (const d of DECISIONS) {
      const total = d.yes + d.no + d.abstain;
      sections.push({
        id: 'sec-' + d.id,
        heading: d.title,
        html:
          '<p><em>Zu TOP ' +
          d.top +
          ': ' +
          esc(AGENDA[d.top - 1].title) +
          '</em></p><p>' +
          esc(d.text) +
          '</p><table><thead><tr><th scope="col">Ja</th><th scope="col">Nein</th><th scope="col">Enthaltung</th><th scope="col">Abgegebene Stimmen</th></tr></thead><tbody><tr><td>' +
          d.yes +
          '</td><td>' +
          d.no +
          '</td><td>' +
          d.abstain +
          '</td><td>' +
          total +
          '</td></tr></tbody></table><p>Ergebnis: ' +
          (d.no === 0 && d.abstain === 0
            ? 'einstimmig angenommen'
            : d.yes > d.no
              ? 'mit Mehrheit angenommen'
              : 'abgelehnt') +
          '.</p>',
        sourceEntryId: d.sourceEntryId,
      });
    }
  }

  if (type === 'wort') {
    for (const item of AGENDA) {
      const entries = transcript.filter((e) => e.agendaItem === item.no);
      sections.push({
        id: 'sec-top-' + item.no,
        heading: 'TOP ' + item.no + ': ' + item.title,
        html: entries
          .map(
            (e) =>
              '<p><strong>' +
              esc(speakerLabel(speakers, e.speaker)) +
              '</strong> [' +
              formatTimecode(e.t) +
              ']<br />' +
              esc(e.text) +
              '</p>',
          )
          .join(''),
        sourceEntryId: entries[0]?.id,
      });
    }
  }

  sections.push(distributionSection());

  return {
    type,
    generatedAt: new Date().toISOString(),
    sections: sections.map((s) => ({ ...s, originalHtml: s.html, edited: false })),
  };
}

export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
