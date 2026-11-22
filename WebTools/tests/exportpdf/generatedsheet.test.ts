import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PDFDocument, StandardFonts } from '@cantoo/pdf-lib';
import '../../src/helpers/species';
import {
  Character,
  ImageConfig,
  SpeciesAbilityOptions,
  SpeciesStep,
} from '../../src/common/character';
import { CharacterType } from '../../src/common/characterType';
import { Starship } from '../../src/common/starship';
import { Station } from '../../src/common/station';
import { Species } from '../../src/helpers/speciesEnum';
import { SpeciesAbility } from '../../src/helpers/speciesAbility';
import { Era } from '../../src/helpers/erasEnum';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { Attribute } from '../../src/helpers/attributes';
import { Department } from '../../src/helpers/department';
import { System } from '../../src/helpers/systems';
import { BorgImplantType } from '../../src/helpers/borgImplant';
import { MissionPod, MissionPodHelper } from '../../src/helpers/missionPods';
import {
  TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM,
  TALENT_NAME_AUGMENTED_ABILITY,
  TALENT_NAME_BOLD,
  TALENT_NAME_BORG_IMPLANTS,
  TALENT_NAME_CAUTIOUS,
  TALENT_NAME_COLLABORATION,
  TALENT_NAME_DEDICATED_PERSONNEL,
  TALENT_NAME_EXPANSIVE_DEPARTMENT,
  TALENT_NAME_EXTRAORDINARY_ATTRIBUTE_X,
  TALENT_NAME_IM_A_DOCTOR_NOT_A,
  TALENT_NAME_INITIATIVE_X,
  TALENT_NAME_MISSION_POD,
  TALENT_NAME_REDUNDANT_SYSTEMS,
  TALENT_NAME_UNTAPPED_POTENTIAL,
  TALENT_NAME_WARRIORS_SPIRIT,
  TalentsHelper,
} from '../../src/helpers/talents';
import { PropulsionSystemType } from '../../src/helpers/propulsionSystem';
import { Column } from '../../src/exportpdf/column';
import { FontLibrary, FontType } from '../../src/exportpdf/fontLibrary';
import { SimpleColor } from '../../src/common/colour';
import {
  assembleStarshipTalents,
  assembleWritableItems,
  BasicGeneratedSheet,
  SpeciesAbilityAndOptions,
} from '../../src/exportpdf/generatedsheet';
import { ReadableTalentModel } from '../../src/exportpdf/talentWriter';

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

jest.mock('../../src/state/store', () => ({
  store: {
    getState: () => ({ context: { sources: [1] } }),
    dispatch: () => undefined,
  },
}));

jest.mock('pica', () => {
  const pica = {
    resize: jest.fn(async () => ({})),
    toBlob: jest.fn(async () => ({
      arrayBuffer: async () => new Uint8Array([9]),
    })),
  };
  return { __esModule: true, default: () => pica, pica };
});

const picaMock: any = (jest.requireMock('pica') as any).pica;
const fontBytes = readFileSync(
  join(__dirname, '../../public/static/font/OpenSansCondensed-Light.ttf'),
);

const createPdfFixture = async () => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([600, 800]);
  const fonts = new FontLibrary();
  fonts.addFont(
    FontType.Standard,
    await pdf.embedFont(StandardFonts.Helvetica),
  );
  return { pdf, page, fonts };
};

const fakePdf = (extra: any = {}) =>
  ({
    embedJpg: jest.fn(async (bytes: any) => bytes),
    embedPng: jest.fn(async (bytes: any) => bytes),
    ...extra,
  }) as any;

const withTalents = (character: Character, talents: SelectedTalent[]) => {
  Object.defineProperty(character, 'talents', {
    configurable: true,
    get: () => talents,
  });
  return character;
};

const setImplants = (character: Character, implants: BorgImplantType[]) => {
  Object.defineProperty(character, 'implants', {
    configurable: true,
    get: () => implants,
  });
  return character;
};

const newCharacter = () => {
  const character = Character.createMainCharacter(
    CharacterType.Starfleet,
    Era.NextGeneration,
    2,
  );
  return setImplants(character, []);
};

class TestSheet extends BasicGeneratedSheet {
  getName() {
    return 'Test';
  }
  getThumbnailUrl() {
    return '/thumb.png';
  }
  getPdfUrl() {
    return '/sheet.pdf';
  }
}

