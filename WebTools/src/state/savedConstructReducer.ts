import { createSlice } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import type { ILocalStorageConstructRecord } from '../common/iLocalStorageConstructRecord';

interface SavedConstructState {
  records: ILocalStorageConstructRecord[];
}

interface SaveConstructPayload {
  type: 'Character' | 'Starship';
  name: string;
  marshalled: string;
  hash: number;
  replacementHash?: number;
}

const getInitialData = (): SavedConstructState => {
  const base: SavedConstructState = { records: [] };
  const initialData = { ...base };
  try {
    const dataJson = window.localStorage.getItem('constructs.records');
    if (dataJson) {
      const data = JSON.parse(dataJson);
      if (data.records) {
        initialData.records = data.records;
      }
    }
  } catch (e) {
    // ignore
  }
  return initialData;
};

const handleSave = (state: SavedConstructState, action: AnyAction) => {
  const payload = action.payload as SaveConstructPayload;
  let records: ILocalStorageConstructRecord[] = [...state.records];
  const hash = payload.hash;
  if (payload.replacementHash != null) {
    records = records.filter((r) => r.hash !== payload.replacementHash);
  }
  if (records.filter((r) => r.hash === hash).length === 0) {
    records.push({
      type: payload.type,
      marshalled: payload.marshalled,
      hash: payload.hash,
      name: payload.name,
    });
  }

  if (records.length > 5) {
    records.splice(0, records.length - 5);
  }
  return {
    records: records,
  };
};

export const savedConstructSlice = createSlice({
  name: 'savedConstruct',
  initialState: getInitialData,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase('SAVE_CONSTRUCT_TO_LOCAL_STORAGE', handleSave);
  },
});

export const savedConstructReducer = savedConstructSlice.reducer;
