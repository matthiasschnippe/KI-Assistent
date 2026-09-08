import { create } from 'zustand';
import type {
  Attachment,
  AttachmentKind,
  AudioSource,
  ChatMessage,
  Conversation,
  DocumentCollection,
  EAktenTransferResult,
  MeetingMeta,
  MeetingPhase,
  ModelId,
  Protocol,
  ProtocolType,
  Rating,
  RecordingState,
  Role,
  Settings,
  Speaker,
  SpeakerDialogMessage,
  SpeakerKey,
  StoredDocument,
  User,
} from '../types';
import { CONVERSATIONS } from '../data/chats';
import { COLLECTIONS, DOCUMENTS } from '../data/documents';
import { getModel } from '../data/models';
import { buildReply } from '../data/replies';
import { INITIAL_SPEAKERS, MEETING_META, SPEAKER_SUGGESTIONS, TRANSCRIPT } from '../data/transcript';
import { generateProtocol } from '../data/protocol';

let seq = 0;
const uid = (prefix: string) => prefix + '-' + Date.now().toString(36) + '-' + (seq++).toString(36);

/* Zieltexte laufender Streams, absichtlich ausserhalb des States:
   sie werden nicht gerendert und sollen keine Aktualisierung ausloesen. */
const streamTargets = new Map<string, string>();
let streamTimer: ReturnType<typeof setInterval> | null = null;
let recordTimer: ReturnType<typeof setInterval> | null = null;

export interface AppState {
  /* --- Anmeldung --- */
  user: User | null;
  login: (email: string) => void;
  logout: () => void;

  /* --- Einstellungen --- */
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;

  /* --- Chat --- */
  conversations: Conversation[];
  activeConversationId: string | null;
  currentModel: ModelId;
  pendingAttachments: Attachment[];
  chatStatus: string;
  historySearch: string;
  setCurrentModel: (id: ModelId) => void;
  setHistorySearch: (q: string) => void;
  newConversation: () => void;
  selectConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  attachDocument: (doc: StoredDocument) => void;
  attachFile: (name: string, kind: AttachmentKind, size: number) => void;
  removeAttachment: (id: string) => void;
  sendMessage: (text: string) => void;
  stopStreaming: () => void;
  regenerate: (messageId: string) => void;
  rateMessage: (messageId: string, rating: Rating) => void;

  /* --- Dokumente --- */
  documents: StoredDocument[];
  collections: DocumentCollection[];
  addDocument: (doc: StoredDocument) => void;
  renameDocument: (id: string, name: string) => void;
  deleteDocument: (id: string) => void;
  touchDocument: (id: string) => void;

  /* --- Meetingassistenz --- */
  meetingMeta: MeetingMeta;
  meetingPhase: MeetingPhase;
  recordingState: RecordingState;
  elapsedSeconds: number;
  visibleEntries: number;
  speakers: Speaker[];
  protocol: Protocol | null;
  speakerDialog: SpeakerDialogMessage[];
  speakerDialogQueue: SpeakerKey[];
  transcriptStatus: string;
  eAkteResult: EAktenTransferResult | null;
  updateMeetingMeta: (patch: Partial<MeetingMeta>) => void;
  setMeetingPhase: (phase: MeetingPhase) => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  assignSpeaker: (key: SpeakerKey, name: string, functionLabel: string | null) => void;
  sendSpeakerDialogMessage: (text: string) => void;
  generateProtocolNow: (type: ProtocolType) => void;
  updateProtocolSection: (sectionId: string, html: string) => void;
  resetProtocolSection: (sectionId: string) => void;
  transferToEAkte: (target: string, fileNumber: string) => void;
  resetEAkte: () => void;
}

const DEFAULT_SETTINGS: Settings = {
  defaultModel: 'gpt-oss-120b',
  defaultProtocolType: 'ergebnis',
  retention: '30',
};

/* Aus der dienstlichen Adresse werden Name und Rolle abgeleitet. Im Betrieb
   kämen beide aus der Benutzerverwaltung; im Prototyp genügt die Adresse.
   Adressen, deren örtlicher Teil mit "admin" beginnt, erhalten die Rolle
   Administration - sonst wäre der Bereich "Verwaltung" nicht erreichbar. */
