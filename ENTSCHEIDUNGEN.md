# Entscheidungen

Festgehalten sind die Punkte, an denen die Anforderung mehrdeutig war. Gewählt
wurde jeweils die zugänglichere und schlichtere Variante.

## Gestaltung

**KERN nachgebaut statt eingebunden.** Das KERN-Paket wird nicht als
Abhängigkeit verwendet, sondern die Gestaltungsprinzipien sind in Tailwind
abgebildet (`tailwind.config.js`, `src/index.css`). Grund: Optik und Verhalten
waren gefordert, nicht die Abhängigkeit; so bleibt der Prototyp ohne
Registry-Zugang installierbar.

**Farbwerte.** Primärblau `#0B4B8C` (7,3:1 auf Weiß). Textgrau `#3A4045`
(9,5:1), Platzhalter- und Rahmengrau `#6B7176` (4,6:1 als Text, 4,9:1 als
Kontur). Rahmen von Bedienelementen liegen bewusst bei `neutral-500` und nicht
heller, damit 1.4.11 mit 3:1 sicher erfüllt ist. Deaktivierte Schaltflächen
verwenden `neutral-200` mit `neutral-700` (7,9:1) — auch deaktiviert lesbar.

**Fokusindikator als Doppelring.** `box-shadow` mit weißem Innen- und
dunkelblauem Außenring statt `outline`. Grund: ein einfarbiger Ring verliert auf
farbigen Flächen (Primärschaltflächen, hervorgehobene Navigationseinträge) den
Kontrast; der Doppelring trägt auf hellem und auf dunklem Grund.

## Barrierefreiheit

**Fokus bei Routenwechsel über die h1.** Der Fokus wandert nach jedem
Ansichtswechsel auf die Hauptüberschrift, nicht auf den `main`-Container. Der
Wechsel wird dadurch angesagt, ohne dass ein leerer Container vorgelesen wird.
Beim ersten Laden der Seite wird der Fokus nicht verschoben. Umgesetzt über
einen Pfadvergleich auf Modulebene (`src/hooks/useFocusOnRouteChange.ts`), weil
jede Route eine eigene Instanz der Ansicht erzeugt und ein Merker in der
Komponente immer „erster Aufruf“ wäre; der Vergleich ist zugleich robust gegen
die doppelte Effektausführung im StrictMode.

**Live-Regionen: Status statt Inhalt.** Der Antwortstream im Chat und die
Transkriptliste stehen *nicht* in einer Live-Region. Angesagt werden
ausschließlich gebündelte Statusmeldungen aus einer eigenen, unsichtbaren
Region: „Antwort wird erstellt.“ → „Antwort vollständig, 4 Absätze.“ bzw. alle
zehn Beiträge „30 Beiträge transkribiert.“ Grund: eine Live-Region über dem
wachsenden Text würde bei jedem Token unterbrechen. Der Text selbst bleibt
jederzeit normal navigierbar.

**Modellauswahl als aufklappbare Radiogruppe.** Gefordert war „Button/Dropdown“
und gleichzeitig eine semantisch korrekte Radiogruppe. Umgesetzt ist eine echte
`RadioGroup` (Radix) in einem Bereich, der über eine Schaltfläche mit
`aria-expanded` ein- und ausgeklappt wird — nicht als Menü mit
`menuitemradio`. Grund: je Modell sind Eignungstext, Hosting-Badge und
Datenschutzhinweis darzustellen; das trägt ein Menüeintrag nicht, und die
Pfeiltastenbedienung einer Radiogruppe ist die vertrautere.

**Phasen der Meetingassistenz sind nicht gesperrt.** Alle vier Register sind
immer erreichbar. Fehlt eine Voraussetzung (kein Protokoll erzeugt), erklärt der
Bereich das im Inhalt. Grund: deaktivierte Register werden von der
Tastaturnavigation übersprungen und die Ursache bleibt unklar.

**Sprunglink „Zur Navigation“.** Beide Landmarks (`main`, `nav`) haben
`tabindex="-1"`, sonst springt der Fokus in einigen Browsern nicht mit.

