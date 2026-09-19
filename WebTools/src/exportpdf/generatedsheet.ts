import type { PDFDocument, PDFFont, PDFPage } from '@cantoo/pdf-lib';
import type { ICharacterSheet, SheetTag } from './icharactersheet';
import fontkit from '@pdf-lib/fontkit';
import type { Construct } from '../common/construct';
import { ReadableTalentModel } from './talentWriter';
import type { RoleModel } from '../helpers/roles';
import { RolesHelper } from '../helpers/roles';
import type { SpeciesAbility } from '../helpers/speciesAbility';
import type { Character, SpeciesAbilityOptions } from '../common/character';
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
  TALENT_NAME_MISSION_POD,
  TALENT_NAME_REDUNDANT_SYSTEMS,
  TALENT_NAME_UNTAPPED_POTENTIAL,
  TALENT_NAME_WARRIORS_SPIRIT,
} from '../helpers/talents';
import { BorgImplants } from '../helpers/borgImplant';
import { Starship } from '../common/starship';
import type { Column } from './column';
import { SimpleColor } from '../common/colour';
import { TextBlock } from './textBlock';
import { FontSpecification } from './fontSpecification';
import type { CharacterType } from '../common/characterType';
import type { Station } from '../common/station';
import { FontLibrary } from './fontLibrary';
import { labelWriter } from './labelWriter';
import { greyColour2e } from './colourProvider2e';
import { TextAlign } from './textAlign';
import { FontOptions } from './fontOptions';
import { Paragraph } from './paragraph';

export class SpeciesAbilityAndOptions {
  readonly ability: SpeciesAbility;
  readonly options?: SpeciesAbilityOptions;

  constructor(ability: SpeciesAbility, options?: SpeciesAbilityOptions) {
    this.ability = ability;
    this.options = options;
  }
}

