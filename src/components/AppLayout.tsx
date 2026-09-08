import { useCallback, useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import { KeyboardShortcutsDialog } from './KeyboardShortcutsDialog';
import { Sidebar } from './Sidebar';
import { SkipLinks } from './SkipLinks';
import { navItemsForRole } from './navigation';
import { LiveRegion } from './ui';
import { useAppStore } from '../store/useAppStore';

export function AppLayout() {
  const user = useAppStore((s) => s.user);
  const [collapsed, setCollapsed] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [navStatus, setNavStatus] = useState('');
  const navigate = useNavigate();

  const toggleNav = useCallback(() => {
    setCollapsed((value) => !value);
    setNavStatus(collapsed ? 'Navigation ausgeklappt.' : 'Navigation eingeklappt, nur Symbole.');
  }, [collapsed]);

  useEffect(() => {
    if (!user) return;
    const items = navItemsForRole(user.role);
    function onKeyDown(event: KeyboardEvent) {
      if (!event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === '0') {
        event.preventDefault();
        setShortcutsOpen(true);
        return;
      }
      if (event.key.toLowerCase() === 'm') {
        event.preventDefault();
        toggleNav();
        return;
      }
      const target = items.find((item) => item.shortcut === event.key);
      if (target) {
        event.preventDefault();
        navigate(target.to);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [user, navigate, toggleNav]);

  if (!user) return <Navigate to="/anmeldung" replace />;

  return (
    <div className="flex h-screen flex-col bg-neutral-100">
      <SkipLinks />
      <AppHeader user={user} onOpenShortcuts={() => setShortcutsOpen(true)} />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          user={user}
          collapsed={collapsed}
          onToggle={toggleNav}
        />
        {/* tabIndex -1 macht den Sprunglink wirksam: der Fokus landet im Hauptinhalt. */}
        <main id="hauptinhalt" tabIndex={-1} className="min-w-0 flex-1 bg-neutral-100">
          <Outlet />
        </main>
      </div>

      <AppFooter />
      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <LiveRegion message={navStatus} />
    </div>
  );
}
