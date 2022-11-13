import { Character } from "../common/character";
import { PageIdentity } from "./pageIdentity";

export const extraCharacterSteps = (character: Character) => {

    let result = [];
    if (character.hasTalent("Borg Implants")) {
        result.push(PageIdentity.BorgImplants);
    }
    if (character.hasTalent("Visit Every Star") || character.hasTalent("Expanded Program")) {
        result.push(PageIdentity.ExtraFocus);
    }
    return result;
}

export const extraCharacterStepsNext = (character: Character, currentPage?: PageIdentity) => {
    const optionalPages = extraCharacterSteps(character);
    if (currentPage == null) {
        return optionalPages[0];
    } else {
        let index = optionalPages.indexOf(currentPage);
        console.log("Page index is " + index + " and number of optional pages is " + optionalPages.length);
        if (index >= 0 && optionalPages.length > (index+1)) {
            return optionalPages[index+1];
        } else {
            return null;
        }
    }
}