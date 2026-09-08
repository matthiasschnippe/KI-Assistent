import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/* Zuletzt fokussierter Pfad, auf Modulebene gehalten: jede Route erzeugt eine
   eigene Instanz der Ansicht, ein Merker in der Komponente wäre also immer
   "erster Aufruf". Der Vergleich über den Pfad ist zugleich robust gegen die
   doppelte Ausführung von Effekten im StrictMode. */
let lastFocusedPath: string | null = null;

/**
 * Gibt eine Ref für die h1 der Ansicht zurück. Nach einem Routenwechsel
 * erhält dieses Element den Fokus; beim ersten Laden der Seite nicht.
 */
export function useFocusOnRouteChange<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (lastFocusedPath === null) {
      lastFocusedPath = pathname;
      return;
    }
    if (lastFocusedPath === pathname) return;
    lastFocusedPath = pathname;

    const element = ref.current;
    if (!element) return;
    element.focus();
    element.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [pathname]);

  return ref;
}
