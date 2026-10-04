import { ArrowRight, Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { t } from '@/i18n';

/** Suchfeld auf der Startseite: führt in den Katalog mit vorausgefüllter Suche. */
export function HomeSearch() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    void navigate(trimmed ? `/bikes?q=${encodeURIComponent(trimmed)}` : '/bikes');
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative max-w-xl">
      <label htmlFor="home-search" className="sr-only">
        {t.home.searchLabel}
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 text-ink-subtle"
      />
      <input
        id="home-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.home.searchPlaceholder}
        className="h-14 w-full rounded-full border border-line-strong bg-surface/90 pr-32 pl-13 text-base text-ink shadow-card backdrop-blur placeholder:text-ink-subtle focus-visible:border-accent [&::-webkit-search-cancel-button]:appearance-none"
      />
      <Button type="submit" size="md" className="absolute top-1/2 right-1.5 -translate-y-1/2">
        {t.home.searchSubmit}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </form>
  );
}
