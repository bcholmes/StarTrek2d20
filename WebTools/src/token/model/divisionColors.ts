import i18next from "i18next";
import { Division } from "../../common/character";
import { NamedColor } from "./namedColour";
import { UniformEra } from "./uniformEra";

export class DivisionColors {

    static getColors(era: UniformEra) {
        if (era === UniformEra.OriginalSeries) {
            return [ new NamedColor(i18next.t("Division.command"), "#d1bd7f"),
                new NamedColor(i18next.t("Division.science"), "#718aa3"),
                new NamedColor(i18next.t("Division.operations"), "#cf1f35")];
        } else {
            return [ new NamedColor(i18next.t("Division.command"), "#B12542"),
                new NamedColor(i18next.t("Division.science"), "#30787E"),
                new NamedColor(i18next.t("Division.operations"), "#D5934C")];
        }
    }

    static getDivision(era: UniformEra, color: string) {
        let index = this.indexOf(era, color);
        return (index >= 0) ? Division[index] : null;
    }

    static indexOf(era: UniformEra, color: string) {
        let index = -1;
        this.getColors(era).forEach((c, i) => {
            if (c.color === color) {
                index = i;
            }
        });
        return index;
    }
}