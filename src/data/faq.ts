import type { FaqCategory, FaqItem } from '../types';

export const FAQ_CATEGORIES: FaqCategory[] = [
  'Erste Schritte',
  'Datenschutz & Sicherheit',
  'Chat',
  'Meetingassistenz',
  'Technische Probleme',
];

export const FAQ: FaqItem[] = [
  /* --- Erste Schritte --- */
  {
    id: 'anmeldung',
    category: 'Erste Schritte',
    question: 'Wie melde ich mich bei F13 an, und was tue ich, wenn die Anmeldung nicht funktioniert?',
    answer: [
      'F13 ist nur aus dem Landesverwaltungsnetz erreichbar. Melden Sie sich mit Ihrer dienstlichen E-Mail-Adresse und Ihrem Passwort an.',
      'Wenn die Anmeldung scheitert, prüfen Sie in dieser Reihenfolge:',
      '- Sind Sie im Dienstnetz oder über den Dienst-VPN verbunden? Aus dem offenen Internet ist F13 nicht erreichbar.',
      '- Verwenden Sie die dienstliche Adresse in der vollständigen Form vorname.nachname@mvcr.landesverwaltung.de? Kurzformen und persönliche Adressen werden nicht akzeptiert.',
      '- Ist Ihr Zugang freigeschaltet? Die Freischaltung erfolgt durch das Referat Z 1 nach einer Registrierung, nicht automatisch mit dem Dienstantritt. Über die Schaltfläche „Registrieren“ auf der Anmeldemaske beantragen Sie den Zugang.',
      'Bleibt es dabei, wenden Sie sich an den Servicedesk. Die Passwortzurücksetzung erfolgt über die üblichen Wege der Benutzerverwaltung, nicht über F13.',
    ],
  },
  {
    id: 'modellwahl',
    category: 'Erste Schritte',
    question: 'Welches Modell soll ich wofür verwenden?',
    answer: [
      'In F13 stehen zwei Modelle zur Verfügung, beide im Rechenzentrum der Verwaltung betrieben.',
      '- GPT-OSS 120B: das größere Modell. Geeignet für längere Vermerke, das Sortieren komplexer Sachverhalte, Argumentationsketten, mehrseitige Zusammenfassungen und alles, wo Sorgfalt vor Geschwindigkeit geht. Es antwortet erkennbar langsamer.',
      '- Gemma 4: das kompakte Modell. Geeignet für kurze Texte: Antwortentwürfe, Umformulierungen, Betreffzeilen, Stichwortlisten, Glätten eines vorhandenen Absatzes. Es antwortet spürbar schneller, wird bei komplexen Fragen aber ungenauer.',
      'Praktische Regel: Beginnen Sie mit Gemma 4. Wenn die Antwort zu oberflächlich bleibt oder Zusammenhänge übersieht, wechseln Sie zu GPT-OSS 120B und stellen dieselbe Frage erneut. Das Modell lässt sich jederzeit über die Auswahl neben dem Eingabefeld wechseln; laufende Unterhaltungen bleiben dabei erhalten.',
      'Bei jeder Antwort ist unterhalb des Textes angegeben, welches Modell sie erzeugt hat.',
    ],
  },
  {
    id: 'grenzen',
    category: 'Erste Schritte',
    question: 'Wofür ist F13 nicht gedacht?',
    answer: [
      'F13 ist ein Assistenzsystem für Entwurfs- und Vorarbeiten. Es ist ausdrücklich nicht geeignet für:',
      '- rechtsverbindliche Aussagen, Bescheide oder Verfügungen im Wortlaut,',
      '- die Ausübung von Ermessen; Ermessen ist der Verwaltung persönlich übertragen und nicht delegierbar,',
      '- abschließende Entscheidungen in Personal-, Sozial- oder Ordnungsverfahren,',
      '- die Ermittlung von Rechtsgrundlagen, Fundstellen oder Aktenzeichen,',
      '- die Bewertung von Personen, etwa in Auswahlverfahren oder dienstlichen Beurteilungen.',
      'Was F13 gut kann: Material sortieren, Entwürfe formulieren, Fragen antizipieren, Struktur vorschlagen, Textlängen anpassen, Fachsprache in Bürgersprache übersetzen und umgekehrt.',
    ],
  },

  /* --- Datenschutz & Sicherheit --- */
  {
    id: 'welche-daten',
    category: 'Datenschutz & Sicherheit',
    question: 'Welche Daten darf ich in F13 eingeben und welche nicht?',
    answer: [
      'Zulässig sind verwaltungsinterne Sachinformationen ohne Personenbezug: Vermerke, Sachstände, Zahlen aus Haushaltsunterlagen, Entwürfe, Tagesordnungen, Sitzungsunterlagen, allgemeine Fachfragen.',
      'Nicht zulässig sind:',
      '- besondere Kategorien personenbezogener Daten nach Art. 9 DSGVO, also Angaben zu Gesundheit, Religion, politischer Meinung, Gewerkschaftszugehörigkeit, ethnischer Herkunft, Sexualleben oder biometrische Daten,',
      '- Sozialdaten im Sinne des Sozialgesetzbuchs,',
      '- Daten aus laufenden Personalverfahren, Beurteilungen und Disziplinarangelegenheiten,',
      '- als Verschlusssache eingestufte Informationen jeder Stufe,',
      '- Zugangsdaten, Kennwörter, Schlüsselmaterial.',
      'Einfache personenbezogene Daten wie Name und Amtsbezeichnung dürfen nur eingegeben werden, soweit dies für die Aufgabe erforderlich ist. In den meisten Fällen ist es nicht erforderlich: Ersetzen Sie Namen vor der Eingabe durch Platzhalter und setzen Sie sie am Ende in Ihrem Textprogramm wieder ein.',
      'Verbindlich ist die Dienstanweisung über den Einsatz KI-gestützter Assistenzsysteme. Sie finden sie in der Dokumentenablage.',
    ],
  },
  {
    id: 'training',
    category: 'Datenschutz & Sicherheit',
    question: 'Werden meine Eingaben zum Training der Modelle verwendet?',
    answer: [
      'Nein. Die in F13 eingesetzten Modelle werden nicht mit Ihren Eingaben weitertrainiert. Beide Modelle liegen als feste Modellstände im Rechenzentrum und werden nur im Rahmen geplanter Versionswechsel ausgetauscht.',
      'Auch die Bewertungen „hilfreich“ und „nicht hilfreich“ fließen nicht in ein Training ein. Sie werden ausschließlich statistisch ausgewertet, um erkennen zu können, welche Anwendungsfälle schlecht funktionieren.',
      'Ihre Eingaben verlassen das Landesverwaltungsnetz nicht. Es besteht keine Verbindung zu Anbietern außerhalb der Verwaltung.',
    ],
  },
  {
    id: 'hosting',
    category: 'Datenschutz & Sicherheit',
    question: 'Wo werden die Modelle betrieben und wer hat Zugriff?',
    answer: [
      'Beide Modelle werden auf Servern des Landesbetriebs für Informationstechnik betrieben – ausschließlich in Rechenzentren innerhalb Deutschlands, ohne Anbindung an externe Dienste. Deshalb tragen sie in der Modellauswahl die Kennzeichnung „On-Premise“.',
      'Zugriff auf Inhalte haben:',
      '- Sie selbst auf Ihre eigenen Chatverläufe, Dokumente und Aufnahmen,',
      '- niemand sonst im Regelbetrieb; insbesondere sehen Vorgesetzte Ihre Verläufe nicht,',
      '- administrative Kräfte des Landesbetriebs nur im Rahmen einer dokumentierten Störungsbearbeitung und nach dem Vier-Augen-Prinzip.',
      'Die Administration Ihres Hauses sieht Nutzungszahlen in aggregierter Form – wie viele Anfragen gestellt wurden, welche Modelle verwendet werden –, aber keine Inhalte.',
    ],
  },
  {
    id: 'buergerdaten',
    category: 'Datenschutz & Sicherheit',
    question: 'Darf ich Personendaten aus Bürgeranfragen einfügen?',
    answer: [
      'Nur pseudonymisiert. Für einen brauchbaren Antwortentwurf braucht das Modell den Sachverhalt, nicht die Identität der Person.',
      'Vorgehen in drei Schritten:',
      '- Entfernen Sie Name, Anschrift, Geburtsdatum, Telefonnummer, E-Mail-Adresse und alle Angaben, die eine Person eindeutig kennzeichnen.',
      '- Ersetzen Sie sie durch neutrale Platzhalter: „die Antragstellerin“, „Person A“, „das Grundstück im Plangebiet“.',
      '- Setzen Sie die Klarnamen erst am Ende in Ihrem Textverarbeitungsprogramm ein, nicht in F13.',
      'Das gilt auch für angehängte Dokumente. Ein PDF, das Sie hochladen, wird vollständig verarbeitet – auch die Absenderangaben auf Seite 1. Wenn Sie das Original nicht bearbeiten können, geben Sie den Sachverhalt lieber in eigenen Worten ein.',
      'Sonderfall Unterschriftenlisten: Sie enthalten regelmäßig viele Namen und Anschriften und dürfen nicht hochgeladen werden. Die Zahl der Unterzeichnenden genügt.',
    ],
  },
  {
    id: 'speicherdauer',
    category: 'Datenschutz & Sicherheit',
    question: 'Wie lange werden Chatverläufe und Aufnahmen gespeichert?',
    answer: [
      'Chatverläufe: Die Aufbewahrungsdauer stellen Sie selbst in den Einstellungen ein – 7, 30, 90 oder 365 Tage. Voreingestellt sind 30 Tage. Nach Ablauf werden die Verläufe automatisch und ohne Wiederherstellungsmöglichkeit gelöscht. Wählen Sie „manuell“, bleiben Verläufe, bis Sie sie selbst löschen.',
      'Aufnahmen der Meetingassistenz: Die Audiodatei wird gelöscht, sobald das Protokoll freigegeben oder in die E-Akte übergeben wurde, längstens nach 30 Tagen.',
      'Transkripte: werden zusammen mit der Aufnahme gelöscht. Wenn Sie das Transkript behalten möchten, exportieren Sie es oder legen Sie es in der E-Akte ab.',
      'Hochgeladene Dokumente: bleiben in der Dokumentenablage, bis Sie sie löschen. Die Ablage ist kein Aktenersatz – für die Aktenführung ist die E-Akte maßgeblich.',
      'Wichtig: Was in die Akte gehört, muss in die Akte. F13 ersetzt die Aktenführung nicht, und die Löschfristen von F13 heben Aufbewahrungspflichten nicht auf.',
    ],
  },
  {
    id: 'personalrat',
    category: 'Datenschutz & Sicherheit',
    question: 'Wie gehe ich mit Dienst- und Personalratsbeteiligung um?',
    answer: [
      'Die Einführung von F13 als solche ist bereits mitbestimmt: Der Einsatz beruht auf einer Dienstvereinbarung mit der Personalvertretung. Sie müssen die Nutzung nicht im Einzelfall anzeigen.',
      'Nicht abgedeckt sind Verwendungen außerhalb der Dienstvereinbarung. Dazu gehören insbesondere:',
      '- die Auswertung von Beschäftigtendaten, auch in aggregierter Form,',
      '- Textentwürfe, die eine Person bewerten (Beurteilungen, Auswahlvermerke, Abmahnungen),',
      '- der Einsatz in laufenden Personal- oder Disziplinarverfahren,',
      '- die Aufzeichnung von Besprechungen, in denen Beschäftigte über eigene Angelegenheiten sprechen.',
      'Wenn Sie F13 in einem Personalvorgang einsetzen möchten, klären Sie das vorher mit dem Personalreferat. Bei Sitzungen mit Beschäftigtenbeteiligung gilt: Die Aufzeichnung ist zu Beginn anzukündigen, ein Widerspruch ist zu beachten, und die Personalvertretung hat ein Beteiligungsrecht an der Ausgestaltung.',
      'Umgekehrt gilt: Die Personalvertretung darf F13 für ihre eigene Arbeit nutzen. Ihre Verläufe sind für die Dienststelle ebenso unzugänglich wie alle anderen.',
    ],
  },

  /* --- Chat --- */
  {
    id: 'falsche-antwort',
    category: 'Chat',
    question: 'Was mache ich, wenn eine Antwort falsch ist?',
    answer: [
      'Zunächst: Rechnen Sie damit. Falsche Antworten sind kein Ausnahmefall, sondern eine Eigenschaft der Technik. Die Verantwortung für das Ergebnis bleibt in jedem Fall bei Ihnen als bearbeitender Person.',
      'Praktisches Vorgehen:',
      '- Korrigieren Sie im Gespräch, statt neu anzufangen. „Der zweite Absatz ist falsch, die Frist beträgt vier Wochen, nicht zwei. Formuliere ihn neu.“ Das ist fast immer schneller als eine neue Anfrage.',
      '- Bewerten Sie die Antwort mit „nicht hilfreich“. Das kostet einen Klick und hilft dabei, systematisch schwache Anwendungsfälle zu erkennen.',
      '- Prüfen Sie jede Zahl, jede Frist, jedes Aktenzeichen und jede Rechtsnorm an der Quelle. Genau diese Angaben werden am häufigsten falsch erzeugt.',
      '- Wechseln Sie bei fachlich anspruchsvollen Fragen auf GPT-OSS 120B und stellen Sie die Frage erneut.',
      'Wenn eine Antwort erkennbar unsinnig ist oder das Modell auf Nachfragen immer wieder dasselbe wiederholt, beenden Sie die Unterhaltung und beginnen eine neue. Lange Verläufe mit vielen Korrekturen werden mit der Zeit schlechter, nicht besser.',
      'Melden Sie schwerwiegende Fälle – etwa erfundene Rechtsnormen in einem scheinbar belastbaren Text – an die Administration Ihres Hauses.',
    ],
  },
  {
    id: 'kennzeichnung',
    category: 'Chat',
    question: 'Muss ich kennzeichnen, dass ein Text mit KI-Unterstützung entstanden ist?',
    answer: [
      'Im Entwurfsstadium ja: Nach der Dienstanweisung ist im Vorgang zu dokumentieren, dass ein KI-Assistenzsystem eingesetzt wurde. Ein kurzer Vermerk im Bearbeitungsverlauf genügt, etwa „Entwurf mit F13 erstellt, fachlich geprüft am 07.09.2026“.',
      'Im ausgehenden Schreiben nein: Das fertige Schreiben ist eine Erklärung Ihrer Behörde und wird von Ihnen verantwortet. Ein Hinweis auf das Hilfsmittel gehört dort nicht hin – so wie Sie auch nicht angeben, mit welchem Textverarbeitungsprogramm Sie geschrieben haben.',
      'Anders liegt es bei Protokollen: Dort ist die Art der Erstellung Teil der Verfahrensdokumentation. Vermerken Sie, dass ein KI-gestütztes Transkriptionssystem eingesetzt wurde und wer das Protokoll geprüft hat.',
    ],
  },
  {
    id: 'dateiformate',
    category: 'Chat',
    question: 'Welche Dateiformate kann ich anhängen, und wie groß dürfen sie sein?',
    answer: [
      'Unterstützt werden PDF, DOCX, TXT und XLSX. Je Datei sind bis zu 20 MB möglich, je Anfrage bis zu fünf Dateien.',
      'Praktische Hinweise:',
      '- Gescannte PDF ohne Texterkennung enthalten keinen lesbaren Text. Lassen Sie sie vorher durch die Texterkennung Ihres Scanners laufen oder geben Sie den Inhalt ein.',
      '- Große PDF mit mehreren Hundert Seiten führen zu schlechteren Antworten, weil das Modell nur einen Teil verarbeiten kann. Schneiden Sie die relevanten Seiten heraus.',
      '- Bei XLSX werden Werte gelesen, nicht Formeln. Prüfen Sie, ob die maßgeblichen Zahlen als Werte vorliegen.',
      '- Bilder, Präsentationen und ZIP-Archive werden nicht unterstützt.',
      'Anhängen können Sie über die Büroklammer neben dem Eingabefeld, per Drag & Drop auf das Eingabefeld oder aus der Dokumentenablage über „Im Chat verwenden“.',
    ],
  },
  {
    id: 'unterschiedliche-antworten',
    category: 'Chat',
    question: 'Warum bekomme ich auf dieselbe Frage unterschiedliche Antworten?',
    answer: [
      'Die Modelle arbeiten nicht deterministisch: Sie wählen den nächsten Textbaustein aus einer Wahrscheinlichkeitsverteilung. Dieselbe Eingabe kann daher zu unterschiedlichen Formulierungen führen. Das ist gewollt und nicht behebbar.',
      'Für die Praxis bedeutet das zwei Dinge:',
      '- Verlassen Sie sich nicht darauf, eine gelungene Antwort später erneut erzeugen zu können. Speichern Sie brauchbare Formulierungen sofort in Ihrem Vorgang.',
      '- Nutzen Sie es umgekehrt bewusst: „Neu generieren“ liefert eine andere Fassung derselben Antwort. Bei Formulierungsfragen ist das ein schneller Weg zu Varianten.',
      'Inhaltliche Widersprüche zwischen zwei Antworten auf dieselbe Frage sind ein deutliches Warnzeichen: In der Regel ist die Frage nicht verlässlich beantwortbar, oder das Modell füllt eine Lücke frei.',
    ],
  },

  /* --- Meetingassistenz --- */
  {
    id: 'aufzeichnung-information',
    category: 'Meetingassistenz',
    question: 'Muss ich Teilnehmende über die Aufzeichnung informieren?',
    answer: [
      'Ja, ausnahmslos und vor Beginn der Aufzeichnung. Eine heimliche Aufzeichnung ist unzulässig; das gilt auch für den dienstlichen Bereich.',
      'Als Mindestmaß hat sich bewährt:',
      '- Hinweis in der Einladung, dass zur Protokollerstellung aufgezeichnet und transkribiert wird,',
      '- mündliche Ankündigung zu Beginn der Sitzung, protokolliert im Eröffnungsteil,',
      '- Angabe, wo die Daten verarbeitet werden und wann sie gelöscht werden,',
      '- ausdrückliche Gelegenheit zum Widerspruch.',
      'Widerspricht eine Person, wird nicht aufgezeichnet. Ein Ausweichen auf „dann protokolliere ich nur die Beschlüsse mit“ ist keine Lösung, weil die Aufzeichnung auch dann läuft. Protokollieren Sie in diesem Fall konventionell.',
      'Bei Sitzungen mit Gästen oder Bürgerbeteiligung ist besondere Zurückhaltung geboten: Wer sich als Betroffener äußert, kann einem Widerspruch praktisch nicht frei nachkommen. Verzichten Sie dort auf die Aufzeichnung.',
      'Ob eine Aufzeichnung in Ihrem Gremium überhaupt zulässig ist, richtet sich nach der Geschäftsordnung. Prüfen Sie das einmalig für Ihr Gremium und halten Sie das Ergebnis fest.',
    ],
  },
  {
    id: 'protokoll-verbindlich',
    category: 'Meetingassistenz',
    question: 'Ist das erzeugte Protokoll rechtlich verbindlich?',
    answer: [
      'Nein. Das von F13 erzeugte Protokoll ist ein Entwurf. Verbindlich wird ein Protokoll erst durch die Zeichnung der Schriftführung und – wo die Geschäftsordnung es vorsieht – durch die Genehmigung des Gremiums in der folgenden Sitzung.',
      'Was Sie vor der Weitergabe prüfen müssen:',
      '- den Wortlaut jedes Beschlusses; hier zählt jedes Wort, und genau hier sind Transkriptionsfehler am folgenreichsten,',
      '- alle Abstimmungsergebnisse gegen Ihre eigene Zählung,',
      '- die Anwesenheitsliste und die Feststellung der Beschlussfähigkeit,',
      '- Namen, Zahlen, Beträge, Fristen und Aktenzeichen,',
      '- die Zuordnung der Redebeiträge zu den Sprechenden.',
      'Bearbeitete Abschnitte werden im Editor mit „bearbeitet“ gekennzeichnet. Diese Kennzeichnung ist eine Arbeitshilfe für Sie und kein Nachweis: Sie belegt nicht, dass ein Abschnitt geprüft wurde, sondern nur, dass er geändert wurde.',
    ],
  },
  {
    id: 'sprechererkennung',
    category: 'Meetingassistenz',
    question: 'Wie gut ist die Sprechererkennung, und was mache ich bei Fehlern?',
    answer: [
      'Die Erkennung trennt Stimmen zuverlässig, kennt aber keine Namen. Sie erhalten zunächst „Sprecher A“, „Sprecher B“ und so weiter und ordnen die Klarnamen selbst zu.',
      'Zwei Wege stehen dafür zur Verfügung, beide gleichwertig:',
      '- im Zuordnungsdialog neben dem Transkript, wo der Assistent nachfragt und Vorschläge macht,',
      '- direkt im Transkript: Sprechername anklicken oder mit der Tastatur ansteuern und ändern. Die Änderung wirkt sofort auf alle Beiträge dieses Sprechers.',
      'Typische Fehlerbilder:',
      '- Zwei Personen mit ähnlicher Stimmlage werden zusammengefasst. Erkennbar daran, dass ein Sprecher unplausibel viele Beiträge hat.',
      '- Eine Person wird auf zwei Sprecher verteilt, etwa wenn sie zwischen Mikrofon und Freisprecheinrichtung wechselt.',
      '- Zwischenrufe und paralleles Sprechen werden dem zuletzt erkannten Sprecher zugeschlagen.',
      'Bei starkem Stimmengewirr ist eine nachträgliche Korrektur aufwendig. Die wirksamste Gegenmaßnahme liegt vor der Sitzung: ein Mikrofon in der Tischmitte, Rederecht über die Sitzungsleitung, und zu Beginn eine Vorstellungsrunde – die liefert der Erkennung eine saubere Stimmprobe je Person.',
    ],
  },

  /* --- Technische Probleme --- */
  {
    id: 'abbruch',
    category: 'Technische Probleme',
    question: 'Die Antwort bricht mitten im Satz ab. Was tun?',
    answer: [
      'Häufigste Ursache ist die Längenbegrenzung je Antwort. Schreiben Sie „Fahre fort“ – das Modell setzt an der Abbruchstelle an.',
      'Wenn das mehrfach passiert, ist die Aufgabe zu groß gestellt. Teilen Sie sie: erst die Gliederung erzeugen, dann Abschnitt für Abschnitt ausformulieren. Das liefert auch bessere Ergebnisse als ein einzelner langer Auftrag.',
      'Bricht der Text sofort nach wenigen Zeichen ab und erscheint eine Fehlermeldung, liegt eine Störung vor. Versuchen Sie es nach zwei Minuten erneut und wechseln Sie testweise das Modell. Bleibt es dabei, melden Sie die Störung mit Uhrzeit und verwendetem Modell an den IT-Service.',
    ],
  },
  {
    id: 'upload-fehler',
    category: 'Technische Probleme',
    question: 'Der Upload eines Dokuments schlägt fehl.',
    answer: [
      'Prüfen Sie die drei häufigsten Ursachen:',
      '- Dateiformat: Zulässig sind PDF, DOCX, TXT und XLSX. Ältere Formate wie DOC oder XLS müssen Sie vorher umspeichern.',
      '- Dateigröße: Die Grenze liegt bei 20 MB. Bei umfangreichen PDF hilft es, nur die benötigten Seiten zu exportieren.',
      '- Schreibschutz: Kennwortgeschützte oder mit einem Rechteschutz versehene PDF können nicht gelesen werden. Heben Sie den Schutz in der Quelle auf.',
      'Bricht der Upload bei mehreren Dateien gleichzeitig ab, laden Sie sie einzeln hoch. Die Fortschrittsanzeige nennt bei jedem Fehler die betroffene Datei und den Grund.',
    ],
  },
  {
    id: 'barrierefreiheit-melden',
    category: 'Technische Probleme',
    question: 'Eine Funktion ist mit Tastatur oder Screenreader nicht bedienbar. Wohin melde ich das?',
    answer: [
      'Solche Meldungen sind ausdrücklich erwünscht und werden vorrangig behandelt. F13 unterliegt der Barrierefreie-Informationstechnik-Verordnung; Bedienbarkeit ohne Maus und mit Hilfsmitteln ist keine Zusatzausstattung, sondern Anforderung.',
      'Melden Sie an die Administration Ihres Hauses und geben Sie dabei an:',
      '- welche Ansicht und welches Bedienelement betroffen sind,',
      '- was Sie erwartet haben und was stattdessen passiert ist,',
      '- welches Hilfsmittel Sie verwenden, mit Version (Screenreader, Vergrößerungssoftware, Spracheingabe),',
      '- Browser und Betriebssystemversion.',
      'Eine Übersicht der Tastaturkürzel finden Sie unter „Tipps & Tricks“ und über die Schaltfläche „Tastaturkürzel“ im Kopfbereich. Die Erklärung zur Barrierefreiheit ist über den Fußbereich erreichbar.',
    ],
  },
];
