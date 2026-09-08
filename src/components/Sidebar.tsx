import { LogOut, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { navItemsForRole } from './navigation';
import { Button, cx } from './ui';
import { useAppStore } from '../store/useAppStore';
import type { User } from '../types';

export function Sidebar({
  user,
  collapsed,
  onToggle,
}: {
  user: User;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const logout = useAppStore((s) => s.logout);
  const navigate = useNavigate();
  const items = navItemsForRole(user.role);

  const itemClass = (isActive: boolean) =>
    cx(
      'relative flex min-h-[44px] items-center gap-3 border-l-4 px-3 py-2 text-base',
      collapsed && 'justify-center px-0',
      isActive
        ? 'border-l-primary-600 bg-primary-50 font-bold text-primary-700'
        : 'border-l-transparent text-neutral-800 hover:bg-neutral-100',
    );

  return (
    <nav
      id="hauptnavigation"
      aria-label="Hauptnavigation"
      className={cx(
        'flex shrink-0 flex-col justify-between border-r border-neutral-200 bg-white py-3',
        collapsed ? 'w-[64px]' : 'w-[228px]',
      )}
    >
      <div>
        <div className={cx('mb-2 flex px-2', collapsed ? 'justify-center' : 'justify-end')}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            aria-label={
              collapsed
                ? 'Navigation ausklappen, Beschriftungen einblenden'
                : 'Navigation einklappen, nur Symbole anzeigen'
            }
          >
            {collapsed ? (
              <PanelLeftOpen aria-hidden="true" className="h-5 w-5" />
            ) : (
              <PanelLeftClose aria-hidden="true" className="h-5 w-5" />
            )}
          </Button>
        </div>

        <ul>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => itemClass(isActive)}
                  title={collapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        aria-hidden="true"
                        className={cx('h-6 w-6 shrink-0', isActive ? 'stroke-[2.5]' : 'stroke-2')}
                      />
                      {collapsed ? (
                        <span className="sr-only">{item.label}</span>
                      ) : (
                        <span className="truncate">{item.label}</span>
                      )}
                      {isActive && <span className="sr-only"> (aktuelle Ansicht)</span>}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-neutral-200 pt-3">
        <ul>
          <li>
            <NavLink
              to="/einstellungen"
              className={({ isActive }) => itemClass(isActive)}
              title={collapsed ? 'Einstellungen' : undefined}
            >
              {({ isActive }) => (
                <>
                  <Settings aria-hidden="true" className="h-6 w-6 shrink-0" />
                  {collapsed ? (
                    <span className="sr-only">Einstellungen</span>
                  ) : (
                    <span>Einstellungen</span>
                  )}
                  {isActive && <span className="sr-only"> (aktuelle Ansicht)</span>}
                </>
              )}
            </NavLink>
          </li>
        </ul>

        {!collapsed && (
          <p className="px-4 pb-2 pt-3 text-sm">
            <span className="block font-semibold">{user.fullName}</span>
            <span className="block text-neutral-700">{user.role}</span>
          </p>
        )}

        <div className={cx('px-2', collapsed && 'flex justify-center')}>
          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'sm'}
            onClick={() => {
              logout();
              navigate('/anmeldung', { replace: true });
            }}
            aria-label={collapsed ? 'Abmelden' : undefined}
            className={collapsed ? '' : 'w-full justify-start'}
          >
            <LogOut aria-hidden="true" className="h-5 w-5" />
            {!collapsed && 'Abmelden'}
          </Button>
        </div>
      </div>
    </nav>
  );
}
