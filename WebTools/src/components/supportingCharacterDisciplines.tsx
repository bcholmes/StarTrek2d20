import * as React from 'react';
import {character} from '../common/character';
import {Skill, SkillsHelper} from '../helpers/skills';

interface IValueProperties {
    index: number;
    value: number;
    isSelected: boolean;
    onSelect: (index: number) => void;
}

class Value extends React.Component<IValueProperties, {}> {
    private _isSelected: boolean;

    constructor(props: IValueProperties) {
        super(props);

        this._isSelected = props.isSelected;
    }

    componentDidUpdate(prevProps: IValueProperties) {
        this._isSelected = this.props.isSelected;
    }

    render() {
        const className = this._isSelected ? "die die-selected" : "die";

        return (
            <div className={className} onClick={() => this.toggleSelection() }>
                <div className="die-value">
                    {this.props.value}
                </div>
            </div>
        );
    }

    private toggleSelection() {
        this._isSelected = !this._isSelected;
        this.props.onSelect(this._isSelected ? this.props.index : -1);
        this.forceUpdate();
    }
}

interface IProperties {
    onUpdate: () => void;
}

export class SupportingCharacterDisciplines extends React.Component<IProperties, {}> {
    private _values: number[];
    private _assignedValues: number[];
    private _selectedValue: number;

    constructor(props: IProperties) {
        super(props);

        this._values = [4, 3, 2, 2, 1, 1];
        this._assignedValues = [0, 1, 2, 3, 4, 5];

        this.updateCharacterDisciplines();
    }

    render() {
        const disciplines = [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Security, Skill.Science, Skill.Medicine].map((s, i) => {
            const val = this._values[this._assignedValues[s]];

            return (
                <tr key={i}>
                    <td className="selection-header">{SkillsHelper.getSkillName(s) }</td>
                    <td>
                        <Value
                            index={s}
                            value={val}
                            onSelect={(index) => this.selectValue(index) }
                            isSelected={this._selectedValue === s} />
                    </td>
                </tr>
            );
        });

        return (
            <table className="selection-list">
                <thead>
                    <tr>
                        <td>Discipline</td>
                        <td>Value</td>
                    </tr>
                </thead>
                <tbody>
                    {disciplines}
                </tbody>
            </table>
        );
    }

    private selectValue(index: number) {
        if (index > -1) {
            if (this._selectedValue === undefined) {
                this._selectedValue = index;
            }
            else {
                this.swapValues(this._selectedValue, index);
            }
        }
        else {
            this._selectedValue = undefined;
        }
    }

    private swapValues(from: number, to: number) {
        const f = this._assignedValues[from];
        const t = this._assignedValues[to];

        this._assignedValues[from] = t;
        this._assignedValues[to] = f;

        this._selectedValue = undefined;

        this.updateCharacterDisciplines();
        this.forceUpdate();
    }

    private updateCharacterDisciplines() {
        [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Security, Skill.Science, Skill.Medicine].forEach(a => {
            character.skills[a].expertise = this._values[this._assignedValues[a]];
        });

        this.props.onUpdate();
    }
}