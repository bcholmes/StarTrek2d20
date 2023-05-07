import { Species } from "../../helpers/speciesEnum";


class SpeciesColors {

    // default in the sense that "the drawing was originally created using this skin colour"
    static DEFAULT_SKIN_COLOR = "#cd976d";

    static getSkinColors(species: Species) {
        return ["#F8E0DE", "#F4D5CA", "#CEB29C", "#CAA18B", SpeciesColors.DEFAULT_SKIN_COLOR, "#AB7D5C", "#9B7A57", "#8C644A", "#704A35", "#53382D", "#473028"];
    }


}

export default SpeciesColors;