**Sprachauszeichnung.** Das Dokument ist `lang="de"`. Einzeln ausgezeichnet ist
„Single Sign-on“ (`lang="en"`) auf der Anmeldemaske. Nicht ausgezeichnet sind
eingedeutschte Fachbegriffe, die in der Verwaltungs-IT als deutsches Vokabular
gebraucht werden — „On-Premise“, „Drag & Drop“, „Prototyp“, „Chat“. Eine
Auszeichnung würde dort die Aussprache verschlechtern, nicht verbessern.

**Sortierung der Dokumententabelle.** `aria-sort` sitzt am `th`, die
Schaltfläche darin trägt einen ergänzenden, unsichtbaren Hinweis auf die
aktuelle Richtung. Zusätzlich wird jede Sortierung als Statusmeldung angesagt.
Die Sortierrichtung ist außerdem am Pfeilsymbol erkennbar, also nicht nur über
Farbe.

**Aktiver Navigationseintrag** ist dreifach gekennzeichnet: `aria-current="page"`,
farbiger Balken links, fettere Schrift und stärkere Icon-Strichbreite.

## Chat

**Kein Markdown-Rendering.** Antworten werden als Text mit Absätzen und
Aufzählungen dargestellt (`MessageText.tsx`), nicht als HTML. Grund: der
Prototoyp soll keine Ausgabe eines Modells als HTML interpretieren; das wäre
eine Einladung zu Fehlern, die im echten Betrieb sicherheitsrelevant werden.

**Antworten sind regelbasiert vorformuliert** (`src/data/replies.ts`). Die
Auswahl erfolgt über Stichwortregeln, die Modellwahl beeinflusst Länge und
Tempo. Es gibt keinen Netzwerkzugriff.

**Verlauf rechts als `aside`,** dauerhaft sichtbar statt aufklappbar. Bei einer
Zielauflösung ab 1280 px ist der Platz vorhanden, und eine dauerhaft sichtbare
Liste braucht keinen zusätzlichen Zustand.

## Meetingassistenz

**Protokolleditor mit `contentEditable` und `document.execCommand`.** Für den
Prototyp bewusst gewählt: der Bereich ist als `role="textbox"` mit
`aria-multiline` und eigener Formatierleiste (`role="toolbar"`) ausgezeichnet und
wird von Screenreadern nativ unterstützt. `execCommand` ist als veraltet
markiert, funktioniert aber in allen Zielbrowsern. Für den Produktivbetrieb wäre
ein Editor mit eigenem Dokumentmodell (z. B. ProseMirror) vorzuziehen.

**Abschnittsweises Bearbeiten** statt eines großen Editors. Jeder
Protokollabschnitt ist eigenständig bearbeitbar, wird bei Änderung als
„bearbeitet“ markiert und lässt sich einzeln auf die KI-Fassung zurücksetzen.
Grund: die Rückkehr zur KI-Fassung ist so verlustfrei je Abschnitt möglich.

**Sprecherzuordnung an zwei Stellen.** Der Chatdialog ist der bequeme Weg, der
Sprechername im Transkript ist eine Schaltfläche und öffnet denselben
Zuordnungsdialog. Beide wirken sofort auf alle Beiträge des Sprechers. Ein noch
unbearbeitetes Protokoll wird dabei neu erzeugt; sobald Abschnitte bearbeitet
wurden, bleibt das Protokoll unangetastet — Bearbeitungen haben Vorrang.

**Verlaufsprotokoll: einfache Umformung in indirekte Rede.** Die Umformung ist
absichtlich schlicht (`toIndirect` in `src/data/protocol.ts`). Der Prototyp soll
die Darstellungsform zeigen; eine belastbare Grammatiktransformation ist nicht
Gegenstand.

**Aufnahme läuft in Transkriptzeit.** Die Zeitanzeige folgt den Zeitmarken des
Mock-Transkripts (bis 24:12), nicht der Wanduhr. Ein Beitrag erscheint alle
650 ms. Grund: eine echtzeitgetreue Simulation würde 24 Minuten dauern.

## Export

**Word als handgebautes OOXML-Paket.** `src/lib/export.ts` erzeugt ein minimales,
gültiges `.docx` (Content-Types, Root-Beziehung, `word/document.xml`) und packt
es mit `fflate`. Überschriften, Aufzählungen, Nummerierungen und Tabellen mit
Rahmen werden übertragen. Grund gegen eine Editor-Bibliothek: das Format bleibt
nachvollziehbar und die Abhängigkeit klein.

