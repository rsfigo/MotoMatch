import { describe, expect, it, vi } from 'vitest';
import { supabaseHeaders } from '@/data/db/client';
import { datasetToRows } from '@/data/db/mapping';
import { embedRows, loadDataset } from '@/test/datasetRows';
import { fakeLegacyKey } from '@/test/fakeKeys';
import { createSupabaseRepository, DataLoadError } from './supabaseRepository';

const dataset = loadDataset();
const rows = datasetToRows(dataset);
const PROJECT_URL = 'https://beispiel.supabase.co';

interface Request {
  path: string;
  query: URLSearchParams;
  headers: Headers;
}

/** Ein nachgebautes fetch, das wie die Supabase-API (PostgREST) antwortet. */
function fakeApi(respond: (request: Request) => { status: number; body: unknown }) {
  const requests: Request[] = [];
  const fetchFake: typeof fetch = (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const request = {
      path: url.pathname,
      query: url.searchParams,
      headers: new Headers(init?.headers),
    };
    requests.push(request);
    const { status, body } = respond(request);
    return Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  };
  return { fetchFake, requests };
}

/** Antworten wie die echte Datenbank: Liste ohne Quellen, Detail mit Quellen. */
function realisticResponse({ path, query }: Request) {
  const table = path.replace('/rest/v1/', '');
  if (table === 'manufacturers') return { status: 200, body: rows.manufacturers };
  if (table === 'features') return { status: 200, body: rows.features };
  const withSources = query.get('select')?.includes('generation_sources') ?? false;
  const models = embedRows(rows, { withSources });
  const id = query.get('id')?.replace('eq.', '');
  return { status: 200, body: id ? models.filter((model) => model.id === id) : models };
}

describe('Header für die Supabase-API', () => {
  it('neue Schlüssel nur im apikey-Header', () => {
    expect(supabaseHeaders('sb_publishable_abc')).toEqual({ apikey: 'sb_publishable_abc' });
  });

  it('alte JWT-Schlüssel (anon) zusätzlich als Bearer', () => {
    const jwt = fakeLegacyKey('anon');
    expect(supabaseHeaders(jwt)).toEqual({ apikey: jwt, Authorization: `Bearer ${jwt}` });
  });
});

describe('SupabaseRepository (mit nachgebauter API)', () => {
  it('Liste: alle Modelle mit Generationen und Extras, ohne Quellen, in einer Anfrage', async () => {
    const { fetchFake, requests } = fakeApi(realisticResponse);
    const repository = createSupabaseRepository({
      url: PROJECT_URL,
      key: 'sb_publishable_test',
      fetch: fetchFake,
    });

    const models = await repository.listModels();
    expect(requests).toHaveLength(1);
    expect(requests[0]?.path).toBe('/rest/v1/models');
    expect(requests[0]?.query.get('select')).toContain('generation_features');
    expect(requests[0]?.query.get('select')).not.toContain('generation_sources');
    expect(requests[0]?.headers.get('apikey')).toBe('sb_publishable_test');
    expect(requests[0]?.headers.get('Authorization')).toBeNull();

    expect(models).toHaveLength(dataset.models.length);
    const withoutSources = dataset.models.map((model) => ({
      ...model,
      generations: model.generations.map((generation) => ({ ...generation, sources: [] })),
    }));
    expect(models).toEqual(withoutSources);
  });

  it('Detail: ein Modell inklusive Quellen, unbekannte IDs ergeben null', async () => {
    const { fetchFake, requests } = fakeApi(realisticResponse);
    const repository = createSupabaseRepository({ url: PROJECT_URL, key: 'k', fetch: fetchFake });

    const model = await repository.getModel('yamaha-mt-07');
    expect(requests[0]?.query.get('id')).toBe('eq.yamaha-mt-07');
    expect(model).toEqual(dataset.models.find((item) => item.id === 'yamaha-mt-07'));
    expect(await repository.getModel('gibt-es-nicht')).toBeNull();
  });

  it('Hersteller und Extras (Extras in der Reihenfolge von features.json)', async () => {
    const { fetchFake } = fakeApi(realisticResponse);
    const repository = createSupabaseRepository({ url: PROJECT_URL, key: 'k', fetch: fetchFake });
    expect(await repository.listManufacturers()).toEqual(dataset.manufacturers);
    expect(await repository.listFeatures()).toEqual(dataset.features);
  });

  it('Fehler der API werden zu einer verständlichen Meldung', async () => {
    const { fetchFake } = fakeApi(() => ({
      status: 401,
      body: { message: 'Invalid API key', code: '401' },
    }));
    const repository = createSupabaseRepository({ url: PROJECT_URL, key: 'k', fetch: fetchFake });
    await expect(repository.listModels()).rejects.toThrow(DataLoadError);
    await expect(repository.listModels()).rejects.toThrow(/Invalid API key/);
  });

  it('ein ungültiges Modell fehlt in der Liste, statt den Katalog lahmzulegen', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const [first, ...others] = embedRows(rows, { withSources: true });
    if (!first) throw new Error('Testdaten fehlen');
    const broken = { ...first, category: 'raketen' };
    const { fetchFake } = fakeApi(({ query }) => ({
      status: 200,
      body: query.has('id') ? [broken] : [broken, ...others],
    }));
    const repository = createSupabaseRepository({ url: PROJECT_URL, key: 'k', fetch: fetchFake });

    const models = await repository.listModels();
    expect(models.map((model) => model.id)).toEqual(others.map((model) => model.id));
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining(broken.id));
    // Direkt aufgerufen gibt es eine klare Fehlermeldung
    await expect(repository.getModel(broken.id)).rejects.toThrow(/Ungültige Daten von Supabase/);
    consoleError.mockRestore();
  });

  it('sind alle Modelle ungültig, gibt es eine Fehlermeldung statt eines leeren Katalogs', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const broken = embedRows(rows, { withSources: false }).map((model) => ({
      ...model,
      category: 'raketen',
    }));
    const { fetchFake } = fakeApi(() => ({ status: 200, body: broken }));
    const repository = createSupabaseRepository({ url: PROJECT_URL, key: 'k', fetch: fetchFake });
    await expect(repository.listModels()).rejects.toThrow(/Ungültige Daten von Supabase/);
    consoleError.mockRestore();
  });

  it('ohne URL oder Schlüssel gibt es einen klaren Hinweis', () => {
    expect(() => createSupabaseRepository({ url: undefined, key: undefined })).toThrow(
      /VITE_SUPABASE_URL/,
    );
  });
});
