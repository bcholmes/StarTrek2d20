import {
  CareerEventStep,
  CareerStep,
  Character,
  CharacterAdvancementStep,
  CharacterRank,
  EducationStep,
  EnvironmentStep,
  FinishingStep,
  NpcGenerationStep,
  Promotion,
  ReputationChangeStep,
  SpeciesAbilityOptions,
  SpeciesStep,
  UpbringingStep,
} from '../../src/common/character';
import { CharacterType } from '../../src/common/characterType';
import { SelectedTalent } from '../../src/common/selectedTalent';
import {
  Station,
  StandardStationSpaceframeStep,
  StationMissionProfileStep,
} from '../../src/common/station';
import { MissionProfileStep, Starship } from '../../src/common/starship';
import { SpaceframeHelper } from '../../src/helpers/spaceframes';
import { Attribute } from '../../src/helpers/attributes';
import { Department } from '../../src/helpers/department';
import { Environment } from '../../src/helpers/environments';
import { EarlyOutlook, UpbringingsHelper } from '../../src/helpers/upbringings';
import { Track } from '../../src/helpers/trackEnum';
import { Career } from '../../src/helpers/careerEnum';
import { Species } from '../../src/helpers/speciesEnum';
import { SpeciesAbilityList } from '../../src/helpers/speciesAbility';
import { Era } from '../../src/helpers/erasEnum';
import { Role } from '../../src/helpers/roles';
import { Rank, RanksHelper } from '../../src/helpers/ranks';
import { NpcType } from '../../src/npc/model/npcType';
import { ModificationType } from '../../src/modify/model/modificationType';
import { CharacterAdvancementChoice } from '../../src/modify/model/characterAdvancementChoice';
import { Spaceframe } from '../../src/helpers/spaceframeEnum';
import { StationFrame } from '../../src/helpers/stationFrame';
import {
  MissionProfile,
  MissionProfiles,
} from '../../src/helpers/missionProfiles';
import { System } from '../../src/helpers/systems';
import { EquipmentType } from '../../src/helpers/equipment';
import { PersonalWeaponType } from '../../src/helpers/weapons';

export function makePopulatedMainCharacter(version: 1 | 2): Character {
  const character = Character.createMainCharacter(
    CharacterType.Starfleet,
    Era.NextGeneration,
    version,
  );
  character.name = 'Rhea Voss';
  character.pronouns = 'she/her';
  character.pastime = ['Anthropology', 'Aquaponics'];
  character.additionalTraits = 'Professional';
  character.description =
    'An engineer who documented the founding days of the new frontier.';

  const speciesStep = new SpeciesStep(Species.Human);
  speciesStep.attributes = [
    Attribute.Daring,
    Attribute.Insight,
    Attribute.Reason,
  ];
  if (version === 2) {
    speciesStep.ability = SpeciesAbilityList.instance.getBySpecies(
      Species.Human,
    );
    const abilityOptions = new SpeciesAbilityOptions();
    abilityOptions.focuses = ['Compassion'];
    speciesStep.abilityOptions = abilityOptions;
  }
  character.speciesStep = speciesStep;

  const environmentStep = new EnvironmentStep(Environment.StarshipOrStarbase);
  environmentStep.attribute = Attribute.Fitness;
  environmentStep.discipline = Department.Engineering;
  environmentStep.value = 'Curiosity';
  character.environmentStep = environmentStep;

  const upbringing = UpbringingsHelper.getUpbringing(
    EarlyOutlook.BusinessOrTrade,
  )!;
  const upbringingStep = new UpbringingStep(upbringing, true);
  upbringingStep.discipline = Department.Engineering;
  upbringingStep.focus = 'Engineering';
  upbringingStep.talent = new SelectedTalent('Bold');
  character.upbringingStep = upbringingStep;

  const educationStep = new EducationStep(Track.Sciences);
  educationStep.primaryDiscipline = Department.Engineering;
  educationStep.enlisted = false;
  educationStep.disciplines = [Department.Command, Department.Medicine];
  educationStep.focuses = ['Astrophysics', 'Starship Design'];
  educationStep.value = 'Courage';
  educationStep.talent = new SelectedTalent('Cautious');
  character.educationStep = educationStep;

  if (version === 2) {
    const careerStep = new CareerStep(Career.Experienced);
    careerStep.value = 'Harmony';
    careerStep.talent = new SelectedTalent('Untapped Potential');
    character.careerStep = careerStep;

    const finishingStep = new FinishingStep();
    finishingStep.attributes = [Attribute.Daring, Attribute.Fitness];
    finishingStep.disciplines = [Department.Engineering, Department.Science];
    finishingStep.value = 'Initiative';
    finishingStep.talent = new SelectedTalent('Advisor');
    character.finishingStep = finishingStep;
  }

  const firstEvent = new CareerEventStep(1);
  firstEvent.attribute = Attribute.Daring;
  firstEvent.discipline = Department.Security;
  firstEvent.focus = 'Survival';
  firstEvent.trait = 'Dark Secrets';
  character.careerEvents.push(firstEvent);

  const secondEvent = new CareerEventStep(4);
  secondEvent.discipline = Department.Command;
  secondEvent.focus = 'Diplomacy';
  character.careerEvents.push(secondEvent);

  character.addTrait('Steadfast');

  const advancement = new CharacterAdvancementStep();
  advancement.choice = CharacterAdvancementChoice.Talent;
  advancement.value = new SelectedTalent('Supervisor');
  const promotion = new Promotion(
    new CharacterRank(
      RanksHelper.instance().getRank(Rank.LtCommander)?.localizedName ?? '',
      Rank.LtCommander,
    ),
    ModificationType.Promotion,
  );
  const reputation = new ReputationChangeStep(2);
  character.improvements = [advancement, promotion, reputation];

  character.rankValue = new CharacterRank(
    RanksHelper.instance().getRank(Rank.Lieutenant)?.localizedName ?? '',
    Rank.Lieutenant,
  );
  character.role = Role.ChiefEngineer;
  character.secondaryRole = Role.OperationsManager;
  character.assignedShip = 'USS Venture';
  character.jobAssignment = '';

  return character;
}

