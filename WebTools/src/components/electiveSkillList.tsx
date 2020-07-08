import * as React from 'react';
import {character} from '../common/character';
import {Skill, SkillsHelper} from '../helpers/skills';
import {CheckBox} from '../components/checkBox';
import {Button} from '../components/button';

interface IElectiveSkillProperties {
    skill: Skill;
    isSelected: boolean;
    showCheckBox?: boolean;
    onSelected: (val: any) => void;
}

class ElectiveSkill extends React.Component<IElectiveSkillProperties, {}> {
    constructor(props: IElectiveSkillProperties) {
        super(props);
    }

    render() {
        const {skill, onSelected, isSelected, showCheckBox} = this.props;

        const skillExpertise = character.skills[skill].expertise;

        const checkBox = showCheckBox
            ? <CheckBox value={skill} onChanged={val => onSelected(val) } isChecked={isSelected} />
            : undefined;

        return (
            <table className="skill-container" cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td className="skill-name" style={{ width: "250px" }}>{SkillsHelper.getSkillName(skill) }</td>
                        <td className="skill-expertise">{skillExpertise}</td>
                        <td>{checkBox}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

interface IElectiveSkillListProperties {
    skills: Skill[];
    points: number;
    onUpdated?: (skills: Skill[]) => void;
}

export class ElectiveSkillList extends React.Component<IElectiveSkillListProperties, {}> {
    private _selected: Skill[];

    constructor(props: IElectiveSkillListProperties) {
        super(props);
        this._selected = [];
    }

    render() {
        const skills = this.props.skills.map((s, i) => {
            const isSelected = this._selected.indexOf(s) > -1;
            const max = character.isYoung()
                ? character.hasMaxedSkill() ? 3 : 4
                : character.hasMaxedSkill() ? 4 : 5;
            const showCheckBox = isSelected || character.skills[s].expertise < max;
            return (<ElectiveSkill key={i} skill={s} isSelected={isSelected} showCheckBox={showCheckBox} onSelected={skill => this.onSelect(skill) }/>)
        });

        return (
            <div>
                {skills}
            </div>
        );
    }

    private onSelect(skill: Skill) {
        const n = this._selected.indexOf(skill);

        if (n < 0) {
            this._selected.push(skill);

            if (this._selected.length === this.props.points + 1) {
                this.deselect(this._selected[0]);
                this._selected.splice(0, 1);
            }

            this.select(skill);
        }
        else {
            this._selected.splice(n, 1);
            this.deselect(skill);
        }

        if (this.props.onUpdated) {
            this.props.onUpdated(this._selected);
        }

        this.forceUpdate();
    }

    private select(skill: Skill) {
        character.skills[skill].expertise++;
    }

    private deselect(skill: Skill) {
        character.skills[skill].expertise--;
    }
}