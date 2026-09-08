import * as Tabs from '@radix-ui/react-tabs';
import { Check } from 'lucide-react';
import { Page } from '../../components/Page';
import { cx } from '../../components/ui';
import { ExportPanel } from './ExportPanel';
import { PreparationPanel } from './PreparationPanel';
import { ProtocolEditor } from './ProtocolEditor';
import { RecordingPanel } from './RecordingPanel';
import { useAppStore } from '../../store/useAppStore';
import type { MeetingPhase } from '../../types';

const PHASES: { id: MeetingPhase; label: string; step: number }[] = [
  { id: 'vorbereitung', label: 'Vorbereitung', step: 1 },
  { id: 'aufnahme', label: 'Aufnahme', step: 2 },
  { id: 'nachbearbeitung', label: 'Nachbearbeitung', step: 3 },
  { id: 'export', label: 'Export', step: 4 },
];

export function MeetingView() {
  const phase = useAppStore((s) => s.meetingPhase);
  const setPhase = useAppStore((s) => s.setMeetingPhase);
  const recordingState = useAppStore((s) => s.recordingState);
  const protocol = useAppStore((s) => s.protocol);

  const done: Record<MeetingPhase, boolean> = {
    vorbereitung: recordingState !== 'idle',
    aufnahme: recordingState === 'stopped',
    nachbearbeitung: protocol !== null,
    export: false,
  };

  return (
    <Page
      title="Meetingassistenz"
      intro="Sitzung aufnehmen, transkribieren, protokollieren und exportieren. Die vier Phasen können jederzeit gewechselt werden."
      contentClassName="flex min-h-0 flex-1 flex-col px-8 py-6"
    >
      <Tabs.Root
        value={phase}
        onValueChange={(value) => setPhase(value as MeetingPhase)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <Tabs.List
          aria-label="Phasen der Meetingassistenz"
          className="mb-6 flex flex-wrap gap-1 border-b border-neutral-300"
        >
          {PHASES.map((item) => (
            <Tabs.Trigger
              key={item.id}
              value={item.id}
              className={cx(
                'flex min-h-[44px] items-center gap-2 border-b-4 px-4 py-2 text-base',
                'data-[state=active]:border-b-primary-600 data-[state=active]:font-bold data-[state=active]:text-primary-700',
                'data-[state=inactive]:border-b-transparent data-[state=inactive]:text-neutral-800',
                'hover:bg-neutral-100',
              )}
            >
              <span
                aria-hidden="true"
                className={cx(
                  'flex h-6 w-6 items-center justify-center rounded-full border text-sm font-bold',
                  phase === item.id
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-neutral-500 bg-white text-neutral-700',
                )}
              >
                {done[item.id] ? <Check className="h-4 w-4" /> : item.step}
              </span>
              <span>
                <span className="sr-only">Schritt {item.step}: </span>
                {item.label}
                {done[item.id] && <span className="sr-only"> – abgeschlossen</span>}
              </span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="vorbereitung" className="min-h-0 flex-1 overflow-y-auto">
          <PreparationPanel onStarted={() => setPhase('aufnahme')} />
        </Tabs.Content>

        <Tabs.Content value="aufnahme" className="flex min-h-0 flex-1 flex-col">
          <RecordingPanel onProtocolReady={() => setPhase('nachbearbeitung')} />
        </Tabs.Content>

        <Tabs.Content value="nachbearbeitung" className="flex min-h-0 flex-1 flex-col">
          <ProtocolEditor onExport={() => setPhase('export')} />
        </Tabs.Content>

        <Tabs.Content value="export" className="min-h-0 flex-1 overflow-y-auto">
          <ExportPanel />
        </Tabs.Content>
      </Tabs.Root>
    </Page>
  );
}
