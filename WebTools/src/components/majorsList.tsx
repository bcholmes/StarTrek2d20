import * as React from 'react';
import {character} from '../common/character';
import {Skill, SkillsHelper} from '../helpers/skills';
import {CheckBox} from '../components/checkBox';
import {Button} from '../components/button';

interface IMajorSkillProperties {
    skill: Skill;
    isSelected: boolean;
    showCheckBox?: boolean;
    onSelected: (val: any) => void;
}

class MajorSkill extends React.Component<IMajorSkillProperties, {}> {
    constructor(props: IMajorSkillProperties) {
        super(props);
    }

    render() {
        const {skill, onSelected, isSelected, showCheckBox} = this.props;

        const skillExpertise = character.skills[skill].expertise;
        const skillFocus = character.skills[skill].focus;

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
    constructor(props: IMajorSkillProperties) {
        super(props);
    }

    render() {
        const {skill, onSelected, isSelected, showCheckBox} = this.props;

        const skillExpertise = character.skills[skill].expertise;
        const skillFocus = character.skills[skill].focus;

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

interface IMajorsSkillListProperties {
    skills: Skill[];
    onMajorSelected?: (skill: Skill) => void;
    onOtherSelected?: (skills: Skill[]) => void;
}

export class MajorsList extends React.Component<IMajorsSkillListProperties, {}> {
    private _selectedMajor: Skill;
    private _selectedOther: Skill[];

    constructor(props: IMajorsSkillListProperties) {
        super(props);

        this._selectedOther = [];
    }

    render() {
        const majors = this.props.skills.map((s, i) => {
            if (character.enlisted && s === Skill.Command) return undefined;

            const isSelected = this._selectedMajor === s;
            return (<MajorSkill key={i} skill={s} isSelected={isSelected} showCheckBox={true} onSelected={skill => this.onSelectMajor(skill) }/>);
        });

        let otherSkills = SkillsHelper.getSkills();
        if (this._selectedMajor != null) {
            otherSkills = otherSkills.filter(s => s !== this._selectedMajor);
        }
        else {
            otherSkills = otherSkills.filter(s => this.props.skills.indexOf(s) === -1);
        }

        if (character.enlisted && otherSkills.indexOf(Skill.Command) === -1) {
            otherSkills.push(Skill.Command);
        }

        const other = otherSkills.map((s, i) => {
            const isSelected = this._selectedOther.indexOf(s) > -1;
            return (<OtherSkill key={i} skill={s} isSelected={isSelected} showCheckBox={true} onSelected={skill => this.onSelectOther(skill) }/>);
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
            </div>
        );
    }

    private onSelectMajor(skill: Skill) {
        if (this._selectedMajor !== undefined) {
            this.deselectMajor(this._selectedMajor);
        }

        if (this._selectedOther.indexOf(skill) > -1) {
            this.deselectOther(skill);
            this._selectedOther.splice(this._selectedOther.indexOf(skill), 1);
        }

        this._selectedMajor = skill;
        this.selectMajor(skill);

        if (this.props.onMajorSelected) {
            this.props.onMajorSelected(this._selectedMajor);
        }
        else {
            this.forceUpdate();
        }
    }

    private selectMajor(skill: Skill) {
        character.skills[skill].expertise += 2;
    }

    private deselectMajor(skill: Skill) {
        character.skills[skill].expertise -= 2;
    }

    private onSelectOther(skill: Skill) {
        if (this._selectedOther.indexOf(skill) > -1) {
            return;
        }

        if (this._selectedOther.length === 2) {
            this.deselectOther(this._selectedOther[0]);
            this._selectedOther.splice(0, 1);
        }

        this._selectedOther.push(skill);
        this.selectOther(skill);

        if (this.props.onOtherSelected) {
            this.props.onOtherSelected(this._selectedOther);
        }
        else {
            this.forceUpdate();
        }
    }

    private selectOther(skill: Skill) {
        character.skills[skill].expertise++;
    }

    private deselectOther(skill: Skill) {
        character.skills[skill].expertise--;
    }
}