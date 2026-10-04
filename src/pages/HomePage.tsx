import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Container } from '@/components/layout/Container';
import { AnimatedHeadline } from '@/components/ui/AnimatedHeadline';
import { ButtonLink } from '@/components/ui/Button';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';
import { fadeUp } from '@/lib/motion';

/** Dezente Lichtflecken im Hintergrund – Verläufe statt Blur-Filter, damit es auch auf dem Handy flüssig bleibt. */
function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden mask-[linear-gradient(to_bottom,black_65%,transparent)]"
    >
      <div className="absolute -top-48 left-1/2 size-[44rem] -translate-x-1/2 animate-drift rounded-full bg-[radial-gradient(closest-side,var(--mm-glow-color),transparent)] motion-reduce:animate-none" />
      <div className="absolute top-24 -right-40 hidden size-[30rem] animate-drift-slow rounded-full bg-[radial-gradient(closest-side,var(--mm-accent-soft),transparent)] motion-reduce:animate-none md:block" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--mm-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--mm-line)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_top,black_20%,transparent_70%)] bg-size-[56px_56px]" />
    </div>
  );
}

export default function HomePage() {
  usePageMeta({});

  return (
    <section className="relative isolate">
      <HeroBackground />
      <Container className="pt-14 pb-20 sm:pt-24 sm:pb-28">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-xs font-medium text-ink-muted"
        >
          <Sparkles aria-hidden="true" className="size-3.5 text-accent-ink" />
          {t.home.eyebrow}
        </motion.p>

        <AnimatedHeadline
          text={t.home.title}
          delay={0.1}
          className="mt-6 max-w-4xl text-[2.6rem] leading-[1.02] font-bold xs:text-5xl sm:text-6xl lg:text-7xl"
        />

        <motion.p
          variants={fadeUp}
          custom={0.45}
          initial="hidden"
          animate="visible"
          className="mt-6 max-w-2xl text-base text-ink-muted sm:text-lg"
        >
          {t.home.lead}
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={0.55}
          initial="hidden"
          animate="visible"
          className="mt-9 flex flex-col gap-3 xs:flex-row"
        >
          <ButtonLink to="/bikes" size="lg">
            {t.home.ctaCatalog}
            <ArrowRight aria-hidden="true" className="size-4" />
          </ButtonLink>
          <ButtonLink to="/match" size="lg" variant="secondary">
            {t.home.ctaMatch}
          </ButtonLink>
        </motion.div>
      </Container>
    </section>
  );
}
