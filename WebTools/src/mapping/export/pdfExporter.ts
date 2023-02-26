import { PDFDocument, PDFFont, PDFPage, RGB, rgb } from "pdf-lib";
import fontkit from '@pdf-lib/fontkit'
import { Sector } from "../table/sector";
import { Color } from "../../common/colour";
import { CompanionType, StarSystem } from "../table/starSystem";
import { createRandomValue } from "../../common/randomValueGenerator";
import { AsteroidBeltDetails, WorldClass } from "../table/world";

const BULLET = '\u2022';

const PIXELS_TO_POINTS_RATIO = 0.75;

enum TextAlignment {
    Left,
    Center,
    Right
}

class TextBlock {
    text: string[];
    fontSize: number;
    font: PDFFont;
    width: number;
    color: RGB;

    constructor(text: string, fontSize: number, font: PDFFont, color: RGB, maxWidth?: number) {
        this.font = font;
        this.fontSize = fontSize;
        this.color = color;
        this.width = this.font.widthOfTextAtSize(text, fontSize);
        if (maxWidth == null || this.width < maxWidth) {
            this.text = [ text ];
        } else {
            this.text = []
            let parts = text.split(' ');
            let currentText = "";
            parts.forEach(p => {
                if (this.font.widthOfTextAtSize(currentText + " " + p, this.fontSize) > maxWidth) {
                    this.text.push(currentText);
                    currentText = p;
                } else if (currentText.length) {
                    currentText += " " + p;
                } else {
                    currentText = p;
                }
            });
            if (currentText.length) {
                this.text.push(currentText);
            }
            this.width = maxWidth;
        }
    }

    get height() {
        return this.text.length * this.font.heightAtSize(this.fontSize);
    }

    writeOnPage(page: PDFPage, column: number, currentLine: number, alignment: TextAlignment = TextAlignment.Left) {
        this.text.forEach(t => {
            if (alignment === TextAlignment.Center) {
                let width = this.font.widthOfTextAtSize(t, this.fontSize);
                page.drawText(t, {
                    x: column - (width / 2),
                    y: page.getHeight() - currentLine,
                    size: this.fontSize,
                    font: this.font,
                    color: this.color
                });
            } else if (alignment === TextAlignment.Right) {
                let width = this.font.widthOfTextAtSize(t, this.fontSize);
                page.drawText(t, {
                    x: column - width,
                    y: page.getHeight() - currentLine,
                    size: this.fontSize,
                    font: this.font,
                    color: this.color
                });
            } else {
                page.drawText(t, {
                    x: column,
                    y: page.getHeight() - currentLine,
                    size: this.fontSize,
                    font: this.font,
                    color: this.color
                });
            }
            currentLine += this.font.heightAtSize(this.fontSize);
        });
    }
}

class AttributeDataValue {
    label: TextBlock;
    value: TextBlock;

    constructor(label: TextBlock, value: TextBlock) {
        this.label = label;
        this.value = value;
    }

    get height() {
        return Math.max(this.label.height, this.value.height);
    }

    writeOnPage(page: PDFPage, column: number, currentLine: number) {
        this.label.writeOnPage(page, column, currentLine);
        this.value.writeOnPage(page, column + 65, currentLine);
    }
}

class AttributeTwoColumnBlock {
    column1: AttributeDataValue[] = [];
    column2: AttributeDataValue[] = [];

    constructor(attributes: AttributeDataValue[]) {

        attributes.forEach((a, i) => {
            if (i >= Math.ceil(attributes.length / 2)) {
                this.column2.push(a);
            } else {
                this.column1.push(a);
            }
        });
    }

    get height() {
        let col1Height = 0;
        let col2Height = 0;
        this.column1.forEach(a => col1Height += a.height);
        this.column2.forEach(a => col2Height += a.height);
        return Math.max(col1Height, col2Height);
    }

    writeOnPage(page: PDFPage, currentLine: number) {
        let line = currentLine;
        this.column1.forEach((a, i) => {
            a.writeOnPage(page, PdfExporter.COLUMN_ONE, line);
            line += a.height;
        });
        line = currentLine;
        this.column2.forEach((a, i) => {
            a.writeOnPage(page, PdfExporter.COLUMN_TWO, line);
            line += a.height;
        });
    }
}

export class PdfExporter {

