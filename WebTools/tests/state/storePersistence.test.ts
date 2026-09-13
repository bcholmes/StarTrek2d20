import { test, expect, describe, beforeAll, beforeEach } from '@jest/globals';
import { store } from '../../src/state/store';
import { Source } from '../../src/helpers/sources';
import { Era } from '../../src/helpers/erasEnum';
import {
  Table,
  TableCollection,
  TableRow,
  ValueResult,
} from '../../src/table/model/table';
import { TableMarshaller } from '../../src/table/model/tableMarshaller';
import { Character } from '../../src/common/character';
import { CharacterType } from '../../src/common/characterType';
import {
  setSources,
  addSource,
  removeSource,
  setEra,
  setAllowCrossSpeciesTalents,
  setAllowEsotericTalents,
} from '../../src/state/contextActions';
import {
  importTableCollection,
  addTableCollection,
  deleteTableCollection,
  replaceTableCollection,
  setTableCollectionSelection,
  setTableForEditing,
} from '../../src/state/tableActions';
import { saveCharacterToLocalStorage } from '../../src/state/savedConstructActions';

const CONSTRUCTS_KEY = 'constructs.records';
const CONTEXT_KEY = 'settings.contextData';
const TABLE_KEY = 'settings.tableData';

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

function stored(key: string) {
  const raw = (globalThis.window as any).localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function persistedTableUuids(): string[] {
  const data = stored(TABLE_KEY);
  return data.collections.map(
    (c: any) => TableMarshaller.instance.unmarshall(c).uuid,
  );
}

function makeCollection(name: string, uuid: string): TableCollection {
  return new TableCollection(
    new Table(name, [new TableRow(new ValueResult(name + ' result'), 1)]),
    'blurb',
    'category',
    uuid,
  );
}

describe('store persistence', () => {
  beforeEach(() => {
    (globalThis.window as any).localStorage.clear();
  });

  describe('for saved constructs', () => {
    test('SAVE_CONSTRUCT_TO_LOCAL_STORAGE persists the record list', () => {
      store.dispatch(
        saveCharacterToLocalStorage(
          Character.createMainCharacter(
            CharacterType.Starfleet,
            Era.NextGeneration,
            2,
          ),
        ),
      );
      const data = stored(CONSTRUCTS_KEY);
      expect(data.records).toHaveLength(1);
      expect(data.records[0].type).toBe('Character');
    });
  });

  describe('for context', () => {
    test('SET_SOURCES replaces and persists the source list', () => {
      store.dispatch(setSources([Source.Core, Source.AlphaQuadrant]));
      expect(stored(CONTEXT_KEY).sources).toEqual(['Core', 'AlphaQuadrant']);
    });

    test('ADD_SOURCE persists the appended source', () => {
      store.dispatch(setSources([Source.Core]));
      store.dispatch(addSource(Source.AlphaQuadrant));
      expect(stored(CONTEXT_KEY).sources).toEqual(['Core', 'AlphaQuadrant']);
    });

    test('REMOVE_SOURCE persists the remaining source', () => {
      store.dispatch(setSources([Source.Core, Source.AlphaQuadrant]));
      store.dispatch(removeSource(Source.AlphaQuadrant));
      expect(stored(CONTEXT_KEY).sources).toEqual(['Core']);
    });

    test('SET_ERA does not persist', () => {
      store.dispatch(setEra(Era.Enterprise));
      expect(stored(CONTEXT_KEY)).toBeNull();
    });

    test('talent-allowance flags do not persist', () => {
      store.dispatch(setAllowCrossSpeciesTalents(true));
      store.dispatch(setAllowEsotericTalents(true));
      expect(stored(CONTEXT_KEY)).toBeNull();
    });
  });

  describe('for table', () => {
    test('ADD_TABLE_COLLECTION persists the collections', () => {
      store.dispatch(addTableCollection(makeCollection('New', 'uuid-add')));
      expect(persistedTableUuids()).toContain('uuid-add');
    });

    test('IMPORT_TABLE_COLLECTION persists the collections', () => {
      store.dispatch(
        importTableCollection(makeCollection('Imported', 'uuid-import')),
      );
      expect(persistedTableUuids()).toContain('uuid-import');
    });

    test('DELETE_TABLE_COLLECTION persists the trimmed collections', () => {
      const a = makeCollection('A', 'uuid-a');
      store.dispatch(addTableCollection(a));
      store.dispatch(deleteTableCollection(a));
      expect(persistedTableUuids()).not.toContain('uuid-a');
    });

    test('REPLACE_TABLE_COLLECTION does not persist', () => {
      const a = makeCollection('A', 'uuid-a');
      store.dispatch(addTableCollection(a));
      store.dispatch(
        replaceTableCollection('uuid-a', makeCollection('R', 'uuid-r')),
      );
      expect(persistedTableUuids()).not.toContain('uuid-r');
    });

    test('SET_TABLE_COLLECTION_SELECTION does not persist', () => {
      store.dispatch(
        setTableCollectionSelection(makeCollection('S', 'uuid-s')),
      );
      expect(stored(TABLE_KEY)).toBeNull();
    });

    test('SET_TABLE_FOR_EDITING does not persist', () => {
      store.dispatch(setTableForEditing(makeCollection('E', 'uuid-e')));
      expect(stored(TABLE_KEY)).toBeNull();
    });
  });

  describe('hydration at store build', () => {
    test('loads saved constructs, context, and table from storage', async () => {
      (globalThis.window as any).localStorage.setItem(
        CONSTRUCTS_KEY,
        JSON.stringify({
          records: [{ hash: 1, name: 'H', type: 'Character' }],
        }),
      );
      (globalThis.window as any).localStorage.setItem(
        CONTEXT_KEY,
        JSON.stringify({ sources: ['Core', 'AlphaQuadrant'] }),
      );

      jest.resetModules();
      const freshStore = (await import('../../src/state/store')).store;

      expect(freshStore.getState().savedConstructReducer.records).toEqual([
        { hash: 1, name: 'H', type: 'Character' },
      ]);
      expect(freshStore.getState().context.sources).toContain(
        Source.AlphaQuadrant,
      );
    });
  });
});
