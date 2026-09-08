import { useRef, useState } from 'react';
import { Info, PanelLeftClose, PanelLeftOpen, Send, Square } from 'lucide-react';
import { Page } from '../../components/Page';
import { Button, LiveRegion, StatusMessage, cx } from '../../components/ui';
import { AttachMenu, AttachmentChips, validateFile } from './AttachControls';
import { ChatHistory } from './ChatHistory';
import { MessageList } from './MessageList';
import { ModelPicker } from './ModelPicker';
import { EXAMPLE_PROMPTS } from '../../data/chats';
import { kindFromName } from '../../lib/format';
import { useAppStore } from '../../store/useAppStore';

export function ChatView() {
  const conversations = useAppStore((s) => s.conversations);
  const activeId = useAppStore((s) => s.activeConversationId);
  const currentModel = useAppStore((s) => s.currentModel);
  const setCurrentModel = useAppStore((s) => s.setCurrentModel);
  const pendingAttachments = useAppStore((s) => s.pendingAttachments);
  const removeAttachment = useAppStore((s) => s.removeAttachment);
  const attachFile = useAppStore((s) => s.attachFile);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const stopStreaming = useAppStore((s) => s.stopStreaming);
  const chatStatus = useAppStore((s) => s.chatStatus);

  const [draft, setDraft] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const conversation = conversations.find((c) => c.id === activeId) ?? null;
  const isStreaming = conversation?.messages.some((m) => m.streaming) ?? false;

  function submit() {
    if (!draft.trim() || isStreaming) return;
    sendMessage(draft);
    setDraft('');
    textareaRef.current?.focus();
  }

  function applyExample(text: string) {
    setDraft(text);
    textareaRef.current?.focus();
  }

  return (
    <Page
      title="Chat"
      documentTitle={conversation ? 'Chat: ' + conversation.title : 'Chat'}
      compact
      contentClassName="flex min-h-0 flex-1"
      actions={
        <Button
          variant="ghost"
          size="icon"
          aria-expanded={historyOpen}
          aria-controls="chatverlauf"
          aria-label={historyOpen ? 'Chatverlauf ausblenden' : 'Chatverlauf einblenden'}
          title={historyOpen ? 'Chatverlauf ausblenden' : 'Chatverlauf einblenden'}
          onClick={() => setHistoryOpen((v) => !v)}
        >
          {historyOpen ? (
            <PanelLeftClose aria-hidden="true" className="h-5 w-5" />
          ) : (
            <PanelLeftOpen aria-hidden="true" className="h-5 w-5" />
          )}
        </Button>
      }
    >
      <div id="chatverlauf" hidden={!historyOpen} className="contents">
        <ChatHistory />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="f13-scroll min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {conversation ? (
            <MessageList messages={conversation.messages} />
          ) : (
            <EmptyChat onUseExample={applyExample} />
          )}
        </div>

        <div
          className={cx(
            'border-t border-neutral-200 bg-white px-6 py-3',
            dragActive && 'bg-primary-50 outline-dashed outline-2 outline-primary-600',
          )}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            const files = Array.from(event.dataTransfer.files);
            const errors: string[] = [];
            files.forEach((file) => {
              const error = validateFile(file.name, file.size);
              if (error) {
                errors.push(error);
                return;
              }
              attachFile(file.name, kindFromName(file.name)!, file.size);
            });
            setUploadError(errors.join(' '));
          }}
        >
          <ModelPicker value={currentModel} onChange={setCurrentModel} />

          {uploadError && (
            <StatusMessage tone="error" role="alert" className="mt-2">
              <p>{uploadError}</p>
              <Button size="sm" variant="ghost" className="mt-2" onClick={() => setUploadError('')}>
                Meldung ausblenden
              </Button>
            </StatusMessage>
          )}

          {pendingAttachments.length > 0 && (
            <div className="mt-2">
              <AttachmentChips attachments={pendingAttachments} onRemove={removeAttachment} />
            </div>
          )}

          <div className="mt-2 flex items-end gap-2">
            <div className="flex-1">
              <label htmlFor="chat-eingabe" className="sr-only">
                Ihre Nachricht. Eingabetaste sendet, Umschalt und Eingabetaste erzeugt einen
                Zeilenumbruch.
              </label>
              <textarea
                id="chat-eingabe"
                ref={textareaRef}
                rows={2}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    submit();
                  }
                  if (event.key === 'Escape' && isStreaming) {
                    event.preventDefault();
                    stopStreaming();
                  }
                }}
                placeholder="Aufgabe beschreiben – Rolle, Kontext, Aufgabe, Format, Zielgruppe"
                className="w-full resize-y rounded border border-neutral-500 px-3 py-2 text-base"
              />
            </div>

            <div className="flex shrink-0 items-center gap-2 pb-1">
              <AttachMenu onError={setUploadError} />
              {isStreaming ? (
                <Button variant="secondary" onClick={stopStreaming}>
                  <Square aria-hidden="true" className="h-4 w-4" />
                  Stopp
                </Button>
              ) : (
                <Button variant="primary" onClick={submit} disabled={!draft.trim()}>
                  <Send aria-hidden="true" className="h-4 w-4" />
                  Senden
                </Button>
              )}
            </div>
          </div>

          <p className="mt-2 flex items-center gap-2 text-sm text-neutral-700">
            <Info aria-hidden="true" className="h-4 w-4 shrink-0" />
            Ausgaben können fehlerhaft sein und sind fachlich zu prüfen.
          </p>
        </div>
      </div>

      <LiveRegion message={chatStatus} />
    </Page>
  );
}

function EmptyChat({ onUseExample }: { onUseExample: (text: string) => void }) {
  return (
    <section aria-labelledby="leerzustand-titel" className="mx-auto max-w-3xl">
      <h2 id="leerzustand-titel" className="mb-3 text-lg">
        Neue Unterhaltung
      </h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {EXAMPLE_PROMPTS.map((example) => (
          <li key={example.title}>
            <button
              type="button"
              onClick={() => onUseExample(example.text)}
              className="h-full w-full rounded border border-neutral-300 bg-white p-3 text-left hover:border-primary-600 hover:bg-primary-50"
            >
              <span className="block font-bold text-primary-700">{example.title}</span>
              <span className="mt-1 block text-sm text-neutral-800">{example.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
