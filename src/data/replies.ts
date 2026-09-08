import type { Attachment, ModelId } from '../types';

/* Vorformulierte Antworten für den Prototyp. Es wird keine Modell-API
   aufgerufen; die Auswahl erfolgt über einfache Stichwortregeln, damit sich
   der Chat trotzdem plausibel verhält. */

interface ReplyRule {
  keywords: string[];
  build: (ctx: { modelId: ModelId; attachments: Attachment[] }) => string[];
}

const HINWEIS_PRUEFEN =
  'Bitte prüfen Sie den Entwurf fachlich, bevor er das Haus verlässt. Zahlen, Fristen und Fundstellen habe ich nicht verifiziert.';

const RULES: ReplyRule[] = [
  {
    keywords: ['zusammenfass', 'kurzfass', 'halbe seite', 'fasse'],
    build: ({ attachments }) => [
      attachments.length > 0
        ? 'Kurzfassung zu ' + attachments[0].name
        : 'Kurzfassung des übermittelten Textes',
      '',
      'Kern der Sache: Der Vorgang betrifft eine Maßnahme, die dem Grunde nach beschlossen, in der Umsetzung aber von der Zustimmung einer weiteren Stelle abhängig ist. Diese Zustimmung liegt bislang nicht vor.',
      '',
      'Stand: Ein Teil der Maßnahmen ist abgeschlossen, ein weiterer Teil befindet sich in der Planung, der Rest ist zurückgestellt. Die Zurückstellung ist nicht auf fehlende Mittel zurückzuführen, sondern auf offene Abstimmungen.',
      '',
      'Was daraus für Sie folgt: Für die Sitzung ist die Unterscheidung zwischen der Zuständigkeit des Hauses und der Zuständigkeit der beteiligten Stelle die tragende Argumentationslinie. Halten Sie dazu die Maßnahmenliste bereit.',
      '',
      'Lücken im Ausgangsmaterial: Zu zwei Punkten enthält der Text keine Aussage – Datum der letzten Abstimmung und Bindung an Bewilligungsfristen. Beides sollte vor der Sitzung geklärt werden.',
      '',
      HINWEIS_PRUEFEN,
    ],
  },
  {
    keywords: ['bürgeranfrage', 'buergeranfrage', 'antwortentwurf', 'antwortschreiben', 'anwohner'],
    build: () => [
      'Sehr geehrte Damen und Herren,',
      '',
      'vielen Dank für Ihr Schreiben. Ihr Anliegen ist hier eingegangen und wird im zuständigen Fachreferat bearbeitet.',
      '',
      'Zum Sachstand: Das von Ihnen angesprochene Verfahren befindet sich derzeit in der fachlichen Abstimmung. Sobald ein Ergebnis vorliegt, wird darüber in der üblichen Form unterrichtet.',
      '',
      'Zu Ihrer konkreten Frage: Die von Ihnen genannte Maßnahme gehört zum Prüfumfang. Über ihre Anordnung entscheidet die zuständige Behörde im Einzelfall auf Grundlage der einschlägigen Vorschriften. Eine Vorentscheidung ist mit der Prüfung nicht verbunden; über das Ergebnis informieren wir Sie unaufgefordert.',
      '',
      'Für Rückfragen stehen wir Ihnen unter der im Briefkopf genannten Nummer zur Verfügung.',
      '',
      'Mit freundlichen Grüßen',
      '',
      'Hinweis: Ergänzen Sie Anrede, Aktenzeichen und Datum aus dem Vorgang. ' + HINWEIS_PRUEFEN,
    ],
  },
  {
    keywords: ['haushalt', 'kapitel', 'titel', 'erläuterungstext', 'erlaeuterungstext', 'einzelplan'],
    build: () => [
      'Erläuterungen zum Haushaltsansatz',
      '',
      'Das Kapitel weist für das Planjahr Ausgaben aus, die gegenüber dem laufenden Jahr steigen. Die Steigerung ist überwiegend gebunden und beruht nicht auf neuen Aufgaben.',
      '',
      'Der größte Anteil entfällt auf die Tarifentwicklung bei den Personalausgaben, ein weiterer auf den laufenden Betrieb der eingesetzten Fachverfahren. Frei disponibel bleibt nur ein geringer Teil des Zuwachses.',
      '',
      'Die Verpflichtungsermächtigungen betreffen mehrjährige Vorhaben, deren Vergabe im Planjahr vorbereitet, deren Zahlungswirksamkeit jedoch erst im Folgejahr eintritt.',
      '',
      'Die Ansätze für Fortbildung bleiben nominal unverändert. Bei gestiegener Zahl der Berechtigten ist darauf gesondert hinzuweisen.',
      '',
      'Prüfhinweis, getrennt vom Text: Setzen Sie die konkreten Zahlen aus Ihren Eckdaten ein. Die Zuordnung der Titel und die Darstellung der Verpflichtungsermächtigungen richten sich nach der Landeshaushaltsordnung – ich habe keine Rechtsquelle geprüft.',
    ],
  },
  {
    keywords: ['beschlussvorlage', 'vorlage prüf', 'vorlage pruef', 'rückfragen', 'rueckfragen', 'gremium'],
    build: () => [
      'Prüfung der Vorlage – Verständlichkeit und erwartbare Rückfragen',
      '',
      'Verständlichkeit: Der Beschlussvorschlag steht am Ende und ist von der Begründung nicht klar abgesetzt. Ziehen Sie ihn nach vorn und formulieren Sie ihn in einem Satz. Drei Fachbegriffe werden ohne Erläuterung verwendet; für ein politisches Gremium sollten sie einmal erklärt werden.',
      '',
      'Zahlen: Die Vorlage nennt Beträge in unterschiedlicher Genauigkeit. Vereinheitlichen Sie die Darstellung, sonst entsteht in der Sitzung eine Diskussion über die Zahlen statt über die Sache.',
      '',
      'Erwartbare Rückfragen:',
      '- Welche Alternative wurde geprüft und warum verworfen?',
      '- Welche Folgekosten entstehen in den kommenden drei Haushaltsjahren?',
      '- Wer ist beteiligt worden, und liegen die Stellungnahmen vor?',
      '- Was passiert, wenn die Entscheidung vertagt wird?',
      '',
      'Nicht beantwortbar aus der Vorlage: die Frage nach den Folgekosten. Ergänzen Sie dazu einen Absatz, bevor die Vorlage in den Umlauf geht.',
    ],
  },
  {
    keywords: ['personalrat', 'mitbestimmung', 'dienstvereinbarung', 'lpvg'],
    build: () => [
      'Ich sortiere die Punkte, bewerte sie aber nicht rechtlich.',
      '',
      'Voraussichtlich beteiligungsrelevant: alles, was konkrete Beschäftigte betrifft – Umsetzungen, Arbeitszeitverteilung, Bereitschaftsdienste, Auswahlentscheidungen.',
      '',
      'Voraussichtlich Anregung: Verfahrenswünsche, Informationsbitten und Kritik an Organisationsentscheidungen als solche.',
      '',
      'Zu klären: Formulierungen, die offenlassen, ob eine personelle Maßnahme oder nur die Geschäftsverteilung gemeint ist. Genau daran entscheidet sich die Einordnung.',
      '',
      'Welche Maßnahme mitbestimmungs-, mitwirkungs- oder anhörungspflichtig ist, ergibt sich aus dem Landespersonalvertretungsgesetz und der örtlichen Praxis. Ich nenne dazu bewusst keine Paragrafen. Stimmen Sie die Zuordnung mit dem Personalreferat ab.',
    ],
  },
  {
    keywords: ['protokoll', 'sitzung', 'tagesordnung', 'einladung'],
    build: () => [
      'Entwurf für die Sitzungsunterlage',
      '',
      'Sehr geehrte Damen und Herren,',
      '',
      'zur nächsten Sitzung lade ich Sie ein. Ort, Datum und Uhrzeit bitte aus Ihrem Terminplan ergänzen.',
      '',
      'Tagesordnung:',
      '1. Eröffnung, Feststellung der Beschlussfähigkeit, Genehmigung der Tagesordnung',
      '2. Genehmigung des Protokolls der vorangegangenen Sitzung',
      '3. Sachthema mit Beschlussfassung',
      '4. Berichte der Verwaltung',
      '5. Verschiedenes',
      '',
      'Die Unterlagen werden fristgerecht über die E-Akte bereitgestellt.',
      '',
      'Mit freundlichen Grüßen',
      '',
      'Wenn die Sitzung aufgezeichnet werden soll, ergänzen Sie einen Hinweis zur Protokollführung und stimmen ihn mit der oder dem behördlichen Datenschutzbeauftragten ab.',
    ],
  },
  {
    keywords: ['datenschutz', 'dsgvo', 'personenbezogen', 'pseudonym'],
    build: () => [
      'Grundsätzlich gilt in F13: Verwaltungsinterne Sachinformationen dürfen eingegeben werden, personenbezogene Daten nur soweit unvermeidbar und niemals besondere Kategorien nach Art. 9 DSGVO.',
      '',
      'Praktisches Vorgehen: Ersetzen Sie Namen vor der Eingabe durch Platzhalter wie „die Antragstellerin“ oder „Person A“. Entfernen Sie Anschriften, Geburtsdaten, Aktenzeichen mit Personenbezug, Gesundheitsangaben und Angaben zu Religion, Gewerkschaftszugehörigkeit oder Sexualleben.',
      '',
      'Was Sie behalten können: die Sachfrage, die maßgeblichen Termine ohne Personenbezug, den Verfahrensstand, die zu prüfenden Kriterien. In fast allen Fällen genügt das für einen brauchbaren Entwurf.',
      '',
      'Setzen Sie die Klarnamen erst am Ende in Ihrem Textverarbeitungsprogramm wieder ein – nicht in F13.',
      '',
      'Die verbindliche Regelung steht in der Dienstanweisung über den Einsatz KI-gestützter Assistenzsysteme. Im Zweifel fragen Sie die Datenschutzbeauftragte Ihres Hauses.',
    ],
  },
];

