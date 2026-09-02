import { createSlice } from '@reduxjs/toolkit';
import { Era } from '../helpers/erasEnum';
import { Source, SourcesHelper } from '../helpers/sources';
import {
  addSource,
  removeSource,
  setAllowCrossSpeciesTalents,
  setAllowEsotericTalents,
  setEra,
  setSources,
} from './contextActions';

interface ContextState {
  sources: Source[];
  era: Era;
  allowCrossSpeciesTalents: boolean;
  allowEsotericTalents: boolean;
}

const persistContext = (sources: Source[]) => {
  const contextData = {
    sources: sources?.length ? sources.map((s) => Source[s]) : [],
  };
  window.localStorage.setItem(
    'settings.contextData',
    JSON.stringify(contextData),
  );
};

let initialData: ContextState = null;

const getInitialData = (): ContextState => {
  const base: ContextState = {
    sources: [Source.Core],
    era: Era.NextGeneration,
    allowCrossSpeciesTalents: false,
    allowEsotericTalents: false,
  };
  if (initialData == null) {
    initialData = { ...base };
    try {
      const dataJson = window.localStorage.getItem('settings.contextData');
      if (dataJson) {
        const data = JSON.parse(dataJson);
        const selectedSources = [];
        if (data?.sources?.length) {
          SourcesHelper.getSources().forEach((s) => {
            if (data.sources.indexOf(Source[s.id]) >= 0) {
              selectedSources.push(s.id);
            }
          });
        }
        if (
          selectedSources.indexOf(Source.Core) >= 0 &&
          selectedSources.indexOf(Source.Core2ndEdition) >= 0
        ) {
          selectedSources.splice(selectedSources.indexOf(Source.Core), 1);
        }
        if (selectedSources.length) {
          initialData.sources = selectedSources;
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return initialData;
};

export const contextSlice = createSlice({
  name: 'context',
  initialState: getInitialData,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setSources, (state, action) => {
      const newSources = action.payload;
      if (
        newSources.indexOf(Source.Core2ndEdition) >= 0 &&
        state.sources.indexOf(Source.Core) >= 0
      ) {
        newSources.splice(newSources.indexOf(Source.Core2ndEdition), 1);
      } else if (
        newSources.indexOf(Source.Core) >= 0 &&
        state.sources.indexOf(Source.Core2ndEdition) >= 0
      ) {
        newSources.splice(newSources.indexOf(Source.Core), 1);
      }
      persistContext(newSources);
      return {
        ...state,
        sources: newSources,
      };
    });
    builder.addCase(addSource, (state, action) => {
      if (state.sources.indexOf(action.payload) >= 0) {
        return state;
      } else {
        const newSource = action.payload;
        const existing = [...state.sources];
        if (
          newSource === Source.Core2ndEdition &&
          existing.indexOf(Source.Core) >= 0
        ) {
          existing.splice(existing.indexOf(Source.Core), 1);
        } else if (
          newSource === Source.Core &&
          existing.indexOf(Source.Core2ndEdition) >= 0
        ) {
          existing.splice(existing.indexOf(Source.Core2ndEdition), 1);
          SourcesHelper.getSources().forEach((s) => {
            if (s.version === 2 && existing.includes(s.id)) {
              existing.splice(existing.indexOf(s.id), 1);
            }
          });
        }
        existing.push(newSource);
        persistContext(existing);
        return {
          ...state,
          sources: existing,
        };
      }
    });
    builder.addCase(removeSource, (state, action) => {
      if (state.sources.indexOf(action.payload) >= 0) {
        if (
          action.payload === Source.Core &&
          state.sources.indexOf(Source.Core2ndEdition) < 0
        ) {
          return state;
        } else if (
          action.payload === Source.Core2ndEdition &&
          state.sources.indexOf(Source.Core) < 0
        ) {
          return state;
        } else {
          const sources = [...state.sources];
          sources.splice(state.sources.indexOf(action.payload), 1);
          persistContext(sources);
          return {
            ...state,
            sources: sources,
          };
        }
      } else {
        return state;
      }
    });
    builder.addCase(setEra, (state, action) => {
      return {
        ...state,
        era: action.payload,
      };
    });
    builder.addCase(setAllowCrossSpeciesTalents, (state, action) => {
      return {
        ...state,
        allowCrossSpeciesTalents: action.payload,
      };
    });
    builder.addCase(setAllowEsotericTalents, (state, action) => {
      return {
        ...state,
        allowEsotericTalents: action.payload,
      };
    });
  },
});

export const contextReducer = contextSlice.reducer;
