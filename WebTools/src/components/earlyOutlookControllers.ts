import { Character } from "../common/character";
import { Skill } from "../helpers/skills";
import { EarlyOutlookModel } from "../helpers/upbringings";
import { StepContext, modifyCharacterDiscipline } from "../state/characterActions";
import store from "../state/store";
import { IDisciplineController } from "./disciplineListComponent";

export class EarlyOutlookDiscplineController implements IDisciplineController {

    readonly character: Character;
    readonly earlyOutlook: EarlyOutlookModel;

    constructor(character: Character, earlyOutlook: EarlyOutlookModel) {
        this.character = character;
        this.earlyOutlook = earlyOutlook;
    }

    isShown(discipline: Skill) {
        return this.earlyOutlook.disciplines.indexOf(discipline) >= 0;
    }
    isEditable(discipline: Skill)  {
        return this.earlyOutlook.disciplines.length >= 1;
    }
    getValue(discipline: Skill) {
        return this.character.skills[discipline].expertise;
    }
    canIncrease(discipline: Skill) {
        return this.character.upbringingStep?.discipline == null && (this.character.skills[discipline].expertise < Character.maxDiscipline(this.character));
    }
    canDecrease(discipline: Skill) {
        return this.character.upbringingStep?.discipline === discipline;
    }
    onIncrease(discipline: Skill) {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.EarlyOutlook, true));
    }
    onDecrease(discipline: Skill) {
        store.dispatch(modifyCharacterDiscipline(discipline, StepContext.EarlyOutlook, false));
    }
}

