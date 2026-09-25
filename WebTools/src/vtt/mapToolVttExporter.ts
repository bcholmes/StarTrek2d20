import { zipSync, strToU8 } from 'fflate';
import { Base64 } from 'js-base64';
import type { Character } from '../common/character';
import { CharacterSerializer } from '../common/characterSerializer';
import { CharacterTypeModel } from '../common/characterType';
import { Stereotype } from '../common/construct';
import type { SelectedTalent } from '../common/selectedTalent';
import type { Starship } from '../common/starship';
import { Attribute, AttributesHelper } from '../helpers/attributes';
import { CareerEventsHelper } from '../helpers/careerEvents';
import { CareersHelper } from '../helpers/careers';
import { Department, DepartmentsHelper } from '../helpers/department';
import { marshaller } from '../helpers/marshaller';
import { SpeciesHelper } from '../helpers/species';
import { Species } from '../helpers/speciesEnum';
import { allSystems, System } from '../helpers/systems';
import { TalentCategory } from '../helpers/talentCategory';
import { TracksHelper } from '../helpers/tracks';
import type { Weapon, WeaponQuality } from '../helpers/weapons';
import {
  InjuryType,
  Quality,
  WeaponRange,
  WeaponType,
} from '../helpers/weapons';
import { NpcType } from '../npc/model/npcType';
import { textTokenizer } from '../exportpdf/textTokenizer';
import { isKlingonWarriorType } from '../helpers/klingonWarrior';
import { markupToHtml } from './markupToHtml';
import { md5Hex } from './md5';
import {
  normalizeChallengeDice,
  resolveTalentDescription,
  splitToParagraphs,
} from './vttShared';

/*
 * Exports characters and starships as MapTool tokens (.rptok files).
 *
 * An .rptok is a zip archive:
 *   content.xml       the token (MapTool's net.rptools.maptool.model.Token, as XStream XML)
 *   properties.xml    the MapTool version the file was written for
 *   assets/<md5>      a small XML description of the token image
 *   assets/<md5>.png  the token image itself
 *   thumbnail, thumbnail_large   previews for MapTool's resource library
 *
 * Everything the builder knows goes into token properties. Simple values
 * (attributes, departments, Stress, Scale...) are plain properties that macros
 * can use directly; lists (values, focuses, traits, talents, weapons...) are JSON,
 * so a framework can read them with MapTool's json.* functions. Talents carry
 * their full description and requirement. The token's notes hold the same
 * information as a readable sheet, so a campaign without any framework can still
 * use the token.
 */

export const MAPTOOL_EXPORT_FORMAT = 'sta.bcholmes.org/maptool-export/1';

// The version written to properties.xml. MapTool warns when it opens a file made by a
// newer version, so this is an older release that already has every field written here.
const MAPTOOL_FILE_VERSION = '1.14.0';

const SHEET_URL = 'https://sta.bcholmes.org/view?s=';

export interface MapToolExportOptions {
  // The campaign token type (Edit > Campaign Properties > Token Properties) to use.
  characterPropertyType?: string;
  starshipPropertyType?: string;
}

export interface MapToolProperty {
  name: string;
  value: string;
}

export interface MapToolTokenData {
  name: string;
  kind: 'character' | 'starship';
  propertyType: string;
  tokenType: 'PC' | 'NPC';
  properties: MapToolProperty[];
  notes: string;
}

export interface MapToolTokenImage {
  png: Uint8Array;
  width: number;
  height: number;
  thumbnail?: Uint8Array;
  thumbnailLarge?: Uint8Array;
  shape?: 'CIRCLE' | 'SQUARE' | 'TOP_DOWN';
}

interface ExportedTalent {
  name: string;
  rank: number;
  category: string;
  requirement: string;
  description: string;
}

class PropertyList {
  readonly items: MapToolProperty[] = [];

