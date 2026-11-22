import { createSlice } from '@reduxjs/toolkit';
import { Sector } from '../mapping/table/sector';
import type { StarSystem } from '../mapping/table/starSystem';
import {
  setSector,
  setSectorName,
  setStarSystem,
  setStarSystemName,
} from './starActions';

interface StarState {
  sector?: Sector;
  starSystem?: StarSystem;
}

const initialState: StarState = { starSystem: undefined, sector: undefined };

export const starSlice = createSlice({
  name: 'star',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setSector, (state, action) => {
        return {
          ...state,
          sector: action.payload.sector,
        };
      })
      .addCase(setSectorName, (state, action) => {
        const sector = state.sector as Sector;
        const starSystem = state.starSystem as StarSystem | undefined;
        const name = action.payload.name;
        const systems = sector.systems.map((s) => {
          const system = s.clone();
          system.rootName = name;
          return system;
        });
        const newSector = new Sector(sector.prefix);
        newSector.id = sector.id;
        newSector.simpleName = name;
        newSector.systems = systems;

        const newStarSystem = starSystem ? starSystem.clone() : undefined;
        if (newStarSystem) {
          newStarSystem.rootName = name;
        }
        return {
          ...state,
          sector: newSector,
          starSystem: newStarSystem,
        };
      })
      .addCase(setStarSystemName, (state, action) => {
        const sector = state.sector as Sector;
        const starSystem = state.starSystem as StarSystem | undefined;
        const newStarSystem = starSystem ? starSystem.clone() : undefined;
        let newSector = undefined;
        if (newStarSystem) {
          newStarSystem.friendlyName = action.payload.name;
          if (sector != null) {
            const systems = sector.systems.map((s) => {
              if (s.id === newStarSystem.id) {
                return newStarSystem;
              } else {
                return s;
              }
            });
            newSector = new Sector(sector.prefix);
            newSector.id = sector.id;
            newSector.simpleName = sector.simpleName;
            newSector.systems = systems;
          }

          return {
            ...state,
            sector: newSector,
            starSystem: newStarSystem,
          };
        } else {
          return state;
        }
      })
      .addCase(setStarSystem, (state, action) => {
        return {
          ...state,
          starSystem: action.payload.starSystem,
        };
      });
  },
});

export const star = starSlice.reducer;
