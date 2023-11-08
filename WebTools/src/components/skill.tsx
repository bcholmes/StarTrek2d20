import React from 'react';
import {character} from '../common/character';
import {Skill} from '../helpers/skills';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';

interface ISkillProperties extends WithTranslation {
    skill: Skill;
    points: number;
}

class SkillView extends React.Component<ISkillProperties, {}> {
    render() {
        const {skill, points, t} = this.props;

        return (
            <table cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td style={{ width: "250px" }}>
                            <div className="skill-name">{t(makeKey('Construct.discipline.', Skill[skill]))}</div>
                        </td>
                        <td>(+{points}) &nbsp;</td>
                        <td className="skill-expertise">{character.skills[skill].expertise}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default withTranslation()(SkillView);