import { Pause, Play, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { RadarChart } from '@/components/charts/RadarChart';
import { RingGauge } from '@/components/charts/RingGauge';
import { Button } from '@/components/ui/Button';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { Card, Section } from '@/components/ui/Section';
import type { Generation, ProfileKey } from '@/data/schema';
import { t } from '@/i18n';
import { formatDecibel } from '@/lib/format';

const PROFILE_KEYS: readonly ProfileKey[] = ['beginner', 'city', 'touring', 'sport', 'offroad'];

/** Kennzeichnung «Redaktionelle Einschätzung» mit Erklärung. */
function EditorialLabel() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted">
      {t.editorial.label}
      <InfoTooltip label={t.editorial.label} align="end">
        {t.editorial.hint}
      </InfoTooltip>
    </span>
  );
}

function CardHeading({ title }: { title: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <EditorialLabel />
    </div>
  );
}

/** Equalizer-Balken, solange der Sound läuft (nur transform). */
function Equalizer() {
  const bars = [0.55, 1, 0.4, 0.85, 0.6];
  return (
    <span aria-hidden="true" className="flex h-6 items-end gap-1">
      {bars.map((peak, index) => (
        <motion.span
          key={index}
          className="h-full w-1 origin-bottom rounded-full bg-accent"
          animate={{ scaleY: [0.25, peak, 0.45, 1, 0.25] }}
          transition={{ duration: 1 + index * 0.15, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </span>
  );
}

/** Audio-Player – erscheint nur, wenn es eine Audiodatei gibt. */
function SoundPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }

  return (
    <div className="mt-4 flex items-center gap-3">
      <Button variant="secondary" size="sm" onClick={toggle}>
        {playing ? (
          <Pause aria-hidden="true" className="size-4" />
        ) : (
          <Play aria-hidden="true" className="size-4" />
        )}
        {playing ? t.detail.soundPause : t.detail.soundPlay}
      </Button>
      {playing && <Equalizer />}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}

/** Einsatzprofil, Tuning und Sound – alles redaktionelle Einschätzungen. */
export function CharacterSection({ generation }: { generation: Generation }) {
  const { scores, sound } = generation;
  const profileValues = PROFILE_KEYS.map((key) => ({
    key,
    label: t.profile[key],
    value: scores.profile[key],
  }));

  return (
    <Section title={t.detail.character}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeading title={t.detail.profileTitle} />
          <div className="mx-auto w-full max-w-[19rem] px-4">
            <RadarChart
              values={profileValues}
              label={t.detail.profileTitle}
              animationKey={generation.id}
            />
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {profileValues.map((item) => (
              <li key={item.key} className="flex justify-between gap-2">
                <span className="text-ink-muted">{item.label}</span>
                <span className="font-medium tabular-nums">{item.value}/10</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeading title={t.detail.tuningTitle} />
          <div className="flex justify-around gap-4">
            <RingGauge
              key={`v-${generation.id}`}
              score={scores.tuningVisual}
              label={t.specs.tuningVisual}
            />
            <RingGauge
              key={`p-${generation.id}`}
              score={scores.tuningPerformance}
              label={t.specs.tuningPerformance}
            />
          </div>
          <p className="mt-5 text-sm">{generation.tuningNote}</p>
          <p className="mt-3 flex gap-2 text-xs text-ink-subtle">
            <ShieldAlert aria-hidden="true" className="mt-px size-3.5 shrink-0" />
            <span>{t.tuning.disclaimer}</span>
          </p>
        </Card>

        <Card>
          <CardHeading title={t.detail.soundTitle} />
          <div className="flex justify-center">
            <RingGauge key={`s-${generation.id}`} score={scores.sound} label={t.specs.sound} />
          </div>
          <p className="mt-5 text-sm">{sound.description}</p>
          {sound.noiseDbA && (
            <p className="mt-2 text-sm text-ink-muted">
              {t.specs.noise}: <span className="tabular-nums">{formatDecibel(sound.noiseDbA)}</span>
            </p>
          )}
          {sound.audioSrc && <SoundPlayer src={sound.audioSrc} />}
        </Card>
      </div>
    </Section>
  );
}
