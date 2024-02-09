import TableMarshaller from "../table/model/tableMarshaller";
import store from "./store"

export const isTableCollectionAlreadyImported = (name: string, encodedCollection: string) => {
    let collections = store.getState().table?.collections;
    let matches = collections.filter(c => c.name === name).filter(c => TableMarshaller.instance.marshall(c) === encodedCollection);
    return matches.length > 0;
}