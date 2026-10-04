/**
 * Technische Daten als Liste von Definitionen
 * -------------------------------------------
 * Jede Zeile weiss, wie ihr Wert gelesen, angezeigt und verglichen wird.
 * Die Detailseite und der Vergleich verwenden dieselben Definitionen.
 *
 * - `value`: Zahl für den Vergleich («bester Wert»), undefined = keine Angabe
 * - `display`: Text für die Anzeige, null = keine Angabe
 * - `core`: Kernfeld – wird immer gezeigt, notfalls mit «k. A.»
 * - `betterWhen`: ob höhere oder tiefere Werte besser sind (oder keins von beidem)
 */
import type { Availability, Estimated, Generation } from '@/data/schema';
import { t } from '@/i18n';
import {
  formatChf,
  formatConsumption,
  formatDate,
  formatDecibel,
  formatDisplacement,
  formatKw,
  formatLitres,
  formatPower,
  formatPowerToWeight,
  formatRange,
  formatRpm,
  formatSeatHeight,
  formatSeconds,
  formatSpeed,
  formatTorque,
  formatWeight,
  NBSP,
} from './format';
import { getLicenceInfo, type LicenceInfo } from './licence';
import { powerToWeight, rangeKm } from './units';

export type BetterWhen = 'higher' | 'lower' | 'none';

export type SpecKey =
  | 'power'
  | 'torque'
  | 'displacement'
  | 'cylinders'
  | 'layout'
  | 'cooling'
  | 'powerToWeight'
  | 'topSpeed'
  | 'accel'
  | 'weight'
  | 'seatHeight'
  | 'tank'
  | 'consumption'
  | 'range'
  | 'gears'
  | 'drive'
  | 'quickshifter'
  | 'blipper'
  | 'throttle'
  | 'licence'
  | 'price'
  | 'noise';

export interface SpecDefinition {
  key: SpecKey;
  label: string;
  betterWhen: BetterWhen;
  /** Kernfeld: immer sichtbar, ohne Wert mit «k. A.» */
  core: boolean;
  value: (generation: Generation) => number | undefined;
  display: (generation: Generation) => string | null;
  /** Zusatzinfo in kleiner Schrift, z. B. «bei 8’750 U/min» */
  detail?: (generation: Generation) => string | undefined;
  /** Bei Mess- oder Schätzwerten: Art der Quelle (für den Tooltip) */
  kind?: (generation: Generation) => Estimated['kind'] | undefined;
}

/** Licence-Info einer Generation (berechnet, nie gespeichert). */
export function licenceOf(generation: Generation): LicenceInfo {
  return getLicenceInfo({
    displacementCc: generation.engine.displacementCc,
    powerKw: generation.engine.powerKw,
    weightKg: generation.chassis.weightKg,
    throttle: generation.throttle,
  });
}

/** Reichweite in km, falls der Verbrauch bekannt ist. */
export function rangeOf(generation: Generation): number | undefined {
  const { tankL, consumptionL100km } = generation.chassis;
  return consumptionL100km ? rangeKm(tankL, consumptionL100km) : undefined;
}

/** Serie (2) > Optional (1) > Nein (0) – für den Vergleich. */
const AVAILABILITY_RANK: Record<Availability, number> = { standard: 2, optional: 1, none: 0 };

/** Zeigt Mess- und Schätzwerte; Schätzungen mit «ca.». */
function displayEstimated(
  estimated: Estimated | undefined,
  format: (value: number) => string,
): string | null {
  if (!estimated) return null;
  const text = format(estimated.value);
  return estimated.kind === 'estimate' ? `${t.data.approx}${NBSP}${text}` : text;
}

const rpmDetail = (rpm: number | undefined) => (rpm ? t.specs.atRpm(formatRpm(rpm)) : undefined);

