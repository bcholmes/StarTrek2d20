import type { Character } from '../common/character';
import type { CharacterType } from '../common/characterType';
import { CharacterTypeModel } from '../common/characterType';
import { Attribute, AttributesHelper } from '../helpers/attributes';
import { DepartmentsHelper, Department } from '../helpers/department';
import type {
  PDFCheckBox,
  PDFDocument,
  PDFFont,
  PDFForm,
  PDFPage,
} from '@cantoo/pdf-lib';
import { PDFTextField, rgb, StandardFonts } from '@cantoo/pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { CharacterSerializer } from '../common/characterSerializer';
import { Era } from '../helpers/erasEnum';
import { System } from '../helpers/systems';
import type { Weapon } from '../helpers/weapons';
import { CareerEventsHelper } from '../helpers/careerEvents';
import type { Construct } from '../common/construct';
import { Stereotype } from '../common/construct';
import type { Starship } from '../common/starship';
import { staTextFieldAppearanceProvider } from '../helpers/pdfTextFieldAppearance';
import { CareersHelper } from '../helpers/careers';
import { TracksHelper } from '../helpers/tracks';
import { localizedFocus } from '../components/focusHelper';
import { XYLocation } from '../common/xyLocation';
import type { ICharacterSheet } from './icharactersheet';
import { SheetTag } from './icharactersheet';
import { BasicGeneratedHalfPageCharacterSheet } from './generated2eHalfPageSheet';
import { FontSpecification } from './fontSpecification';
import { LandscapeGeneratedCharacterSheet } from './landscapeGeneratedCharacterSheet';
import { Generated2eStarshipSheet } from './generated2eStarshipSheet';
import { GeneratedTngPortraitCharacterSheet } from './generatedTngPortraitCharacterSheet';
import { Column } from './column';
import { GeneratedTngPortraitA4CharacterSheet } from './generatedTngPortraitA4CharacterSheet';
import { Standard2eCharacterSheet } from './standard2eCharacterSheet';
import { FontLibrary, FontType } from './fontLibrary';
import { TalentWriter } from './talentWriter';
import { assembleWritableItems } from './generatedsheet';
import { WeaponDescriber } from './weaponDescriber';
import { Landscape2eCharacterSheet } from './landscape2eCharacterSheet';
import { Standard2eStarshipSheet } from './standard2eStarshipSheet';
import { BasicGeneratedTentCardCharacterSheet } from './generated2eTentCard';
import { Landscape2eCreatureSheet } from './landscape2eCreatureSheet';
import type { Station } from '../common/station';
import { Portrait2eStationSheet } from './portrait2eStationSheet';
import { Implant } from '../helpers/borgImplant';
import { isKlingonWarriorType } from '../helpers/klingonWarrior';
import { BasicGeneratedPortraitCharacterSheet } from './generated2ePortraitSheet';

abstract class BasicSheet implements ICharacterSheet {
  formFont: PDFFont;

  getLanguage(): string {
    return 'en';
  }
  getName(): string {
    throw new Error('Method not implemented.');
  }
  getThumbnailUrl(): string {
    throw new Error('Method not implemented.');
  }
  getPdfUrl(type: CharacterType): string {
    throw new Error('Method not implemented.');
  }

  getDefaultFontPath() {
    return '/static/font/bebas-neue-cyr.ttf';
  }

  getTags() {
    return [];
  }

  async initializeFonts(pdf: PDFDocument) {
    pdf.registerFontkit(fontkit);
    const lcarsFontBytes = await fetch(this.getDefaultFontPath()).then((res) =>
      res.arrayBuffer(),
    );
    const lcarsFont = await pdf.embedFont(lcarsFontBytes);
    this.formFont = lcarsFont;
    const form = pdf.getForm();
    const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
    form.updateFieldAppearances = function () {
      return rawUpdateFieldAppearances(lcarsFont);
    };
  }

  async populate(pdf: PDFDocument, construct: Construct) {
    await this.initializeFonts(pdf);
    const form = pdf.getForm();
    if (construct.name) {
      pdf.setTitle(construct.name);
    }
    this.populateForm(form, construct);
  }

  populateForm(form: PDFForm, construct: Construct) {}