export function makePopulatedNpc(): Character {
  const character = Character.createNpcCharacter(
    Era.NextGeneration,
    2,
    NpcType.Notable,
    CharacterType.Starfleet,
  );
  character.name = 'Sub-Commander Torel';
  character.description = 'A Vulcan liaison aboard a starbase.';

  const speciesStep = new SpeciesStep(Species.Vulcan);
  speciesStep.attributes = [
    Attribute.Reason,
    Attribute.Insight,
    Attribute.Presence,
  ];
  character.speciesStep = speciesStep;

  const npcGenerationStep =
    character.npcGenerationStep ?? new NpcGenerationStep(NpcType.Notable);
  npcGenerationStep.type = NpcType.Notable;
  npcGenerationStep.values = ['Logic', 'Peace'];
  npcGenerationStep.talents = [
    new SelectedTalent('Bold'),
    new SelectedTalent('Veteran'),
  ];
  npcGenerationStep.attributes = [0, 1, 0, 1, 0, 1];
  npcGenerationStep.departments = [3, 2, 2, 1, 1, 1];
  npcGenerationStep.focuses = ['Meditation', 'Vulcan Nerve Pinch', 'Science'];
  npcGenerationStep.weapons = [PersonalWeaponType.Phaser2];
  npcGenerationStep.equipment = [EquipmentType.Communicator];
  character.npcGenerationStep = npcGenerationStep;

  character.rankValue = new CharacterRank('Commander', Rank.Commander);
  return character;
}

export function makePopulatedStarship(): Starship {
  const starship = Starship.createStandardStarship(
    Era.NextGeneration,
    CharacterType.Starfleet,
    2,
  );
  starship.name = 'USS Venture';
  starship.spaceframeModel = SpaceframeHelper.instance().getSpaceframe(
    Spaceframe.Galaxy_2E,
  );
  starship.registry = 'NCC-70637';
  starship.serviceYear = 2372;
  starship.traits = 'Flagship, Hero Ship';

  const missionProfile =
    MissionProfiles.instance.getMissionProfiles(starship)[0];
  if (missionProfile) {
    const missionProfileStep = new MissionProfileStep(missionProfile);
    missionProfileStep.system = missionProfile.systems[0];
    missionProfileStep.talent = missionProfile.talents.length
      ? new SelectedTalent(missionProfile.talents[0].name)
      : undefined;
    starship.missionProfileStep = missionProfileStep;
  }

  starship.additionalTalents = [
    new SelectedTalent('Secondary Reactors'),
    new SelectedTalent('Redundant Systems'),
    new SelectedTalent('Dedicated Personnel'),
  ];
  starship.refits = [System.Engines, System.Weapons];

  return starship;
}

export function makePopulatedStation(): Station {
  const station = Station.create(
    CharacterType.Starfleet,
    2,
    Era.NextGeneration,
  );
  station.name = 'Starbase 24';
  station.stationFrameStep = new StandardStationSpaceframeStep(
    StationFrame.FederationStarbase,
  );
  station.missionProfileStep = new StationMissionProfileStep(
    MissionProfile.ResearchStation,
  );
  station.traits = ['Border Post', 'High Capacity'];
  station.additionalTalents = [new SelectedTalent('Secondary Reactors')];
  return station;
}
