import { Keyboard } from 'lucide-react';
import { Button } from './ui';
import type { User } from '../types';

export function AppHeader({
  user,
  onOpenShortcuts,
}: {
  user: User;
  onOpenShortcuts: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-6 border-b-2 border-primary-600 bg-white px-5 py-2">
      <p className="flex items-baseline gap-3">
        <span className="text-xl font-bold tracking-tight text-primary-700">F13</span>
        <span className="sr-only">KI-Assistent der Landesverwaltung</span>
      </p>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onOpenShortcuts}>
          <Keyboard aria-hidden="true" className="h-5 w-5" />
          Tastaturkürzel
        </Button>
        <p className="flex items-center gap-2 text-sm">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-600 bg-primary-50 text-xs font-bold text-primary-700"
          >
            {user.initials}
          </span>
          <span className="sr-only">Angemeldet als </span>
          <span className="font-semibold">{user.fullName}</span>
        </p>
      </div>
    </header>
  );
}
