import { test, expect, describe, afterEach, jest } from '@jest/globals';
import { unzipSync, strFromU8 } from 'fflate';
import { xml2js } from 'xml-js';
import '../../src/helpers/species';
import {
  MAPTOOL_EXPORT_FORMAT,
  MapToolVttExporter,
  markupToPlainText,
} from '../../src/vtt/mapToolVttExporter';
import type { MapToolTokenData } from '../../src/vtt/mapToolVttExporter';
import { md5Hex } from '../../src/vtt/md5';
import {
  MapToolFrameworkType,
  mapToolExportOptions,
  mapToolFrameworkByName,
} from '../../src/vtt/mapToolFrameworkType';
import {
  makePopulatedMainCharacter,
  makePopulatedNpc,
  makePopulatedStarship,
} from './vttFixtures';

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

beforeEach(() => {
  jest.spyOn(Math, 'random').mockReturnValue(0.7);
});

afterEach(() => {
  jest.restoreAllMocks();
});

// A 1x1 transparent PNG
const PNG = Uint8Array.from(
  atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  ),
  (c) => c.charCodeAt(0),
);

// Predictable "random" bytes, so GUIDs are stable in the tests.
function counterBytes() {
  let next = 0;
  return (n: number) => Uint8Array.from({ length: n }, () => next++ % 256);
}

function property(data: MapToolTokenData, name: string) {
  return data.properties.find((p) => p.name === name)?.value;
}

function json(data: MapToolTokenData, name: string) {
  return JSON.parse(property(data, name) ?? 'null');
}

describe('MapTool export of characters', () => {
  test('exports a main character with every stat as a token property', () => {
    const character = makePopulatedMainCharacter(2);
    const data = MapToolVttExporter.instance.exportCharacter(character);

    expect(data.name).toBe('Rhea Voss');
    expect(data.kind).toBe('character');
    expect(data.tokenType).toBe('PC');
    expect(data.propertyType).toBe('Basic');
    expect(property(data, 'Kind')).toBe('Main');
    expect(property(data, 'Edition')).toBe('2');
    expect(property(data, 'Pronouns')).toBe('she/her');
    expect(property(data, 'Assignment')).toBe('USS Venture');
    [
      'Control',
      'Daring',
      'Fitness',
      'Insight',
      'Presence',
      'Reason',
      'Command',
      'Conn',
      'Security',
      'Engineering',
      'Science',
      'Medicine',
    ].forEach((name) => expect(property(data, name)).toMatch(/^\d+$/));
    expect(property(data, 'StressMax')).toBe('' + character.stress);
    expect(property(data, 'Determination')).toBe('1');
    expect(json(data, 'Values')).toEqual(character.values);
    expect(json(data, 'Focuses')).toEqual(character.focuses);
    expect(property(data, 'BuilderExport')).toBe(MAPTOOL_EXPORT_FORMAT);
    expect(property(data, 'SheetLink')).toMatch(
      /^https:\/\/sta\.bcholmes\.org\/view\?s=/,
    );
  });

  test('includes the full definition of each talent', () => {
    const character = makePopulatedMainCharacter(2);
    const data = MapToolVttExporter.instance.exportCharacter(character);
    const talents = json(data, 'Talents');

    expect(talents.length).toBe(character.rankedTalents.length);
    talents.forEach((t) => {
      expect(Object.keys(t).sort()).toEqual([
        'category',
        'description',
        'name',
        'rank',
        'requirement',
      ]);
      expect(t.description).not.toContain('**');
    });
    // (Translations are stubbed in these tests, so only the talents whose text
    // lives in the code have a description here; in the app they all do.)
    const advisor = talents.find((t) => t.name === 'Advisor');
    expect(advisor.category).toBe('Command');
    expect(advisor.requirement).toBe(
      'Requires Command 2+, Main Character only',
    );
    expect(advisor.description).toMatch(
      /^Whenever you assist another character/,
    );
    const bold = talents.find((t) => t.name.startsWith('Bold'));
    expect(bold).toBeDefined();
    expect(bold.rank).toBe(1);
  });

  test('exports weapons, traits, background and notes', () => {
    const data = MapToolVttExporter.instance.exportCharacter(
      makePopulatedMainCharacter(2),
    );
    const weapons = json(data, 'Weapons');
    expect(weapons.length).toBeGreaterThan(0);
    weapons.forEach((w) => {
      expect(['Melee', 'Ranged']).toContain(w.type);
      expect(typeof w.severity).toBe('number');
      expect(Array.isArray(w.qualities)).toBe(true);
    });
    const traits = json(data, 'Traits');
    expect(traits.map((t) => t.name)).toContain('Steadfast');
    expect(json(data, 'Background').pastimes).toEqual([
      'Anthropology',
      'Aquaponics',
    ]);
    expect(data.notes).toContain('<h2>Rhea Voss</h2>');
    expect(data.notes).toContain('<h3>Talents</h3>');
    expect(data.notes).toContain('Original sheet');
  });

  test('exports an NPC with its NPC type', () => {
    const data =
      MapToolVttExporter.instance.exportCharacter(makePopulatedNpc());
    expect(data.tokenType).toBe('NPC');
    expect(property(data, 'Kind')).toBe('Notable NPC');
    expect(property(data, 'Determination')).toBe('0');
    expect(property(data, 'PersonalThreat')).toBe('3');
    expect(json(data, 'Values')).toEqual(['Logic', 'Peace']);
  });

  test('uses the chosen token type', () => {
    const data = MapToolVttExporter.instance.exportCharacter(
      makePopulatedNpc(),
      { characterPropertyType: ' STA2e Character ' },
    );
    expect(data.propertyType).toBe('STA2e Character');
  });

  test('golden output', () => {
    const data = MapToolVttExporter.instance.exportCharacter(
      makePopulatedMainCharacter(2),
    );
    const { notes, ...rest } = data;
    expect(JSON.stringify(rest, null, 4)).toMatchSnapshot();
  });
});

