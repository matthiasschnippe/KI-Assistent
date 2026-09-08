import { useId, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { ChevronDown, ChevronUp, Server } from 'lucide-react';
import { RadioCard } from '../../components/RadioCard';
import { Badge, Button, LiveRegion } from '../../components/ui';
import { MODELS, getModel } from '../../data/models';
import type { ModelId } from '../../types';

/**
 * Modellauswahl direkt über dem Eingabefeld.
 * Umgesetzt als echte Radiogruppe (Radix) in einem aufklappbaren Bereich:
 * mit Tabulator erreichbar, mit den Pfeiltasten bedienbar, die Auswahl wird
 * über eine Live-Region angesagt.
 */
export function ModelPicker({
  value,
  onChange,
}: {
  value: ModelId;
  onChange: (id: ModelId) => void;
}) {
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const panelId = useId();
  const current = getModel(value);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-700">Modell:</span>
        <Button
          size="sm"
          variant="secondary"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{current.name}</span>
          {open ? (
            <ChevronUp aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          )}
          <span className="sr-only">
            {open ? ' – Modellauswahl schließen' : ' – Modellauswahl öffnen'}
          </span>
        </Button>
        <span className="text-sm text-neutral-700">
          {current.hostingBadge}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {current.knowledgeCutoff}
        </span>
      </div>

      <div id={panelId} hidden={!open} className="mt-3">
        <RadioGroup.Root
          value={value}
          onValueChange={(next) => {
            const model = getModel(next as ModelId);
            onChange(next as ModelId);
            setAnnouncement('Modell ausgewählt: ' + model.name + ', ' + model.hostingBadge + ', ' + model.knowledgeCutoff + '.');
          }}
          aria-label="Sprachmodell auswählen"
          className="grid gap-3 md:grid-cols-2"
        >
          {MODELS.map((model) => (
            <RadioCard
              key={model.id}
              value={model.id}
              idPrefix={'modell-' + model.id}
              label={
                <span className="flex flex-wrap items-center gap-2">
                  {model.name}
                  <Badge tone="primary">
                    <Server aria-hidden="true" className="h-3 w-3" />
                    {model.hostingBadge}
                  </Badge>
                </span>
              }
              description={model.knowledgeCutoff}
            />
          ))}
        </RadioGroup.Root>
      </div>

      <LiveRegion message={announcement} />
    </div>
  );
}
