import React from "react";
import { character } from "../common/character";
import { Skill, SkillsHelper } from "../helpers/skills";
import { CheckBox } from "./checkBox";

interface ISkillSelectionProperties {
    skill: Skill;
    isSelected: boolean;
    showCheckBox?: boolean;
    onSelected: () => void;
}

class SkillSelection extends React.Component<ISkillSelectionProperties, {}> {

    render() {
        const {skill, onSelected, isSelected, showCheckBox} = this.props;

        const skillExpertise = character.skills[skill].expertise;

        const checkBox = showCheckBox
            ? <CheckBox value={skill} onChanged={val => onSelected() } isChecked={isSelected} />
            : undefined;

        return (
            <table className="skill-container" cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td className="skill-name" style={{ width: "250px" }}>{SkillsHelper.getSkillName(skill)}</td>
                        <td className="skill-expertise">{skillExpertise}</td>
                        <td>{checkBox}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

interface IChildSkillListProperties {
    decreasePoints: number;
    onChanged: (dec: boolean, inc: boolean) => void;
}

interface IChildSkillListState {
    reductions: Skill[];
    major?: Skill;
    minors: Skill[];
}

export class ChildSkillList extends React.Component<IChildSkillListProperties, IChildSkillListState> {

    private initialValues: number[];

    constructor(props: IChildSkillListProperties) {
        super(props);

        this.initialValues = character.skills.map(s => s.expertise);

        this.state = {
            reductions: [],
            minors: []
        }
    }

    render() {
        const reductions = SkillsHelper.getSkills().map((s, i) => {
            return (<SkillSelection key={'reduce-' + i} skill={s} isSelected={this.state.reductions.indexOf(s) >= 0} showCheckBox={true} onSelected={() => this.onSelectReduction(s) }/>);
        });

        const majors = SkillsHelper.getSkills().map((s, i) => {
            if (this.state.major == null) {
                return (<SkillSelection key={'major-' + i} skill={s} isSelected={false} showCheckBox={character.skills[s].expertise <= 1} onSelected={() => this.onSelectMajor(s) }/>);
            } else if (this.state.major === s) {
                return (<SkillSelection key={'major-' + i} skill={s} isSelected={true} showCheckBox={true} onSelected={() => this.onSelectMajor(s) }/>);
            } else {
                return (<SkillSelection key={'major-' + i} skill={s} isSelected={false} showCheckBox={character.skills[s].expertise <= 1} onSelected={() => this.onSelectMajor(s) }/>);
            }
        });

        const minors = this.state.major == null ? undefined : SkillsHelper.getSkills().map((s, i) => {
            if (this.state.major === s) {
                return undefined;
            } else if (this.state.minors.indexOf(s) >= 0) {
                return (<SkillSelection key={'minor-' + i} skill={s} isSelected={true} showCheckBox={true} onSelected={() => this.onSelectMinor(s) }/>);
            } else {
                return (<SkillSelection key={'minor-' + i} skill={s} isSelected={false} showCheckBox={character.skills[s].expertise <= 2} onSelected={() => this.onSelectMinor(s) }/>);
            }
        });


        return (
            <div>
                <div className="panel">
                    <div className="header-small">REDUCE (Choose {this.props.decreasePoints})</div>
                    {reductions}
                </div>
                <div className="panel">
                    <div className="header-small">MAJOR (Choose One)</div>
                    {majors}
                </div>
                <div className="panel">
                    <div className="header-small">MINORS (Choose Two)</div>
                    {minors}
                </div>
            </div>
        );
    }

    private onSelectReduction(skill: Skill) {
        let reductions = this.state.reductions;
        if (reductions.indexOf(skill) >= 0) {
            reductions.splice(reductions.indexOf(skill), 1);
        } else {
            reductions.push(skill);
            while (reductions.length > character.age.options.decreaseDisciplines) {
                reductions.splice(0, 1);
            }
        }
        this.updateValues(reductions, this.state.minors, this.state.major);
        this.setState((state) => ({
            ...state,
            reductions: reductions
        }));
    }

    private onSelectMinor(skill: Skill) {
        let minors = this.state.minors;
        if (minors.indexOf(skill) >= 0) {
            minors.splice(minors.indexOf(skill), 1);
        } else {
            minors.push(skill);
            while (minors.length > 2) {
                minors.splice(0, 1);
            }
        }
        this.updateValues(this.state.reductions, minors, this.state.major);
        this.setState((state) => ({
            ...state,
            minors: minors
        }));
    }

    private onSelectMajor(skill: Skill) {
        if (skill === this.state.major) {
            this.setState((state) => ({
                ...state,
                major: undefined
            }));
            this.updateValues(this.state.reductions, this.state.minors, undefined);
        } else {
            let minors = this.state.minors;
            if (minors.indexOf(skill) >= 0) {
                minors.splice(minors.indexOf(skill), 1);
            }
            this.updateValues(this.state.reductions, minors, skill);
            this.setState((state) => ({
                ...state,
                major: skill,
                minors: minors
            }));
        }
    }

    private updateValues(reductions: Skill[], minors: Skill[], majorImprovement?: Skill) {
        SkillsHelper.getSkills().forEach((s, i) => {
            let value = this.initialValues[s];
            if (reductions.indexOf(s) >= 0) {
                value -= 1;
            }
            if (minors.indexOf(s) >= 0) {
                value += 1;
            }
            if (s === majorImprovement) {
                value += 2;
            }
            character.skills[s].expertise = value;
        });
        this.props.onChanged(reductions.length === this.props.decreasePoints, majorImprovement != null && minors.length === 2);
    }
}