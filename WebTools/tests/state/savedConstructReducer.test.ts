import { test, expect, describe, beforeAll, beforeEach } from '@jest/globals';
import {
  SAVE_CONSTRUCT_TO_LOCAL_STORAGE,
  saveCharacterToLocalStorage,
} from '../../src/state/savedConstructActions';
import { Character } from '../../src/common/character';
import { CharacterType } from '../../src/common/characterType';
import { Era } from '../../src/helpers/erasEnum';
import { savedConstructReducer } from '../../src/state/savedConstructReducer';

const STORAGE_KEY = 'constructs.records';

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

function makeCharacter(): Character {
  return Character.createMainCharacter(
    CharacterType.Starfleet,
    Era.NextGeneration,
    2,
  );
}

function saveAction(hash: number, replacementHash?: number) {
  return {
    type: SAVE_CONSTRUCT_TO_LOCAL_STORAGE,
    payload: {
      type: 'Character',
      name: 'Name ' + hash,
      marshalled: 'marshalled-' + hash,
      hash: hash,
      replacementHash: replacementHash,
    },
  };
}

describe('savedConstructReducer', () => {
  beforeEach(() => {
    (globalThis.window as any).localStorage.clear();
  });

  test('returns empty records for an unknown action on fresh state', () => {
    const result = savedConstructReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({ records: [] });
  });

  test('hydrates the initial state from localStorage', () => {
    const stored = { records: [{ hash: 111 }] };
    (globalThis.window as any).localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(stored),
    );
    const result = savedConstructReducer(undefined, { type: 'UNKNOWN' });
    expect(result.records).toEqual([{ hash: 111 }]);
  });

  test('SAVE_CONSTRUCT_TO_LOCAL_STORAGE appends a record', () => {
    const action = saveAction(111);
    const result = savedConstructReducer(undefined, action);

    expect(result.records).toHaveLength(1);
    expect(result.records[0].hash).toBe(111);
    expect(result.records[0].name).toBe('Name 111');
  });

  test('SAVE avoids duplicating an identical hash', () => {
    let state = savedConstructReducer(undefined, saveAction(111));
    state = savedConstructReducer(state, saveAction(111));
    expect(state.records).toHaveLength(1);
  });

  test('SAVE with a replacementHash removes the record with that hash', () => {
    let state = savedConstructReducer(undefined, saveAction(111));
    state = savedConstructReducer(state, saveAction(222, 111));

    expect(state.records).toHaveLength(1);
    expect(state.records[0].hash).toBe(222);
  });

  test('SAVE trims the record list down to five entries', () => {
    let state = undefined;
    for (let i = 0; i < 7; i++) {
      state = savedConstructReducer(state, saveAction(1000 + i));
    }
    expect(state.records).toHaveLength(5);
    expect(state.records.map((r: any) => r.hash)).toEqual([
      1002, 1003, 1004, 1005, 1006,
    ]);
  });

  test('SAVE is driven by an action produced by the creator', () => {
    const action = saveCharacterToLocalStorage(makeCharacter());
    const result = savedConstructReducer(undefined, action);
    expect(result.records).toHaveLength(1);
    expect(result.records[0].hash).toBe(action.payload.hash);
  });
});
