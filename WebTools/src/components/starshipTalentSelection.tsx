import * as React from 'react';
import {character} from '../common/character';
import {CheckBox} from './checkBox';
import {TalentsHelper} from '../helpers/talents';

interface ITalentSelectionProperties {
    filter: string[];
    points: number;
    onSelection: (talents: string[]) => void;
}

export class StarshipTalentSelection extends React.Component<ITalentSelectionProperties, {}> {
    private _talents: string[];

    constructor(props: ITalentSelectionProperties) {
        super(props);

        this._talents = [];
    }

    render() {
        const talents = TalentsHelper.getStarshipTalents()
            .filter(t => this.props.filter.indexOf(t.name) === -1)
            .map((t, i) => {
            return (
                <tr key={i}>
                    <td className="selection-header">{t.name}</td>
                    <td>{t.description}</td>
                    <td>
                        <CheckBox
                            text=""
                            value={t.name}
                            isChecked={this._talents.indexOf(t.name) > -1}
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
        if (this._talents.indexOf(talent) > -1) {
            this._talents.splice(this._talents.indexOf(talent), 1);
        }
        else {
            this._talents.push(talent);
        }

        if (this._talents.length > this.props.points) {
            this._talents.splice(0, 1);
        }

        this.props.onSelection(this._talents);

        this.forceUpdate();
    }
}