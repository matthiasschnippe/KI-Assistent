import { ArrowLeft, Clock3, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Badge, StatusMessage } from '../../components/ui';
import { TIPS, getTip } from '../../data/tips';
import type { TipBlock } from '../../types';

export function TipDetail() {
  const { id } = useParams();
  const tip = id ? getTip(id) : undefined;

  if (!tip) {
    return (
      <Page title="Artikel nicht gefunden" documentTitle="Tipps & Tricks: nicht gefunden">
        <p className="mb-4 max-w-prose">
          Zu diesem Verweis liegt kein Artikel vor. Möglicherweise wurde er umbenannt.
        </p>
        <Link to="/tipps" className="f13-link">
          Zur Übersicht Tipps &amp; Tricks
        </Link>
      </Page>
    );
  }

  const related = tip.related
    .map((relatedId) => TIPS.find((t) => t.id === relatedId))
    .filter((t): t is (typeof TIPS)[number] => Boolean(t));

  return (
    <Page
      title={tip.title}
      documentTitle={'Tipps: ' + tip.title}
      intro={
        <span className="flex flex-wrap items-center gap-3">
          <Badge tone="primary">{tip.category}</Badge>
          <span className="flex items-center gap-1 text-sm">
            <Clock3 aria-hidden="true" className="h-4 w-4" />
            {tip.readingMinutes} Minuten Lesedauer
          </span>
        </span>
      }
      actions={
        <Link
          to="/tipps"
          className="inline-flex min-h-[44px] items-center gap-2 rounded border border-primary-600 px-4 py-2 font-semibold text-primary-600 hover:bg-primary-50"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Zur Übersicht
        </Link>
      }
    >
      <article className="max-w-3xl">
        <p className="mb-6 max-w-prose text-lg text-neutral-800">{tip.teaser}</p>
        {tip.body.map((block, index) => (
          <TipBlockView key={index} block={block} />
        ))}

        {related.length > 0 && (
          <section aria-labelledby="verwandte-artikel" className="mt-10 border-t border-neutral-200 pt-6">
            <h2 id="verwandte-artikel" className="mb-3">
              Verwandte Artikel
            </h2>
            <ul className="space-y-2">
              {related.map((item) => (
                <li key={item.id}>
                  <Link to={'/tipps/' + item.id} className="f13-link font-semibold">
                    {item.title}
                  </Link>
                  <span className="block text-sm text-neutral-700">
                    {item.category}
                    <span aria-hidden="true"> · </span>
                    <span className="sr-only">, </span>
                    {item.readingMinutes} Minuten
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </Page>
  );
}

function TipBlockView({ block }: { block: TipBlock }) {
  if (block.kind === 'para') {
    return <p className="mb-4 max-w-prose">{block.text}</p>;
  }
  if (block.kind === 'heading') {
    return <h2 className="mb-3 mt-8">{block.text}</h2>;
  }
  if (block.kind === 'list') {
    return (
      <ul className="mb-4 ml-6 max-w-prose list-disc space-y-2">
        {block.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.kind === 'ordered') {
    return (
      <ol className="mb-4 ml-6 max-w-prose list-decimal space-y-2">
        {block.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    );
  }
  if (block.kind === 'compare') {
    return (
      <div className="mb-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded border border-danger-200 bg-danger-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-danger-800">
              <ThumbsDown aria-hidden="true" className="h-4 w-4" />
              Schwach
            </h3>
            <p className="italic">„{block.weak}“</p>
          </div>
          <div className="rounded border border-success-200 bg-success-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-success-800">
              <ThumbsUp aria-hidden="true" className="h-4 w-4" />
              Stark
            </h3>
            <p className="italic">„{block.strong}“</p>
          </div>
        </div>
        {block.note && <p className="mt-2 max-w-prose text-sm text-neutral-700">{block.note}</p>}
      </div>
    );
  }
  return (
    <StatusMessage tone={block.tone} title={block.title} className="mb-6 max-w-prose">
      <p>{block.text}</p>
    </StatusMessage>
  );
}
