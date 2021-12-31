import * as React from 'react';
import {Skill} from '../helpers/skills';
import {TalentViewModel, TalentsHelper} from '../helpers/talents';
import {CheckBox} from './checkBox';

interface ITalentListProperties {
    skills: Skill[];
    onSelection: (talent: string) => void;
}

export class TalentList extends React.Component<ITalentListProperties, {}> {
    private _talents: TalentViewModel[];
    private _talent: string;

    constructor(props: ITalentListProperties) {
        super(props);

        this._talents = TalentsHelper.getTalentsForSkills(this.props.skills)
            .sort((a, b) => {
                return a.name.localeCompare(b.name)
            });

    }

    componentWillReceiveProps(props: ITalentListProperties) {
        this._talents = TalentsHelper.getTalentsForSkills(this.props.skills)
            .sort((a, b) => {
                return a.name.localeCompare(b.name)
            });
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