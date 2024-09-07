import { Era } from "../helpers/eras";
import { Source, SourcesHelper } from "../helpers/sources";
import { ADD_SOURCE, REMOVE_SOURCE, SET_ALLOW_CROSS_SPECIES_TALENTS, SET_ALLOW_ESOTERIC_TALENTS, SET_ERA, SET_SOURCES } from "./contextActions";

const persistContext = (sources: Source[]) => {

    let contextData = {
        sources: (sources?.length ? sources.map(s => Source[s]) : [])
    }
    window.localStorage.setItem("settings.contextData", JSON.stringify(contextData));
}

let initialData = null;

const getInitialData = () => {
    let base = { sources: [ Source.Core ], era: Era.NextGeneration , allowCrossSpeciesTalents: false, allowEsotericTalents: false };
    if (initialData == null) {
        initialData = { ...base };
        try {
            let dataJson = window.localStorage.getItem("settings.contextData");
            if (dataJson) {
                let data = JSON.parse(dataJson);
                let selectedSources = [];
                if (data?.sources?.length) {
                    SourcesHelper.getSources().forEach(s => {
                        if (data.sources.indexOf(Source[s.id]) >= 0) {
                            selectedSources.push(s.id);
                        }
                    });
                }
                if (selectedSources.indexOf(Source.Core) >= 0 && selectedSources.indexOf(Source.Core2ndEdition) >= 0) {
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
}

const contextReducer = (state = getInitialData(), action) => {
    switch (action.type) {
        case SET_SOURCES: {
            let newSources = action.payload;
            if (newSources.indexOf(Source.Core2ndEdition) >= 0 && state.sources.indexOf(Source.Core) >= 0) {
                newSources.splice(newSources.indexOf(Source.Core2ndEdition), 1);
            } else if (newSources.indexOf(Source.Core) >= 0 && state.sources.indexOf(Source.Core2ndEdition) >= 0) {
                newSources.splice(newSources.indexOf(Source.Core), 1);
            }
            persistContext(newSources);
            return {
                ...state,
                sources: newSources
            }
        }
        case ADD_SOURCE: {

            if (state.sources.indexOf(action.payload) >= 0) {
                return state;
            } else {
                let newSource = action.payload;
                let existing = [...state.sources];
                if (newSource === Source.Core2ndEdition && existing.indexOf(Source.Core) >= 0) {
                    existing.splice(existing.indexOf(Source.Core), 1);
                } else if (newSource === Source.Core && existing.indexOf(Source.Core2ndEdition) >= 0) {
                    existing.splice(existing.indexOf(Source.Core2ndEdition), 1);
                }
                existing.push(newSource);
                persistContext(existing);
                return {
                    ...state,
                    sources: existing
                }
            }
        }
        case REMOVE_SOURCE:
            if (state.sources.indexOf(action.payload) >= 0) {
                if (action.payload === Source.Core && state.sources.indexOf(Source.Core2ndEdition) < 0) {
                    return state;
                } else if (action.payload === Source.Core2ndEdition && state.sources.indexOf(Source.Core) < 0) {
                    return state;
                } else {
                    let sources = [...state.sources];
                    sources.splice(state.sources.indexOf(action.payload), 1);
                    persistContext(sources);
                    return {
                        ...state,
                        sources: sources
                    }
                }
            } else {
                return state;
            }
        case SET_ERA:
            return {
                ...state,
                era: action.payload
            }
        case SET_ALLOW_CROSS_SPECIES_TALENTS:
            return {
                ...state,
                allowCrossSpeciesTalents: action.payload
            }
        case SET_ALLOW_ESOTERIC_TALENTS:
            return {
                ...state,
                allowEsotericTalents: action.payload
            }
        default:
            return state;
    }
};

export default contextReducer;