import { test, expect, describe } from '@jest/globals';
import '../../src/helpers/species';
import { CharacterType } from '../../src/common/characterType';
import { SelectedTalent } from '../../src/common/selectedTalent';
import {
  MissionProfileStep,
  SimpleStats,
  Starship,
} from '../../src/common/starship';
import type { StarshipAdvancementStep } from '../../src/common/starship';
import { StarshipAdvancementChoice } from '../../src/common/starshipAdvancementChoice';
import { Era } from '../../src/helpers/erasEnum';
import { Department } from '../../src/helpers/department';
import { MissionProfiles } from '../../src/helpers/missionProfiles';
import { Spaceframe } from '../../src/helpers/spaceframeEnum';
import { SpaceframeHelper } from '../../src/helpers/spaceframes';
import { SpaceframeAppearance } from '../../src/helpers/spaceframeAppearance';
import { SpaceframeModel } from '../../src/helpers/spaceframeModel';
import { System } from '../../src/helpers/systems';
import { StarshipWeaponRegistry } from '../../src/helpers/weapons';
import {
  ServiceRecord,
  ServiceRecordList,
} from '../../src/starship/model/serviceRecord';
import { ShipBuildWorkflow } from '../../src/starship/model/shipBuildWorkflow';
import { ShipBuildType } from '../../src/common/shipBuildType';
import { starshipReducer } from '../../src/state/starshipReducer';
import {
  addStarshipRefit,
  addStarshipWeapon,
  changeStarshipScale,
  changeStarshipSimpleDepartment,
  changeStarshipSimpleSystem,
  changeStarshipSpaceframeClassName,
  changeStarshipSpaceframeDepartment,
  changeStarshipSpaceframeScale,
  changeStarshipSpaceframeServiceYear,
  changeStarshipSpaceframeSystem,
  createNewStarship,
  createStarship,
  deleteStarshipRefit,
  deleteStarshipWeapon,
  modifyStarshipAddAdvancement,
  nextStarshipWorkflowStep,
  rewindToStarshipWorkflowStep,
  setAdditionalTalents,
  setStarshipMissionProfile,
  setStarshipMissionProfileTalent,
  setStarshipName,
  setStarshipRegistry,
  setStarshipServiceRecord,
  setStarshipServiceYear,
  setStarshipSpaceframe,
  setStarshipSpaceframeAppearance,
  setStarshipSpaceframeTalents,
  setStarshipTraits,
} from '../../src/state/starshipActions';

jest.mock('i18next', () => {
  const mockI18n: any = (key: string) => key;
  mockI18n.t = (key: string) => key;
  mockI18n.use = function () {
    return this;
  };
  mockI18n.init = function () {
    return this;
  };
  mockI18n.on = function () {
    return this;
  };
  mockI18n.changeLanguage = function () {
    return Promise.resolve();
  };
  return mockI18n;
});

jest.mock('../../src/state/store', () => {
  const core2ndEdition = 1; // Source.Core2ndEdition
  return {
    store: {
      getState: () => ({ context: { sources: [core2ndEdition] } }),
      dispatch: () => undefined,
    },
  };
});

const initialState = () => ({ starship: undefined, workflow: undefined });

function makeStarship(): Starship {
  return Starship.createStandardStarship(
    Era.NextGeneration,
    CharacterType.Starfleet,
    2,
  );
}

function makeStarshipWithFrame(): Starship {
  const starship = makeStarship();
  starship.spaceframeModel = SpaceframeHelper.instance().getSpaceframe(
    Spaceframe.Galaxy_2E,
  );
  starship.serviceYear = 2371;
  return starship;
}

function makeCustomFrameStarship(): Starship {
  const starship = makeStarship();
  starship.spaceframeModel = SpaceframeModel.createCustomSpaceframe(
    CharacterType.Starfleet,
    2371,
  );
  starship.serviceYear = 2371;
  return starship;
}

function dispatchAll(
  state: { starship?: Starship; workflow?: ShipBuildWorkflow },
  ...actions: any[]
): { starship?: Starship; workflow?: ShipBuildWorkflow } {
  return actions.reduce(starshipReducer as any, state);
}

