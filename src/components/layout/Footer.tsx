import { Link } from 'react-router';
import { t } from '@/i18n';
import { Container } from './Container';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line">
      <Container className="flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-3">
          <Logo />
          <p className="text-sm text-ink-muted">{t.footer.tagline}</p>
        </div>
        <nav aria-label={t.footer.legalNav}>
          <ul className="flex gap-6 text-sm">
            <li>
              <Link to="/impressum" className="text-ink-muted hover:text-ink">
                {t.footer.imprint}
              </Link>
            </li>
            <li>
              <Link to="/datenschutz" className="text-ink-muted hover:text-ink">
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
      <Container className="border-t border-line py-6">
        <p className="text-xs leading-relaxed text-ink-subtle">{t.footer.disclaimer}</p>
        <p className="mt-2 text-xs text-ink-subtle">© {year} MotoMatch</p>
      </Container>
    </footer>
  );
}
