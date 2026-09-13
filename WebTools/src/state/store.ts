import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistenceListenerMiddleware } from './persistenceMiddleware';
import { characterReducer } from './characterReducer';
import { star } from './starReducer';
import { starshipReducer } from './starshipReducer';
import { gmTracker } from './gmTrackerReducer';
import { contextReducer } from './contextReducer';
import { safety as safetyReducer } from './safetyReducer';
import { token as tokenReducer } from './tokenReducer';
import { tableReducer } from './tableReducer';
import { savedConstructReducer } from './savedConstructReducer';
import { stationReducer } from './stationReducer';

const reducer = combineReducers({
  star: star,
  starship: starshipReducer,
  station: stationReducer,
  context: contextReducer,
  gmTracker: gmTracker,
  character: characterReducer,
  token: tokenReducer,
  table: tableReducer,
  safety: safetyReducer,
  savedConstructReducer: savedConstructReducer,
});

export type RootState = ReturnType<typeof reducer>;

export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).prepend(
      persistenceListenerMiddleware.middleware,
    ),
});
