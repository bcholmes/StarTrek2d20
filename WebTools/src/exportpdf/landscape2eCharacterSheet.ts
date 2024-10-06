import i18next from "i18next";
import { SimpleColor } from "../common/colour";
import { BaseFormFillingSheet } from "./baseFormFillingSheet";
import { Column } from "./column";
import { SheetTag } from "./icharactersheet";
import { PDFDocument, PDFForm, PDFPage, PDFTextField } from "@cantoo/pdf-lib";
import { Construct, Stereotype } from "../common/construct";
import { TalentWriter } from "./talentWriter";
import { Character, Division } from "../common/character";
import { assembleWritableItems } from "./generatedsheet";
import { FontLibrary, FontType } from "./fontLibrary";
import { labelWriter } from "./labelWriter";
import { TextAlign } from "./textAlign";
import { CheckMarkMaker } from "./checkMarkMaker";
import { staTextFieldAppearanceProvider } from "../helpers/pdfTextFieldAppearance";
import { CareersHelper } from "../helpers/careers";
import { WeaponDescriber } from "./weaponDescriber";
import { CHALLENGE_DICE_NOTATION } from "../common/challengeDiceNotation";
import { CharacterType, CharacterTypeModel } from "../common/characterType";
import { TracksHelper } from "../helpers/tracks";
import { cardassianBrownColour2e, divisionColour2e, ferengiOrangeColour2e, greyColour2e, klingonRedColour2e, labelColourProvider, orionGreenColour2e, romulanGreenColour2e, tealColour2e } from "./colourProvider2e";
import { politySymbolArrowHead, politySymbolArrowHeadCommand, politySymbolArrowHeadOperations, politySymbolArrowHeadScience, politySymbolCardassianSymbolInner, politySymbolCardassianSymbolOutline, politySymbolFederationLaurels, politySymbolFederationStarfield, politySymbolFerengiSymbol, politySymbolKlingonSymbol, politySymbolKlingonSymbolCircle, politySymbolOrionSymbol, politySymbolRomulanSymbolBackground, politySymbolRomulanSymbolBird, politySymbolSona } from "./politySymbols";

export class Landscape2eCharacterSheet extends BaseFormFillingSheet {

    static readonly sideBubblesOpen = "m 735.7824,517.764 h 5.533 c 0.917,0 1.662,0.746 1.662,1.662 v 10.464 c 0,0.917 -0.745,1.662 -1.662,1.662 h -5.533 c -0.916,0 -1.662,-0.745 -1.662,-1.662 v -10.464 c 0,-0.916 0.746,-1.662 1.662,-1.662 m 0,-18.1846 h 5.533 c 0.917,0 1.662,-0.746 1.662,-1.662 v -13.025 c 0,-0.916 -0.745,-1.662 -1.662,-1.662 h -5.533 c -0.916,0 -1.662,0.746 -1.662,1.662 v 13.025 c 0,0.916 0.746,1.662 1.662,1.662";
    static readonly sideBubblesClosed = "m 735.78096,501.528 h 5.534 c 1.051,0 1.912,0.86 1.912,1.912 v 10.465 c 0,1.05 -0.861,1.912 -1.912,1.912 h -5.534 c -1.053,0 -1.912,-0.862 -1.912,-1.912 V 503.44 c 0,-1.052 0.859,-1.912 1.912,-1.912 m 0,45.436 h 5.534 c 1.051,0 1.912,-0.861 1.912,-1.912 v -9.639 c 0,-1.051 -0.861,-1.912 -1.912,-1.912 h -5.534 c -1.053,0 -1.912,0.861 -1.912,1.912 v 9.639 c 0,1.051 0.859,1.912 1.912,1.912 m 0,11.852 h 5.534 c 1.051,0 1.912,-0.86 1.912,-1.912 v -6.331 c 0,-1.052 -0.861,-1.912 -1.912,-1.912 h -5.534 c -1.053,0 -1.912,0.86 -1.912,1.912 v 6.331 c 0,1.052 0.859,1.912 1.912,1.912";
    static readonly bottomDots = "m 192.05624,598.5726 c 0,1.829 -1.481,3.312 -3.311,3.313 -1.831,0 -3.314,-1.484 -3.314,-3.313 0,-1.829 1.483,-3.311 3.314,-3.312 1.829,0.001 3.311,1.483 3.311,3.312 m -5.808,0 h 0 v 0 h 0 z m 429.723,-1.8918 c -1.829,0 -3.312,-1.481 -3.313,-3.311 0,-1.831 1.484,-3.313 3.313,-3.313 1.829,0 3.311,1.483 3.312,3.313 0,1.829 -1.483,3.311 -3.312,3.311 m 0,-5.808 h 0.001 v 0 h -0.001 z"
    static readonly mainBorder = "m 54.887856,59.425403 c -5.977,0 -10.839,4.862 -10.839,10.839 l -0.074,487.498997 c 0,2.895 1.128,5.617 3.175,7.664 2.047,2.047 4.769,3.174 7.664,3.174 l 686.462004,-0.01 c 5.976,0 10.839,-4.862 10.839,-10.839 v -75.211 c 0,-3.197 -1.802,-7.676 -4.015,-9.983 l -6.712,-6.995 c -4.406,-4.591 -7.99,-13.502 -7.991,-19.866 l 0.026,-375.432997 c -10e-4,-5.977 -4.864,-10.839 -10.84,-10.839 z"
    static readonly cornerDecoration = "m 439.4088,-8.84068 19.12,19.12 c 4.34,4.34 12.864,7.871 19.002,7.871 h 251.115 c 2.359,0 5.513,1.306 7.182,2.975 l 5.594,5.594 c 4.341,4.341 12.865,7.872 19.003,7.872 h 42.94403";

