import * as React from 'react';
import {CheckBox} from './checkBox';
import {TalentViewModel} from '../helpers/talents';
import replaceDiceWithArrowhead from '../common/arrowhead';
import { Construct } from '../common/construct';

interface ISingleTalentSelectionProperties {
    talents: TalentViewModel[]
    construct: Construct;
    onSelection: (talent?: TalentViewModel) => void;
}

interface ISingleTalentSelectionState {
    selection?: string
}

export class SingleTalentSelectionList extends React.Component<ISingleTalentSelectionProperties, ISingleTalentSelectionState> {

    constructor(props: ISingleTalentSelectionProperties) {
        super(props);

        this.state = {
            selection: undefined
        };
    }

    componentDidUpdate(prevProps: Readonly<ISingleTalentSelectionProperties>, prevState: Readonly<ISingleTalentSelectionState>, snapshot?: any): void {
        let temp = this.state.selection;
        let selection = undefined;
        this.props.talents.forEach(t => {
            if (temp === t.name) {
                selection = temp;
            }
        });
        // did something get unselected?
        if (selection == null && temp != null) {
            this.setState((state) => ({
                ...state,
                selection: undefined 
            }));
            this.props.onSelection(undefined);
        }
    }

    render() {
        const talentList = this.props.talents;

        const talents = talentList.map((t, i) => {
            let prerequisites = undefined;
            t.prerequisites.forEach((p) => {
                let desc = p.describe();
                if (desc) {
                    if (prerequisites == null) {
                        prerequisites = desc;
                    } else {
                        prerequisites += (", " + desc);
                    }
                }
            });
            if (prerequisites) {
                prerequisites = (<div style={{ fontWeight: "bold" }}>{prerequisites}</div>);
            }
            return (
                <tr key={i}>
                    <td className="selection-header-small">{t.displayName}</td>
                    <td>{replaceDiceWithArrowhead(t.description)} {prerequisites}</td>
                    <td>
                        <CheckBox
                            text=""
                            value={t.name}
                            isChecked={this.state.selection === t.name}
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
        let selection = this.state.selection;

        if (selection === talent.name) {
            selection = undefined;
            this.props.onSelection(undefined);
        } else {
            selection = talent.name;
            this.props.onSelection(talent);
        }

        this.setState((state) => ({
            ...state,
            selection: selection 
        }));
    }
}