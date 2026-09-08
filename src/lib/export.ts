import { strToU8, zipSync } from 'fflate';
import type { MeetingMeta, Protocol } from '../types';
import { getProtocolTypeInfo } from '../data/models';
import { formatDate } from '../data/protocol';

/* Export des Protokolls.

   Word: es wird ein minimales, gueltiges OOXML-Paket erzeugt und als .docx
   heruntergeladen. Bewusst ohne zusaetzliche Bibliothek, damit das Format
   nachvollziehbar bleibt.

   PDF: der Prototyp oeffnet eine druckfertige Fassung in einem
   Druck-Rahmen. Der Weg "Drucken -> Als PDF speichern" ist in der
   Verwaltung ohnehin der uebliche und braucht keine Zusatzsoftware. */

function xmlEscape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface RunStyle {
  bold?: boolean;
  italic?: boolean;
}

function run(text: string, style: RunStyle = {}): string {
  if (!text) return '';
  const props =
    style.bold || style.italic
      ? '<w:rPr>' + (style.bold ? '<w:b/>' : '') + (style.italic ? '<w:i/>' : '') + '</w:rPr>'
      : '';
  return (
    '<w:r>' + props + '<w:t xml:space="preserve">' + xmlEscape(text) + '</w:t></w:r>'
  );
}

function paragraph(runs: string, opts: { size?: number; bold?: boolean; bullet?: boolean } = {}): string {
  const pPr: string[] = [];
  if (opts.bullet) pPr.push('<w:ind w:left="720" w:hanging="360"/>');
  pPr.push('<w:spacing w:after="120"/>');
  const rPr = opts.size
    ? '<w:rPr><w:sz w:val="' + opts.size + '"/>' + (opts.bold ? '<w:b/>' : '') + '</w:rPr>'
    : '';
  return '<w:p><w:pPr>' + pPr.join('') + rPr + '</w:pPr>' + runs + '</w:p>';
}

function inlineRuns(node: Node, inherited: RunStyle = {}): string {
  let out = '';
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      out += run(child.textContent ?? '', inherited);
      return;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return;
    const el = child as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (tag === 'br') {
      out += '<w:r><w:br/></w:r>';
      return;
    }
    const style: RunStyle = {
      bold: inherited.bold || tag === 'strong' || tag === 'b',
      italic: inherited.italic || tag === 'em' || tag === 'i',
    };
    out += inlineRuns(el, style);
  });
  return out;
}

const TBL_BORDERS =
  '<w:tblBorders>' +
  ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']
    .map((s) => '<w:' + s + ' w:val="single" w:sz="6" w:space="0" w:color="808080"/>')
    .join('') +
  '</w:tblBorders>';

function tableXml(table: HTMLTableElement): string {
  const rows = Array.from(table.querySelectorAll('tr'));
  const body = rows
    .map((tr) => {
      const cells = Array.from(tr.children).filter(
        (c) => c.tagName === 'TD' || c.tagName === 'TH',
      ) as HTMLElement[];
      const tcs = cells
        .map((cell) => {
          const isHeader = cell.tagName === 'TH';
          const runs = inlineRuns(cell, { bold: isHeader });
          return (
            '<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>' +
            '<w:p><w:pPr><w:spacing w:after="0"/></w:pPr>' +
            (runs || run('')) +
            '</w:p></w:tc>'
          );
        })
        .join('');
      return '<w:tr>' + tcs + '</w:tr>';
    })
    .join('');
  return (
    '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/>' +
    TBL_BORDERS +
    '</w:tblPr>' +
    body +
    '</w:tbl><w:p/>'
  );
}

function blockXml(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent ?? '').trim();
    return text ? paragraph(run(text)) : '';
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  if (tag === 'h2') return paragraph(inlineRuns(el, { bold: true }), { size: 30, bold: true });
  if (tag === 'h3') return paragraph(inlineRuns(el, { bold: true }), { size: 26, bold: true });
  if (tag === 'p') return paragraph(inlineRuns(el));
  if (tag === 'ul' || tag === 'ol') {
    return Array.from(el.children)
      .map((li, i) =>
        paragraph(
          run(tag === 'ol' ? i + 1 + '. ' : '– ') + inlineRuns(li as HTMLElement),
          { bullet: true },
        ),
      )
      .join('');
  }
  if (tag === 'table') return tableXml(el as HTMLTableElement);
  if (tag === 'div' || tag === 'section') {
    return Array.from(el.childNodes).map(blockXml).join('');
  }
  return paragraph(inlineRuns(el));
}

