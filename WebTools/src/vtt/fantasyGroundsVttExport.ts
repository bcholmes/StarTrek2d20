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
  text?: string | number;
}

function xmlNumberNode(name: string, text: string | number): XmlElement {
  return {
    name,
    attributes: {
      type: 'number',
    },
    type: 'element',
    elements: [
      {
        type: 'text',
        text,
      },
    ],
  };
}

function xmlStringNode(name: string, text: string | number): XmlElement {
  return {
    name,
    attributes: {
      type: 'string',
    },
    type: 'element',
    elements: [
      {
        type: 'text',
        text,
      },
    ],
  };
}

export class FantasyGroundsVttExporter {
  private static singleton: FantasyGroundsVttExporter;

  static get instance() {
    if (FantasyGroundsVttExporter.singleton == null) {
      FantasyGroundsVttExporter.singleton = new FantasyGroundsVttExporter();
    }
    return FantasyGroundsVttExporter.singleton;
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
        xmlStringNode('focuses', character.focuses.join(', ')),
        xmlNumberNode('hptotal', character.stress),
        xmlStringNode('name', character.name ?? ''),
        {
          name: 'resistance',
          type: 'element',
          elements: [xmlNumberNode('total', character.resistance)],
        },
        this.convertNpcTalents(character),
        {
          name: 'token',
          attributes: {
            type: 'token',
          },
          type: 'element',
        },
        xmlStringNode('traits', character.getAllTraits() ?? ''),
        xmlStringNode('type', this.convertNpcType(character)),
        xmlStringNode('values', character.values.join(', ')),
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
        xmlNumberNode('determination', 0),
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
            xmlNumberNode('misc', 0),
            xmlNumberNode('total', character.stress),
            xmlNumberNode('wounds', 0),
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
            xmlNumberNode('arc', 0),
            xmlNumberNode('spotlight', 0),
            xmlNumberNode('standard', 0),
          ],
        },
        xmlStringNode('name', character.name ?? ''),
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
        xmlNumberNode('reputation', character.reputation),
        {
          name: 'resistance',
          type: 'element',
          elements: [
            xmlNumberNode('misc', 0),
            xmlNumberNode('total', character.resistance),
          ],
        },
        xmlStringNode('role', character.assignmentWithoutShip),
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
        xmlStringNode('species', character.speciesName),
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
          elements: [xmlStringNode('name', f)],
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
    return this.buildWeapons(character, start, false);
  }

  convertWeapons(character: Character, start: number = 0) {
    return this.buildWeapons(character, start, true);
  }

  private buildWeapons(character: Character, start: number, armory: boolean) {
    const result = [];
    character.determineWeapons().forEach((w, i) => {
      const elements = [xmlNumberNode('area', 0)];

      if (armory) {
        elements.push(xmlStringNode('category', 'Weapon'));
        elements.push(xmlStringNode('cost', 'Standard Issue'));
        elements.push(xmlNumberNode('count', 1));
        if (w.effects?.length) {
          elements.push(
            xmlStringNode(
              'damageeffects',
              w.effects.map((q) => q.description).join(', '),
            ),
          );
        }
      }

      elements.push(xmlNumberNode('damagerating', w.dice));

      if (armory) {
        elements.push(this.convertWeaponAttributes('dmgeffect', w.effects));
        elements.push(xmlNumberNode('intense', 0));
        elements.push(xmlNumberNode('locked', 0));
        elements.push(xmlStringNode('name', w.name));
        elements.push(this.convertToFormattedText('notes', w.name, null));
      } else {
        elements.push(xmlNumberNode('intense', 0));
        elements.push(xmlStringNode('name', w.name));
        if (w.injuryType === InjuryType.Stun) {
          elements.push(xmlStringNode('lethality', 'nonlethal'));
        }
      }

      elements.push(xmlNumberNode('piercing', 0));

      if (!armory) {
        elements.push(
          xmlNumberNode(
            'tn',
            w.type === WeaponType.ENERGY
              ? character.attributes[Attribute.Control] +
                  character.departments[Department.Security]
              : character.attributes[Attribute.Daring] +
                  character.departments[Department.Security],
          ),
        );
      }

      if (armory) {
        if (w.qualities?.length) {
          elements.push(
            xmlStringNode(
              'qualities',
              w.qualities.map((q) => q.description).join(', '),
            ),
          );
        }
        if (w.hands) {
          elements.push(xmlStringNode('size', w.hands + 'h'));
        }
      }

      if (w.type === WeaponType.ENERGY) {
        elements.push(xmlStringNode('type', 'ranged'));
      }

      elements.push(xmlNumberNode('vicious', 0));

      if (armory) {
        elements.push(this.convertWeaponAttributes('weapquality', w.qualities));
      }

      result.push({
        name: this.createNumberedId(start + i + 1),
        type: 'element',
        elements,
      });
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
          xmlStringNode('name', q.qualityName),
          xmlNumberNode('rank', q.rank ?? 1),
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
          xmlNumberNode('careerevent', 0),
          xmlNumberNode('edit', character.departments[d]),
          xmlNumberNode('environment', 0),
          xmlNumberNode('misc', 0),
          xmlNumberNode('species', 0),
          xmlNumberNode('total', character.departments[d]),
          xmlNumberNode('training', 0),
          xmlNumberNode('upbringing', 0),
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
      return xmlStringNode('career', career.localizedName);
    } else {
      return null;
    }
  }

  convertUpbringing(character: Character) {
    const upbringing = character.upbringingStep?.upbringing;
    if (upbringing) {
      return xmlStringNode('upbringing', upbringing.name);
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
      return xmlStringNode('training', training.name);
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
      return xmlStringNode('environment', environment);
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
          return xmlStringNode('rank', rankNumber);
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
          xmlNumberNode('careerevent', 0),
          xmlNumberNode('edit', character.attributes[a]),
          xmlNumberNode('environment', 0),
          xmlNumberNode('misc', 0),
          xmlNumberNode('species', 0),
          xmlNumberNode('total', character.attributes[a]),
          xmlNumberNode('training', 0),
          xmlNumberNode('upbringing', 0),
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
      result.elements.push(
        this.convertNote(index++, 'Traits: ' + character.traits),
      );
    }

    if (character.pronouns) {
      result.elements.push(
        this.convertNote(index++, 'Pronouns: ' + character.pronouns),
      );
    }

    character.values?.forEach((v) => {
      result.elements.push(this.convertNote(index++, 'Value: ' + v));
    });

    if (character.rank != null && this.convertRank(character) == null) {
      result.elements.push(
        this.convertNote(index++, 'Rank: ' + character.rank),
      );
    }

    return result;
  }

  convertNote(index: number, text: string) {
    return {
      name: this.createNumberedId(index),
      type: 'element',
      elements: [
        xmlStringNode('name', text),
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
    };
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
                      xmlStringNode(
                        'name',
                        event.attributes.length === 1
                          ? attributeName(event.attributes[0])
                          : 'any',
                      ),
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
                      xmlStringNode(
                        'name',
                        event.disciplines.length === 1
                          ? departmentName(event.disciplines[0])
                          : 'any',
                      ),
                    ],
                  },
                ],
              },
              xmlNumberNode('focus', '1'),
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
              xmlNumberNode('locked', '0'),
              xmlStringNode('name', event.localizedName),
              xmlNumberNode(
                'trait',
                event.localizedTraitDescription ? '1' : '0',
              ),
              xmlNumberNode('value', '0'),
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
          xmlNumberNode('area', 0),
          xmlStringNode('category', 'Equipment'),
          xmlStringNode('cost', ''),
          xmlNumberNode('count', 1),
          xmlNumberNode('intense', 0),
          xmlNumberNode('locked', 0),
          xmlStringNode('name', e as unknown as string),
          this.convertToFormattedText('notes', e.name, null),
          xmlNumberNode('piercing', 0),
          xmlNumberNode('viscious', 0),
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
        } else if (t === '<u>' || t === '</u>') {
          if (parents.length && parents[parents.length - 1].name === 'u') {
            parents.pop();
          } else {
            const parent = parents[parents.length - 1];
            const element = {
              type: 'element',
              name: 'u',
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
            xmlStringNode('name', name),
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
            xmlNumberNode('locked', '0'),
            xmlNumberNode(
              'multiple',
              talent.maxRank > 1 ? character.getRankForTalent(talent.name) : 0,
            ),
            xmlStringNode('name', s.displayName),
            xmlStringNode(
              'requirement',
              talent.requirement?.length ? talent.requirement : 'None',
            ),
          ],
        });
      }
    });

    return result;
  }
}
