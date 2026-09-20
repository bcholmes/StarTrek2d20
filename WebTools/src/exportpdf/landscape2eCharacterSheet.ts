import i18next from 'i18next';
import { SimpleColor } from '../common/colour';
import { BaseFormFillingSheet } from './baseFormFillingSheet';
import { Column } from './column';
import { SheetTag } from './icharactersheet';
import type { PDFForm, PDFPage } from '@cantoo/pdf-lib';
import { PDFDocument, PDFTextField } from '@cantoo/pdf-lib';
import type { Construct } from '../common/construct';
import { Stereotype } from '../common/construct';
import { TalentWriter } from './talentWriter';
import {
  CareerEventStep,
  Character,
  Division,
  Promotion,
} from '../common/character';
import type {
  CharacterAdvancementStep,
  ReputationChangeStep,
} from '../common/character';
import { assembleWritableItems } from './generatedsheet';
import { FontType } from './fontLibrary';
import { labelWriter, simpleLabelWriter } from './labelWriter';
import { TextAlign } from './textAlign';
import { CheckMarkMaker } from './checkMarkMaker';
import { staTextFieldAppearanceProvider } from '../helpers/pdfTextFieldAppearance';
import { CareersHelper } from '../helpers/careers';
import { WeaponDescriber } from './weaponDescriber';
import { CHALLENGE_DICE_NOTATION } from '../common/challengeDiceNotation';
import { CharacterType } from '../common/characterType';
import {
  cardassianBrownColour2e,
  divisionColour2e,
  ferengiOrangeColour2e,
  greyColour2e,
  klingonRedColour2e,
  labelColourProvider,
  orionGreenColour2e,
  romulanGreenColour2e,
  tealColour2e,
  tholianFlameColour2e,
} from './colourProvider2e';
import {
  politySymbolArrowHead,
  politySymbolArrowHeadCommand,
  politySymbolArrowHeadOperations,
  politySymbolArrowHeadScience,
  politySymbolCardassianSymbolInner,
  politySymbolCardassianSymbolOutline,
  politySymbolFederationLaurels,
  politySymbolFederationStarfield,
  politySymbolFerengiSymbol,
  politySymbolKlingonSymbol,
  politySymbolKlingonSymbolCircle,
  politySymbolOrionSymbol,
  politySymbolRomulanSymbolBackground,
  politySymbolRomulanSymbolBird,
  politySymbolSona,
  politySymbolTalarianExtra,
  politySymbolTalarianMain,
  politySymbolTholianBackground,
  politySymbolTholianForeground,
  politySymbolTzenkethiBack,
  politySymbolTzenkethiFront,
} from './politySymbols';
import { determineIdealFontWidth } from './fontWidthDeterminer';
import { Paragraph } from './paragraph';
import { FontOptions } from './fontOptions';
import { LandscapeSheetDecorations } from './landscapeSheetDecorations';
import { FontSpecification } from './fontSpecification';
import { PageArea } from './pageArea';
import { TextBlock } from './textBlock';
import { TokenHelper } from './tokenHelper';
import { LogEntry } from '../common/logEntry';
import { CareerEventsHelper } from '../helpers/careerEvents';
import { ModificationType } from '../modify/model/modificationType';
import { RanksHelper } from '../helpers/ranks';
import { fontLoader2e } from './fontLoader';

export class Landscape2eCharacterSheet extends BaseFormFillingSheet {
  static readonly page2Column1X = 55.6;
  static readonly page2Column2X = 226.5;
  static readonly page2Column3X = 396.1;
  static readonly page2Column4X = 565.8;

  static readonly greyColour: SimpleColor = SimpleColor.from('#979696');

  static readonly headingColumn = new Column(73.8, 45, 8.8, 200);

  getName(): string {
    return i18next.t('Sheet.landscape2eCharacterSheet');
  }
  getThumbnailUrl(): string {
    return '/static/img/sheets/STA_2e_Landscape_Sheet_400.png';
  }
  getPdfUrl(type: CharacterType): string {
    return '/static/pdf/STA_2e_Landscape_Sheet.pdf';
  }

  getDefaultFontPath() {
    return '/static/font/OpenSansCondensed-Light.ttf';
  }

