import { Division } from "../../common/character";
import { UniformEra } from "./uniformEra";

export class DivisionColors {

    static getColors(era: UniformEra) {
        if (era === UniformEra.OriginalSeries) {
            return [ "#d1bd7f", "#8495a5", "#cf1f35"];
        } else {
            return [ "#B12542", "#30787E", "#D5934C"];
        }
    }

    static getDivision(era: UniformEra, color: string) {
        let index = DivisionColors.getColors(era).indexOf(color);
        return (index >= 0) ? Division[index] : null;
    }
}