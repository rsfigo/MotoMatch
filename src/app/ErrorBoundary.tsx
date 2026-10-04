import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  /** Wird angezeigt, sobald ein Kind einen Fehler wirft; retry versucht es erneut. */
  fallback: (error: Error, retry: () => void) => ReactNode;
  /** Vor einem neuen Versuch, z. B. fehlgeschlagene Abfragen zurücksetzen */
  onReset?: () => void;
  /** Ändert sich der Schlüssel (z. B. andere Seite), beginnt die Grenze von vorn. */
  resetKey?: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  resetKey?: string;
}

/**
 * Fängt Fehler beim Rendern ab (z. B. Daten, die nicht geladen werden konnten),
 * damit nie eine leere Seite erscheint. React verlangt dafür eine Klassenkomponente.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState,
  ): Partial<ErrorBoundaryState> | null {
    // Neue Seite: alten Fehler vergessen
    return props.resetKey !== state.resetKey ? { error: null, resetKey: props.resetKey } : null;
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('MotoMatch: Fehler beim Anzeigen der Seite', error, info.componentStack);
  }

  private retry = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  override render() {
    const { error } = this.state;
    return error ? this.props.fallback(error, this.retry) : this.props.children;
  }
}