export const SPECS: Record<SpecKey, SpecDefinition> = {
  power: {
    key: 'power',
    label: t.specs.power,
    betterWhen: 'higher',
    core: true,
    value: (g) => g.engine.powerKw,
    display: (g) => formatPower(g.engine.powerKw),
    detail: (g) => rpmDetail(g.engine.powerRpm),
  },
  torque: {
    key: 'torque',
    label: t.specs.torque,
    betterWhen: 'higher',
    core: true,
    value: (g) => g.engine.torqueNm,
    display: (g) => formatTorque(g.engine.torqueNm),
    detail: (g) => rpmDetail(g.engine.torqueRpm),
  },
  displacement: {
    key: 'displacement',
    label: t.specs.displacement,
    betterWhen: 'none',
    core: true,
    value: (g) => g.engine.displacementCc,
    display: (g) => formatDisplacement(g.engine.displacementCc),
  },
  cylinders: {
    key: 'cylinders',
    label: t.specs.cylinders,
    betterWhen: 'none',
    core: true,
    value: (g) => g.engine.cylinders,
    display: (g) => String(g.engine.cylinders),
  },
  layout: {
    key: 'layout',
    label: t.specs.layout,
    betterWhen: 'none',
    core: false,
    value: () => undefined,
    display: (g) => g.engine.layout,
  },
  cooling: {
    key: 'cooling',
    label: t.specs.cooling,
    betterWhen: 'none',
    core: false,
    value: () => undefined,
    display: (g) => t.cooling[g.engine.cooling],
  },
  powerToWeight: {
    key: 'powerToWeight',
    label: t.specs.powerToWeight,
    betterWhen: 'higher',
    core: false,
    value: (g) => powerToWeight(g.engine.powerKw, g.chassis.weightKg),
    display: (g) => formatPowerToWeight(powerToWeight(g.engine.powerKw, g.chassis.weightKg)),
    detail: () => t.specs.powerToWeightHint,
  },
  topSpeed: {
    key: 'topSpeed',
    label: t.specs.topSpeed,
    betterWhen: 'higher',
    core: true,
    value: (g) => g.performance.topSpeedKmh?.value,
    display: (g) => displayEstimated(g.performance.topSpeedKmh, formatSpeed),
    kind: (g) => g.performance.topSpeedKmh?.kind,
  },
  accel: {
    key: 'accel',
    label: t.specs.accel,
    betterWhen: 'lower',
    core: true,
    value: (g) => g.performance.accel0to100s?.value,
    display: (g) => displayEstimated(g.performance.accel0to100s, formatSeconds),
    kind: (g) => g.performance.accel0to100s?.kind,
  },
  weight: {
    key: 'weight',
    label: t.specs.weight,
    betterWhen: 'lower',
    core: true,
    value: (g) => g.chassis.weightKg,
    display: (g) => formatWeight(g.chassis.weightKg),
    detail: (g) => g.chassis.weightNote,
  },
  seatHeight: {
    key: 'seatHeight',
    label: t.specs.seatHeight,
    betterWhen: 'none',
    core: true,
    value: (g) => g.chassis.seatHeightMm,
    display: (g) => formatSeatHeight(g.chassis.seatHeightMm),
  },
  tank: {
    key: 'tank',
    label: t.specs.tank,
    betterWhen: 'higher',
    core: true,
    value: (g) => g.chassis.tankL,
    display: (g) => formatLitres(g.chassis.tankL),
  },
  consumption: {
    key: 'consumption',
    label: t.specs.consumption,
    betterWhen: 'lower',
    core: false,
    value: (g) => g.chassis.consumptionL100km,
    display: (g) =>
      g.chassis.consumptionL100km ? formatConsumption(g.chassis.consumptionL100km) : null,
  },
  range: {
    key: 'range',
    label: t.specs.range,
    betterWhen: 'higher',
    core: false,
    value: (g) => rangeOf(g),
    display: (g) => {
      const range = rangeOf(g);
      return range ? formatRange(range) : null;
    },
    detail: () => t.specs.rangeHint,
  },
  gears: {
    key: 'gears',
    label: t.specs.gears,
    betterWhen: 'none',
    core: false,
    value: (g) => g.chassis.gears,
    display: (g) => String(g.chassis.gears),
  },
  drive: {
    key: 'drive',
    label: t.specs.drive,
    betterWhen: 'none',
    core: false,
    value: () => undefined,
    display: (g) => t.drive[g.chassis.drive],
  },
  quickshifter: {
    key: 'quickshifter',
    label: t.specs.quickshifter,
    betterWhen: 'higher',
    core: true,
    value: (g) => AVAILABILITY_RANK[g.quickshifter],
    display: (g) => t.availability[g.quickshifter],
  },
  blipper: {
    key: 'blipper',
    label: t.specs.blipper,
    betterWhen: 'higher',
    core: true,
    value: (g) => AVAILABILITY_RANK[g.blipper],
    display: (g) => t.availability[g.blipper],
    detail: () => t.specs.blipperHint,
  },
  throttle: {
    key: 'throttle',
    label: t.specs.throttle,
    betterWhen: 'none',
    core: true,
    value: () => undefined,
    display: (g) => {
      if (!g.throttle.available) return t.data.no;
      const kw = g.throttle.throttledPowerKw;
      return kw ? t.specs.throttleYes(formatKw(kw)) : t.data.yes;
    },
  },
  licence: {
    key: 'licence',
    label: t.specs.licence,
    betterWhen: 'none',
    core: true,
    value: () => undefined,
    display: (g) => t.licence.short[licenceOf(g).required],
    detail: (g) => (licenceOf(g).withThrottle ? t.licence.withThrottle : undefined),
  },
  price: {
    key: 'price',
    label: t.specs.price,
    betterWhen: 'lower',
    core: true,
    value: (g) => g.price.chf,
    display: (g) => formatChf(g.price.chf),
    detail: (g) => t.specs.priceAsOf(formatDate(g.price.asOf)),
  },
  noise: {
    key: 'noise',
    label: t.specs.noise,
    betterWhen: 'none',
    core: false,
    value: (g) => g.sound.noiseDbA,
    display: (g) => (g.sound.noiseDbA ? formatDecibel(g.sound.noiseDbA) : null),
  },
};

/**
 * Welche Zeilen zeigt die Detailseite? Kernfelder immer, optionale nur mit Wert.
 */
export function visibleSpecs(keys: readonly SpecKey[], generation: Generation): SpecDefinition[] {
  return keys
    .map((key) => SPECS[key])
    .filter((spec) => spec.core || spec.display(generation) !== null);
}

/** Gruppen der Detailseite */
export const DETAIL_SPEC_GROUPS = [
  {
    id: 'engine',
    keys: [
      'power',
      'torque',
      'displacement',
      'cylinders',
      'layout',
      'cooling',
      'powerToWeight',
      'topSpeed',
      'accel',
    ],
  },
  {
    id: 'chassis',
    keys: ['weight', 'seatHeight', 'tank', 'consumption', 'range', 'gears', 'drive', 'noise'],
  },
  { id: 'equipment', keys: ['quickshifter', 'blipper', 'throttle', 'licence'] },
  { id: 'price', keys: ['price'] },
] as const satisfies readonly { id: string; keys: readonly SpecKey[] }[];
