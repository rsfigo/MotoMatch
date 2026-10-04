/**
 * Umrechnungen und berechnete Werte.
 * Diese Werte werden nie gespeichert, sondern immer aus den Daten berechnet.
 */

/** 1 PS = 0.7355 kW */
export const KW_PER_PS = 0.7355;

/** Rechnet kW in PS um (ungerundet). */
export function kwToPs(kw: number): number {
  return kw / KW_PER_PS;
}

/** Leistungsgewicht in kW pro kg. */
export function powerToWeight(powerKw: number, weightKg: number): number {
  return powerKw / weightKg;
}

/** Theoretische Reichweite in km aus Tankinhalt (Liter) und Verbrauch (l/100 km). */
export function rangeKm(tankL: number, consumptionL100km: number): number {
  return (tankL / consumptionL100km) * 100;
}
