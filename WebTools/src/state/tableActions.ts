import { TableCollection } from "../table/model/table";

export const IMPORT_TABLE_COLLECTION = 'IMPORT_TABLE_COLLECTION';
export const SET_TABLE_COLLECTION_SELECTION = 'SET_TABLE_COLLECTION_SELECTION';

export function setTableCollectionSelection(selection: TableCollection) {
    let payload = { selection: selection };
    return {
       type: SET_TABLE_COLLECTION_SELECTION,
       payload: payload
    }
}


export function importTableCollection(collection: TableCollection) {
    let payload = { collection: collection };
    return {
       type: IMPORT_TABLE_COLLECTION,
       payload: payload
    }
}