    static COLUMN_ONE = 162;
    static COLUMN_TWO = 377;
    static COLUMN_ONE_END = 361;
    static COLUMN_TWO_END = 576;

    static LCARS_ORANGE = rgb(249.0 / 255.0, 157.0 / 255.0, 37.0 / 255.0);
    static LCARS_LIGHT_ORANGE = rgb(250.0 / 255.0, 172.0 / 255.0, 118.0 / 255.0);
    static LCARS_PURPLE = rgb(138.0 / 255.0, 113.0 / 255.0, 167.0 / 255.0);
    static LCARS_LIGHT_PURPLE = rgb(183.0 / 255.0, 179.0 / 255.0, 217.0 / 255.0);
    static LCARS_PINK = rgb(213.0 / 255.0, 150.0 / 255.0, 179.0 / 255.0);
    static LCARS_WHITE = rgb(1, 1, 1);
    static LCARS_BLACK = rgb(0, 0, 0);

    async populate(pdf: PDFDocument, sector: Sector) {
        pdf.registerFontkit(fontkit);
        const lcarsFontBytes = await fetch("/static/font/lcars_font.TTF").then(res => res.arrayBuffer());
        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        const lightFontBytes = await fetch("/static/font/OpenSansCondensed-Light.ttf").then(res => res.arrayBuffer());

        const existingPdfBytes = await fetch("/static/pdf/TNG_System_Map.pdf").then(res => res.arrayBuffer())
        const blankPagePdf = await PDFDocument.load(existingPdfBytes)

        const lcarsFont = await pdf.embedFont(lcarsFontBytes);
        const openSansBold = await pdf.embedFont(boldFontBytes);
        const openSansLight = await pdf.embedFont(lightFontBytes);

        await this.populatePage1(pdf.getPage(0), lcarsFont, openSansLight, openSansBold, sector);

        let systems = sector.systems;
        for (let i = 0; i < systems.length; i++) {
            await this.populateSystemPage(pdf, lcarsFont, openSansLight, openSansBold, systems[i], blankPagePdf);
        }
    }

    async createStarSystemPdf(system: StarSystem) {
        let pdf = await PDFDocument.create();
        pdf.registerFontkit(fontkit);
        const lcarsFontBytes = await fetch("/static/font/lcars_font.TTF").then(res => res.arrayBuffer());
        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        const lightFontBytes = await fetch("/static/font/OpenSansCondensed-Light.ttf").then(res => res.arrayBuffer());

        const existingPdfBytes = await fetch("/static/pdf/TNG_System_Map.pdf").then(res => res.arrayBuffer())
        const blankPagePdf = await PDFDocument.load(existingPdfBytes)

        const lcarsFont = await pdf.embedFont(lcarsFontBytes);
        const openSansBold = await pdf.embedFont(boldFontBytes);
        const openSansLight = await pdf.embedFont(lightFontBytes);

        await this.populateSystemPage(pdf, lcarsFont, openSansLight, openSansBold, system, blankPagePdf);

        this.paginate(pdf, openSansLight);

        return pdf;
    }

    paginate(pdf: PDFDocument, openSansLight: PDFFont) {
        for (let i = 0; i < pdf.getPageCount(); i++) {
            const page = pdf.getPage(i);
            page.drawText("" + (i + 1), {
                x: page.getWidth() - 36,
                y: 18,
                size: 8,
                font: openSansLight,
                color: PdfExporter.LCARS_PURPLE
            });
        }
    }

