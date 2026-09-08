import type { MeetingMeta, Speaker, SpeakerKey, TranscriptEntry } from '../types';

/* Vollständiges Mock-Transkript der 14. Sitzung des Lenkungskreises
   Digitalisierung und KI-Einsatz im Ministerium für Vibe Coding und
   Reaktorsicherheit. Vier Sprecher, 60 Beiträge, fünf Tagesordnungspunkte.
   Aus diesem Transkript lassen sich alle vier Protokolltypen erzeugen. */

export const MINISTRY = {
  name: 'Ministerium für Vibe Coding und Reaktorsicherheit',
  short: 'MVCR',
  unit: 'Referat Z 3 – Organisation, Digitalisierung und KI',
  fileNumber: 'Z3-0271/26',
  distribution: [
    'Leitungsstab',
    'Abteilungsleitungen Z, R und F',
    'Referate Z 1, Z 2, Z 3',
    'Personalvertretung',
    'Registratur (zur Akte)',
  ],
};

export const AGENDA = [
  { no: 1, title: 'Eröffnung, Feststellung der Beschlussfähigkeit, Genehmigung der Tagesordnung' },
  { no: 2, title: 'Sachstand Einführung F13 im nachgeordneten Bereich – Zwischenbericht' },
  { no: 3, title: 'Kleine Anfrage „KI-Einsatz in der Fachaufsicht“ – Verfahrensstand' },
  { no: 4, title: 'Haushaltsaufstellung 2027, Einzelplan 14, Kapitel 1403 – Vorberatung' },
  { no: 5, title: 'Verschiedenes' },
];

/** Vorschläge, die der Assistent im Zuordnungsdialog anbietet. */
export const SPEAKER_SUGGESTIONS: Record<
  string,
  { name: string; functionLabel: string; hint: string }
> = {
  A: {
    name: 'Dr. Katrin Berger',
    functionLabel: 'Abteilungsleitung Z, Vorsitz',
    hint: 'hat die Sitzung eröffnet, ruft die Tagesordnungspunkte auf und leitet die Abstimmungen',
  },
  B: {
    name: 'Michael Wendt',
    functionLabel: 'Referat Z 2 – Haushalt',
    hint: 'meldet sich fast ausschließlich zu Titelansätzen, Deckungsvorschlägen und überplanmäßigen Ausgaben',
  },
  C: {
    name: 'Ayşe Yıldırım',
    functionLabel: 'Referat Z 3 – Organisation, Digitalisierung und KI',
    hint: 'berichtet zum Rollout und zur Datenschutz-Folgenabschätzung und kennt die Ausbaustufen im Detail',
  },
  D: {
    name: 'Hans-Peter Lorenz',
    functionLabel: 'Referat R 4 – Aufsicht über kerntechnische Anlagen',
    hint: 'stellt die Rückfragen aus der Fachabteilung und bringt den Änderungsantrag zu Tagesordnungspunkt 4 ein',
  },
};

export const MEETING_META: MeetingMeta = {
  title: '14. Sitzung des Lenkungskreises Digitalisierung und KI-Einsatz',
  date: '2026-09-08',
  startTime: '10:00',
  location: 'Sitzungsraum 3.14, Dienstgebäude Hauptstelle',
  participants: [
    'Dr. Katrin Berger (Abteilungsleitung Z, Vorsitz)',
    'Michael Wendt (Referat Z 2 – Haushalt)',
    'Ayşe Yıldırım (Referat Z 3 – Organisation, Digitalisierung und KI)',
    'Hans-Peter Lorenz (Referat R 4 – Aufsicht über kerntechnische Anlagen)',
    'Renate Kohlmeyer (Referat Z 3, Schriftführung)',
    'Zwei Vertretungen des Landesbetriebs IT als Gäste ohne Stimmrecht',
  ],
  audioSource: 'mikrofon',
  microphone: 'Raummikrofon Sitzungsraum 3.14 (Konferenzsystem)',
  fileName: null,
  protocolType: 'ergebnis',
};

