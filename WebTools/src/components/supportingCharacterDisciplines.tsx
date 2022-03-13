import * as React from 'react';
import {character} from '../common/character';
import { Age } from '../helpers/age';
import {Skill, SkillsHelper} from '../helpers/skills';

interface IValueProperties {
    index: number;
    value: number;
    isSelected: boolean;
    onSelect: (index: number) => void;
}

class Value extends React.Component<IValueProperties, {}> {
    render() {
        const className = this.props.isSelected ? "die die-selected" : "die";

        return (
            <div className={className} onClick={() => this.toggleSelection() }>
                <div className="die-value">
                    {this.props.value}
                </div>
            </div>
        );
    }

    private toggleSelection() {
        this.props.onSelect(this.props.isSelected ? -1 : this.props.index);
    }
}

interface IProperties {
    age: Age;
    onUpdate: () => void;
}

interface IDisciplinesState {
    assignedValues: number[];
    selectedValue?: number;
}

export class SupportingCharacterDisciplines extends React.Component<IProperties, IDisciplinesState> {

    constructor(props: IProperties) {
        super(props);

        this.state = {
            assignedValues: [0, 1, 2, 3, 4, 5]
        }

        this.updateCharacterDisciplines(this.state.assignedValues);
    }

    componentDidUpdate(prevProps: Readonly<IProperties>, prevState: Readonly<IDisciplinesState>, snapshot?: any): void {
        if (prevProps.age !== this.props.age) {
            this.updateCharacterDisciplines(this.state.assignedValues);
        }
    }

    render() {
        const disciplines = [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Security, Skill.Science, Skill.Medicine].map((s, i) => {
            const val = this.props.age.disciplines[this.state.assignedValues[s]];

            return (
                <tr key={i}>
                    <td className="selection-header">{SkillsHelper.getSkillName(s) }</td>
                    <td>
                        <Value
                            index={s}
                            value={val}
                            onSelect={(index) => this.selectValue(index) }
                            isSelected={this.state.selectedValue === s} />
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
            if (this.state.selectedValue === undefined) {
                this.setState({
                    ...this.state,
                    selectedValue: index
                });
            } else {
                this.swapValues(this.state.selectedValue, index);
            }
        } else {
            this.setState({
                ...this.state,
                selectedValue: undefined
            });
        }
    }

    private swapValues(from: number, to: number) {
        let assignedValues = [...this.state.assignedValues];
        const f = assignedValues[from];
        const t = assignedValues[to];

        assignedValues[from] = t;
        assignedValues[to] = f;

        this.updateCharacterDisciplines(assignedValues);
        this.setState({
            assignedValues: assignedValues,
            selectedValue: undefined
        });
    }

    private updateCharacterDisciplines(assignedValues: number[]) {
        [Skill.Command, Skill.Conn, Skill.Engineering, Skill.Security, Skill.Science, Skill.Medicine].forEach(a => {
            character.skills[a].expertise = this.props.age.disciplines[assignedValues[a]];
        });

        this.props.onUpdate();
    }
}