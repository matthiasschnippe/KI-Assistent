import React from 'react';

/**
 * Stellt den Nachrichtentext strukturiert dar: Absätze als p,
 * Aufzählungen als ul. Kein HTML aus der Antwort, nur Text.
 */
export function MessageText({ text }: { text: string }) {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={'ul-' + blocks.length} className="mb-3 ml-6 list-disc space-y-1">
        {bullets.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  lines.forEach((raw) => {
    const line = raw.trimEnd();
    if (line.trim() === '') {
      flushBullets();
      return;
    }
    if (/^[-–•]\s+/.test(line)) {
      bullets.push(line.replace(/^[-–•]\s+/, ''));
      return;
    }
    flushBullets();
    blocks.push(
      <p key={'p-' + blocks.length} className="mb-3 max-w-prose last:mb-0">
        {line}
      </p>,
    );
  });
  flushBullets();

  return <div>{blocks}</div>;
}
