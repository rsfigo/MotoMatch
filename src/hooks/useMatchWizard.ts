import { useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import {
  MATCH_STEPS,
  parseMatchParams,
  serializeMatchParams,
  withStepDefaults,
  type MatchDraft,
  type MatchView,
} from '@/lib/matchAnswers';

/** Merkt im Verlauf, von welcher Ansicht man kam – für «Zurück» ohne neuen Eintrag. */
interface WizardHistoryState {
  wizardFrom?: MatchView;
}

/**
 * Ablauf des Match-Wizards. Antworten und Schritt stehen in der URL; jede neue Frage ist
 * ein eigener Verlaufseintrag (Browser-«Zurück» geht eine Frage zurück).
 *
 * Die Antwort auf die aktuelle Frage kommt erst mit «Weiter» in die URL – so ändert ein
 * Schieberegler nicht bei jeder Bewegung die Adresse (Safari begrenzt das).
 */
export function useMatchWizard() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { draft, view } = useMemo(() => parseMatchParams(searchParams), [searchParams]);

  function go(nextDraft: MatchDraft, nextView: MatchView, replace = false) {
    const state: WizardHistoryState = { wizardFrom: view };
    void navigate({ search: serializeMatchParams(nextDraft, nextView) }, { replace, state });
  }

  /**
   * Weitergehen: Erst die Antwort im aktuellen Verlaufseintrag sichern (dann ist sie nach
   * «Zurück» noch ausgewählt), dann die nächste Ansicht als neuen Eintrag öffnen.
   */
  function advance(nextDraft: MatchDraft, nextView: MatchView) {
    void navigate(
      { search: serializeMatchParams(nextDraft, view) },
      { replace: true, state: location.state as WizardHistoryState | null },
    );
    go(nextDraft, nextView);
  }

  /** Antworten inklusive der aktuellen Frage (mit ihren Vorgaben). */
  function withCurrent(patch: MatchDraft): MatchDraft {
    const merged = { ...draft, ...patch };
    return view === 'result' ? merged : withStepDefaults(MATCH_STEPS[view] ?? 'licence', merged);
  }

  return {
    draft,
    view,

    /** Zur nächsten Frage bzw. zum Ergebnis. */
    next: (patch: MatchDraft) => {
      if (view === 'result') return;
      advance(withCurrent(patch), view + 1 >= MATCH_STEPS.length ? 'result' : view + 1);
    },

    /** Direkt zum Ergebnis (wenn alle Fragen schon beantwortet sind). */
    toResult: (patch: MatchDraft) => advance(withCurrent(patch), 'result'),

    /** Eine Frage zurück: im Verlauf zurück, wenn man von dort kam, sonst direkt hin. */
    back: () => {
      const previous = view === 'result' ? MATCH_STEPS.length - 1 : view - 1;
      if (previous < 0) return;
      const from = (location.state as WizardHistoryState | null)?.wizardFrom;
      if (from === previous) void navigate(-1);
      else go(draft, previous, true);
    },

    /** Zu einer bestimmten Frage springen (z. B. «Antwort ändern» im Ergebnis). */
    goTo: (target: number) => go(draft, target),

    restart: () => go({}, 0),
  };
}
