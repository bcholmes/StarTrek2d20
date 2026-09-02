import { createAction } from '@reduxjs/toolkit';
import type { TableCollection } from '../table/model/table';

export const IMPORT_TABLE_COLLECTION = 'IMPORT_TABLE_COLLECTION';
export const ADD_TABLE_COLLECTION = 'ADD_TABLE_COLLECTION';
export const SET_TABLE_COLLECTION_SELECTION = 'SET_TABLE_COLLECTION_SELECTION';
export const SET_TABLE_FOR_EDITING = 'SET_TABLE_FOR_EDITING';
export const REPLACE_TABLE_COLLECTION = 'REPLACE_TABLE_COLLECTION';
export const DELETE_TABLE_COLLECTION = 'DELETE_TABLE_COLLECTION';

export const setTableCollectionSelection = createAction(
  SET_TABLE_COLLECTION_SELECTION,
  (selection: TableCollection) => ({
    payload: { selection: selection },
  }),
);

export const importTableCollection = createAction(
  IMPORT_TABLE_COLLECTION,
  (collection: TableCollection) => ({
    payload: { collection: collection },
  }),
);

export const setTableForEditing = createAction(
  SET_TABLE_FOR_EDITING,
  (collection: TableCollection) => ({
    payload: { collection: collection },
  }),
);

export const addTableCollection = createAction(
  ADD_TABLE_COLLECTION,
  (collection: TableCollection) => ({
    payload: { collection: collection },
  }),
);

export const deleteTableCollection = createAction(
  DELETE_TABLE_COLLECTION,
  (collection: TableCollection) => ({
    payload: { collection: collection },
  }),
);

export const replaceTableCollection = createAction(
  REPLACE_TABLE_COLLECTION,
  (uuid: string, collection: TableCollection) => ({
    payload: {
      uuid: uuid,
      collection: collection,
    },
  }),
);
