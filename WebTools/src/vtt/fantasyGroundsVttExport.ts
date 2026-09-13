import type { Character } from '../common/character';
import convert from 'xml-js';
import { Attribute, AttributesHelper } from '../helpers/attributes';
import { DepartmentsHelper, Department } from '../helpers/department';
import { CareersHelper } from '../helpers/careers';
import { CharacterType } from '../common/characterType';
import { Rank, RanksHelper } from '../helpers/ranks';
import { CharacterSerializer } from '../common/characterSerializer';
import { TracksHelper } from '../helpers/tracks';
import { CareerEventsHelper } from '../helpers/careerEvents';
import type { WeaponQuality } from '../helpers/weapons';
import { InjuryType, WeaponType } from '../helpers/weapons';
import { EarlyOutlook } from '../helpers/upbringings';
import { Stereotype } from '../common/construct';
import { NpcType } from '../npc/model/npcType';
import { textTokenizer } from '../exportpdf/textTokenizer';
import {
  attributeName,
  departmentName,
  resolveTalentDescription,
  splitToParagraphs,
} from './vttShared';

interface XmlElement {
  type?: string;
  name?: string;
  attributes?: { [key: string]: string | number };
  elements?: XmlElement[];
}

export class FantasyGroupsVttExporter {
  private static singleton: FantasyGroupsVttExporter;

  static get instance() {
    if (FantasyGroupsVttExporter.singleton == null) {
      FantasyGroupsVttExporter.singleton = new FantasyGroupsVttExporter();
    }
    return FantasyGroupsVttExporter.singleton;
  }

  private exportNpc(character: Character) {
    const characterNode = {
      type: 'element',
      name: 'npc',
      elements: [
        {
          name: 'attacks',
          type: 'element',
          elements: [...this.convertNpcWeapons(character)],
        },
        this.convertAttributes(character),
        this.convertCharacterDescription(character),
        this.convertDisciplines(character),
        {
          name: 'focuses',
          attributes: {
            type: 'string',
          },
          type: 'element',
          elements: [
            {
              type: 'text',
              text: character.focuses.join(', '),
            },
          ],
        },
        {
          name: 'hptotal',
          attributes: {
            type: 'number',
          },
          type: 'element',
          elements: [
            {
              type: 'text',
              text: character.stress,
            },
          ],
        },
        {
          name: 'name',
          attributes: {
            type: 'string',
          },
          type: 'element',
          elements: [
            {
              type: 'text',
              text: character.name ?? '',
            },
          ],
        },
        {
          name: 'resistance',
          type: 'element',
          elements: [
            {
              attributes: {
                type: 'number',
              },
              type: 'element',
              name: 'total',
              elements: [
                {
                  type: 'text',
                  text: character.resistance,
                },
              ],
            },
          ],
        },
        this.convertNpcTalents(character),
        {
          name: 'token',
          attributes: {
            type: 'token',
          },
          type: 'element',
        },
        {
          name: 'traits',
          type: 'element',
          attributes: {
            type: 'string',
          },
          elements: [
            {
              type: 'text',
              text: character.getAllTraits() ?? '',
            },
          ],
        },
        {
          name: 'type',
          type: 'element',
          attributes: {
            type: 'string',
          },
          elements: [
            {
              type: 'text',
              text: this.convertNpcType(character),
            },
          ],
        },
        {
          name: 'values',
          attributes: {
            type: 'string',
          },
          type: 'element',
          elements: [
            {
              type: 'text',
              text: character.values.join(', '),
            },
          ],
        },
      ],
    };
    return this.nodesToXml(characterNode);
  }

  exportCharacter(character: Character) {
    if (character.stereotype === Stereotype.Npc) {
      return this.exportNpc(character);
    } else {
      return this.exportMainCharacter(character);
    }
  }

