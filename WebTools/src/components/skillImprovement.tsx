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

    constructor(skill: Skill, value: number) {
        this.skill = skill;
        this.value = value;
    }
}

interface ISkillImprovementCollectionState {
    allocatedPoints: number;
}

export class SkillImprovementCollection extends React.Component<ISkillImprovementCollectionProperties, ISkillImprovementCollectionState> {
    private _skills: SkillContainer[];
    private initialValues: number[];

    constructor(props: ISkillImprovementCollectionProperties) {
        super(props);

        this._skills = [];
        this.initialValues = character.skills.map(s => s.expertise);

        for (var i = 0; i < character.skills.length; i++) {
            this._skills.push(new SkillContainer(i, character.skills[i].expertise));
        }

        this.state = {
            allocatedPoints: 0
        };
    }

    showDecrease(skill: Skill) {
        return character.skills[skill].expertise > this.initialValues[skill];
    }

    showIncrease(skill: Skill) {
        return this.state.allocatedPoints < this.props.points && character.skills[skill].expertise < this.calculateMax() && 
            ((character.skills[skill].expertise - this.initialValues[skill]) < (this.props.points - 1));
    }


    render() {
        const skills = this._skills.map((s, i) => {
            return (
                <SkillImprovement
                    key={i}
                    controller={this}
                    skill={s.skill}
                    showDecrease={this.showDecrease(s.skill)}
                    showIncrease={this.showIncrease(s.skill)}/>
            )
        });

        return (
            <div>
                <div>{skills}</div>
            </div>
        );
    }

    onDecrease(skill: Skill) {
        let points = this.state.allocatedPoints;
        points--;

        character.skills[skill].expertise--;

        this._skills.forEach((container, i) => {
            if (container.skill === skill) {
                container.value--;
            }
        });

        this.setState(state => ({ ...state, allocatedPoints: points }));
    }

    onIncrease(skill: Skill) {
        let points = this.state.allocatedPoints;
        points++;

        character.skills[skill].expertise++;

        this._skills.forEach((container, i) => {
            if (container.skill === skill) {
                container.value++;
            }
        });

        this.props.onDone(points === this.props.points);

        this.setState(state => ({ ...state, allocatedPoints: points }));
    }

    private calculateMax() {
        return character.isYoung() ? 4 : character.hasMaxedSkill() ? 4 : 5;
    }
}