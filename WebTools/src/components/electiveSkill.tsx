import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { character } from '../common/character';
import { makeKey } from '../common/translationKey';
import { Skill } from '../helpers/skills';
import { CheckBox } from './checkBox';

interface IElectiveSkillProperties extends WithTranslation {
    skill: Skill;
    isSelected: boolean;
    showCheckBox?: boolean;
    onSelected: (val: any) => void;
}

class ElectiveSkill extends React.Component<IElectiveSkillProperties, {}> {
    render() {
        const {skill, onSelected, isSelected, showCheckBox, t} = this.props;

        const skillExpertise = character.skills[skill].expertise;

        const checkBox = showCheckBox
            ? <CheckBox value={skill} onChanged={val => onSelected(val) } isChecked={isSelected} />
            : undefined;

        return (
                    <tr>
                        <td className="skill-name text-white" style={{ width: "250px" }}>{t(makeKey('Construct.discipline.', Skill[skill])) }</td>
                        <td className="skill-expertise pr-2 text-white">{skillExpertise}</td>
                        <td className="pt-2 text-right">{checkBox}</td>
                    </tr>
        );
    }
}

export default withTranslation()(ElectiveSkill);