export const TRANSCRIPT: TranscriptEntry[] = [
  { id: 't01', t: 0, speaker: 'A', agendaItem: 1, text: 'Meine Damen und Herren, ich eröffne die 14. Sitzung des Lenkungskreises Digitalisierung und KI-Einsatz. Es ist 10 Uhr, die Einladung ist fristgerecht ergangen.' },
  { id: 't02', t: 14, speaker: 'A', agendaItem: 1, text: 'Ich stelle fest, dass elf von dreizehn stimmberechtigten Mitgliedern anwesend sind. Der Lenkungskreis ist damit beschlussfähig.' },
  { id: 't03', t: 31, speaker: 'A', agendaItem: 1, text: 'Zur Tagesordnung: Gibt es Änderungswünsche? Ich sehe keine. Dann ist die Tagesordnung in der vorliegenden Fassung genehmigt.' },
  { id: 't04', t: 52, speaker: 'A', agendaItem: 1, text: 'Ich weise darauf hin, dass die Sitzung zur Protokollerstellung aufgezeichnet und transkribiert wird. Widerspruch gegen die Aufzeichnung ist jetzt möglich. Ich sehe keinen Widerspruch.' },
  { id: 't05', t: 78, speaker: 'A', agendaItem: 2, text: 'Damit rufe ich Tagesordnungspunkt 2 auf: Sachstand der Einführung von F13 im nachgeordneten Bereich. Frau Yıldırım, bitte.' },
  { id: 't06', t: 95, speaker: 'C', agendaItem: 2, text: 'Vielen Dank. Der Zwischenbericht liegt Ihnen als Anlage 1 vor. Von den achtzehn geplanten Ausbaustufen sind sieben abgeschlossen, fünf befinden sich in der technischen Umsetzung, sechs sind zurückgestellt.' },
  { id: 't07', t: 128, speaker: 'C', agendaItem: 2, text: 'Abgeschlossen sind unter anderem die Stufen 3, 4 und 7 – die Anbindung des Landesamts für Strahlenschutz, die Freischaltung für die Referate Z 1 bis Z 3 und die Schnittstelle zur E-Akte.' },
  { id: 't08', t: 166, speaker: 'C', agendaItem: 2, text: 'Zurückgestellt sind die Stufen 9 bis 14. Alle sechs betreffen Dienststellen, die ihre Fachverfahren beim Landesbetrieb IT betreiben. Dafür brauchen wir dessen Freigabe, und die liegt bis heute nicht vor.' },
  { id: 't09', t: 199, speaker: 'D', agendaItem: 2, text: 'Frau Yıldırım, seit wann liegt die Anfrage denn beim Landesbetrieb? Der Bericht nennt kein Datum, und genau das interessiert mich.' },
  { id: 't10', t: 218, speaker: 'C', agendaItem: 2, text: 'Die erste Anfrage ist am 14. Februar dieses Jahres gestellt worden, die Erinnerung am 6. Mai. Auf die Erinnerung haben wir eine Eingangsbestätigung erhalten, seither keine inhaltliche Antwort.' },
  { id: 't11', t: 248, speaker: 'D', agendaItem: 2, text: 'Das ist ein halbes Jahr. Ich halte es für unbefriedigend, dass wir das erst auf Nachfrage erfahren. Das gehört in den Bericht.' },
  { id: 't12', t: 266, speaker: 'A', agendaItem: 2, text: 'Der Hinweis ist berechtigt. Frau Yıldırım, nehmen Sie das bitte für die Fortschreibung des Berichts auf.' },
  { id: 't13', t: 279, speaker: 'C', agendaItem: 2, text: 'Wird gemacht. Ich ergänze eine Spalte mit dem jeweiligen Datum der letzten Abstimmung je Ausbaustufe.' },
  { id: 't14', t: 293, speaker: 'B', agendaItem: 2, text: 'Ich möchte auf einen haushaltsrechtlichen Aspekt hinweisen. Für drei der zurückgestellten Stufen sind Mittel aus dem Digitalisierungsfonds des Landes bewilligt. Die Bewilligung läuft zum 31. Dezember 2027 aus.' },
  { id: 't15', t: 322, speaker: 'B', agendaItem: 2, text: 'Wenn die Freigabe des Landesbetriebs nicht bis Mitte 2027 vorliegt, ist die Umsetzung im Bewilligungszeitraum nicht mehr zu schaffen. Dann verfallen rund 640.000 Euro.' },
  { id: 't16', t: 351, speaker: 'D', agendaItem: 2, text: 'Das ist der eigentliche Punkt. Herr Wendt, ist eine Verlängerung der Bewilligung möglich?' },
  { id: 't17', t: 366, speaker: 'B', agendaItem: 2, text: 'Ein Verlängerungsantrag ist möglich, aber nicht voraussetzungslos. Er muss begründet werden, und die bewilligende Stelle entscheidet nach Ermessen. Ich würde ihn erst stellen, wenn wir wissen, wie der Landesbetrieb sich positioniert.' },
  { id: 't18', t: 399, speaker: 'A', agendaItem: 2, text: 'Damit haben wir zwei offene Stränge: die Abstimmung mit dem Landesbetrieb und die Mittelbindung. Mein Vorschlag wäre, beides zu verbinden.' },
  { id: 't19', t: 419, speaker: 'C', agendaItem: 2, text: 'Aus fachlicher Sicht wäre eine Sammelabstimmung sinnvoll. Wir bündeln alle sechs Ausbaustufen in einem Termin, statt sie einzeln zu verfolgen. Das erhöht die Chance auf eine Entscheidung deutlich.' },
  { id: 't20', t: 448, speaker: 'D', agendaItem: 2, text: 'Dem stimme ich zu. Ich würde aber gern eine Frist im Beschluss haben. Sonst reden wir im Juni wieder über dasselbe.' },
  { id: 't21', t: 466, speaker: 'A', agendaItem: 2, text: 'Dann formuliere ich so: Das Referat Z 3 wird gebeten, bis zum 31. Oktober 2026 einen Termin für eine Sammelabstimmung mit dem Landesbetrieb IT zu vereinbaren und dem Lenkungskreis in der Dezembersitzung zu berichten.' },
  { id: 't22', t: 497, speaker: 'A', agendaItem: 2, text: 'Gibt es Wortmeldungen dazu? Keine. Dann stimmen wir ab. Wer stimmt zu? Wer ist dagegen? Wer enthält sich?' },
  { id: 't23', t: 519, speaker: 'A', agendaItem: 2, text: 'Bei neun Ja-Stimmen, keiner Gegenstimme und zwei Enthaltungen ist der Beschluss gefasst.' },
  { id: 't24', t: 537, speaker: 'A', agendaItem: 3, text: 'Ich rufe Tagesordnungspunkt 3 auf: die Kleine Anfrage zum KI-Einsatz in der Fachaufsicht, Verfahrensstand.' },
  { id: 't25', t: 551, speaker: 'C', agendaItem: 3, text: 'Zum Verfahrensstand: Die Kleine Anfrage ist am 3. September über den Leitungsstab zugeleitet worden. Die Frist für die Zuarbeit an das Justiziariat läuft am 19. September ab.' },
  { id: 't26', t: 578, speaker: 'C', agendaItem: 3, text: 'Gefragt wird nach der Zahl der Beschäftigten mit Zugang, nach dem Verarbeitungsort der Modelle und danach, ob KI-gestützte Auswertungen in aufsichtlichen Verfahren eingesetzt werden.' },
  { id: 't27', t: 609, speaker: 'C', agendaItem: 3, text: 'Fachlich: Die ersten beiden Fragen können wir belastbar beantworten. Bei der dritten ist die Rechtslage nicht abschließend geklärt, weil für die Fachaufsicht keine eigene Folgenabschätzung vorliegt.' },
  { id: 't28', t: 642, speaker: 'D', agendaItem: 3, text: 'Heißt das, wir dürfen F13 in der Fachaufsicht derzeit gar nicht einsetzen?' },
  { id: 't29', t: 653, speaker: 'C', agendaItem: 3, text: 'Das kann ich Ihnen heute nicht beantworten. Die vorhandene Folgenabschätzung deckt Entwurfs- und Vorarbeiten ab, nicht die aufsichtliche Bewertung von Anlagen. Für eine belastbare Aussage brauchen wir eine ergänzende Prüfung.' },
  { id: 't30', t: 685, speaker: 'A', agendaItem: 3, text: 'Was würde eine solche Prüfung kosten und wie lange dauert sie?' },
  { id: 't31', t: 697, speaker: 'C', agendaItem: 3, text: 'Wir haben eine Kostenschätzung eingeholt: rund 18.000 Euro, Bearbeitungszeit etwa vier Monate. Eine Vergabe wäre freihändig möglich.' },
  { id: 't32', t: 723, speaker: 'B', agendaItem: 3, text: 'Für 2026 sehe ich dafür keine Deckung im laufenden Ansatz. In Titel 526 01 sind die Mittel gebunden. Wir müssten das in den Ansatz 2027 aufnehmen oder eine überplanmäßige Ausgabe beantragen.' },
  { id: 't33', t: 756, speaker: 'D', agendaItem: 3, text: 'Wenn wir es in 2027 schieben, liegt das Ergebnis frühestens Mitte 2027 vor. Die Kleine Anfrage ist im September zu beantworten. Das halte ich für die falsche Reihenfolge.' },
  { id: 't34', t: 782, speaker: 'C', agendaItem: 3, text: 'Diesen Einwand teile ich. Fachlich wäre es besser, die Prüfung wenigstens beauftragt zu haben, damit wir in der Antwort auf ein laufendes Verfahren verweisen können.' },
  { id: 't35', t: 806, speaker: 'B', agendaItem: 3, text: 'Dann wäre die überplanmäßige Ausgabe der Weg. Zuständig für die Einwilligung ist bei diesem Betrag die Abteilung Z im Benehmen mit dem Finanzministerium. Wir bräuchten einen Deckungsvorschlag.' },
  { id: 't36', t: 833, speaker: 'B', agendaItem: 3, text: 'Ein möglicher Deckungsvorschlag: In Titel 511 03 sind Mittel für die Erneuerung der Messtechnik veranschlagt, die dieses Jahr nicht mehr vergeben wird. Dort sind etwa 25.000 Euro verfügbar.' },
  { id: 't37', t: 864, speaker: 'A', agendaItem: 3, text: 'Das klingt tragfähig. Dann formuliere ich einen Beschluss: Das Referat Z 3 wird beauftragt, eine ergänzende Datenschutz-Folgenabschätzung für den Einsatz von F13 in der Fachaufsicht zu vergeben.' },
  { id: 't38', t: 893, speaker: 'A', agendaItem: 3, text: 'Die Finanzierung erfolgt über eine überplanmäßige Ausgabe in Höhe von bis zu 20.000 Euro mit Deckung aus Titel 511 03. Die Einwilligung der Abteilung Z wird eingeholt.' },
  { id: 't39', t: 921, speaker: 'D', agendaItem: 3, text: 'Ich bitte darum, in der Zuarbeit zur Kleinen Anfrage ausdrücklich auf die laufende Prüfung hinzuweisen. Sonst entsteht der Eindruck, es sei nichts veranlasst.' },
  { id: 't40', t: 940, speaker: 'A', agendaItem: 3, text: 'Das nehme ich als Ergänzung auf: Die Zuarbeit an das Justiziariat weist auf die beauftragte Prüfung hin. Wortmeldungen? Keine. Wir stimmen ab.' },
  { id: 't41', t: 967, speaker: 'A', agendaItem: 3, text: 'Wer stimmt zu? Wer ist dagegen? Wer enthält sich? Bei elf Ja-Stimmen einstimmig angenommen.' },
  { id: 't42', t: 989, speaker: 'A', agendaItem: 4, text: 'Tagesordnungspunkt 4: Haushaltsaufstellung 2027, Einzelplan 14, Kapitel 1403, Vorberatung der Titelansätze. Herr Wendt, bitte.' },
  { id: 't43', t: 1004, speaker: 'B', agendaItem: 4, text: 'Kapitel 1403 weist für 2027 Ausgaben von 14.820.000 Euro aus, gegenüber 13.640.000 Euro im laufenden Jahr. Das ist eine Steigerung von rund 8,7 Prozent.' },
  { id: 't44', t: 1035, speaker: 'B', agendaItem: 4, text: 'Die Steigerung ist im Wesentlichen gebunden: 620.000 Euro Tarifentwicklung bei den Personalausgaben und 480.000 Euro für den Betrieb der KI-Infrastruktur beim Landesbetrieb IT. Frei disponibel sind davon rund 80.000 Euro.' },
  { id: 't45', t: 1070, speaker: 'D', agendaItem: 4, text: 'Beim Titel für Fortbildung und Schulung sehe ich 240.000 Euro. Das ist derselbe Betrag wie 2025 und 2026. Bei dreifacher Zahl der Zugänge bedeutet das faktisch eine Kürzung.' },
  { id: 't46', t: 1096, speaker: 'C', agendaItem: 4, text: 'Das ist zutreffend. Wir haben seit 2024 rund 900 zusätzliche Zugänge freigeschaltet. Der Schulungsbedarf steigt entsprechend, der Ansatz nicht.' },
  { id: 't47', t: 1122, speaker: 'D', agendaItem: 4, text: 'Dann stelle ich den Antrag, den Ansatz in Titel 525 01 um 120.000 Euro auf 360.000 Euro zu erhöhen.' },
  { id: 't48', t: 1141, speaker: 'B', agendaItem: 4, text: 'Ich muss auf die Folge hinweisen: Der Einzelplan weist bereits eine Deckungslücke von 5,45 Millionen Euro aus. Eine Erhöhung ohne Deckungsvorschlag vergrößert sie.' },
  { id: 't49', t: 1171, speaker: 'D', agendaItem: 4, text: 'Dann nenne ich einen Deckungsvorschlag: Im Ansatz für die Erneuerung der Netzinfrastruktur sind 300.000 Euro veranschlagt. Nach meinem Kenntnisstand ist die Maßnahme noch nicht ausgeplant.' },
  { id: 't50', t: 1200, speaker: 'C', agendaItem: 4, text: 'Die Planung läuft, die Vergabe ist für das zweite Quartal 2027 vorgesehen. Eine Kürzung um 120.000 Euro würde bedeuten, dass wir den zweiten Bauabschnitt nicht mit vergeben können.' },
  { id: 't51', t: 1232, speaker: 'A', agendaItem: 4, text: 'Wir haben damit eine Abwägung zwischen zwei gebundenen Zwecken. Ich sehe hier keine offensichtlich richtige Lösung. Weitere Wortmeldungen?' },
  { id: 't52', t: 1254, speaker: 'B', agendaItem: 4, text: 'Ein Zwischenweg wäre, die Erhöhung um 120.000 Euro zu empfehlen, die Deckung aber offen zu lassen und der Abteilungsleitung zu überlassen. Der Lenkungskreis berät ohnehin nur vor.' },
  { id: 't53', t: 1284, speaker: 'D', agendaItem: 4, text: 'Damit bin ich einverstanden. Mir ist wichtig, dass die Erhöhung als Votum dieses Gremiums erkennbar ist.' },
  { id: 't54', t: 1305, speaker: 'A', agendaItem: 4, text: 'Dann lautet der Beschlussvorschlag: Der Lenkungskreis empfiehlt der Abteilungsleitung, den Ansatz in Titel 525 01 um 120.000 Euro auf 360.000 Euro zu erhöhen. Über die Deckung entscheidet die Abteilungsleitung.' },
  { id: 't55', t: 1341, speaker: 'A', agendaItem: 4, text: 'Wer stimmt zu? Wer ist dagegen? Wer enthält sich? Bei sieben Ja-Stimmen, drei Gegenstimmen und einer Enthaltung ist die Empfehlung angenommen.' },
  { id: 't56', t: 1372, speaker: 'A', agendaItem: 4, text: 'Im Übrigen nimmt der Lenkungskreis die Ansätze des Kapitels 1403 zur Kenntnis und leitet sie mit dieser Änderungsempfehlung weiter.' },
  { id: 't57', t: 1392, speaker: 'A', agendaItem: 5, text: 'Tagesordnungspunkt 5: Verschiedenes. Gibt es Anliegen aus dem Lenkungskreis?' },
  { id: 't58', t: 1406, speaker: 'C', agendaItem: 5, text: 'Ein Hinweis: Die Schulungsreihe für Führungskräfte, die der Lenkungskreis im Juni beschlossen hat, beginnt in der zweiten Oktoberhälfte. Die Terminliste geht Ihnen nächste Woche zu.' },
  { id: 't59', t: 1430, speaker: 'D', agendaItem: 5, text: 'Ich bitte darum, dass die Terminliste auch die abgelehnten Terminwünsche mit Begründung enthält. Diese Frage kommt sonst aus den Fachabteilungen zurück.' },
  { id: 't60', t: 1452, speaker: 'A', agendaItem: 5, text: 'Das ist notiert. Wenn es keine weiteren Anliegen gibt, schließe ich die Sitzung. Es ist 10:24 Uhr. Ich danke Ihnen.' },
];

/* Die Beitragszahlen werden aus dem Transkript berechnet, damit Transkript,
   Zuordnungsdialog und Protokoll nicht auseinanderlaufen können. */
function countContributions(key: SpeakerKey): number {
  return TRANSCRIPT.filter((entry) => entry.speaker === key).length;
}

export const INITIAL_SPEAKERS: Speaker[] = (['A', 'B', 'C', 'D'] as SpeakerKey[]).map((key) => ({
  key,
  name: null,
  functionLabel: null,
  contributions: countContributions(key),
}));

export function formatTimecode(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}
