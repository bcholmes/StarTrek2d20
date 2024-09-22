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
import { Era } from "../helpers/eras";
import { CheckMarkMaker } from "./checkMarkMaker";
import { staTextFieldAppearanceProvider } from "../helpers/pdfTextFieldAppearance";
import { CareersHelper } from "../helpers/careers";
import { WeaponDescriber } from "./weaponDescriber";
import { CHALLENGE_DICE_NOTATION } from "../common/challengeDiceNotation";
import { CharacterType, CharacterTypeModel } from "../common/characterType";
import { TracksHelper } from "../helpers/tracks";

export class Landscape2eCharacterSheet extends BaseFormFillingSheet {

    static readonly arrowHead = "m 22.388463,8.231562 c 1.65,2.987 3.083,5.945 4.299,8.875 1.332,3.358 2.485,6.873 3.459,10.545 0.975,3.673 2.041,8.533 3.199,14.58 0.116,0.612 0.203,1.066 0.261,1.363 -1.255,-2.708 -2.548,-4.962 -3.879,-6.761 -0.445,-0.575 -1.004,-1.178 -1.679,-1.809 -0.676,-0.63 -1.245,-1.094 -1.708,-1.391 l -0.029,-0.027 c -1.545,-0.835 -3.088,-1.104 -4.632,-0.807 -1.081,0.204 -2.611,0.992 -4.589,2.365 -1.978,1.372 -4.135,3.134 -6.47,5.286 -3.358,3.079 -6.793,6.677 -10.306,10.795 0.56,-6.64 1.593,-13.104 3.098,-19.392 2.76,-11.333 7.343,-21.665 13.751,-30.995 l 0.26,-0.417 c 1.66,2.207 3.315,4.804 4.965,7.79 z";
    static readonly arrowHeadCommand = "m 21.781303,25.97048 -2.581,-1.47 -1.583,-16.265 -1.583,16.265 -2.582,1.47 2.315,1.675 -0.667,4.361 2.517,-3.553 2.517,3.553 -0.667,-4.361 z";
    static readonly arrowHeadScience = "m 17.929687,13.525391 c -1.211473,-0.078 -2.410646,0.200111 -3.451171,0.802734 -2.993341,1.734956 -3.948221,5.664653 -2.15625,8.755859 1.791849,3.091166 5.676806,4.213676 8.669921,2.478516 2.992104,-1.734933 3.946837,-5.66319 2.15625,-8.753906 -1.105135,-1.907019 -3.068171,-3.145364 -5.21875,-3.283203 z m -0.05078,0.796875 c 1.340421,0.08591 2.4964,0.793282 3.464844,1.730468 -0.422801,-0.173066 -0.856783,-0.336831 -1.351563,-0.382812 -1.278338,-0.1188 -2.750085,0.165332 -4.154296,0.86914 -1.403992,0.704283 -2.485036,1.698796 -3.101563,2.775391 -0.244719,0.427336 -0.350891,0.877069 -0.433594,1.322266 -0.349495,-2.215752 0.597074,-4.46896 2.578125,-5.617188 0.902535,-0.522705 1.941969,-0.765261 2.998047,-0.697265 z m 2.041016,2.144531 c 1.101988,0.102411 1.933802,0.542997 2.326172,1.238281 0.391947,0.695374 0.313355,1.565897 -0.207032,2.474609 -0.520386,0.908713 -1.48585,1.81506 -2.765625,2.457032 -1.280086,0.641597 -2.620652,0.891313 -3.722656,0.789062 -1.102004,-0.102251 -1.933937,-0.544346 -2.326172,-1.240234 -0.391946,-0.695374 -0.313355,-1.563944 0.207032,-2.472656 0.520386,-0.908713 1.483897,-1.81506 2.763671,-2.457032 1.280045,-0.641574 2.622622,-0.891473 3.72461,-0.789062 z m 3.246094,2.785156 c 0.350912,2.216524 -0.5947,4.470209 -2.576172,5.619141 -2.177955,1.262598 -4.843014,0.713425 -6.603516,-1.072266 0.455232,0.205502 0.944649,0.373205 1.490235,0.423828 1.278417,0.11862 2.752079,-0.167303 4.156249,-0.871094 1.403992,-0.704282 2.483083,-1.698795 3.09961,-2.77539 0.245046,-0.427906 0.351017,-0.878432 0.433594,-1.324219 z";
    static readonly arrowHeadOperations = "m 22.347503,28.115082 c 0.062,0.053 0.049,0.076 -0.029,0.052 l -10.075,-3.115 c -0.078,-0.024 -0.144,-0.11 -0.149,-0.191 l -0.404,-7.781 c -0.004,-0.082 0.05,-0.179 0.122,-0.218 l 5.899,-3.201 c 0.071,-0.039 0.186,-0.036 0.256,0.006 l 4.506,2.702 c 0.07,0.042 0.121,0.142 0.114,0.223 l -0.535,6.459 c -0.007,0.081 -0.078,0.159 -0.158,0.173 l -4.263,0.759 -1.754,-3.507 c -0.036,-0.073 -0.009,-0.099 0.062,-0.059 0,0 1.971,2.363 3.511,2.015 1.54,-0.348 2.029,-2.297 2.099,-3.272 0.07,-0.974 -0.769,-3.759 -4.058,-3.829 -3.289,-0.069 -4.829,2.853 -4.829,4.525 0,4.317 9.685,8.259 9.685,8.259";

