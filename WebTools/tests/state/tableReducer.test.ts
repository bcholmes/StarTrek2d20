import { test, expect, describe, beforeAll } from '@jest/globals';
import {
  Table,
  TableCollection,
  TableRow,
  ValueResult,
} from '../../src/table/model/table';
import { tableReducer } from '../../src/state/tableReducer';
import {
  addTableCollection,
  deleteTableCollection,
  importTableCollection,
  replaceTableCollection,
  setTableCollectionSelection,
  setTableForEditing,
} from '../../src/state/tableActions';

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

function makeCollection(name: string, uuid: string): TableCollection {
  return new TableCollection(
    new Table(name, [new TableRow(new ValueResult(name + ' result'), 1)]),
    'blurb',
    'category',
    uuid,
  );
}

describe('tableReducer', () => {
  test('returns the two built-in deployments for an unknown action', () => {
    const result = tableReducer(undefined, { type: 'UNKNOWN' });
    expect(result.selection).toBeNull();
    expect(result.collections).toHaveLength(2);
    expect(result.collections[0].mainTable.name).toBe(
      'Probability Matrix: Things That Could Go Wrong While Visiting an Alien Bar',
    );
    expect(result.collections[1].mainTable.name).toBe(
      'Probability Matrix: Things That Could Go Wrong While Spacewalking',
    );
  });

  test('ADD_TABLE_COLLECTION appends a collection', () => {
    const added = makeCollection('New Collection', 'uuid-new');
    const result = tableReducer(
      { selection: null, collections: [] },
      addTableCollection(added),
    );
    expect(result.collections).toEqual([added]);
  });

  test('IMPORT_TABLE_COLLECTION behaves like ADD_TABLE_COLLECTION', () => {
    const imported = makeCollection('Imported', 'uuid-import');
    const result = tableReducer(
      { selection: null, collections: [] },
      importTableCollection(imported),
    );
    expect(result.collections).toEqual([imported]);
  });

  test('SET_TABLE_COLLECTION_SELECTION stores the selected collection', () => {
    const selected = makeCollection('Selected', 'uuid-selected');
    const result = tableReducer(undefined, {
      type: 'UNKNOWN',
    });
    const updated = tableReducer(result, setTableCollectionSelection(selected));
    expect(updated.selection).toBe(selected);
  });

  test('SET_TABLE_FOR_EDITING stores the collection being edited', () => {
    const editing = makeCollection('Editing', 'uuid-edit');
    const updated = tableReducer(
      { selection: null, collections: [] },
      setTableForEditing(editing),
    );
    expect(updated.editing).toBe(editing);
  });

  test('DELETE_TABLE_COLLECTION removes the matching uuid', () => {
    const first = makeCollection('First', 'uuid-1');
    const second = makeCollection('Second', 'uuid-2');
    const result = tableReducer(
      { selection: null, collections: [first, second] },
      deleteTableCollection(first),
    );
    expect(result.collections).toEqual([second]);
  });

  test('REPLACE_TABLE_COLLECTION removes the old uuid and appends the new', () => {
    const first = makeCollection('First', 'uuid-1');
    const second = makeCollection('Second', 'uuid-2');
    const replacement = makeCollection('Replacement', 'uuid-3');
    const result = tableReducer(
      { selection: null, collections: [first, second] },
      replaceTableCollection(first.uuid, replacement),
    );
    expect(result.collections.map((c) => c.uuid)).toEqual(['uuid-2', 'uuid-3']);
  });
});
