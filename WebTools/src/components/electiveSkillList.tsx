import React from 'react';
import {Character, character} from '../common/character';
import {Skill} from '../helpers/skills';
import ElectiveSkill from './electiveSkill';

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
            const max = character.hasMaxedSkill() ? Math.min(Character.maxDiscipline(character), 4) : Character.maxDiscipline(character);
            const showCheckBox = isSelected || character.skills[s].expertise < max;
            return (<ElectiveSkill key={i} skill={s} isSelected={isSelected} showCheckBox={showCheckBox} onSelected={skill => this.onSelect(skill) }/>)
        });

        return (
            <div>
                <table className="skill-container" cellPadding="0" cellSpacing="0">
                    <tbody>
                        {skills}
                        </tbody>
                </table>
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