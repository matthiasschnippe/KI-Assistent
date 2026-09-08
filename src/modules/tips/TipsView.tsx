import { Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Badge } from '../../components/ui';
import { TIPS } from '../../data/tips';

export function TipsView() {
  return (
    <Page
      title="Tipps & Tricks"
      intro="Anleitungen für die tägliche Arbeit mit F13 – mit Beispielen aus dem Verwaltungsalltag."
    >
      <ul className="grid max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TIPS.map((tip) => (
          <li key={tip.id} className="flex">
            <article className="flex w-full flex-col rounded border border-neutral-200 bg-white p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge tone="primary">{tip.category}</Badge>
                <span className="flex items-center gap-1 text-sm text-neutral-700">
                  <Clock3 aria-hidden="true" className="h-4 w-4" />
                  {tip.readingMinutes} Minuten Lesedauer
                </span>
              </div>
              <h2 className="mb-2 text-lg font-bold">
                <Link to={'/tipps/' + tip.id} className="f13-link">
                  {tip.title}
                </Link>
              </h2>
              <p className="mb-4 flex-1 text-neutral-800">{tip.teaser}</p>
              <p className="text-sm text-neutral-700">
                Verwandt:{' '}
                {tip.related
                  .map((id) => TIPS.find((t) => t.id === id)?.title)
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </Page>
  );
}