    async populateSystemPage(pdf: PDFDocument, font: PDFFont, light: PDFFont, bold: PDFFont, system: StarSystem, blankPagePdf: PDFDocument) {
        let [ page ] = await pdf.copyPages(blankPagePdf, [0]);
        pdf.addPage(page);

        this.addLcarsHeaderToPage(page, 'System ' + BULLET + " " + system.name, font);

        let lineHeight = font.heightAtSize(12, { descender: true });
        let currentLine = 60 + lineHeight;

        this.addLabelAndValue(page, "Coordinates:",
            "" + system.sectorCoordinates.x.toFixed(2) + ", "
            + system.sectorCoordinates.y.toFixed(2) + ", "
            + system.sectorCoordinates.z.toFixed(2), font, light, PdfExporter.COLUMN_ONE, currentLine);


        this.renderPlanetsLower(page, font, system);

        currentLine = 215;
        let blockLine = currentLine;

        if (system.star) {
            this.addPillHeader(page, "Primary Star", font, currentLine, PdfExporter.COLUMN_ONE, 361);

            currentLine += 20;

            this.addLabelAndValue(page, "Spectral Class:",
                system.star.description, font, light, PdfExporter.COLUMN_ONE, currentLine);

            currentLine += lineHeight;
            this.addLabelAndValue(page, "Mass:",
                system.star.mass.toFixed(2) + " Sols", font, light, PdfExporter.COLUMN_ONE, currentLine);

            currentLine += lineHeight;
            this.addLabelAndValue(page, "Mass:",
                system.star.massInKgs.toFixed(4) + " x 10    kg", font, light, PdfExporter.COLUMN_ONE, currentLine);
            let offset = light.widthOfTextAtSize(system.star.massInKgs.toFixed(4) + " x 10", 10.0);
            page.drawText("30" , {
                x: PdfExporter.COLUMN_ONE + 66 + offset,
                y: page.getHeight() - currentLine + 4,
                size: 6.0,
                font: light,
                color: PdfExporter.LCARS_BLACK
            });

            currentLine += lineHeight;
            if (system.star.luminosityValue != null) {
                this.addLabelAndValue(page, "Luminosity:",
                    (system.star.luminosityValue > 100 ? system.star.luminosityValue.toFixed(0) :  system.star.luminosityValue.toFixed(4)) + " Sols",
                    font, light, PdfExporter.COLUMN_ONE, currentLine);
            }
        }

        if (system.companionStar) {
            currentLine = blockLine;
            this.addPillHeader(page, "Companion Star", font, currentLine, PdfExporter.COLUMN_TWO, 576);

            currentLine += 20;

            this.addLabelAndValue(page, "Spectral Class:",
                system.companionStar.description, font, light, PdfExporter.COLUMN_TWO, currentLine);

            currentLine += lineHeight;
            this.addLabelAndValue(page, "Companion Type:",
                system.companionType === CompanionType.Close ? "Close" : "Distant", font, light, PdfExporter.COLUMN_TWO, currentLine);

            currentLine += lineHeight;
            if (system.companionOrbitalRadius != null) {
                this.addLabelAndValue(page, "Orbital Radius:",
                    system.companionOrbitalRadius.toFixed(2) + " AUs",
                    font, light, PdfExporter.COLUMN_TWO, currentLine);
                currentLine += lineHeight;
            }

            this.addLabelAndValue(page, "Mass:",
                system.companionStar.mass.toFixed(2) + " Sols", font, light, PdfExporter.COLUMN_TWO, currentLine);

            currentLine += lineHeight;
            this.addLabelAndValue(page, "Mass:",
                system.companionStar.massInKgs.toFixed(4) + " x 10    kg", font, light, PdfExporter.COLUMN_TWO, currentLine);
            let offset = light.widthOfTextAtSize(system.companionStar.massInKgs.toFixed(4) + " x 10", 10.0);
            page.drawText("30" , {
                x: PdfExporter.COLUMN_TWO + 66 + offset,
                y: page.getHeight() - currentLine + 4,
                size: 6.0,
                font: light,
                color: PdfExporter.LCARS_BLACK
            });

            currentLine += lineHeight;
            if (system.companionStar.luminosityValue != null) {
                this.addLabelAndValue(page, "Luminosity:",
                    system.companionStar.luminosityValue > 100 ? system.companionStar.luminosityValue.toFixed(0) :  system.companionStar.luminosityValue.toFixed(4),
                    font, light, PdfExporter.COLUMN_TWO, currentLine);
            }
        }

        currentLine += 25 + lineHeight;
        this.addPillHeader(page, "Worlds", font, currentLine, PdfExporter.COLUMN_ONE, 576);
        currentLine += 20;

        if (system.worlds?.length) {

            let innerWorlds = system.worlds.filter(w => w.orbitalRadius < system.gardenZoneInnerRadius);
            let ecosphereWorlds = system.worlds.filter(w => w.orbitalRadius >= system.gardenZoneInnerRadius && w.orbitalRadius < system.gardenZoneOuterRadius);
            let outerWorlds = system.worlds.filter(w => w.orbitalRadius >= system.gardenZoneOuterRadius);

            let titles = ["Inner Worlds", "Ecosphere", "Outer Worlds"];
            let worldLists = [innerWorlds, ecosphereWorlds, outerWorlds];

            for (let i = 0; i < titles.length; i++) {

                let worlds = worldLists[i];
                let title = titles[i];
                let titleWritten = false;

                for (let j = 0; j < worlds.length; j++) {

                    let attributes = worlds[j].attributeList;
                    if (attributes.length) {
                        let block = new AttributeTwoColumnBlock(attributes.map(a => new AttributeDataValue(
                            new TextBlock(a.name.toLocaleUpperCase() + ":", 12.0, font, PdfExporter.LCARS_PURPLE),
                            new TextBlock(a.value, 10.0, light, PdfExporter.LCARS_BLACK, 134))));


                        if ((currentLine + block.height) > (page.getHeight() - 36 - lineHeight)) {
                            const [ temp ] = await pdf.copyPages(blankPagePdf, [0]);
                            pdf.addPage(temp);
                            page = temp;

                            this.addLcarsHeaderToPage(page, 'System ' + BULLET + " " + system.name, font);
                            currentLine = 60 + lineHeight;
                        }

                        if (!titleWritten) {
                            page.drawText(title, {
                                x: PdfExporter.COLUMN_ONE,
                                y: page.getHeight() - currentLine,
                                size: 14.0,
                                font: bold,
                                color: PdfExporter.LCARS_BLACK
                            });
                            currentLine += 20;
                            titleWritten = true;
                        }

                        block.writeOnPage(page, currentLine);
                        currentLine += (block.height + lineHeight + lineHeight);
                    }
                }
            }

        } else {
            page.drawText("No Worlds", {
                x: PdfExporter.COLUMN_ONE,
                y: page.getHeight() - currentLine,
                size: 14.0,
                font: bold,
                color: PdfExporter.LCARS_BLACK
            });
        }

    }

