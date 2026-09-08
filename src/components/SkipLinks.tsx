/**
 * Sprunglinks am Seitenanfang. Sie sind visuell ausgeblendet, werden beim
 * Fokussieren aber sichtbar und kontraststark eingeblendet.
 */
export function SkipLinks() {
  const cls =
    'absolute left-2 top-2 z-[60] -translate-y-[200%] rounded border-2 border-white bg-primary-700 ' +
    'px-4 py-3 text-base font-semibold text-white focus:translate-y-0';
  return (
    <div>
      <a href="#hauptinhalt" className={cls}>
        Zum Hauptinhalt
      </a>
      <a href="#hauptnavigation" className={cls + ' left-56'}>
        Zur Navigation
      </a>
    </div>
  );
}
