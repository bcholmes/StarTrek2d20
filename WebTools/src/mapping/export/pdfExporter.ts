import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";
import fontkit from '@pdf-lib/fontkit'
import { Sector } from "../table/sector";
import { Color } from "../../common/colour";
import { CompanionType, StarSystem } from "../table/starSystem";
import { AsteroidBeltDetails, StandardWorldDetails, World, WorldClass, WorldCoreType } from "../table/world";

const BULLET = '\u2022';

export class PdfExporter {

    static LCARS_ORANGE = rgb(249.0 / 255.0, 157.0 / 255.0, 37.0 / 255.0);
    static LCARS_PURPLE = rgb(138.0 / 255.0, 113.0 / 255.0, 167.0 / 255.0);
    static LCARS_PINK = rgb(213.0 / 255.0, 150.0 / 255.0, 179.0 / 255.0);
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
            + system.sectorCoordinates.z.toFixed(2), font, light, 162, currentLine);


        currentLine += 25 + lineHeight;
        let blockLine = currentLine;

        if (system.star) {
            this.addPillHeader(page, "Primary Star", font, currentLine, 162, 361);

            currentLine += 20;

            this.addLabelAndValue(page, "Spectral Class:",
                system.star.description, font, light, 162, currentLine);

            currentLine += lineHeight;
            this.addLabelAndValue(page, "Mass:",
                system.star.mass.toFixed(2) + " Sols", font, light, 162, currentLine);

            currentLine += lineHeight;
            this.addLabelAndValue(page, "Mass:",
                system.star.massInKgs.toFixed(4) + " x 10    kg", font, light, 162, currentLine);
            let offset = light.widthOfTextAtSize(system.star.massInKgs.toFixed(4) + " x 10", 10.0);
            page.drawText("30" , {
                x: 162 + 66 + offset,
                y: page.getHeight() - currentLine + 4,
                size: 6.0,
                font: light,
                color: PdfExporter.LCARS_BLACK
            });

            currentLine += lineHeight;
            if (system.star.luminosityValue != null) {
                this.addLabelAndValue(page, "Luminosity:",
                    (system.star.luminosityValue > 100 ? system.star.luminosityValue.toFixed(0) :  system.star.luminosityValue.toFixed(4)) + " Sols",
                    font, light, 162, currentLine);
            }
        }

        if (system.companionStar) {
            currentLine = blockLine;
            this.addPillHeader(page, "Companion Star", font, currentLine, 377, 576);

            currentLine += 20;

            this.addLabelAndValue(page, "Spectral Class:",
                system.companionStar.description, font, light, 377, currentLine);

            currentLine += lineHeight;
            this.addLabelAndValue(page, "Companion Type:",
                system.companionType === CompanionType.Close ? "Close" : "Distant", font, light, 377, currentLine);

            currentLine += lineHeight;
            this.addLabelAndValue(page, "Mass:",
                system.companionStar.mass.toFixed(2) + " Sols", font, light, 377, currentLine);

            currentLine += lineHeight;
            this.addLabelAndValue(page, "Mass:",
                system.companionStar.massInKgs.toFixed(4) + " x 10    kg", font, light, 377, currentLine);
            let offset = light.widthOfTextAtSize(system.companionStar.massInKgs.toFixed(4) + " x 10", 10.0);
            page.drawText("30" , {
                x: 377 + 66 + offset,
                y: page.getHeight() - currentLine + 4,
                size: 6.0,
                font: light,
                color: PdfExporter.LCARS_BLACK
            });

            currentLine += lineHeight;
            if (system.companionStar.luminosityValue != null) {
                this.addLabelAndValue(page, "Luminosity:",
                    system.companionStar.luminosityValue > 100 ? system.companionStar.luminosityValue.toFixed(0) :  system.companionStar.luminosityValue.toFixed(4),
                    font, light, 377, currentLine);
            }
        }

        currentLine += 25 + lineHeight;
        this.addPillHeader(page, "Worlds", font, currentLine, 162, 576);
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

                let rowCount = Math.ceil(worlds.length / 2);
                for (let j = 0; j < rowCount; j++) {

                    let numberOfLines = this.numberOfLinesToRepresentWorld(worlds[j * 2]);
                    if ((j * 2 + 1) < worlds.length) {
                        numberOfLines = Math.max(this.numberOfLinesToRepresentWorld(worlds[j * 2 + 1]), numberOfLines);
                    }

                    let rowHeight = lineHeight * numberOfLines + (titleWritten ? 0 : 20);
                    let baseLine = currentLine;

                    if ((currentLine + rowHeight) > (page.getHeight() - 36 - lineHeight)) {
                        const [ temp ] = await pdf.copyPages(blankPagePdf, [0]);
                        pdf.addPage(temp);
                        page = temp;

                        this.addLcarsHeaderToPage(page, 'System ' + BULLET + " " + system.name, font);
                        currentLine = 60 + lineHeight;
                        baseLine = currentLine;
                    }

                    if (!titleWritten) {
                        page.drawText(title, {
                            x: 162,
                            y: page.getHeight() - currentLine,
                            size: 14.0,
                            font: bold,
                            color: PdfExporter.LCARS_BLACK
                        });
                        currentLine += 20;
                        titleWritten = true;
                    }

                    this.writeWorld(page, system, worlds[j * 2], font, light, 162, currentLine, lineHeight);

                    if ((j * 2 + 1) < worlds.length) {
                        this.writeWorld(page, system, worlds[j * 2 + 1], font, light, 377, currentLine, lineHeight);
                    }

                    currentLine = baseLine + rowHeight + lineHeight;
                }
            }

        } else {
            page.drawText("No Worlds", {
                x: 162,
                y: currentLine,
                size: 14.0,
                font: bold,
                color: PdfExporter.LCARS_BLACK
            });
        }

    }

    writeWorld(page: PDFPage, system: StarSystem, world: World, font: PDFFont, light: PDFFont, startColumn: number, currentLine: number, lineHeight: number) {
        if (world.orbit != null) {
            this.addLabelAndValue(page, "Designation:",
                (system.friendlyName != null ? system.friendlyName + ' ' : '') + world.orbitLabel, font, light, startColumn, currentLine);
            currentLine += lineHeight;
        }

        if (world.worldClass.id === WorldClass.AsteroidBelt) {
            this.addLabelAndValue(page, "Classification:",
                world.worldClass.description, font, light, startColumn, currentLine);
            currentLine += lineHeight;
        } else {
            this.addLabelAndValue(page, "Classification:",
                "Class " + WorldClass[world.worldClass.id] + " (" + world.worldClass.description + ")",
                font, light, startColumn, currentLine);
            currentLine += lineHeight;
        }

        this.addLabelAndValue(page, "Orbital Radius:",
            world.orbitalRadius.toFixed(2) + " AUs", font, light, startColumn, currentLine);
        currentLine += lineHeight;

        this.addLabelAndValue(page, "Orbital Period:",
            world.period.toFixed(3) + ' Earth Years', font, light, startColumn, currentLine);
        currentLine += lineHeight;

        if (world.worldClass.id !== WorldClass.AsteroidBelt) {
            this.addLabelAndValue(page, "Num. Satellites:",
                world.numberOfSatellites.toFixed(0), font, light, startColumn, currentLine);
            currentLine += lineHeight;

            this.addLabelAndValue(page, "Diameter:",
                Math.round(world.diameter).toLocaleString("en-US") + " km", font, light, startColumn, currentLine);
            currentLine += lineHeight;

            this.addLabelAndValue(page, "Density:",
            world.density.toFixed(2) + " Earth", font, light, startColumn, currentLine);
            currentLine += lineHeight;

            this.addLabelAndValue(page, "Mass:",
                (world.mass >= 1000 ? Math.round(world.mass).toLocaleString("en-US") : world.mass.toFixed(2)) + " Earth",
                font, light, startColumn, currentLine);
            currentLine += lineHeight;

            if (world.gravity != null) {
                this.addLabelAndValue(page, "Gravity:",
                    (world.gravity.toFixed(2)) + " G", font, light, startColumn, currentLine);
                currentLine += lineHeight;
            }

            if (world.worldDetails != null && world.worldDetails instanceof StandardWorldDetails) {
                let details = world.worldDetails as StandardWorldDetails;

                if (details.rotationPeriod != null) {
                    this.addLabelAndValue(page, "Rotation:",
                        details.rotationPeriod.toFixed(2) + " hours" + (details.retrograde ? " (retrograde)" : ""), font, light, startColumn, currentLine);
                    currentLine += lineHeight;
                } else if (details.tidallyLocked) {
                    this.addLabelAndValue(page, "Rotation:",
                        "Tidally Locked", font, light, startColumn, currentLine);
                    currentLine += lineHeight;
                }

                if (details.hydrographicPercentage) {
                    this.addLabelAndValue(page, "Water coverage:",
                        details.hydrographicPercentage.toFixed(2) + '%', font, light, startColumn, currentLine);
                    currentLine += lineHeight;
                }

                if (details.axialTilt) {
                    this.addLabelAndValue(page, "Axial Tilt:",
                        details.axialTilt.toFixed(2) + '\u00b0', font, light, startColumn, currentLine);
                    currentLine += lineHeight;
                }
            }

            if (world.coreType != null) {
                this.addLabelAndValue(page, "Core:",
                    WorldCoreType[world.coreType], font, light, startColumn, currentLine);
                currentLine += lineHeight;
            }

        } else if (world.worldDetails != null && world.worldDetails instanceof AsteroidBeltDetails) {
            let details = world.worldDetails as AsteroidBeltDetails;
            this.addLabelAndValue(page, "Predominant Size:",
                (details.asteroidSize >= 1000 ? ((details.asteroidSize / 1000).toFixed(0) + "km") : (details.asteroidSize.toFixed(0) + "m"))
                + " Diameter", font, light, startColumn, currentLine);
            currentLine += lineHeight;

            this.addLabelAndValue(page, "Belt Width:",
                details.depth.toFixed(2) + " AUs", font, light, startColumn, currentLine);
            currentLine += lineHeight;
        }
    }


    numberOfLinesToRepresentWorld(world: World) {
        if (world.worldClass.id === WorldClass.AsteroidBelt) {
            return 5;
        } else if (world.worldClass.isGasGiant) {
            return 8;
        } else if (world.worldClass.id === WorldClass.M ||
            world.worldClass.id === WorldClass.K ||
            world.worldClass.id === WorldClass.L ||
            world.worldClass.id === WorldClass.O ||
            world.worldClass.id === WorldClass.H) {
            return 13
        } else {
            return 12;
        }
    }

    async addPillHeader(page: PDFPage, headerText: string, font: PDFFont, currentLine: number, start: number, end: number) {
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

    async addLabelAndValue(page: PDFPage, label: string, value: string, font: PDFFont, light: PDFFont, startColumn: number, currentLine: number) {
        page.drawText(label.toLocaleUpperCase(), {
            x: startColumn,
            y: page.getHeight() - currentLine,
            size: 12.0,
            font: font,
            color: PdfExporter.LCARS_PURPLE
        });

        page.drawText(value , {
            x: startColumn + 66,
            y: page.getHeight() - currentLine,
            size: 10.0,
            font: light,
            color: PdfExporter.LCARS_BLACK
        });

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
            x: 162,
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

            let r = Math.max(1, Math.sqrt(s.star.spectralClass.radius.midpoint * 35));

            if (s.isBinary) {
                let r1 = r * 0.75;

                let baseColour2 = s.companionStar.spectralClass.colour;
                let colour2 = baseColour2.blend(new Color(255, 255, 255), 1-z);

                let r2 = Math.max(1, Math.sqrt(s.companionStar.spectralClass.radius.midpoint * 35));

                r = Math.max(r, r2);

                r2 = r2 * 0.75;
                page.drawCircle({
                    x: this.mapCoordinateSpaceX(s.sectorCoordinates.x) - r1/2,
                    y: page.getHeight() - this.mapCoordinateSpaceY(s.sectorCoordinates.y) + r1/2,
                    size: r1,
                    color: rgb(colour.red / 255.0, colour.green / 255.0, colour.blue / 255.0)
                });

                page.drawCircle({
                    x: this.mapCoordinateSpaceX(s.sectorCoordinates.x) + r2/2,
                    y: page.getHeight() - this.mapCoordinateSpaceY(s.sectorCoordinates.y) - r2/2,
                    size: r2,
                    color: rgb(colour2.red / 255.0, colour2.green / 255.0, colour2.blue / 255.0)
                });

            } else {
                page.drawCircle({
                    x: this.mapCoordinateSpaceX(s.sectorCoordinates.x),
                    y: page.getHeight() - this.mapCoordinateSpaceY(s.sectorCoordinates.y),
                    size: r,
                    color: rgb(colour.red / 255.0, colour.green / 255.0, colour.blue / 255.0)
                });
            }

            page.drawCircle({
                x: this.mapCoordinateSpaceX(s.sectorCoordinates.x),
                y: page.getHeight() - this.mapCoordinateSpaceY(s.sectorCoordinates.y),
                size: r + 3,
                borderColor: rgb(colour.red / 255.0, colour.green / 255.0, colour.blue / 255.0),
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
            x: 162,
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
                x: 162,
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