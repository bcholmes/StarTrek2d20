import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { Source } from '../helpers/sources';
import { SET_ALLOW_CROSS_SPECIES_TALENTS, SET_ERA, SET_SOURCES } from './contextActions';
import { SET_SECTOR, SET_STAR } from './starActions';

const star = (state = { starSystem: undefined, sector: undefined }, action) => {
    switch (action.type) {
        case SET_SECTOR: 
            return {
                ...state,
                sector: action.payload.sector
            }
        case SET_STAR: 
            return {
                ...state,
                starSystem: action.payload.starSystem
            }
        default:
            return state;
    }
};

const context = (state = { sources: [ Source.Core ], era: undefined , allowCrossSpeciesTalents: false }, action) => {
    switch (action.type) {
        case SET_SOURCES: 
            return {
                ...state,
                sources: action.payload.sources
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