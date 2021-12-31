import * as React from 'react';
import {character} from '../common/character';
import {Skill, SkillsHelper} from '../helpers/skills';

interface ISkillImprovementProperties {
    controller: SkillImprovementCollection;
    skill: Skill;
    showIncrease: boolean;
    showDecrease: boolean;
}

export class SkillImprovement extends React.Component<ISkillImprovementProperties, {}> {
    render() {
        const {skill, showDecrease, showIncrease} = this.props;

        const expertise = character.skills[skill].expertise;

        const dec = showDecrease
            ? (<img height="20" src="img/dec.png" onClick={ () => { this.onDecrease() } } alt="-"/>)
            : undefined;

        const inc = showIncrease
            ? (<img height="20" src="img/inc.png" onClick={ () => { this.onIncrease() } } alt="+"/>)
            : undefined;

        return (
            <table cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td style={{ width: "250px" }}>
                            <div className="skill-name">{SkillsHelper.getSkillName(skill) }</div>
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

interface ISkillImprovementCollectionProperties {
    points: number;
    skills: Skill[];
    onDone?: (done: boolean) => void;
}

class SkillContainer {
    skill: Skill;
    value: number;
    minValue: number;
    maxValue: number;
    showDecrease: boolean;
    showIncrease: boolean;

    constructor(skill: Skill, value: number, showDecrease: boolean, showIncrease: boolean) {
        this.skill = skill;
        this.value = value;
        this.minValue = value;
        this.showDecrease = showDecrease;
        this.showIncrease = showIncrease;
    }
}

export class SkillImprovementCollection extends React.Component<ISkillImprovementCollectionProperties, {}> {
    private _points: number;
    private _skills: SkillContainer[];

    constructor(props: ISkillImprovementCollectionProperties) {
        super(props);

        this._points = props.points;
        this._skills = [];

        for (var i = 0; i < character.skills.length; i++) {
            this._skills.push(new SkillContainer(i, character.skills[i].expertise, false, true));
        }
    }

    render() {
        const skills = this._skills.map((s, i) => {
            return (
                <SkillImprovement
                    key={i}
                    controller={this}
                    skill={s.skill}
                    showDecrease={s.showDecrease}
                    showIncrease={s.showIncrease && character.skills[s.skill].expertise < this.calculateMax()}/>
            )
        });

        return (
            <div>
                <div>{skills}</div>
            </div>
        );
    }

    onDecrease(skill: Skill) {
        this._points++;

        character.skills[skill].expertise--;

        this._skills.forEach((container, i) => {
            if (container.skill === skill) {
                container.value--;
            }

            container.showDecrease = container.value > container.minValue;
            container.showIncrease = container.value < this.calculateMax() && this._points > 0;
        });

        this.forceUpdate();
    }

    onIncrease(skill: Skill) {
        this._points--;

        character.skills[skill].expertise++;

        this._skills.forEach((container, i) => {
            if (container.skill === skill) {
                container.value++;
            }

            container.showDecrease = container.value > container.minValue;
            container.showIncrease = container.value < this.calculateMax() && this._points > 0;
        });

        this.props.onDone(this._points === 0);

        this.forceUpdate();
    }

    private calculateMax() {
        return character.isYoung() ? 4 : character.hasMaxedSkill() ? 4 : 5;
    }
}