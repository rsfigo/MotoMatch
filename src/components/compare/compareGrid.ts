/**
 * Spaltenraster des Vergleichs
 * ----------------------------
 * Links die Zeilenbeschriftung (--label-w), daneben eine Spalte pro Bike, jede mindestens
 * --col-min breit. Reicht der Platz nicht (Handy mit drei Bikes), wird die Tabelle breiter
 * als der sichtbare Bereich und lässt sich seitlich wischen; die Beschriftung bleibt stehen.
 *
 * Kopf und Tabelle rechnen mit denselben Variablen, deshalb stehen die Spalten exakt
 * untereinander. GRID_VARS gehört an ein gemeinsames Elternelement.
 */
import type { CSSProperties } from 'react';

export const GRID_VARS =
  '[--label-w:6rem] [--col-min:7.25rem] sm:[--label-w:10rem] sm:[--col-min:9rem] lg:[--label-w:13rem]';

/**
 * Breite der ganzen Tabelle (im Scroll-Container mit `@container`):
 * mindestens die sichtbare Breite, bei Platzmangel breiter.
 */
export function tableWidth(count: number): string {
  return `max(100cqw, calc(var(--label-w) + ${count} * var(--col-min)))`;
}

/** Spalten einer Tabellenzeile: Beschriftung + ein Bike pro Spalte. */
export function rowColumns(count: number): CSSProperties {
  return { gridTemplateColumns: `var(--label-w) repeat(${count}, minmax(0, 1fr))` };
}

/** Spalten im Kopf (ohne Beschriftung, die steht dort fix daneben). */
export function headerColumns(count: number): CSSProperties {
  return {
    gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
    width: `max(100%, calc(${count} * var(--col-min)))`,
  };
}