  fillField(form: PDFForm, name: string, value: string | number) {
    if (value != null) {
      try {
        const field = form.getTextField(name);
        if (field) {
          field.setText('' + value);
        }
      } catch (e) {
        // ignore it
      }
    }
  }
  createFileName(suffix: string, construct: Construct): string {
    if (construct.name == null || construct.name.length === 0) {
      return suffix + '.pdf';
    } else {
      const escaped = construct.name
        .replace(/\\/g, '_')
        .replace(/\//g, '_')
        .replace(/\s/g, '_');
      return escaped + '-' + suffix + '.pdf';
    }
  }

  fillWeapons(form: PDFForm, construct: Construct) {
    const weapons = construct.determineWeapons();
    weapons.forEach((w, i) => {
      this.fillWeapon(form, w, i + 1, construct);
    });
  }

  fillWeapon(
    form: PDFForm,
    weapon: Weapon,
    index: number,
    construct: Construct,
  ) {
    this.fillField(form, 'Weapon ' + index + ' name', weapon.name);
    this.fillField(
      form,
      'Weapon ' + index + ' dice',
      weapon.dice == null ? '' : '' + construct.getDiceForWeapon(weapon),
    );
    this.fillField(
      form,
      'Weapon ' + index + ' qualities',
      weapon.effectsAndQualitiesAsString,
    );
  }

  fillCheckbox(form: PDFForm, name: string, value: boolean) {
    try {
      const field = form.getCheckBox(name);
      this.fillCheckboxValue(form, field, value);
    } catch (e) {
      // ignore it
    }
  }

  fillCheckboxValue(form: PDFForm, field: PDFCheckBox, value: boolean) {
    if (field) {
      if (value) {
        form.removeField(field);
      } else {
        field.uncheck();
      }
    }
  }
}

abstract class BasicStarshipSheet extends BasicSheet {
  populateForm(form: PDFForm, construct: Construct) {
    const starship = construct as Starship;
    this.fillField(form, 'Name', starship.name);
    if (starship.serviceYear != null) {
      this.fillField(form, 'Service Date', starship.serviceYear.toString());
    }
    if (isKlingonWarriorType(starship.type)) {
      this.fillField(form, 'Designation', 'N/A');
    } else {
      this.fillField(form, 'Designation', starship.registry);
    }

    this.fillField(form, 'Space Frame', starship.localizedClassName);
    if (starship.scale) {
      this.fillField(form, 'Scale', starship.scale.toString());
    }
    this.fillField(form, 'Traits', starship.getAllTraits());
    const missionProfile = starship.missionProfileStep?.type;
    if (missionProfile) {
      this.fillField(form, 'Mission Profile', missionProfile.localizedName);
    }

    const power = starship.power;
    if (power) {
      this.fillField(
        form,
        'Power Total',
        starship.power == null ? '' : power.toString(),
      );
    }
    if (starship.scale) {
      this.fillField(form, 'Resistance', starship.resistance);
      this.fillField(form, 'Crew Total', starship.crewSupport);
    }

    if (starship.shields != null) {
      this.fillShields(form, starship.shields);
    }

    this.fillRefits(form, starship);
    this.fillSystems(form, starship);
    this.fillDepartments(form, starship);
    this.fillTalents(form, starship);
    this.fillWeapons(form, construct);
  }

  fillRefits(form: PDFForm, starship: Starship) {
    this.fillField(form, 'Refit', starship.refitsAsString());
  }

  isSpecialRuleSectionAvailable(form: PDFForm) {
    try {
      form.getTextField('Special Rule 1');
      return true;
    } catch (e) {
      return false;
    }
  }

  fillTalents(form: PDFForm, starship: Starship) {
    let talents = starship.rankedTalents.map((t) => t.displayNameWithMultiple);
    let specialRules = [];
    if (this.isSpecialRuleSectionAvailable(form)) {
      talents = starship.rankedTalents
        .filter((t) => !t.talentModel.isSpecialRule(starship.version))
        .map((t) => t.displayNameWithMultiple);
      specialRules = starship.rankedTalents
        .filter((t) => t.talentModel.isSpecialRule(starship.version))
        .map((t) => t.displayNameWithMultiple);
    }

    let i = 1;
    for (const t of talents) {
      this.fillField(form, 'Talent ' + i, t);
      i++;
    }

    i = 1;
    for (const s of specialRules) {
      if (s === 'Mission Pod' && starship.missionPodModel != null) {
        this.fillField(
          form,
          'Special Rule ' + i,
          s + ': ' + starship.missionPodModel.name,
        );
      } else {
        this.fillField(form, 'Special Rule ' + i, s);
      }
      i++;
    }
  }

  fillShields(form: PDFForm, shields: number) {
    for (let i = 1; i <= 30; i++) {
      this.fillCheckbox(form, 'Shields ' + i, i > shields);
    }
  }

  fillSystems(form: PDFForm, construct: Construct) {
    const starship = construct as Starship;
    this.fillFieldWithNumber(
      form,
      'Engines',
      starship.getSystemValue(System.Engines),
    );
    this.fillFieldWithNumber(
      form,
      'Structure',
      starship.getSystemValue(System.Structure),
    );
    this.fillFieldWithNumber(
      form,
      'Computers',
      starship.getSystemValue(System.Computer),
    );
    this.fillFieldWithNumber(
      form,
      'Sensors',
      starship.getSystemValue(System.Sensors),
    );
    this.fillFieldWithNumber(
      form,
      'Weapons',
      starship.getSystemValue(System.Weapons),
    );
    this.fillFieldWithNumber(
      form,
      'Communications',
      starship.getSystemValue(System.Comms),
    );
  }

  fillDepartments(form: PDFForm, construct: Construct) {
    const starship = construct as Starship;
    this.fillFieldWithNumber(
      form,
      'Command',
      starship.departments[Department.Command],
    );
    this.fillFieldWithNumber(
      form,
      'Conn',
      starship.departments[Department.Conn],
    );
    this.fillFieldWithNumber(
      form,
      'Security',
      starship.departments[Department.Security],
    );
    this.fillFieldWithNumber(
      form,
      'Engineering',
      starship.departments[Department.Engineering],
    );
    this.fillFieldWithNumber(
      form,
      'Science',
      starship.departments[Department.Science],
    );
    this.fillFieldWithNumber(
      form,
      'Medicine',
      starship.departments[Department.Medicine],
    );
  }

  fillFieldWithNumber(form: PDFForm, name: string, value: number) {
    if (value != null) {
      this.fillField(form, name, value.toString());
    }
  }

  fillWeapon(
    form: PDFForm,
    weapon: Weapon,
    index: number,
    construct: Construct,
  ) {
    this.fillField(form, 'Weapon ' + index + ' name', weapon.name);
    this.fillField(
      form,
      'Weapon ' + index + ' dice',
      '' + construct.getDiceForWeapon(weapon),
    );
    this.fillField(
      form,
      'Weapon ' + index + ' qualities',
      weapon.effectsAndQualitiesAsString,
    );
  }
}

class CaptainsLogStarshipSheet extends BasicStarshipSheet {
  getName(): string {
    return "Captain's Log Half-Page Sheet";
  }
  getThumbnailUrl(): string {
    return "/static/img/sheets/STA_Captain's_Log_Half-Page_Starship.png";
  }
  getPdfUrl(type: CharacterType): string {
    return "/static/pdf/STA_Captain's_Log_Half-Page_Starship.pdf";
  }