function makeUser(email: string): User {
  const clean = email.trim().toLowerCase() || 'jonas.mertens@mvcr.landesverwaltung.de';
  const localPart = clean.split('@')[0];
  const isAdmin = localPart.startsWith('admin');

  const nameParts = localPart
    .replace(/^admin[._-]?/, '')
    .split(/[._-]/)
    .filter((part) => /^[a-zäöüß]+$/.test(part))
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

  const fullName =
    nameParts.length >= 2
      ? nameParts.slice(0, 2).join(' ')
      : isAdmin
        ? 'Andrea Dahlke'
        : 'Jonas Mertens';

  const initials = fullName
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return {
    id: clean,
    initials,
    fullName,
    orgUnit: isAdmin
      ? 'Referat Z 1 – Informationstechnik und Anwendungsbetrieb'
      : 'Referat Z 3 – Organisation, Digitalisierung und KI',
    authority: 'Ministerium für Vibe Coding und Reaktorsicherheit',
    role: isAdmin ? 'Administration' : 'Nutzer',
    email: clean,
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  /* --- Anmeldung --- */
  user: null,
  login: (email) => {
    const user = makeUser(email);
    set((s) => ({
      user,
      currentModel: s.settings.defaultModel,
      meetingMeta: { ...s.meetingMeta, protocolType: s.settings.defaultProtocolType },
    }));
  },
  logout: () => {
    stopAllTimers();
    set({ user: null, activeConversationId: null, pendingAttachments: [], chatStatus: '' });
  },

  /* --- Einstellungen --- */
  settings: DEFAULT_SETTINGS,
  updateSettings: (patch) =>
    set((s) => {
      const settings = { ...s.settings, ...patch };
      return {
        settings,
        currentModel: patch.defaultModel ?? s.currentModel,
        meetingMeta:
          patch.defaultProtocolType && !s.protocol
            ? { ...s.meetingMeta, protocolType: patch.defaultProtocolType }
            : s.meetingMeta,
      };
    }),

  /* --- Chat --- */
  conversations: CONVERSATIONS,
  activeConversationId: null,
  currentModel: DEFAULT_SETTINGS.defaultModel,
  pendingAttachments: [],
  chatStatus: '',
  historySearch: '',

  setCurrentModel: (id) => {
    set((s) => {
      const conversations = s.activeConversationId
        ? s.conversations.map((c) => (c.id === s.activeConversationId ? { ...c, modelId: id } : c))
        : s.conversations;
      return { currentModel: id, conversations };
    });
  },

  setHistorySearch: (q) => set({ historySearch: q }),

  newConversation: () => {
    get().stopStreaming();
    set({ activeConversationId: null, pendingAttachments: [], chatStatus: '' });
  },

  selectConversation: (id) => {
    get().stopStreaming();
    const conv = get().conversations.find((c) => c.id === id);
    set({
      activeConversationId: id,
      currentModel: conv?.modelId ?? get().currentModel,
      pendingAttachments: [],
      chatStatus: '',
    });
  },

  renameConversation: (id, title) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === id ? { ...c, title: title.trim() || c.title } : c,
      ),
    })),

  deleteConversation: (id) =>
    set((s) => ({
      conversations: s.conversations.filter((c) => c.id !== id),
      activeConversationId: s.activeConversationId === id ? null : s.activeConversationId,
    })),

  attachDocument: (doc) =>
    set((s) => {
      if (s.pendingAttachments.some((a) => a.documentId === doc.id)) return s;
      return {
        pendingAttachments: [
          ...s.pendingAttachments,
          { id: uid('att'), documentId: doc.id, name: doc.name, kind: doc.kind, size: doc.size },
        ],
      };
    }),

  attachFile: (name, kind, size) =>
    set((s) => ({
      pendingAttachments: [...s.pendingAttachments, { id: uid('att'), name, kind, size }],
    })),

  removeAttachment: (id) =>
    set((s) => ({ pendingAttachments: s.pendingAttachments.filter((a) => a.id !== id) })),

  sendMessage: (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const state = get();
    state.stopStreaming();

    const attachments = state.pendingAttachments;
    const modelId = state.currentModel;
    const now = new Date().toISOString();

    const userMessage: ChatMessage = {
      id: uid('msg'),
      author: 'user',
      text: trimmed,
      createdAt: now,
      attachments: attachments.length ? attachments : undefined,
    };

    const reply = buildReply(trimmed, { modelId, attachments });
    const assistantMessage: ChatMessage = {
      id: uid('msg'),
      author: 'assistant',
      text: '',
      createdAt: now,
      modelId,
      streaming: true,
      paragraphs: reply.paragraphs,
    };
    streamTargets.set(assistantMessage.id, reply.text);

    let conversationId = state.activeConversationId;
    if (!conversationId) {
      conversationId = uid('conv');
      const conv: Conversation = {
        id: conversationId,
        title: autoTitle(trimmed),
        updatedAt: now,
        modelId,
        messages: [userMessage, assistantMessage],
      };
      set((s) => ({
        conversations: [conv, ...s.conversations],
        activeConversationId: conversationId,
        pendingAttachments: [],
        chatStatus: 'Antwort wird erstellt.',
      }));
    } else {
      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === conversationId
            ? { ...c, updatedAt: now, messages: [...c.messages, userMessage, assistantMessage] }
            : c,
        ),
        pendingAttachments: [],
        chatStatus: 'Antwort wird erstellt.',
      }));
    }

    /* Verwendete Dokumente in der Ablage als "zuletzt verwendet" markieren */
    attachments.forEach((a) => a.documentId && get().touchDocument(a.documentId));

    startStream(assistantMessage.id, modelId, set, get);
  },

  stopStreaming: () => {
    if (streamTimer) {
      clearInterval(streamTimer);
      streamTimer = null;
    }
    const s = get();
    let changed = false;
    const conversations = s.conversations.map((c) => ({
      ...c,
      messages: c.messages.map((m) => {
        if (m.streaming) {
          changed = true;
          return { ...m, streaming: false, aborted: m.text.length === 0 ? false : true };
        }
        return m;
      }),
    }));
    if (changed) {
      set({ conversations, chatStatus: 'Antwort abgebrochen.' });
    }
  },

  regenerate: (messageId) => {
    const s = get();
    s.stopStreaming();
    const conv = s.conversations.find((c) => c.id === s.activeConversationId);
    if (!conv) return;
    const index = conv.messages.findIndex((m) => m.id === messageId);
    if (index < 1) return;
    const prompt = [...conv.messages]
      .slice(0, index)
      .reverse()
      .find((m) => m.author === 'user');
    if (!prompt) return;

    const modelId = s.currentModel;
    const reply = buildReply(prompt.text, { modelId, attachments: prompt.attachments ?? [] });
    streamTargets.set(messageId, reply.text);

    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conv.id
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId
                  ? {
                      ...m,
                      text: '',
                      streaming: true,
                      aborted: false,
                      rating: null,
                      modelId,
                      paragraphs: reply.paragraphs,
                    }
                  : m,
              ),
            }
          : c,
      ),
      chatStatus: 'Antwort wird neu erstellt.',
    }));

    startStream(messageId, modelId, set, get);
  },

  rateMessage: (messageId, rating) =>
    set((s) => ({
      conversations: s.conversations.map((c) => ({
        ...c,
        messages: c.messages.map((m) => (m.id === messageId ? { ...m, rating } : m)),
      })),
      chatStatus:
        rating === 'up'
          ? 'Antwort als hilfreich bewertet.'
          : rating === 'down'
            ? 'Antwort als nicht hilfreich bewertet.'
            : 'Bewertung zurückgenommen.',
    })),

  /* --- Dokumente --- */
  documents: DOCUMENTS,
  collections: COLLECTIONS,
  addDocument: (doc) => set((s) => ({ documents: [doc, ...s.documents] })),
  renameDocument: (id, name) =>
    set((s) => ({
      documents: s.documents.map((d) => (d.id === id ? { ...d, name: name.trim() || d.name } : d)),
    })),
  deleteDocument: (id) => set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),
  touchDocument: (id) =>
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === id ? { ...d, lastUsedAt: new Date().toISOString() } : d,
      ),
    })),

  /* --- Meetingassistenz --- */
  meetingMeta: MEETING_META,
  meetingPhase: 'vorbereitung',
  recordingState: 'idle',
  elapsedSeconds: 0,
  visibleEntries: 0,
  speakers: INITIAL_SPEAKERS,
  protocol: null,
  speakerDialog: [],
  speakerDialogQueue: [],
  transcriptStatus: '',
  eAkteResult: null,

  updateMeetingMeta: (patch) => set((s) => ({ meetingMeta: { ...s.meetingMeta, ...patch } })),

  setMeetingPhase: (phase) => set({ meetingPhase: phase }),

  startRecording: () => {
    if (recordTimer) clearInterval(recordTimer);
    set({
      meetingPhase: 'aufnahme',
      recordingState: 'recording',
      elapsedSeconds: 0,
      visibleEntries: 0,
      transcriptStatus: 'Aufnahme läuft. Transkription gestartet.',
      speakerDialog: [],
      speakerDialogQueue: [],
      protocol: null,
      eAkteResult: null,
      speakers: INITIAL_SPEAKERS,
    });
    recordTimer = setInterval(() => {
      const s = get();
      if (s.recordingState !== 'recording') return;
      const next = Math.min(s.visibleEntries + 1, TRANSCRIPT.length);
      const done = next >= TRANSCRIPT.length;
      set({
        visibleEntries: next,
        elapsedSeconds: TRANSCRIPT[next - 1]?.t ?? s.elapsedSeconds,
        /* Meldungen gebuendelt: nur alle zehn Beitraege und am Ende.
           Sonst wuerde der Screenreader bei jedem Beitrag unterbrechen. */
        transcriptStatus: done
          ? 'Transkription abgeschlossen. ' + TRANSCRIPT.length + ' Beiträge erfasst.'
          : next % 10 === 0
            ? next + ' Beiträge transkribiert.'
            : s.transcriptStatus,
      });
      if (done) {
        if (recordTimer) clearInterval(recordTimer);
        recordTimer = null;
        set({ recordingState: 'stopped' });
        startSpeakerDialog(set, get);
      }
    }, 650);
  },

  pauseRecording: () =>
    set({ recordingState: 'paused', transcriptStatus: 'Aufnahme pausiert.' }),

  resumeRecording: () =>
    set({ recordingState: 'recording', transcriptStatus: 'Aufnahme fortgesetzt.' }),

  stopRecording: () => {
    if (recordTimer) {
      clearInterval(recordTimer);
      recordTimer = null;
    }
    const s = get();
    /* Beim Beenden liegt das vollstaendige Transkript vor. */
    set({
      recordingState: 'stopped',
      visibleEntries: TRANSCRIPT.length,
      elapsedSeconds: TRANSCRIPT[TRANSCRIPT.length - 1].t,
      transcriptStatus:
        'Aufnahme beendet. Transkription abgeschlossen, ' + TRANSCRIPT.length + ' Beiträge erfasst.',
    });
    if (s.speakerDialog.length === 0) startSpeakerDialog(set, get);
  },

  assignSpeaker: (key, name, functionLabel) => {
    const clean = name.trim();
    if (!clean) return;
    set((s) => ({
      speakers: s.speakers.map((sp) =>
        sp.key === key ? { ...sp, name: clean, functionLabel } : sp,
      ),
    }));
    /* Ein noch unbearbeitetes Protokoll wird mit den neuen Namen neu erzeugt,
       damit Transkript und Protokoll nicht auseinanderlaufen. Sobald
       Abschnitte bearbeitet wurden, bleibt das Protokoll unangetastet -
       Bearbeitungen der Nutzerin haben Vorrang. */
    const s = get();
    if (s.protocol && !s.protocol.sections.some((section) => section.edited)) {
      s.generateProtocolNow(s.protocol.type);
    }
  },

  sendSpeakerDialogMessage: (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const s = get();
    const queue = s.speakerDialogQueue;
    const current = queue[0];

    set((state) => ({
      speakerDialog: [...state.speakerDialog, { id: uid('sd'), author: 'user', text: trimmed }],
    }));

    if (!current) {
      set((state) => ({
        speakerDialog: [
          ...state.speakerDialog,
          {
            id: uid('sd'),
            author: 'assistant',
            text: 'Alle erkannten Sprecher sind zugeordnet. Sie können jede Zuordnung weiterhin direkt im Transkript ändern: Sprechername ansteuern, Eingabetaste, neuen Namen eintragen.',
          },
        ],
      }));
      return;
    }

    const suggestion = SPEAKER_SUGGESTIONS[current];
    const resolved = resolveName(trimmed, suggestion.name);

    if (!resolved) {
      set((state) => ({
        speakerDialog: [
          ...state.speakerDialog,
          {
            id: uid('sd'),
            author: 'assistant',
            text:
              'Dann lasse ich Sprecher ' +
              current +
              ' zunächst unbenannt. Sie können die Zuordnung jederzeit direkt im Transkript nachtragen. ' +
              nextQuestion(queue.slice(1), get()),
          },
        ],
        speakerDialogQueue: queue.slice(1),
      }));
      return;
    }

    const speaker = s.speakers.find((sp) => sp.key === current);
    const count = speaker?.contributions ?? 0;
    get().assignSpeaker(current, resolved.name, resolved.functionLabel);

    set((state) => ({
      speakerDialog: [
        ...state.speakerDialog,
        {
          id: uid('sd'),
          author: 'assistant',
          text:
            'Verstanden. Sprecher ' +
            current +
            ' wird als ' +
            resolved.name +
            (resolved.functionLabel ? ' (' + resolved.functionLabel + ')' : '') +
            ' geführt. Alle ' +
            count +
            ' Beiträge wurden aktualisiert. ' +
            nextQuestion(queue.slice(1), get()),
        },
      ],
      speakerDialogQueue: queue.slice(1),
    }));
  },

  generateProtocolNow: (type) => {
    const s = get();
    const protocol = generateProtocol(type, s.meetingMeta, TRANSCRIPT, s.speakers);
    set({
      protocol,
      meetingMeta: { ...s.meetingMeta, protocolType: type },
      meetingPhase: s.meetingPhase === 'aufnahme' ? 'nachbearbeitung' : s.meetingPhase,
    });
  },

  updateProtocolSection: (sectionId, html) =>
    set((s) =>
      s.protocol
        ? {
            protocol: {
              ...s.protocol,
              sections: s.protocol.sections.map((sec) =>
                sec.id === sectionId
                  ? { ...sec, html, edited: html !== (sec.originalHtml ?? sec.html) }
                  : sec,
              ),
            },
          }
        : s,
    ),

  resetProtocolSection: (sectionId) =>
    set((s) =>
      s.protocol
        ? {
            protocol: {
              ...s.protocol,
              sections: s.protocol.sections.map((sec) =>
                sec.id === sectionId
                  ? { ...sec, html: sec.originalHtml ?? sec.html, edited: false }
                  : sec,
              ),
            },
          }
        : s,
    ),

  transferToEAkte: (target, fileNumber) =>
    set({
      eAkteResult: {
        target,
        fileNumber,
        transferredAt: new Date().toISOString(),
        receipt: 'EAKTE-' + Math.floor(100000 + Math.random() * 899999),
      },
    }),

  resetEAkte: () => set({ eAkteResult: null }),
}));

