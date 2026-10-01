import { test, expect, describe, jest } from '@jest/globals';
import '../../src/helpers/species';
import { starshipReducer } from '../../src/state/starshipReducer';
import { setStarshipMissionPod } from '../../src/state/starshipActions';
import { Starship, MissionProfileStep } from '../../src/common/starship';
import { CharacterType } from '../../src/common/characterType';
import { Era } from '../../src/helpers/erasEnum';
import { MissionProfiles } from '../../src/helpers/missionProfiles';
import { MissionPodHelper } from '../../src/helpers/missionPods';
import { SelectedTalent } from '../../src/common/selectedTalent';

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
  const core2ndEdition = 1;
  return {
    store: {
      getState: () => ({ context: { sources: [core2ndEdition] } }),
      dispatch: () => undefined,
    },
  };
});

function shipWithRuggedDesignFromProfileAndPod() {
  const starship = Starship.createStandardStarship(
    Era.NextGeneration,
    CharacterType.Starfleet,
    2,
  );
  starship.missionProfileStep = new MissionProfileStep(
    MissionProfiles.instance.getMissionProfileByName(
      'LogisticalQuartermaster',
      CharacterType.Starfleet,
      2,
    ),
  );
  starship.missionProfileStep.talent = new SelectedTalent('Rugged Design');
  return starship;
}

describe('Mission pod swap reconciliation (#345)', () => {
  test('swapping in a pod drops duplicate additional talents', () => {
    const starship = shipWithRuggedDesignFromProfileAndPod();
    starship.additionalTalents = [new SelectedTalent('Rugged Design')];

    const state = starshipReducer(
      { starship: starship, workflow: undefined, hash: undefined },
      setStarshipMissionPod(
        MissionPodHelper.instance().getMissionPodByName('MobileDrydock', 2),
      ),
    );

    const rugged = state.starship.additionalTalents.filter(
      (t) => t.name === 'Rugged Design',
    );
    expect(rugged.length).toBe(0);
  });

  test('swapping in a pod normalizes the replacements to the pod talent count', () => {
    const starship = shipWithRuggedDesignFromProfileAndPod();

    const state = starshipReducer(
      { starship: starship, workflow: undefined, hash: undefined },
      setStarshipMissionPod(
        MissionPodHelper.instance().getMissionPodByName('MobileDrydock', 2),
        [new SelectedTalent('Advanced Holographic Emitters')],
      ),
    );

    expect(state.starship.missionPodReplacements.length).toBe(2);
    expect(state.starship.missionPodReplacements[0]?.name).toBe(
      'Advanced Holographic Emitters',
    );
    expect(state.starship.missionPodReplacements[1]).toBeUndefined();
  });

  test('clearing the mission pod clears the replacements', () => {
    const starship = shipWithRuggedDesignFromProfileAndPod();
    starship.missionPodModel = MissionPodHelper.instance().getMissionPodByName(
      'MobileDrydock',
      2,
    );
    starship.missionPodReplacements = [
      undefined,
      new SelectedTalent('Advanced Holographic Emitters'),
    ];

    const state = starshipReducer(
      { starship: starship, workflow: undefined, hash: undefined },
      setStarshipMissionPod(undefined),
    );

    expect(state.starship.missionPodModel).toBeUndefined();
    expect(state.starship.missionPodReplacements.length).toBe(0);
  });
});
