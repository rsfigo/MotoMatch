import {
  Activity,
  Armchair,
  Bot,
  CircleGauge,
  Cog,
  Cpu,
  Flame,
  Gauge,
  KeyRound,
  Layers,
  Lightbulb,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  SquareParking,
  Tablet,
  Usb,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import type { FeatureIconName } from '@/data/schema';

/** Zuordnung der Icon-Namen aus features.json zu lucide-Icons. */
const ICONS: Record<FeatureIconName, LucideIcon> = {
  flame: Flame,
  armchair: Armchair,
  gauge: Gauge,
  wind: Wind,
  'key-round': KeyRound,
  'square-parking': SquareParking,
  usb: Usb,
  'shield-check': ShieldCheck,
  activity: Activity,
  lightbulb: Lightbulb,
  'circle-gauge': CircleGauge,
  'sliders-horizontal': SlidersHorizontal,
  cpu: Cpu,
  tablet: Tablet,
  smartphone: Smartphone,
  layers: Layers,
  cog: Cog,
  bot: Bot,
};

export function FeatureIcon({ name, className }: { name: FeatureIconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" className={className} />;
}