/* ---------- Hilfsfunktionen ---------- */

function stopAllTimers() {
  if (streamTimer) {
    clearInterval(streamTimer);
    streamTimer = null;
  }
  if (recordTimer) {
    clearInterval(recordTimer);
    recordTimer = null;
  }
}

type SetFn = (partial: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
type GetFn = () => AppState;

function startStream(messageId: string, modelId: ModelId, set: SetFn, get: GetFn) {
  const target = streamTargets.get(messageId) ?? '';
  const model = getModel(modelId);
  const charsPerTick = Math.max(1, Math.round(30 / model.msPerChar));
  let pos = 0;

  if (streamTimer) clearInterval(streamTimer);
  streamTimer = setInterval(() => {
    pos = Math.min(target.length, pos + charsPerTick);
    const slice = target.slice(0, pos);
    const done = pos >= target.length;

    set((s) => ({
      conversations: s.conversations.map((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === messageId ? { ...m, text: slice, streaming: !done } : m,
        ),
      })),
    }));

    if (done) {
      if (streamTimer) clearInterval(streamTimer);
      streamTimer = null;
      streamTargets.delete(messageId);
      const paragraphs =
        get()
          .conversations.flatMap((c) => c.messages)
          .find((m) => m.id === messageId)?.paragraphs ?? 1;
      set({
        chatStatus:
          'Antwort vollständig, ' + paragraphs + (paragraphs === 1 ? ' Absatz.' : ' Absätze.'),
      });
    }
  }, 30);
}

