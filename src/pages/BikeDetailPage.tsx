import { useParams, useSearchParams } from 'react-router';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { CharacterSection } from '@/components/detail/CharacterSection';
import { DetailHero } from '@/components/detail/DetailHero';
import { ExtrasSection } from '@/components/detail/ExtrasSection';
import { KeyFigures } from '@/components/detail/KeyFigures';
import { LicenceCard } from '@/components/detail/LicenceCard';
import { SimilarBikes } from '@/components/detail/SimilarBikes';
import { SourcesSection } from '@/components/detail/SourcesSection';
import { SpecList } from '@/components/detail/SpecList';
import { WhatsNew } from '@/components/detail/WhatsNew';
import { YouTubeReview } from '@/components/detail/YouTubeReview';
import { useFeatures, useManufacturers, useModel, useModels } from '@/hooks/useBikeData';
import { usePageMeta } from '@/hooks/usePageMeta';
import { t } from '@/i18n';
import { getModelFullName } from '@/lib/data';
import { formatChf, formatPs, formatTorque } from '@/lib/format';
import { findGeneration, generationYears, latestGeneration } from '@/lib/generations';

/** URL-Parameter für die gewählte Generation, z. B. /bikes/yamaha-mt-07?generation=yamaha-mt-07-2021 */
const GENERATION_PARAM = 'generation';

function NotFound() {
  return (
    <Container className="py-16 sm:py-24">
      <PageHeader eyebrow="404" title={t.detail.notFoundTitle} lead={t.detail.notFoundText} />
      <ButtonLink to="/bikes" className="mt-8">
        {t.common.toCatalog}
      </ButtonLink>
    </Container>
  );
}

export default function BikeDetailPage() {
  const { slug } = useParams();
  const model = useModel(slug);
  const models = useModels();
  const manufacturers = useManufacturers();
  const features = useFeatures();
  const [searchParams, setSearchParams] = useSearchParams();

  const generation = model ? findGeneration(model, searchParams.get(GENERATION_PARAM)) : undefined;
  const fullName = model ? getModelFullName(model) : '';

  usePageMeta(
    model && generation
      ? {
          title: `${fullName} (${generationYears(generation)})`,
          description: [
            model.tagline,
            `${formatPs(generation.engine.powerKw)}, ${formatTorque(generation.engine.torqueNm)}, ${formatChf(generation.price.chf)}.`,
          ]
            .filter(Boolean)
            .join(' '),
        }
      : { title: t.detail.notFoundTitle },
  );

  if (!model || !generation) return <NotFound />;

  const manufacturer = manufacturers.find((item) => item.id === model.manufacturerId);

  function selectGeneration(generationId: string) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        // Die neueste Generation ist der Standard und braucht keinen Parameter
        if (model && generationId === latestGeneration(model).id) next.delete(GENERATION_PARAM);
        else next.set(GENERATION_PARAM, generationId);
        return next;
      },
      { replace: true },
    );
  }

  return (
    <Container className="space-y-16 py-8 sm:space-y-24 sm:py-12">
      <DetailHero
        model={model}
        manufacturer={manufacturer}
        generation={generation}
        onGenerationChange={selectGeneration}
      />
      <KeyFigures generation={generation} />
      <WhatsNew generation={generation} />
      <LicenceCard generation={generation} />
      <SpecList generation={generation} />
      <ExtrasSection generation={generation} features={features} />
      <CharacterSection generation={generation} />
      <SourcesSection generation={generation} />
      <SimilarBikes model={model} models={models} manufacturers={manufacturers} />
      {/* Ganz unten: das Video-Review – nur wenn es einen bestätigten Link gibt */}
      {generation.youtubeReviewUrl && (
        <YouTubeReview
          url={generation.youtubeReviewUrl}
          name={fullName}
          category={model.category}
        />
      )}
    </Container>
  );
}