    renderPlanetsLower(page: PDFPage, font: PDFFont, system: StarSystem) {
        page.moveTo(0, page.getHeight());
        page.drawSvgPath("m 530,119.70117 v 38.10352 C 529.96263,165.71786 527.7739,168 520.875,168 H 515 v 12 h 15 30 c 10.75081,1e-5 16.2373,-8.28387 16,-20 v -40.29883 z", {
            color: PdfExporter.LCARS_LIGHT_ORANGE,
            borderWidth: 0
        });
        page.drawSvgPath("m 530,99 v 18.70117 h 46 V 99 Z", {
            color: PdfExporter.LCARS_LIGHT_PURPLE,
            borderWidth: 0
        });
        page.drawSvgPath("m 168,180.0000 c -3.31371,0 -6,-2.68629 -6,-6 0,-3.31371 2.68629,-6 6,-6", {
            color: PdfExporter.LCARS_LIGHT_ORANGE,
            borderWidth: 0
        });

        new TextBlock(createRandomValue(6), 9, font, PdfExporter.LCARS_BLACK).writeOnPage(page, 533, 114);

        let r = Math.max(2, Math.sqrt(system.star?.spectralClass?.radius?.midpoint * 60));
        let starColor = rgb(system.star.spectralClass.colour.red / 255.0,
                system.star.spectralClass.colour.green / 255.0,
                system.star.spectralClass.colour.blue / 255.0);
        let borderColor = system.star.spectralClass.colour.isApproximatelyWhite ? PdfExporter.LCARS_BLACK : PdfExporter.LCARS_WHITE;
        page.drawCircle({
            x: PdfExporter.COLUMN_ONE + 15,
            y: page.getHeight() - 132.5,
            size: r,
            color: starColor,
            borderColor: borderColor,
            borderWidth: 0.1
        });
        if (system.star.spectralClass.isDwarf) {
            new TextBlock(system.star.designation.toLocaleUpperCase(), 8, font, PdfExporter.LCARS_BLACK)
                .writeOnPage(page, PdfExporter.COLUMN_ONE + 15, 132.5 - r - 2, TextAlignment.Center);
        } else {
            new TextBlock(system.star.designation.toLocaleUpperCase(), 8, font, PdfExporter.LCARS_BLACK)
                .writeOnPage(page, PdfExporter.COLUMN_ONE + 15, 132.5 - r - 10, TextAlignment.Center);
            new TextBlock(system.star.spectralClass.colourDescription.toLocaleUpperCase(), 8, font, PdfExporter.LCARS_BLACK)
                .writeOnPage(page, PdfExporter.COLUMN_ONE + 15, 132.5 - r - 2, TextAlignment.Center);
        }

        if (system.companionStar && system.companionType === CompanionType.Close) {
            let r2 = Math.max(2, Math.sqrt(system.companionStar?.spectralClass?.radius?.midpoint * 60));
            let starColor2 = rgb(system.companionStar.spectralClass.colour.red / 255.0,
                    system.companionStar.spectralClass.colour.green / 255.0,
                    system.companionStar.spectralClass.colour.blue / 255.0);
            let borderColor2 = system.companionStar.spectralClass.colour.isApproximatelyWhite ? PdfExporter.LCARS_BLACK : PdfExporter.LCARS_WHITE;

            page.drawCircle({
                x: PdfExporter.COLUMN_ONE + 15 + r,
                y: page.getHeight() - 132.5,
                size: r2,
                color: starColor2,
                borderColor: borderColor2,
                borderWidth: 0.1
            });
        }

        let orbits = this.findAllOrbits(system);
        let maxWorldDiameter = 50000;
        system.worlds?.filter(w => w.diameter != null).forEach(w => maxWorldDiameter = Math.max(w.diameter, maxWorldDiameter));
        let smallWorldDiameter = 5000;
        system.worlds?.filter(w => w.diameter != null).forEach(w => smallWorldDiameter = Math.min(w.diameter, smallWorldDiameter));
        let factor = 10 / Math.sqrt(maxWorldDiameter / 1000 - smallWorldDiameter / 1000);

        system.worlds?.forEach((w, i) => {
            let r = Math.max(2, w.diameter == null ? 10 : (Math.sqrt(w.diameter / 1000 - smallWorldDiameter / 1000) * factor));
            let orbitalX = this.calculateOrbitX(w.orbitalRadius, orbits);
            let prevOrbitalX = (i === 0) ? PdfExporter.COLUMN_ONE :
                (this.calculateOrbitX(system.worlds[i-1].orbitalRadius, orbits) + 1);
            let auWidth = (orbitalX - 1) - (prevOrbitalX);

            if (auWidth > 0) {
                page.drawSvgPath("M " + prevOrbitalX.toFixed(2) + ",85 V 97 h " + auWidth.toFixed(2) + " V 85 z", {
                    color: PdfExporter.LCARS_LIGHT_ORANGE,
                    borderWidth: 0
                });
                let label = new TextBlock(w.orbitalRadius.toFixed(2) + " AU", 8, font, PdfExporter.LCARS_BLACK);
                if (auWidth > label.width + 6) {
                    label.writeOnPage(page, orbitalX - 4, 94, TextAlignment.Right);
                }
            }

            if (w.worldClass.id === WorldClass.AsteroidBelt) {

                if (w.worldDetails instanceof AsteroidBeltDetails) {
                    let details = w.worldDetails as AsteroidBeltDetails;
                    let innermostRadius = w.orbitalRadius - (details.depth / 2);
                    page.drawCircle({
                        x: this.calculateOrbitX(innermostRadius, orbits),
                        y: page.getHeight() - 130.5,
                        size: 0.5,
                        color: PdfExporter.LCARS_PURPLE
                    });

                    let innerMidRadius = w.orbitalRadius - (details.depth / 4);
                    page.drawCircle({
                        x: this.calculateOrbitX(innerMidRadius, orbits),
                        y: page.getHeight() - 134.5,
                        size: 0.5,
                        color: PdfExporter.LCARS_PURPLE
                    });

                    let outermostRadius = w.orbitalRadius + (details.depth / 2);
                    page.drawCircle({
                        x: this.calculateOrbitX(outermostRadius, orbits),
                        y: page.getHeight() - 133.5,
                        size: 1,
                        color: PdfExporter.LCARS_PURPLE
                    });

                    let outerMidRadius = w.orbitalRadius + (details.depth / 4);
                    page.drawCircle({
                        x: this.calculateOrbitX(outerMidRadius, orbits),
                        y: page.getHeight() - 130.5,
                        size: 0.75,
                        color: PdfExporter.LCARS_PURPLE
                    });
                }

                page.drawCircle({
                    x: orbitalX,
                    y: page.getHeight() - 132.5,
                    size: 1.5,
                    color: PdfExporter.LCARS_PURPLE
                });

                new TextBlock("Asteroid Belt", 7, font, PdfExporter.LCARS_BLACK)
                    .writeOnPage(page, orbitalX, (i % 2 === 0) ? 132.5 - 5 : (132.5 + 10), TextAlignment.Center);
            } else {
                page.drawCircle({
                    x: orbitalX,
                    y: page.getHeight() - 132.5,
                    size: r,
                    color: PdfExporter.LCARS_PURPLE
                });

                new TextBlock('CLASS ' + WorldClass[w.worldClass.id], 7, font, PdfExporter.LCARS_BLACK)
                        .writeOnPage(page, orbitalX, (i % 2 === 0) ? 132.5 - r - 11 : (132.5 + r + 10), TextAlignment.Center);
                new TextBlock(w.worldClass.description, 7, font, PdfExporter.LCARS_BLACK)
                        .writeOnPage(page, orbitalX, (i % 2 === 0) ? 132.5 - r - 4 : (132.5 + r + 17), TextAlignment.Center);
            }
        });

        if (system.worlds?.length) {
            let x = this.calculateOrbitX(system.worlds[system.worlds.length - 1].orbitalRadius, orbits) + 1;
            page.drawSvgPath("M " + x.toFixed(2) + ",85 H 576 V 97 H " + x.toFixed(2) + " z", {
                color: PdfExporter.LCARS_LIGHT_ORANGE,
                borderWidth: 0
            });
        } else {
            page.drawSvgPath("M 162,85 H 576 V 97 H 162 z", {
                color: PdfExporter.LCARS_LIGHT_ORANGE,
                borderWidth: 0
            });
        }

        if (orbits.length && system.gardenZoneInnerRadius && system.gardenZoneOuterRadius) {
            let innerX = this.calculateOrbitX(system.gardenZoneInnerRadius, orbits);
            let outerX = this.calculateOrbitX(system.gardenZoneOuterRadius, orbits);
            page.drawSvgPath("M 167.999,180.000 V 168 H" + (innerX - 1).toFixed(2) + " V 180 z", {
                color: PdfExporter.LCARS_LIGHT_ORANGE,
                borderWidth: 0
            });
            let innerText = new TextBlock("INNER ZONE", 6, font, PdfExporter.LCARS_BLACK);
            if (innerText.width < (innerX - 6 - 168)) {
                innerText.writeOnPage(page, innerX - 4, 176, TextAlignment.Right);
            }

            page.drawSvgPath("M " + (innerX +1).toFixed(2) + ",180.000 V 168 h"
                + (outerX - 1 - (innerX + 1)).toFixed(2) + " V 180 z", {
                color: PdfExporter.LCARS_PINK,
                borderWidth: 0
            });
            let ecoText = new TextBlock("ECOSPHERE", 6, font, PdfExporter.LCARS_BLACK);
            if (ecoText.width < (outerX - innerX - 8)) {
                ecoText.writeOnPage(page, (outerX - innerX) / 2 + innerX, 176, TextAlignment.Center);
            }

            page.drawSvgPath("M " + (outerX +1).toFixed(2) + ",180.000 V 168 H 515.001 V 180 z", {
                color: PdfExporter.LCARS_LIGHT_ORANGE,
                borderWidth: 0
            });
            let outerText = new TextBlock("OUTER ZONE", 6, font, PdfExporter.LCARS_BLACK);
            if (outerText.width < (530 - outerX - 6)) {
                outerText.writeOnPage(page, outerX + 4, 176, TextAlignment.Left);
            }

        } else {
            page.drawSvgPath("M 167.999,180.000 H 515.001 V 168 H 168 z", {
                color: PdfExporter.LCARS_LIGHT_ORANGE,
                borderWidth: 0
            });
        }
    }