  private exportMainCharacter(character: Character) {
    const characterNode = {
      type: 'element',
      name: 'character',
      elements: [
        this.convertAttributes(character),
        {
          name: 'determination',
          attributes: {
            type: 'number',
          },
          type: 'element',
          elements: [
            {
              type: 'text',
              text: 0,
            },
          ],
        },
        this.convertCareer(character),
        this.convertCareerEvents(character),
        this.convertCareerLink(character),
        this.convertDisciplines(character),
        this.convertEnvironment(character),
        {
          name: 'environmentlink',
          type: 'element',
          attributes: {
            type: 'windowreference',
          },
          elements: [
            {
              type: 'element',
              name: 'class',
            },
            {
              type: 'element',
              name: 'recordname',
            },
          ],
        },
        {
          name: 'focuslist',
          type: 'element',
          elements: this.convertFocuses(character),
        },
        {
          name: 'hp',
          type: 'element',
          elements: [
            {
              attributes: {
                type: 'number',
              },
              type: 'element',
              name: 'misc',
              elements: [
                {
                  type: 'text',
                  text: 0,
                },
              ],
            },
            {
              attributes: {
                type: 'number',
              },
              type: 'element',
              name: 'total',
              elements: [
                {
                  type: 'text',
                  text: character.stress,
                },
              ],
            },
            {
              name: 'wounds',
              attributes: {
                type: 'number',
              },
              type: 'element',
              elements: [
                {
                  type: 'text',
                  text: 0,
                },
              ],
            },
          ],
        },
        {
          name: 'inventorylist',
          type: 'element',
          elements: this.convertWeaponsAndEquipment(character),
        },
        {
          name: 'milestones',
          type: 'element',
          elements: [
            {
              name: 'arc',
              attributes: {
                type: 'number',
              },
              type: 'element',
              elements: [
                {
                  type: 'text',
                  text: 0,
                },
              ],
            },
            {
              name: 'spotlight',
              attributes: {
                type: 'number',
              },
              type: 'element',
              elements: [
                {
                  type: 'text',
                  text: 0,
                },
              ],
            },
            {
              name: 'standard',
              attributes: {
                type: 'number',
              },
              type: 'element',
              elements: [
                {
                  type: 'text',
                  text: 0,
                },
              ],
            },
          ],
        },
        {
          name: 'name',
          attributes: {
            type: 'string',
          },
          type: 'element',
          elements: [
            {
              type: 'text',
              text: character.name ?? '',
            },
          ],
        },
        this.convertNotes(character),
        {
          name: 'primary_specieslink',
          type: 'element',
          attributes: {
            type: 'windowreference',
          },
          elements: [
            {
              type: 'element',
              name: 'class',
            },
            {
              type: 'element',
              name: 'recordname',
            },
          ],
        },
        this.convertRank(character),
        {
          name: 'reputation',
          attributes: {
            type: 'number',
          },
          type: 'element',
          elements: [
            {
              type: 'text',
              text: character.reputation,
            },
          ],
        },
        {
          name: 'resistance',
          type: 'element',
          elements: [
            {
              attributes: {
                type: 'number',
              },
              type: 'element',
              name: 'misc',
              elements: [
                {
                  type: 'text',
                  text: 0,
                },
              ],
            },
            {
              attributes: {
                type: 'number',
              },
              type: 'element',
              name: 'total',
              elements: [
                {
                  type: 'text',
                  text: character.resistance,
                },
              ],
            },
          ],
        },
        {
          name: 'role',
          attributes: {
            type: 'string',
          },
          type: 'element',
          elements: [
            {
              type: 'text',
              text: character.assignmentWithoutShip,
            },
          ],
        },
        {
          name: 'secondary_specieslink',
          type: 'element',
          attributes: {
            type: 'windowreference',
          },
          elements: [
            {
              type: 'element',
              name: 'class',
            },
            {
              type: 'element',
              name: 'recordname',
            },
          ],
        },
        {
          name: 'species',
          attributes: {
            type: 'string',
          },
          type: 'element',
          elements: [
            {
              type: 'text',
              text: character.speciesName,
            },
          ],
        },
        {
          name: 'supportchars',
          type: 'element',
        },
        this.convertTalents(character),
        {
          name: 'token',
          attributes: {
            type: 'token',
          },
          type: 'element',
        },
        this.convertTraining(character),
        {
          name: 'traininglink',
          type: 'element',
          attributes: {
            type: 'windowreference',
          },
          elements: [
            {
              type: 'element',
              name: 'class',
            },
            {
              type: 'element',
              name: 'recordname',
            },
          ],
        },
        this.convertUpbringing(character),
        this.convertUpbringingLink(character),
      ],
    };

    return this.nodesToXml(characterNode);
  }