  async populate(pdf: PDFDocument, construct: Construct) {
    await super.populate(pdf, construct);
    const starship = construct as Starship;

    const { SheetOutlineOptions, SpaceframeOutline } = await import(
      /* webpackChunkName: 'spaceframeOutline' */ '../helpers/spaceframeOutlineHelper'
    );
    SpaceframeOutline.draw(
      pdf,
      new SheetOutlineOptions(
        new XYLocation(314.0, 216),
        rgb(119.0 / 255, 117.0 / 255.0, 90.0 / 255.0),
        0.6,
        1,
      ),
      starship,
    );
  }
}

class StandardTngStarshipSheet extends BasicStarshipSheet {
  getName(): string {
    return 'TNG Standard Starship Sheet (Landscape)';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/TNG_Standard_Starship_Sheet.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/TNG_Standard_Starship_Sheet_no_outline.pdf';
  }

  getTags(): SheetTag[] {
    return [SheetTag.Landscape, SheetTag.Lcars, SheetTag.UsLetter];
  }

  async populate(pdf: PDFDocument, construct: Construct) {
    await super.populate(pdf, construct);
    const starship = construct as Starship;

    const { SheetOutlineOptions, SpaceframeOutline } = await import(
      /* webpackChunkName: 'spaceframeOutline' */ '../helpers/spaceframeOutlineHelper'
    );
    SpaceframeOutline.draw(
      pdf,
      new SheetOutlineOptions(
        new XYLocation(43.5, 290.25),
        rgb(245.0 / 255, 157.0 / 255.0, 8.0 / 255.0),
      ),
      starship,
    );
  }
}

class StandardTosStarshipSheet extends BasicStarshipSheet {
  getName(): string {
    return 'TOS Standard Starship Sheet (Landscape)';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/TOS_Standard_Starship_Sheet.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/STA_TOS_Starship_Sheet.pdf';
  }

  getTags(): SheetTag[] {
    return [SheetTag.Landscape];
  }

  async populate(pdf: PDFDocument, construct: Construct) {
    await super.populate(pdf, construct);
    const starship = construct as Starship;

    const { SheetOutlineOptions, SpaceframeOutline } = await import(
      /* webpackChunkName: 'spaceframeOutline' */ '../helpers/spaceframeOutlineHelper'
    );
    SpaceframeOutline.draw(
      pdf,
      new SheetOutlineOptions(
        new XYLocation(32, 240.0),
        rgb(237.0 / 255, 27.0 / 255.0, 47.0 / 255.0),
        0.85,
      ),
      starship,
    );
  }
}

class StandardKlingonStarshipSheet extends BasicStarshipSheet {
  getName(): string {
    return 'Klingon Starship Sheet (Landscape)';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/STA_Klingon_Starship_Sheet.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/STA_Klingon_Starship_Sheet_revised.pdf';
  }

  getTags(): SheetTag[] {
    return [SheetTag.Landscape];
  }
}

abstract class BasicShortCharacterSheet extends BasicSheet {
  getName(): string {
    throw new Error('Method not implemented.');
  }
  getThumbnailUrl(): string {
    throw new Error('Method not implemented.');
  }
  getPdfUrl(type: CharacterType): string {
    throw new Error('Method not implemented.');
  }
  async populate(pdf: PDFDocument, construct: Construct) {
    await this.initializeFonts(pdf);
    const form = pdf.getForm();
    if (construct.name) {
      pdf.setTitle(construct.name);
    }
    this.populateForm(form, construct);
  }

  serializeAssignment(character: Character) {
    let result = this.serializeBasicAssignment(character);
    if (character.assignedShip != null) {
      if (result) {
        result += ', ';
      } else {
        result = '';
      }
      result += character.assignedShip;
    }
    return result;
  }

  serializeBasicAssignment(character: Character) {
    return character.localizedAssignmentWithoutShip;
  }

  fillRank(form: PDFForm, character: Character) {
    this.fillField(form, 'Rank', character.rank?.name);
  }

  fillSpecies(form: PDFForm, character: Character) {
    this.fillField(form, 'Species', character.speciesName);
  }

  populateForm(form: PDFForm, construct: Construct) {
    const character = construct as Character;
    this.fillName(form, character);
    this.fillField(form, 'Department', this.serializeAssignment(character));
    this.fillField(form, 'Purpose', this.serializeAssignment(character));
    this.fillRank(form, character);
    this.fillSpecies(form, character);
    const traits = character.baseTraits;
    if (character.additionalTraits) {
      traits.push(character.additionalTraits);
    }
    this.fillField(form, 'Traits', character.getAllTraits());
    this.fillFocuses(form, character);
    this.fillAttributes(form, character);
    this.fillSkills(form, character);
    this.fillExtras(form, character);
    this.fillStress(form, character);
  }

  fillFocuses(form: PDFForm, character: Character) {
    character.focuses.forEach((f, i) => {
      this.fillField(form, 'Focus ' + (i + 1), f);
    });
  }

  fillName(form: PDFForm, character: Character) {
    this.fillField(form, 'Name', this.formatName(character));
  }

  formatNameWithoutPronouns(character: Character) {
    return CharacterSerializer.serializeName(character);
  }

  formatName(character: Character) {
    let name = this.formatNameWithoutPronouns(character);
    if (character?.pronouns?.length > 0) {
      name += ' (' + character.pronouns + ')';
    }
    return name;
  }

  fillExtras(form: PDFForm, character: Character) {
    this.fillField(form, 'Resistance', '' + character.resistance);
    this.fillField(form, 'Reputation', '' + character.reputation);
    this.fillField(form, 'Reprimands', '' + character.reprimands);
  }