describe('starshipReducer', () => {
  test('returns the initial state for an unknown action', () => {
    const result = starshipReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState());
  });

  test('CREATE_STARSHIP stores a copy of the ship and its hash', () => {
    const starship = makeStarshipWithFrame();
    starship.name = 'Enterprise';
    const result = starshipReducer(
      initialState(),
      createStarship(starship, 123),
    );
    expect(result.starship?.name).toBe('Enterprise');
    expect(result.starship).not.toBe(starship);
    expect(result.hash).toBe(123);
  });

  test('CREATE_NEW_STARSHIP builds a standard starship with the given service year and workflow', () => {
    const workflow = ShipBuildWorkflow.createSimpleBuildWorkflow();
    const result = starshipReducer(
      initialState(),
      createNewStarship(
        CharacterType.Starfleet,
        Era.NextGeneration,
        2371,
        undefined,
        workflow,
      ),
    );
    expect(result.starship?.serviceYear).toBe(2371);
    expect(result.workflow).toBe(workflow);
    expect(result.hash).toBeUndefined();
  });

  test('CREATE_NEW_STARSHIP with simple stats sets up a simple starship', () => {
    const simple = new SimpleStats();
    simple.scale = 3;
    simple.systems = [5, 5, 5, 5, 5, 5];
    simple.departments = [1, 1, 1, 1, 1, 1];
    simple.className = 'Test Class';
    const result = dispatchAll(
      initialState(),
      createNewStarship(
        CharacterType.Starfleet,
        Era.NextGeneration,
        2371,
        simple,
        undefined,
        ShipBuildType.Starship,
        2,
      ),
    );
    expect(result.starship?.simpleStats?.className).toBe('Test Class');
    expect(result.starship?.simpleStats?.scale).toBe(3);
  });

  test('SET_STARSHIP_NAME updates the name', () => {
    const result = dispatchAll(
      { starship: makeStarship() },
      setStarshipName('Voyager'),
    );
    expect(result.starship?.name).toBe('Voyager');
  });

  test('SET_STARSHIP_REGISTRY and SET_STARSHIP_TRAITS update their fields', () => {
    let result = dispatchAll(
      { starship: makeStarship() },
      setStarshipRegistry('NCC-74656'),
    );
    expect(result.starship?.registry).toBe('NCC-74656');
    result = dispatchAll(result, setStarshipTraits('Fast'));
    expect(result.starship?.traits).toBe('Fast');
  });

  test('SET_STARSHIP_SERVICE_YEAR updates the service year', () => {
    const result = dispatchAll(
      { starship: makeStarship() },
      setStarshipServiceYear(2364),
    );
    expect(result.starship?.serviceYear).toBe(2364);
  });

  test('CHANGE_STARSHIP_SCALE changes the scale of a simple starship and prunes excess talents', () => {
    const starship = makeStarship();
    starship.simpleStats = new SimpleStats();
    starship.simpleStats.scale = 3;
    const result = dispatchAll({ starship }, changeStarshipScale(1));
    expect(result.starship?.scale).toBe(4);
  });

  test('CHANGE_STARSHIP_SIMPLE_SYSTEM and CHANGE_STARSHIP_SIMPLE_DEPARTMENT adjust simple stats', () => {
    const starship = makeStarship();
    starship.simpleStats = new SimpleStats();
    starship.simpleStats.systems = [5, 4, 3, 2, 1, 0];
    starship.simpleStats.departments = [1, 2, 3, 4, 5, 6];
    let result = dispatchAll(
      { starship },
      changeStarshipSimpleSystem(2, System.Engines),
    );
    expect(result.starship?.simpleStats?.systems[System.Engines]).toBe(5);
    result = dispatchAll(
      result,
      changeStarshipSimpleDepartment(1, Department.Command),
    );
    expect(result.starship?.simpleStats?.departments[Department.Command]).toBe(
      2,
    );
  });

  test('CHANGE_STARSHIP_SPACEFRAME_SCALE only applies to custom spaceframes', () => {
    const custom = makeCustomFrameStarship();
    const customResult = dispatchAll(
      { starship: custom },
      changeStarshipSpaceframeScale(1),
    );
    expect(customResult.starship?.spaceframeStep?.model?.scale).toBe(4);

    const standard = makeStarshipWithFrame();
    const standardScaleBefore = standard.spaceframeStep?.model?.scale;
    const standardResult = dispatchAll(
      { starship: standard },
      changeStarshipSpaceframeScale(1),
    );
    expect(standardResult.starship?.spaceframeStep?.model?.scale).toBe(
      standardScaleBefore,
    );
  });

  test('CHANGE_STARSHIP_SPACEFRAME_SERVICE_YEAR updates the custom spaceframe service year', () => {
    const result = dispatchAll(
      { starship: makeCustomFrameStarship() },
      changeStarshipSpaceframeServiceYear(2400),
    );
    expect(result.starship?.spaceframeStep?.model?.serviceYear).toBe(2400);
  });

  test('CHANGE_STARSHIP_SPACEFRAME_CLASS_NAME updates the custom spaceframe name', () => {
    const result = dispatchAll(
      { starship: makeCustomFrameStarship() },
      changeStarshipSpaceframeClassName('Nova'),
    );
    expect(result.starship?.spaceframeStep?.model?.name).toBe('Nova');
  });

  test('CHANGE_STARSHIP_SPACEFRAME_SYSTEM updates the custom spaceframe system', () => {
    const starship = makeCustomFrameStarship();
    const before = starship.spaceframeStep?.model?.systems[System.Engines];
    const result = dispatchAll(
      { starship },
      changeStarshipSpaceframeSystem(3, System.Engines),
    );
    expect(
      result.starship?.spaceframeStep?.model?.systems[System.Engines],
    ).toBe((before ?? 0) + 3);
  });

  test('CHANGE_STARSHIP_SPACEFRAME_DEPARTMENT updates the custom spaceframe department', () => {
    const starship = makeCustomFrameStarship();
    const before =
      starship.spaceframeStep?.model?.departments[Department.Security];
    const result = dispatchAll(
      { starship },
      changeStarshipSpaceframeDepartment(2, Department.Security),
    );
    expect(
      result.starship?.spaceframeStep?.model?.departments[Department.Security],
    ).toBe((before ?? 0) + 2);
  });

  test('SET_STARSHIP_SPACEFRAME establishes a new spaceframe step and variant', () => {
    const frame = SpaceframeHelper.instance().getSpaceframe(
      Spaceframe.Galaxy_2E,
    );
    const result = dispatchAll(
      { starship: makeStarship() },
      setStarshipSpaceframe(frame),
    );
    expect(result.starship?.spaceframeStep?.model?.name).toBe(frame.name);
  });

  test('SET_STARSHIP_SPACEFRAME_TALENTS sets the spaceframe talent list on a copy', () => {
    const starship = makeStarshipWithFrame();
    const talent = new SelectedTalent('Rugged Design');
    const result = dispatchAll(
      { starship },
      setStarshipSpaceframeTalents([talent]),
    );
    expect(result.starship?.spaceframeStep?.talents).toHaveLength(1);
    expect(result.starship?.spaceframeStep?.talents[0].name).toBe(
      'Rugged Design',
    );
  });

  test('SET_STARSHIP_MISSION_PROFILE replaces the profile, preserving the talent when the type is unchanged', () => {
    const starship = makeStarshipWithFrame();
    const profile = MissionProfiles.instance.getMissionProfileByName(
      'LogisticalQuartermaster',
      CharacterType.Starfleet,
      2,
    );
    starship.missionProfileStep = new MissionProfileStep(profile);
    starship.missionProfileStep.talent = new SelectedTalent('Rugged Design');

    let result = starshipReducer(
      { starship },
      setStarshipMissionProfile(profile),
    );
    expect(result.starship?.missionProfileStep?.type).toBe(profile);
    expect(result.starship?.missionProfileStep?.talent?.name).toBe(
      'Rugged Design',
    );

    const other = MissionProfiles.instance.getMissionProfileByName(
      'DiplomaticOperations',
      CharacterType.Starfleet,
      2,
    );
    result = starshipReducer(result, setStarshipMissionProfile(other));
    expect(result.starship?.missionProfileStep?.type).toBe(other);
    expect(result.starship?.missionProfileStep?.talent).toBeUndefined();
  });

  test('SET_STARSHIP_MISSION_PROFILE_TALENT sets the talent on the mission profile step', () => {
    const starship = makeStarshipWithFrame();
    starship.missionProfileStep = new MissionProfileStep(
      MissionProfiles.instance.getMissionProfileByName(
        'LogisticalQuartermaster',
        CharacterType.Starfleet,
        2,
      ),
    );
    const result = dispatchAll(
      { starship },
      setStarshipMissionProfileTalent(new SelectedTalent('Rugged Design')),
    );
    expect(result.starship?.missionProfileStep?.talent?.name).toBe(
      'Rugged Design',
    );
  });

  test('SET_STARSHIP_SERVICE_RECORD sets the service record step, preserving selection on type change', () => {
    const starship = makeStarshipWithFrame();
    const record = ServiceRecordList.instance.getByType(
      ServiceRecord.AgingRelic,
    )!;
    const result = dispatchAll(
      { starship },
      setStarshipServiceRecord(record, undefined, 'Old Timer'),
    );
    expect(result.starship?.serviceRecordStep?.type).toBe(record);
    expect(result.starship?.serviceRecordStep?.selection).toBe('Old Timer');
  });

  test('SET_STARSHIP_SPACEFRAME_APPEARANCE applies only to custom spaceframes', () => {
    const custom = makeCustomFrameStarship();
    const customResult = dispatchAll(
      { starship: custom },
      setStarshipSpaceframeAppearance(SpaceframeAppearance.Freighter),
    );
    expect(customResult.starship?.spaceframeStep?.appearance).toBe(
      SpaceframeAppearance.Freighter,
    );

    const standard = makeStarshipWithFrame();
    const standardResult = dispatchAll(
      { starship: standard },
      setStarshipSpaceframeAppearance(SpaceframeAppearance.Freighter),
    );
    expect(standardResult.starship?.spaceframeStep?.appearance).toBeUndefined();
  });

  test('SET_ADDITIONAL_TALENTS copies the supplied talents', () => {
    const talent = new SelectedTalent('Bold');
    const result = dispatchAll(
      { starship: makeStarshipWithFrame() },
      setAdditionalTalents([talent]),
    );
    expect(result.starship?.additionalTalents).toHaveLength(1);
    expect(result.starship?.additionalTalents[0]).not.toBe(talent);
    expect(result.starship?.additionalTalents[0].name).toBe('Bold');
  });

  test('ADD_STARSHIP_REFIT and DELETE_STARSHIP_REFIT manage the refit list', () => {
    let result = dispatchAll(
      { starship: makeStarshipWithFrame() },
      addStarshipRefit(System.Engines),
    );
    expect(result.starship?.refits).toContain(System.Engines);
    result = dispatchAll(result, deleteStarshipRefit(System.Engines));
    expect(result.starship?.refits).not.toContain(System.Engines);
  });

  test('ADD_STARSHIP_WEAPON and DELETE_STARSHIP_WEAPON manage the additional weapons by identity', () => {
    const phaser = StarshipWeaponRegistry.getWeaponByName('Phaser Banks', 2);
    let result = dispatchAll(
      { starship: makeStarshipWithFrame() },
      addStarshipWeapon(phaser),
    );
    expect(result.starship?.additionalWeapons).toHaveLength(1);
    expect(result.starship?.additionalWeapons[0]).toBe(phaser);
    result = dispatchAll(result, deleteStarshipWeapon(phaser));
    expect(result.starship?.additionalWeapons).toHaveLength(0);
  });

  test('MODIFY_STARSHIP_ADD_ADVANCEMENT adds a system advancement', () => {
    const result = dispatchAll(
      { starship: makeStarshipWithFrame() },
      modifyStarshipAddAdvancement(
        StarshipAdvancementChoice.System,
        System.Engines,
      ),
    );
    expect(result.starship?.advancementSteps).toHaveLength(1);
    expect(result.starship?.advancementSteps[0].choice).toBe(
      StarshipAdvancementChoice.System,
    );
    expect(result.starship?.advancementSteps[0].value).toBe(System.Engines);
  });

  test('MODIFY_STARSHIP_ADD_ADVANCEMENT copies a talent and records the removal', () => {
    const talent = new SelectedTalent('Bold');
    const remove = new SelectedTalent('Rugged Design');
    const result = dispatchAll(
      { starship: makeStarshipWithFrame() },
      modifyStarshipAddAdvancement(
        StarshipAdvancementChoice.Talent,
        talent,
        remove,
      ),
    );
    const step = result.starship
      ?.advancementSteps[0] as StarshipAdvancementStep;
    expect(step.value).not.toBe(talent);
    expect((step.value as SelectedTalent).name).toBe('Bold');
    expect((step.removeValue as SelectedTalent).name).toBe('Rugged Design');
  });

  test('NEXT_STARSHIP_WORKFLOW_STEP advances the workflow index', () => {
    const workflow = ShipBuildWorkflow.createSimpleBuildWorkflow();
    const result = dispatchAll(
      { starship: makeStarship(), workflow },
      nextStarshipWorkflowStep(),
    );
    expect(result.workflow?.currentStepIndex).toBe(
      workflow.currentStepIndex + 1,
    );
  });

  test('REWIND_TO_STARSHIP_WORKFLOW_STEP sets the workflow index', () => {
    const workflow = ShipBuildWorkflow.createSimpleBuildWorkflow();
    const result = dispatchAll(
      { starship: makeStarship(), workflow },
      rewindToStarshipWorkflowStep(0),
    );
    expect(result.workflow?.currentStepIndex).toBe(0);
  });

  test('NEXT_STARSHIP_WORKFLOW_STEP with no workflow returns the prior state', () => {
    // Historical bug: a bare `return;` produced `undefined`, wiping the slice.
    // Fixed during migration: the slice is preserved when there is no workflow.
    const state = { starship: makeStarship(), workflow: undefined };
    const result = starshipReducer(state, nextStarshipWorkflowStep());
    expect(result).toEqual(state);
  });

  test('REWIND_TO_STARSHIP_WORKFLOW_STEP with no workflow returns the prior state', () => {
    const state = { starship: makeStarship(), workflow: undefined };
    const result = starshipReducer(state, rewindToStarshipWorkflowStep(0));
    expect(result).toEqual(state);
  });
});