function htmlToDocxBody(html: string): string {
  const doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
  const root = doc.body.firstElementChild;
  if (!root) return '';
  return Array.from(root.childNodes).map(blockXml).join('');
}

const CONTENT_TYPES =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
  '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
  '<Default Extension="xml" ContentType="application/xml"/>' +
  '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
  '</Types>';

const ROOT_RELS =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
  '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
  '</Relationships>';

function documentXml(bodyXml: string): string {
  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
    '<w:body>' +
    bodyXml +
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
    '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/>' +
    '</w:sectPr></w:body></w:document>'
  );
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function fileBase(meta: MeetingMeta, protocol: Protocol): string {
  const typeName = getProtocolTypeInfo(protocol.type).name;
  const slug = meta.title
    .replace(/[^\wäöüÄÖÜß ]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  return typeName + '_' + slug + '_' + meta.date;
}

export function exportDocx(meta: MeetingMeta, protocol: Protocol): string {
  /* Die Sitzungsdaten stehen bereits im Kopfbogen des Protokolls; hier folgt
     nur die Überschrift und der Hinweis auf die KI-Unterstützung. */
  const parts = [
    '<h2>' + getProtocolTypeInfo(protocol.type).name + '</h2>',
    '<p><em>Entwurf, erstellt mit KI-Unterstützung (F13). Fachlich zu prüfen.</em></p>',
  ];
  for (const section of protocol.sections) {
    parts.push('<h3>' + section.heading + '</h3>');
    parts.push(section.html);
  }
  const body = htmlToDocxBody(parts.join(''));
  const zipped = zipSync({
    '[Content_Types].xml': strToU8(CONTENT_TYPES),
    '_rels/.rels': strToU8(ROOT_RELS),
    'word/document.xml': strToU8(documentXml(body)),
  });
  const filename = fileBase(meta, protocol) + '.docx';
  download(
    new Blob([zipped], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }),
    filename,
  );
  return filename;
}

const PRINT_CSS = `
  @page { size: A4; margin: 20mm; }
  body { font-family: "Segoe UI", Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #15181A; }
  h1 { font-size: 17pt; margin: 0 0 4mm; }
  h2 { font-size: 14pt; margin: 8mm 0 2mm; }
  h3 { font-size: 12pt; margin: 6mm 0 2mm; }
  p { margin: 0 0 3mm; }
  ul, ol { margin: 0 0 3mm 6mm; }
  table { width: 100%; border-collapse: collapse; margin: 0 0 4mm; font-size: 10pt; }
  th, td { border: 0.4pt solid #666; padding: 1.5mm 2mm; text-align: left; vertical-align: top; }
  th { background: #eee; }
  .hinweis { border: 0.4pt solid #666; padding: 2mm; font-size: 9.5pt; margin-bottom: 5mm; }
`;

export function exportPdf(meta: MeetingMeta, protocol: Protocol): string {
  const typeName = getProtocolTypeInfo(protocol.type).name;
  const sections = protocol.sections
    .map((s) => '<h3>' + s.heading + '</h3>' + s.html)
    .join('');
  const html =
    '<!doctype html><html lang="de"><head><meta charset="utf-8" />' +
    '<title>' +
    typeName +
    ' – ' +
    meta.title +
    '</title><style>' +
    PRINT_CSS +
    '</style></head><body>' +
    '<h1>' +
    typeName +
    '</h1>' +
    '<p class="hinweis">Entwurf, erstellt mit KI-Unterstützung (F13). Fachlich zu prüfen; verbindlich erst mit Zeichnung der Schriftführung und Billigung durch den Vorsitz.</p>' +
    sections +
    '</body></html>';

  const frame = document.createElement('iframe');
  frame.setAttribute('title', 'Druckfassung des Protokolls');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.position = 'fixed';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.style.border = '0';
  frame.style.left = '-9999px';
  document.body.appendChild(frame);

  const win = frame.contentWindow;
  if (!win) {
    frame.remove();
    return '';
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  /* Kurzer Aufschub, damit das Dokument im Rahmen fertig aufgebaut ist. */
  setTimeout(() => {
    win.print();
    setTimeout(() => frame.remove(), 1000);
  }, 200);

  return fileBase(meta, protocol) + '.pdf';
}

export function exportTranscriptTxt(meta: MeetingMeta, lines: string[]): string {
  const filename = 'Transkript_' + meta.date + '.txt';
  const content = [meta.title, formatDate(meta.date) + ', ' + meta.startTime + ' Uhr', '', ...lines].join(
    '\r\n',
  );
  download(new Blob([content], { type: 'text/plain;charset=utf-8' }), filename);
  return filename;
}
