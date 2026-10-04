/**
 * Zentrales Animations-System
 * ---------------------------
 * Alle Animationen verwenden diese Tokens, damit sich die Seite einheitlich anfühlt.
 *
 * Regeln:
 * - Dauer 150–600 ms, Stagger 40–60 ms.
 * - Nur `transform` und `opacity` animieren (läuft auf der GPU, hält 60 fps).
 * - `prefers-reduced-motion` wird global über <MotionConfig reducedMotion="user"> respektiert:
 *   Transform-Animationen fallen dann weg, Fades bleiben.
 *
 * Motion rechnet Zeiten in Sekunden, nicht in Millisekunden.
 */
import { stagger, type Transition, type Variants } from 'motion/react';

/** Dauer in Sekunden. */
export const duration = {
  instant: 0.15,
  fast: 0.2,
  base: 0.3,
  slow: 0.45,
  slower: 0.6,
} as const;

/** Easing-Kurven (kubische Bézier-Kurven). */
export const ease = {
  /** Standard für Einblendungen: schneller Start, weiches Auslaufen. */
  out: [0.22, 1, 0.36, 1],
  /** Für Bewegungen von A nach B. */
  inOut: [0.65, 0, 0.35, 1],
  /** Für Ausblendungen: beschleunigt aus dem Bild. */
  in: [0.55, 0, 1, 0.45],
} as const;

/** Federn für Interaktionen (Buttons, Toggles, Layout-Wechsel). */
export const spring = {
  /** Direkt und knackig: Buttons, Chips, Toggles. */
  snappy: { type: 'spring', stiffness: 520, damping: 32, mass: 0.8 },
  /** Weich: grössere Flächen wie Leisten und Panels. */
  gentle: { type: 'spring', stiffness: 260, damping: 30 },
  /** Mit leichtem Überschwingen: Tacho-Nadel, kleine Highlights. */
  bouncy: { type: 'spring', stiffness: 380, damping: 18 },
  /** Für Layout-Animationen (Karten ordnen sich neu an). */
  layout: { type: 'spring', stiffness: 400, damping: 38 },
} as const satisfies Record<string, Transition>;

/** Federn für Werte, die einem Ziel folgen (useSpring), z. B. Karten-Tilt oder Tacho-Nadel. */
export const followSpring = {
  soft: { stiffness: 220, damping: 26 },
  needle: { stiffness: 120, damping: 14, mass: 0.9 },
} as const;

/** Zeitversatz zwischen Elementen einer Liste (Sekunden). */
export const staggerStep = {
  tight: 0.04,
  base: 0.05,
  loose: 0.06,
} as const;

/** Standard-Übergang für Einblendungen. */
export const enterTransition = { duration: duration.slow, ease: ease.out } as const;

// ---------------------------------------------------------------------------
// Wiederverwendbare Varianten
// ---------------------------------------------------------------------------

/**
 * Übergang mit optionaler Verzögerung. Ohne Verzögerung bleibt `delay` bewusst weg,
 * damit ein Stagger-Container (delayChildren) die Verzögerung bestimmen kann.
 */
function withDelay(transition: Transition, delay: number | undefined): Transition {
  return delay === undefined ? transition : { ...transition, delay };
}

/**
 * Einblenden mit leichtem Anheben.
 * Verzögerung über `custom` (Sekunden): <motion.p variants={fadeUp} custom={0.3} … />
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay?: number) => ({
    opacity: 1,
    y: 0,
    transition: withDelay(enterTransition, delay),
  }),
};

/** Nur Einblenden. Verzögerung ebenfalls über `custom`. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay?: number) => ({
    opacity: 1,
    transition: withDelay({ duration: duration.base, ease: ease.out }, delay),
  }),
};

/** Einblenden mit leichter Vergrösserung (Karten, Dialoge). */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: enterTransition },
};

/**
 * Container, der seine Kinder nacheinander einblendet.
 * Die Kinder brauchen Varianten mit denselben Namen ("hidden"/"visible").
 */
export function staggerContainer(step: number = staggerStep.base, startDelay = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { delayChildren: stagger(step, { startDelay }) } },
  };
}

/** Seitenwechsel: neue Seite gleitet sanft ein, alte blendet schnell aus. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, y: -6, transition: { duration: duration.instant, ease: ease.in } },
};
