import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { Source } from '../helpers/sources';
import { SET_ERA, SET_SOURCES } from './contextActions';
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

const context = (state = { sources: [ Source.Core ], era: undefined }, action) => {
    switch (action.type) {
        case SET_SOURCES: 
            return {
                ...state,
                sources: action.payload.sources
            }
        case SET_ERA: 
            return {
                ...state,
                era: action.payload.era
            }
        default:
            return state;
    }
};
const reducer = combineReducers({
    star: star, 
    context: context
})
const store = configureStore({ reducer });

export default store;