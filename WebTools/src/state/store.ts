import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import characterReducer from './characterReducer';
import star from './starReducer';
import starshipReducer from './starshipReducer';
import gmTracker from './gmTrackerReducer';
import contextReducer from './contextReducer';
import safetyReducer from './safetyReducer';
import tokenReducer from './tokenReducer';
import tableReducer from './tableReducer';

const reducer = combineReducers({
    star: star,
    starship: starshipReducer,
    context: contextReducer,
    gmTracker: gmTracker,
    character: characterReducer,
    token: tokenReducer,
    table: tableReducer,
    safety: safetyReducer
})
const store = configureStore(
    {
        reducer: reducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
    });

export default store;