    static readonly talentsColumn3 = new Column(390.6, 361, 200, 162);
    static readonly talentsColumn2 = new Column(221.7, 361, 200, 162, this.talentsColumn3);
    static readonly talentsColumn1 = new Column(51.5, 373, 180, 162, this.talentsColumn2);

    static readonly greyColour: SimpleColor = SimpleColor.from("#979696");

    static readonly headingColumn = new Column(73.8, 45, 8.8, 200);

    fonts: FontLibrary = new FontLibrary();

    getName(): string {
        return i18next.t("Sheet.landscape2eCharacterSheet");
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/STA_2e_Landscape_Sheet_400.png'
    }
    getPdfUrl(): string {
        return '/static/pdf/STA_2e_Landscape_Sheet.pdf'
    }

    getDefaultFontPath() {
        return "/static/font/OpenSansCondensed-Light.ttf";
    }

    getTags(): SheetTag[] {
        return [ SheetTag.Landscape, SheetTag.Style2e, SheetTag.UsLetter, SheetTag.LanguageSupport, SheetTag.TalentText ];
    }

    async initializeFonts(pdf: PDFDocument) {
        await super.initializeFonts(pdf);

        const fontBytes = await fetch("/static/font/Michroma-Regular.ttf").then(res => res.arrayBuffer());
        this.headingFont = await pdf.embedFont(fontBytes);

        this.fonts.addFont(FontType.Standard, this.formFont);

        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        const boldFont = await pdf.embedFont(boldFontBytes);
        this.fonts.addFont(FontType.Bold, boldFont);

        const italicFontBytes = await fetch("/static/font/OpenSansCondensed-LightItalic.ttf").then(res => res.arrayBuffer());
        const italicFont = await pdf.embedFont(italicFontBytes);
        this.fonts.addFont(FontType.Italic, italicFont);

        const symbolFontBytes = await fetch("/static/font/Trek_Arrowheads.ttf").then(res => res.arrayBuffer());
        const symbolFont = await pdf.embedFont(symbolFontBytes);
        this.fonts.addFont(FontType.Symbol, symbolFont);
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);

        const page = pdf.getPage(0);

        const colour = this.deriveSheetColour(construct as Character);

        this.drawSheetDecorations(page, colour);

        this.writeLabels(page, construct as Character);
        this.writeRoleAndTalents(page, construct as Character);
        this.writeTitle(page, colour);

        this.createDeterminationBoxes(page, pdf);
        this.createStressBoxes(page, pdf, construct as Character);

