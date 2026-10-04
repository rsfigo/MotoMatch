import {
  Award,
  Building2,
  Gauge,
  Map,
  Minus,
  Mountain,
  Plus,
  Ruler,
  Sprout,
  TrendingUp,
  Volume2,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { t } from '@/i18n';
import { cn } from '@/lib/cn';
import { formatChf, formatNumber, formatSeatHeight, NBSP } from '@/lib/format';
import {
  comfortableSeatMm,
  EXPERIENCES,
  IMPORTANCES,
  inseamMm,
  PURPOSES,
  type Experience,
  type Importance,
  type LicenceAnswer,
  type Purpose,
} from '@/lib/match';
import { BUDGET_RANGE, HEIGHT_RANGE, type MatchDraft, type MatchStep } from '@/lib/matchAnswers';
import { OptionCard } from './OptionCard';

export interface StepProps {
  /** Aktuelle Antworten (inkl. Vorgaben der Frage) */
  answers: MatchDraft;
  onChange: (patch: MatchDraft) => void;
}

const LICENCE_ANSWERS: readonly LicenceAnswer[] = ['A1', 'A_LIMITED', 'A', 'none'];

const PURPOSE_ICONS: Record<Purpose, LucideIcon> = {
  city: Building2,
  touring: Map,
  sport: Gauge,
  offroad: Mountain,
};

const EXPERIENCE_ICONS: Record<Experience, LucideIcon> = {
  beginner: Sprout,
  intermediate: TrendingUp,
  experienced: Award,
};

function OptionGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function LicenceStep({ answers, onChange }: StepProps) {
  return (
    <OptionGrid>
      {LICENCE_ANSWERS.map((licence) => {
        const option = t.match.licenceOptions[licence];
        return (
          <OptionCard
            key={licence}
            type="radio"
            name="licence"
            value={licence}
            checked={answers.licence === licence}
            onChange={() => onChange({ licence })}
            label={option.label}
            description={option.description}
            icon={option.badge}
          />
        );
      })}
    </OptionGrid>
  );
}

/** Grosse Zahl mit Einheit, z. B. «175 cm». */
function BigValue({ children }: { children: ReactNode }) {
  return (
    <p className="text-center font-display text-5xl font-bold tabular-nums sm:text-6xl">
      {children}
    </p>
  );
}

function StepperButton({
  label,
  icon: Icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong bg-surface text-ink hover:bg-surface-2 disabled:opacity-40"
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  );
}

function HeightStep({ answers, onChange }: StepProps) {
  const height = answers.heightCm ?? HEIGHT_RANGE.initial;
  const setHeight = (value: number) =>
    onChange({ heightCm: Math.min(HEIGHT_RANGE.max, Math.max(HEIGHT_RANGE.min, value)) });
  const inseam = `${formatNumber(inseamMm(height) / 10)}${NBSP}cm`;
  // Auf 5 mm gerundet – genauer ist die Schätzung ohnehin nicht
  const comfortableSeat = formatSeatHeight(Math.round(comfortableSeatMm(height) / 5) * 5);

  return (
    <div>
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <StepperButton
          label={t.match.heightLess}
          icon={Minus}
          onClick={() => setHeight(height - 1)}
          disabled={height <= HEIGHT_RANGE.min}
        />
        <BigValue>
          {height}
          <span className="ml-1 text-2xl text-ink-muted">cm</span>
        </BigValue>
        <StepperButton
          label={t.match.heightMore}
          icon={Plus}
          onClick={() => setHeight(height + 1)}
          disabled={height >= HEIGHT_RANGE.max}
        />
      </div>
      <Slider
        label={t.match.steps.height.title}
        min={HEIGHT_RANGE.min}
        max={HEIGHT_RANGE.max}
        step={HEIGHT_RANGE.step}
        value={height}
        onChange={setHeight}
        valueText={t.match.heightValue(height)}
        className="mt-6"
      />
      <div aria-hidden="true" className="flex justify-between text-xs text-ink-subtle tabular-nums">
        <span>{t.match.heightValue(HEIGHT_RANGE.min)}</span>
        <span>{t.match.heightValue(HEIGHT_RANGE.max)}</span>
      </div>
      <p className="mt-6 flex gap-3 rounded-control bg-surface-2 p-3.5 text-sm text-ink-muted">
        <Ruler aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-ink" />
        {t.match.heightHint(inseam, comfortableSeat)}
      </p>
    </div>
  );
}

function BudgetStep({ answers, onChange }: StepProps) {
  const any = answers.budgetChf === null;
  const budget = answers.budgetChf ?? BUDGET_RANGE.initial;

  return (
    <div>
      <p className={cn('text-center text-sm font-medium text-ink-muted', any && 'invisible')}>
        {t.match.budgetUpTo}
      </p>
      <BigValue>{any ? t.match.budgetAnyValue : formatChf(budget)}</BigValue>
      <Slider
        label={t.match.steps.budget.title}
        min={BUDGET_RANGE.min}
        max={BUDGET_RANGE.max}
        step={BUDGET_RANGE.step}
        value={budget}
        onChange={(value) => onChange({ budgetChf: value })}
        valueText={t.match.budgetValue(formatChf(budget))}
        disabled={any}
        className="mt-6"
      />
      <div aria-hidden="true" className="flex justify-between text-xs text-ink-subtle tabular-nums">
        <span>{formatChf(BUDGET_RANGE.min)}</span>
        <span>{formatChf(BUDGET_RANGE.max)}</span>
      </div>
      <Switch
        label={t.match.budgetAny}
        checked={any}
        onChange={(checked) => onChange({ budgetChf: checked ? null : BUDGET_RANGE.initial })}
        className="mt-6"
      />
    </div>
  );
}

function PurposeStep({ answers, onChange }: StepProps) {
  const selected = answers.purposes ?? [];

  function toggle(purpose: Purpose) {
    const next = selected.includes(purpose)
      ? selected.filter((item) => item !== purpose)
      : [...selected, purpose];
    // Reihenfolge wie in PURPOSES, damit die URL immer gleich aussieht
    onChange({ purposes: PURPOSES.filter((item) => next.includes(item)) });
  }

  return (
    <OptionGrid>
      {PURPOSES.map((purpose) => {
        const Icon = PURPOSE_ICONS[purpose];
        const option = t.match.purposes[purpose];
        return (
          <OptionCard
            key={purpose}
            type="checkbox"
            name="purpose"
            value={purpose}
            checked={selected.includes(purpose)}
            onChange={() => toggle(purpose)}
            label={option.label}
            description={option.description}
            icon={<Icon className="size-5" />}
          />
        );
      })}
    </OptionGrid>
  );
}

function ExperienceStep({ answers, onChange }: StepProps) {
  return (
    <div className="grid gap-3">
      {EXPERIENCES.map((experience) => {
        const Icon = EXPERIENCE_ICONS[experience];
        const option = t.match.experienceOptions[experience];
        return (
          <OptionCard
            key={experience}
            type="radio"
            name="experience"
            value={experience}
            checked={answers.experience === experience}
            onChange={() => onChange({ experience })}
            label={option.label}
            description={option.description}
            icon={<Icon className="size-5" />}
          />
        );
      })}
    </div>
  );
}

const IMPORTANCE_OPTIONS = IMPORTANCES.map((importance) => ({
  value: String(importance) as `${Importance}`,
  label: t.match.importance[importance],
}));

function ImportanceControl({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string;
  icon: LucideIcon;
  value: Importance;
  onChange: (value: Importance) => void;
}) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 font-semibold">
        <Icon aria-hidden="true" className="size-5 text-accent-ink" />
        {label}
      </p>
      <SegmentedControl
        label={label}
        options={IMPORTANCE_OPTIONS}
        value={String(value) as `${Importance}`}
        onChange={(next) => onChange(Number(next) as Importance)}
      />
    </div>
  );
}

function PreferencesStep({ answers, onChange }: StepProps) {
  return (
    <div className="space-y-8">
      <ImportanceControl
        label={t.match.soundLabel}
        icon={Volume2}
        value={answers.soundImportance ?? 1}
        onChange={(soundImportance) => onChange({ soundImportance })}
      />
      <ImportanceControl
        label={t.match.tuningLabel}
        icon={Wrench}
        value={answers.tuningImportance ?? 1}
        onChange={(tuningImportance) => onChange({ tuningImportance })}
      />
    </div>
  );
}

/** Die Antwort-Bereiche der sechs Fragen. */
export const STEP_CONTENT: Record<MatchStep, (props: StepProps) => ReactNode> = {
  licence: LicenceStep,
  height: HeightStep,
  budget: BudgetStep,
  purpose: PurposeStep,
  experience: ExperienceStep,
  preferences: PreferencesStep,
};
