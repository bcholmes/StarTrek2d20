import React from "react";
import { Skill, SkillsHelper } from "../helpers/skills";
import DisciplineComponent from "./disciplineComponent";

export interface IDisciplineController {
    isShown: (discipline: Skill) => boolean;
    isEditable: (discipline: Skill) => boolean;
    getValue: (discipline: Skill) => number;
    canIncrease: (discipline: Skill) => boolean;
    canDecrease: (discipline: Skill) => boolean;
    onIncrease: (discipline: Skill) => void;
    onDecrease: (discipline: Skill) => void;
}

interface IDisciplineListControllerProperties {
    controller: IDisciplineController;
}

const DisciplineListComponent: React.FC<IDisciplineListControllerProperties> = ({controller}) => {

    const renderDiscipline = (discipline: Skill) => {
        if (controller.isEditable(discipline)) {
            return <DisciplineComponent discipline={discipline}
                onIncrease={() => { controller.onIncrease(discipline)}}
                onDecrease={() => { controller.onDecrease(discipline)}}
                value={controller.getValue(discipline)}
                showIncrease={controller.canIncrease(discipline)}
                showDecrease={controller.canDecrease(discipline)}
                key={'discipline-' + discipline} />
        } else {
            return (<DisciplineComponent discipline={discipline}
                onIncrease={() => { }} onDecrease={() => { }}
                value={controller.getValue(discipline)}
                showIncrease={false}  showDecrease={false} key={'discipline-' + discipline} />);
        }
    }

    return (<>
        {SkillsHelper.getSkills().filter(d => controller.isShown(d)).map(d => renderDiscipline(d))}
        </>);
}

export default DisciplineListComponent;