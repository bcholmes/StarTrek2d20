import * as React from 'react';
import {character} from '../common/character';
import {Skill, SkillsHelper} from '../helpers/skills';
import {CheckBox} from '../components/checkBox';
import { ImprovementRuleType, SkillImprovementRule } from '../helpers/tracks';
import { Header } from './header';

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
                        <td className="skill-name text-white" style={{ width: "250px" }}>{SkillsHelper.getSkillName(skill)}</td>
                        <td className="skill-expertise pr-2 text-white">{skillExpertise}</td>
                        <td className="pt-2">{checkBox}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

interface IOtherSkillIncrementAndDecrementProperties {
    skill: Skill;
    showIncrease: boolean;
    showDecrease: boolean;
    onIncrease: (s: Skill) => void;
    onDecrease: (s: Skill) => void;
}

export class OtherSkillIncrementAndDecrement extends React.Component<IOtherSkillIncrementAndDecrementProperties, {}> {
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
                            <div className="skill-name text-white">{SkillsHelper.getSkillName(skill) }</div>
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
        this.props.onIncrease(this.props.skill);
    }

    private onDecrease() {
        this.props.onDecrease(this.props.skill);
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
                        <td className="skill-name text-white" style={{ width: "250px" }}>{skillName}</td>
                        <td className="skill-expertise pr-2 text-white">{skillExpertise}</td>
                        <td className="pt-2">{checkBox}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

interface IMajorsSkillListProperties {
    skills: Skill[];
    onDone: (done: boolean) => void;
    rule?: SkillImprovementRule;
}

class MajorSkillSelections {
    major?: Skill;
    decrementSkill?: Skill;
    other: Skill[];

    constructor(major?: Skill, other: Skill[] = [], decrementSkill?: Skill) {
        this.major = major;
        this.other = other;
        this.decrementSkill = decrementSkill;
    }

    isFullyPopulated() {
        /*
        console.log("Major: " + (this.major != null ? Skill[this.major] : "none")
            + ", Decrement: " + (this.decrementSkill != null ? Skill[this.decrementSkill] : "none")
            + ", Other: " + this.other.map((o, i) => Skill[o]));
        */
        return this.major != null
            && ((this.other.length === 2 && this.decrementSkill == null)
                || (this.other.length === 3 && this.decrementSkill != null));
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
        const description = this.props.rule ? (<div className="text-white">{this.props.rule.describe()}</div>) : null;

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

        const other = (this.props.rule && this.props.rule.type === ImprovementRuleType.MAY_DECREMENT_ONE)
            ? SkillsHelper.getSkills().map((s, i) => {
                return (<OtherSkillIncrementAndDecrement key={i} skill={s} showDecrease={this.showDecreaseOther(s)}
                    showIncrease={this.showIncreaseOther(s)} onIncrease={s => this.onIncrease(s)} onDecrease={s => this.onDecrease(s)} />);
            })
            : otherSkills.map((s, i) => {
                const isSelected = this.state.selections.other.indexOf(s) > -1;
                return (<OtherSkill key={i} skill={s} isSelected={isSelected} showCheckBox={true} onSelected={skill => this.onSelectOther(skill) } bold={this.props.rule && this.props.rule.skills.indexOf(s) >= 0}/>);
            });

        return (
            <div>
                <Header level={2}>MAJORS (SELECT ONE)</Header>
                {majors}
                <Header level={2}>OTHER DISCIPLINES (SELECT TWO)</Header>
                {other}
                {description}
            </div>
        );
    }

    showIncreaseOther(skill: Skill) {
        if (this.props.skills.indexOf(skill) >= 0 && this.state.selections.major == null) {
            return false;
        } else if (skill === this.state.selections.major) {
            return false;
        } else if (this.state.selections.isFullyPopulated()) {
            return false;
        } else if (this.state.selections.decrementSkill == null) {
            return character.skills[skill].expertise === this.initialValues[skill];
        } else if (this.state.selections.decrementSkill === skill) {
            return true;
        } else if (this.countOf(this.state.selections.other, skill) >= 2) {
            return false;
        } else {
            return this.state.selections.other.length < 3;
        }
    }

    showDecreaseOther(skill: Skill) {
        if (this.props.skills.indexOf(skill) >= 0 && this.state.selections.major == null) {
            return false;
        } else if (skill === this.state.selections.major) {
            return false;
        } else if (this.state.selections.decrementSkill == null) {
            return true;
        } else if (character.skills[skill].expertise > this.initialValues[skill]) {
            return true;
        } else {
            return false;
        }
    }

    onIncrease(skill: Skill) {
        let selections = this.state.selections;
        let other = [...selections.other];
        let decrementSkill = selections.decrementSkill;

        if (decrementSkill === skill) {
            decrementSkill = undefined;
        } else {
            other.push(skill);
        }

        selections = this.makeEmptySlotsForRule(new MajorSkillSelections(selections.major, other, decrementSkill));

        this.updateValues(selections);
        this.props.onDone(selections.isFullyPopulated());
        this.setState(state => ({...state, selections: selections }) );
    }

    onDecrease(skill: Skill) {
        let selections = this.state.selections;
        let other = [...selections.other];
        let decrementSkill = selections.decrementSkill;

        if (other.indexOf(skill) >= 0) {
            other.splice(other.indexOf(skill), 1);
        } else {
            decrementSkill = skill;
        }

        selections = this.makeEmptySlotsForRule(new MajorSkillSelections(selections.major, other, decrementSkill));

        this.updateValues(selections);
        this.props.onDone(selections.isFullyPopulated());
        this.setState(state => ({...state, selections: selections }) );
    }

    private onSelectMajor(skill: Skill) {
        let other = [ ...this.state.selections.other ];
        let decrementSKill = this.state.selections.decrementSkill;

        if (decrementSKill === skill) {
            decrementSKill = undefined;
        }

        if (this.state.selections.major === skill) {
            // if already selected, then unselect
            skill = undefined;
            // make sure we remove any major skills from the "other" list
            for (let s of this.props.skills) {
                while (other.indexOf(s) > -1) {
                    other.splice(other.indexOf(s), 1);
                }
            }
        } else {
            while (other.indexOf(skill) > -1) {
                other.splice(other.indexOf(skill), 1);
            }
        }

        if (character.educationStep) {
            character.educationStep.primaryDiscipline = skill;
        }

        let selections = this.makeEmptySlotsForRule(new MajorSkillSelections(skill, other, decrementSKill));

        this.updateValues(selections);
        this.props.onDone(selections.isFullyPopulated());
        this.setState(state => ({...state, selections: selections }) );
    }

    private updateValues(selections: MajorSkillSelections) {
        character.skills.forEach(s => {
            if (selections.major === s.skill) {
                s.expertise = this.initialValues[s.skill] + 2;
                if (character.educationStep) {
                    character.educationStep.primaryDiscipline = s.skill;
                }
            } else if (selections.decrementSkill === s.skill) {
                s.expertise = this.initialValues[s.skill] - 1;
                if (character.educationStep) {
                    character.educationStep.decrementDiscipline = s.skill;
                }
            } else if (selections.other.indexOf(s.skill) >= 0) {
                s.expertise = this.initialValues[s.skill] + this.countOf(selections.other, s.skill);
                if (character.educationStep) {
                    character.educationStep.disciplines.push(s.skill);
                }
            } else {
                s.expertise = this.initialValues[s.skill];
            }
        });
    }

    countOf(others: Skill[], skill: Skill) {
        let result = 0;
        others.forEach(s => { if (s === skill) result++; });
        return result;
    }

    private makeEmptySlotsForRule(selections: MajorSkillSelections, removeNonRuleSkillsFirst: boolean = true) {
        let needed: Skill[] = [];
        if (this.props.rule && this.props.rule.type === ImprovementRuleType.MUST_INCLUDE_ALL) {
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
        let count = (selections.decrementSkill == null) ? 2 : 3;
        if (spaces > 0 || selections.other.length > count) {
            let other = [...selections.other];
            let available = count - other.length;

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
        let other = [...this.state.selections.other];
        if (other.indexOf(skill) > -1) {
            other.splice(other.indexOf(skill), 1);
            skill = undefined;
        } else {
            other.push(skill);
        }

        let selections = this.makeEmptySlotsForRule(new MajorSkillSelections(this.state.selections.major, other), skill != null ? !this.isRuleSkill(skill) : true);

        this.updateValues(selections);
        this.props.onDone(selections.isFullyPopulated());
        this.setState(state => ({...state, selections: selections }) );
    }

    private isRuleSkill(skill: Skill) {
        if (this.props.rule && this.props.rule.type === ImprovementRuleType.MUST_INCLUDE_ALL) {
            return this.props.rule.skills.indexOf(skill) >= 0;
        } else {
            return false;
        }
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