  fillStress(form: PDFForm, character: Character) {
    const stress = character.stress;
    for (let i = 1; i <= 30; i++) {
      this.fillCheckbox(form, 'Stress ' + i, i > stress);
    }
  }

  fillAttributes(form: PDFForm, character: Character) {
    const attributes = character.attributes;
    AttributesHelper.getAllAttributes().forEach((a, i) => {
      switch (a) {
        case Attribute.Control:
          this.fillField(form, 'Control', '' + attributes[a]);
          break;
        case Attribute.Fitness:
          this.fillField(form, 'Fitness', '' + attributes[a]);
          break;
        case Attribute.Presence:
          this.fillField(form, 'Presence', '' + attributes[a]);
          break;
        case Attribute.Daring:
          this.fillField(form, 'Daring', '' + attributes[a]);
          break;
        case Attribute.Insight:
          this.fillField(form, 'Insight', '' + attributes[a]);
          break;
        case Attribute.Reason:
          this.fillField(form, 'Reason', '' + attributes[a]);
          break;
        default:
          break;
      }
    });
  }

  fillSkills(form: PDFForm, character: Character) {
    const departments = character.departments;
    DepartmentsHelper.instance.getDepartments().forEach((d, i) => {
      switch (d) {
        case Department.Command:
          this.fillField(form, 'Command', '' + departments[d]);
          break;
        case Department.Security:
          this.fillField(form, 'Security', '' + departments[d]);
          break;
        case Department.Science:
          this.fillField(form, 'Science', '' + departments[d]);
          break;
        case Department.Conn:
          this.fillField(form, 'Conn', '' + departments[d]);
          break;
        case Department.Engineering:
          this.fillField(form, 'Engineering', '' + departments[d]);
          break;
        case Department.Medicine:
          this.fillField(form, 'Medicine', '' + departments[d]);
          break;
        default:
          break;
      }
    });
  }

  fillField(form: PDFForm, name: string, value: string) {
    try {
      const field = form.getTextField(name);
      if (field) {
        field.setText(value);
      }
    } catch (e) {
      // ignore it
    }
  }

  fillCheckbox(form: PDFForm, name: string, value: boolean) {
    try {
      const field = form.getCheckBox(name);
      if (field) {
        if (value) {
          field.check();
        } else {
          field.uncheck();
        }
      }
    } catch (e) {
      // ignore it
    }
  }
}

abstract class BasicFullCharacterSheet extends BasicShortCharacterSheet {
  populateForm(form: PDFForm, construct: Construct) {
    const character = construct as Character;
    super.populateForm(form, construct);

    const upbringing = character.upbringingStep;
    if (upbringing != null) {
      this.fillUpbringing(form, character);
    }
    this.fillField(form, 'Assignment', this.serializeAssignment(character));
    this.fillField(
      form,
      'Environment',
      CharacterSerializer.serializeEnvironment(
        character.environmentStep?.environment,
        character.environmentStep?.otherSpecies,
        character,
      ),
    );

    this.fillValues(form, character);
    this.fillTalents(form, character);
    this.fillEquipment(form, character);

    this.fillWeapons(form, construct);
  }

  fillWeapons(form: PDFForm, construct: Construct) {
    const weapons = construct.determineWeapons();
    const describer = new WeaponDescriber(construct.version, true);

    weapons.forEach((w, i) => {
      this.fillField(form, 'Weapon ' + (i + 1) + ' name', w.name);
      this.fillField(
        form,
        'Weapon ' + (i + 1) + ' dice',
        w.dice == null ? '' : '' + construct.getDiceForWeapon(w),
      );
      this.fillField(
        form,
        'Weapon ' + (i + 1) + ' qualities',
        describer.describe(w),
      );
    });
  }

  fillTalents(form: PDFForm, character: Character) {
    let i = 1;
    character.rankedTalents.forEach((t) => {
      const talent = t.talentModel;
      if (talent && talent.maxRank > 1) {
        this.fillField(form, 'Talent ' + i, t.displayNameWithMultiple);
      } else {
        this.fillField(form, 'Talent ' + i, t.displayName);
      }

      i++;
    });
  }

  fillEquipment(form: PDFForm, character: Character) {
    character.equipmentAndImplants.forEach((e, i) => {
      if (character.version > 1 && e instanceof Implant) {
        this.fillField(form, 'Equipment ' + (i + 1), e.localizedName2e);
      } else {
        this.fillField(form, 'Equipment ' + (i + 1), e.localizedName);
      }
    });
  }

  fillValues(form: PDFForm, character: Character) {
    character.values.forEach((v, i) => {
      this.fillField(form, 'Value ' + (i + 1), v);
    });
  }

  fillUpbringing(form: PDFForm, character: Character) {
    this.fillField(
      form,
      'Upbringing',
      character.upbringingStep.localizedDescription,
    );
  }

  fillRank(form: PDFForm, character: Character) {
    this.fillField(form, 'Rank', character.rank?.localizedName);
  }

  fillSpecies(form: PDFForm, character: Character) {
    this.fillField(form, 'Species', character.localizedSpeciesName);
  }

  fillFocuses(form: PDFForm, character: Character) {
    character.focuses.forEach((f, i) => {
      this.fillField(form, 'Focus ' + (i + 1), localizedFocus(f));
    });
  }
}

class HalfPageSupportingCharacterSheet extends BasicShortCharacterSheet {
  getName(): string {
    return 'Half-Page Supporting Character Sheet';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/TNG_Supporting_Character_Half_Page.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/TNG_Supporting_Character_Half_Page.pdf';
  }
  getTags(): SheetTag[] {
    return [SheetTag.HalfPage, SheetTag.Lcars];
  }
}

class RomulanCharacterSheet extends BasicFullCharacterSheet {
  getName(): string {
    return 'Romulan Character Sheet';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/Romulan.Char.Sheet_v2_1.page_fillable.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/Romulan.Char.Sheet_v2_1.page_fillable.pdf';
  }

