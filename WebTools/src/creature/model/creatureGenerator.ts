import { D20 } from '../../common/die';
import { SelectedTalent } from '../../common/selectedTalent';
import type { Era } from '../../helpers/erasEnum';
import { Department } from '../../helpers/department';
import {
  TALENT_NAME_FLIGHT,
  TALENT_NAME_SWARM_X,
  TALENT_NAME_WEB,
} from '../../helpers/talents';
import { isSecondEdition } from '../../state/contextFunctions';
import { Creature } from './creature';
import { creatureNameGenerator } from './creatureNameGenerator';
import {
  CreatureSize,
  CreatureSizeHelper,
  generateRandomCreatureSize,
} from './creatureSize';
import {
  determineXIfNecessary,
  generateRandomBasicCreatureTalent,
  generateRandomCreatureDietTalent,
  generateRandomCreatureTypeTalent,
} from './creatureTalents';
import {
  createRandomCreatureType,
  CreatureType,
  CreatureTypeHelper,
  habitatsByCreatureType,
} from './creatureType';
import { createRandomDiet, DietType, DietTypeHelper } from './diet';
import { createRandomHabitat, Habitat, HabitatHelper } from './habitat';
import { generateRandomLocomotionType } from './locomotion';
import { generateRandomNaturalAttacks } from './naturalAttacks';
import { Attribute } from '../../helpers/attributes';

export const creatureGenerator = async (
  era: Era,
  habitat?: Habitat,
  creatureType?: CreatureType,
  includeDescription: boolean = true,
) => {
  const result = new Creature();
  result.version = isSecondEdition() ? 2 : 1;
  result.era = era;

  if (habitat == null && creatureType != null) {
    const habitats = habitatsByCreatureType(creatureType);
    habitat = habitats[Math.floor(Math.random() * habitats.length)];
  } else if (habitat == null) {
    habitat = createRandomHabitat();
  }

  result.habitat = HabitatHelper.instance.getTypeById(habitat);
  if (creatureType == null) {
    creatureType = createRandomCreatureType(habitat);
  }
  result.creatureType = CreatureTypeHelper.instance.getTypeById(creatureType);

  const diet = createRandomDiet();
  result.diet = DietTypeHelper.instance.getTypeById(diet);

  const size = generateRandomCreatureSize();
  result.size = CreatureSizeHelper.instance.getTypeById(size);

  result.naturalAttacks = generateRandomNaturalAttacks(diet);

  result.locomotion = generateRandomLocomotionType(creatureType, habitat);

  if (result.creatureType?.id === CreatureType.Bird && D20.roll() <= 15) {
    result.additionalTalents.push(new SelectedTalent(TALENT_NAME_FLIGHT));
  }
  if (result.size?.id === CreatureSize.Swarm) {
    const selectedTalent = new SelectedTalent(TALENT_NAME_SWARM_X);
    selectedTalent.x = determineXIfNecessary(selectedTalent.talentModel);
    result.additionalTalents.push(selectedTalent);
  }

  const skillImprovements = 3;
  const skills = [Department.Security, Department.Security, Department.Command];
  for (let i = 0; i < skillImprovements; i++) {
    const index = Math.floor(Math.random() * skills.length);
    const skill = skills[index];

    result.departments[skill] += 1;
  }

  if (result.diet.id === DietType.Carnivore) {
    result.departments[Department.Security] += 1;
  }

  const attributeImprovementBySize = [26, 26, 26, 26, 28, 28, 30, 32, 32];
  const attributeImprovement = attributeImprovementBySize[result.size.id];
  let attributes = [
    Attribute.Control,
    Attribute.Control,
    Attribute.Daring,
    Attribute.Daring,
    Attribute.Daring,
    Attribute.Daring,
    Attribute.Fitness,
    Attribute.Fitness,
    Attribute.Fitness,
    Attribute.Fitness,
    Attribute.Insight,
    Attribute.Insight,
    Attribute.Presence,
    Attribute.Presence,
    Attribute.Presence,
    Attribute.Reason,
  ];
  for (let i = 0; i < attributeImprovement; i++) {
    const index = Math.floor(Math.random() * attributes.length);
    const attribute = attributes[index];

    result.attributes[attribute] += 1;
    if (result.attributes[attribute] >= 11) {
      attributes = attributes.filter((a) => a !== attribute);
    }
  }

  if (result.diet.id === DietType.Carnivore) {
    result.attributes[Attribute.Daring] += 1;
    result.attributes[Attribute.Fitness] += 1;
    result.attributes[Attribute.Presence] += 1;
  } else if (result.diet.id === DietType.Omnivore) {
    result.attributes[Attribute.Fitness] += 1;
  } else if (result.diet.id === DietType.Herbivore) {
    result.attributes[Attribute.Insight] += 1;
  }

  addAllTalentSelection(result, generateRandomBasicCreatureTalent());
  if (result.diet) {
    addAllTalentSelection(
      result,
      generateRandomCreatureDietTalent(result.diet.id),
    );
  }
  if (result.creatureType) {
    addAllTalentSelection(
      result,
      generateRandomCreatureTypeTalent(result.creatureType.id),
    );
  }

  result.form = deriveForm(result);
  result.name = creatureNameGenerator();

  if (includeDescription) {
    result.description = await generateCreatureDescription(result);
  }

  result.name +=
    result.form !== 'Unique' && result.form !== undefined
      ? ' ' + result.form
      : '';

  return result;
};

