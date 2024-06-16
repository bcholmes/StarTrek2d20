import i18next from "i18next";
import { BaseNonForm2eSheet } from "./generated2eBaseSheet";
import { makeKey } from "../common/translationKey";
import { PDFDocument, PDFForm, PDFPage } from "@cantoo/pdf-lib";
import { Construct } from "../common/construct";
import { Starship } from "../common/starship";
import { XYLocation } from "../common/xyLocation";
import { SheetTag } from "./icharactersheet";
import { Paragraph } from "./paragraph";
import { FontSpecification } from "./fontSpecification";
import { SimpleColor } from "../common/colour";
import { System } from "../helpers/systems";
import { Department } from "../helpers/departments";
import { TALENT_NAME_MISSION_POD, TalentsHelper } from "../helpers/talents";
import { Column } from "./column";

export class Generated2eStarshipSheet extends BaseNonForm2eSheet {

    static readonly starshipStatFrame = "M 2.835,0 C 1.269,0 0,1.269 0,2.835 V 9 c 0,1.565 1.269,2.835 2.835,2.835 h 66.567 c 1.565,0 2.835,-1.27 2.835,-2.835 V 2.835 C 72.237,1.269 70.967,0 69.402,0 Z"

    static readonly column2 = new Column(538.5 - (284.7-56.7), 225, 715-225, 284.7-56.7);
    static readonly column1 = new Column(56.7, 225, 715-225, 284.7-56.7, this.column2);

    getName(): string {
        return i18next.t(makeKey('Sheet.', "Generated2eStarshipSheet"),
            { "defaultValue": "New 2nd Ed.-style Starship Sheet (US Letter)"});
    }
    getThumbnailUrl(): string {
        return '/static/img/sheets/STA_2e_Starship_Sheet.png'
    }
    getPdfUrl(): string {
        return "/static/pdf/STA_2e_Starship_Sheet.pdf";
    }

    getTags(): SheetTag[] {
        return [ SheetTag.Portrait, SheetTag.Style2e, SheetTag.LanguageSupport, SheetTag.TalentText, SheetTag.UsLetter ];
    }

    get nameColumn() {
        return new Column(75, 48, 15, 550-75);
    }

    writeStarshipName(page: PDFPage, starship: Starship) {
        if (starship.name?.length) {
            let name = starship.name;
            if (starship.registry?.length) {
                name += " (" + starship.registry + ")";
            }
            this.writeName(page, name);
        } else {
            this.writeName(page, "Unnamed Starship");
        }
    }

    // if we can stick the three stats together, then we should do so
    writeThreeColumnDerivedStats(page: PDFPage, starship: Starship, previousParagraph: Paragraph) {
        let resistanceParagraph = previousParagraph.nextParagraph(1);
        resistanceParagraph.append(i18next.t("Construct.other.resistance").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9),
            Generated2eStarshipSheet.tealColour);
        resistanceParagraph.append(starship.resistance, new FontSpecification(this.textFont, 9));

