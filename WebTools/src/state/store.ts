import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import characterReducer from './characterReducer';
import star from './starReducer';
import starshipReducer from './starshipReducer';
import gmTracker from './gmTrackerReducer';
import contextReducer from './contextReducer';
import tokenReducer from './tokenReducer';

const reducer = combineReducers({
    star: star,
    starship: starshipReducer,
    context: contextReducer,
    gmTracker: gmTracker,
    character: characterReducer,
    token: tokenReducer
})
const store = configureStore(
    {
        reducer: reducer,
        middleware: getDefaultMiddleware({
            serializableCheck: false
        })
    });

export default store;