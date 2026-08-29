import { test, expect, describe } from '@jest/globals';
import '../../src/common/character';
import { CharacterType } from '../../src/common/characterType';
import {
  CustomStationSpaceframeStep,
  Station,
  StationMissionProfileStep,
  StandardStationSpaceframeStep,
} from '../../src/common/station';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { Department } from '../../src/helpers/department';
import { Era } from '../../src/helpers/erasEnum';
import { MissionProfile } from '../../src/helpers/missionProfiles';
import {
  StationFrame,
  StationFrameAppearance,
} from '../../src/helpers/stationFrame';
import { System } from '../../src/helpers/systems';
import { StarshipWeaponRegistry } from '../../src/helpers/weapons';
import { stationReducer } from '../../src/state/stationReducer';
import {
  addStationWeapon,
  changeStationCustomFrameDepartment,
  changeStationCustomFrameSystem,
  createStation,
  deleteStationWeapon,
  setStationAdditionalTalents,
  setStationCustomScale,
  setStationFrame,
  setStationFrameAppearance,
  setStationMissionProfile,
  setStationMissionProfileTalent,
  setStationName,
  setStationTraits,
} from '../../src/state/stationActions';

function makeStation(): Station {
  return Station.create(CharacterType.Federation, 2, Era.NextGeneration);
}

function dispatchAll(
  initialState: { station?: Station },
  ...actions: any[]
): { station?: Station } {
  return actions.reduce(stationReducer as any, initialState);
}