function autoTitle(prompt: string): string {
  const cleaned = prompt.replace(/\s+/g, ' ').trim();
  const firstSentence = cleaned.split(/[.!?]/)[0];
  const base = firstSentence.length > 12 ? firstSentence : cleaned;
  return base.length > 52 ? base.slice(0, 49).trimEnd() + '…' : base;
}

function resolveName(
  input: string,
  suggested: string,
): { name: string; functionLabel: string | null } | null {
  const text = input.trim();
  const lower = text.toLowerCase();

  if (/^(nein|nicht|weiss nicht|weiß nicht|unbekannt|keine angabe|später|spaeter)\b/.test(lower)) {
    return null;
  }

  /* Zustimmung ohne eigenen Namen: Vorschlag uebernehmen. */
  if (/^(ja|genau|richtig|korrekt|stimmt|passt|jawohl)\b/.test(lower) && !/[A-ZÄÖÜ][a-zäöüß]/.test(text.slice(3))) {
    const entry = Object.values(SPEAKER_SUGGESTIONS).find((s) => s.name === suggested);
    return { name: suggested, functionLabel: entry?.functionLabel ?? null };
  }

  /* Bekannten Namen im Satz erkennen. */
  for (const entry of Object.values(SPEAKER_SUGGESTIONS)) {
    const last = entry.name.split(' ').slice(-1)[0];
    if (lower.includes(last.toLowerCase())) {
      return { name: entry.name, functionLabel: entry.functionLabel };
    }
  }

  /* Freie Eingabe: Namen aus dem Satz herausziehen. */
  const match = text.match(
    /((?:Dr\.|Prof\.|Herr|Frau)?\s*[A-ZÄÖÜ][\wäöüß.-]+(?:\s+[A-ZÄÖÜ][\wäöüß.-]+){0,2})\s*$/,
  );
  const candidate = (match ? match[1] : text).replace(/^(Herr|Frau)\s+/, '').trim();
  if (!candidate) return null;
  return { name: candidate.slice(0, 60), functionLabel: null };
}