  getTags(): SheetTag[] {
    return [
      SheetTag.Landscape,
      SheetTag.Style2e,
      SheetTag.UsLetter,
      SheetTag.LanguageSupport,
      SheetTag.TalentText,
    ];
  }

  async initializeFonts(pdf: PDFDocument) {
    await super.initializeFonts(pdf);
    await fontLoader2e(pdf, this.fonts, this.formFont);
    this.headingFont = this.fonts.fontByType(FontType.Heading);
  }

  async fixedTextColumns(additionalPages: PDFPage[], pdf: PDFDocument) {
    const basicColumn1 = new Column(55.6, 72.6, 479.3, 226.5 + 158.1 - 55.6);
    const basicColumn2 = new Column(396.1, 72.6, 479.3, 226.5 + 158.1 - 55.6);

    const logColumns = [];
    for (let i = additionalPages.length - 1; i >= 0; i--) {
      const page =
        i === additionalPages.length - 1 ? undefined : additionalPages[i + 1];
      const first = logColumns[0];

      const logPage2Column2 = new Column(
        basicColumn2.start.x,
        basicColumn2.start.y,
        basicColumn2.height,
        basicColumn2.width,
        page != null && first != null
          ? () => {
              const p = pdf.addPage(page);
              return new PageArea(first, p);
            }
          : undefined,
      );
      const logPage2Column1 = new Column(
        basicColumn1.start.x,
        basicColumn1.start.y,
        basicColumn1.height,
        basicColumn1.width,
        logPage2Column2,
      );

      logColumns.unshift(logPage2Column1, logPage2Column2);
    }

    const page2Column4 = new Column(565.8, 72.6, 479.3, 158.1);
    const page2Column3 = new Column(396.1, 72.6, 479.3, 158.1, page2Column4);
    const page2Column2 = new Column(226.5, 72.6, 479.3, 158.1, page2Column3);
    const page2Column1 = new Column(55.6, 72.6, 479.3, 158.1, page2Column2);

    const talentsColumn3 = new Column(390.6, 361, 200, 162, () => {
      const page = pdf.addPage(additionalPages[0]);
      return new PageArea(page2Column1, page);
    });
    const talentsColumn2 = new Column(221.7, 361, 200, 162, talentsColumn3);
    const talentsColumn1 = new Column(51.5, 361, 200, 162, talentsColumn2);

    return {
      logColumns: logColumns,
      firstColumn: talentsColumn1,
      page2: additionalPages[0],
    };
  }

  async populate(pdf: PDFDocument, construct: Construct) {
    await super.populate(pdf, construct);

    await this.fillCharacterImage(pdf, construct as Character);

    const pdfBytes = await fetch(
      '/static/pdf/STA_2e_Landscape_Sheet_blank.pdf',
    ).then((res) => res.arrayBuffer());
    const blankPdf = await PDFDocument.load(pdfBytes);

    const character = construct as Character;
    const extraPages = [];
    for (
      let i = 0;
      i < Math.ceil((character.improvements?.length ?? 0) / 4) + 2;
      i++
    ) {
      // making an assumption here that we can write at least 4 improvements per page
      const [p] = await pdf.copyPages(blankPdf, [0]);
      extraPages.push(p);
    }

    const page = pdf.getPage(0);
    const colour = this.deriveSheetColour(character);

    [page].concat(...extraPages).forEach((p) => {
      new LandscapeSheetDecorations().drawSheetDecorations(p, colour);
      this.writeTitle(p, colour);
    });

    this.writeLabels(page, character);
    const { firstColumn, logColumns, page2 } = await this.fixedTextColumns(
      extraPages,
      pdf,
    );
    let nextArea = await this.writeRoleAndTalents(page, character, firstColumn);

    if (construct.stereotype !== Stereotype.Npc) {
      this.createDeterminationBoxes(page, pdf);
    }
    this.createStressBoxes(page, pdf, character);

    this.drawArrowHead(page, character, colour);

    if (
      (character.improvements?.filter(
        (i) => i instanceof LogEntry || i instanceof Promotion,
      )?.length ||
        character.careerEvents?.filter((e) => e.notes?.length)?.length) &&
      nextArea != null
    ) {
      let y = undefined;
      if (
        nextArea != null &&
        (Landscape2eCharacterSheet.page2Column1X === nextArea.column.start.x ||
          Landscape2eCharacterSheet.page2Column3X === nextArea.column.start.x)
      ) {
        y = nextArea.column.start.y;
        const newLayoutColumn =
          Landscape2eCharacterSheet.page2Column1X === nextArea.column.start.x
            ? logColumns[0]
            : logColumns[1];
        nextArea = new PageArea(
          newLayoutColumn.bottomAfter(y - newLayoutColumn.start.y),
          nextArea.page,
        );
      } else if (
        nextArea != null &&
        Landscape2eCharacterSheet.page2Column2X === nextArea.column.start.x
      ) {
        const newLayoutColumn = logColumns[1];
        nextArea = new PageArea(newLayoutColumn, nextArea.page);
      } else if (
        nextArea != null &&
        Landscape2eCharacterSheet.page2Column4X === nextArea.column.start.x
      ) {
        const newLayoutColumn = logColumns[2];
        nextArea = new PageArea(newLayoutColumn, extraPages[1]);
      } else if (
        nextArea != null &&
        ![
          Landscape2eCharacterSheet.page2Column1X,
          Landscape2eCharacterSheet.page2Column2X,
          Landscape2eCharacterSheet.page2Column3X,
          Landscape2eCharacterSheet.page2Column4X,
        ].includes(nextArea.column.start.x)
      ) {
        const page = pdf.addPage(page2);
        nextArea = new PageArea(logColumns[0], page);
      } else {
        nextArea = undefined;
      }

      if (nextArea != null) {
        this.writeLogEntries(
          construct as Character,
          nextArea.areaWithAtLeast(40),
          colour,
        );
      }
    }
  }