    static readonly klingonSymbol = "m 10.166206,32.73599 c -1.908,3.269 -11.152,2.651 -10.08,15.528 0.022,0.255 6.992,-8.445 16.436,-5.721 z m 13.74048,-0.1662 c 3.862,6.797 14.052,6.983 14.052,6.983 0,0 -11.397,7.999 -20.277,2.84 z m -6.903641,8.442958 6.015797,-9.704679 C 19.894391,27.71822 16.975266,0 16.975266,0 c 0,0 -2.890838,27.754579 -6.015753,31.343718 z";
    static readonly klingonSymbolCircle = "m 17.116606,22.17999 c 6.749,0 12.24,5.491 12.24,12.24 0,6.749 -5.491,12.24 -12.24,12.24 -6.749,0 -12.24,-5.491 -12.24,-12.24 0,-6.749 5.491,-12.24 12.24,-12.24 m 0,-1.109 c -7.372,0 -13.349,5.977 -13.349,13.349 0,7.371 5.977,13.348 13.349,13.348 7.372,0 13.349,-5.977 13.349,-13.348 0,-7.372 -5.977,-13.349 -13.349,-13.349";

    static readonly talentsColumn3 = new Column(390.6, 361, 200, 162);
    static readonly talentsColumn2 = new Column(221.7, 361, 200, 162, this.talentsColumn3);
    static readonly talentsColumn1 = new Column(51.5, 373, 180, 162, this.talentsColumn2);

    static readonly tealColour: SimpleColor = SimpleColor.from("#39AAA3");
    static readonly goldColour: SimpleColor = SimpleColor.from("#D49F00");
    static readonly redColour: SimpleColor = SimpleColor.from("#C51A1B");
    static readonly blueColour: SimpleColor = SimpleColor.from("#2384B3");
    static readonly greyColour: SimpleColor = SimpleColor.from("#979696");

    static readonly headingColumn = new Column(73.8, 45, 8.8, 200);

    fonts: FontLibrary = new FontLibrary();

    getName(): string {
        return i18next.t("Sheet.landscape2eCharacterSheet");
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/STA_2e_Landscape_Sheet.png'
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
        this.writeLabels(page, construct as Character);
        this.writeRoleAndTalents(page, construct as Character);
        this.writeTitle(page);

        this.createDeterminationBoxes(page, pdf);
        this.createStressBoxes(page, pdf, construct as Character);

        this.drawArrowHead(page, construct as Character);
    }