function nextQuestion(queue: SpeakerKey[], state: AppState): string {
  const next = queue[0];
  if (!next) {
    return 'Damit sind alle erkannten Sprecher zugeordnet. Prüfen Sie die Zuordnung im Transkript und erzeugen Sie anschließend das Protokoll.';
  }
  const suggestion = SPEAKER_SUGGESTIONS[next];
  const speaker = state.speakers.find((s) => s.key === next);
  return (
    'Sprecher ' +
    next +
    ' ' +
    suggestion.hint +
    ' (' +
    (speaker?.contributions ?? 0) +
    ' Beiträge) – wer ist das?'
  );
}

function startSpeakerDialog(set: SetFn, get: GetFn) {
  const state = get();
  const queue = state.speakers.filter((s) => !s.name).map((s) => s.key);
  if (queue.length === 0) return;
  const first = queue[0];
  const suggestion = SPEAKER_SUGGESTIONS[first];
  const speaker = state.speakers.find((s) => s.key === first);
  set({
    speakerDialogQueue: queue,
    speakerDialog: [
      {
        id: uid('sd'),
        author: 'assistant',
        text:
          'Ich habe ' +
          queue.length +
          ' Sprecher erkannt, aber keine Namen. Sprecher ' +
          first +
          ' ' +
          suggestion.hint +
          ' (' +
          (speaker?.contributions ?? 0) +
          ' Beiträge) – ist das die Sitzungsleitung?',
      },
    ],
  });
}
