import * as React from 'react';
import {Skill} from '../helpers/skills';
import {TalentViewModel, TalentsHelper} from '../helpers/talents';
import {DropDownInput} from './dropDownInput';
import {CheckBox} from './checkBox';

interface ITalentSelectionListProperties {
    talents: TalentViewModel[];
    onSelection: (talent: string) => void;
}

export class TalentSelectionList extends React.Component<ITalentSelectionListProperties, {}> {
    private _selectedIndex: number;
    private _talents: TalentViewModel[];
    private _talent: string;

    constructor(props: ITalentSelectionListProperties) {
        super(props);
        this._selectedIndex = 0;
    }

    render() {
        const talents = this.props.talents.map((t, i) => {
            return (
                <tr key={i}>
                    <td className="selection-header-small">{t.name}</td>
                    <td>{t.description}</td>
                    <td>
                        <CheckBox
                            text=""
                            value={t.name}
                            isChecked={this._talent === t.name}
                            onChanged={(val) => {
                                this.selectTalent(val);
                            } }/>
                    </td>
                </tr>
            );
        });

        return (
            <table className="selection-list">
                <tbody>
                    {talents}
                </tbody>
            </table>
        );
    }

    private selectTalent(talent: string) {
        this._talent = talent;
        this.props.onSelection(this._talent);
        this.forceUpdate();
    }
}