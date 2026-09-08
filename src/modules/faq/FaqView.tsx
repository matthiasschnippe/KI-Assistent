import { useEffect, useMemo, useState, type ReactElement } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Accessibility, ChevronDown, Link2, Mail, Phone, ShieldQuestion } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Button, Field, LiveRegion, cx, inputClass } from '../../components/ui';
import { FAQ, FAQ_CATEGORIES } from '../../data/faq';
import { pluralize } from '../../lib/format';

export function FaqView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const deepLink = searchParams.get('frage');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string[]>(deepLink ? [deepLink] : []);
  const [status, setStatus] = useState('');

  const needle = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      FAQ.filter((item) => {
        if (!needle) return true;
        return (
          item.question.toLowerCase().includes(needle) ||
          item.answer.some((p) => p.toLowerCase().includes(needle)) ||
          item.category.toLowerCase().includes(needle)
        );
      }),
    [needle],
  );

  useEffect(() => {
    if (!deepLink) return;
    setOpen((current) => (current.includes(deepLink) ? current : [...current, deepLink]));
    const element = document.getElementById('faq-' + deepLink);
    element?.scrollIntoView({ block: 'start' });
  }, [deepLink]);

  /* Die Trefferzahl steht als sichtbare Statusmeldung unter dem Suchfeld und
     wird von dort angesagt - eine zweite Live-Region dafür wäre doppelt. */

  return (
    <Page
      title="Hilfe & Support"
      documentTitle="Hilfe & Support"
      intro="Antworten auf häufige Fragen und der Weg zum Support des Hauses."
    >
      <div className="max-w-4xl">
        <SupportContact />

        <div className="md:max-w-md">
          <Field
            id="faq-suche"
            label="Fragen durchsuchen"
            description="Die Suche berücksichtigt Fragen, Antworten und Kategorien."
          >
            {(props) => (
              <input
                {...props}
                type="search"
                className={inputClass}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="z. B. Aufzeichnung, Modell, Löschfrist"
              />
            )}
          </Field>
        </div>

        <p className="mb-6 text-sm text-neutral-700" role="status">
          {needle
            ? pluralize(filtered.length, 'Frage gefunden', 'Fragen gefunden')
            : pluralize(FAQ.length, 'Frage', 'Fragen') + ' in fünf Bereichen'}
        </p>

        {filtered.length === 0 && (
          <p className="rounded border border-neutral-200 bg-white p-6">
            Zu diesem Suchbegriff gibt es keinen Eintrag. Wenn Ihre Frage hier fehlt, wenden Sie
            sich an die Administration Ihres Hauses.
          </p>
        )}

        {FAQ_CATEGORIES.map((category) => {
          const items = filtered.filter((item) => item.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category} className="mb-8">
              <h2 className="mb-3">{category}</h2>
              <Accordion.Root
                type="multiple"
                value={open}
                onValueChange={setOpen}
                className="divide-y divide-neutral-200 overflow-hidden rounded border border-neutral-200 bg-white"
              >
                {items.map((item) => (
                  <Accordion.Item key={item.id} value={item.id} id={'faq-' + item.id}>
                    <Accordion.Header>
                      <Accordion.Trigger
                        className={cx(
                          'group flex w-full min-h-[44px] items-center justify-between gap-4 px-4 py-3 text-left',
                          'text-base font-semibold hover:bg-neutral-50',
                          'data-[state=open]:bg-primary-50 data-[state=open]:text-primary-700',
                        )}
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          aria-hidden="true"
                          className="h-5 w-5 shrink-0 transition-transform group-data-[state=open]:rotate-180"
                        />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="border-t border-neutral-200 px-4 py-4">
                      <FaqAnswer paragraphs={item.answer} />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-3"
                        onClick={() => {
                          setSearchParams({ frage: item.id });
                          setStatus('Verweis auf diese Frage in der Adresszeile hinterlegt.');
                        }}
                      >
                        <Link2 aria-hidden="true" className="h-4 w-4" />
                        Verweis auf diese Frage
                      </Button>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </section>
          );
        })}
      </div>
      <LiveRegion message={status} />
    </Page>
  );
}

function SupportContact() {
  return (
    <section
      aria-labelledby="support-titel"
      className="mb-8 rounded border border-neutral-200 bg-white p-5"
    >
      <h2 id="support-titel" className="mb-3">
        Support erreichen
      </h2>
      <p className="mb-4 max-w-prose text-neutral-700">
        Wenn Ihre Frage unten nicht beantwortet ist, hilft der Anwendungssupport des Hauses weiter.
        Für Störungsmeldungen geben Sie bitte Uhrzeit, verwendetes Modell und die betroffene
        Ansicht an.
      </p>

      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        <div>
          <dt className="flex items-center gap-2 font-semibold">
            <Mail aria-hidden="true" className="h-4 w-4 text-primary-700" />
            Anwendungssupport F13
          </dt>
          <dd className="mt-1">
            <a href="mailto:f13-support@mvcr.landesverwaltung.de" className="f13-link">
              f13-support@mvcr.landesverwaltung.de
            </a>
          </dd>
        </div>

        <div>
          <dt className="flex items-center gap-2 font-semibold">
            <Phone aria-hidden="true" className="h-4 w-4 text-primary-700" />
            Servicedesk
          </dt>
          <dd className="mt-1">
            0 30 / 18 000 – 4400
            <span className="block text-sm text-neutral-700">
              Montag bis Freitag, 8:00 bis 16:00 Uhr
            </span>
          </dd>
        </div>

        <div>
          <dt className="flex items-center gap-2 font-semibold">
            <ShieldQuestion aria-hidden="true" className="h-4 w-4 text-primary-700" />
            Datenschutzfragen
          </dt>
          <dd className="mt-1">
            <a href="mailto:datenschutz@mvcr.landesverwaltung.de" className="f13-link">
              datenschutz@mvcr.landesverwaltung.de
            </a>
          </dd>
        </div>

        <div>
          <dt className="flex items-center gap-2 font-semibold">
            <Accessibility aria-hidden="true" className="h-4 w-4 text-primary-700" />
            Barrierefreiheit melden
          </dt>
          <dd className="mt-1">
            <a href="mailto:barrierefreiheit@mvcr.landesverwaltung.de" className="f13-link">
              barrierefreiheit@mvcr.landesverwaltung.de
            </a>
            <span className="block text-sm text-neutral-700">
              Meldungen werden vorrangig bearbeitet.
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}

function FaqAnswer({ paragraphs }: { paragraphs: string[] }) {
  const blocks: ReactElement[] = [];
  let bullets: string[] = [];

  const flush = () => {
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

  paragraphs.forEach((paragraph) => {
    if (paragraph.startsWith('- ')) {
      bullets.push(paragraph.slice(2));
      return;
    }
    flush();
    blocks.push(
      <p key={'p-' + blocks.length} className="mb-3 max-w-prose last:mb-0">
        {paragraph}
      </p>,
    );
  });
  flush();

  return <div>{blocks}</div>;
}