export abstract class BasicGeneratedSheet implements ICharacterSheet {
  formFont: PDFFont;
  fonts: FontLibrary = new FontLibrary();
  headingFont: PDFFont;

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
    return '/static/font/OpenSansCondensed-Light.ttf';
  }

  getTags(): SheetTag[] {
    return [];
  }

  async initializeFonts(pdf: PDFDocument) {
    pdf.registerFontkit(fontkit);
    const baseFontBytes = await fetch(this.getDefaultFontPath()).then((res) =>
      res.arrayBuffer(),
    );
    const baseFont = await pdf.embedFont(baseFontBytes);
    this.formFont = baseFont;
    const form = pdf.getForm();
    if (form) {
      const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
      form.updateFieldAppearances = function () {
        return rawUpdateFieldAppearances(baseFont);
      };
    }
  }

  async populate(pdf: PDFDocument, construct: Construct) {
    await this.initializeFonts(pdf);
    if (construct.name) {
      pdf.setTitle(construct.name);
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

  determineIdealFontWidth(
    text: string[],
    maxWidth: number,
    idealFontSize: number,
    minimumFontSize: number,
    font: PDFFont,
  ) {
    let fontSize = idealFontSize;
    text.forEach((t) => {
      let width = font.widthOfTextAtSize(t, fontSize);
      while (width > maxWidth) {
        fontSize -= 0.25;
        width = font.widthOfTextAtSize(t, fontSize);
        if (fontSize <= minimumFontSize) {
          break;
        }
      }
    });
    return fontSize;
  }

  writeCharacterDescription(
    page: PDFPage,
    character: Character,
    column: Column,
    headingWriter: (page: PDFPage, column: Column, version: number) => void = (
      page,
      column,
      version,
    ) => {
      const subHeadings = {
        'Construct.other.description': column.topBefore(9.5),
      };
      labelWriter(
        page,
        subHeadings,
        version,
        this.headingFont,
        9,
        greyColour2e,
        TextAlign.Centre,
      );
    },
  ) {
    if (character.description?.length) {
      headingWriter(page, column, character.version);
      column = column.bottomAfter(12);

      let paragraph = new Paragraph(page, column, this.fonts);
      const descriptionParagraphs = character.description.split('\n');
      const paragraphs = [paragraph];
      descriptionParagraphs.forEach((p, i) => {
        if (i > 0) {
          paragraph = paragraph?.nextParagraph();
          if (paragraph) {
            paragraphs.push(paragraph);
          }
        }
        paragraph?.append(p, new FontOptions(8));
      });

      paragraphs.forEach((p) => p.write());

      if (paragraphs.length) {
        const last = paragraphs.filter((p) => p.lines?.length).slice(-1)[0];
        if (last) {
          const bottom = last.bottom;
          column = last.endColumn.bottomAfter(
            bottom.y - last.endColumn.start.y,
          );

          if (column?.height > 10) {
            column = column.bottomAfter(10);
          }
        }
      }
    }
    return column;
  }

  writeName(
    page: PDFPage,
    name: string,
    colour: SimpleColor,
    headingFont: PDFFont,
    nameColumn: Column,
  ) {
    if (name?.length) {
      const textBlock = TextBlock.create(
        name.toLocaleUpperCase(),
        new FontSpecification(headingFont, 10),
        false,
      );
      const y =
        nameColumn.end.y - 3 - (nameColumn.height - textBlock.height) / 2;
      const x = nameColumn.start.x;

      const triangle =
        'M 59.14167,59.12397 V 49.110298 l 8.671875,5.009766 z m 0.580078,-1.001953 6.9375,-4.001953 -6.9375,-4.007813 z';

      const width = textBlock.width;
      const widthOfTab = Math.max(120, width + 50);
      const startOffset = 42.537;

      const farthestEdge = widthOfTab + startOffset;
      const circle1 = farthestEdge - (226.5918 - 221.51591);
      const circle2 = farthestEdge - (226.5918 - 215.25391);

      const curvePath =
        'M 53.876953 44.523438 C 47.614953 44.523438 42.537109 49.601281 42.537109 55.863281 L 42.537109 83.523438 L 42.958984 83.523438 L 42.958984 74.53125 C 42.958984 68.55425 47.821828 63.693359 53.798828 63.693359 ' +
        'L ' +
        farthestEdge +
        ' 63.693359 L ' +
        farthestEdge +
        ' 55.863281 C ' +
        farthestEdge +
        ' 49.601281 ' +
        circle1 +
        ' 44.523438 ' +
        circle2 +
        ' 44.523438 L 53.876953 44.523438 z';

      page.moveTo(0, page.getHeight());
      page.drawSvgPath(curvePath, {
        color: colour.asPdfRbg(),
        borderWidth: 0,
      });

      page.drawSvgPath(triangle, {
        borderColor: SimpleColor.from('#000000').asPdfRbg(),
        color: SimpleColor.from('#ffffff').asPdfRbg(),
        borderWidth: 0,
      });

      textBlock.writeToPage(
        x,
        page.getHeight() - y,
        page,
        SimpleColor.from('#ffffff'),
      );
    }
  }
}

export const assembleWritableItems = (character: Character) => {
  const result: (ReadableTalentModel | RoleModel | SpeciesAbilityAndOptions)[] =
    [];

  if (character.role != null) {
    const role = RolesHelper.instance.getRole(character.role, character.type);
    if (role) {
      result.push(role);
    }

    if (character.secondaryRole != null) {
      const role = RolesHelper.instance.getRole(
        character.secondaryRole,
        character.type,
      );
      if (role) {
        result.push(role);
      }
    }
  }

  if (
    character.speciesStep?.ability &&
    (character.speciesStep?.talent == null ||
      character.speciesStep?.ability?.isTalentSelectionSupported)
  ) {
    result.push(
      new SpeciesAbilityAndOptions(
        character.speciesStep.ability,
        character.speciesStep.abilityOptions,
      ),
    );
  }

  const handledTalents = [];
  character.talents.forEach((t) => {
    const talent = t.talentModel;
    if (talent && !handledTalents.includes(t.talent)) {
      if (!t.isCustom) {
        handledTalents.push(t.talent);
      }
      const readableTalent = new ReadableTalentModel(character.type, talent);

      if (talent.maxRank > 1) {
        readableTalent.rank = character.getRankForTalent(t.talent);
      }

      if (t.isCustom) {
        readableTalent.customTalentName = t.customTalentName;
        readableTalent.customTalentDescription = t.customTalentDescription;
      } else if (talent.name === TALENT_NAME_BORG_IMPLANTS) {
        readableTalent.implants = character.implants.map((implantType) =>
          BorgImplants.instance.getImplantByType(implantType),
        );
      } else if (
        talent.name === TALENT_NAME_UNTAPPED_POTENTIAL &&
        character.version > 1 &&
        character.careerStep?.talent?.attribute != null
      ) {
        readableTalent.attributes = [character.careerStep?.talent?.attribute];
      } else if (
        talent.name === TALENT_NAME_WARRIORS_SPIRIT &&
        t.selection != null
      ) {
        readableTalent.selection = t.selection;
      } else if (talent.name === TALENT_NAME_AUGMENTED_ABILITY) {
        readableTalent.attributes = character.talents
          .filter(
            (s) =>
              s.talent === TALENT_NAME_AUGMENTED_ABILITY && s.attribute != null,
          )
          .map((s) => s.attribute);
      } else if (
        [
          TALENT_NAME_COLLABORATION,
          TALENT_NAME_IM_A_DOCTOR_NOT_A,
          TALENT_NAME_BOLD,
          TALENT_NAME_CAUTIOUS,
        ].includes(talent.name)
      ) {
        readableTalent.departments = character.talents
          .filter((s) => s.talent === talent.name && s.department != null)
          .map((s) => s.department);
      } else if (talent.name === TALENT_NAME_EXTRAORDINARY_ATTRIBUTE_X) {
        readableTalent.attributes = character.talents
          .filter((s) => s.talent === talent.name && s.attribute != null)
          .map((s) => s.attribute);
        const temp = character.talents.filter(
          (s) => s.talent === talent.name && s.x != null,
        );
        if (temp.length) {
          readableTalent.x = temp[0].x;
        }
      } else if (talent.isXQualified) {
        const temp = character.talents.filter(
          (s) => s.talent === talent.name && s.x != null,
        );
        if (temp.length) {
          readableTalent.x = temp[0].x;
        }
      }
      result.push(readableTalent);
    }
  });

  return result;
};

export const assembleStarshipTalents = (
  starship: Starship | Station,
  includeSpecialRules: boolean = false,
) => {
  const result: (ReadableTalentModel | RoleModel | SpeciesAbilityAndOptions)[] =
    [];
  const specialRules: (
    ReadableTalentModel | RoleModel | SpeciesAbilityAndOptions
  )[] = [];

  const handledTalents = [];
  starship.talents.forEach((t) => {
    const talent = t.talentModel;
    if (talent && !handledTalents.includes(t.talent)) {
      if (!t.isCustom) {
        handledTalents.push(t.talent);
      }
      const readableTalent = new ReadableTalentModel(starship.type, talent);

      if (talent.maxRank > 1) {
        readableTalent.rank = starship.getRankForTalent(t.name);
      }

      if (t.isCustom) {
        readableTalent.customTalentName = t.customTalentName;
        readableTalent.customTalentDescription = t.customTalentDescription;
      } else if (
        talent.name === TALENT_NAME_MISSION_POD &&
        starship instanceof Starship
      ) {
        readableTalent.missionPod = starship.missionPodModel;
      } else if (talent.name === TALENT_NAME_REDUNDANT_SYSTEMS) {
        readableTalent.selection = t.selection;
        readableTalent.system = t.system;
      } else if (talent.name === TALENT_NAME_ADDITIONAL_PROPULSION_SYSTEM) {
        readableTalent.selection = t.selection;
      } else if (
        [
          TALENT_NAME_DEDICATED_PERSONNEL,
          TALENT_NAME_EXPANSIVE_DEPARTMENT,
        ].includes(talent.name)
      ) {
        readableTalent.departments = starship.talents
          .filter((s) => s.talent === talent.name && s.department != null)
          .map((s) => s.department);
      } else if (
        [
          'Peak Performance (Service Record)',
          'The Last Generation (Service Record)',
          'Upgraded Systems (Service Record)',
        ].includes(talent.name)
      ) {
        const temp = starship.talents.filter(
          (s) => s.talent === talent.name && s.system != null,
        );
        if (temp.length) {
          readableTalent.system = temp[0].system;
        }
      }
      if (talent.isSpecialRule(starship.version)) {
        specialRules.push(readableTalent);
      } else {
        result.push(readableTalent);
      }
    }
  });

  if (includeSpecialRules) {
    return specialRules;
  } else {
    return result;
  }
};