  add(name: string, value: string | number | boolean | undefined | null) {
    this.items.push({
      name,
      value: value == null ? '' : '' + value,
    });
    return this;
  }

  json(name: string, value: unknown) {
    this.items.push({ name, value: JSON.stringify(value ?? '') });
    return this;
  }
}

export function markupToPlainText(text: string): string {
  if (text == null) {
    return '';
  }
  return splitToParagraphs(text)
    .map((p) =>
      textTokenizer(p)
        .filter((t) => t !== '**' && t !== '_' && t !== '*')
        .join(''),
    )
    .join('\n');
}

function escapeXml(text: string): string {
  return (
    (text ?? '')
      // XML 1.0 can't hold these control characters, even escaped.
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  );
}

function escapeHtml(text: string): string {
  return escapeXml(text).replace(/"/g, '&quot;');
}

function systemName(system: System): string {
  if (system === System.Comms) {
    return 'Communications';
  } else if (system === System.Computer) {
    return 'Computers';
  } else {
    return System[system];
  }
}

function qualityNames(qualities: WeaponQuality[]): string[] {
  return (qualities ?? []).map((q) => {
    const name =
      q.quality === Quality.AreaOrSpread ? 'Area or Spread' : q.qualityName;
    return q.rank != null ? name + ' ' + q.rank : name;
  });
}

export class MapToolVttExporter {
  private static _instance: MapToolVttExporter;

  static get instance() {
    if (MapToolVttExporter._instance == null) {
      MapToolVttExporter._instance = new MapToolVttExporter();
    }
    return MapToolVttExporter._instance;
  }

  /* ---------------- characters ---------------- */

  exportCharacter(
    character: Character,
    options: MapToolExportOptions = {},
  ): MapToolTokenData {
    const props = new PropertyList();
    const version = character.version;

    props.add('Kind', this.characterKind(character));
    props.add('Edition', version === 1 ? 1 : 2);
    props.add('Species', character.speciesName ?? '');
    props.add('Pronouns', character.pronouns ?? '');
    props.add('Rank', character.rank?.name ?? '');
    props.add('Role', character.assignmentWithoutShip ?? '');
    props.add('Assignment', character.assignedShip ?? '');
    props.add('Reputation', character.reputation ?? '');

    AttributesHelper.getAllAttributes().forEach((a) =>
      props.add(Attribute[a], character.attributes[a]),
    );
    DepartmentsHelper.instance
      .getDepartments()
      .forEach((d) => props.add(Department[d], character.departments[d]));

    props.add(
      'StressMax',
      character.isStressTrackPresent ? character.stress : 0,
    );
    props.add(
      'Determination',
      character.stereotype === Stereotype.MainCharacter ||
        character.stereotype === Stereotype.SoloCharacter
        ? 1
        : 0,
    );
    props.add('Resistance', character.resistance ?? 0);
    if (character.isPersonalThreatTrackPresent) {
      props.add('PersonalThreat', character.personalThreat);
    }

    props.json('Values', character.values ?? []);
    props.json('Focuses', character.focuses ?? []);
    props.json('Traits', this.characterTraits(character));
    props.json('Talents', this.talents(character.rankedTalents, version));
    const ability = character.speciesStep?.ability;
    props.json(
      'SpeciesAbility',
      ability
        ? {
            name: ability.name,
            description: markupToPlainText(
              normalizeChallengeDice(ability.description),
            ),
          }
        : {},
    );
    props.json(
      'Weapons',
      character.determineWeapons().map((w) => this.personalWeapon(w)),
    );
    props.json(
      'Equipment',
      (character.equipmentAndImplants ?? []).map((e) => e.name),
    );
    props.json('Background', this.background(character));
    props.add('Description', markupToPlainText(character.description ?? ''));
    props.add('SheetLink', this.sheetLink(character));
    props.add('BuilderExport', MAPTOOL_EXPORT_FORMAT);

    const isPlayerCharacter =
      character.stereotype === Stereotype.MainCharacter ||
      character.stereotype === Stereotype.SoloCharacter;
    return {
      name: character.name || 'Unnamed Character',
      kind: 'character',
      propertyType: options.characterPropertyType?.trim() || 'Basic',
      tokenType: isPlayerCharacter ? 'PC' : 'NPC',
      properties: props.items,
      notes: this.characterNotes(character, props.items),
    };
  }

  characterKind(character: Character) {
    switch (character.stereotype) {
      case Stereotype.MainCharacter:
      case Stereotype.SoloCharacter:
        return 'Main';
      case Stereotype.SupportingCharacter:
        return 'Supporting';
      case Stereotype.Npc: {
        const type = character.npcGenerationStep?.type;
        if (type === NpcType.Major) {
          return 'Major NPC';
        } else if (type === NpcType.Notable) {
          return 'Notable NPC';
        } else {
          return 'Minor NPC';
        }
      }
      default:
        return 'Main';
    }
  }

  private characterTraits(character: Character) {
    const traits: { name: string; description: string }[] = [];
    const names = [...(character.baseTraits ?? [])];
    (character.additionalTraits ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t?.length)
      .forEach((t) => names.push(t));
    names.forEach((name, i) => {
      let description = '';
      if (
        i === 0 &&
        character.speciesStep?.species != null &&
        character.speciesStep?.species !== Species.Custom
      ) {
        const species = SpeciesHelper.getSpeciesByType(
          character.speciesStep.species,
        );
        description =
          (character.version === 1
            ? species?.localizedTraitDescription
            : species?.localizedTraitDescription2e) ?? '';
      }
      if (!traits.some((t) => t.name === name)) {
        traits.push({ name, description: markupToPlainText(description) });
      }
    });
    return traits;
  }

  talents(talents: SelectedTalent[], version: number): ExportedTalent[] {
    return (talents ?? [])
      .filter((t) => t.talentModel != null || t.isCustom)
      .map((t) => {
        const model = t.talentModel;
        return {
          name: t.displayName,
          rank: t.multiple ?? 1,
          category: this.talentCategory(t),
          requirement: model?.requirement ?? '',
          description: markupToPlainText(
            resolveTalentDescription(t, version, true),
          ),
        };
      });
  }

  private talentCategory(talent: SelectedTalent) {
    const category = talent.talentModel?.category;
    if (category == null) {
      return 'General';
    } else if (
      category.category === TalentCategory.Department &&
      category.type?.length
    ) {
      return Department[category.type[0] as Department];
    } else {
      return category.localizedDescription ?? '';
    }
  }

  private personalWeapon(w: Weapon) {
    let injury = '';
    if (w.injuryType === InjuryType.Stun) {
      injury = 'Stun';
    } else if (w.injuryType === InjuryType.Deadly) {
      injury = 'Deadly';
    } else if (w.injuryType === InjuryType.StunOrDeadly) {
      injury = 'Stun or Deadly';
    }
    const result: Record<string, unknown> = {
      name: w.name,
      type: w.type === WeaponType.MELEE ? 'Melee' : 'Ranged',
      severity: w.dice,
      injury,
      hands: w.hands ?? 1,
      qualities: qualityNames(w.qualities),
      effects: qualityNames(w.effects),
    };
    if (w.escalation != null) {
      result['escalation'] = w.escalation;
    }
    return result;
  }

  private background(character: Character) {
    const result: Record<string, unknown> = {
      environment: character.environmentStep
        ? CharacterSerializer.serializeEnvironment(
            character.environmentStep.environment,
            character.environmentStep.otherSpecies,
            character,
          )
        : '',
      upbringing: character.upbringingStep?.description ?? '',
      careerPath: this.careerPath(character),
      experience:
        character.careerStep?.career != null
          ? (CareersHelper.instance.getCareer(
              character.careerStep.career,
              character,
            )?.localizedName ?? '')
          : '',
      careerEvents: (character.careerEvents ?? [])
        .map(
          (e) =>
            CareerEventsHelper.getCareerEvent(
              e.id,
              character.type,
              character.version,
            )?.localizedName,
        )
        .filter((e) => e?.length),
      pastimes: character.pastime ?? [],
    };
    if (isKlingonWarriorType(character.type) && character.house?.length) {
      result['house'] = character.house;
    }
    return result;
  }

  private careerPath(character: Character) {
    let path =
      CharacterTypeModel.getByType(character.type)?.localizedName ?? '';
    if (character.educationStep) {
      path +=
        ' / ' +
        (TracksHelper.instance.getTrack(
          character.educationStep.track,
          character.type,
          character.version,
        )?.localizedName ?? '');
    }
    return path;
  }

  /* ---------------- starships ---------------- */

  exportStarship(
    starship: Starship,
    options: MapToolExportOptions = {},
  ): MapToolTokenData {
    const props = new PropertyList();
    const version = starship.version;

    props.add('Kind', starship.isSmallCraft ? 'Small Craft' : 'Starship');
    props.add('Edition', version === 1 ? 1 : 2);
    props.add('Class', starship.className ?? '');
    props.add('Registry', starship.registry ?? '');
    props.add('ServiceYear', starship.serviceYear ?? '');
    props.add(
      'MissionProfile',
      starship.missionProfileStep?.type?.localizedName ?? '',
    );
    props.add('Refits', starship.refitsAsString() ?? '');
    allSystems().forEach((s) => props.add(systemName(s), starship.systems[s]));
    DepartmentsHelper.instance
      .getDepartments()
      .forEach((d) => props.add(Department[d], starship.departments[d]));
    props.add('Scale', starship.scale ?? '');
    props.add('Shields', starship.shields ?? 0);
    props.add('Resistance', starship.resistance ?? 0);
    props.add('CrewSupport', starship.crewSupport ?? 0);
    if (version === 1) {
      props.add('Power', starship.power ?? 0);
    }
    props.json(
      'Traits',
      (starship.allTraitsAsArray ?? []).map((t) => ({
        name: t,
        description: '',
      })),
    );
    props.json('Talents', this.talents(starship.rankedTalents, version));
    props.json(
      'ShipWeapons',
      starship.determineWeapons().map((w) => this.starshipWeapon(starship, w)),
    );
    props.add(
      'Description',
      markupToPlainText(starship.spaceframeModel?.localizedDescription ?? ''),
    );
    props.add('SheetLink', this.sheetLink(starship));
    props.add('BuilderExport', MAPTOOL_EXPORT_FORMAT);

    return {
      name: starship.name || 'Unnamed Starship',
      kind: 'starship',
      propertyType: options.starshipPropertyType?.trim() || 'Basic',
      tokenType: 'NPC',
      properties: props.items,
      notes: this.starshipNotes(starship, props.items),
    };
  }

  private starshipWeapon(starship: Starship, w: Weapon) {
    let type = 'Energy';
    if (w.type === WeaponType.TORPEDO) {
      type = 'Torpedo';
    } else if (w.type === WeaponType.MINE) {
      type = 'Mine';
    } else if (w.type === WeaponType.CAPTURE) {
      type = 'Tractor';
    }
    return {
      name: w.name,
      type,
      damage: starship.getDiceForWeapon(w),
      range: w.range != null ? WeaponRange[w.range] : '',
      qualities: qualityNames(w.qualities),
      effects: qualityNames(w.effects),
    };
  }

  /* ---------------- notes: a readable sheet ---------------- */

  private value(properties: MapToolProperty[], name: string) {
    return properties.find((p) => p.name === name)?.value ?? '';
  }

  private parsed<T>(properties: MapToolProperty[], name: string): T {
    try {
      return JSON.parse(this.value(properties, name)) as T;
    } catch (e) {
      return undefined;
    }
  }

  private statTable(
    properties: MapToolProperty[],
    rows: { label: string; names: string[] }[],
  ) {
    let html = '<table border="0" cellpadding="2">';
    rows.forEach((row) => {
      html += '<tr><td><b>' + escapeHtml(row.label) + '</b></td>';
      row.names.forEach(
        (n) =>
          (html +=
            '<td>' +
            escapeHtml(n) +
            ' ' +
            escapeHtml(this.value(properties, n)) +
            '</td>'),
      );
      html += '</tr>';
    });
    return html + '</table>';
  }

  private listSection(title: string, items: string[]) {
    if (!items?.length) {
      return '';
    }
    return (
      '<p><b>' +
      escapeHtml(title) +
      ':</b> ' +
      items.map((i) => escapeHtml(i)).join(', ') +
      '</p>'
    );
  }

  private talentSection(talents: ExportedTalent[]) {
    if (!talents?.length) {
      return '';
    }
    let html = '<h3>Talents</h3>';
    talents.forEach((t) => {
      html +=
        '<p><b>' +
        escapeHtml(t.name) +
        (t.rank > 1 ? ' [x' + t.rank + ']' : '') +
        '</b>' +
        (t.requirement ? ' <i>(' + escapeHtml(t.requirement) + ')</i>' : '') +
        '<br>' +
        splitToParagraphs(t.description)
          .map((p) => escapeHtml(p))
          .join('<br>') +
        '</p>';
    });
    return html;
  }

  private linkSection(properties: MapToolProperty[]) {
    const link = this.value(properties, 'SheetLink');
    return link
      ? '<p><a href="' + escapeHtml(link) + '">Original sheet</a></p>'
      : '';
  }

  private characterNotes(character: Character, properties: MapToolProperty[]) {
    const v = (n: string) => this.value(properties, n);
    let html = '<html><body>';
    html +=
      '<h2>' + escapeHtml(character.name || 'Unnamed Character') + '</h2>';
    const subtitle = [v('Rank'), v('Species'), v('Role'), v('Assignment')]
      .filter((s) => s?.length)
      .map((s) => escapeHtml(s))
      .join(' &middot; ');
    if (subtitle) {
      html += '<p>' + subtitle + '</p>';
    }
    html += this.statTable(properties, [
      { label: 'Attributes', names: ['Control', 'Daring', 'Fitness'] },
      { label: '', names: ['Insight', 'Presence', 'Reason'] },
      { label: 'Departments', names: ['Command', 'Conn', 'Engineering'] },
      { label: '', names: ['Medicine', 'Science', 'Security'] },
    ]);
    const extras = [];
    if (+v('StressMax') > 0) {
      extras.push('Stress ' + v('StressMax'));
    }
    if (+v('Resistance') > 0) {
      extras.push('Resistance ' + v('Resistance'));
    }
    if (v('PersonalThreat')) {
      extras.push('Personal Threat ' + v('PersonalThreat'));
    }
    if (v('Reputation')) {
      extras.push('Reputation ' + v('Reputation'));
    }
    if (extras.length) {
      html += '<p>' + escapeHtml(extras.join(' · ')) + '</p>';
    }
    html += this.listSection(
      'Values',
      this.parsed<string[]>(properties, 'Values'),
    );
    html += this.listSection(
      'Focuses',
      this.parsed<string[]>(properties, 'Focuses'),
    );
    const traits =
      this.parsed<{ name: string; description: string }[]>(
        properties,
        'Traits',
      ) ?? [];
    html += this.listSection(
      'Traits',
      traits.map((t) => t.name),
    );
    const ability = this.parsed<{ name?: string; description?: string }>(
      properties,
      'SpeciesAbility',
    );
    if (ability?.name) {
      html +=
        '<p><b>Species ability: ' +
        escapeHtml(ability.name) +
        '</b><br>' +
        escapeHtml(ability.description ?? '').replace(/\n/g, '<br>') +
        '</p>';
    }
    html += this.talentSection(this.parsed(properties, 'Talents'));
    const weapons =
      this.parsed<Record<string, unknown>[]>(properties, 'Weapons') ?? [];
    if (weapons.length) {
      html += '<h3>Weapons</h3><ul>';
      weapons.forEach((w) => {
        const details = [
          w['type'],
          'Severity ' + w['severity'],
          w['injury'],
          (w['hands'] as number) > 1 ? 'two-handed' : '',
          ...((w['qualities'] as string[]) ?? []),
          ...((w['effects'] as string[]) ?? []),
        ].filter((d) => d != null && d !== '');
        html +=
          '<li><b>' +
          escapeHtml('' + w['name']) +
          '</b>: ' +
          escapeHtml(details.join(', ')) +
          '</li>';
      });
      html += '</ul>';
    }
    html += this.listSection(
      'Equipment',
      this.parsed<string[]>(properties, 'Equipment'),
    );
    const background = this.parsed<Record<string, unknown>>(
      properties,
      'Background',
    );
    if (background) {
      const rows = [
        ['Environment', background['environment']],
        ['Upbringing', background['upbringing']],
        ['Career path', background['careerPath']],
        ['Experience', background['experience']],
        [
          'Career events',
          ((background['careerEvents'] as string[]) ?? []).join(', '),
        ],
        ['Pastimes', ((background['pastimes'] as string[]) ?? []).join(', ')],
        ['House', background['house']],
      ].filter((r) => r[1] != null && r[1] !== '');
      if (rows.length) {
        html += '<h3>Background</h3>';
        rows.forEach(
          (r) =>
            (html +=
              '<p><b>' +
              escapeHtml('' + r[0]) +
              ':</b> ' +
              escapeHtml('' + r[1]) +
              '</p>'),
        );
      }
    }
    if (character.description?.length) {
      html += markupToHtml(escapeXml(character.description));
    }
    html += this.linkSection(properties);
    return html + '</body></html>';
  }

  private starshipNotes(starship: Starship, properties: MapToolProperty[]) {
    const v = (n: string) => this.value(properties, n);
    let html = '<html><body>';
    html +=
      '<h2>' +
      escapeHtml(starship.name || 'Unnamed Starship') +
      (v('Registry') ? ', ' + escapeHtml(v('Registry')) : '') +
      '</h2>';
    const subtitle = [
      v('Class') ? v('Class') + ' class' : '',
      v('MissionProfile'),
      v('ServiceYear') ? 'service year ' + v('ServiceYear') : '',
    ]
      .filter((s) => s?.length)
      .map((s) => escapeHtml(s))
      .join(' &middot; ');
    if (subtitle) {
      html += '<p>' + subtitle + '</p>';
    }
    html += this.statTable(properties, [
      { label: 'Systems', names: ['Communications', 'Computers', 'Engines'] },
      { label: '', names: ['Sensors', 'Structure', 'Weapons'] },
      { label: 'Departments', names: ['Command', 'Conn', 'Engineering'] },
      { label: '', names: ['Medicine', 'Science', 'Security'] },
    ]);
    const stats = [
      'Scale ' + v('Scale'),
      'Shields ' + v('Shields'),
      'Resistance ' + v('Resistance'),
      'Crew Support ' + v('CrewSupport'),
    ];
    if (v('Power')) {
      stats.push('Power ' + v('Power'));
    }
    html += '<p>' + escapeHtml(stats.join(' · ')) + '</p>';
    if (v('Refits')) {
      html += '<p><b>Refits:</b> ' + escapeHtml(v('Refits')) + '</p>';
    }
    html += this.listSection(
      'Traits',
      (this.parsed<{ name: string }[]>(properties, 'Traits') ?? []).map(
        (t) => t.name,
      ),
    );
    html += this.talentSection(this.parsed(properties, 'Talents'));
    const weapons =
      this.parsed<Record<string, unknown>[]>(properties, 'ShipWeapons') ?? [];
    if (weapons.length) {
      html += '<h3>Weapons</h3><ul>';
      weapons.forEach((w) => {
        const details = [
          w['type'],
          w['range'] ? 'Range ' + w['range'] : '',
          'Damage ' + w['damage'],
          ...((w['qualities'] as string[]) ?? []),
          ...((w['effects'] as string[]) ?? []),
        ].filter((d) => d != null && d !== '');
        html +=
          '<li><b>' +
          escapeHtml('' + w['name']) +
          '</b>: ' +
          escapeHtml(details.join(', ')) +
          '</li>';
      });
      html += '</ul>';
    }
    if (v('Description')) {
      html +=
        '<p>' + escapeHtml(v('Description')).replace(/\n/g, '<br>') + '</p>';
    }
    html += this.linkSection(properties);
    return html + '</body></html>';
  }

  private sheetLink(construct: Character | Starship) {
    try {
      const encoded = marshaller.encodeConstruct(construct);
      return encoded ? SHEET_URL + encoded : '';
    } catch (e) {
      return '';
    }
  }

  /* ---------------- the .rptok file ---------------- */

  // A MapTool GUID: 16 random bytes, base64-encoded.
  private guid(randomBytes: (n: number) => Uint8Array) {
    return Base64.fromUint8Array(randomBytes(16));
  }

  buildTokenXml(
    data: MapToolTokenData,
    image: { md5: string; width: number; height: number; shape?: string },
    randomBytes: (n: number) => Uint8Array = defaultRandomBytes,
  ): string {
    const lines: string[] = [];
    const add = (indent: number, text: string) =>
      lines.push(' '.repeat(indent) + text);
    const field = (name: string, value: string | number | boolean) =>
      add(2, '<' + name + '>' + escapeXml('' + value) + '</' + name + '>');

    add(0, '<net.rptools.maptool.model.Token>');
    add(2, '<id>');
    add(4, '<baGUID>' + this.guid(randomBytes) + '</baGUID>');
    add(2, '</id>');
    field('beingImpersonated', false);
    add(2, '<exposedAreaGUID>');
    add(4, '<baGUID>' + this.guid(randomBytes) + '</baGUID>');
    add(2, '</exposedAreaGUID>');
    add(2, '<imageAssetMap>');
    add(4, '<entry>');
    add(6, '<null/>');
    add(6, '<net.rptools.lib.MD5Key>');
    add(8, '<id>' + image.md5 + '</id>');
    add(6, '</net.rptools.lib.MD5Key>');
    add(4, '</entry>');
    add(2, '</imageAssetMap>');
    field('x', 0);
    field('y', 0);
    field('z', 0);
    field('lastX', 0);
    field('lastY', 0);
    field('anchorX', 0);
    field('anchorY', 0);
    field('sizeScale', '1.0');
    field('scaleX', '1.0');
    field('scaleY', '1.0');
    field('snapToScale', true);
    field('width', image.width);
    field('height', image.height);
    field('isoWidth', image.width);
    field('isoHeight', image.height);
    add(2, '<sizeMap/>');
    field('snapToGrid', true);
    field('isVisible', true);
    field('visibleOnlyToOwner', false);
    field('vblColorSensitivity', -1);
    field('alwaysVisibleTolerance', 2);
    field('isAlwaysVisible', false);
    field('name', data.name);
    add(2, '<ownerList/>');
    field('ownerType', 0);
    field('tokenShape', image.shape ?? 'CIRCLE');
    field('tokenType', data.tokenType);
    field('layer', 'TOKEN');
    field('propertyType', data.propertyType);
    field('tokenOpacity', '1.0');
    field('speechName', '');
    field('terrainModifier', '0.0');
    field('terrainModifierOperation', 'NONE');
    add(2, '<terrainModifiersIgnored>');
    add(
      4,
      '<net.rptools.maptool.model.Token_-TerrainModifierOperation>NONE</net.rptools.maptool.model.Token_-TerrainModifierOperation>',
    );
    add(2, '</terrainModifiersIgnored>');
    field('isFlippedX', false);
    field('isFlippedY', false);
    field('isFlippedIso', false);
    add(2, '<portraitImage>');
    add(4, '<id>' + image.md5 + '</id>');
    add(2, '</portraitImage>');
    add(2, '<uniqueLightSources class="linked-hash-map"/>');
    add(2, '<lightSourceList/>');
    field('sightType', 'Normal');
    field('hasSight', data.tokenType === 'PC');
    field('hasImageTable', false);
    field('notes', data.notes);
    field('notesType', 'text/html');
    field('gmNotes', '');
    field('gmNotesType', 'text/plain');
    add(2, '<state/>');
    add(2, '<propertyMapCI>');
    add(4, '<store>');
    data.properties.forEach((p) => {
      add(6, '<entry>');
      add(8, '<string>' + escapeXml(p.name.toLowerCase()) + '</string>');
      add(8, '<net.rptools.CaseInsensitiveHashMap_-KeyValue>');
      add(10, '<key>' + escapeXml(p.name) + '</key>');
      add(10, '<value class="string">' + escapeXml(p.value) + '</value>');
      add(10, '<outer-class reference="../../../.."/>');
      add(8, '</net.rptools.CaseInsensitiveHashMap_-KeyValue>');
      add(6, '</entry>');
    });
    add(4, '</store>');
    add(2, '</propertyMapCI>');
    add(2, '<macroPropertiesMap/>');
    add(2, '<speechMap/>');
    field('allowURIAccess', false);
    add(0, '</net.rptools.maptool.model.Token>');
    return lines.join('\n');
  }

  buildAssetXml(md5: string, name: string, extension: string) {
    return [
      '<net.rptools.maptool.model.Asset>',
      '  <id>',
      '    <id>' + md5 + '</id>',
      '  </id>',
      '  <name>' + escapeXml(name) + '</name>',
      '  <extension>' + escapeXml(extension) + '</extension>',
      '  <type>IMAGE</type>',
      '  <image/>',
      '</net.rptools.maptool.model.Asset>',
    ].join('\n');
  }

  buildPropertiesXml() {
    return [
      '<map>',
      '  <entry>',
      '    <string>version</string>',
      '    <string>' + MAPTOOL_FILE_VERSION + '</string>',
      '  </entry>',
      '  <entry>',
      '    <string>herolab</string>',
      '    <boolean>false</boolean>',
      '  </entry>',
      '</map>',
    ].join('\n');
  }

  // Build the .rptok archive.
  packageToken(
    data: MapToolTokenData,
    image: MapToolTokenImage,
    randomBytes: (n: number) => Uint8Array = defaultRandomBytes,
  ): Uint8Array {
    const md5 = md5Hex(image.png);
    const files: Record<string, Uint8Array | [Uint8Array, { level: 0 }]> = {
      'content.xml': strToU8(
        this.buildTokenXml(
          data,
          {
            md5,
            width: image.width,
            height: image.height,
            shape: image.shape,
          },
          randomBytes,
        ),
      ),
      'properties.xml': strToU8(this.buildPropertiesXml()),
    };
    files['assets/' + md5] = strToU8(this.buildAssetXml(md5, data.name, 'png'));
    files['assets/' + md5 + '.png'] = [image.png, { level: 0 }];
    files['thumbnail'] = [image.thumbnail ?? image.png, { level: 0 }];
    files['thumbnail_large'] = [
      image.thumbnailLarge ?? image.png,
      { level: 0 },
    ];
    return zipSync(files, { level: 6, mtime: new Date(1980, 0, 2) });
  }
}

function defaultRandomBytes(n: number): Uint8Array {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return bytes;
}
