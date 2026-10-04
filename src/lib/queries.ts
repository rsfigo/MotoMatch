/**
 * Abfragen für TanStack Query
 * ---------------------------
 * Ein Ort für Schlüssel und Ladefunktionen. TanStack Query speichert die Antworten
 * zwischen, lädt bei Bedarf nach und meldet Fehler (siehe useBikeData.ts).
 */
import { matchPath } from 'react-router';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import { getAllModels, getFeatures, getManufacturers, getModel } from './data';

export const bikeQueries = {
  models: () => queryOptions({ queryKey: ['models'], queryFn: getAllModels }),
  model: (id: string) => queryOptions({ queryKey: ['model', id], queryFn: () => getModel(id) }),
  manufacturers: () => queryOptions({ queryKey: ['manufacturers'], queryFn: getManufacturers }),
  features: () => queryOptions({ queryKey: ['features'], queryFn: getFeatures }),
};

/**
 * Motorraddaten ändern sich selten: 10 Minuten gelten sie als aktuell, eine Stunde bleiben
 * sie im Speicher. Kein Neuladen beim Fensterwechsel; bei Netzwerkfehlern zwei Versuche.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * Lädt die Daten für den ersten Seitenaufruf vor – parallel zum Code der Seite.
 * Fehler gehen hier nicht verloren: Die Seite fragt dann selbst nach und zeigt sie an.
 */
export async function prefetchForPath(client: QueryClient, pathname: string): Promise<void> {
  const slug = matchPath('/bikes/:slug', pathname)?.params.slug;
  await Promise.all([
    client.prefetchQuery(bikeQueries.models()),
    client.prefetchQuery(bikeQueries.manufacturers()),
    client.prefetchQuery(bikeQueries.features()),
    slug ? client.prefetchQuery(bikeQueries.model(slug)) : Promise.resolve(),
  ]);
}
