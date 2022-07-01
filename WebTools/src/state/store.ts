import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { Source } from '../helpers/sources';
import { ADD_SOURCE, REMOVE_SOURCE, SET_ALLOW_CROSS_SPECIES_TALENTS, SET_ALLOW_ESOTERIC_TALENTS, SET_ERA, SET_SOURCES } from './contextActions';
import star from './starReducer';


const context = (state = { sources: [ Source.Core ], era: undefined , allowCrossSpeciesTalents: false, allowEsotericTalents: false }, action) => {
    switch (action.type) {
        case SET_SOURCES: 
            return {
                ...state,
                sources: action.payload
            }
        case ADD_SOURCE: 
            if (state.sources.indexOf(action.payload) >= 0) {
                return state;
            } else {
                return {
                    ...state,
                    sources: [...state.sources, action.payload ]
                }
            }
        case REMOVE_SOURCE: 
            if (state.sources.indexOf(action.payload) >= 0) {
                let sources = state.sources;
                sources.splice(state.sources.indexOf(action.payload), 1);
                return {
                    ...state,
                    sources: sources
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

const reducer = combineReducers({
    star: star, 
    context: context
})
const store = configureStore(
    { 
        reducer: reducer,
        middleware: getDefaultMiddleware({
            serializableCheck: false
        }) 
    });

export default store;