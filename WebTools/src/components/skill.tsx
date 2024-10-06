import React from 'react';
import {Skill} from '../helpers/skills';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';
import { Character } from '../common/character';

interface ISkillProperties extends WithTranslation {
    skill: Skill;
    points: number;
    character: Character;
}

class SkillView extends React.Component<ISkillProperties, {}> {
    render() {
        const {skill, points, t, character} = this.props;

        return (
            <table cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td style={{ width: "250px" }}>
                            <div className="skill-name text-white">{t(makeKey('Construct.discipline.', Skill[skill]))}</div>
                        </td>
                        <td className="text-white">(+{points}) &nbsp;</td>
                        <td className="skill-expertise text-white">{character.departments[skill]}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default withTranslation()(SkillView);