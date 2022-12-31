import React from "react";
import { Character, character } from "../common/character";
import { Skill } from "../helpers/skills";
import SkillImprovement from "./skillImprovement";

class SkillContainer {
    skill: Skill;
    value: number;

    constructor(skill: Skill, value: number) {
        this.skill = skill;
        this.value = value;
    }
}


interface ISkillImprovementCollectionProperties {
    points: number;
    skills: Skill[];
    onDone?: (done: boolean) => void;
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

    calculateMax() {
        if (character.hasMaxedAttribute()) {
            return Math.min(Character.maxDiscipline(character), 4);
        } else {
            return Character.maxDiscipline(character);
        }
    }
}