  nodesToXml(characterNode: XmlElement) {
    characterNode.elements = characterNode.elements.filter((e) => e != null);

    const result = {
      declaration: { attributes: { version: '1.0', encoding: 'utf-8' } },
      elements: [
        {
          attributes: {
            version: '4.3',
            dataversion: '20230221',
            release: '2|CoreRPG:6',
          },
          type: 'element',
          name: 'root',
          elements: [characterNode],
        },
      ],
    };

    return convert.js2xml(result, { spaces: 2 });
  }

  convertCharacterDescription(character: Character) {
    if (character.description?.length) {
      const paragraphs = splitToParagraphs(character.description).map((s) => {
        return {
          name: 'p',
          type: 'element',
          elements: [
            {
              type: 'text',
              text: s,
            },
          ],
        };
      });
      return {
        name: 'description',
        type: 'element',
        attributes: {
          type: 'formattedtext',
        },
        elements: paragraphs,
      };
    } else {
      return undefined;
    }
  }

  convertUpbringingLink(character: Character) {
    const implementedUpbringings = [
      EarlyOutlook.MilitaryOrExploration,
      EarlyOutlook.BusinessOrTrade,
      EarlyOutlook.AgricultureOrRural,
      EarlyOutlook.ScienceAndTechnology,
      EarlyOutlook.ArtisticAndCreative,
      EarlyOutlook.DiplomacyAndPolitics,
    ];
    if (
      character.upbringingStep &&
      implementedUpbringings.indexOf(character.upbringingStep.upbringing.id) >=
        0
    ) {
      return {
        name: 'upbringinglink',
        type: 'element',
        attributes: {
          type: 'windowreference',
        },
        elements: [
          {
            type: 'element',
            name: 'class',
            elements: [{ type: 'text', text: 'upbringing' }],
          },
          {
            type: 'element',
            name: 'recordname',
            elements: [
              {
                type: 'text',
                text:
                  'reference.upbringing.' +
                  this.createNumberedId(
                    character.upbringingStep.upbringing.id + 1,
                  ) +
                  '@Star Trek Adventures Core Rulebook',
              },
            ],
          },
        ],
      };
    } else {
      return {
        name: 'upbringinglink',
        type: 'element',
        attributes: {
          type: 'windowreference',
        },
        elements: [
          {
            type: 'element',
            name: 'class',
          },
          {
            type: 'element',
            name: 'recordname',
          },
        ],
      };
    }
  }

  convertNpcType(character: Character) {
    if (character.npcGenerationStep?.type == null) {
      return '';
    } else {
      switch (character.npcGenerationStep.type) {
        case NpcType.Minor:
          return 'Minor Character';
        case NpcType.Notable:
          return 'Notable Character';
        case NpcType.Major:
          return 'Major Character';
        default:
          break;
      }
    }
  }

  convertFocuses(character: Character) {
    return (
      character.focuses?.map((f, i) => {
        return {
          type: 'element',
          name: this.createNumberedId(i + 1),
          elements: [
            {
              name: 'name',
              type: 'element',
              attributes: {
                type: 'string',
              },
              elements: [
                {
                  type: 'text',
                  text: f,
                },
              ],
            },
          ],
        };
      }) ?? []
    );
  }

  convertWeaponsAndEquipment(character: Character) {
    const equipment = this.convertEquipment(character);
    const weapons = this.convertWeapons(character, equipment.length);
    return equipment.concat(weapons);
  }