  fillCheckbox(form: PDFForm, name: string, value: boolean) {
    try {
      const field = form.getCheckBox(name);
      this.fillCheckboxValue(form, field, value);
    } catch (e) {
      // ignore it
    }
  }

  fillCheckboxValue(form: PDFForm, field: PDFCheckBox, value: boolean) {
    if (field) {
      if (value) {
        form.removeField(field);
      } else {
        field.uncheck();
      }
    }
  }
}

class StandardGermanCharacterSheet extends BasicFullCharacterSheet {
  getLanguage(): string {
    return 'de';
  }
  getName(): string {
    return 'German TNG Character Sheet (A4)';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/TNG_StarTrek_de_Charakter.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/TNG_StarTrek_de_Charakter.pdf';
  }
}

// todo deprecate and remove after universal pdf file will be ready
class StandardRussianCharacterSheet extends BasicFullCharacterSheet {
  getLanguage(): string {
    return 'ru';
  }
  getName(): string {
    return 'Russian TNG Character Sheet';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/TNG_StarTrek_ru_Character_Sheet.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/TNG_StarTrek_ru_Character_Sheet.pdf';
  }
}

class StandardTosCharacterSheet extends BasicFullCharacterSheet {
  getName(): string {
    return 'TOS Character Sheet (Landscape)';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/TOS_Standard_Character_Sheet.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/TOS_Standard_Character_Sheet.pdf';
  }
  getTags(): SheetTag[] {
    return [SheetTag.Landscape];
  }
}

class KlingonCharacterSheet extends BasicFullCharacterSheet {
  getName(): string {
    return 'Klingon Character Sheet';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/STA_Klingon_Character_Sheet.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/STA_Klingon_Character_Sheet.pdf';
  }

  getTags(): SheetTag[] {
    return [SheetTag.Portrait, SheetTag.UsLetter];
  }

  populateForm(form: PDFForm, construct: Construct) {
    super.populateForm(form, construct);

    this.fillField(form, 'House', (construct as Character).house);
  }

  formatNameWithoutPronouns(character) {
    let result = character.name;
    if (character.lineage) {
      result += ', ' + character.lineage;
    }
    return result;
  }
}

class BaseTextCharacterSheet extends BasicFullCharacterSheet {
  fonts: FontLibrary = new FontLibrary();

  async initializeFonts(pdf: PDFDocument) {
    await super.initializeFonts(pdf);

    const standardFontBytes = await fetch(
      '/static/font/OpenSansCondensed-Light.ttf',
    ).then((res) => res.arrayBuffer());
    const standardFont = await pdf.embedFont(standardFontBytes);
    this.fonts.addFont(FontType.Standard, standardFont);

    const boldFontBytes = await fetch(
      '/static/font/OpenSansCondensed-Bold.ttf',
    ).then((res) => res.arrayBuffer());
    const boldFont = await pdf.embedFont(boldFontBytes);
    this.fonts.addFont(FontType.Bold, boldFont);

    const italicFontBytes = await fetch(
      '/static/font/OpenSansCondensed-LightItalic.ttf',
    ).then((res) => res.arrayBuffer());
    const italicFont = await pdf.embedFont(italicFontBytes);
    this.fonts.addFont(FontType.Italic, italicFont);

    const symbolFontBytes = await fetch(
      '/static/font/Trek_Arrowheads.ttf',
    ).then((res) => res.arrayBuffer());
    const symbolFont = await pdf.embedFont(symbolFontBytes);
    this.fonts.addFont(FontType.Symbol, symbolFont);
  }

  async writeRoleAndTalents(
    page: PDFPage,
    character: Character,
    titleStyle: FontSpecification,
    paragraphStyle: FontSpecification,
    symbolStyle: FontSpecification,
    currentColumn: Column,
  ) {
    const writer = new TalentWriter(page, this.fonts, character.version);
    await writer.writeTalents(assembleWritableItems(character), currentColumn);
  }
}

class TwoPageTngCharacterSheet extends BaseTextCharacterSheet {
  getName(): string {
    return '2-Page TNG Character Sheet';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/TNG_2_Page_Character_Sheet.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/TNG_2_Page_Character_Sheet_new.pdf';
  }

  getTags(): SheetTag[] {
    return [
      SheetTag.Portrait,
      SheetTag.Lcars,
      SheetTag.TalentText,
      SheetTag.UsLetter,
    ];
  }

  async populate(pdf: PDFDocument, construct: Construct) {
    await super.populate(pdf, construct);
    await this.fillPageTwo(pdf, construct as Character);

    // pdf-lib does awful things to empty multi-line fields
    // See: https://github.com/Hopding/pdf-lib/discussions/1196
    const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
    const form = pdf.getForm();
    form.getFields().forEach((f) => {
      if (f instanceof PDFTextField) {
        const textField = f as PDFTextField;
        if (
          textField.isMultiline() &&
          (textField.getText() == null || textField.getText().length === 0)
        ) {
          textField.updateAppearances(
            helvetica,
            staTextFieldAppearanceProvider(9),
          );
        }
      }
    });
  }