        let scaleParagraph = previousParagraph.nextParagraph(1);
        scaleParagraph.append(i18next.t("Construct.other.scale").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9),
            Generated2eStarshipSheet.tealColour);
        scaleParagraph.append(starship.scale, new FontSpecification(this.textFont, 9));

        let crewParagraph = previousParagraph.nextParagraph(1);
        crewParagraph.append(i18next.t("Construct.other.crewSupport").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9),
            Generated2eStarshipSheet.tealColour);
        crewParagraph.append(starship.crewSupport, new FontSpecification(this.textFont, 9));

        if (resistanceParagraph.lines.length === 1 && scaleParagraph.lines.length === 1 && crewParagraph.lines.length === 1
            && (resistanceParagraph.lines[0].width + scaleParagraph.lines[0].width + crewParagraph.lines[0].width + 30 < previousParagraph.column.width)) {

            let availableMiddleSpace = previousParagraph.column.width - resistanceParagraph.lines[0].width - crewParagraph.lines[0].width;
            let centreX = resistanceParagraph.lines[0].width + (availableMiddleSpace / 2) - (scaleParagraph.lines[0].width / 2);
            let endX = previousParagraph.column.width - (crewParagraph.lines[0].width);

            resistanceParagraph.write();

            let x = scaleParagraph.lines[0].bottom().x + centreX;
            let y = scaleParagraph.lines[0].bottom().y;
            scaleParagraph.lines[0].blocks.forEach(textBlock => {
                textBlock.writeToPage(x, y, page, SimpleColor.from("#000000"));
                x += textBlock.width;
            });

            x = crewParagraph.lines[0].bottom().x + endX;
            y = crewParagraph.lines[0].bottom().y;
            crewParagraph.lines[0].blocks.forEach(textBlock => {
                textBlock.writeToPage(x, y, page, SimpleColor.from("#000000"));
                x += textBlock.width;
            });

            return crewParagraph.bottom;
        } else {
            resistanceParagraph.write();

            scaleParagraph = resistanceParagraph.nextParagraph(0);
            scaleParagraph.append(i18next.t("Construct.other.scale").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9),
                Generated2eStarshipSheet.tealColour);
            scaleParagraph.append(starship.scale, new FontSpecification(this.textFont, 9));
            scaleParagraph.write();

            let crewParagraph = scaleParagraph.nextParagraph(0);
            crewParagraph.append(i18next.t("Construct.other.crewSupport").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9),
                Generated2eStarshipSheet.tealColour);
            crewParagraph.append(starship.crewSupport, new FontSpecification(this.textFont, 9));
            crewParagraph.write();

            return crewParagraph.bottom;
        }
    }

    async populate(pdf: PDFDocument, construct: Construct) {
        await super.populate(pdf, construct);

        let starship = construct as Starship;
        let page = pdf.getPage(0);
        this.writeStarshipName(page, starship);

        const { SheetOutlineOptions, SpaceframeOutline } = await import(/* webpackChunkName: 'spaceframeOutline' */ "../helpers/spaceframeOutlineHelper");
        SpaceframeOutline.draw(pdf, new SheetOutlineOptions(new XYLocation(56.7, 80), Generated2eStarshipSheet.tealColour.asPdfRbg(), 1.2, 1.2), starship);

        let paragraph = new Paragraph(page, Generated2eStarshipSheet.column1, this.symbolFont);
        paragraph.append(i18next.t("Construct.other.launchYear").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9),
            Generated2eStarshipSheet.tealColour);
        paragraph.append("" + (starship.spaceframeModel?.serviceYear ?? (starship.serviceYear ?? "")), new FontSpecification(this.textFont, 9));
        paragraph.write();

        paragraph = paragraph.nextParagraph(1);

        paragraph.append(i18next.t("Construct.other.timeline").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9),
        Generated2eStarshipSheet.tealColour);
        paragraph.append("" + (starship.serviceYear), new FontSpecification(this.textFont, 9));
        if (starship.spaceframeModel?.serviceYear != null && starship.serviceYear != null) {
            let yearsOfService = i18next.t("Construct.other.yearsOfService", {
                count: (Math.max(0, starship.serviceYear -  starship.spaceframeModel.serviceYear)),
                interpolation: { escapeValue: false }
            });
            let numberOfRefits = i18next.t("Construct.other.numberOfRefits", {
                count: starship.numberOfRefits,
                interpolation: { escapeValue: false }
            });

            paragraph.append("(" + yearsOfService + ", " + numberOfRefits + ")", new FontSpecification(this.textFont, 9));
        }
        paragraph.write();

        if (starship.className?.length) {
            paragraph = paragraph.nextParagraph(1);

            paragraph.append(i18next.t("Construct.other.spaceFrame").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9),
                Generated2eStarshipSheet.tealColour);
            if (starship.spaceframeModel != null) {
                paragraph.append(starship.spaceframeModel?.localizedName, new FontSpecification(this.textFont, 9));
            } else {
                paragraph.append(starship.className, new FontSpecification(this.textFont, 9));
            }
            paragraph.write();
        }

        if (starship.missionProfileModel != null) {
            paragraph = paragraph.nextParagraph(1);

            paragraph.append(i18next.t("Construct.other.missionProfile").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9),
                Generated2eStarshipSheet.tealColour);
            paragraph.append(starship.missionProfileModel?.localizedName, new FontSpecification(this.textFont, 9));
            paragraph.write();
        }

        paragraph = paragraph.nextParagraph(1);

        paragraph.append(i18next.t("Construct.other.traits").toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9),
            Generated2eStarshipSheet.tealColour);
        paragraph.append(starship.getAllTraits(), new FontSpecification(this.textFont, 9));
        paragraph.write();

        let bottom = this.writeThreeColumnDerivedStats(page, starship, paragraph);

        let statFontSize = this.determineFontSizeForWidth(this.determineAllStatLabels(starship), 72.2 * 0.8 - 2);

        this.writeSubTitle(page, i18next.t("Construct.other.systems"), new Column(bottom.x, bottom.y + 16,
            13, Generated2eStarshipSheet.column1.width));

        let systemsBoxes = new XYLocation(bottom.x, bottom.y + 16 + 13 + 4);
        // these sheets use an unusual order
        [System.Comms, System.Engines, System.Structure, System.Computer, System.Sensors, System.Weapons].forEach((s, i) => {

            let location = new XYLocation(systemsBoxes.x + i % 3 * 77.9, systemsBoxes.y + Math.floor(i / 3) * 15.4);
            let x = location.x;
            const y = page.getHeight() - location.y;
            page.moveTo(x, y);
            page.drawSvgPath(Generated2eStarshipSheet.starshipStatFrame, {
                borderColor: SimpleColor.from("#979696").asPdfRbg(),
                borderWidth: 0.5
            });

            let column = new Column(x, location.y, 11.8, 72.2 * 0.8);
            this.writeLabel(page, i18next.t(makeKey("Construct.system.", System[s])), column, new FontSpecification(this.boldFont, statFontSize),
                Generated2eStarshipSheet.tealColour);

            this.writeLabel(page, "" + starship.getSystemValue(s), this.valueBlock(column), new FontSpecification(this.boldFont, statFontSize),
                Generated2eStarshipSheet.tealColour);

        });

        this.writeSubTitle(page, i18next.t("Construct.other.departments"), new Column(systemsBoxes.x, systemsBoxes.y + 15.4 * 2 + 16,
            13, Generated2eStarshipSheet.column1.width));
        let departmentBoxes = new XYLocation(systemsBoxes.x, systemsBoxes.y + 15.4 * 2 + 16 + 13 + 4);

        // these sheets use an unusual order
        [Department.Command, Department.Engineering, Department.Medicine, Department.Conn, Department.Security, Department.Science].forEach((d, i) => {

            let location = new XYLocation(departmentBoxes.x + i % 3 * 77.9, departmentBoxes.y + Math.floor(i / 3) * 15.4);
            let x = location.x;
            const y = page.getHeight() - location.y;
            page.moveTo(x, y);
            page.drawSvgPath(Generated2eStarshipSheet.starshipStatFrame, {
                borderColor: SimpleColor.from("#979696").asPdfRbg(),
                borderWidth: 0.5
            });

            let colours = [
                Generated2eStarshipSheet.goldColour,
                Generated2eStarshipSheet.redColour,
                Generated2eStarshipSheet.blueColour
            ];

            let column = new Column(x, location.y, 11.8, 72.2 * 0.8);
            this.writeLabel(page, i18next.t(makeKey("Construct.department.", Department[d])), column, new FontSpecification(this.boldFont, statFontSize),
                colours[i % 3]);

            this.writeLabel(page, "" + starship.departments[d], this.valueBlock(column), new FontSpecification(this.boldFont, statFontSize),
                colours[i % 3]);

        });

        let attacksArea = new XYLocation(departmentBoxes.x, departmentBoxes.y + 15.4 * 2 + 16);
        this.writeSubTitle(page, i18next.t("Construct.other.attacks"), new Column(attacksArea.x, attacksArea.y,
            13, Generated2eStarshipSheet.column1.width));

        let bottomOfAttacks = this.writeAttacks(page, starship, new Column(attacksArea.x, attacksArea.y + 13 + 4,
            Generated2eStarshipSheet.column1.start.y + Generated2eStarshipSheet.column1.height - (attacksArea.y + 13 + 4),
            Generated2eStarshipSheet.column1.width));

        this.writeSubTitle(page, i18next.t("Construct.other.shields"), new Column(bottomOfAttacks.x, bottomOfAttacks.y + 16,
            13, Generated2eStarshipSheet.column1.width));
        let bottomOfShields = this.writeShieldsBoxes(page, pdf.getForm(), starship, new Column(bottomOfAttacks.x, bottomOfAttacks.y + 16 + 13 + 4,
            50, Generated2eStarshipSheet.column1.width));

        this.writeSubTitle(page, i18next.t("Construct.other.talents"), new Column(bottomOfShields.x, bottomOfShields.y + 16,
            13, Generated2eStarshipSheet.column1.width));


        let talentsColumn = new Column(bottomOfShields.x, bottomOfShields.y + 16 + 13 + 4,
            Generated2eStarshipSheet.column1.start.y + Generated2eStarshipSheet.column1.height - (bottomOfShields.y + 13 + 4),
            Generated2eStarshipSheet.column1.width, Generated2eStarshipSheet.column2);

        let { bottomOfTalents, column} = this.writeTalents(page, starship, talentsColumn);

        if (this.hasSpecialRules(starship)) {

            let finalColumn = new Column(bottomOfTalents.x, bottomOfTalents.y + 16,
                column.height + column.start.y - (bottomOfTalents.y + 16), column.width);
            if (finalColumn.height <= 50 && column.nextColumn) {
                finalColumn = column.nextColumn;
            }
            if (finalColumn.height > 50) {
                this.writeSubTitle(page, i18next.t("Construct.other.specialRules"), new Column(finalColumn.start.x, finalColumn.start.y,
                    13, finalColumn.width));

                this.writeSpecialRules(page, starship, finalColumn.bottomAfter(13 + 4));
            }
        }

    }

    hasSpecialRules(starship: Starship) {
        return starship.getDistinctTalentNameList().map(t => TalentsHelper.getTalent(t)).filter(t => t.specialRule).length > 0;
    }

    writeShieldsBoxes(page: PDFPage, form: PDFForm, starship: Starship, column: Column) {
        let stressBox = "m 1,0 h 7.5 c 0.554,0 1,0.446 1,1 v 7.5 c 0,0.554 -0.446,1 -1,1 H 1 C 0.446,9.5 0,9.054 0,8.5 V 1 C 0,0.446 0.446,0 1,0 Z";

        let x = column.translatedStart(page).x;
        let y = column.translatedStart(page).y;
        for (let i = 0; i < starship.shields; i++) {

            page.moveTo(x, y);
            page.drawSvgPath(stressBox, {
                borderColor: SimpleColor.from("#000000").asPdfRbg(),
                borderWidth: 0.5
            });

            let checkbox = form.createCheckBox("Shield " + (i+1));
            checkbox.addToPage(page, {
                x: x + 0.5,
                y: y - 9,
                width: 8.5,
                height: 8.5,
                textColor: SimpleColor.from("#000000").asPdfRbg(),
                borderWidth: 0
            });

            x += 12;
            if (i % 15 === 14) {
                x = column.translatedStart(page).x;
                y -= 12;
            } else if (i % 5 === 4) {
                x += 10;
            }
        }

        return column.untranslateLocation(page, new XYLocation(column.translatedStart(page).x, y -= 12));
    }

    writeTalents(page: PDFPage, starship: Starship, column: Column) {
        let paragraph = new Paragraph(page, column, this.symbolFont);
        let result = { column: column, bottomOfTalents: paragraph.bottom }
        for (let t of starship.getDistinctTalentNameList()) {

            if (paragraph) {
                paragraph.indent(15);
                const talent = TalentsHelper.getTalent(t);
                if (!talent.specialRule) {
                    let talentName = talent.localizedDisplayName;
                    if (talent && talent.maxRank > 1) {
                        let rank = starship.getRankForTalent(t);
                        talentName += " [x" + rank + "]";
                    }
                    paragraph.append(talentName.toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9), Generated2eStarshipSheet.tealColour);
                    paragraph.append(talent.localizedDescription, new FontSpecification(this.textFont, 9));
                    paragraph.write();

                    if (paragraph.lines.length) {
                        let location = column.untranslateLocation(page, paragraph.lines[0].location);
                        page.moveTo(paragraph.lines[0].column.start.x - 15, page.getHeight() - (location.y + 3));
                        page.drawSvgPath(Generated2eStarshipSheet.bulletPath, {
                            color: Generated2eStarshipSheet.tealColour.asPdfRbg(),
                            borderWidth: 0
                        });
                    }

                    result = { column: column, bottomOfTalents: new XYLocation(paragraph.column.start.x, paragraph.bottom.y) }

                    paragraph = paragraph.nextParagraph();
                }
            }
        };
        return result;
    }

    writeSpecialRules(page: PDFPage, starship: Starship, column: Column) {
        let paragraph = new Paragraph(page, column, this.symbolFont);
        for (let t of starship.getDistinctTalentNameList()) {

            if (paragraph) {
                paragraph.indent(15);
                const talent = TalentsHelper.getTalent(t);
                if (talent.specialRule) {
                    let talentName = talent.localizedDisplayName;
                    if (talent && talent.maxRank > 1) {
                        let rank = starship.getRankForTalent(t);
                        talentName += " [Rank: " + rank + "]";
                    }
                    paragraph.append(talentName.toLocaleUpperCase() + ": ", new FontSpecification(this.boldFont, 9), Generated2eStarshipSheet.tealColour);
                    paragraph.append(talent.localizedDescription, new FontSpecification(this.textFont, 9));
                    paragraph.write();

                    if (paragraph.lines.length) {
                        let location = column.untranslateLocation(page, paragraph.lines[0].location);
                        page.moveTo(paragraph.lines[0].column.start.x - 15, page.getHeight() - (location.y + 3));
                        page.drawSvgPath(Generated2eStarshipSheet.bulletPath, {
                            color: Generated2eStarshipSheet.tealColour.asPdfRbg(),
                            borderWidth: 0
                        });
                    }

                    if (talent.name === TALENT_NAME_MISSION_POD && starship.missionPodModel != null) {
                        paragraph = paragraph.nextParagraph(0);
                        if (paragraph) {
                            paragraph.indent(30);
                            paragraph.append(i18next.t("Construct.other.missionPod") + ":",
                                new FontSpecification(this.boldFont, 9));

                            paragraph.append(starship.missionPodModel.localizedName, new FontSpecification(this.textFont, 9));
                            paragraph.write();
                        }
                    }

                    paragraph = paragraph ? paragraph.nextParagraph() : null;
                }
            }
        };
    }
}