describe('generatedsheet', () => {
  test('createFileName sanitizes names and falls back', () => {
    const sheet = new TestSheet();
    expect(sheet.createFileName('sheet', { name: '' } as any)).toBe(
      'sheet.pdf',
    );
    expect(sheet.createFileName('sheet', { name: 'A/B C\\D' } as any)).toBe(
      'A_B_C_D-sheet.pdf',
    );
  });

  test('determineIdealFontWidth reduces font size when needed', async () => {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const sheet = new TestSheet();

    const size = sheet.determineIdealFontWidth(
      ['A very long line that should not fit'],
      20,
      12,
      6,
      font,
    );

    expect(size).toBeLessThan(12);
    expect(size).toBeGreaterThanOrEqual(6);
  });

  test('assembleWritableItems includes role models', () => {
    const character = Character.createMainCharacter(
      CharacterType.Starfleet,
      Era.NextGeneration,
      2,
    );
    character.role = 1;
    character.secondaryRole = 2;

    const items = assembleWritableItems(character) as any[];
    expect(items.length).toBeGreaterThan(0);
    expect(items.some((i) => !(i instanceof ReadableTalentModel))).toBe(true);
  });

  test('assembleStarshipTalents captures starship talent selections', () => {
    const starship = Starship.createStandardStarship(
      Era.NextGeneration,
      CharacterType.Starfleet,
      2,
    );
    const redundant = new SelectedTalent(TALENT_NAME_REDUNDANT_SYSTEMS);
    redundant.selection = 'Backup';
    redundant.system = System.Engines;
    const propulsion = new SelectedTalent(
      TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM,
    );
    propulsion.selection = PropulsionSystemType.QuantumSlipstreamDrive;
    const dedicated = new SelectedTalent(TALENT_NAME_DEDICATED_PERSONNEL);
    dedicated.department = Department.Engineering;
    const expansive = new SelectedTalent(TALENT_NAME_EXPANSIVE_DEPARTMENT);
    expansive.department = Department.Medicine;
    starship.additionalTalents = [redundant, propulsion, dedicated, expansive];

    const items = assembleStarshipTalents(
      starship,
      false,
    ) as ReadableTalentModel[];
    const byName = Object.fromEntries(items.map((i) => [i.talent.name, i]));
    expect(byName[TALENT_NAME_REDUNDANT_SYSTEMS].selection).toBe('Backup');
    expect(byName[TALENT_NAME_REDUNDANT_SYSTEMS].system).toBe(System.Engines);
    expect(byName[TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM].selection).toBe(
      PropulsionSystemType.QuantumSlipstreamDrive,
    );
    expect(byName[TALENT_NAME_DEDICATED_PERSONNEL].departments).toEqual([
      Department.Engineering,
    ]);
  });

  beforeEach(() => {
    picaMock.resize.mockReset();
    picaMock.toBlob.mockReset();
  });

  test('exposes default sheet metadata', () => {
    const sheet = new TestSheet();

    expect(sheet.getLanguage()).toBe('en');
    expect(sheet.getDefaultFontPath()).toBe(
      '/static/font/OpenSansCondensed-Light.ttf',
    );
    expect(sheet.getTags()).toEqual([]);
  });

  test('base sheet lifecycle methods throw until implemented', () => {
    class BareSheet extends BasicGeneratedSheet {}
    const sheet = new BareSheet();

    expect(() => sheet.getName()).toThrow('Method not implemented.');
    expect(() => sheet.getThumbnailUrl()).toThrow('Method not implemented.');
    expect(() => sheet.getPdfUrl(CharacterType.Starfleet)).toThrow(
      'Method not implemented.',
    );
  });

  test('initializeFonts embeds the default font and wraps form appearances', async () => {
    const { pdf } = await createPdfFixture();
    const registerFontkit = jest.spyOn(pdf, 'registerFontkit');
    const updateFieldAppearances = jest.fn();
    jest
      .spyOn(pdf, 'getForm')
      .mockReturnValue({ updateFieldAppearances } as any);
    const fetchMock = jest.fn(async (_input: any) => ({
      arrayBuffer: async () => fontBytes,
    }));
    const originalFetch = globalThis.fetch;
    (globalThis as any).fetch = fetchMock;

    try {
      const sheet = new TestSheet();
      await sheet.initializeFonts(pdf);

      expect(fetchMock).toHaveBeenCalledWith(sheet.getDefaultFontPath());
      expect(registerFontkit).toHaveBeenCalled();
      expect(sheet.formFont).toBeDefined();
      (pdf.getForm() as any).updateFieldAppearances();
      expect(updateFieldAppearances).toHaveBeenCalledWith(sheet.formFont);
    } finally {
      (globalThis as any).fetch = originalFetch;
    }
  });

  test('initializeFonts tolerates a PDF without a form', async () => {
    const { pdf } = await createPdfFixture();
    jest.spyOn(pdf, 'getForm').mockReturnValue(undefined as any);
    const originalFetch = globalThis.fetch;
    (globalThis as any).fetch = jest.fn(async () => ({
      arrayBuffer: async () => fontBytes,
    }));

    try {
      const sheet = new TestSheet();
      await expect(sheet.initializeFonts(pdf)).resolves.toBeUndefined();
      expect(sheet.formFont).toBeDefined();
    } finally {
      (globalThis as any).fetch = originalFetch;
    }
  });

  test('populate sets the construct title', async () => {
    const sheet = new TestSheet();
    jest.spyOn(sheet, 'initializeFonts').mockResolvedValue(undefined);
    const pdf = fakePdf({ setTitle: jest.fn() });

    await sheet.populate(pdf, { name: 'Captain' } as any);

    expect(pdf.setTitle).toHaveBeenCalledWith('Captain');
  });

  test('populate skips the title when the construct has no name', async () => {
    const sheet = new TestSheet();
    jest.spyOn(sheet, 'initializeFonts').mockResolvedValue(undefined);
    const pdf = fakePdf({ setTitle: jest.fn() });

    await sheet.populate(pdf, { name: '' } as any);

    expect(pdf.setTitle).not.toHaveBeenCalled();
  });

  test('embedImage embeds JPEG and PNG bytes without conversion', async () => {
    const pdf = fakePdf();
    const sheet = new TestSheet();

    await sheet.embedImage(pdf, new ImageConfig('image/jpeg', 'AA=='));
    await sheet.embedImage(pdf, new ImageConfig('image/png', 'AQ=='));

    expect(pdf.embedJpg).toHaveBeenCalled();
    expect(pdf.embedPng).toHaveBeenCalled();
  });

  test('embedImage recognizes uppercase MIME types', async () => {
    const pdf = fakePdf();
    const sheet = new TestSheet();

    await sheet.embedImage(pdf, new ImageConfig('IMAGE/JPEG', 'AA=='));
    await sheet.embedImage(pdf, new ImageConfig('IMAGE/PNG', 'AQ=='));

    expect(pdf.embedJpg).toHaveBeenCalled();
    expect(pdf.embedPng).toHaveBeenCalled();
  });

  test('embedImage converts other formats with canvas and pica', async () => {
    const pdf = fakePdf();
    const sheet = new TestSheet();
    const originalImage = (globalThis as any).Image;
    const originalDocument = (globalThis as any).document;
    const images: any[] = [];
    const canvases: any[] = [];

    class FakeImage {
      src = '';
      constructor() {
        images.push(this);
      }
    }
    (globalThis as any).Image = FakeImage;
    (globalThis as any).document = {
      createElement: jest.fn(() => {
        const context = { drawImage: jest.fn() };
        const canvas: any = {
          width: 0,
          height: 0,
          getContext: () => context,
        };
        canvases.push(canvas);
        return canvas;
      }),
    };
    picaMock.resize.mockResolvedValue({ width: 450, height: 450 });
    picaMock.toBlob.mockResolvedValue({
      arrayBuffer: async () => new Uint8Array([9]),
    });

    try {
      await sheet.embedImage(pdf, new ImageConfig('image/gif', 'AA=='));

      expect(images[0].src).toBe('data:image/gif;base64,AA==');
      expect(canvases).toHaveLength(2);
      expect(canvases[0].getContext().drawImage).toHaveBeenCalled();
      expect(picaMock.resize).toHaveBeenCalled();
      expect(pdf.embedPng).toHaveBeenCalledWith(new Uint8Array([9]));
    } finally {
      (globalThis as any).Image = originalImage;
      (globalThis as any).document = originalDocument;
    }
  });

  test('writeCharacterDescription leaves the column unchanged when empty', async () => {
    const { page, fonts } = await createPdfFixture();
    const sheet = new TestSheet();
    sheet.fonts = fonts;
    const column = new Column(10, 20, 700, 400);
    const headingWriter = jest.fn() as any;

    const result = sheet.writeCharacterDescription(
      page,
      { description: '', version: 2 } as any,
      column,
      headingWriter,
    );

    expect(result).toBe(column);
    expect(headingWriter).not.toHaveBeenCalled();
  });

  test('writeCharacterDescription writes a single-line description', async () => {
    const { page, fonts } = await createPdfFixture();
    const sheet = new TestSheet();
    sheet.fonts = fonts;
    const drawText = jest.spyOn(page, 'drawText');
    const column = new Column(10, 20, 700, 400);
    const headingWriter = jest.fn() as any;

    const result = sheet.writeCharacterDescription(
      page,
      { description: 'A short bio', version: 2 } as any,
      column,
      headingWriter,
    );

    expect(headingWriter).toHaveBeenCalledWith(page, column, 2);
    expect(drawText).toHaveBeenCalled();
    expect(result).not.toBeNull();
  });

  test('writeCharacterDescription writes multiline descriptions', async () => {
    const { page, fonts } = await createPdfFixture();
    const sheet = new TestSheet();
    sheet.fonts = fonts;
    const drawText = jest.spyOn(page, 'drawText');

    sheet.writeCharacterDescription(
      page,
      { description: 'First line\nSecond line\nThird line', version: 2 } as any,
      new Column(10, 20, 700, 400),
      jest.fn() as any,
    );

    expect(drawText.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  test('writeCharacterDescription uses the default heading writer', async () => {
    const { pdf, page, fonts } = await createPdfFixture();
    const sheet = new TestSheet();
    sheet.fonts = fonts;
    sheet.headingFont = await pdf.embedFont(StandardFonts.Helvetica);
    const drawText = jest.spyOn(page, 'drawText');

    sheet.writeCharacterDescription(
      page,
      { description: 'Default heading', version: 2 } as any,
      new Column(10, 20, 700, 400),
    );

    expect(drawText).toHaveBeenCalled();
  });

  test('writeName does nothing for an empty name', async () => {
    const { pdf, page } = await createPdfFixture();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const drawSvgPath = jest.spyOn(page, 'drawSvgPath');
    const drawText = jest.spyOn(page, 'drawText');
    const sheet = new TestSheet();

    sheet.writeName(
      page,
      '',
      SimpleColor.from('#123456'),
      font,
      new Column(10, 20, 700, 400),
    );

    expect(drawSvgPath).not.toHaveBeenCalled();
    expect(drawText).not.toHaveBeenCalled();
  });

  test('writeName draws the name tab and uppercase text', async () => {
    const { pdf, page } = await createPdfFixture();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const drawSvgPath = jest.spyOn(page, 'drawSvgPath');
    const drawText = jest.spyOn(page, 'drawText');
    const sheet = new TestSheet();

    sheet.writeName(
      page,
      'Picard',
      SimpleColor.from('#123456'),
      font,
      new Column(10, 20, 700, 400),
    );

    expect(drawSvgPath).toHaveBeenCalledTimes(2);
    expect(drawText.mock.calls[0][0]).toBe('PICARD');
  });

  test('writeName widens the tab for long names', async () => {
    const { pdf, page } = await createPdfFixture();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const drawSvgPath = jest.spyOn(page, 'drawSvgPath');
    const sheet = new TestSheet();
    const column = new Column(10, 20, 700, 400);

    sheet.writeName(page, 'Picard', SimpleColor.from('#123456'), font, column);
    const shortPath = (drawSvgPath.mock.calls[0] as any[])[0];
    drawSvgPath.mockClear();

    sheet.writeName(
      page,
      'Jean-Luc Picard of the USS Enterprise',
      SimpleColor.from('#123456'),
      font,
      column,
    );
    const longPath = (drawSvgPath.mock.calls[0] as any[])[0];

    expect(longPath).not.toBe(shortPath);
  });

  const withAbility = (
    character: Character,
    talentNames: string[] = [],
    selectedTalent?: SelectedTalent,
  ) => {
    const speciesStep = new SpeciesStep(Species.Betazoid);
    speciesStep.ability = new SpeciesAbility(
      Species.Betazoid,
      undefined,
      talentNames,
    );
    speciesStep.abilityOptions = new SpeciesAbilityOptions();
    speciesStep.talent = selectedTalent;
    character.speciesStep = speciesStep;
    return character;
  };

  const firstReadable = (character: Character) =>
    (assembleWritableItems(character) as ReadableTalentModel[])[0];

  test('ignores a secondary role when no primary role is set', () => {
    const character = newCharacter();
    character.role = null;
    character.secondaryRole = 2;

    expect(assembleWritableItems(withTalents(character, []))).toEqual([]);
  });

  test('includes a species ability when no talent is selected', () => {
    const items = assembleWritableItems(withAbility(newCharacter()));

    expect(items.some((item) => item instanceof SpeciesAbilityAndOptions)).toBe(
      true,
    );
  });

  test('excludes a species ability when a non-selectable talent is selected', () => {
    const character = withAbility(
      newCharacter(),
      [],
      new SelectedTalent(TALENT_NAME_BOLD),
    );

    expect(
      assembleWritableItems(character).some(
        (item) => item instanceof SpeciesAbilityAndOptions,
      ),
    ).toBe(false);
  });

  test('includes a species ability that supports talent selection', () => {
    const character = withAbility(
      newCharacter(),
      [TALENT_NAME_BOLD],
      new SelectedTalent(TALENT_NAME_BOLD),
    );

    expect(
      assembleWritableItems(character).some(
        (item) => item instanceof SpeciesAbilityAndOptions,
      ),
    ).toBe(true);
  });

  test('deduplicates talents and assigns their rank', () => {
    const ranked = TalentsHelper.getTalents().find((t) => t.maxRank > 1);
    expect(ranked).toBeDefined();
    const character = withTalents(newCharacter(), [
      new SelectedTalent(ranked.name),
      new SelectedTalent(ranked.name),
    ]);

    const items = assembleWritableItems(character) as ReadableTalentModel[];

    expect(items).toHaveLength(1);
    expect(items[0].rank).toBeGreaterThanOrEqual(2);
  });

  test('populates custom talent names and descriptions', () => {
    const custom = new SelectedTalent('Custom Talent');
    custom.customTalentName = 'Advanced Transporters';
    custom.customTalentDescription = 'Custom description';
    const readable = firstReadable(withTalents(newCharacter(), [custom]));

    expect(readable.customTalentName).toBe('Advanced Transporters');
    expect(readable.customTalentDescription).toBe('Custom description');
  });

  test('populates Borg implant models', () => {
    const character = setImplants(newCharacter(), [BorgImplantType.ExoPlating]);
    const readable = firstReadable(
      withTalents(character, [new SelectedTalent(TALENT_NAME_BORG_IMPLANTS)]),
    );

    expect(readable.implants).toHaveLength(1);
  });

  test('populates the Untapped Potential attribute', () => {
    const character = newCharacter();
    character.version = 2;
    const careerTalent = new SelectedTalent(TALENT_NAME_BOLD);
    careerTalent.attribute = Attribute.Control;
    (character as any).careerStep = { talent: careerTalent };
    const readable = firstReadable(
      withTalents(character, [
        new SelectedTalent(TALENT_NAME_UNTAPPED_POTENTIAL),
      ]),
    );

    expect(readable.attributes).toEqual([Attribute.Control]);
  });

  test("populates Warrior's Spirit selection", () => {
    const talent = new SelectedTalent(TALENT_NAME_WARRIORS_SPIRIT);
    talent.selection = 'Battle-hardened';
    const readable = firstReadable(withTalents(newCharacter(), [talent]));

    expect(readable.selection).toBe('Battle-hardened');
  });

  test('populates Augmented Ability attributes from every selection', () => {
    const control = new SelectedTalent(TALENT_NAME_AUGMENTED_ABILITY);
    control.attribute = Attribute.Control;
    const fitness = new SelectedTalent(TALENT_NAME_AUGMENTED_ABILITY);
    fitness.attribute = Attribute.Fitness;
    const readable = firstReadable(
      withTalents(newCharacter(), [control, fitness]),
    );

    expect(readable.attributes).toEqual([Attribute.Control, Attribute.Fitness]);
  });

  test('populates department talents from every selection', () => {
    const bold = new SelectedTalent(TALENT_NAME_BOLD);
    bold.department = Department.Engineering;
    const cautious = new SelectedTalent(TALENT_NAME_CAUTIOUS);
    cautious.department = Department.Command;
    const collaboration = new SelectedTalent(TALENT_NAME_COLLABORATION);
    collaboration.department = Department.Science;
    const doctor = new SelectedTalent(TALENT_NAME_IM_A_DOCTOR_NOT_A);
    doctor.department = Department.Medicine;
    const items = assembleWritableItems(
      withTalents(newCharacter(), [bold, cautious, collaboration, doctor]),
    ) as ReadableTalentModel[];

    expect(items).toHaveLength(4);
    expect(items.every((item) => item.departments?.length === 1)).toBe(true);
  });

  test('populates Extraordinary Attribute X attributes and x', () => {
    const attribute = new SelectedTalent(TALENT_NAME_EXTRAORDINARY_ATTRIBUTE_X);
    attribute.attribute = Attribute.Insight;
    const qualifier = new SelectedTalent(TALENT_NAME_EXTRAORDINARY_ATTRIBUTE_X);
    qualifier.x = 2;
    const readable = firstReadable(
      withTalents(newCharacter(), [attribute, qualifier]),
    );

    expect(readable.attributes).toEqual([Attribute.Insight]);
    expect(readable.x).toBe(2);
  });

  test('populates x for generic X-qualified talents', () => {
    const talent = new SelectedTalent(TALENT_NAME_INITIATIVE_X);
    talent.x = 3;
    const readable = firstReadable(withTalents(newCharacter(), [talent]));

    expect(readable.x).toBe(3);
  });

  test('sets the mission pod model for starships', () => {
    const starship = Starship.createStandardStarship(
      Era.NextGeneration,
      CharacterType.Starfleet,
      2,
    );
    starship.missionPodModel = MissionPodHelper.instance().getMissionPodByName(
      MissionPod[MissionPod.Sensors],
      2,
    );
    starship.additionalTalents = [new SelectedTalent(TALENT_NAME_MISSION_POD)];

    const items = assembleStarshipTalents(
      starship,
      true,
    ) as ReadableTalentModel[];
    const missionPod = items.find(
      (item) => item.talent.name === TALENT_NAME_MISSION_POD,
    );

    expect(missionPod?.missionPod).toBe(starship.missionPodModel);
  });

  test('does not set a mission pod model for stations', () => {
    const station = Station.create(
      CharacterType.Starfleet,
      2,
      Era.NextGeneration,
    );
    station.additionalTalents = [new SelectedTalent(TALENT_NAME_MISSION_POD)];

    const items = assembleStarshipTalents(
      station,
      true,
    ) as ReadableTalentModel[];
    const missionPod = items.find(
      (item) => item.talent.name === TALENT_NAME_MISSION_POD,
    );

    expect(missionPod).toBeDefined();
    expect(missionPod?.missionPod).toBeUndefined();
  });

  test('returns service record talents only with special rules', () => {
    const starship = Starship.createStandardStarship(
      Era.NextGeneration,
      CharacterType.Starfleet,
      2,
    );
    starship.additionalTalents = [
      SelectedTalent.createWithSystem(
        'Upgraded Systems (Service Record)',
        System.Engines,
      ),
    ];

    const regular = assembleStarshipTalents(
      starship,
      false,
    ) as ReadableTalentModel[];
    const special = assembleStarshipTalents(
      starship,
      true,
    ) as ReadableTalentModel[];

    expect(regular).toHaveLength(0);
    expect(special[0].system).toBe(System.Engines);
  });

  test('assigns rank for multi-rank starship talents', () => {
    const ranked = TalentsHelper.getTalents().find((t) => t.maxRank > 1);
    const talent = new SelectedTalent(ranked.name);
    talent.multiple = 2;
    const starship = Starship.createStandardStarship(
      Era.NextGeneration,
      CharacterType.Starfleet,
      2,
    );
    starship.additionalTalents = [talent];

    const items = assembleStarshipTalents(starship) as ReadableTalentModel[];

    expect(items[0].rank).toBeGreaterThanOrEqual(2);
  });

  test('deduplicates repeated starship talents', () => {
    const starship = Starship.createStandardStarship(
      Era.NextGeneration,
      CharacterType.Starfleet,
      2,
    );
    starship.additionalTalents = [
      new SelectedTalent('Improved Power Systems'),
      new SelectedTalent('Improved Power Systems'),
    ];

    expect(assembleStarshipTalents(starship)).toHaveLength(1);
  });

  test('populates custom starship talent names and descriptions', () => {
    const custom = new SelectedTalent('Custom Talent');
    custom.customTalentName = 'Anti-Cloak Sensors';
    custom.customTalentDescription = 'Custom description';
    const starship = Starship.createStandardStarship(
      Era.NextGeneration,
      CharacterType.Starfleet,
      2,
    );
    starship.additionalTalents = [custom];

    const items = assembleStarshipTalents(starship) as ReadableTalentModel[];

    expect(items[0].customTalentName).toBe('Anti-Cloak Sensors');
    expect(items[0].customTalentDescription).toBe('Custom description');
  });
});
