import React from 'react';
import {CheckBox} from './checkBox';
import {TalentViewModel} from '../helpers/talents';
import replaceDiceWithArrowhead from '../common/arrowhead';
import { Construct } from '../common/construct';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ITalent } from '../helpers/italent';

interface ISingleTalentSelectionProperties extends WithTranslation {
    talents: TalentViewModel[]
    construct: Construct;
    initialSelection?: ITalent;
    onSelection: (talent?: TalentViewModel) => void;
}

interface ISingleTalentSelectionState {
    selection?: string
}

class SingleTalentSelectionList extends React.Component<ISingleTalentSelectionProperties, ISingleTalentSelectionState> {

    constructor(props: ISingleTalentSelectionProperties) {
        super(props);

        this.state = {
            selection: (this.props.initialSelection ? this.props.initialSelection.name : undefined)
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
        const { talents } = this.props;

        const talentList = talents.map((t, i) => {
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

            let lines = t.description.split('\n').map((l, i) => {
                return (<div className={i === 0 ? '' : 'mt-2'} key={'d-' + i}>{replaceDiceWithArrowhead(l)}</div>);
            })

            return (
                <tr key={i}>
                    <td className="selection-header-small">{t.displayName}</td>
                    <td>{lines} {prerequisites}</td>
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
                    {talentList}
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

export default withTranslation()(SingleTalentSelectionList);