**PDF über den Druckdialog.** Die versandfähige Fassung wird in einem
Druck-Rahmen mit eigenem A4-Stylesheet aufgebaut; der Browser übernimmt die
PDF-Erzeugung („Als PDF speichern“). Grund: in der Verwaltung ist das der
übliche Weg, und eine im Browser erzeugte PDF-Datei wäre nicht getaggt, also
nicht barrierefrei — das wäre ein schlechterer Kompromiss als der Druckdialog.
Diese Einschränkung steht auch in der Erklärung zur Barrierefreiheit.

**E-Akte simuliert, aber mit vollständigem Dialogverlauf.** Ablageort und
Aktenzeichen werden erfasst und validiert, die Bestätigung nennt Ablageort,
Aktenzeichen, Zeitpunkt und eine Quittungsnummer. Es gibt keine Schnittstelle.

## Inhalte und Rollen

**Rolle wird aus der Adresse abgeleitet.** Die Anmeldung erfolgt mit
dienstlicher E-Mail-Adresse und Passwort; eine Rollenauswahl gibt es nicht.
Damit der Bereich „Verwaltung“ erreichbar bleibt, erhalten Adressen, deren
örtlicher Teil mit `admin` beginnt, die Rolle Administration. Name und Initialen
werden ebenfalls aus der Adresse gebildet (`vorname.nachname@…`). Der Hinweis
darauf steht sichtbar auf der Anmeldemaske.

**Registrierung als Antrag, nicht als Selbstanlage.** Die Schaltfläche
„Registrieren“ öffnet einen Antrag auf Freischaltung (Adresse, Name, Referat)
und bestätigt den Eingang. Eine Selbstanlage eines Kontos wäre für eine
Behördenanwendung unrealistisch: Zugänge werden freigegeben, nicht erzeugt.

**Rechtliche Seiten.** Datenschutz und Erklärung zur Barrierefreiheit sind mit
ausformulierten Beispieltexten hinterlegt und als Prototyp-Beispiel
gekennzeichnet. Das Impressum ist auf Wunsch entfallen.

**Landesverwaltung statt Kommune.** Alle Beispieldaten spielen im (fiktiven)
Ministerium für Vibe Coding und Reaktorsicherheit als oberster Landesbehörde:
Referate statt Ämter, Kapitel und Titel statt Teilhaushalte, Kleine Anfrage
statt Bürgereingabe an den Rat, Lenkungskreis statt Fachausschuss.

**Protokollformat des Hauses.** Jede Niederschrift beginnt mit einem Kopfbogen
(Behörde, Referat, Aktenzeichen, Art der Niederschrift, Gegenstand, Datum, Ort,
Vorsitz, Schriftführung) und endet mit dem Verteiler samt Einwendungsfrist –
unabhängig vom Protokolltyp. Der frühere doppelte Kopf im Export ist entfallen,
weil der Kopfbogen jetzt Teil des Protokolls ist.

**Transkript nur bei Bedarf.** In der Nachbearbeitung ist das Transkript
standardmäßig ausgeblendet und wird über eine Schaltfläche eingeblendet; „Zur
Transkriptstelle“ blendet es automatisch ein. Während der Aufnahme bleibt es
sichtbar – dort ist es der Gegenstand der Ansicht.

**Beitragszahlen werden berechnet.** Die Zahl der Redebeiträge je Sprecher wird
aus dem Transkript abgeleitet statt gepflegt. Vorher wichen die gepflegten
Zahlen von den tatsächlichen ab, und der Zuordnungsdialog nannte falsche Werte.

**Keine erfundenen Fundstellen in den Mock-Antworten.** Die Beispielantworten
nennen dort, wo eine Rechtsgrundlage naheläge, ausdrücklich, dass sie keine
nennen können, und verweisen auf die fachliche Prüfung. Das ist inhaltlich
dasselbe, was der Artikel zu Halluzinationen verlangt — der Prototyp soll sein
eigenes Vorbild nicht unterlaufen.

**Keine Mobilansicht, kein dunkles Farbschema,** entsprechend der Vorgabe
Desktop ab 1280 px.
