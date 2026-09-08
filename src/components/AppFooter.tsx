import { Link } from 'react-router-dom';

export function AppFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white px-5 py-2">
      <nav aria-label="Rechtliche Hinweise">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          <li>
            <Link to="/datenschutz" className="f13-link">
              Datenschutz
            </Link>
          </li>
          <li>
            <Link to="/barrierefreiheit" className="f13-link">
              Erklärung zur Barrierefreiheit
            </Link>
          </li>
          <li className="text-neutral-700">Prototyp mit Beispieldaten – keine echten Vorgänge</li>
        </ul>
      </nav>
    </footer>
  );
}
