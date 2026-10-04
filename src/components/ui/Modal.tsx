import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { duration, ease, spring } from '@/lib/motion';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Name des Dialogs für Screenreader */
  label: string;
  /**
   * Fokus nach dem Schliessen, falls das auslösende Element nicht mehr existiert
   * (z. B. weil der Knopf durch das Hinzufügen verschwunden ist).
   */
  fallbackFocus?: () => HTMLElement | null | undefined;
  children: ReactNode;
}

/**
 * Zentrierter Dialog (z. B. Befehlspalette). Wie das Sheet basiert er auf dem nativen
 * <dialog>: Fokus bleibt im Dialog, Escape schliesst, die Seite dahinter ist gesperrt.
 */
export function Modal(props: ModalProps) {
  return <AnimatePresence>{props.open && <ModalDialog {...props} />}</AnimatePresence>;
}

function ModalDialog({ onClose, label, fallbackFocus, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      if (dialog.open) dialog.close();
      const target = previouslyFocused?.isConnected ? previouslyFocused : fallbackFocus?.();
      target?.focus();
    };
    // Nur beim Öffnen und Schliessen – fallbackFocus fragt das DOM erst beim Schliessen ab
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none items-start justify-center bg-transparent px-3 pt-[8vh] backdrop:bg-transparent open:flex sm:pt-[14vh]"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: duration.fast } }}
        exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-xl overflow-hidden rounded-panel border border-line-strong bg-canvas shadow-raised"
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: spring.snappy }}
        exit={{ opacity: 0, scale: 0.98, transition: { duration: duration.fast, ease: ease.in } }}
      >
        {children}
      </motion.div>
    </dialog>
  );
}
