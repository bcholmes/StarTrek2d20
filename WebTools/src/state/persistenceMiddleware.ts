import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import { Source } from '../helpers/sources';
import { TableMarshaller } from '../table/model/tableMarshaller';
import type { RootState } from './store';

const SAVE_CONSTRUCT_TO_LOCAL_STORAGE = 'SAVE_CONSTRUCT_TO_LOCAL_STORAGE';
const SET_SOURCES = 'SET_SOURCES';
const ADD_SOURCE = 'ADD_SOURCE';
const REMOVE_SOURCE = 'REMOVE_SOURCE';
const IMPORT_TABLE_COLLECTION = 'IMPORT_TABLE_COLLECTION';
const ADD_TABLE_COLLECTION = 'ADD_TABLE_COLLECTION';
const DELETE_TABLE_COLLECTION = 'DELETE_TABLE_COLLECTION';

export const persistenceListenerMiddleware =
  createListenerMiddleware<RootState>();

persistenceListenerMiddleware.startListening({
  predicate: (action: AnyAction) =>
    action.type === SAVE_CONSTRUCT_TO_LOCAL_STORAGE,
  effect: (_, listenerApi) => {
    const records = listenerApi.getState().savedConstructReducer.records;
    const data = {
      records: records ?? [],
    };
    window.localStorage.setItem('constructs.records', JSON.stringify(data));
  },
});

persistenceListenerMiddleware.startListening({
  predicate: (action: AnyAction) =>
    action.type === SET_SOURCES ||
    action.type === ADD_SOURCE ||
    action.type === REMOVE_SOURCE,
  effect: (_, listenerApi) => {
    const sources = listenerApi.getState().context.sources;
    const contextData = {
      sources: sources?.length ? sources.map((s) => Source[s]) : [],
    };
    window.localStorage.setItem(
      'settings.contextData',
      JSON.stringify(contextData),
    );
  },
});

persistenceListenerMiddleware.startListening({
  predicate: (action: AnyAction) =>
    action.type === IMPORT_TABLE_COLLECTION ||
    action.type === ADD_TABLE_COLLECTION ||
    action.type === DELETE_TABLE_COLLECTION,
  effect: (_, listenerApi) => {
    const collections = listenerApi.getState().table.collections;
    const data = {
      collections: collections?.length
        ? collections.map((s) => TableMarshaller.instance.marshall(s))
        : [],
    };
    window.localStorage.setItem('settings.tableData', JSON.stringify(data));
  },
});