  async fillCharacterImage(pdf: PDFDocument, character: Character) {
    if (character.token) {
      const tokenBytes = await TokenHelper.renderToken(character.token);
      const image = await pdf.embedPng(tokenBytes);
      try {
        pdf.getForm().getButton('Image35_af_image').setImage(image);
      } catch {
        // name changed...? ignore it.
        console.log('Image button not found in PDF');
      }
    }
  }

  writeLogEntries(
    character: Character,
    nextArea: PageArea,
    colour: SimpleColor,
  ) {
    const header = {
      'Sheet.text.log.title': nextArea.column.topBefore(10),
    };
    labelWriter(
      nextArea.page,
      header,
      character.version,
      this.headingFont,
      9,
      Landscape2eCharacterSheet.greyColour,
      TextAlign.Left,
    );
    nextArea = nextArea.bottomAfter(23);

    const logEntries: (
      | LogEntry
      | CareerEventStep
      | Promotion
      | ReputationChangeStep
      | CharacterAdvancementStep
    )[] = character.improvements?.length
      ? [
          ...character.improvements?.filter(
            (i) => i instanceof LogEntry || i instanceof Promotion,
          ),
        ]?.reverse()
      : [];
    if (character.careerEvents[1]?.notes) {
      logEntries.push(character.careerEvents[1]);
    }
    if (character.careerEvents[0]?.notes) {
      logEntries.push(character.careerEvents[0]);
    }

    let paragraph = new Paragraph(nextArea.page, nextArea.column, this.fonts);
    const paragraphs: Paragraph[] = [];
    paragraphs.push(paragraph);
    let indent = 0;
    for (let i = 1; i <= logEntries.length; i++) {
      const box = TextBlock.create(
        '' + i + '. ',
        new FontSpecification(this.fonts.fontByType(FontType.Bold), 9),
        0,
      );
      indent = Math.max(box.width, indent);
    }
    paragraph.indent(indent);

    logEntries.forEach((l, li) => {
      if (li > 0) {
        paragraph = paragraph?.nextParagraph(1.25);
        if (paragraph) {
          paragraphs.push(paragraph);
        }
      }
      let text = '';
      if (l instanceof LogEntry) {
        if (l.adventureTitle?.trim()?.length) {
          text += '**' + l.adventureTitle + '**';
        }
        if (l.missionDescription?.trim()?.length) {
          text += '\n' + l.missionDescription.trim();
        }
        if (l.notes?.trim().length) {
          text += '\n**' + i18next.t('Common.text.notes') + ':** ' + l.notes;
        }
      } else if (l instanceof CareerEventStep) {
        const event = CareerEventsHelper.getCareerEvent(
          l.id,
          character.type,
          character.version,
        );
        if (event.localizedName?.trim()?.length) {
          text +=
            '**' +
            event.localizedName +
            '** (' +
            i18next.t('Page.title.careerEvent') +
            ')';
        }
        if (l.notes?.trim().length) {
          text += '\n**' + i18next.t('Common.text.notes') + ':** ' + l.notes;
        }
      } else if (l instanceof Promotion) {
        let rankName = l.rank.localizedName;
        if (l.rank?.id != null) {
          rankName = RanksHelper.instance().getRank(l.rank.id).localizedName;
        }
        text +=
          '**' +
          (l.type === ModificationType.Promotion
            ? i18next.t('ModificationType.name.promotion')
            : i18next.t('ModificationType.name.demotion')) +
          '**: ' +
          rankName;
      }

      const descriptionParagraphs = text.split('\n');
      descriptionParagraphs.forEach((p, i) => {
        if (i > 0) {
          paragraph = paragraph?.nextParagraph(0.5);
          if (paragraph) {
            paragraphs.push(paragraph);
          }
        }
        const temp = paragraph;
        paragraph?.append(p, new FontOptions(9));
        if (temp && i === 0) {
          const height = temp.lines[0]?.height();
          const y = temp.page.getHeight() - temp.lines[0]?.location.y;
          const column = temp.lines[0]?.column;
          if (height != null && y != null && column != null) {
            simpleLabelWriter(
              temp.page,
              '' + (li + 1) + '.',
              column.bottomAfter(y - column.start.y).topBefore(height ?? 9),
              this.fonts.fontByType(FontType.Bold),
              9,
              colour,
            );
          }
        }
      });
    });
    paragraphs.forEach((p) => p.write());
  }