describe('MapTool export of starships', () => {
  test('exports systems, departments and ship stats', () => {
    const starship = makePopulatedStarship();
    const data = MapToolVttExporter.instance.exportStarship(starship);

    expect(data.name).toBe('USS Venture');
    expect(data.kind).toBe('starship');
    expect(data.tokenType).toBe('NPC');
    expect(property(data, 'Kind')).toBe('Starship');
    expect(property(data, 'Registry')).toBe('NCC-70637');
    expect(property(data, 'ServiceYear')).toBe('2372');
    [
      'Communications',
      'Computers',
      'Engines',
      'Sensors',
      'Structure',
      'Weapons',
    ].forEach((name) => expect(property(data, name)).toMatch(/^\d+$/));
    expect(property(data, 'Scale')).toBe('' + starship.scale);
    expect(property(data, 'Shields')).toBe('' + starship.shields);
    expect(json(data, 'Traits').map((t) => t.name)).toEqual(
      starship.allTraitsAsArray,
    );
    expect(json(data, 'Talents').length).toBe(starship.rankedTalents.length);
  });

  test('exports weapons with their damage and qualities', () => {
    const data = MapToolVttExporter.instance.exportStarship(
      makePopulatedStarship(),
    );
    const weapons = json(data, 'ShipWeapons');
    expect(weapons.length).toBeGreaterThan(0);
    weapons.forEach((w) => {
      expect(['Energy', 'Torpedo', 'Mine', 'Tractor']).toContain(w.type);
      expect(typeof w.damage).toBe('number');
    });
  });

  test('golden output', () => {
    const data = MapToolVttExporter.instance.exportStarship(
      makePopulatedStarship(),
    );
    const { notes, ...rest } = data;
    expect(JSON.stringify(rest, null, 4)).toMatchSnapshot();
  });
});