  populateForm(form: PDFForm, construct: Construct): void {
    super.populateForm(form, construct);
    const character = construct as Character;

    if (character.hasCareerEvents) {
      const event1 = CareerEventsHelper.getCareerEvent(
        character.careerEvents[0]?.id,
        character.type,
        character.version,
      );
      if (event1) {
        this.fillField(form, 'Career Event 1', event1.localizedName);
      }

      if (character.careerEvents && character.careerEvents.length > 1) {
        const event2 = CareerEventsHelper.getCareerEvent(
          character.careerEvents[1]?.id,
          character.type,
          character.version,
        );
        if (event2) {
          this.fillField(form, 'Career Event 2', event2.localizedName);
        }
      }
    }

    // I don't know why PDF-Lib changes the font size, but let's try to
    // change it back.
    this.fixFontSize(form, 'Career Event 1 description');
    this.fixFontSize(form, 'Career Event 2 description');
    this.fixFontSize(form, 'Awards and Reputation');
    this.fixFontSize(form, 'Notes');
  }

  fixFontSize(form: PDFForm, fieldName: string) {
    try {
      const field = form.getTextField(fieldName);
      if (field) {
        field.enableMultiline();
        field.setFontSize(9);
      }
    } catch (e) {
      // ignore it
    }
  }

  async fillPageTwo(pdf: PDFDocument, character: Character) {
    const page2 = pdf.getPages()[1];
    const symbolFontBytes = await fetch(
      '/static/font/Trek_Arrowheads.ttf',
    ).then((res) => res.arrayBuffer());

    const helveticaBold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
    const symbolFont = await pdf.embedFont(symbolFontBytes);

    const titleStyle = new FontSpecification(helveticaBold, 10);
    const paragraphStyle = new FontSpecification(helvetica, 10);
    const symbolStyle = new FontSpecification(symbolFont, 10);

    const column1 = new Column(369, 40, 774 - 40, 585 - 369);
    const currentColumn = column1;

    await this.writeRoleAndTalents(
      page2,
      character,
      titleStyle,
      paragraphStyle,
      symbolStyle,
      currentColumn,
    );
  }
}

class TwoPageTngLandscapeCharacterSheet extends BaseTextCharacterSheet {
  getName(): string {
    return '2-Page TNG Character Sheet (Landscape)';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/TNG_Two_Page_Landscape_Character_Sheet.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/TNG_Two_Page_Landscape_Character_Sheet.pdf';
  }

  getDefaultFontPath() {
    return '/static/font/OpenSansCondensed-Light.ttf';
  }

  getTags(): SheetTag[] {
    return [
      SheetTag.Landscape,
      SheetTag.Lcars,
      SheetTag.TalentText,
      SheetTag.UsLetter,
    ];
  }

  async populate(pdf: PDFDocument, construct: Construct) {
    await super.populate(pdf, construct);

    const symbolFontBytes = await fetch(
      '/static/font/Trek_Arrowheads.ttf',
    ).then((res) => res.arrayBuffer());
    const symbolFont = await pdf.embedFont(symbolFontBytes);

    const boldFontBytes = await fetch(
      '/static/font/OpenSansCondensed-Bold.ttf',
    ).then((res) => res.arrayBuffer());
    const helveticaBold = await pdf.embedFont(boldFontBytes);
    const helvetica = this.formFont;

    // pdf-lib does awful things to empty multi-line fields
    // See: https://github.com/Hopding/pdf-lib/discussions/1196
    const form = pdf.getForm();
    form.getFields().forEach((f) => {
      if (f instanceof PDFTextField) {
        const textField = f as PDFTextField;
        if (
          textField.isMultiline() &&
          (textField.getText() == null || textField.getText().length === 0)
        ) {
          textField.updateAppearances(
            helvetica,
            staTextFieldAppearanceProvider(9),
          );
        }
      }
    });

    const page = pdf.getPages()[0];

    const titleStyle = new FontSpecification(helveticaBold, 8);
    const paragraphStyle = new FontSpecification(helvetica, 8);
    const symbolStyle = new FontSpecification(symbolFont, 8);

    const currentColumn = new Column(573, 45, 563 - 45, 757 - 573);

    await this.writeRoleAndTalents(
      page,
      construct as Character,
      titleStyle,
      paragraphStyle,
      symbolStyle,
      currentColumn,
    );
  }

  populateForm(form: PDFForm, construct: Construct): void {
    super.populateForm(form, construct);
    const character = construct as Character;

    this.fillField(form, 'Pronouns', character.pronouns);
    if (character.hasCareerEvents) {
      const event1 = CareerEventsHelper.getCareerEvent(
        character.careerEvents[0]?.id,
        character.type,
        character.version,
      );
      if (event1) {
        this.fillField(form, 'Career Event 1', event1.localizedName);
      }

      if (character.careerEvents && character.careerEvents.length > 1) {
        const event2 = CareerEventsHelper.getCareerEvent(
          character.careerEvents[1]?.id,
          character.type,
          character.version,
        );
        if (event2) {
          this.fillField(form, 'Career Event 2', event2.localizedName);
        }
      }
    }

    this.fillField(
      form,
      'Sprint',
      '' +
        (character.attributes[Attribute.Fitness] +
          character.departments[Department.Security]),
    );
    this.fillField(
      form,
      'First Aid',
      '' +
        (character.attributes[Attribute.Daring] +
          character.departments[Department.Medicine]),
    );
    this.fillField(
      form,
      'Ranged Attack',
      '' +
        (character.attributes[Attribute.Control] +
          character.departments[Department.Security]),
    );
    this.fillField(
      form,
      'Melee Attack',
      '' +
        (character.attributes[Attribute.Daring] +
          character.departments[Department.Security]),
    );
  }

  fillName(form: PDFForm, character: Character) {
    this.fillField(form, 'Name', this.formatNameWithoutPronouns(character));
  }

  fillCheckbox(form: PDFForm, name: string, value: boolean) {
    try {
      const field = form.getCheckBox(name);
      this.fillCheckboxValue(form, field, value);
    } catch (e) {
      // ignore it
    }
  }