    drawArrowHead(page: PDFPage, character: Character) {
        if (character.type === CharacterType.Starfleet) {

            const division = character.division;
            if (division != null) {
                page.moveTo(704, page.getHeight() - 63);

                page.drawSvgPath(Landscape2eCharacterSheet.arrowHead, {
                    borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                    color: SimpleColor.from("#ffffff").asPdfRbg(),
                    borderWidth: 1,
                    scale: 0.6
                });

                if (division === Division.Command) {
                    page.drawSvgPath(Landscape2eCharacterSheet.arrowHeadCommand, {
                        borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                        color: this.divisionColour(character.era, division).asPdfRbg(),
                        borderWidth: 0,
                        scale: 0.6
                    });
                } else if (division === Division.Science) {
                    page.drawSvgPath(Landscape2eCharacterSheet.arrowHeadScience, {
                        borderColor: SimpleColor.from("#ffffff").asPdfRbg(),
                        color: this.divisionColour(character.era, division).asPdfRbg(),
                        borderWidth: 0,
                        scale: 0.6
                    });
                } else if (division === Division.Operations) {
                    page.drawSvgPath(Landscape2eCharacterSheet.arrowHeadOperations, {
                        borderColor: SimpleColor.from("#ffffff").asPdfRbg(),
                        color:this.divisionColour(character.era, division).asPdfRbg(),
                        borderWidth: 0,
                        scale: 0.6
                    });
                }
            }
        } else if (character.type === CharacterType.KlingonWarrior) {
            page.moveTo(704, page.getHeight() - 63);

            page.drawSvgPath(Landscape2eCharacterSheet.klingonSymbolCircle, {
                borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                color: SimpleColor.from("#ffffff").asPdfRbg(),
                borderWidth: 1,
                scale: 0.6
            });

            page.drawSvgPath(Landscape2eCharacterSheet.klingonSymbol, {
                borderColor: Landscape2eCharacterSheet.greyColour.asPdfRbg(),
                color: Landscape2eCharacterSheet.redColour.asPdfRbg(),
                borderWidth: 0,
                scale: 0.6
            });

        }
    }

    divisionColour(era: Era, division?: Division) {
        if (era === Era.NextGeneration) {
            switch (division) {
            case Division.Command:
                return Landscape2eCharacterSheet.redColour;
            case Division.Operations:
                return Landscape2eCharacterSheet.goldColour;
            case Division.Science:
                return Landscape2eCharacterSheet.blueColour;
            default:
                return Landscape2eCharacterSheet.tealColour;
            }
        } else {
            switch (division) {
            case Division.Command:
                return Landscape2eCharacterSheet.goldColour;
            case Division.Operations:
                return Landscape2eCharacterSheet.redColour;
            case Division.Science:
                return Landscape2eCharacterSheet.blueColour;
            default:
                return Landscape2eCharacterSheet.tealColour;
            }
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
            this.fonts.fontByType(FontType.Bold), 8, ((label) => {
                if (label === "Construct.discipline.command" ||
                    label === "Construct.discipline.conn") {
                    return construct.era === Era.NextGeneration ? Landscape2eCharacterSheet.redColour : Landscape2eCharacterSheet.goldColour;
                } else if (label === "Construct.discipline.engineering" ||
                        label === "Construct.discipline.security") {
                    return construct.era === Era.NextGeneration ? Landscape2eCharacterSheet.goldColour : Landscape2eCharacterSheet.redColour;
                } else if (label === "Construct.discipline.medicine" ||
                        label === "Construct.discipline.science") {
                    return Landscape2eCharacterSheet.blueColour;
                } else {
                    return Landscape2eCharacterSheet.tealColour;
                }
            }));

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
            "Construct.other.pastimes": new Column(561.5 + 3, 268.1 + 1, 6, 162.7 - 5),
            "Construct.other.values": new Column(561.5 + 3, 303.6 + 1, 6, 162.7 - 5),
            "Construct.other.attacks": new Column(561.5 + 3, 427.7 + 1, 6, 162.7 - 5),
            "Construct.other.equipment": new Column(561.5 + 3, 502.9 + 1, 6, 162.7 - 5),
        }, construct.version,
        this.headingFont, 5, Landscape2eCharacterSheet.tealColour);

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

    writeTitle(page: PDFPage) {
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
            color: Landscape2eCharacterSheet.tealColour.asPdfRbg(),
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