describe('stationReducer', () => {
  test('returns an empty station for an unknown action', () => {
    const result = stationReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({ station: undefined });
  });

  test('CREATE_STATION stores a copy of the station', () => {
    const station = makeStation();
    station.name = 'Deep Space Nine';
    const result = stationReducer(undefined, createStation(station));
    expect(result.station?.name).toBe('Deep Space Nine');
    expect(result.station).not.toBe(station);
  });

  test('SET_STATION_NAME updates the name', () => {
    const result = dispatchAll(
      { station: makeStation() },
      setStationName('Regula'),
    );
    expect(result.station?.name).toBe('Regula');
  });

  test('SET_STATION_MISSION_PROFILE replaces the profile, dropping the talent on type change', () => {
    const station = makeStation();
    station.missionProfileStep = new StationMissionProfileStep(
      MissionProfile.ResearchStation,
    );
    station.missionProfileStep.talent = new SelectedTalent('Bold');

    let result = stationReducer(
      { station },
      setStationMissionProfile(MissionProfile.ResearchStation),
    );
    expect(result.station?.missionProfileStep?.type).toBe(
      MissionProfile.ResearchStation,
    );
    expect(result.station?.missionProfileStep?.talent?.name).toBe('Bold');
    expect(result.station?.missionProfileStep?.talent).not.toBe(
      station.missionProfileStep?.talent,
    );

    result = stationReducer(
      result,
      setStationMissionProfile(MissionProfile.DiplomaticRelationsStation),
    );
    expect(result.station?.missionProfileStep?.type).toBe(
      MissionProfile.DiplomaticRelationsStation,
    );
    expect(result.station?.missionProfileStep?.talent).toBeUndefined();
  });

  test('SET_STATION_MISSION_PROFILE_TALENT sets the talent and prunes base talents with maxRank 1', () => {
    const station = makeStation();
    station.stationFrameStep = new StandardStationSpaceframeStep(
      StationFrame.InternationalSpaceStation,
    );
    station.missionProfileStep = new StationMissionProfileStep(
      MissionProfile.ResearchStation,
    );
    station.additionalTalents = [
      new SelectedTalent('Advanced Research Facilities'),
    ];
    const result = stationReducer(
      { station },
      setStationMissionProfileTalent(new SelectedTalent('Rapid Maneuvering')),
    );
    expect(result.station?.missionProfileStep?.talent?.name).toBe(
      'Rapid Maneuvering',
    );
    expect(result.station?.additionalTalents).toEqual([]);
  });

  test('SET_STATION_CUSTOM_SCALE converts a standard frame to a custom frame', () => {
    const station = makeStation();
    station.stationFrameStep = new StandardStationSpaceframeStep(
      StationFrame.InternationalSpaceStation,
    );
    const result = stationReducer({ station }, setStationCustomScale(6));
    expect(result.station?.stationFrameStep).toBeInstanceOf(
      CustomStationSpaceframeStep,
    );
    expect(result.station?.scale).toBe(6);
  });

  test('SET_STATION_CUSTOM_SCALE trims departments and systems to the reduced budget', () => {
    let result: { station?: Station } = { station: makeStation() };
    result = stationReducer(result, setStationCustomScale(20));
    result = stationReducer(
      result,
      changeStationCustomFrameDepartment(20, Department.Command),
    );
    result = stationReducer(
      result,
      changeStationCustomFrameSystem(40, System.Structure),
    );
    const inflated = result.station as Station;
    expect(inflated.sumDepartmentPoints).toBeGreaterThan(
      inflated.totalAvailableDepartmentPoints,
    );
    expect(inflated.sumSystemPoints).toBeGreaterThan(
      inflated.totalAvailableSystemPoints,
    );

    result = stationReducer(result, setStationCustomScale(3));
    const station = result.station as Station;
    expect(station.scale).toBe(3);
    expect(station.sumDepartmentPoints).toBe(
      station.totalAvailableDepartmentPoints,
    );
    expect(station.sumSystemPoints).toBe(station.totalAvailableSystemPoints);
  });

  test('custom frame system changes are clamped to the maximum allowed value', () => {
    let result: { station?: Station } = { station: makeStation() };
    result = stationReducer(result, setStationCustomScale(20));
    result = stationReducer(
      result,
      changeStationCustomFrameSystem(100, System.Structure),
    );
    const station = result.station as Station;
    expect(station.systems[System.Structure]).toBe(station.maxSystemValue);
  });

  test('custom frame department changes are clamped to the maximum allowed value', () => {
    let result: { station?: Station } = { station: makeStation() };
    result = stationReducer(result, setStationCustomScale(20));
    result = stationReducer(
      result,
      changeStationCustomFrameDepartment(100, Department.Command),
    );
    const station = result.station as Station;
    expect(station.departments[Department.Command]).toBe(
      station.maxDepartmentValue,
    );
  });

  test('ADD_STATION_WEAPON and DELETE_STATION_WEAPON manage the weapon list by identity', () => {
    const phaser = StarshipWeaponRegistry.getWeaponByName('Phaser Banks', 2);
    let result: { station?: Station } = { station: makeStation() };
    result = stationReducer(result, addStationWeapon(phaser));
    expect(result.station?.weapons).toHaveLength(1);
    expect(result.station?.weapons[0]).toBe(phaser);

    result = stationReducer(result, deleteStationWeapon(phaser));
    expect(result.station?.weapons).toHaveLength(0);

    result = stationReducer(result, deleteStationWeapon(phaser));
    expect(result.station?.weapons).toHaveLength(0);
  });

  test('SET_STATION_ADDITIONAL_TALENTS copies the supplied talents', () => {
    const talent = new SelectedTalent('Bold');
    const result = stationReducer(
      { station: makeStation() },
      setStationAdditionalTalents([talent]),
    );
    expect(result.station?.additionalTalents).toHaveLength(1);
    expect(result.station?.additionalTalents[0].name).toBe('Bold');
    expect(result.station?.additionalTalents[0]).not.toBe(talent);
  });

  test('SET_STATION_TRAITS replaces the trait list', () => {
    const result = stationReducer(
      { station: makeStation() },
      setStationTraits(['Reinforced Hull']),
    );
    expect(result.station?.traits).toEqual(['Reinforced Hull']);
  });

  test('SET_STATION_FRAME to a standard frame sets its profile and clears weapons', () => {
    const station = makeStation();
    station.weapons = [
      StarshipWeaponRegistry.getWeaponByName('Phaser Banks', 2),
    ];
    const result = stationReducer(
      { station },
      setStationFrame(StationFrame.InternationalSpaceStation),
    );
    expect(result.station?.stationFrameStep).toBeInstanceOf(
      StandardStationSpaceframeStep,
    );
    expect(result.station?.missionProfileStep?.type).toBe(
      MissionProfile.ResearchStation,
    );
    expect(result.station?.weapons).toEqual([]);
  });

  test('SET_STATION_FRAME to Custom preserves the current scale', () => {
    const station = makeStation();
    station.stationFrameStep = new StandardStationSpaceframeStep(
      StationFrame.InternationalSpaceStation,
    );
    const result = stationReducer(
      { station },
      setStationFrame(StationFrame.Custom),
    );
    expect(result.station?.stationFrameStep).toBeInstanceOf(
      CustomStationSpaceframeStep,
    );
    expect(result.station?.scale).toBe(3);
  });

  test('SET_STATION_FRAME_APPEARANCE applies only to custom frames', () => {
    const custom = stationReducer(
      { station: makeStation() },
      setStationFrameAppearance(StationFrameAppearance.Spacedock),
    );
    expect(custom.station?.stationFrameStep?.appearance).toBe(
      StationFrameAppearance.Spacedock,
    );

    const station = makeStation();
    station.stationFrameStep = new StandardStationSpaceframeStep(
      StationFrame.InternationalSpaceStation,
    );
    const standard = stationReducer(
      { station },
      setStationFrameAppearance(StationFrameAppearance.Spacedock),
    );
    expect(standard.station?.stationFrameStep?.appearance).toBe(
      StationFrameAppearance.InternationalSpaceStation,
    );
  });
});