        this.drawArrowHead(page, construct as Character, colour);
    }

    deriveSheetColour(character: Character) {
        if (character.type === CharacterType.Starfleet || character.type === CharacterType.Cadet) {
            const division = character.division;
            return division != null ? divisionColour2e(character.era, division) : tealColour2e;
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
        } else {
            return tealColour2e;
        }
    }

    drawSheetDecorations(page: PDFPage, colour: SimpleColor) {
        page.moveTo(0, page.getHeight());

        page.drawSvgPath(Landscape2eCharacterSheet.sideBubblesOpen, {
            borderColor: colour.asPdfRbg(),
            borderWidth: 0.5
        });

        page.drawSvgPath(Landscape2eCharacterSheet.sideBubblesClosed, {
            borderColor: colour.asPdfRbg(),
            color: colour.asPdfRbg(),
            borderWidth: 0.5
        });

        page.drawSvgPath(Landscape2eCharacterSheet.bottomDots, {
            borderColor: colour.asPdfRbg(),
            color: colour.asPdfRbg(),
            borderWidth: 0
        });

        page.drawSvgPath(Landscape2eCharacterSheet.mainBorder, {
            borderColor: colour.asPdfRbg(),
            borderWidth: 1
        });

        page.drawSvgPath(Landscape2eCharacterSheet.cornerDecoration, {
            borderColor: colour.asPdfRbg(),
            borderWidth: 1
        });

    }

    drawArrowHead(page: PDFPage, character: Character, colour: SimpleColor) {
        if (character.type === CharacterType.Starfleet || character.type === CharacterType.Cadet) {

            const division = character.division;
            if (division != null) {
                page.moveTo(704, page.getHeight() - 63);

                page.drawSvgPath(politySymbolArrowHead, {
                    borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                    color: SimpleColor.from("#ffffff").asPdfRbg(),
                    borderWidth: 1,
                    scale: 0.6
                });

                if (division === Division.Command) {
                    page.drawSvgPath(politySymbolArrowHeadCommand, {
                        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                        color: colour.asPdfRbg(),
                        borderWidth: 0,
                        scale: 0.6
                    });
                } else if (division === Division.Science) {
                    page.drawSvgPath(politySymbolArrowHeadScience, {
                        borderColor: SimpleColor.from("#ffffff").asPdfRbg(),
                        color: colour.asPdfRbg(),
                        borderWidth: 0,
                        scale: 0.6
                    });
                } else if (division === Division.Operations) {
                    page.drawSvgPath(politySymbolArrowHeadOperations, {
                        borderColor: SimpleColor.from("#ffffff").asPdfRbg(),
                        color: colour.asPdfRbg(),
                        borderWidth: 0,
                        scale: 0.6
                    });
                }
            }
        } else if (character.isKlingonImperialCitizen) {
            page.moveTo(704, page.getHeight() - 63);

            page.drawSvgPath(politySymbolKlingonSymbolCircle, {
                borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                color: SimpleColor.from("#ffffff").asPdfRbg(),
                borderWidth: 1,
                scale: 0.6
            });

            page.drawSvgPath(politySymbolKlingonSymbol, {
                borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                color: colour.asPdfRbg(),
                borderWidth: 0,
                scale: 0.6
            });

        } else if (character.isCardassian) {
            page.moveTo(704, page.getHeight() - 63);

            page.drawSvgPath(politySymbolCardassianSymbolInner, {
                borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                color: colour.asPdfRbg(),
                borderWidth: 0,
                scale: 0.6
            });

            page.drawSvgPath(politySymbolCardassianSymbolOutline, {
                borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                color: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                borderWidth: 0,
                scale: 0.6
            });

        } else if (character.isRomulanStarEmpire) {
            page.moveTo(690, page.getHeight() - 65);

            page.drawSvgPath(politySymbolRomulanSymbolBackground, {
                borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                color: colour.asPdfRbg(),
                borderWidth: 0,
                scale: 0.6
            });

            page.drawSvgPath(politySymbolRomulanSymbolBird, {
                borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                color: colour.asPdfRbg(),
                borderWidth: 0,
                scale: 0.6
            });

        } else if (character.isOrion) {
            page.moveTo(690, page.getHeight() - 65);

            page.drawSvgPath(politySymbolOrionSymbol, {
                borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                color: colour.asPdfRbg(),
                borderWidth: 0,
                scale: 0.6
            });

        } else if (character.isFerengi) {
            page.moveTo(700, page.getHeight() - 69);

            page.drawSvgPath(politySymbolFerengiSymbol, {
                borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                color: colour.asPdfRbg(),
                borderWidth: 0,
                scale: 0.6
            });

        } else if (character.isSona) {
            page.moveTo(700, page.getHeight() - 65);

            page.drawSvgPath(politySymbolSona, {
                borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                color: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                borderWidth: 0,
                scale: 0.6
            });

        } else if (character.type === CharacterType.Civilian || character.type === CharacterType.Child
                || character.type === CharacterType.AmbassadorDiplomat) {
            page.moveTo(695, page.getHeight() - 67);

            page.drawSvgPath(politySymbolFederationLaurels, {
                borderColor: greyColour2e.asPdfRbg(),
                color: greyColour2e.asPdfRbg(),
                borderWidth: 0,
                scale: 0.6
            });

            page.drawSvgPath(politySymbolFederationStarfield, {
                borderColor: greyColour2e.asPdfRbg(),
                color: greyColour2e.asPdfRbg(),
                borderWidth: 0,
                scale: 0.6
            });
        }
    }


    writeLabels(page: PDFPage, construct: Character) {
        const subHeadings = {
            "Construct.other.attributes": new Column(55.1, 287.2, 9.5, 211),
            "Construct.other.departments": new Column(286.8, 287.2, 9.5, 211),
        }

        if (construct.stereotype === Stereotype.Npc || construct.stereotype === Stereotype.SupportingCharacter) {
            subHeadings["Construct.other.specialRules"] = new Column(51.5, 361, 9.5, 162);
        } else {
            subHeadings["Construct.other.talents"] = new Column(51.5, 361, 9.5, 162);
        }

        labelWriter(page, subHeadings, construct.version,
            this.headingFont, 9, Landscape2eCharacterSheet.greyColour, TextAlign.Centre);

        labelWriter(page, {
                "Construct.attribute.control": new Column(56.8, 308, 8.5, 45),
                "Construct.attribute.daring": new Column(56.8, 332.9, 8.5, 45),
                "Construct.attribute.fitness": new Column(129.9, 308, 8.5, 45),
                "Construct.attribute.insight": new Column(129.9, 332.9, 8.5, 45),
                "Construct.attribute.presence": new Column(202.5, 308, 8.5, 45),
                "Construct.attribute.reason": new Column(202.5, 332.9, 8.5, 45),

                "Construct.discipline.command": new Column(289, 308, 8.5, 45),
                "Construct.discipline.conn": new Column(289, 332.9, 8.5, 45),
                "Construct.discipline.engineering": new Column(361.1, 308, 8.5, 45),
                "Construct.discipline.security": new Column(361.1, 332.9, 8.5, 45),
                "Construct.discipline.medicine": new Column(433.2, 308, 8.5, 45),
                "Construct.discipline.science": new Column(433.2, 332.9, 8.5, 45),
            }, construct.version,
            this.fonts.fontByType(FontType.Bold), 8, ((label) => labelColourProvider(construct.era, label)));

        labelWriter(page, {
            "Construct.other.name": new Column(55.4 + 3, 72.4 + 1, 6, 248.2 - 5),
            "Construct.other.pronouns": new Column(309.2 + 3, 72.4 + 1, 6, 86.1 - 5),
            "Construct.other.rank": new Column(55.4 + 3, 102 + 2, 6, 166 - 5),
            "Construct.other.assignment": new Column(227 + 3, 102 + 1, 6, 166 - 5),
            "Construct.other.characterRole": new Column(55.4 + 3, 131.3 + 1, 6, 248.2 - 5),
            "Construct.other.reputation": new Column(309.2 + 3, 131.3 + 1, 6, 86.1 - 5),
            "Construct.other.speciesAndTraits": new Column(55.4 + 3, 161 + 1, 6, 339.9 - 5),
            "Construct.other.environment": new Column(55.4 + 3, 190.8 + 1, 6, 166 - 5),
            "Construct.other.upbringing": new Column(227 + 3, 190.8 + 1, 6, 166 - 5),
            "Construct.other.careerPath": new Column(55.4 + 3, 220.1 + 1, 6, 166 - 5),
            "Construct.other.experience": new Column(227 + 3, 220.1 + 1, 6, 166 - 5),
            "Construct.other.careerEvent1": new Column(55.4 + 3, 249.4 + 1, 6, 166 - 5),
            "Construct.other.careerEvent2": new Column(227 + 3, 249.4 + 1, 6, 166 - 5),
            "Construct.other.focuses": new Column(561.5 + 3, 96.2 + 1, 6, 162.7 - 5),
            "Construct.other.pastimes": new Column(561.5 + 3, 243.6 + 1, 6, 162.7 - 5),
            "Construct.other.values": new Column(561.5 + 3, 279.1 + 1, 6, 162.7 - 5),
            "Construct.other.attacks": new Column(561.5 + 3, 403.7 + 1, 6, 162.7 - 5),
            "Construct.other.equipment": new Column(561.5 + 3, 502.9 + 1, 6, 162.7 - 5),
        }, construct.version,
        this.headingFont, 5, tealColour2e);

        labelWriter(page, {
                "Construct.other.determination": new Column(564.1, 77.8, 6, 70),
                "Construct.other.stress": new Column(421.2, 224.6, 6, 36.4),
            }, construct.version,
            this.headingFont, 5, Landscape2eCharacterSheet.greyColour, TextAlign.Left);

        labelWriter(page, {
                "Construct.other.resistance": new Column(506.8, 305, 6, 46.5)
            }, construct.version,
            this.headingFont, 5, Landscape2eCharacterSheet.greyColour, TextAlign.Centre);

    }

    writeRoleAndTalents(page: PDFPage, character: Character) {
        new TalentWriter(page, this.fonts, character.version).writeTalents(
            assembleWritableItems(character),
            Landscape2eCharacterSheet.talentsColumn1, 8);
    }

    createDeterminationBoxes(page: PDFPage, pdf: PDFDocument) {
        new CheckMarkMaker(page, pdf).createCheckMarksAndBoxes(
            [
                new Column(650.4, 77.1, 9.5, 9.5),
                new Column(665.2, 77.1, 9.5, 9.5),
                new Column(680, 77.1, 9.5, 9.5),
            ], "Determination ", Landscape2eCharacterSheet.greyColour
        );
    }

    createStressBoxes(page: PDFPage, pdf: PDFDocument, character: Character) {
        let columns = [];
        let startX = 464.9;
        let startY = 221.3;
        let gap = 478.8 - startX;

        let availableVerticalSpace = 4 * gap;
        let numberOfLines = Math.ceil(character.stress / 5);

        let verticalOffset = (availableVerticalSpace - numberOfLines * gap) / 2;

        for (let i = 0; i < character.stress; i++) {
            let x = startX + (gap * (i % 5));
            let y = startY + (gap * Math.floor(i / 5)) + verticalOffset;
            columns.push(new Column(x, y, 9.5, 9.5));
        }

        new CheckMarkMaker(page, pdf).createCheckMarksAndBoxes(columns, "Stress ",
            Landscape2eCharacterSheet.greyColour);
    }

    writeTitle(page: PDFPage, colour: SimpleColor) {
        const originalText = i18next.t("Sheet.text.title.alt").toLocaleUpperCase();
        let text = originalText;
        const fontSize = this.determineIdealFontWidth([ text ],
            Landscape2eCharacterSheet.headingColumn.width, 10, 7.5);
        const block = Landscape2eCharacterSheet.headingColumn;
        let width = this.headingFont.widthOfTextAtSize(text, fontSize);
        while (width > block.width) {
            text = text.substring(0, text.length-1);
            width = this.headingFont.widthOfTextAtSize(text + "...", fontSize);
        }

        if (text !== originalText) {
            text += "...";
        }

        const triangle = "M 60.232529,54.856579 V 44.842907 l 8.671875,5.009766 z m 0.580078,-1.001953 6.9375,-4.001953 -6.9375,-4.007813 z"


        let widthOfTab = Math.max(146.205, width + 35);
        let startOffset = 54.966797;

        let farthestEdge = widthOfTab + startOffset;
        let circle1 = farthestEdge - (189.83203 - 184.75613);
        let circle2 = farthestEdge - (189.83203 - 178.49414);


        const tab = "M 54.966797 40.257812 " +
            "C 48.704803 40.257812 43.626953 45.333709 43.626953 51.595703 " +
            "L 43.626953 79.257812 " +
            "L 44.046875 79.257812 " +
            "L 44.048828 70.263672 " +
            "C 44.048828 64.286678 48.911678 59.425781 54.888672 59.425781 " +
            "L " + farthestEdge + " 59.425781 " +
            "L " + farthestEdge + " 51.595703 " +
            "C " + farthestEdge + " 45.333709 " + circle1 + " 40.257812 " + circle2 + " 40.257812 " +
            "L 54.966797 40.257812 " +
            "z"

        page.moveTo(0, page.getHeight());

        page.drawSvgPath(tab, {
            borderColor: SimpleColor.from("#000000").asPdfRbg(),
            color: colour.asPdfRbg(),
            borderWidth: 0
        });

        page.drawSvgPath(triangle, {
            borderColor: SimpleColor.from("#000000").asPdfRbg(),
            color: SimpleColor.from("#ffffff").asPdfRbg(),
            borderWidth: 0
        });

        page.drawText(text, {
            x: block.start.x,
            y: page.getHeight() - (block.end.y),
            color: SimpleColor.from("#ffffff").asPdfRbg(),
            font: this.headingFont,
            size: fontSize
        });
    }

    populateForm(form: PDFForm, character: Character) {
        form.getFields().forEach(f => {
            if (f instanceof PDFTextField) {
                let textField = f as PDFTextField;
                if (textField.isMultiline() && (textField.getText() == null || textField.getText().length === 0)) {
                    textField.updateAppearances(this.formFont, staTextFieldAppearanceProvider(8));
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
        this.fillField(form, "Character Role", character.assignmentWithoutShip);
    }

    fillAssignment(form: PDFForm, character: Character): void {
        this.fillField(form, "Assignment", character.assignedShip ?? "");
    }

    fillStressBox(form: PDFForm, character: Character): void {
        this.fillField(form, "Stress", "" + character.stress);
    }


    fillCareerPath(form: PDFForm, character: Character): void {
        let path = CharacterTypeModel.getByType(character.type)?.localizedName ?? "";
        if (character.educationStep) {
            path += " / " + TracksHelper.instance.getTrack(character.educationStep?.track, character.type, character.version).localizedName;
        }

        this.fillField(form, "Career Path", path);
    }

    fillEquipment(form: PDFForm, character: Character): void {
        const equipment = character.equipment.join(", ");
        this.fillField(form, "Equipment", equipment);
    }

    fillFocuses(form: PDFForm, character: Character): void {
        const focuses = character.focuses.join(", ");
        this.fillField(form, "Focuses", focuses);
    }

    fillPastimes(form: PDFForm, character: Character): void {
        const pastime = character.pastime?.join(", ") ?? "";
        this.fillField(form, "Pastimes", pastime);
    }

    fillValues(form: PDFForm, character: Character): void {
        const values = character.values.join("\n");
        this.fillField(form, "Values", values);
    }

    fillExperience(form: PDFForm, character: Character): void {
        if (character.careerStep?.career != null) {
            const career = CareersHelper.instance.getCareer(character.careerStep.career, character);
            this.fillField(form, "Experience", career.localizedName);
        }
    }

    fillWeapons(form: PDFForm, construct: Construct): void {
        const describer = new WeaponDescriber(construct.version, true);

        if (construct instanceof Character) {
            let attacks = construct.determineWeapons()
                .map(w =>
                    w.name + ": " +
                    describer.describeFully(w, construct).replace(CHALLENGE_DICE_NOTATION, "\u25B2"));

            this.fillField(form, "Attacks", attacks.join("\n"));
        }
    }
}