    findAllOrbits(system: StarSystem) {
        let orbits = system.worlds?.map(w => w.orbitalRadius) ?? [];
        if (system.gardenZoneInnerRadius) {
            orbits.push(system.gardenZoneInnerRadius);
        }
        if (system.gardenZoneOuterRadius) {
            orbits.push(system.gardenZoneOuterRadius);
        }
        orbits = orbits.sort((a, b) => {
            if (a === b) {
                return 0;
            } else {
                return a < b ? -1 : 1;
            }
        });
        return orbits;
    }

    calculateOrbitX(orbitInAus: number, orbits: number[]) {
        if (orbits?.length) {
            let firstOrbitInAus = orbits[0];
            let firstOrbit = Math.log1p(firstOrbitInAus);
            let lastOrbit = Math.log1p(orbits[orbits.length - 1]);

            return PdfExporter.COLUMN_ONE + 40 + (514 - 40 - PdfExporter.COLUMN_ONE) / (lastOrbit - firstOrbit) * (Math.log1p(orbitInAus) - firstOrbit);
        } else {
            return 0;
        }
    }

    addPillHeader(page: PDFPage, headerText: string, font: PDFFont, currentLine: number, start: number, end: number) {
        let lineHeight = 18;
        let textWidth = font.widthOfTextAtSize(headerText.toUpperCase(), 18);
        let r = lineHeight / 2;
        let offset = r * 1.2;

        page.drawCircle({
            x: start + r,
            y: page.getHeight() - (currentLine - r),
            size: r,
            color: PdfExporter.LCARS_ORANGE,
            borderWidth: 0
        });

        page.drawRectangle({
            x: start + r,
            y: page.getHeight() - currentLine,
            width: end - start - (2 * r),
            height: 2 * r,
            color: PdfExporter.LCARS_ORANGE,
            borderWidth: 0
        });

        page.drawCircle({
            x: end - r,
            y: page.getHeight() - (currentLine - r),
            size: r,
            color: PdfExporter.LCARS_ORANGE,
            borderWidth: 0
        });

        page.drawRectangle({
            x: start + r + offset,
            y: page.getHeight() - currentLine - 2,
            width: textWidth + 8,
            height: 2 * r + 4,
            color: rgb(1, 1, 1),
            borderWidth: 0
        });

        page.drawText(headerText.toUpperCase(), {
            x: start + r + offset + 4,
            y: page.getHeight() - (currentLine - 3),
            size: 18.0,
            font: font,
            color: PdfExporter.LCARS_BLACK
        });
    }

