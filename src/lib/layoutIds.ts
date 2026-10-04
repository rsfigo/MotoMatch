/**
 * IDs für geteilte Layout-Animationen (Motion `layoutId`).
 * Elemente mit derselben ID «wandern» beim Seitenwechsel von einer Stelle zur anderen,
 * z. B. das Bike-Bild von der Katalogkarte in die Detailseite.
 */
export function bikeImageLayoutId(modelId: string): string {
  return `bike-image-${modelId}`;
}