  deriveSheetColour(character: Character) {
    if (
      character.type === CharacterType.Starfleet ||
      character.type === CharacterType.Cadet
    ) {
      const division = character.division;
      return division != null
        ? divisionColour2e(character.era, division)
        : tealColour2e;
    } else if (character.isKlingonImperialCitizen) {
      return klingonRedColour2e;
    } else if (character.isRomulanStarEmpire) {
      return romulanGreenColour2e;
    } else if (character.isOrion) {
      return orionGreenColour2e;
    } else if (character.isCardassian) {
      return cardassianBrownColour2e;
    } else if (character.isFerengi) {
      return ferengiOrangeColour2e;
    } else if (character.isTholian) {
      return tholianFlameColour2e;
    } else {
      return tealColour2e;
    }
  }

  drawArrowHead(page: PDFPage, character: Character, colour: SimpleColor) {
    if (
      character.type === CharacterType.Starfleet ||
      character.type === CharacterType.Cadet
    ) {
      const division = character.division;
      if (division != null) {
        page.moveTo(704, page.getHeight() - 63);

        page.drawSvgPath(politySymbolArrowHead, {
          borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
          color: SimpleColor.from('#ffffff').asPdfRbg(),
          borderWidth: 1,
          scale: 0.6,
        });

        if (division === Division.Command) {
          page.drawSvgPath(politySymbolArrowHeadCommand, {
            borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
            color: colour.asPdfRbg(),
            borderWidth: 0,
            scale: 0.6,
          });
        } else if (division === Division.Science) {
          page.drawSvgPath(politySymbolArrowHeadScience, {
            borderColor: SimpleColor.from('#ffffff').asPdfRbg(),
            color: colour.asPdfRbg(),
            borderWidth: 0,
            scale: 0.6,
          });
        } else if (division === Division.Operations) {
          page.drawSvgPath(politySymbolArrowHeadOperations, {
            borderColor: SimpleColor.from('#ffffff').asPdfRbg(),
            color: colour.asPdfRbg(),
            borderWidth: 0,
            scale: 0.6,
          });
        }
      }
    } else if (character.isKlingonImperialCitizen) {
      page.moveTo(704, page.getHeight() - 63);

      page.drawSvgPath(politySymbolKlingonSymbolCircle, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: SimpleColor.from('#ffffff').asPdfRbg(),
        borderWidth: 1,
        scale: 0.6,
      });

      page.drawSvgPath(politySymbolKlingonSymbol, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: colour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });
    } else if (character.isCardassian) {
      page.moveTo(704, page.getHeight() - 63);

      page.drawSvgPath(politySymbolCardassianSymbolInner, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: colour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });

      page.drawSvgPath(politySymbolCardassianSymbolOutline, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });
    } else if (character.isRomulanStarEmpire) {
      page.moveTo(690, page.getHeight() - 65);

      page.drawSvgPath(politySymbolRomulanSymbolBackground, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: colour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });

      page.drawSvgPath(politySymbolRomulanSymbolBird, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: colour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });
    } else if (character.isTalarian) {
      page.moveTo(704, page.getHeight() - 66);

      page.drawSvgPath(politySymbolTalarianMain, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: colour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.7,
      });

      page.drawSvgPath(politySymbolTalarianExtra, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.7,
      });
    } else if (character.isOrion) {
      page.moveTo(690, page.getHeight() - 65);

      page.drawSvgPath(politySymbolOrionSymbol, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: colour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });
    } else if (character.isFerengi) {
      page.moveTo(700, page.getHeight() - 69);

      page.drawSvgPath(politySymbolFerengiSymbol, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: colour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });
    } else if (character.isTzenkethi) {
      page.moveTo(700, page.getHeight() - 65);

      page.drawSvgPath(politySymbolTzenkethiBack, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: Landscape2eCharacterSheet.greyColour.lighten(0.3).asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });

      page.drawSvgPath(politySymbolTzenkethiFront, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: colour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });
    } else if (character.isTholian) {
      page.moveTo(700, page.getHeight() - 69);

      page.drawSvgPath(politySymbolTholianBackground, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: colour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });

      page.drawSvgPath(politySymbolTholianForeground, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: SimpleColor.from('#ffffff').asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });
    } else if (character.isSona) {
      page.moveTo(700, page.getHeight() - 65);

      page.drawSvgPath(politySymbolSona, {
        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        color: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });
    } else if (
      character.type === CharacterType.Civilian ||
      character.type === CharacterType.Child ||
      character.type === CharacterType.AmbassadorDiplomat
    ) {
      page.moveTo(695, page.getHeight() - 67);

      page.drawSvgPath(politySymbolFederationLaurels, {
        borderColor: greyColour2e.asPdfRbg(),
        color: greyColour2e.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });

      page.drawSvgPath(politySymbolFederationStarfield, {
        borderColor: greyColour2e.asPdfRbg(),
        color: greyColour2e.asPdfRbg(),
        borderWidth: 0,
        scale: 0.6,
      });
    }
  }

  writeLabels(page: PDFPage, construct: Character) {
    const subHeadings = {
      'Construct.other.attributes': new Column(55.1, 287.2, 9.5, 211),
      'Construct.other.departments': new Column(286.8, 287.2, 9.5, 211),
    };

    labelWriter(
      page,
      subHeadings,
      construct.version,
      this.headingFont,
      9,
      Landscape2eCharacterSheet.greyColour,
      TextAlign.Centre,
    );

    labelWriter(
      page,
      {
        'Construct.attribute.control': new Column(56.8, 308, 8.5, 45),
        'Construct.attribute.daring': new Column(56.8, 332.9, 8.5, 45),
        'Construct.attribute.fitness': new Column(129.9, 308, 8.5, 45),
        'Construct.attribute.insight': new Column(129.9, 332.9, 8.5, 45),
        'Construct.attribute.presence': new Column(202.5, 308, 8.5, 45),
        'Construct.attribute.reason': new Column(202.5, 332.9, 8.5, 45),

        'Construct.discipline.command': new Column(289, 308, 8.5, 45),
        'Construct.discipline.conn': new Column(289, 332.9, 8.5, 45),
        'Construct.discipline.engineering': new Column(361.1, 308, 8.5, 45),
        'Construct.discipline.security': new Column(361.1, 332.9, 8.5, 45),
        'Construct.discipline.medicine': new Column(433.2, 308, 8.5, 45),
        'Construct.discipline.science': new Column(433.2, 332.9, 8.5, 45),
      },
      construct.version,
      this.fonts.fontByType(FontType.Bold),
      8,
      (label) => labelColourProvider(construct.era, label),
    );

    labelWriter(
      page,
      {
        'Construct.other.name': new Column(55.4 + 3, 72.4 + 1, 6, 248.2 - 5),
        'Construct.other.pronouns': new Column(311 + 3, 72.4 + 1, 6, 86.1 - 5),
        'Construct.other.rank': new Column(55.4 + 3, 102 + 2, 6, 166 - 5),
        'Construct.other.assignment': new Column(227 + 3, 102 + 1, 6, 166 - 5),
        'Construct.other.characterRole': new Column(
          55.4 + 3,
          131.3 + 1,
          6,
          248.2 - 5,
        ),
        'Construct.other.reputation': new Column(
          311 + 3,
          131.3 + 1,
          6,
          86.1 - 5,
        ),
        'Construct.other.speciesAndTraits': new Column(
          55.4 + 3,
          161 + 1,
          6,
          339.9 - 5,
        ),
        'Construct.other.environment': new Column(
          55.4 + 3,
          190.8 + 1,
          6,
          166 - 5,
        ),
        'Construct.other.upbringing': new Column(
          227 + 3,
          190.8 + 1,
          6,
          166 - 5,
        ),
        'Construct.other.careerPath': new Column(
          55.4 + 3,
          220.1 + 1,
          6,
          166 - 5,
        ),
        'Construct.other.experience': new Column(
          227 + 3,
          220.1 + 1,
          6,
          166 - 5,
        ),
        'Construct.other.careerEvent1': new Column(
          55.4 + 3,
          249.4 + 1,
          6,
          166 - 5,
        ),
        'Construct.other.careerEvent2': new Column(
          227 + 3,
          249.4 + 1,
          6,
          166 - 5,
        ),
        'Construct.other.focuses': new Column(
          561.5 + 3,
          96.2 + 1,
          6,
          162.7 - 5,
        ),
        'Construct.other.pastimes': new Column(
          561.5 + 3,
          243.6 + 1,
          6,
          162.7 - 5,
        ),
        'Construct.other.values': new Column(
          561.5 + 3,
          279.1 + 1,
          6,
          162.7 - 5,
        ),
        'Construct.other.attacks': new Column(
          561.5 + 3,
          403.7 + 1,
          6,
          162.7 - 5,
        ),
        'Construct.other.equipment': new Column(
          561.5 + 3,
          502.9 + 1,
          6,
          162.7 - 5,
        ),
      },
      construct.version,
      this.headingFont,
      5,
      tealColour2e,
    );

    if (construct.stereotype === Stereotype.Npc && construct.version !== 1) {
      const paragraph = new Paragraph(
        page,
        new Column(411.2, 220.6, 12, 41.4),
        this.fonts,
      );
      paragraph.textAlignment = TextAlign.Centre;
      paragraph.append(
        i18next.t('Construct.other.personalThreat').toLocaleUpperCase(),
        new FontSpecification(this.headingFont, 5),
        Landscape2eCharacterSheet.greyColour,
      );
      paragraph.write();
    } else if ((construct as Character).isStressTrackPresent) {
      if (construct.stereotype !== Stereotype.Npc) {
        labelWriter(
          page,
          {
            'Construct.other.determination': new Column(564.1, 77.8, 6, 70),
            'Construct.other.stress': new Column(421.2, 224.6, 6, 36.4),
          },
          construct.version,
          this.headingFont,
          5,
          Landscape2eCharacterSheet.greyColour,
          TextAlign.Left,
        );
      } else {
        labelWriter(
          page,
          {
            'Construct.other.stress': new Column(421.2, 224.6, 6, 36.4),
          },
          construct.version,
          this.headingFont,
          5,
          Landscape2eCharacterSheet.greyColour,
          TextAlign.Left,
        );
      }
    }

    labelWriter(
      page,
      {
        'Construct.other.protection': new Column(506.8, 305, 6, 46.5),
      },
      construct.version,
      this.headingFont,
      5,
      Landscape2eCharacterSheet.greyColour,
      TextAlign.Centre,
    );
  }

  async writeRoleAndTalents(
    page: PDFPage,
    character: Character,
    column: Column,
  ) {
    column = this.writeCharacterDescription(page, character, column);
    const temp = column.columnWithAtLeast(35, page);
    column = temp.column;
    page = temp.page;

    if (
      character.stereotype === Stereotype.Npc ||
      character.stereotype === Stereotype.SupportingCharacter
    ) {
      const subHeadings = {
        'Construct.other.specialRules': column.topBefore(9.5),
      };
      column = column.bottomAfter(12);
      labelWriter(
        page,
        subHeadings,
        character.version,
        this.headingFont,
        9,
        Landscape2eCharacterSheet.greyColour,
        TextAlign.Centre,
      );
    } else {
      const subHeadings = { 'Construct.other.talents': column.topBefore(9.5) };
      column = column.bottomAfter(12);
      labelWriter(
        page,
        subHeadings,
        character.version,
        this.headingFont,
        9,
        Landscape2eCharacterSheet.greyColour,
        TextAlign.Centre,
      );
    }

    const writer = new TalentWriter(page, this.fonts, character.version);
    const lastArea = await writer.writeTalentsPageArea(
      assembleWritableItems(character),
      column,
      8,
    );
    return lastArea;
  }

  createDeterminationBoxes(page: PDFPage, pdf: PDFDocument) {
    new CheckMarkMaker(page, pdf).createCheckMarksAndBoxes(
      [
        new Column(650.4, 77.1, 9.5, 9.5),
        new Column(665.2, 77.1, 9.5, 9.5),
        new Column(680, 77.1, 9.5, 9.5),
      ],
      'Determination ',
      Landscape2eCharacterSheet.greyColour,
    );
  }

  createStressBoxes(page: PDFPage, pdf: PDFDocument, character: Character) {
    const columns = [];
    const startX = 464.9;
    const startY = 221.3;
    const gap = 478.8 - startX;

    const availableVerticalSpace = 4 * gap;
    if (character.isStressTrackPresent) {
      const numberOfLines = Math.ceil(character.stress / 5);

      const verticalOffset = (availableVerticalSpace - numberOfLines * gap) / 2;

      for (let i = 0; i < character.stress; i++) {
        const x = startX + gap * (i % 5);
        const y = startY + gap * Math.floor(i / 5) + verticalOffset;
        columns.push(new Column(x, y, 9.5, 9.5));
      }

      new CheckMarkMaker(page, pdf).createCheckMarksAndBoxes(
        columns,
        'Stress ',
        Landscape2eCharacterSheet.greyColour,
      );
    } else if (
      character.stereotype === Stereotype.Npc &&
      character.version !== 1
    ) {
      const numberOfLines = Math.ceil(character.personalThreat / 5);

      const verticalOffset = (availableVerticalSpace - numberOfLines * gap) / 2;
      for (let i = 0; i < character.personalThreat; i++) {
        const x = startX + gap * (i % 5);
        const y = startY + gap * Math.floor(i / 5) + verticalOffset;
        columns.push(new Column(x, y, 9.5, 9.5));
      }

      new CheckMarkMaker(page, pdf).createCheckMarksAndBoxes(
        columns,
        'Threat ',
        Landscape2eCharacterSheet.greyColour,
      );
    }
  }

  writeTitle(page: PDFPage, colour: SimpleColor) {
    const originalText = i18next.t('Sheet.text.title.alt').toLocaleUpperCase();
    let text = originalText;
    const fontSize = determineIdealFontWidth(
      [text],
      Landscape2eCharacterSheet.headingColumn.width,
      10,
      7.5,
      this.headingFont,
    );
    const block = Landscape2eCharacterSheet.headingColumn;
    let width = this.headingFont.widthOfTextAtSize(text, fontSize);
    while (width > block.width) {
      text = text.substring(0, text.length - 1);
      width = this.headingFont.widthOfTextAtSize(text + '...', fontSize);
    }

    if (text !== originalText) {
      text += '...';
    }

    const triangle =
      'M 60.232529,54.856579 V 44.842907 l 8.671875,5.009766 z m 0.580078,-1.001953 6.9375,-4.001953 -6.9375,-4.007813 z';

    const widthOfTab = Math.max(146.205, width + 35);
    const startOffset = 54.966797;

    const farthestEdge = widthOfTab + startOffset;
    const circle1 = farthestEdge - (189.83203 - 184.75613);
    const circle2 = farthestEdge - (189.83203 - 178.49414);

    const tab =
      'M 54.966797 40.257812 ' +
      'C 48.704803 40.257812 43.626953 45.333709 43.626953 51.595703 ' +
      'L 43.626953 79.257812 ' +
      'L 44.046875 79.257812 ' +
      'L 44.048828 70.263672 ' +
      'C 44.048828 64.286678 48.911678 59.425781 54.888672 59.425781 ' +
      'L ' +
      farthestEdge +
      ' 59.425781 ' +
      'L ' +
      farthestEdge +
      ' 51.595703 ' +
      'C ' +
      farthestEdge +
      ' 45.333709 ' +
      circle1 +
      ' 40.257812 ' +
      circle2 +
      ' 40.257812 ' +
      'L 54.966797 40.257812 ' +
      'z';

    page.moveTo(0, page.getHeight());

    page.drawSvgPath(tab, {
      borderColor: SimpleColor.from('#000000').asPdfRbg(),
      color: colour.asPdfRbg(),
      borderWidth: 0,
    });

    page.drawSvgPath(triangle, {
      borderColor: SimpleColor.from('#000000').asPdfRbg(),
      color: SimpleColor.from('#ffffff').asPdfRbg(),
      borderWidth: 0,
    });

    page.drawText(text, {
      x: block.start.x,
      y: page.getHeight() - block.end.y,
      color: SimpleColor.from('#ffffff').asPdfRbg(),
      font: this.headingFont,
      size: fontSize,
    });
  }

  populateForm(form: PDFForm, character: Character) {
    form.getFields().forEach((f) => {
      if (f instanceof PDFTextField) {
        const textField = f as PDFTextField;
        if (
          textField.isMultiline() &&
          (textField.getText() == null || textField.getText().length === 0)
        ) {
          textField.updateAppearances(
            this.formFont,
            staTextFieldAppearanceProvider(8),
          );
        }
      }
    });

    super.populateForm(form, character);

    this.fillCharacterRole(form, character);
    this.fillPastimes(form, character);
    this.fillStressBox(form, character);
    this.fillCareerPath(form, character);
    this.fillExperience(form, character);
  }

  fillCharacterRole(form: PDFForm, character: Character) {
    this.fillField(form, 'Character Role', character.assignmentWithoutShip);
  }

  fillAssignment(form: PDFForm, character: Character): void {
    this.fillField(form, 'Assignment', character.assignedShip ?? '');
  }

  fillStressBox(form: PDFForm, character: Character): void {
    if (character.isStressTrackPresent) {
      this.fillField(form, 'Stress', '' + character.stress);
    } else if (character.isPersonalThreatTrackPresent) {
      this.fillField(form, 'Stress', '' + character.personalThreat);
    } else {
      this.fillField(form, 'Stress', '-');
    }
  }

  fillEquipment(form: PDFForm, character: Character): void {
    const equipment = character.equipment.join(', ');
    this.fillField(form, 'Equipment', equipment);
  }

  fillFocuses(form: PDFForm, character: Character): void {
    const focuses =
      character.focuses?.sort((a, b) => a.localeCompare(b)).join('\n') ?? '';
    this.fillField(form, 'Focuses', focuses);
  }

  fillPastimes(form: PDFForm, character: Character): void {
    const pastime =
      character.pastime?.sort((a, b) => a.localeCompare(b)).join('\n') ?? '';
    this.fillField(form, 'Pastimes', pastime);
  }

  fillValues(form: PDFForm, character: Character): void {
    const values =
      character.values.sort((a, b) => a.localeCompare(b)).join('\n') ?? '';
    this.fillField(form, 'Values', values);
  }

  fillExperience(form: PDFForm, character: Character): void {
    if (character.careerStep?.career != null) {
      const career = CareersHelper.instance.getCareer(
        character.careerStep.career,
        character,
      );
      this.fillField(form, 'Experience', career.localizedName);
    }
  }

  fillWeapons(form: PDFForm, construct: Construct): void {
    const describer = new WeaponDescriber(construct.version, true);

    if (construct instanceof Character) {
      const attacks = construct.determineWeapons().map((w) => {
        let escalation = '';
        if (w.escalation) {
          escalation =
            i18next.t('Weapon.common.escalation', { value: w.escalation }) +
            ': ';
        }

        return (
          escalation +
          w.name +
          ': ' +
          describer
            .describeFully(w, construct)
            .replace(CHALLENGE_DICE_NOTATION, '\u25B2')
        );
      });

      this.fillField(form, 'Attacks', attacks.join('\n'));
    }
  }
}
