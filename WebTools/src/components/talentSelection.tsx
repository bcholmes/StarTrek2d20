import * as React from 'react';
import {character} from '../common/character';
import {SkillsHelper} from '../helpers/skills';
import {TalentViewModel, TalentsHelper} from '../helpers/talents';
import {DropDownInput} from './dropDownInput';
import {CheckBox} from './checkBox';

interface ITalentSelectionProperties {
    onSelection: (talent: string) => void;
}

export class TalentSelection extends React.Component<ITalentSelectionProperties, {}> {
    private _talents: TalentViewModel[];
    private _talent: string;
    private _index: number;

    constructor(props: ITalentSelectionProperties) {
        super(props);

        this._talents = TalentsHelper.getTalentsForSkills(SkillsHelper.getSkills())
            .sort((a, b) => {
                return a.name.localeCompare(b.name);
            });

        this._talent = this._talents[0].name;
        this._index = 0;
    }

    render() {
        const talents = this._talents.map((t, i) => {
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