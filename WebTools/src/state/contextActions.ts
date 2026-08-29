import { createAction } from '@reduxjs/toolkit';
import type { Era } from '../helpers/erasEnum';
import type { Source } from '../helpers/sources';

export const ADD_SOURCE = 'ADD_SOURCE';
export const REMOVE_SOURCE = 'REMOVE_SOURCE';
export const SET_SOURCES = 'SET_SOURCES';
export const SET_ERA = 'SET_ERA';
export const SET_ALLOW_CROSS_SPECIES_TALENTS =
  'SET_ALLOW_CROSS_SPECIES_TALENTS';
export const SET_ALLOW_ESOTERIC_TALENTS = 'SET_ALLOW_ESOTERIC_TALENTS';

/**
 * The context describes the environment in which the characters/starships are
 * built. It encapsulates things like "what sources are available" and
 * "what decisions has the GM made about optional items"
 */

export const addSource = createAction(ADD_SOURCE, (source: Source) => ({
  payload: source,
}));

export const removeSource = createAction(REMOVE_SOURCE, (source: Source) => ({
  payload: source,
}));

export const setSources = createAction(SET_SOURCES, (sources: Source[]) => ({
  payload: sources,
}));

export const setEra = createAction(SET_ERA, (era: Era) => ({
  payload: era,
}));

export const setAllowCrossSpeciesTalents = createAction(
  SET_ALLOW_CROSS_SPECIES_TALENTS,
  (value: boolean) => ({
    payload: value,
  }),
);

export const setAllowEsotericTalents = createAction(
  SET_ALLOW_ESOTERIC_TALENTS,
  (value: boolean) => ({
    payload: value,
  }),
);
