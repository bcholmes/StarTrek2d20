import React from 'react';
import {character} from '../common/character';
import {Skill} from '../helpers/skills';
import { SkillImprovementCollection } from './skillImprovementCollection';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';

interface ISkillImprovementProperties extends WithTranslation {
    controller: SkillImprovementCollection;
    skill: Skill;
    showIncrease: boolean;
    showDecrease: boolean;
}

class SkillImprovement extends React.Component<ISkillImprovementProperties, {}> {
    render() {
        const {skill, showDecrease, showIncrease, t } = this.props;

        const expertise = character.skills[skill].expertise;

        const dec = showDecrease
            ? (<img height="20" src="static/img/dec.png" onClick={ () => { this.onDecrease() } } alt="-"/>)
            : undefined;

        const inc = showIncrease
            ? (<img height="20" src="static/img/inc.png" onClick={ () => { this.onIncrease() } } alt="+"/>)
            : undefined;

        return (
            <table cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td style={{ width: "250px" }}>
                            <div className="skill-name">{t(makeKey('Construct.discipline.', Skill[skill])) }</div>
                        </td>
                        <td style={{ width: "30px" }}>{dec}</td>
                        <th style={{ width: "60px" }}>{expertise}</th>
                        <td style={{ width: "30px" }}>{inc}</td>
                    </tr>
                </tbody>
            </table>
        );
    }

    private onIncrease() {
        this.props.controller.onIncrease(this.props.skill);
    }

    private onDecrease() {
        this.props.controller.onDecrease(this.props.skill);
    }
}

export default withTranslation()(SkillImprovement);