const addAllTalentSelection = (
  creature: Creature,
  talents: SelectedTalent[],
) => {
  talents.forEach((t) => {
    if (!creature.hasTalent(t.talent)) {
      creature.additionalTalents.push(t);
    }
  });
};

const generateCreatureDescription = async (creature: Creature) => {
  const data = {
    type: CreatureType[creature.creatureType.id],
    name: creature.name,
    habitat:
      creature.habitat != null ? Habitat[creature.habitat?.id] : undefined,
    size: creature.size != null ? CreatureSize[creature.size?.id] : undefined,
    diet: creature.diet != null ? DietType[creature.diet?.id] : undefined,
    form: creature.form,
    locomotion: creature.locomotion.map((l) => l.description),
  };

  const textEncoder = new TextEncoder();
  const body = textEncoder.encode(JSON.stringify(data));

  try {
    const response = await fetch('/api/creature_description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (response.status === 200) {
      const responseJson = await response.json();

      return responseJson?.description;
    } else {
      return undefined;
    }
  } catch (e) {
    return undefined;
  }
};

const deriveForm = (creature: Creature) => {
  let result = 'Unique';

  if (D20.roll() >= 8) {
    switch (creature.creatureType?.id) {
      case CreatureType.Bird:
        {
          const roll = D20.roll();

          if (creature.diet?.id === DietType.Carnivore) {
            if (creature.size?.id === CreatureSize.Small) {
              if (roll < 12) {
                result = 'Kestrel';
              } else {
                result = 'Falcon';
              }
            } else if (creature.size?.id === CreatureSize.Average) {
              if (roll < 4) {
                result = 'Vulture';
              } else if (roll < 8) {
                result = 'Condor';
              } else if (roll < 12) {
                result = 'Eagle';
              } else if (roll < 16) {
                result = 'Owl';
              } else {
                result = 'Hawk';
              }
            } else if (
              creature.size?.id === CreatureSize.Large ||
              creature.size?.id === CreatureSize.Huge
            ) {
              if (creature.isFlightlessBird) {
                result = 'Titanis';
              } else if (roll < 6) {
                result = 'Vulture';
              } else if (roll < 12) {
                result = 'Eagle';
              } else {
                result = 'Hawk';
              }
            }
          } else if (creature.diet?.id === DietType.Omnivore) {
            if (creature.size?.id === CreatureSize.Small) {
              if (roll < 4) {
                result = 'Duck';
              } else if (roll < 6) {
                result = 'Gull';
              } else if (roll < 8) {
                result = 'Crow';
              } else if (roll < 12) {
                result = 'Blackbird';
              } else if (roll < 14) {
                result = 'Crane';
              } else if (roll < 16) {
                result = 'Thrush';
              } else if (roll < 18) {
                result = 'Chicken';
              } else {
                result = 'Pheasant';
              }
            }
          } else {
            if (creature.size?.id === CreatureSize.Small) {
              if (creature.isFlightlessBird) {
                result = 'Penguin';
              } else if (roll < 2) {
                result = 'Flamingo';
              } else if (roll < 4) {
                result = 'Peafowl';
              } else if (roll < 6) {
                result = 'Sparrow';
              } else if (roll < 8) {
                result = 'Ibis';
              } else if (roll < 10) {
                result = 'Cormorant';
              } else if (roll < 12) {
                result = 'Partridge';
              } else if (roll < 16) {
                result = 'Parrot';
              } else if (roll < 18) {
                result = 'Budgee';
              } else {
                result = 'Toucan';
              }
            } else if (
              creature.size?.id === CreatureSize.Average ||
              creature.size?.id === CreatureSize.Huge
            ) {
              if (creature.isFlightlessBird) {
                if (roll < 5) {
                  result = 'Osterich';
                } else if (roll < 8) {
                  result = 'Emu';
                } else if (roll < 13) {
                  result = 'Moa';
                } else {
                  result = 'Dodo';
                }
              } else {
                if (roll < 5) {
                  result = 'Turkey';
                } else if (roll < 9) {
                  result = 'Pelican';
                } else {
                  result = 'Swan';
                }
              }
            }
          }
        }
        break;
      case CreatureType.Mammal:
        {
          const roll = D20.roll();
          if (creature.hasTalent(TALENT_NAME_FLIGHT)) {
            if (roll < 14) {
              result = 'Bat';
            } else if (roll < 18) {
              result = 'Flying Squirrel';
            } else if (roll === 19) {
              result = 'Sifaka';
            } else {
              result = 'Anomalure';
            }
          } else if (creature.size?.id === CreatureSize.Small) {
            if (
              creature.isFourOrMoreLegged &&
              creature.diet?.id === DietType.Carnivore
            ) {
              if (roll < 2) {
                result = 'Otter';
              } else if (roll < 4) {
                result = 'Fox';
              } else if (roll < 6) {
                result = 'Wolverine';
              } else if (roll < 8) {
                result = 'Badger';
              } else if (roll < 12) {
                result = 'Mink';
              } else if (roll < 14) {
                result = 'Weasel';
              } else if (roll < 16) {
                result = 'Raccoon';
              } else {
                result = 'Cat';
              }
            } else if (creature.isFourOrMoreLegged) {
              if (roll < 2) {
                result = 'Possom';
              } else if (roll < 4) {
                result = 'Armadillo';
              } else if (roll < 4) {
                result = 'Hare';
              } else if (roll < 6) {
                result = 'Mole';
              } else if (roll < 12) {
                result = 'Beaver';
              } else if (roll < 14) {
                result = 'Squirrel';
              } else if (roll < 16) {
                result = 'Lemur';
              } else {
                result = 'Rodent';
              }
            } else if (creature.isLegged) {
              if (roll < 14) {
                result = 'Simian';
              } else if (roll < 18) {
                result = 'Pangolin';
              } else if (roll === 19) {
                result = 'Sloth';
              } else {
                result = 'Kangaroo';
              }
            }
          } else if (creature.size?.id === CreatureSize.Average) {
            if (creature.isFlippered) {
              if (
                creature.habitat?.id === Habitat.Ocean ||
                creature.habitat?.id === Habitat.River
              ) {
                result = 'Dolphin';
              } else {
                result = 'Seal';
              }
            } else if (
              creature.isFourOrMoreLegged &&
              creature.diet?.id === DietType.Carnivore
            ) {
              if (roll < 8) {
                result = 'Wolf';
              } else if (roll < 12) {
                result = 'Hyena';
              } else if (roll < 15) {
                result = 'Coyote';
              } else if (roll < 17) {
                result = 'Pig';
              } else {
                result = 'Panther';
              }
            } else if (creature.isFourOrMoreLegged) {
              if (roll < 7) {
                result = 'Gazelle';
              } else if (roll < 10) {
                result = 'Tapir';
              } else if (roll < 14) {
                result = 'Sheep';
              } else if (roll < 17) {
                result = 'Goat';
              } else {
                result = 'Deer';
              }
            } else if (creature.isLegged) {
              result = 'Simian';
            }
          } else if (creature.size?.id === CreatureSize.Large) {
            if (creature.isFlippered) {
              if (
                creature.habitat?.id === Habitat.Ocean ||
                creature.habitat?.id === Habitat.River
              ) {
                result = 'Shark';
              } else if (roll < 8) {
                result = 'Sealion';
              } else {
                result = 'Walrus';
              }
            } else if (
              creature.isFourOrMoreLegged &&
              creature.diet?.id === DietType.Carnivore
            ) {
              if (roll < 8) {
                result = 'Bear';
              } else if (roll < 12) {
                result = 'Boar';
              } else if (roll < 16) {
                result = 'Tiger';
              } else {
                result = 'Lion';
              }
            } else if (creature.isFourOrMoreLegged) {
              if (roll < 4) {
                result = 'Llama';
              } else if (roll < 8) {
                result = 'Horse';
              } else if (roll < 12) {
                result = 'Zebra';
              } else if (roll < 14) {
                result = 'Elk';
              } else if (roll < 16) {
                result = 'Bison';
              } else if (roll < 18) {
                result = 'Moose';
              } else {
                result = 'Giraffe';
              }
            } else if (creature.isLegged) {
              result = 'Ape';
            }
          } else if (creature.size?.id === CreatureSize.Huge) {
            if (
              creature.isFlippered ||
              creature.habitat?.id === Habitat.Ocean ||
              creature.habitat?.id === Habitat.River
            ) {
              result = 'Whale';
            } else if (
              creature.isFourOrMoreLegged &&
              creature.diet?.id === DietType.Carnivore
            ) {
              result = 'Bear';
            } else if (creature.isFourOrMoreLegged) {
              if (roll < 4) {
                result = 'Mammoth';
              } else if (roll < 8) {
                result = 'Elephant';
              } else if (roll < 12) {
                result = 'Rhinoceros';
              } else if (roll < 16) {
                result = 'Land Whale';
              } else {
                result = 'Hippopotamus';
              }
            } else if (creature.isLegged) {
              result = 'Ape';
            }
          }
        }
        break;
      case CreatureType.Fish:
        {
          const roll = D20.roll();
          if (roll < 12) {
            result =
              creature.diet?.id === DietType.Carnivore ? 'Piranha' : 'Fish';
          } else if (roll < 16) {
            result = 'Eel';
          } else if (roll < 18) {
            result = 'Ray';
          } else {
            result = 'Seahorse';
          }
        }
        break;
      case CreatureType.Invertebrate:
        {
          const roll = D20.roll();
          if (creature.isSlithering) {
            result = 'Worm';
          } else if (
            creature.habitat?.id === Habitat.Ocean ||
            creature.habitat?.id === Habitat.River
          ) {
            if (creature.isTentacled && roll < 15) {
              result = 'Squid';
            } else if (creature.isTentacled) {
              result = 'Jellyfish';
            } else if (roll < 2) {
              result = 'Sponge';
            } else if (roll < 4) {
              result = 'Sea Cucumber';
            } else if (roll < 8) {
              result = 'Crab';
            } else if (roll < 12) {
              result = 'Lobster';
            } else if (roll < 14) {
              result = 'Starfish';
            } else if (roll < 16) {
              result = 'Urchin';
            } else {
              result = 'Trilobite';
            }
          } else if (creature.isFourOrMoreLegged) {
            if (creature.size?.id === CreatureSize.Swarm && roll < 10) {
              result = 'Ant';
            } else if (creature.size?.id === CreatureSize.Swarm && roll < 14) {
              result = 'Fly';
            } else if (creature.size?.id === CreatureSize.Swarm && roll < 18) {
              result = 'Wasp';
            } else if (roll < 4 || creature.hasTalent(TALENT_NAME_WEB)) {
              result = 'Spider';
            } else if (roll < 8) {
              result = 'Roach';
            } else if (roll < 12) {
              result = 'Scarab';
            } else if (roll < 16) {
              result = 'Scorpion';
            } else {
              result = 'Beetle';
            }
          } else if (creature.isLegged) {
            result = 'Mantis';
          } else if (roll < 10) {
            result = 'Crawling Carpet';
          } else {
            result = 'Gasbag';
          }
        }
        break;
      case CreatureType.Amphibian:
        {
          const roll = D20.roll();

          if (creature.isSlithering) {
            if (roll < 10) {
              result = 'Worm';
            } else {
              result = 'Caecilian';
            }
          } else if (
            creature.size?.id === CreatureSize.Small ||
            creature.size?.id === CreatureSize.Average
          ) {
            if (roll < 4) {
              result = 'Frog';
            } else if (roll < 8) {
              result = 'Newt';
            } else if (roll < 16) {
              result = 'Salamander';
            } else {
              result = 'Toad';
            }
          } else {
            result = 'Frog';
          }
        }
        break;
      case CreatureType.Plant:
        {
          const roll = D20.roll();
          if (
            creature.habitat?.id === Habitat.Ocean ||
            creature.habitat?.id === Habitat.River
          ) {
            if (roll < 8) {
              result = 'Algae';
            } else if (roll < 12) {
              result = 'Seaweed';
            } else {
              result = 'Kelp';
            }
          } else if (
            creature.size?.id === CreatureSize.Small ||
            creature.size?.id === CreatureSize.Average
          ) {
            if (roll < 2) {
              result = 'Fungus';
            } else if (roll < 4) {
              result = 'Grass';
            } else if (roll < 6) {
              result = 'Moss';
            } else if (roll < 8) {
              result = 'Wheat';
            } else if (roll < 12) {
              result = 'Vines';
            } else if (roll < 14) {
              result = 'Flower';
            } else if (roll < 16) {
              result = 'Lichen';
            } else if (roll < 18) {
              result = 'Tuber';
            } else {
              result = 'Reeds';
            }
          } else {
            result = 'Tree';
          }
        }
        break;
      case CreatureType.Reptile:
        {
          const roll = D20.roll();
          if (creature.isSlithering) {
            result = 'Snake';
          } else if (creature.size?.id === CreatureSize.Gigantic) {
            if (creature.hasTalent('Flight') && roll < 10) {
              result = 'Pterodactyl';
            } else if (creature.hasTalent('Flight')) {
              result = 'Dragon';
            } else if (roll < 4) {
              result = 'Ankylosaurus';
            } else if (roll < 8) {
              result = 'Brachiosaurus';
            } else if (roll < 12) {
              result = 'Tyrannosaurus';
            } else if (roll < 14) {
              result = 'Stegosaurus';
            } else {
              result = 'Dinosaur';
            }
          } else if (creature.hasTalent('Flight')) {
            result = 'Pterodactyl';
          } else if (roll < 5) {
            result = creature.isFlippered ? 'Turtle' : 'Tortoise';
          } else if (roll < 10) {
            result = 'Gator';
          } else if (
            roll < 15 ||
            creature.size?.id === CreatureSize.Small ||
            creature.size?.id === CreatureSize.Swarm
          ) {
            result = 'Lizard';
          } else {
            result = 'Velociraptor';
          }
        }
        break;
      default:
        break;
    }
  }
  return result;
};
