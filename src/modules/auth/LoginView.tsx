import { useRef, useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppFooter } from '../../components/AppFooter';
import { Modal } from '../../components/Dialog';
import { Button, Field, StatusMessage, inputClass } from '../../components/ui';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useAppStore } from '../../store/useAppStore';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginView() {
  useDocumentTitle('Anmeldung');
  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState('');
  const [registerOpen, setRegisterOpen] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function submit() {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) {
      next.email = 'Bitte geben Sie Ihre dienstliche E-Mail-Adresse ein.';
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = 'Die Adresse ist unvollständig. Beispiel: vorname.nachname@mvcr.landesverwaltung.de';
    }
    if (!password) next.password = 'Bitte geben Sie Ihr Passwort ein.';
    setErrors(next);

    const count = Object.keys(next).length;
    if (count > 0) {
      setFormError(
        'Die Anmeldung ist nicht möglich: ' +
          count +
          (count === 1 ? ' Eingabe ist' : ' Eingaben sind') +
          ' unvollständig. Der Fokus steht im ersten fehlerhaften Feld.',
      );
      if (next.email) emailRef.current?.focus();
      else passwordRef.current?.focus();
      return;
    }

    setFormError('');
    login(email);
    navigate('/chat', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <header className="border-b-2 border-primary-600 bg-white px-6 py-3">
        <p className="flex items-baseline gap-4">
          <span className="text-2xl font-bold tracking-tight text-primary-700">F13</span>
          <span className="text-sm text-neutral-700">
            KI-Assistent für Beschäftigte der Landesverwaltung
          </span>
        </p>
      </header>

      <main
        id="hauptinhalt"
        tabIndex={-1}
        className="flex flex-1 items-start justify-center px-6 py-10"
      >
        <div className="w-full max-w-lg">
          <h1 className="mb-2">Anmeldung</h1>
          <p className="mb-5 text-neutral-700">
            F13 ist nur aus dem Landesverwaltungsnetz erreichbar. Melden Sie sich mit Ihrer
            dienstlichen E-Mail-Adresse an.
          </p>

          <div
            aria-live="assertive"
            aria-atomic="true"
            role="alert"
            className={formError ? 'mb-4' : 'sr-only'}
          >
            {formError && (
              <StatusMessage tone="error" title="Anmeldung nicht möglich">
                <p>{formError}</p>
              </StatusMessage>
            )}
          </div>

          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
            className="rounded border border-neutral-200 bg-white p-6"
          >
            <Field
              id="login-email"
              label="Dienstliche E-Mail-Adresse"
              error={errors.email}
              required
            >
              {(props) => (
                <input
                  {...props}
                  ref={emailRef}
                  type="email"
                  autoComplete="username"
                  placeholder="vorname.nachname@mvcr.landesverwaltung.de"
                  className={inputClass}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                />
              )}
            </Field>

            <Field id="login-passwort" label="Passwort" error={errors.password} required>
              {(props) => (
                <div className="flex gap-2">
                  <input
                    {...props}
                    ref={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={inputClass}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="h-5 w-5" />
                    ) : (
                      <Eye aria-hidden="true" className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              )}
            </Field>

            <Button type="submit" variant="primary" className="w-full justify-center">
              <LogIn aria-hidden="true" className="h-5 w-5" />
              Anmelden
            </Button>

            <div className="mt-6 border-t border-neutral-200 pt-5">
              <p className="mb-3 text-sm text-neutral-700">
                Noch kein Zugang? Beschäftigte des Hauses beantragen die Freischaltung über die
                Registrierung. Die Freigabe erfolgt durch das Referat Z 1.
              </p>
              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={() => setRegisterOpen(true)}
              >
                <UserPlus aria-hidden="true" className="h-5 w-5" />
                Registrieren
              </Button>
            </div>
          </form>

          <StatusMessage tone="info" className="mt-5">
            <p>
              Prototyp mit Beispieldaten: Anmeldedaten werden nicht geprüft, jede vollständige
              Eingabe führt zur Anmeldung. Adressen, die mit <code>admin</code> beginnen, erhalten
              zur Erprobung die Rolle Administration mit dem Bereich „Verwaltung“.
            </p>
          </StatusMessage>
        </div>
      </main>

      <AppFooter />

      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />
    </div>
  );
}

function RegisterDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [orgUnit, setOrgUnit] = useState('');
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  function reset() {
    setEmail('');
    setName('');
    setOrgUnit('');
    setErrors({});
    setSubmitted(false);
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
      title="Zugang beantragen"
      description="Die Registrierung beantragt die Freischaltung für F13. Sie erhalten eine Rückmeldung an Ihre dienstliche Adresse."
      width="sm"
      initialFocus={emailRef}
      footer={
        submitted ? (
          <Button variant="primary" onClick={() => onOpenChange(false)}>
            Schließen
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const next: { email?: string; name?: string } = {};
                if (!EMAIL_PATTERN.test(email.trim())) {
                  next.email = 'Bitte geben Sie Ihre dienstliche E-Mail-Adresse ein.';
                }
                if (!name.trim()) next.name = 'Bitte geben Sie Ihren Namen ein.';
                setErrors(next);
                if (next.email) {
                  emailRef.current?.focus();
                  return;
                }
                if (next.name) {
                  nameRef.current?.focus();
                  return;
                }
                setSubmitted(true);
              }}
            >
              Antrag absenden
            </Button>
          </>
        )
      }
    >
      {submitted ? (
        <StatusMessage tone="success" role="status" title="Antrag aufgenommen">
          <p>
            Der Antrag für {email.trim()} ist eingegangen und wird vom Referat Z 1 geprüft. Die
            Freischaltung erfolgt in der Regel innerhalb eines Arbeitstages; Sie werden per E-Mail
            benachrichtigt.
          </p>
          <p className="mt-2">Im Prototyp wird kein Antrag tatsächlich versandt.</p>
        </StatusMessage>
      ) : (
        <>
          <Field id="reg-email" label="Dienstliche E-Mail-Adresse" error={errors.email} required>
            {(props) => (
              <input
                {...props}
                ref={emailRef}
                type="email"
                className={inputClass}
                placeholder="vorname.nachname@mvcr.landesverwaltung.de"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
              />
            )}
          </Field>
          <Field id="reg-name" label="Name" error={errors.name} required>
            {(props) => (
              <input
                {...props}
                ref={nameRef}
                type="text"
                className={inputClass}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
              />
            )}
          </Field>
          <Field
            id="reg-orgunit"
            label="Referat oder Organisationseinheit"
            description="Optional. Beschleunigt die Zuordnung bei der Freischaltung."
          >
            {(props) => (
              <input
                {...props}
                type="text"
                className={inputClass}
                placeholder="z. B. Referat Z 3"
                value={orgUnit}
                onChange={(event) => setOrgUnit(event.target.value)}
              />
            )}
          </Field>
        </>
      )}
    </Modal>
  );
}
