import { useEffect, useRef, useState } from 'react';
import { Bot, Check, Copy, RefreshCw, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { Badge, Button, LiveRegion, cx } from '../../components/ui';
import { AttachmentChips } from './AttachControls';
import { MessageText } from './MessageText';
import { getModel } from '../../data/models';
import { formatTime } from '../../lib/format';
import { useAppStore } from '../../store/useAppStore';
import type { ChatMessage } from '../../types';

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const streaming = messages.some((m) => m.streaming);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, streaming]);

  return (
    <section aria-labelledby="verlauf-heading" className="px-1">
      <h2 id="verlauf-heading" className="sr-only">
        Nachrichtenverlauf
      </h2>
      <ol className="space-y-4">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </ol>
      <div ref={bottomRef} />
    </section>
  );
}

function MessageItem({ message }: { message: ChatMessage }) {
  const rateMessage = useAppStore((s) => s.rateMessage);
  const regenerate = useAppStore((s) => s.regenerate);
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'failed'>('idle');
  const [copyStatus, setCopyStatus] = useState('');
  const headingId = 'msg-' + message.id;
  const isUser = message.author === 'user';
  const model = message.modelId ? getModel(message.modelId) : null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopyState('done');
      setCopyStatus('Antwort in die Zwischenablage kopiert.');
      window.setTimeout(() => setCopyState('idle'), 2500);
    } catch {
      setCopyState('failed');
      setCopyStatus(
        'Kopieren nicht möglich. Markieren Sie den Text und verwenden Sie Strg und C.',
      );
    }
  }

  return (
    <li>
      <article
        aria-labelledby={headingId}
        className={cx(
          'rounded border-l-4 p-3',
          isUser
            ? 'ml-8 border-l-neutral-500 border-y border-r border-neutral-200 bg-neutral-50 xl:ml-20'
            : 'mr-8 border-l-primary-600 border-y border-r border-neutral-200 bg-white xl:mr-20',
        )}
      >
        {/* Die Beschriftung bleibt für Screenreader erhalten: visuell
            unterscheiden Position, Rahmenfarbe und Symbol die Beiträge. */}
        <h3 id={headingId} className="mb-2 flex flex-wrap items-center gap-2 text-sm font-bold">
          {isUser ? (
            <User aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Bot aria-hidden="true" className="h-4 w-4 text-primary-700" />
          )}
          <span className="sr-only">{isUser ? 'Ihre Nachricht' : 'Antwort von F13'}</span>
          <span className="font-normal text-neutral-700">{formatTime(message.createdAt)}</span>
          {!isUser && model && <Badge tone="neutral">{model.name}</Badge>}
        </h3>

        {message.attachments && message.attachments.length > 0 && (
          <AttachmentChips attachments={message.attachments} className="mb-3" />
        )}

        <div className="text-base">
          <MessageText text={message.text} />
          {message.streaming && (
            <p className="mt-1 flex items-center gap-2 text-sm text-neutral-700">
              <span
                aria-hidden="true"
                className="inline-block h-4 w-2 animate-pulse bg-primary-600"
              />
              Antwort wird erstellt …
            </p>
          )}
          {message.aborted && !message.streaming && (
            <p className="mt-2 text-sm font-semibold text-warning-800">
              Abgebrochen – die Antwort ist unvollständig.
            </p>
          )}
        </div>

        {!isUser && !message.streaming && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-3">
            <Button size="sm" variant="ghost" onClick={copy}>
              {copyState === 'done' ? (
                <Check aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Copy aria-hidden="true" className="h-4 w-4" />
              )}
              {copyState === 'done' ? 'Kopiert' : 'Kopieren'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => regenerate(message.id)}>
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Neu generieren
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-pressed={message.rating === 'up'}
              onClick={() => rateMessage(message.id, message.rating === 'up' ? null : 'up')}
              className={message.rating === 'up' ? 'bg-success-50 text-success-800' : undefined}
            >
              <ThumbsUp aria-hidden="true" className="h-4 w-4" />
              Hilfreich
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-pressed={message.rating === 'down'}
              onClick={() => rateMessage(message.id, message.rating === 'down' ? null : 'down')}
              className={message.rating === 'down' ? 'bg-warning-50 text-warning-800' : undefined}
            >
              <ThumbsDown aria-hidden="true" className="h-4 w-4" />
              Nicht hilfreich
            </Button>
            {model && (
              <p className="ml-auto text-sm text-neutral-700">
                Erstellt mit {model.name}
                <span aria-hidden="true"> · </span>
                <span className="sr-only">, </span>
                {model.hostingBadge}
              </p>
            )}
            {copyState === 'failed' && (
              <p className="w-full text-sm font-semibold text-danger-700">{copyStatus}</p>
            )}
          </div>
        )}
      </article>
      <LiveRegion message={copyStatus} />
    </li>
  );
}
