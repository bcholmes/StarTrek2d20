import { test, expect, describe } from '@jest/globals';
import { Sector } from '../../src/mapping/table/sector';
import { StarSystem } from '../../src/mapping/table/starSystem';
import type { Star } from '../../src/mapping/table/star';
import { star } from '../../src/state/starReducer';
import {
  setSector,
  setStarSystem,
  setSectorName,
  setStarSystemName,
} from '../../src/state/starActions';

function makeSystem(id: string, rootName: string): StarSystem {
  const system = new StarSystem({} as Star);
  system.id = id;
  system.rootName = rootName;
  system.friendlyName = '';
  return system;
}

function makeSectorWithSystems(systems: StarSystem[]): Sector {
  const sector = new Sector('SCT');
  sector.id = 'SCT-1';
  sector.simpleName = 'Original Sector';
  sector.systems = systems;
  return sector;
}

describe('starReducer', () => {
  test('returns initial state for an unknown action', () => {
    const result = star(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({ starSystem: undefined, sector: undefined });
  });

  test('SET_SECTOR stores the sector', () => {
    const sector = makeSectorWithSystems([]);
    const result = star(undefined, setSector(sector));
    expect(result.sector).toBe(sector);
    expect(result.starSystem).toBeUndefined();
  });

  test('SET_STAR stores the star system', () => {
    const system = makeSystem('SYS-1', 'Alpha');
    const result = star(undefined, setStarSystem(system));
    expect(result.starSystem).toBe(system);
  });

  test('SET_SECTOR_NAME renames every system in the sector', () => {
    const system1 = makeSystem('SYS-1', 'Alpha');
    const system2 = makeSystem('SYS-2', 'Beta');
    const sector = makeSectorWithSystems([system1, system2]);
    const starSystem = makeSystem('SYS-1', 'Alpha');

    const result = star(
      { sector: sector, starSystem: starSystem },
      setSectorName('New Name'),
    );

    expect(result.sector?.name).toBe('New Name');
    expect(result.sector?.simpleName).toBe('New Name');
    expect(result.sector?.systems[0].rootName).toBe('New Name');
    expect(result.sector?.systems[1].rootName).toBe('New Name');
    expect(result.starSystem?.rootName).toBe('New Name');
    expect(result).not.toBe(sector);
  });

  test('SET_SECTOR_NAME does not rebuild the starSystem when absent', () => {
    const sector = makeSectorWithSystems([makeSystem('SYS-1', 'Alpha')]);
    const result = star({ sector: sector }, setSectorName('New Name'));
    expect(result.starSystem).toBeUndefined();
    expect(result.sector?.simpleName).toBe('New Name');
  });

  test('SET_STAR_SYSTEM_NAME renames the matching system and starSystem', () => {
    const system1 = makeSystem('SYS-1', 'Alpha');
    const system2 = makeSystem('SYS-2', 'Beta');
    const sector = makeSectorWithSystems([system1, system2]);
    const starSystem = makeSystem('SYS-2', 'Beta');

    const result = star(
      { sector: sector, starSystem: starSystem },
      setStarSystemName('Renamed'),
    );

    expect(result.starSystem?.friendlyName).toBe('Renamed');
    expect(result.sector?.systems[1].friendlyName).toBe('Renamed');
    expect(result.sector?.systems[0].friendlyName).toBe('');
    expect(result.starSystem?.id).toBe('SYS-2');
  });

  test('SET_STAR_SYSTEM_NAME returns the same state when starSystem is absent', () => {
    const sector = makeSectorWithSystems([makeSystem('SYS-1', 'Alpha')]);
    const state = { sector: sector };
    const result = star(state, setStarSystemName('Renamed'));
    expect(result).toBe(state);
  });
});
