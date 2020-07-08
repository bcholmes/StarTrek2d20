import * as React from 'react';
import {character} from '../common/character';
import {Skill, SkillsHelper} from '../helpers/skills';

interface ISkillProperties {
    skill: Skill;
    points: number;
}

export class SkillView extends React.Component<ISkillProperties, {}> {
    constructor(props: ISkillProperties) {
        super(props);
    }

    render() {
        const {skill, points} = this.props;

        return (
            <table cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td style={{ width: "250px" }}>
                            <div className="skill-name">{SkillsHelper.getSkillName(skill) }</div>
                        </td>
                        <td>(+{points}) &nbsp;</td>
                        <td className="skill-expertise">{character.skills[skill].expertise}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}