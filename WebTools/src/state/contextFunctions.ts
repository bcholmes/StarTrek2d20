import { Source } from "../helpers/sources";
import store from "./store";

export function hasSource(s: Source) {
    return store.getState().context.sources.indexOf(s) >= 0;
}

export function hasAnySource(sources: Source[]) {
    var result: boolean = false;
    for (var s of sources) {
        result = result || hasSource(s) || s === Source.Core;
    }
    return result;
}