import type { TipArticle } from '../types';

export const TIPS: TipArticle[] = [
  {
    id: 'gute-prompts',
    title: 'Gute Prompts schreiben',
    category: 'Grundlagen',
    readingMinutes: 6,
    teaser:
      'Fünf Bausteine – Rolle, Kontext, Aufgabe, Format, Zielgruppe – machen aus einer vagen Frage einen brauchbaren Auftrag. Mit Gegenbeispielen aus dem Verwaltungsalltag.',
    related: ['iteratives-arbeiten', 'dokumente-nutzen', 'grenzen-der-anwendung'],
    body: [
      {
        kind: 'para',
        text: 'Die Qualität einer Antwort hängt weniger vom Modell ab als von der Frage. Ein Auftrag, den Sie einer neuen Kollegin am ersten Arbeitstag so geben würden, funktioniert auch hier: mit Zusammenhang, klarem Ziel und einer Vorstellung davon, wie das Ergebnis aussehen soll.',
      },
      { kind: 'heading', text: 'Die fünf Bausteine' },
      {
        kind: 'list',
        items: [
          'Rolle: Aus welcher fachlichen Perspektive soll geschrieben werden? „Du bist Sachbearbeiterin im Referat für Fachaufsicht.“',
          'Kontext: Was ist die Vorgeschichte, was liegt vor, was ist entschieden? Zwei Sätze genügen meist.',
          'Aufgabe: Ein Verb, ein Gegenstand. Zusammenfassen, formulieren, gliedern, prüfen, übersetzen.',
          'Format: Länge, Form, Aufbau. „Maximal 300 Wörter“, „als Tabelle“, „drei Stichpunkte“, „Fließtext ohne Überschriften“.',
          'Zielgruppe: Wer liest das? Ein Fachausschuss des Landtags, eine Bürgerin, die Abteilungsleitung, das Justiziariat – der Unterschied ist erheblich.',
        ],
      },
      {
        kind: 'compare',
        weak: 'Schreib was zum Haushalt.',
        strong:
          'Du bist Sachbearbeiter im Haushaltsreferat. Formuliere aus den folgenden Eckdaten einen Erläuterungstext zu Kapitel 1403, sachlich, maximal 300 Wörter, adressiert an den Haushaltsausschuss des Landtags.',
        note: 'Die schwache Fassung liefert einen beliebigen Text zu einem beliebigen Haushalt. Die starke Fassung enthält alle fünf Bausteine und ist in einem Durchgang verwendbar.',
      },
      {
        kind: 'compare',
        weak: 'Fasse das zusammen.',
        strong:
          'Fasse diesen Vermerk auf eine halbe Seite zusammen. Zielgruppe ist die Abteilungsleitung, die morgen im Lenkungskreis dazu Stellung nehmen muss. Nenne am Ende ausdrücklich, welche Angaben im Vermerk fehlen.',
        note: 'Der Zusatz zur Verwendungssituation verändert die Auswahl: Nicht der vollständige Inhalt ist wichtig, sondern das, was in der Sitzung tragen muss. Die Bitte um die Lücken erspart eine Nachfrage.',
      },
      {
        kind: 'compare',
        weak: 'Ist das rechtlich in Ordnung?',
        strong:
          'Sortiere die Punkte dieser Stellungnahme danach, ob sie eine personelle Einzelmaßnahme, eine Organisationsentscheidung oder ein Verfahrensanliegen betreffen. Bewerte nicht rechtlich – ich brauche eine Sortierung für das Gespräch mit dem Personalreferat.',
        note: 'Rechtsfragen kann das Modell nicht verlässlich beantworten. Die starke Fassung nutzt es für das, was es gut kann: Material ordnen. Die Bewertung bleibt bei der zuständigen Stelle.',
      },
      { kind: 'heading', text: 'Was zusätzlich hilft' },
      {
        kind: 'list',
        items: [
          'Negativanweisungen sind wirksam: „Keine Rechtsverweise“, „keine Zwischenüberschriften“, „keine Aufzählungen“.',
          'Ein Beispiel schlägt jede Beschreibung. Hängen Sie ein früheres Schreiben an und schreiben Sie „im Stil dieses Schreibens“.',
          'Der Adressat prägt den Ton stärker als jede Stilanweisung. „Adressiert an eine Bürgerin ohne Verwaltungserfahrung“ wirkt mehr als „einfach formuliert“.',
          'Fragen Sie am Ende nach den Lücken: „Was fehlt in meinen Angaben, um die Aufgabe sauber zu erledigen?“ Das deckt eigene Denkfehler auf.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Kurz gefasst',
        text: 'Rolle, Kontext, Aufgabe, Format, Zielgruppe. Wenn eine Antwort nicht passt, fehlt fast immer einer dieser fünf Bausteine – nicht das bessere Modell.',
      },
    ],
  },

  {
    id: 'halluzinationen',
    title: 'Halluzinationen erkennen und vermeiden',
    category: 'Qualitätssicherung',
    readingMinutes: 7,
    teaser:
      'Sprachmodelle erfinden Paragrafen, Aktenzeichen und Zahlen – flüssig und selbstbewusst. Woran Sie es erkennen und wie Sie sich schützen.',
    related: ['gute-prompts', 'grenzen-der-anwendung', 'iteratives-arbeiten'],
    body: [
      {
        kind: 'para',
        text: 'Als Halluzination bezeichnet man eine Ausgabe, die sprachlich einwandfrei und inhaltlich falsch ist: ein Paragraf, den es nicht gibt, ein Urteil, das nie ergangen ist, eine Zahl, die niemand erhoben hat. Das ist kein Fehler im engeren Sinn, sondern eine Folge der Funktionsweise.',
      },
      { kind: 'heading', text: 'Warum das entsteht' },
      {
        kind: 'para',
        text: 'Ein Sprachmodell sagt den nächsten Textbaustein voraus. Es hat kein Verzeichnis von Rechtsnormen und keinen Zugriff auf Ihre Akten, sondern ein statistisches Bild davon, wie Texte üblicherweise weitergehen. Nach „geregelt in § “ ist irgendeine Paragrafennummer die wahrscheinlichste Fortsetzung – und das Modell wählt eine. Es „weiß“ nicht, dass es rät, und markiert Unsicherheit deshalb auch nicht.',
      },
      {
        kind: 'para',
        text: 'Erschwerend kommt hinzu: Der sprachliche Ton bleibt gleich. Ein erfundener Paragraf steht im selben souveränen Verwaltungsdeutsch wie eine zutreffende Angabe. Auf den Klang können Sie sich nicht verlassen.',
      },
      { kind: 'heading', text: 'Typische Warnzeichen' },
      {
        kind: 'list',
        items: [
          'Paragrafen und Rechtsnormen: erfundene Nummern, existierende Nummern mit falschem Inhalt, oder Verwechslung von Bundes- und Landesrecht.',
          'Aktenzeichen und Geschäftszeichen: sehen plausibel aus, weil das Modell das Muster kennt – ohne den konkreten Vorgang zu kennen.',
          'Fundstellen und Zitate: erfundene Urteile, Erlasse, Kommentarstellen, Seitenzahlen. Ein häufiges Muster ist ein echtes Gericht mit einem erfundenen Aktenzeichen.',
          'Zahlen und Fristen: „vier Wochen“, „drei Monate“, „bis zum 31. Dezember“ – Werte, die üblich klingen, aber nicht aus Ihrem Vorgang stammen.',
          'Zuständigkeiten: erfundene Amtsbezeichnungen oder Behörden, die es in Ihrem Land nicht gibt.',
          'Übergenauigkeit: Wenn eine Antwort präziser ist als Ihre Eingabe es zulässt, ist die Präzision erfunden. Das ist das verlässlichste Warnzeichen von allen.',
        ],
      },
      { kind: 'heading', text: 'Gegenstrategien' },
      {
        kind: 'ordered',
        items: [
          'Fordern Sie ausdrücklich Zurückhaltung: „Nenne keine Paragrafen und keine Fundstellen. Wenn dir eine Angabe fehlt, schreibe, welche.“ Beide Modelle in F13 halten sich daran gut.',
          'Fragen Sie nach den Grundlagen: „Woraus ergibt sich das? Nenne mir die Stelle in meinem angehängten Dokument.“ Wenn keine Stelle benannt werden kann, stammt die Aussage nicht aus dem Dokument.',
          'Prüfen Sie Zahlen gegen die Quelle, nicht gegen das Gefühl. Beträge, Prozentwerte, Fristen und Stückzahlen sind mit einem Blick in die Vorlage geprüft.',
          'Arbeiten Sie mit Anhängen. Ein Modell, das aus einem beigefügten Dokument arbeitet, erfindet weniger als eines, das aus dem Nichts formulieren muss.',
          'Stellen Sie dieselbe fachliche Frage zweimal, gern mit beiden Modellen. Widersprechen sich die Antworten, ist die Frage nicht verlässlich beantwortbar.',
          'Markieren Sie im Entwurf jede Angabe, die Sie noch nicht geprüft haben. Was ungeprüft im Text bleibt, verschwindet sonst genau bis zur Zeichnung.',
        ],
      },
      {
        kind: 'compare',
        weak: 'Welche Fristen gelten für den Widerspruch?',
        strong:
          'Ich habe die Widerspruchsfrist aus dem Bescheid im Anhang. Prüfe, ob mein Antwortentwurf die Frist konsistent verwendet. Nenne keine eigenen Fristen und keine Rechtsnormen.',
        note: 'Die schwache Fassung fragt nach Wissen, das das Modell nur schätzen kann. Die starke Fassung nutzt es als Prüfinstanz für einen Text, dessen Fakten Sie selbst mitbringen.',
      },
      {
        kind: 'callout',
        tone: 'warning',
        title: 'Grundregel',
        text: 'Die Verantwortung bleibt bei der bearbeitenden Person. Was Ihren Namen trägt, haben Sie geprüft – unabhängig davon, welches Hilfsmittel den ersten Entwurf geschrieben hat. Diese Verantwortung ist nicht auf ein Assistenzsystem übertragbar und wird durch keinen Hinweistext relativiert.',
      },
    ],
  },

  {
    id: 'datenschutz-praxis',
    title: 'Datenschutz in der Praxis',
    category: 'Recht und Sicherheit',
    readingMinutes: 5,
    teaser:
      'Was in die Eingabe darf und was nicht – und wie Pseudonymisierung in dreißig Sekunden gelingt, ohne die Arbeit auszubremsen.',
    related: ['grenzen-der-anwendung', 'dokumente-nutzen', 'halluzinationen'],
    body: [
      {
        kind: 'para',
        text: 'F13 wird im Rechenzentrum der Verwaltung betrieben; Ihre Eingaben verlassen das Landesverwaltungsnetz nicht. Das ist die Voraussetzung für den dienstlichen Einsatz, hebt aber die Sparsamkeitsanforderung nicht auf: Personenbezogene Daten dürfen nur verarbeitet werden, soweit es für die Aufgabe erforderlich ist. Für die meisten Aufgaben in F13 ist es das nicht.',
      },
      { kind: 'heading', text: 'Was hinein darf' },
      {
        kind: 'list',
        items: [
          'Sachverhalte ohne Personenbezug: Verfahrensstand, Prüfkriterien, Termine, Zuständigkeitsfragen.',
          'Zahlen aus Haushalts- und Sitzungsunterlagen, soweit sie nicht personenbeziehbar sind.',
          'Eigene Textentwürfe, Vermerke und Vorlagen zur Überarbeitung.',
          'Fachfragen allgemeiner Art, Formulierungs- und Strukturfragen.',
        ],
      },
      { kind: 'heading', text: 'Was nicht hinein darf' },
      {
        kind: 'list',
        items: [
          'Besondere Kategorien nach Art. 9 DSGVO: Gesundheit, Religion, politische Meinung, Gewerkschaftszugehörigkeit, ethnische Herkunft, Sexualleben, biometrische Daten.',
          'Sozialdaten sowie Daten aus laufenden Personal-, Beurteilungs- und Disziplinarverfahren.',
          'Verschlusssachen jeder Einstufung.',
          'Zugangsdaten, Kennwörter, Schlüsselmaterial.',
          'Unterschriftenlisten, Namenslisten, Teilnehmerlisten mit Anschriften.',
        ],
      },
      { kind: 'heading', text: 'Pseudonymisieren in dreißig Sekunden' },
      {
        kind: 'ordered',
        items: [
          'Kopieren Sie den Sachverhalt in ein leeres Dokument, nicht direkt in F13.',
          'Ersetzen Sie mit der Suchen-und-Ersetzen-Funktion jeden Namen durch einen Platzhalter: „die Antragstellerin“, „Person A“, „das Grundstück im Plangebiet“.',
          'Löschen Sie Anschriften, Geburtsdaten, Telefonnummern, E-Mail-Adressen und personenbezogene Aktenzeichen.',
          'Prüfen Sie den Text auf indirekte Kennzeichnung: Ein einzelnes Detail wie „die Hebamme aus dem Ortsteil Nord“ identifiziert eine Person zuverlässiger als ein Name.',
          'Geben Sie den bereinigten Text ein und setzen Sie die Klarnamen am Ende in Ihrem Textprogramm wieder ein.',
        ],
      },
      {
        kind: 'compare',
        weak: 'Frau Marlene Kubitschek, Rosenweg 4, hat gegen den Bescheid vom 12.08. Widerspruch eingelegt und begründet ihn mit ihrer Erkrankung. Wie antworte ich?',
        strong:
          'Eine Person hat gegen einen Bescheid Widerspruch eingelegt und macht persönliche Gründe geltend, die ich nicht in die Eingabe aufnehme. Formuliere ein Eingangsschreiben, das den Widerspruch bestätigt, das weitere Verfahren erläutert und keine inhaltliche Bewertung vornimmt.',
        note: 'Die starke Fassung enthält alles, was für das Schreiben nötig ist – und weder Namen noch Gesundheitsangabe. Der Entwurf wird dadurch nicht schlechter.',
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Prüffrage vor dem Absenden',
        text: 'Wäre es ein Problem, wenn diese Eingabe im Rahmen einer Störungsbearbeitung von einer administrativen Kraft gelesen würde? Wenn ja, kürzen Sie sie. Diese Frage ersetzt in der Praxis jede Checkliste.',
      },
    ],
  },

  {
    id: 'iteratives-arbeiten',
    title: 'Iteratives Arbeiten: nachschärfen statt neu anfangen',
    category: 'Arbeitsweise',
    readingMinutes: 4,
    teaser:
      'Die zweite Anfrage ist wichtiger als die erste. Wie Sie im Gespräch korrigieren, statt jedes Mal von vorn zu beginnen.',
    related: ['gute-prompts', 'halluzinationen', 'dokumente-nutzen'],
    body: [
      {
        kind: 'para',
        text: 'Der häufigste Bedienfehler ist der Neuanfang. Eine Antwort passt nicht, das Eingabefeld wird geleert, der Prompt umformuliert, alles beginnt von vorn – und der Kontext, den das Modell schon hatte, ist verloren.',
      },
      {
        kind: 'para',
        text: 'Wirksamer ist die Korrektur im Gespräch. Das Modell behält den Verlauf und ändert genau das Benannte, statt neu zu beginnen.',
      },
      { kind: 'heading', text: 'Formulierungen, die zuverlässig wirken' },
      {
        kind: 'list',
        items: [
          '„Der zweite Absatz ist zu abweisend. Formuliere ihn so um, dass die Prüfung erkennbar läuft, ohne ein Ergebnis vorwegzunehmen.“',
          '„Zu lang. Kürze auf die Hälfte, behalte die Beschlussformel im Wortlaut.“',
          '„Streiche alle Rechtsverweise und gib sie mir stattdessen getrennt als Prüfhinweis.“',
          '„Behalte den Aufbau, aber schreibe für eine Bürgerin ohne Verwaltungserfahrung.“',
          '„Der letzte Punkt stimmt nicht: Die Frist beträgt vier Wochen, nicht zwei. Korrigiere und prüfe, ob sich daraus weitere Änderungen ergeben.“',
        ],
      },
      { kind: 'heading', text: 'Zwischenergebnisse prüfen' },
      {
        kind: 'para',
        text: 'Bei mehrstufigen Aufgaben lohnt es sich, die Stufen zu trennen. Lassen Sie zuerst die Gliederung erzeugen und prüfen Sie sie. Eine falsche Gliederung, die Sie erst am fertigen Text bemerken, kostet erheblich mehr Zeit als eine kurze Zwischenkontrolle.',
      },
      {
        kind: 'ordered',
        items: [
          'Gliederung erzeugen lassen und prüfen.',
          'Den fachlich schwierigsten Abschnitt zuerst ausformulieren lassen – daran zeigt sich, ob die Aufgabe überhaupt tragfähig gestellt ist.',
          'Die übrigen Abschnitte ergänzen lassen.',
          'Am Ende einmal komplett neu lesen. Iterativ entstandene Texte haben typische Nahtstellen: Wiederholungen und Brüche im Ton.',
        ],
      },
      {
        kind: 'callout',
        tone: 'warning',
        title: 'Wann ein Neuanfang doch besser ist',
        text: 'Wenn ein Verlauf viele Korrekturen enthält und das Modell auf Nachfragen immer wieder dasselbe wiederholt, wird es nicht mehr besser. Beginnen Sie dann eine neue Unterhaltung und nehmen Sie den besten Zwischenstand als Ausgangstext mit.',
      },
    ],
  },

  {
    id: 'grenzen-der-anwendung',
    title: 'Grenzen der Anwendung',
    category: 'Recht und Sicherheit',
    readingMinutes: 5,
    teaser:
      'Wofür F13 nicht geeignet ist: Rechtsverbindliches, abschließende Entscheidungen, Ermessensausübung – und was stattdessen geht.',
    related: ['halluzinationen', 'datenschutz-praxis', 'gute-prompts'],
    body: [
      {
        kind: 'para',
        text: 'F13 ist ein Hilfsmittel für Entwurfs- und Vorarbeiten. Die Grenzen ergeben sich nicht aus der Leistungsfähigkeit der Technik, sondern aus der Verfassung des Verwaltungshandelns: Entscheidungen werden von Menschen getroffen, die dafür einstehen.',
      },
      { kind: 'heading', text: 'Nicht geeignet' },
      {
        kind: 'list',
        items: [
          'Rechtsverbindliche Texte im Wortlaut: Bescheide, Verfügungen, Satzungen, Verträge. Ein Entwurf als Ausgangspunkt ist zulässig; der verantwortete Wortlaut muss geprüft und gegebenenfalls neu gefasst werden.',
          'Ermessensausübung. Ermessen ist der Verwaltung persönlich übertragen; wer es an ein Modell abgibt, übt es nicht aus. Das ist ein Rechtsfehler, kein Bedienfehler.',
          'Abschließende Entscheidungen in Personal-, Sozial- und Ordnungsverfahren.',
          'Ermittlung von Rechtsgrundlagen, Fundstellen, Aktenzeichen und Fristen. Diese Angaben erzeugt das Modell mit hoher Fehlerquote und ohne erkennbare Unsicherheit.',
          'Bewertung von Personen: Beurteilungen, Auswahlvermerke, Eignungsaussagen.',
          'Auskünfte, die unmittelbar an Bürgerinnen und Bürger gehen, ohne dass sie zuvor fachlich geprüft wurden.',
        ],
      },
      { kind: 'heading', text: 'Gut geeignet' },
      {
        kind: 'list',
        items: [
          'Material sortieren: langen Vermerk auf Kernaussagen bringen, Stellungnahmen nach Themen ordnen.',
          'Entwürfe formulieren, die anschließend fachlich geprüft werden.',
          'Rückfragen antizipieren: Was wird das Gremium fragen, was fehlt in der Vorlage?',
          'Struktur vorschlagen: Gliederung für einen Bericht, Aufbau einer Vorlage, Tagesordnung.',
          'Register wechseln: Fachsprache in Bürgersprache und umgekehrt.',
          'Textlängen anpassen und Formulierungsvarianten erzeugen.',
        ],
      },
      {
        kind: 'para',
        text: 'Eine brauchbare Abgrenzung: Alles, was Sie einer Praktikantin zum Entwurf geben und anschließend prüfen würden, ist ein guter Anwendungsfall. Alles, was Sie selbst entscheiden müssen, bleibt bei Ihnen.',
      },
      {
        kind: 'callout',
        tone: 'success',
        title: 'Was der Einsatz tatsächlich spart',
        text: 'Nicht die fachliche Arbeit, sondern die Anlaufzeit: das leere Blatt, die erste Gliederung, die vierte Umformulierung desselben Absatzes. Wer damit rechnet, wird nicht enttäuscht – und wer eine fertige Entscheidung erwartet, schon.',
      },
    ],
  },

  {
    id: 'dokumente-nutzen',
    title: 'Dokumente sinnvoll nutzen',
    category: 'Arbeitsweise',
    readingMinutes: 4,
    teaser:
      'Was einen guten Anhang ausmacht, warum große PDF Probleme machen und wie Sie aus einem Aktenordner eine brauchbare Grundlage machen.',
    related: ['gute-prompts', 'datenschutz-praxis', 'halluzinationen'],
    body: [
      {
        kind: 'para',
        text: 'Ein Modell, das aus einem Dokument arbeitet, erfindet weniger und wird konkreter. Anhänge sind deshalb das wirksamste Mittel gegen schwache Antworten – vorausgesetzt, der Anhang taugt.',
      },
      { kind: 'heading', text: 'Was einen guten Anhang ausmacht' },
      {
        kind: 'list',
        items: [
          'Er enthält Text, nicht Bilder von Text. Ein gescanntes PDF ohne Texterkennung ist für die Verarbeitung leer.',
          'Er ist auf das Nötige begrenzt. Fünf einschlägige Seiten sind besser als sechzig, in denen sie stehen.',
          'Er ist bereinigt. Personenbezogene Angaben, die für die Aufgabe nicht erforderlich sind, gehören vorher entfernt.',
          'Er ist aktuell. Zwei Fassungen desselben Vermerks im selben Anhang führen zuverlässig zu widersprüchlichen Antworten.',
        ],
      },
      { kind: 'heading', text: 'Warum große PDF Probleme machen' },
      {
        kind: 'para',
        text: 'Ein Modell verarbeitet nur eine begrenzte Textmenge auf einmal. Bei einem 300-seitigen Dokument wird ein Teil verarbeitet und der Rest nicht – ohne dass Sie erkennen können, welcher Teil. Die Antwort wirkt vollständig und ist es nicht. Genau das macht große Anhänge riskanter als gar keine.',
      },
      {
        kind: 'ordered',
        items: [
          'Exportieren Sie die einschlägigen Seiten in ein eigenes PDF.',
          'Bei Tabellenwerken: Kopieren Sie das relevante Blatt in eine neue Datei. Werte werden gelesen, Formeln nicht.',
          'Bei mehreren Dokumenten: Sagen Sie im Prompt, welche Rolle jedes hat. „Anlage 1 ist der Sachstand, Anlage 2 die Stellungnahme. Prüfe, welche Punkte der Stellungnahme im Sachstand nicht beantwortet sind.“',
          'Nutzen Sie die Dokumentenablage für wiederkehrende Grundlagen – Dienstanweisungen, Formularmuster, Vorjahresprotokolle. Über „Im Chat verwenden“ sind sie mit einem Klick angehängt.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Kontrollfrage',
        text: 'Fragen Sie nach dem Anhängen: „Nenne mir in einem Satz, worum es in dem Dokument geht.“ Passt die Antwort nicht, wurde das Dokument nicht oder nicht vollständig gelesen – und jede weitere Antwort darauf ist wertlos.',
      },
    ],
  },

  {
    id: 'tastaturbedienung',
    title: 'Bedienung ohne Maus: Tastaturkürzel im Überblick',
    category: 'Bedienung',
    readingMinutes: 3,
    teaser:
      'Alle Funktionen von F13 sind mit der Tastatur erreichbar. Diese Übersicht nennt die Kürzel und die wichtigsten Navigationswege.',
    related: ['gute-prompts', 'iteratives-arbeiten'],
    body: [
      {
        kind: 'para',
        text: 'F13 ist vollständig ohne Maus bedienbar. Am Seitenanfang finden Sie zwei Sprunglinks – „Zum Hauptinhalt“ und „Zur Navigation“ –, die beim Fokussieren sichtbar werden. Die Übersicht ist außerdem jederzeit über die Schaltfläche „Tastaturkürzel“ im Kopfbereich erreichbar.',
      },
      { kind: 'heading', text: 'Allgemein' },
      {
        kind: 'list',
        items: [
          'Tabulator und Umschalt+Tabulator: vorwärts und rückwärts durch alle Bedienelemente.',
          'Eingabetaste oder Leertaste: Schaltflächen und Verweise auslösen.',
          'Escape: offene Dialoge und Menüs schließen; der Fokus kehrt zur auslösenden Schaltfläche zurück.',
          'Pfeiltasten: innerhalb von Menüs, Radiogruppen, Registern und Aufklapplisten bewegen.',
          'Alt+1 bis Alt+6: direkt zu Chat, Meetingassistenz, Protokolle, Dokumente, Hilfe & Support, Tipps & Tricks.',
          'Alt+0: Übersicht der Tastaturkürzel öffnen.',
        ],
      },
      { kind: 'heading', text: 'Chat' },
      {
        kind: 'list',
        items: [
          'Eingabetaste: Nachricht absenden.',
          'Umschalt+Eingabetaste: Zeilenumbruch im Eingabefeld.',
          'Escape im Eingabefeld: laufende Antwort abbrechen.',
          'Die Modellauswahl ist eine Radiogruppe: mit Tabulator erreichen, mit den Pfeiltasten wechseln.',
          'Angehängte Dateien sind Schaltflächen mit eigenem Entfernen-Knopf und mit dem Tabulator erreichbar.',
        ],
      },
      { kind: 'heading', text: 'Meetingassistenz' },
      {
        kind: 'list',
        items: [
          'Die vier Phasen sind Register: mit den Pfeiltasten wechseln, mit der Eingabetaste aktivieren.',
          'Im Transkript ist jeder Sprechername eine Schaltfläche; die Eingabetaste öffnet die Zuordnung.',
          'Der Zuordnungsdialog neben dem Transkript ist ein normales Eingabefeld: mit der Eingabetaste absenden.',
          'Im Protokolleditor: Strg+B fett, Strg+I kursiv; die Formatierleiste ist mit dem Tabulator erreichbar.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Wenn etwas nicht erreichbar ist',
        text: 'Melden Sie es der Administration Ihres Hauses mit Angabe der Ansicht, des Bedienelements und Ihres Hilfsmittels. Solche Meldungen werden vorrangig behandelt.',
      },
    ],
  },
];

export function getTip(id: string): TipArticle | undefined {
  return TIPS.find((t) => t.id === id);
}