const FALLBACK: string[] = [
  'Ich habe Ihre Anfrage aufgenommen und beantworte sie auf Grundlage des übermittelten Textes.',
  '',
  'Einordnung: Der geschilderte Sachverhalt lässt sich in drei Schritte gliedern – Sachstand feststellen, Zuständigkeit klären, Entscheidungsvorschlag formulieren. Für die ersten beiden Schritte liegen die nötigen Angaben vor, für den dritten fehlen Angaben zur Kostenfolge.',
  '',
  'Vorschlag für das weitere Vorgehen:',
  '- Halten Sie den Sachstand in einem kurzen Vermerk fest und benennen Sie ausdrücklich, was offen ist.',
  '- Klären Sie die Zuständigkeit, bevor Sie Inhalt formulieren. Ein sachlich richtiger Entwurf der falschen Stelle hilft nicht weiter.',
  '- Formulieren Sie den Entscheidungsvorschlag erst, wenn die Kostenfolge belegt ist.',
  '',
  'Wenn Sie mir das zugrunde liegende Dokument anhängen, kann ich konkreter werden – insbesondere bei Fristen, Beträgen und Verfahrensschritten.',
  '',
  HINWEIS_PRUEFEN,
];

export function buildReply(prompt: string, ctx: { modelId: ModelId; attachments: Attachment[] }): {
  text: string;
  paragraphs: number;
} {
  const needle = prompt.toLowerCase();
  const rule = RULES.find((r) => r.keywords.some((k) => needle.includes(k)));
  let lines = rule ? rule.build(ctx) : FALLBACK;

  /* Das schnelle Modell antwortet kürzer, das große ergänzt eine Einordnung. */
  if (ctx.modelId === 'gemma-4' && lines.length > 9) {
    lines = lines.slice(0, 9);
  }
  if (ctx.modelId === 'gpt-oss-120b') {
    lines = [
      ...lines,
      '',
      'Ergänzende Einordnung: Prüfen Sie, ob zu dem Vorgang bereits ein Beschluss oder eine Weisung existiert. Entwürfe, die einen vorhandenen Beschluss ignorieren, verursachen im Umlauf mehr Arbeit als sie sparen.',
    ];
  }

  const text = lines.join('\n');
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  return { text, paragraphs };
}