  fillCheckboxValue(form: PDFForm, field: PDFCheckBox, value: boolean) {
    if (field) {
      if (value) {
        form.removeField(field);
      } else {
        field.uncheck();
      }
    }
  }
}

class TwoPageKlingonCharacterSheet extends BaseTextCharacterSheet {
  getName(): string {
    return '2-Page Klingon Character Sheet';
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/STA_2_Page_Klingon_Character_Sheet.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/STA_2_Page_Klingon_Character_Sheet.pdf';
  }

  getTags(): SheetTag[] {
    return [SheetTag.Portrait, SheetTag.TalentText, SheetTag.UsLetter];
  }

  async populate(pdf: PDFDocument, construct: Construct) {
    await super.populate(pdf, construct);
    await this.fillPageTwo(pdf, construct as Character);

    // pdf-lib does awful things to empty multi-line fields
    // See: https://github.com/Hopding/pdf-lib/discussions/1196
    const form = pdf.getForm();
    const helvetica = this.formFont;
    form.getFields().forEach((f) => {
      if (f instanceof PDFTextField) {
        const textField = f as PDFTextField;
        if (
          textField.isMultiline() &&
          (textField.getText() == null || textField.getText().length === 0)
        ) {
          textField.updateAppearances(
            helvetica,
            staTextFieldAppearanceProvider(9),
          );
        }
      }
    });
  }

  populateForm(form: PDFForm, construct: Construct): void {
    super.populateForm(form, construct);
    const character = construct as Character;

    if (character.hasCareerEvents) {
      const event1 = CareerEventsHelper.getCareerEvent(
        character.careerEvents[0]?.id,
        character.type,
        character.version,
      );
      if (event1) {
        this.fillField(form, 'Career Event 1', event1.localizedName);
      }

      if (character.careerEvents && character.careerEvents.length > 1) {
        const event2 = CareerEventsHelper.getCareerEvent(
          character.careerEvents[1]?.id,
          character.type,
          character.version,
        );
        if (event2) {
          this.fillField(form, 'Career Event 2', event2.localizedName);
        }
      }
    }

    if (character.careerStep?.career != null) {
      this.fillField(
        form,
        'Career',
        CareersHelper.instance.getCareer(character.careerStep.career, character)
          .localizedName,
      );
    }

    this.fillField(form, 'House', (construct as Character).house);

    // I don't know why PDF-Lib changes the font size, but let's try to
    // change it back.
    this.fixFontSize(form, 'Environment Details');
    this.fixFontSize(form, 'Upbringing Details');
    this.fixFontSize(form, 'Career Details');
    this.fixFontSize(form, 'Career Event 1 Details');
    this.fixFontSize(form, 'Career Event 2 Details');
  }

  formatNameWithoutPronouns(character) {
    let result = character.name;
    if (character.lineage) {
      result += ', ' + character.lineage;
    }
    return result;
  }

  fixFontSize(form: PDFForm, fieldName: string) {
    try {
      const field = form.getTextField(fieldName);
      if (field) {
        field.enableMultiline();
        field.setFontSize(9);
      }
    } catch (e) {
      // ignore it
    }
  }

  async fillPageTwo(pdf: PDFDocument, character: Character) {
    const page2 = pdf.getPages()[1];
    const symbolFontBytes = await fetch(
      '/static/font/Trek_Arrowheads.ttf',
    ).then((res) => res.arrayBuffer());

    const helveticaBold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
    const symbolFont = await pdf.embedFont(symbolFontBytes);

    const titleStyle = new FontSpecification(helveticaBold, 10);
    const paragraphStyle = new FontSpecification(helvetica, 10);
    const symbolStyle = new FontSpecification(symbolFont, 10);

    const column1 = new Column(318, 105, 702 - 105, 551 - 318);
    const currentColumn = column1;

    await this.writeRoleAndTalents(
      page2,
      character,
      titleStyle,
      paragraphStyle,
      symbolStyle,
      currentColumn,
    );
  }
}

class CaptainsLogCharacterSheet extends BasicFullCharacterSheet {
  getName(): string {
    return "Captain's Log Character Sheet (Landscape)";
  }
  getThumbnailUrl(): string {
    return "/static/img/sheets/STA_Captain's_Log_Character_Sheet.png";
  }
  getPdfUrl(type: CharacterType): string {
    return "/static/pdf/STA_Captain's_Log_Character_Sheet.pdf";
  }

  getTags(): SheetTag[] {
    return [SheetTag.HalfPage];
  }

  populateForm(form: PDFForm, construct: Construct): void {
    const character = construct as Character;
    super.populateForm(form, construct);

    this.fillField(form, 'Pronouns', character.pronouns);

    if (character.hasCareerEvents) {
      const event1 = CareerEventsHelper.getCareerEvent(
        character.careerEvents[0]?.id,
        character.type,
        character.version,
      );
      if (event1) {
        this.fillField(form, 'Career Event 1', event1.localizedName);
      }

      if (character.careerEvents && character.careerEvents.length > 1) {
        const event2 = CareerEventsHelper.getCareerEvent(
          character.careerEvents[1]?.id,
          character.type,
          character.version,
        );
        if (event2) {
          this.fillField(form, 'Career Event 2', event2.localizedName);
        }
      }
    }

    this.fillField(form, 'Assignment', this.serializeAssignment(character));

    if (character.careerStep?.career != null) {
      const careerLength = CareersHelper.instance.getSoloCareerLength(
        character.careerStep.career,
      );
      this.fillField(form, 'Career Length', careerLength.localizedName);
    }

    const type = CharacterTypeModel.getByType(character.type);
    this.fillField(form, 'Character Type', type.localizedName);

    const track = TracksHelper.instance.getSoloTrack(
      character.educationStep?.track,
    );
    this.fillField(form, 'Track', track?.localizedName ?? '');
  }

