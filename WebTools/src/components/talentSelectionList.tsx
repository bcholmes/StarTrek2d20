import * as React from 'react';
import {TalentViewModel} from '../helpers/talents';
import {CheckBox} from './checkBox';

interface ITalentSelectionListProperties {
    talents: TalentViewModel[];
    onSelection: (talent: TalentViewModel) => void;
}

interface ITalentSelectionListState {
    talentId?: string;
}

export class TalentSelectionList extends React.Component<ITalentSelectionListProperties, ITalentSelectionListState> {

    constructor(props: ITalentSelectionListProperties) {
        super(props);
        this.state = {
            talentId: undefined
        }
    }

    render() {
        const talents = this.props.talents.map((t, i) => {
            return (
                <tr key={i}>
                    <td className="selection-header-small">{t.displayName}</td>
                    <td>{t.description}</td>
                    <td>
                        <CheckBox
                            text=""
                            value={t.name}
                            isChecked={this.state.talentId === t.name}
                            onChanged={() => {
                                this.selectTalent(t);
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

    private selectTalent(talent: TalentViewModel) {
        this.setState((state) => ({
            ...state,
            talentId: talent.name
        }));
        this.props.onSelection(talent);
    }
}