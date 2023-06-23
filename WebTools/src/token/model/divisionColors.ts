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
        } else if (era === UniformEra.MonsterMaroon) {
            return [ new NamedColor(i18next.t("Division.monsterMaroon.command"), "#f9f9f9"),
                new NamedColor(i18next.t("Division.monsterMaroon.science"), "#99b6c6"),
                new NamedColor(i18next.t("Division.monsterMaroon.helmEngineering"), "#f3b807"),
                new NamedColor(i18next.t("Division.monsterMaroon.medical"), "#7cba54"),
                new NamedColor(i18next.t("Division.monsterMaroon.security"), "#2e4722"),
                new NamedColor(i18next.t("Division.monsterMaroon.trainee"), "#cf130b")];
        } else {
            return [ new NamedColor(i18next.t("Division.command"), "#B12542"),
                new NamedColor(i18next.t("Division.science"), "#30787E"),
                new NamedColor(i18next.t("Division.operations"), "#D5934C")];
        }
    }

    static getDivision(era: UniformEra, color: string) {
        let index = this.indexOf(era, color);
        if (era === UniformEra.MonsterMaroon) {
            let colours = ["Command", "Science", "HelmEngineering", "Medical", "Security", "Trainee"];
            return index >= 0 ? colours[index] : null;
        } else {
            return (index >= 0) ? Division[index] : null;
        }
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