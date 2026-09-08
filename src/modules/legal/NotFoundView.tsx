import { Link } from 'react-router-dom';
import { Page } from '../../components/Page';

export function NotFoundView() {
  return (
    <Page title="Seite nicht gefunden" documentTitle="Seite nicht gefunden">
      <div className="max-w-prose space-y-4">
        <p>
          Die aufgerufene Adresse gehört zu keiner Ansicht von F13. Möglicherweise wurde ein
          Verweis geändert.
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            <Link to="/chat" className="f13-link">
              Zum Chat
            </Link>
          </li>
          <li>
            <Link to="/hilfe" className="f13-link">
              Zu Hilfe & Support
            </Link>
          </li>
        </ul>
      </div>
    </Page>
  );
}