describe('MapTool token file', () => {
  const data: MapToolTokenData = {
    name: 'Worf & <Son>',
    kind: 'character',
    propertyType: 'Basic',
    tokenType: 'PC',
    properties: [
      { name: 'Control', value: '9' },
      { name: 'Values', value: '["Honor & Duty","<Loyalty>"]' },
    ],
    notes: '<html><body><h2>Worf</h2></body></html>',
  };

  test('writes the token in the XML form MapTool reads', () => {
    const xml = MapToolVttExporter.instance.buildTokenXml(
      data,
      { md5: 'abc123', width: 400, height: 400 },
      counterBytes(),
    );
    const doc = xml2js(xml, { compact: true }) as any;
    const token = doc['net.rptools.maptool.model.Token'];

    expect(token.name._text).toBe('Worf & <Son>');
    expect(token.propertyType._text).toBe('Basic');
    expect(token.tokenType._text).toBe('PC');
    expect(token.id.baGUID._text).toBe('AAECAwQFBgcICQoLDA0ODw==');
    expect(token.imageAssetMap.entry['net.rptools.lib.MD5Key'].id._text).toBe(
      'abc123',
    );
    expect(token.notes._text).toBe(data.notes);
    expect(token.notesType._text).toBe('text/html');

    const entries = token.propertyMapCI.store.entry;
    expect(entries.length).toBe(2);
    expect(entries[0].string._text).toBe('control');
    const kv = entries[1]['net.rptools.CaseInsensitiveHashMap_-KeyValue'];
    expect(kv.key._text).toBe('Values');
    expect(kv.value._text).toBe('["Honor & Duty","<Loyalty>"]');
    expect(kv.value._attributes.class).toBe('string');
    expect(kv['outer-class']._attributes.reference).toBe('../../../..');
  });

  test('packages the token, image and descriptions in a zip', () => {
    const bytes = MapToolVttExporter.instance.packageToken(
      data,
      { png: PNG, width: 1, height: 1 },
      counterBytes(),
    );
    const files = unzipSync(bytes);
    const md5 = md5Hex(PNG);

    expect(Object.keys(files).sort()).toEqual(
      [
        'assets/' + md5,
        'assets/' + md5 + '.png',
        'content.xml',
        'properties.xml',
        'thumbnail',
        'thumbnail_large',
      ].sort(),
    );
    expect(files['assets/' + md5 + '.png']).toEqual(PNG);
    expect(strFromU8(files['assets/' + md5])).toContain('<id>' + md5 + '</id>');
    expect(strFromU8(files['content.xml'])).toContain('<id>' + md5 + '</id>');
    const props = xml2js(strFromU8(files['properties.xml']), {
      compact: true,
    }) as any;
    expect(props.map.entry[0].string[1]._text).toMatch(/^1\.\d+\.\d+$/);
  });
});

describe('markupToPlainText', () => {
  test('drops bold and italic markers', () => {
    expect(markupToPlainText('A **bold** and _italic_ word')).toBe(
      'A bold and italic word',
    );
  });

  test('keeps paragraphs on separate lines', () => {
    expect(markupToPlainText('One\n\nTwo')).toBe('One\nTwo');
  });
});

describe('MapTool frameworks', () => {
  test("Freeman's STA2E Framework uses its own token types", () => {
    expect(
      mapToolExportOptions(MapToolFrameworkType.FreemanSta2e, 'Basic', 'Ship'),
    ).toEqual({
      characterPropertyType: 'STA2e Character',
      starshipPropertyType: 'STA2e Ship',
    });
  });

  test('Custom uses the typed token types, or Basic', () => {
    expect(
      mapToolExportOptions(MapToolFrameworkType.Custom, ' PC ', 'Vessel'),
    ).toEqual({ characterPropertyType: 'PC', starshipPropertyType: 'Vessel' });
    expect(mapToolExportOptions(MapToolFrameworkType.Custom, '', ' ')).toEqual({
      characterPropertyType: 'Basic',
      starshipPropertyType: 'Basic',
    });
  });

  test('a saved framework name is read back, defaulting to the STA2E Framework', () => {
    expect(mapToolFrameworkByName('Custom')).toBe(MapToolFrameworkType.Custom);
    expect(mapToolFrameworkByName(undefined)).toBe(
      MapToolFrameworkType.FreemanSta2e,
    );
    expect(mapToolFrameworkByName('Nonsense')).toBe(
      MapToolFrameworkType.FreemanSta2e,
    );
  });
});
