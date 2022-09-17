import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";
import fontkit from '@pdf-lib/fontkit'
import { Sector } from "../table/sector";
import { Color } from "../../common/colour";

const BULLET = '\u2022';

export class PdfExporter {
    async populate(pdf: PDFDocument, sector: Sector) {
        pdf.registerFontkit(fontkit);
        const lcarsFontBytes = await fetch("/static/font/lcars_font.TTF").then(res => res.arrayBuffer());
        const boldFontBytes = await fetch("/static/font/OpenSansCondensed-Bold.ttf").then(res => res.arrayBuffer());
        const lightFontBytes = await fetch("/static/font/OpenSansCondensed-Light.ttf").then(res => res.arrayBuffer());
        const lcarsFont = await pdf.embedFont(lcarsFontBytes);
        const openSansBold = await pdf.embedFont(boldFontBytes);
        const openSansLight = await pdf.embedFont(lightFontBytes);

        this.populatePage1(pdf.getPage(0), lcarsFont, openSansLight, openSansBold, sector);
    }

    async populatePage1(page: PDFPage, font: PDFFont, light: PDFFont, bold: PDFFont, sector: Sector) {
        let text = ("SECTOR " + BULLET + " " + sector.name).toUpperCase();
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
            color: rgb(249.0 / 255.0, 157.0 / 255.0, 37.0 / 255.0)
        });

        text = "Notable Systems".toUpperCase();
        width = font.widthOfTextAtSize(text, 18.0);

        page.drawText(text, {
            x: 162,
            y: page.getHeight() - 390,
            size: 18.0,
            font: font,
            color: rgb(138.0 / 255.0, 113.0 / 255.0, 167.0 / 255.0)
        });

        let systems = sector.sortedSystems;
        systems.map((s, i) => {
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

            page.drawText(s.id, {
                x: this.mapCoordinateSpaceX(s.sectorCoordinates.x) - font.widthOfTextAtSize(s.id, 8) / 2,
                y: page.getHeight() - this.mapCoordinateSpaceY(s.sectorCoordinates.y) - (r+3) - font.heightAtSize(8),
                font: font,
                size: 8.0,
                color: rgb(0x91 / 255.0,  0x79 / 255.0, 0xb7 / 255.0)
            });
        });

        let currentLine = 410;

        page.drawText("System Identifier", {
            x: 162,
            y: page.getHeight() - currentLine,
            size: 12.0,
            font: bold,
            color: rgb(0, 0, 0)
        });

        page.drawText("Primary Star", {
            x: 300,
            y: page.getHeight() - currentLine,
            size: 12.0,
            font: bold,
            color: rgb(0, 0, 0)
        });

        page.drawText("Worlds", {
            x: 565 - bold.widthOfTextAtSize("Worlds", 12),
            y: page.getHeight() - currentLine,
            size: 12.0,
            font: bold,
            color: rgb(0, 0, 0)
        });

        currentLine += 20;

        sector.systems.map((s, i) => {
            page.drawText(s.name, {
                x: 162,
                y: page.getHeight() - currentLine,
                size: 16.0,
                font: bold,
                color: rgb(213.0 / 255.0, 150.0 / 255.0, 179.0 / 255.0)
            });

            page.drawText(s.star.description, {
                x: 300,
                y: page.getHeight() - currentLine,
                size: 14.0,
                font: light,
                color: rgb(0, 0, 0)
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