  convertNpcWeapons(character: Character, start: number = 0) {
    const result = [];
    character.determineWeapons().forEach((w, i) => {
      const weapon = {
        name: this.createNumberedId(start + i + 1),
        type: 'element',
        elements: [
          {
            name: 'area',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'damagerating',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: w.dice,
              },
            ],
          },
          {
            name: 'intense',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'name',
            attributes: {
              type: 'string',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: w.name,
              },
            ],
          },
          w.injuryType === InjuryType.Stun
            ? {
                name: 'lethality',
                attributes: {
                  type: 'string',
                },
                type: 'element',
                elements: [
                  {
                    type: 'text',
                    text: 'nonlethal',
                  },
                ],
              }
            : null,
          {
            name: 'piercing',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'tn',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text:
                  w.type === WeaponType.ENERGY
                    ? character.attributes[Attribute.Control] +
                      character.departments[Department.Security]
                    : character.attributes[Attribute.Daring] +
                      character.departments[Department.Security],
              },
            ],
          },
          w.type === WeaponType.ENERGY
            ? {
                name: 'type',
                attributes: {
                  type: 'string',
                },
                type: 'element',
                elements: [
                  {
                    type: 'text',
                    text: 'ranged',
                  },
                ],
              }
            : null,
          {
            name: 'vicious',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
        ],
      };
      weapon.elements = weapon.elements.filter((e) => e != null);
      result.push(weapon);
    });

    return result;
  }

  convertWeapons(character: Character, start: number = 0) {
    const result = [];
    character.determineWeapons().forEach((w, i) => {
      const weapon = {
        name: this.createNumberedId(start + i + 1),
        type: 'element',
        elements: [
          {
            name: 'area',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'category',
            attributes: {
              type: 'string',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 'Weapon',
              },
            ],
          },
          {
            name: 'cost',
            attributes: {
              type: 'string',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 'Standard Issue',
              },
            ],
          },
          {
            name: 'count',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 1,
              },
            ],
          },
          w.effects?.length
            ? {
                name: 'damageeffects',
                attributes: {
                  type: 'string',
                },
                type: 'element',
                elements: [
                  {
                    type: 'text',
                    text: w.effects.map((q) => q.description).join(', '),
                  },
                ],
              }
            : null,
          {
            name: 'damagerating',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: w.dice,
              },
            ],
          },
          this.convertWeaponAttributes('dmgeffect', w.effects),
          {
            name: 'intense',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'locked',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'name',
            attributes: {
              type: 'string',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: w.name,
              },
            ],
          },
          this.convertToFormattedText('notes', w.name, null),
          {
            name: 'piercing',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          w.qualities?.length
            ? {
                name: 'qualities',
                attributes: {
                  type: 'string',
                },
                type: 'element',
                elements: [
                  {
                    type: 'text',
                    text: w.qualities.map((q) => q.description).join(', '),
                  },
                ],
              }
            : null,
          w.hands
            ? {
                name: 'size',
                attributes: {
                  type: 'string',
                },
                type: 'element',
                elements: [
                  {
                    type: 'text',
                    text: w.hands + 'h',
                  },
                ],
              }
            : null,
          w.type === WeaponType.ENERGY
            ? {
                name: 'type',
                attributes: {
                  type: 'string',
                },
                type: 'element',
                elements: [
                  {
                    type: 'text',
                    text: 'ranged',
                  },
                ],
              }
            : null,
          {
            name: 'vicious',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          this.convertWeaponAttributes('weapquality', w.qualities),
        ],
      };
      weapon.elements = weapon.elements.filter((e) => e != null);
      result.push(weapon);
    });

    return result;
  }

  convertWeaponAttributes(tagName: string, attributes: WeaponQuality[]) {
    let index = 1;
    const result = {
      name: tagName,
      type: 'element',
      elements: [],
    };

    attributes.forEach((q) => {
      result.elements.push({
        name: this.createNumberedId(index++),
        type: 'element',
        elements: [
          {
            name: 'name',
            type: 'element',
            attributes: {
              type: 'string',
            },
            elements: [
              {
                type: 'text',
                text: q.qualityName,
              },
            ],
          },
          {
            name: 'rank',
            type: 'element',
            attributes: {
              type: 'number',
            },
            elements: [
              {
                type: 'text',
                text: q.rank ?? 1,
              },
            ],
          },
        ],
      });
    });

    return result;
  }

  convertDisciplines(character: Character) {
    const result = {
      name: 'disciplines',
      type: 'element',
      elements: [],
    };

    DepartmentsHelper.instance.getDepartments().forEach((d) => {
      const name = departmentName(d);
      const discipline = {
        name: name,
        type: 'element',
        elements: [
          {
            name: 'careerevent',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'edit',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: character.departments[d],
              },
            ],
          },
          {
            name: 'environment',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'misc',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'species',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'total',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: character.departments[d],
              },
            ],
          },
          {
            name: 'training',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'upbringing',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
        ],
      };
      result.elements.push(discipline);
    });

    return result;
  }

  convertCareer(character: Character) {
    const career =
      character.careerStep?.career != null
        ? CareersHelper.instance.getCareer(
            character.careerStep.career,
            character,
          )
        : null;
    //<career type="string">Experienced Officer</career>
    if (career) {
      return {
        name: 'career',
        type: 'element',
        attributes: {
          type: 'string',
        },
        elements: [
          {
            type: 'text',
            text: career.localizedName,
          },
        ],
      };
    } else {
      return null;
    }
  }

  convertUpbringing(character: Character) {
    const upbringing = character.upbringingStep?.upbringing;
    if (upbringing) {
      return {
        name: 'upbringing',
        type: 'element',
        attributes: {
          type: 'string',
        },
        elements: [
          {
            type: 'text',
            text: upbringing.name,
          },
        ],
      };
    } else {
      return null;
    }
  }

  convertTraining(character: Character) {
    const training = character.educationStep?.track
      ? TracksHelper.instance.getTrack(
          character.educationStep?.track,
          character.type,
          character.version,
        )
      : null;
    if (training) {
      return {
        name: 'training',
        type: 'element',
        attributes: {
          type: 'string',
        },
        elements: [
          {
            type: 'text',
            text: training.name,
          },
        ],
      };
    } else {
      return null;
    }
  }

  convertEnvironment(character: Character) {
    const environment = character.environmentStep
      ? CharacterSerializer.serializeEnvironment(
          character.environmentStep.environment,
          character.environmentStep.otherSpecies,
          character,
        )
      : null;
    if (environment) {
      return {
        name: 'environment',
        type: 'element',
        attributes: {
          type: 'string',
        },
        elements: [
          {
            type: 'text',
            text: environment,
          },
        ],
      };
    } else {
      return null;
    }
  }

  convertRank(character: Character) {
    if (character.rank != null && character.type === CharacterType.Starfleet) {
      const rank = RanksHelper.instance().getRankByName(character.rank.name);
      if (rank) {
        let rankNumber = undefined;
        switch (rank.id) {
          case Rank.Ensign:
            rankNumber = 2;
            break;
          case Rank.LieutenantJG:
            rankNumber = 3;
            break;
          case Rank.Lieutenant:
            rankNumber = 4;
            break;
          case Rank.LtCommander:
            rankNumber = 5;
            break;
          case Rank.Commander:
            rankNumber = 6;
            break;
          case Rank.Captain:
          case Rank.FleetCaptain:
            rankNumber = 7;
            break;
          case Rank.Commodore:
          case Rank.RearAdmiralLower:
            rankNumber = 8;
            break;
          case Rank.RearAdmiralUpper:
          case Rank.RearAdmiral:
          case Rank.ViceAdmiral:
          case Rank.Admiral:
            rankNumber = 9;
            break;
          default:
        }

        if (rankNumber != null) {
          return {
            name: 'rank',
            type: 'element',
            attributes: {
              type: 'string',
            },
            elements: [
              {
                type: 'text',
                text: rankNumber,
              },
            ],
          };
        }
      }
    }
    return null;
  }

  convertAttributes(character: Character) {
    const result = {
      name: 'attributes',
      type: 'element',
      elements: [],
    };

    AttributesHelper.getAllAttributes().forEach((a) => {
      const name = attributeName(a);
      const attribute = {
        name: name,
        type: 'element',
        elements: [
          {
            name: 'careerevent',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'edit',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: character.attributes[a],
              },
            ],
          },
          {
            name: 'environment',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'misc',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'species',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'total',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: character.attributes[a],
              },
            ],
          },
          {
            name: 'training',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'upbringing',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
        ],
      };
      result.elements.push(attribute);
    });

    return result;
  }

  convertCareerLink(character: Character) {
    if (
      character.careerStep?.career != null &&
      character.type === CharacterType.Starfleet
    ) {
      return {
        name: 'careerlink',
        type: 'element',
        attributes: {
          type: 'windowreference',
        },
        elements: [
          {
            type: 'element',
            name: 'class',
            elements: [
              {
                type: 'text',
                text: 'career',
              },
            ],
          },
          {
            type: 'element',
            name: 'recordname',
            elements: [
              {
                type: 'text',
                text:
                  'reference.career.' +
                  this.createNumberedId(character.careerStep.career + 1) +
                  '@Star Trek Adventures Core Rulebook',
              },
            ],
          },
        ],
      };
    } else {
      return {
        name: 'careerlink',
        type: 'element',
        attributes: {
          type: 'windowreference',
        },
        elements: [
          {
            type: 'element',
            name: 'class',
          },
          {
            type: 'element',
            name: 'recordname',
          },
        ],
      };
    }
  }

  createNumberedId(n: number) {
    return 'id-' + ('0000' + n).slice(-4);
  }

  convertNotes(character: Character) {
    let index = 1;
    const result = {
      name: 'notes',
      type: 'element',
      elements: [],
    };

    if (character.traits) {
      result.elements.push({
        name: this.createNumberedId(index++),
        type: 'element',
        elements: [
          {
            name: 'name',
            type: 'element',
            attributes: {
              type: 'string',
            },
            elements: [
              {
                type: 'text',
                text: 'Traits: ' + character.traits,
              },
            ],
          },
          {
            name: 'text',
            type: 'element',
            attributes: {
              type: 'formattedtext',
            },
            elements: [
              {
                name: 'p',
                type: 'element',
              },
            ],
          },
        ],
      });
    }

    if (character.pronouns) {
      result.elements.push({
        name: this.createNumberedId(index++),
        type: 'element',
        elements: [
          {
            name: 'name',
            type: 'element',
            attributes: {
              type: 'string',
            },
            elements: [
              {
                type: 'text',
                text: 'Pronouns: ' + character.pronouns,
              },
            ],
          },
          {
            name: 'text',
            type: 'element',
            attributes: {
              type: 'formattedtext',
            },
            elements: [
              {
                name: 'p',
                type: 'element',
              },
            ],
          },
        ],
      });
    }

    character.values?.forEach((v) => {
      result.elements.push({
        name: this.createNumberedId(index++),
        type: 'element',
        elements: [
          {
            name: 'name',
            type: 'element',
            attributes: {
              type: 'string',
            },
            elements: [
              {
                type: 'text',
                text: 'Value: ' + v,
              },
            ],
          },
          {
            name: 'text',
            type: 'element',
            attributes: {
              type: 'formattedtext',
            },
            elements: [
              {
                name: 'p',
                type: 'element',
              },
            ],
          },
        ],
      });
    });

    if (character.rank != null && this.convertRank(character) == null) {
      result.elements.push({
        name: this.createNumberedId(index++),
        type: 'element',
        elements: [
          {
            name: 'name',
            type: 'element',
            attributes: {
              type: 'string',
            },
            elements: [
              {
                type: 'text',
                text: 'Rank: ' + character.rank,
              },
            ],
          },
          {
            name: 'text',
            type: 'element',
            attributes: {
              type: 'formattedtext',
            },
            elements: [
              {
                name: 'p',
                type: 'element',
              },
            ],
          },
        ],
      });
    }

    return result;
  }

  convertCareerEvents(character: Character) {
    if (character.careerEvents?.length) {
      const result = {
        name: 'careerevent',
        type: 'element',
        elements: [],
      };

      let index = 1;
      character.careerEvents.forEach((e) => {
        const event = CareerEventsHelper.getCareerEvent(
          e.id,
          character.type,
          character.version,
        );
        if (event) {
          const key = this.createNumberedId(index++);
          result.elements.push({
            name: key,
            type: 'element',
            elements: [
              {
                name: 'attributes',
                type: 'element',
                elements: [
                  {
                    name: this.createNumberedId(1),
                    type: 'element',
                    elements: [
                      {
                        name: 'name',
                        type: 'element',
                        attributes: {
                          type: 'string',
                        },
                        elements: [
                          {
                            type: 'text',
                            text:
                              event.attributes.length === 1
                                ? attributeName(event.attributes[0])
                                : 'any',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              this.convertToFormattedText(
                'desc',
                null,
                event.localizedDescription,
              ),
              {
                name: 'disciplines',
                type: 'element',
                elements: [
                  {
                    name: this.createNumberedId(1),
                    type: 'element',
                    elements: [
                      {
                        name: 'name',
                        type: 'element',
                        attributes: {
                          type: 'string',
                        },
                        elements: [
                          {
                            type: 'text',
                            text:
                              event.disciplines.length === 1
                                ? departmentName(event.disciplines[0])
                                : 'any',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                name: 'focus',
                type: 'element',
                attributes: {
                  type: 'number',
                },
                elements: [
                  {
                    type: 'text',
                    text: '1',
                  },
                ],
              },
              {
                name: 'link',
                type: 'element',
                attributes: {
                  type: 'windowreference',
                },
                elements: [
                  {
                    name: 'class',
                    type: 'element',
                    elements: [
                      {
                        type: 'text',
                        text: 'careerevent',
                      },
                    ],
                  },
                  {
                    name: 'recordname',
                    type: 'element',
                    elements: [
                      {
                        type: 'text',
                        text: '....careerevent.' + key,
                      },
                    ],
                  },
                ],
              },
              {
                name: 'locked',
                type: 'element',
                attributes: {
                  type: 'number',
                },
                elements: [
                  {
                    type: 'text',
                    text: '0',
                  },
                ],
              },
              {
                name: 'name',
                type: 'element',
                attributes: {
                  type: 'string',
                },
                elements: [
                  {
                    type: 'text',
                    text: event.localizedName,
                  },
                ],
              },
              {
                name: 'trait',
                type: 'element',
                attributes: {
                  type: 'number',
                },
                elements: [
                  {
                    type: 'text',
                    text: event.localizedTraitDescription ? '1' : '0',
                  },
                ],
              },
              {
                name: 'value',
                type: 'element',
                attributes: {
                  type: 'number',
                },
                elements: [
                  {
                    type: 'text',
                    text: '0',
                  },
                ],
              },
            ],
          });
        }
      });

      return result;
    } else {
      return null;
    }
  }

  convertEquipment(character: Character, start: number = 0) {
    const result = [];

    character.equipmentAndImplants?.forEach((e, i) => {
      result.push({
        name: this.createNumberedId(start + i + 1),
        type: 'element',
        elements: [
          {
            name: 'area',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'category',
            attributes: {
              type: 'string',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 'Equipment',
              },
            ],
          },
          {
            name: 'cost',
            attributes: {
              type: 'string',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: '',
              },
            ],
          },
          {
            name: 'count',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 1,
              },
            ],
          },
          {
            name: 'intense',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'locked',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'name',
            attributes: {
              type: 'string',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: e,
              },
            ],
          },
          this.convertToFormattedText('notes', e.name, null),
          {
            name: 'piercing',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
          {
            name: 'viscious',
            attributes: {
              type: 'number',
            },
            type: 'element',
            elements: [
              {
                type: 'text',
                text: 0,
              },
            ],
          },
        ],
      });
    });
    return result;
  }

  convertToFormattedText(tagName: string, header: string, paragraphs: string) {
    const result = {
      name: tagName,
      attributes: {
        type: 'formattedtext',
      },
      type: 'element',
      elements: [],
    };

    if (header) {
      result.elements.push({
        type: 'element',
        name: 'h',
        elements: [
          {
            type: 'text',
            text: header,
          },
        ],
      });
    }

    paragraphs?.split('\n')?.forEach((p) => {
      const tokens = textTokenizer(p);
      const parents = [
        {
          type: 'element',
          name: 'p',
          elements: [],
        },
      ];

      result.elements.push(parents[0]);
      tokens.forEach((t) => {
        if (t === '**') {
          if (parents.length && parents[parents.length - 1].name === 'b') {
            parents.pop();
          } else {
            const parent = parents[parents.length - 1];
            const element = {
              type: 'element',
              name: 'b',
              elements: [],
            };
            parent.elements.push(element);
            parents.push(element);
          }
        } else if (t === '_' || t === '*') {
          if (parents.length && parents[parents.length - 1].name === 'i') {
            parents.pop();
          } else {
            const parent = parents[parents.length - 1];
            const element = {
              type: 'element',
              name: 'i',
              elements: [],
            };
            parent.elements.push(element);
            parents.push(element);
          }
        } else {
          const parent = parents[parents.length - 1];
          parent.elements.push({
            type: 'text',
            text: t,
          });
        }
      });
    });

    return result;
  }

  convertNpcTalents(character: Character) {
    let index = 1;
    const result = {
      name: 'specialrules',
      type: 'element',
      elements: [],
    };

    character.rankedTalents.forEach((selectedTalent) => {
      const talent = selectedTalent.talentModel;
      if (talent) {
        let name = selectedTalent.displayName;
        if (talent.maxRank > 1) {
          name += ' [x' + character.getRankForTalent(talent.name) + ']';
        }

        result.elements.push({
          name: this.createNumberedId(index++),
          type: 'element',
          elements: [
            this.convertToFormattedText(
              'desc',
              null,
              resolveTalentDescription(selectedTalent, character.version, true),
            ),
            {
              name: 'name',
              type: 'element',
              attributes: {
                type: 'string',
              },
              elements: [
                {
                  type: 'text',
                  text: name,
                },
              ],
            },
          ],
        });
      }
    });
    return result;
  }

  convertTalents(character: Character) {
    let index = 1;
    const result = {
      name: 'talent',
      type: 'element',
      elements: [],
    };

    character.rankedTalents.forEach((s) => {
      const talent = s.talentModel;
      if (talent) {
        result.elements.push({
          name: this.createNumberedId(index++),
          type: 'element',
          elements: [
            this.convertToFormattedText(
              'desc',
              null,
              resolveTalentDescription(s, character.version, true),
            ),
            {
              name: 'locked',
              type: 'element',
              attributes: {
                type: 'number',
              },
              elements: [
                {
                  type: 'text',
                  text: '0',
                },
              ],
            },
            {
              name: 'multiple',
              type: 'element',
              attributes: {
                type: 'number',
              },
              elements: [
                {
                  type: 'text',
                  text:
                    talent.maxRank > 1
                      ? character.getRankForTalent(talent.name)
                      : 0,
                },
              ],
            },
            {
              name: 'name',
              type: 'element',
              attributes: {
                type: 'string',
              },
              elements: [
                {
                  type: 'text',
                  text: s.displayName,
                },
              ],
            },
            {
              name: 'requirement',
              type: 'element',
              attributes: {
                type: 'string',
              },
              elements: [
                {
                  type: 'text',
                  text: talent.requirement ?? 'None',
                },
              ],
            },
          ],
        });
      }
    });

    return result;
  }
}
