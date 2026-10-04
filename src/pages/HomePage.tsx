import { ArrowRight, Sparkles, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { Tachometer } from '@/components/charts/Tachometer';
import { CategoryTiles } from '@/components/home/CategoryTiles';
import { HomeSearch } from '@/components/home/HomeSearch';
import { Container } from '@/components/layout/Container';
import { AnimatedHeadline } from '@/components/ui/AnimatedHeadline';
import { ButtonLink } from '@/components/ui/Button';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';
import { fadeIn, fadeUp } from '@/lib/motion';

/** Dezente Lichtflecken im Hintergrund – Verläufe statt Blur-Filter, damit es auch auf dem Handy flüssig bleibt. */
function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden mask-[linear-gradient(to_bottom,black_65%,transparent)]"
    >
      <div className="absolute -top-48 left-1/2 size-[44rem] -translate-x-1/2 animate-drift rounded-full bg-[radial-gradient(closest-side,var(--mm-glow-color),transparent)] motion-reduce:animate-none lg:left-[70%]" />
      <div className="absolute top-24 -right-40 hidden size-[30rem] animate-drift-slow rounded-full bg-[radial-gradient(closest-side,var(--mm-accent-soft),transparent)] motion-reduce:animate-none md:block" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--mm-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--mm-line)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_top,black_20%,transparent_70%)] bg-size-[56px_56px]" />
    </div>
  );
}

function SectionHeading({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="mb-6 max-w-2xl sm:mb-8">
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      {lead && <p className="mt-2 text-ink-muted">{lead}</p>}
    </div>
  );
}

export default function HomePage() {
  usePageMeta({});
  const heroRef = useRef<HTMLElement>(null);

  return (
    <>
      <section ref={heroRef} className="relative isolate">
        <HeroBackground />
        <Container className="grid items-center gap-10 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
          <div>
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
              className="mt-8"
            >
              <HomeSearch />
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={0.65}
              initial="hidden"
              animate="visible"
              className="mt-5 flex flex-col gap-3 xs:flex-row"
            >
              <ButtonLink to="/bikes" size="lg">
                {t.home.ctaCatalog}
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
              <ButtonLink to="/match" size="lg" variant="secondary">
                {t.home.ctaMatch}
              </ButtonLink>
            </motion.div>
          </div>

          <motion.div
            variants={fadeIn}
            custom={0.2}
            initial="hidden"
            animate="visible"
            className="mx-auto w-full max-w-[19rem] sm:max-w-sm lg:max-w-md"
          >
            <Tachometer scrollTarget={heroRef} label={t.home.gaugeLabel} />
          </motion.div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading title={t.home.categoriesTitle} lead={t.home.categoriesLead} />
          <CategoryTiles />
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative overflow-hidden rounded-panel border border-line bg-surface p-6 shadow-card sm:p-10"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-[radial-gradient(closest-side,var(--mm-glow-color),transparent)]"
            />
            <Wand2 aria-hidden="true" className="size-7 text-accent-ink" />
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{t.home.matchTitle}</h2>
            <p className="mt-3 max-w-xl text-ink-muted">{t.home.matchText}</p>
            <ButtonLink to="/match" size="lg" className="mt-6">
              {t.home.ctaMatch}
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
