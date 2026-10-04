import { ArrowLeft, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { BikeSilhouette } from '@/components/bike/BikeSilhouette';
import { CompareToggle } from '@/components/bike/CompareToggle';
import { LicenceBadge } from '@/components/bike/LicenceBadge';
import { Badge } from '@/components/ui/Badge';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { Generation, Manufacturer, Model } from '@/data/schema';
import { t } from '@/i18n';
import { generationYears } from '@/lib/generations';
import { bikeImageLayoutId } from '@/lib/layoutIds';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { licenceOf } from '@/lib/specs';

interface DetailHeroProps {
  model: Model;
  manufacturer: Manufacturer | undefined;
  generation: Generation;
  onGenerationChange: (generationId: string) => void;
}

/** Ist die Seite aus der App heraus geöffnet worden, führt «Zurück» dorthin (inkl. Filter). */
function BackLink() {
  const location = useLocation();
  const navigate = useNavigate();
  const cameFromApp = (location.state as { fromApp?: boolean } | null)?.fromApp === true;
  const className =
    'inline-flex items-center gap-1.5 rounded-full py-1 text-sm font-medium text-ink-muted hover:text-ink';

  if (cameFromApp) {
    return (
      <button type="button" onClick={() => void navigate(-1)} className={className}>
        <ArrowLeft aria-hidden="true" className="size-4" />
        {t.detail.back}
      </button>
    );
  }
  return (
    <Link to="/bikes" className={className}>
      <ArrowLeft aria-hidden="true" className="size-4" />
      {t.detail.backToCatalog}
    </Link>
  );
}

export function DetailHero({
  model,
  manufacturer,
  generation,
  onGenerationChange,
}: DetailHeroProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const licence = licenceOf(generation);
  const generationOptions = [...model.generations].reverse().map((item) => ({
    value: item.id,
    label: generationYears(item),
  }));

  return (
    <section>
      <BackLink />
      <div className="mt-4 grid items-center gap-8 lg:mt-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
        {/* Bild: dieselbe layoutId wie auf der Katalogkarte – so «wandert» es hierher */}
        <div
          ref={imageRef}
          className="relative order-first aspect-[16/11] rounded-panel border border-line bg-[radial-gradient(110%_90%_at_50%_100%,var(--mm-surface-3),var(--mm-surface)_75%)] shadow-raised lg:order-last"
        >
          {/* Nur der Lichteffekt wird beschnitten – das hereinfliegende Bild nicht */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-panel">
            <div className="pointer-events-none absolute -bottom-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--mm-glow-color),transparent)]" />
          </div>
          <motion.div
            layoutId={bikeImageLayoutId(model.id)}
            className="absolute inset-0 grid place-items-center px-8 pt-10 sm:px-14"
          >
            <BikeSilhouette category={model.category} />
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="visible"
          className="min-w-0"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold tracking-[0.18em] text-accent-ink uppercase"
          >
            {manufacturer?.name}
          </motion.p>
          <motion.h1 variants={fadeUp} className="mt-1 text-5xl leading-none font-bold sm:text-6xl">
            {model.name}
          </motion.h1>
          {model.tagline && (
            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-xl text-base text-ink-muted sm:text-lg"
            >
              {model.tagline}
            </motion.p>
          )}

          <motion.div variants={fadeUp} className="mt-5 flex flex-wrap items-center gap-2">
            <Badge>{t.categories[model.category]}</Badge>
            <Badge>{generationYears(generation)}</Badge>
            <LicenceBadge licence={licence} />
            {generation.dataStatus === 'needsVerification' ? (
              <Badge
                tone="warning"
                icon={<ShieldAlert aria-hidden="true" className="size-3.5" />}
                title={t.data.needsVerificationHint}
              >
                {t.data.needsVerification}
              </Badge>
            ) : (
              <Badge icon={<ShieldCheck aria-hidden="true" className="size-3.5" />}>
                {t.data.verified}
              </Badge>
            )}
          </motion.div>

          {generationOptions.length > 1 && (
            <motion.div variants={fadeUp} className="mt-6">
              <p className="mb-2 text-xs font-semibold text-ink-muted">{t.detail.generations}</p>
              <SegmentedControl
                label={t.detail.generationLabel}
                options={generationOptions}
                value={generation.id}
                onChange={onGenerationChange}
                className="max-w-md"
              />
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mt-6">
            <CompareToggle
              modelId={model.id}
              getOrigin={() => imageRef.current?.getBoundingClientRect()}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