    addLabelAndValue(page: PDFPage, label: string, value: string, font: PDFFont, light: PDFFont, startColumn: number, currentLine: number) {
        new TextBlock(label.toLocaleUpperCase(), 12.0, font, PdfExporter.LCARS_PURPLE).writeOnPage(page, startColumn, currentLine);
        new TextBlock(value, 10.0, light, PdfExporter.LCARS_BLACK).writeOnPage(page, startColumn + 65, currentLine);
    }

    async addLcarsHeaderToPage(page: PDFPage, text: string, font: PDFFont) {
        text = text.toLocaleUpperCase();
        let width = font.widthOfTextAtSize(text, 18.0);
        page.drawRectangle({
            x: 564 - (width + 8),
            y: page.getHeight() - 45,
            width: width + 8,
            height: font.heightAtSize(18.0) + 2,
            color: rgb(1, 1, 1)
        });

        page.drawText(text, {
            x: 560 - width,
            y: page.getHeight() - 41.5,
            size: 18.0,
            font: font,
            color: PdfExporter.LCARS_ORANGE
        });
    }

    async populatePage1(page: PDFPage, font: PDFFont, light: PDFFont, bold: PDFFont, sector: Sector) {
        let text = ("SECTOR " + BULLET + " " + sector.name);
        this.addLcarsHeaderToPage(page, text, font);

        text = "Notable Systems".toUpperCase();

        page.drawText(text, {
            x: PdfExporter.COLUMN_ONE,
            y: page.getHeight() - 390,
            size: 18.0,
            font: font,
            color: PdfExporter.LCARS_PURPLE
        });

        let systems = sector.sortedSystems;
        systems.forEach((s) => {
            let z = s.sectorCoordinates.z / 20 * 0.6 + 0.4;
            let baseColour = s.star.spectralClass.colour;
            let colour = baseColour.blend(new Color(255, 255, 255), 1-z);
            let borderColour = colour;
            if (colour.isApproximatelyWhite) {
                borderColour = Color.from("#666666").blend(new Color(255, 255, 255), 1-z);
            }

            let r = Math.max(1, Math.sqrt(s.star.spectralClass.radius.midpoint * 35));

            if (s.isBinary) {
                let r1 = r * 0.75;

                let baseColour2 = s.companionStar.spectralClass.colour;
                let colour2 = baseColour2.blend(new Color(255, 255, 255), 1-z);
                let borderColour2 = colour2;
                if (colour2.isApproximatelyWhite) {
                    borderColour2 = Color.from("#666666").blend(new Color(255, 255, 255), 1-z);
                }

                let r2 = Math.max(1, Math.sqrt(s.companionStar.spectralClass.radius.midpoint * 35));

                r = Math.max(r, r2);

                r2 = r2 * 0.75;
                page.drawCircle({
                    x: this.mapCoordinateSpaceX(s.sectorCoordinates.x) - r1/2,
                    y: page.getHeight() - this.mapCoordinateSpaceY(s.sectorCoordinates.y) + r1/2,
                    size: r1,
                    color: rgb(colour.red / 255.0, colour.green / 255.0, colour.blue / 255.0),
                    borderColor: rgb(borderColour.red / 255.0, borderColour.green / 255.0, borderColour.blue / 255.0),
                    borderWidth: 0.4
                });

                page.drawCircle({
                    x: this.mapCoordinateSpaceX(s.sectorCoordinates.x) + r2/2,
                    y: page.getHeight() - this.mapCoordinateSpaceY(s.sectorCoordinates.y) - r2/2,
                    size: r2,
                    color: rgb(colour2.red / 255.0, colour2.green / 255.0, colour2.blue / 255.0),
                    borderColor: rgb(borderColour2.red / 255.0, borderColour2.green / 255.0, borderColour2.blue / 255.0),
                    borderWidth: 0.4
                });

            } else {
                page.drawCircle({
                    x: this.mapCoordinateSpaceX(s.sectorCoordinates.x),
                    y: page.getHeight() - this.mapCoordinateSpaceY(s.sectorCoordinates.y),
                    size: r,
                    color: rgb(colour.red / 255.0, colour.green / 255.0, colour.blue / 255.0),
                    borderColor: rgb(borderColour.red / 255.0, borderColour.green / 255.0, borderColour.blue / 255.0),
                    borderWidth: 0.4
                });
            }

            page.drawCircle({
                x: this.mapCoordinateSpaceX(s.sectorCoordinates.x),
                y: page.getHeight() - this.mapCoordinateSpaceY(s.sectorCoordinates.y),
                size: r + 3,
                borderColor: rgb(borderColour.red / 255.0, borderColour.green / 255.0, borderColour.blue / 255.0),
                borderWidth: 0.75
            });

            let sectorText = s.friendlyName ? s.friendlyName.toLocaleUpperCase() : s.id;
            page.drawText(sectorText, {
                x: this.mapCoordinateSpaceX(s.sectorCoordinates.x) - font.widthOfTextAtSize(sectorText, 8) / 2,
                y: page.getHeight() - this.mapCoordinateSpaceY(s.sectorCoordinates.y) - (r+3) - font.heightAtSize(8),
                font: font,
                size: 8.0,
                color: PdfExporter.LCARS_PURPLE
            });
        });

        let currentLine = 410;

        page.drawText("System Identifier", {
            x: PdfExporter.COLUMN_ONE,
            y: page.getHeight() - currentLine,
            size: 12.0,
            font: bold,
            color: PdfExporter.LCARS_BLACK
        });

        page.drawText("Primary Star", {
            x: 300,
            y: page.getHeight() - currentLine,
            size: 12.0,
            font: bold,
            color: PdfExporter.LCARS_BLACK
        });

        page.drawText("Worlds", {
            x: 565 - bold.widthOfTextAtSize("Worlds", 12),
            y: page.getHeight() - currentLine,
            size: 12.0,
            font: bold,
            color: PdfExporter.LCARS_BLACK
        });

        currentLine += 20;

        sector.systems.forEach((s) => {
            page.drawText(s.name, {
                x: PdfExporter.COLUMN_ONE,
                y: page.getHeight() - currentLine,
                size: 16.0,
                font: bold,
                color: PdfExporter.LCARS_PINK
            });

            page.drawText(s.star.description, {
                x: 300,
                y: page.getHeight() - currentLine,
                size: 14.0,
                font: light,
                color: PdfExporter.LCARS_BLACK
            });

            page.drawText("" + s.worlds.length, {
                x: 565 - light.widthOfTextAtSize("" + s.worlds.length, 12),
                y: page.getHeight() - currentLine,
                size: 14.0,
                font: light,
                color: rgb(0, 0, 0)
            });

            currentLine += 20;
        });
    }

    mapCoordinateSpaceX(x: number) {
        return x * 250 / 20 + 235;
    }

    mapCoordinateSpaceY(y: number) {
        return y * 250 / 20 + 65;
    }
}