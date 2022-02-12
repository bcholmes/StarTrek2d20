import * as React from 'react';
import {character} from '../common/character';
import {Skill, SkillsHelper} from '../helpers/skills';
import {CheckBox} from '../components/checkBox';
import { SkillImprovementRule } from '../helpers/tracks';

interface IMajorSkillProperties {
    skill: Skill;
    isSelected: boolean;
    showCheckBox?: boolean;
    onSelected: (val: any) => void;
    bold?: boolean;
}

class MajorSkill extends React.Component<IMajorSkillProperties, {}> {

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
                        <td className="skill-name" style={{ width: "250px" }}>{SkillsHelper.getSkillName(skill)}</td>
                        <td className="skill-expertise">{skillExpertise}</td>
                        <td>{checkBox}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

class OtherSkill extends React.Component<IMajorSkillProperties, {}> {
    render() {
        const {skill, onSelected, isSelected, showCheckBox} = this.props;

        const skillName = this.props.bold ? (<b>{SkillsHelper.getSkillName(skill)}</b>) : (<span>{SkillsHelper.getSkillName(skill)}</span>);
        const skillExpertise = character.skills[skill].expertise;

        const checkBox = showCheckBox
            ? <CheckBox value={skill} onChanged={val => onSelected(val) } isChecked={isSelected} />
            : undefined;

        return (
            <table className="skill-container" cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td className="skill-name" style={{ width: "250px" }}>{skillName}</td>
                        <td className="skill-expertise">{skillExpertise}</td>
                        <td>{checkBox}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

interface IMajorsSkillListProperties {
    skills: Skill[];
    onMajorSelected?: (skill: Skill) => void;
    onOtherSelected?: (skills: Skill[]) => void;
    onDone: (done: boolean) => void;
    rule?: SkillImprovementRule;
}

class MajorSkillSelections {
    major?: Skill;
    other: Skill[];

    constructor(major?: Skill, other: Skill[] = []) {
        this.major = major;
        this.other = other;
    }

    isFullyPopulated() {
        return this.major != null && this.other.length === 2;
    }
}


interface IMajorsSkillListState {
    selections: MajorSkillSelections;
}

export class MajorsList extends React.Component<IMajorsSkillListProperties, IMajorsSkillListState> {

    private initialValues: number[];

    constructor(props: IMajorsSkillListProperties) {
        super(props);

        this.initialValues = character.skills.map(s => s.expertise);

        this.state = {
            selections: new MajorSkillSelections()
        }
    }

    render() {
        const description = this.props.rule ? (<div className="panel"><div>{this.props.rule.describe()}</div></div>) : null;

        const majors = this.props.skills.map((s, i) => {
            if (character.enlisted && s === Skill.Command) return undefined;

            const isSelected = this.state.selections.major === s;
            return (<MajorSkill key={i} skill={s} isSelected={isSelected} showCheckBox={true} onSelected={skill => this.onSelectMajor(skill) }/>);
        });

        let otherSkills = SkillsHelper.getSkills();
        if (this.state.selections.major != null) {
            otherSkills = otherSkills.filter(s => s !== this.state.selections.major);
        } else {
            otherSkills = otherSkills.filter(s => this.props.skills.indexOf(s) === -1);
        }

        if (character.enlisted && otherSkills.indexOf(Skill.Command) === -1) {
            otherSkills.push(Skill.Command);
        }

        const other = otherSkills.map((s, i) => {
            const isSelected = this.state.selections.other.indexOf(s) > -1;
            return (<OtherSkill key={i} skill={s} isSelected={isSelected} showCheckBox={true} onSelected={skill => this.onSelectOther(skill) } bold={this.props.rule && this.props.rule.skills.indexOf(s) >= 0}/>);
        });

        return (
            <div>
                <div className="panel">
                    <div className="header-small">MAJORS (SELECT ONE)</div>
                    {majors}
                </div>
                <div className="panel">
                    <div className="header-small">OTHER DISCIPLINES (SELECT TWO) </div>
                    {other}
                </div>
                {description}
            </div>
        );
    }

    private onSelectMajor(skill: Skill) {
        let other = [ ...this.state.selections.other ];

        if (other.indexOf(skill) > -1) {
            other.splice(other.indexOf(skill), 1);
        }

        if (this.props.onMajorSelected) {
            this.props.onMajorSelected(skill);
        }

        let selections = this.makeEmptySlotsForRule(new MajorSkillSelections(skill, other));

        this.updateValues(selections);
        this.props.onDone(selections.isFullyPopulated());
        this.setState(state => ({...state, selections: selections }) );
    }

    private updateValues(selections: MajorSkillSelections) {
        character.skills.forEach(s => {
            if (selections.major === s.skill) {
                s.expertise = this.initialValues[s.skill] + 2;
            } else if (selections.other.indexOf(s.skill) >= 0) {
                s.expertise = this.initialValues[s.skill] + 1;
            } else {
                s.expertise = this.initialValues[s.skill];
            }
        });
    }

    private makeEmptySlotsForRule(selections: MajorSkillSelections, removeNonRuleSkillsFirst: boolean = true) {
        let needed: Skill[] = [];
        if (this.props.rule) {
            this.props.rule.skills.forEach(s => {
                if (selections.major !== s && selections.other.indexOf(s) < 0) {
                    needed.push(s);
                }
            });
        }

        let spaces = needed.length;
        if (selections.major == null && spaces > 0) {
            spaces -= 1;
        }
        if (spaces > 0 || selections.other.length > 2) {
            let other = [...selections.other];
            let available = 2 - other.length;

            if (removeNonRuleSkillsFirst) {
                other = other.filter(s => {
                    let result = !this.isRuleSkill(s) && (available < spaces);
                    if (result) {
                        available += 1;
                    }
                    return !result;
                }).map(s => s as Skill);
            }

            other = other.filter(s => {
                let result = (available < spaces);
                if (result) {
                    available += 1;
                }
                return !result;
            }).map(s => s as Skill);
            return new MajorSkillSelections(selections.major, [ ...other ]);
        } else {
            return selections;
        }
    }


    private onSelectOther(skill: Skill) {
        if (this.state.selections.other.indexOf(skill) > -1) {
            return;
        }

        let other = [...this.state.selections.other];
        other.push(skill);

        let selections = this.makeEmptySlotsForRule(new MajorSkillSelections(this.state.selections.major, other), !this.isRuleSkill(skill));
        if (this.props.onOtherSelected) {
            this.props.onOtherSelected(selections.other);
        }

        this.updateValues(selections);
        this.props.onDone(selections.isFullyPopulated());
        this.setState(state => ({...state, selections: selections }) );
    }

    private isRuleSkill(skill: Skill) {
        return this.props.rule ? this.props.rule.skills.indexOf(skill) >= 0 : false;
    }

    private isRuleSatisfied(major?: Skill, other?: Skill[]) {
        let skills: Skill[] = major != null ? [ major ] : [];
        if (other) {
            other.forEach(s => skills.push(s));
        }

        if (this.props.rule) {
            let result = true;
            this.props.rule.skills.forEach(s => result = result && (skills.indexOf(s) >= 0));
            return result;
        } else {
            return true;
        }
    }
}