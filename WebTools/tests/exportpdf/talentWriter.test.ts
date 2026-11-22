import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import { PDFDocument, StandardFonts } from '@cantoo/pdf-lib';
import i18next from 'i18next';
import '../../src/helpers/species';
import { Column } from '../../src/exportpdf/column';
import { FontLibrary, FontType } from '../../src/exportpdf/fontLibrary';
import { FontSpecification } from '../../src/exportpdf/fontSpecification';
import { SimpleColor } from '../../src/common/colour';
import { CharacterType } from '../../src/common/characterType';
import { Attribute } from '../../src/helpers/attributes';
import { Department } from '../../src/helpers/department';
import { System } from '../../src/helpers/systems';
import { AttackType } from '../../src/common/attackType';
import { SpecialWeapon } from '../../src/common/specialWeapon';
import { PropulsionSystemType } from '../../src/helpers/propulsionSystem';
import { SelectedTalent } from '../../src/common/selectedTalent';
import { TalentsHelper } from '../../src/helpers/talents';
import { RoleModel, RolesHelper } from '../../src/helpers/roles';
import { SpeciesAbility } from '../../src/helpers/speciesAbility';
import { BorgImplantType, BorgImplants } from '../../src/helpers/borgImplant';
import { MissionPodHelper, MissionPod } from '../../src/helpers/missionPods';
import {
  ReadableTalentModel,
  TalentWriter,
} from '../../src/exportpdf/talentWriter';
import { SpeciesAbilityAndOptions } from '../../src/exportpdf/generatedsheet';
import translations from '../../src/i18n/locales/en/translations.json';

jest.mock('../../src/state/store', () => ({
  store: {
    getState: () => ({ context: { sources: [1] } }),
    dispatch: () => undefined,
  },
}));

beforeAll(async () => {
  await i18next.init({
    lng: 'en',
    resources: { en: { translation: translations } },
  });
});

const createFixture = async () => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([600, 800]);
  const fonts = new FontLibrary();
  fonts.addFont(
    FontType.Standard,
    await pdf.embedFont(StandardFonts.Helvetica),
  );
  fonts.addFont(
    FontType.Bold,
    await pdf.embedFont(StandardFonts.HelveticaBold),
  );
  fonts.addFont(
    FontType.Italic,
    await pdf.embedFont(StandardFonts.HelveticaOblique),
  );
  fonts.addFont(
    FontType.BoldItalic,
    await pdf.embedFont(StandardFonts.HelveticaBoldOblique),
  );
  fonts.addFont(FontType.Symbol, await pdf.embedFont(StandardFonts.Symbol));
  fonts.addFont(
    FontType.Heading,
    await pdf.embedFont(StandardFonts.TimesRomanBold),
  );
  return { page, fonts };
};

const talentModel = (name: string) => TalentsHelper.getTalent(name);

describe('TalentWriter', () => {
  test('writes role talents', async () => {
    const { page, fonts } = await createFixture();
    const writer = new TalentWriter(
      page,
      fonts,
      2,
      SimpleColor.from('#111111'),
    );
    const role = RolesHelper.instance.getRoleModelByName('Commanding Officer');
    const column = new Column(20, 20, 700, 400);

    const result = await writer.writeTalents(role ? [role] : [], column);

    expect(result).toBeDefined();
  });

  test('writes custom and x-qualified talents', async () => {
    const { page, fonts } = await createFixture();
    const writer = new TalentWriter(
      page,
      fonts,
      2,
      SimpleColor.from('#111111'),
      true,
    );
    const custom = new ReadableTalentModel(
      CharacterType.Starfleet,
      talentModel('Custom Talent'),
    );
    custom.customTalentName = 'Custom';
    custom.customTalentDescription = 'Line one\nLine two';
    custom.additionalInformation = 'note';

    const extra = new ReadableTalentModel(
      CharacterType.Starfleet,
      talentModel('Extraordinary Attribute X'),
    );
    extra.attributes = [Attribute.Control];
    extra.x = 2;

    const column = new Column(20, 20, 700, 400);
    const bullets: any[] = [];
    await writer.writeTalents([custom, extra], column, 9, 10, 5, (p) =>
      bullets.push(p),
    );

    expect(bullets.length).toBeGreaterThan(0);
  });

  test('writes species ability options and implants', async () => {
    const { page, fonts } = await createFixture();
    const writer = new TalentWriter(page, fonts, 2);
    const ability = { name: 'Test Ability', description: 'Description' } as any;
    const item = new SpeciesAbilityAndOptions(ability, {
      implants: [BorgImplantType.CorticalArrayCorticalNode],
    } as any);

    const result = await writer.writeTalents(
      [item],
      new Column(20, 20, 700, 400),
    );
    expect(result).toBeDefined();
  });

  test('writes talent-specific selection branches', async () => {
    const { page, fonts } = await createFixture();
    const writer = new TalentWriter(page, fonts, 2);
    const mk = (name: string) =>
      new ReadableTalentModel(CharacterType.Starfleet, talentModel(name));

    const borg = mk('Borg Implants');
    borg.implants = [
      BorgImplants.instance.getImplantByType(
        BorgImplantType.CorticalArrayCorticalNode,
      ),
    ];

    const untapped = mk('Untapped Potential');
    untapped.attributes = [Attribute.Insight];

    const missionPod = mk('Mission Pod');
    missionPod.missionPod = MissionPodHelper.instance().getMissionPodByName(
      MissionPod[MissionPod.Sensors],
      2,
    );

    const propulsion = mk('Additional Propulsion System');
    propulsion.selection = PropulsionSystemType.QuantumSlipstreamDrive;

    const warriors = mk("Warrior's Spirit");
    warriors.selection = SpecialWeapon.BatLeth;

    const defensive = mk('Defensive Training');
    defensive.selection = AttackType.Melee;

    const collab = mk('Collaboration');
    collab.departments = [Department.Command];

    const dedicated = mk('Dedicated Personnel');
    dedicated.departments = [Department.Engineering];

    const redundant = mk('Redundant Systems');
    redundant.selection = 'Backup Power';

    const redundantSys = mk('Redundant Systems');
    redundantSys.system = System.Structure;

    const service = mk('Upgraded Systems (Service Record)');
    service.system = System.Comms;

    const talents = [
      borg,
      untapped,
      missionPod,
      propulsion,
      warriors,
      defensive,
      collab,
      dedicated,
      redundant,
      redundantSys,
      service,
    ].filter((t) => t.talent != null);

    const result = await writer.writeTalents(
      talents,
      new Column(20, 20, 700, 500),
      9,
      10,
      2,
    );
    expect(result).toBeDefined();
  });

  test('writeTalentsPageArea returns a page area', async () => {
    const { page, fonts } = await createFixture();
    const writer = new TalentWriter(page, fonts, 2);
    const custom = new ReadableTalentModel(
      CharacterType.Starfleet,
      talentModel('Custom Talent'),
    );
    custom.customTalentName = 'Custom';
    custom.customTalentDescription = 'Desc';

    const area = await writer.writeTalentsPageArea(
      [custom],
      new Column(20, 20, 700, 400),
    );
    expect(area).toBeDefined();
    expect(area.page).toBe(page);
  });
});
