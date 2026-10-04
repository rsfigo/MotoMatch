import { Check, Share2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { t } from '@/i18n';
import { duration, ease } from '@/lib/motion';

type ShareStatus = 'idle' | 'copied' | 'failed';

/**
 * «Link teilen»: Auf Touch-Geräten öffnet sich das Teilen-Menü des Systems,
 * sonst wird der Link in die Zwischenablage kopiert.
 */
export function ShareButton({ path }: { path: string }) {
  const [status, setStatus] = useState<ShareStatus>('idle');

  useEffect(() => {
    if (status === 'idle') return;
    const timer = window.setTimeout(() => setStatus('idle'), 2500);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function share() {
    const url = new URL(path, window.location.origin).href;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (touch && 'share' in navigator) {
      try {
        await navigator.share({ title: t.compare.shareTitle, url });
      } catch {
        // Teilen abgebrochen – nichts zu tun
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  const copied = status === 'copied';

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="secondary" size="sm" onClick={() => void share()} className="min-w-36">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'copied' : 'share'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: duration.fast, ease: ease.out } }}
            exit={{ opacity: 0, y: -6, transition: { duration: duration.instant, ease: ease.in } }}
            className="inline-flex items-center gap-2"
          >
            {copied ? (
              <Check aria-hidden="true" className="size-4 text-positive" />
            ) : (
              <Share2 aria-hidden="true" className="size-4" />
            )}
            {copied ? t.compare.copied : t.compare.share}
          </motion.span>
        </AnimatePresence>
      </Button>
      <p role="status" className={status === 'failed' ? 'text-xs text-negative' : 'sr-only'}>
        {status === 'copied' && t.compare.copied}
        {status === 'failed' && t.compare.shareFailed}
      </p>
    </div>
  );
}