  fillName(form: PDFForm, character: Character) {
    this.fillField(form, 'Name', this.formatNameWithoutPronouns(character));
  }
}

class CharacterSheets {
  public getSupportingCharacterSheet(c: Character): ICharacterSheet[] {
    return [
      new GeneratedTngPortraitCharacterSheet(),
      new GeneratedTngPortraitA4CharacterSheet(),
      new BasicGeneratedHalfPageCharacterSheet(),
      new BasicGeneratedPortraitCharacterSheet(),
      new HalfPageSupportingCharacterSheet(),
      new StandardTosCharacterSheet(),
      new KlingonCharacterSheet(),
      new Standard2eCharacterSheet(),
      new Landscape2eCharacterSheet(),
    ];
  }

  public getCharacterSheets(character: Character): ICharacterSheet[] {
    if (character.stereotype === Stereotype.SoloCharacter) {
      return [new CaptainsLogCharacterSheet()];
    } else if (character.version > 1) {
      return [
        new Standard2eCharacterSheet(),
        new Landscape2eCharacterSheet(),
        new BasicGeneratedTentCardCharacterSheet(),
        new BasicGeneratedPortraitCharacterSheet(),
        new GeneratedTngPortraitCharacterSheet(),
        new StandardGermanCharacterSheet(),
        new GeneratedTngPortraitA4CharacterSheet(),
        new StandardRussianCharacterSheet(),
        new KlingonCharacterSheet(),
        new StandardTosCharacterSheet(),
        new LandscapeGeneratedCharacterSheet(),
        new TwoPageTngLandscapeCharacterSheet(),
        new TwoPageTngCharacterSheet(),
        new TwoPageKlingonCharacterSheet(),
        new RomulanCharacterSheet(),
      ];
    } else if (character.isKlingonImperialCitizen) {
      return [
        new KlingonCharacterSheet(),
        new TwoPageKlingonCharacterSheet(),
        new GeneratedTngPortraitCharacterSheet(),
        new StandardGermanCharacterSheet(),
        new GeneratedTngPortraitA4CharacterSheet(),
        new StandardRussianCharacterSheet(),
        new Standard2eCharacterSheet(),
        new Landscape2eCharacterSheet(),
        new BasicGeneratedTentCardCharacterSheet(),
        new StandardTosCharacterSheet(),
        new LandscapeGeneratedCharacterSheet(),
        new TwoPageTngLandscapeCharacterSheet(),
        new TwoPageTngCharacterSheet(),
        new RomulanCharacterSheet(),
      ];
    } else if (character.era === Era.NextGeneration) {
      return [
        new GeneratedTngPortraitCharacterSheet(),
        new StandardGermanCharacterSheet(),
        new GeneratedTngPortraitA4CharacterSheet(),
        new StandardRussianCharacterSheet(),
        new KlingonCharacterSheet(),
        new Standard2eCharacterSheet(),
        new Landscape2eCharacterSheet(),
        new BasicGeneratedTentCardCharacterSheet(),
        new StandardTosCharacterSheet(),
        new LandscapeGeneratedCharacterSheet(),
        new TwoPageTngLandscapeCharacterSheet(),
        new TwoPageTngCharacterSheet(),
        new TwoPageKlingonCharacterSheet(),
        new RomulanCharacterSheet(),
      ];
    } else {
      return [
        new StandardTosCharacterSheet(),
        new KlingonCharacterSheet(),
        new GeneratedTngPortraitCharacterSheet(),
        new StandardGermanCharacterSheet(),
        new GeneratedTngPortraitA4CharacterSheet(),
        new StandardRussianCharacterSheet(),
        new Standard2eCharacterSheet(),
        new Landscape2eCharacterSheet(),
        new BasicGeneratedTentCardCharacterSheet(),
        new LandscapeGeneratedCharacterSheet(),
        new TwoPageTngCharacterSheet(),
        new TwoPageTngLandscapeCharacterSheet(),
        new TwoPageKlingonCharacterSheet(),
        new RomulanCharacterSheet(),
      ];
    }
  }

  public getStationSheets(station: Station): ICharacterSheet[] {
    return [new Portrait2eStationSheet()];
  }

  public getStarshipSheets(starship: Starship): ICharacterSheet[] {
    if (starship.stereotype === Stereotype.SoloStarship) {
      return [new CaptainsLogStarshipSheet()];
    } else if (isKlingonWarriorType(starship.type)) {
      return [
        new StandardKlingonStarshipSheet(),
        new StandardTngStarshipSheet(),
        new Generated2eStarshipSheet(),
        new Standard2eStarshipSheet(),
        new StandardTosStarshipSheet(),
      ];
    } else if (starship.version > 1) {
      return [
        new Standard2eStarshipSheet(),
        new Generated2eStarshipSheet(),
        new StandardTngStarshipSheet(),
        new StandardTosStarshipSheet(),
        new StandardKlingonStarshipSheet(),
      ];
    } else if (starship.era === Era.NextGeneration) {
      return [
        new StandardTngStarshipSheet(),
        new Generated2eStarshipSheet(),
        new Standard2eStarshipSheet(),
        new StandardTosStarshipSheet(),
        new StandardKlingonStarshipSheet(),
      ];
    } else {
      return [
        new StandardTosStarshipSheet(),
        new Generated2eStarshipSheet(),
        new Standard2eStarshipSheet(),
        new StandardTngStarshipSheet(),
        new StandardKlingonStarshipSheet(),
      ];
    }
  }

  public getCreatureSheet(): ICharacterSheet {
    return new Landscape2eCreatureSheet();
  }
}

export const CharacterSheetRegistry = new CharacterSheets();
