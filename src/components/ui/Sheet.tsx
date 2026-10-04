import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { duration, ease, spring } from '@/lib/motion';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
  /** Fixe Leiste unten, z. B. «12 Bikes anzeigen» */
  footer?: ReactNode;
}

/**
 * Panel, das von unten hereingleitet (z. B. Filter auf dem Handy).
 * Basiert auf dem nativen <dialog>: Fokus bleibt im Panel, Escape schliesst.
 */
export function Sheet(props: SheetProps) {
  return <AnimatePresence>{props.open && <SheetDialog {...props} />}</AnimatePresence>;
}

function SheetDialog({ onClose, title, closeLabel, children, footer }: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    // Seite dahinter nicht mitscrollen
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      if (dialog.open) dialog.close();
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Escape: erst animiert schliessen statt sofort
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none items-end bg-transparent p-0 backdrop:bg-transparent open:flex"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: duration.base } }}
        exit={{ opacity: 0, transition: { duration: duration.fast, ease: ease.in } }}
        onClick={onClose}
      />
      <motion.div
        className="relative flex max-h-[88dvh] w-full flex-col rounded-t-panel border-t border-line-strong bg-canvas shadow-raised"
        initial={{ y: '100%' }}
        animate={{ y: 0, transition: spring.gentle }}
        exit={{ y: '100%', transition: { duration: duration.base, ease: ease.in } }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="grid size-10 place-items-center rounded-full border border-line bg-surface text-ink"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
        {footer && (
          <div className="border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </motion.div>
    </dialog>
  );
}
