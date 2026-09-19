import type { PDFDocument, PDFForm, PDFPage } from '@cantoo/pdf-lib';
import { BasicGeneratedSheet } from './generatedsheet';
import type { Construct } from '../common/construct';
import { Character } from '../common/character';
import { CharacterSerializer } from '../common/characterSerializer';
import { DepartmentsHelper, Department } from '../helpers/department';
import { CareerEventsHelper } from '../helpers/careerEvents';
import { Attribute, AttributesHelper } from '../helpers/attributes';
import type { Column } from './column';
import i18next from 'i18next';
import { SimpleColor } from '../common/colour';
import { TextAlign } from './textAlign';
import { WeaponDescriber } from './weaponDescriber';
import { CharacterType, CharacterTypeModel } from '../common/characterType';
import { TracksHelper } from '../helpers/tracks';
import { Implant } from '../helpers/borgImplant';

export abstract class BaseFormFillingSheet extends BasicGeneratedSheet {
  async populate(pdf: PDFDocument, construct: Construct) {
    await super.populate(pdf, construct);
    const character = construct as Character;

    this.populateForm(pdf.getForm(), character);
  }

  fillReputation(form: PDFForm, character: Character) {
    this.fillField(form, 'Reputation', '' + character.reputation);
  }

  fillAssignment(form: PDFForm, character: Character) {
    this.fillField(form, 'Assignment', this.serializeAssignment(character));
  }
  populateForm(form: PDFForm, character: Character) {
    this.fillName(form, character);
    this.fillField(form, 'Pronouns', character.pronouns);
    this.fillAssignment(form, character);
    this.fillField(form, 'Ship', character.assignedShip ?? '');
    this.fillField(
      form,
      'Environment',
      CharacterSerializer.serializeEnvironment(
        character.environmentStep?.environment,
        character.environmentStep?.otherSpecies,
        character,
      ),
    );
    this.fillRank(form, character);
    this.fillSpecies(form, character);
    this.fillUpbringing(form, character);
    this.fillField(form, 'Traits', character.getAllTraits());
    this.fillFocuses(form, character);
    this.fillAttributes(form, character);
    this.fillSkills(form, character);
    this.fillField(form, 'Resistance', '' + character.resistance);
    this.fillReputation(form, character);
    this.fillField(form, 'Reprimands', '' + character.reprimands);
    this.fillValues(form, character);
    this.fillEquipment(form, character);
    this.fillWeapons(form, character);

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
  }

  serializeAssignment(character: Character): string {
    return character.localizedAssignmentWithoutShip;
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
      this.fillField(form, Department[d], '' + departments[d]);
    });
  }

  fillField(form: PDFForm, name: string, value: string | number) {
    try {
      const field = form.getTextField(name);
      if (field) {
        field.setText('' + (value ?? ''));
      }
    } catch (e) {
      // ignore it
    }
  }

  fillRank(form: PDFForm, character: Character) {
    this.fillField(form, 'Rank', character.rank?.localizedName);
  }

  fillSpecies(form: PDFForm, character: Character) {
    this.fillField(form, 'Species', character.localizedSpeciesName);
  }

  fillFocuses(form: PDFForm, character: Character) {
    character.focuses.forEach((f, i) => {
      this.fillField(form, 'Focus ' + (i + 1), f);
    });
  }

  fillName(form: PDFForm, character: Character) {
    this.fillField(form, 'Name', character.name);
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
      character.upbringingStep?.localizedDescription,
    );
  }

  fillWeapons(form: PDFForm, construct: Construct) {
    const weapons = construct.determineWeapons();
    const describer = new WeaponDescriber(
      construct.version,
      construct instanceof Character,
    );

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
  formatNameWithoutPronouns(character: Character) {
    return CharacterSerializer.serializeName(character);
  }

  fillCareerPath(form: PDFForm, character: Character): void {
    let path =
      CharacterTypeModel.getByType(character.type)?.localizedName ?? '';
    if (
      [
        CharacterType.Other,
        CharacterType.AlliedMilitary,
        CharacterType.AmbassadorDiplomat,
      ].includes(character.type) &&
      character.typeDetails != null
    ) {
      path = character.typeDetails.name;
    }
    if (character.educationStep?.track != null) {
      const track = TracksHelper.instance.getTrack(
        character.educationStep?.track,
        character.type,
        character.version,
      );
      path +=
        ' / ' +
        (character.version === 1 ? track.localizedName : track.localizedName2e);
    }

    this.fillField(form, 'Career Path', path);
  }

  get statLocations(): { [key: string]: Column } {
    return {};
  }

  getStatLabelColour(key: string): SimpleColor {
    return SimpleColor.from('#ffffff');
  }

  writeStatLabels(
    page: PDFPage,
    character: Character,
    textAlign: TextAlign = TextAlign.Right,
    fontSize: number = 12.5,
    minFontSize: number = 8,
  ) {
    Object.keys(this.statLocations).forEach((key) => {
      const block = this.statLocations[key];
      if (key === 'Construct.other.protection' && character.version === 1) {
        key = 'Construct.other.resistance';
      }
      const originalText = i18next.t(key).toLocaleUpperCase();
      const text = originalText;
      let width = this.headingFont.widthOfTextAtSize(text, fontSize);
      while (width > block.width) {
        fontSize -= 0.25;
        width = this.headingFont.widthOfTextAtSize(text, fontSize);
        if (fontSize < minFontSize) {
          break;
        }
      }
    });

    Object.keys(this.statLocations).forEach((key) => {
      const block = this.statLocations[key];
      if (key === 'Construct.other.protection' && character.version === 1) {
        key = 'Construct.other.resistance';
      }
      const originalText = i18next.t(key).toLocaleUpperCase();
      let text = originalText;
      let width = this.headingFont.widthOfTextAtSize(text, fontSize);
      while (width > block.width) {
        text = text.substring(0, text.length - 1);
        width = this.headingFont.widthOfTextAtSize(text + '...', fontSize);
      }

      if (text !== originalText) {
        text += '...';
      }

      const height = this.headingFont.heightAtSize(fontSize, {
        descender: false,
      });
      const offset = Math.max(0, block.height - height) / 2;

      let x = block.start.x;
      if (textAlign === TextAlign.Right) {
        x = block.end.x - width - 2;
      }

      page.drawText(text, {
        x: x,
        y: page.getHeight() - (block.end.y - offset),
        color: this.getStatLabelColour(key).asPdfRbg(),
        font: this.headingFont,
        size: fontSize,
      });
    });
  }
}
