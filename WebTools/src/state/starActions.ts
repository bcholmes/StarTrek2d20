import { createAction } from '@reduxjs/toolkit';
import type { Sector } from '../mapping/table/sector';
import type { StarSystem } from '../mapping/table/starSystem';

export const SET_STAR_SYSTEM = 'SET_STAR_SYSTEM';
export const SET_SECTOR = 'SET_SECTOR';
export const SET_SECTOR_NAME = 'SET_SECTOR_NAME';
export const SET_STAR_SYSTEM_NAME = 'SET_STAR_SYSTEM_NAME';

export const setStarSystem = createAction(
  SET_STAR_SYSTEM,
  (starSystem: StarSystem) => ({
    payload: { starSystem: starSystem },
  }),
);

export const setSector = createAction(SET_SECTOR, (sector?: Sector) => ({
  payload: { sector: sector },
}));

export const setSectorName = createAction(SET_SECTOR_NAME, (name: string) => ({
  payload: { name: name },
}));

export const setStarSystemName = createAction(
  SET_STAR_SYSTEM_NAME,
  (name: string) => ({
    payload: { name: name },
  }),
);
