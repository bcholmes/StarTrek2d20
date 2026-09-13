import { test, expect, describe, beforeAll, beforeEach } from '@jest/globals';
import { Era } from '../../src/helpers/erasEnum';
import { Source } from '../../src/helpers/sources';
import { contextReducer } from '../../src/state/contextReducer';
import {
  addSource,
  removeSource,
  setAllowCrossSpeciesTalents,
  setAllowEsotericTalents,
  setEra,
  setSources,
} from '../../src/state/contextActions';

function createLocalStorageMock(): Storage {
  const storage = new Map<string, string>();
  return {
    get length() {
      return storage.size;
    },
    clear: () => storage.clear(),
    getItem: (key: string) =>
      storage.has(key) ? (storage.get(key) ?? null) : null,
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    removeItem: (key: string) => {
      storage.delete(key);
    },
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
  } as Storage;
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage: createLocalStorageMock() },
    configurable: true,
    writable: true,
  });
});

function stateWithSources(sources: Source[]) {
  return {
    sources: sources,
    era: Era.NextGeneration,
    allowCrossSpeciesTalents: false,
    allowEsotericTalents: false,
  };
}

describe('contextReducer', () => {
  beforeEach(() => {
    (globalThis.window as any).localStorage.clear();
  });

  test('returns the base configuration for an unknown action on fresh storage', () => {
    const result = contextReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({
      sources: [Source.Core],
      era: Era.NextGeneration,
      allowCrossSpeciesTalents: false,
      allowEsotericTalents: false,
    });
  });

  test('SET_SOURCES replaces the source list', () => {
    const result = contextReducer(
      undefined,
      setSources([Source.Core, Source.AlphaQuadrant]),
    );
    expect(result.sources).toEqual([Source.Core, Source.AlphaQuadrant]);
  });

  test('SET_SOURCES refuses both core books: the incoming duplicate is dropped', () => {
    const twoCore = contextReducer(
      undefined,
      setSources([Source.Core, Source.Core2ndEdition]),
    );
    expect(twoCore.sources).toEqual([Source.Core]);

    const twoSecond = contextReducer(
      stateWithSources([Source.Core2ndEdition]),
      setSources([Source.Core, Source.Core2ndEdition]),
    );
    expect(twoSecond.sources).toEqual([Source.Core2ndEdition]);
  });

  test('ADD_SOURCE appends a source; adding a duplicate is a no-op', () => {
    let result = contextReducer(undefined, addSource(Source.AlphaQuadrant));
    expect(result.sources).toEqual([Source.Core, Source.AlphaQuadrant]);

    result = contextReducer(result, addSource(Source.AlphaQuadrant));
    expect(result.sources).toEqual([Source.Core, Source.AlphaQuadrant]);
  });

  test('ADD_SOURCE Core2ndEdition removes the original Core book', () => {
    const result = contextReducer(undefined, addSource(Source.Core2ndEdition));
    expect(result.sources).toEqual([Source.Core2ndEdition]);
  });

  test('ADD_SOURCE Core removes Core2ndEdition but keeps first edition sources', () => {
    const result = contextReducer(
      stateWithSources([Source.Core2ndEdition, Source.PlayersGuide]),
      addSource(Source.Core),
    );
    expect(result.sources).toEqual([Source.PlayersGuide, Source.Core]);
  });

  test('REMOVE_SOURCE refuses to remove the only core book', () => {
    const coreOnly = contextReducer(undefined, removeSource(Source.Core));
    expect(coreOnly.sources).toEqual([Source.Core]);

    const secondOnly = contextReducer(
      stateWithSources([Source.Core2ndEdition]),
      removeSource(Source.Core2ndEdition),
    );
    expect(secondOnly.sources).toEqual([Source.Core2ndEdition]);
  });

  test('REMOVE_SOURCE removes an existing source', () => {
    let result = contextReducer(
      undefined,
      setSources([Source.Core, Source.AlphaQuadrant]),
    );
    result = contextReducer(result, removeSource(Source.AlphaQuadrant));
    expect(result.sources).toEqual([Source.Core]);

    const missing = contextReducer(result, removeSource(Source.BetaQuadrant));
    expect(missing.sources).toEqual([Source.Core]);
  });

  test('SET_ERA and the talent-allowance flags update their fields', () => {
    let result = contextReducer(undefined, setEra(Era.Enterprise));
    expect(result.era).toBe(Era.Enterprise);

    result = contextReducer(result, setAllowCrossSpeciesTalents(true));
    expect(result.allowCrossSpeciesTalents).toBe(true);

    result = contextReducer(result, setAllowEsotericTalents(true));
    expect(result.allowEsotericTalents).toBe(true);
  });
});
