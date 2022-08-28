import * as React from 'react';
import {CheckBox} from './checkBox';
import {TalentViewModel} from '../helpers/talents';
import replaceDiceWithArrowhead from '../common/arrowhead';
import { Construct } from '../common/construct';

interface ITalentSelectionProperties {
    talents: TalentViewModel[]
    points: number;
    construct: Construct;
    onSelection: (talents: TalentViewModel[]) => void;
}

interface ITalentSelectionState {
    selectedTalents: string[]
}

export class TalentSelectionList extends React.Component<ITalentSelectionProperties, ITalentSelectionState> {

    static defaultProps = {
        points: 1
    };

    constructor(props: ITalentSelectionProperties) {
        super(props);

        this.state = {
            selectedTalents: []
        };
    }

    componentDidUpdate(prevProps: Readonly<ITalentSelectionProperties>, prevState: Readonly<ITalentSelectionState>, snapshot?: any): void {
        let temp = this.state.selectedTalents;
        let allSelections = [];
        this.props.talents.forEach(t => {
            if (temp.indexOf(t.name) >= 0) {
                allSelections.push(t);
            }
        });
        // did something get deleted?
        if (temp.length !== allSelections.length) {
            this.setState((state) => ({
                ...state,
                selectedTalents: allSelections.map(t => t.name) 
            }));
            this.props.onSelection(allSelections);
        }
    }

    createTalentList() {
        let result: TalentViewModel[] = [];
        this.props.talents.forEach(t => {
            if (t.name === 'Advanced Sensor Suites') {
                console.log("Advanced Sensor Suites: " + t.rank);
            }
            if (t.rank > 1 || this.state.selectedTalents.indexOf(t.name) >= 0 || !this.props.construct.hasTalent(t.name)) {
                result.push(t);

                if (t.rank > 1 && this.state.selectedTalents.indexOf(t.name) >= 0 && this.props.points > 1) {
                    result.push(t);
                }
            }
        });
        return result;
    }


    render() {
        const talentList = this.createTalentList()

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
                            isChecked={this.state.selectedTalents.indexOf(t.name) > -1}
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
        let allSelections = this.state.selectedTalents;

        if (allSelections.indexOf(talent.name) > -1) {
            allSelections.splice(allSelections.indexOf(talent.name), 1);
        } else {
            allSelections.push(talent.name);
        }

        if (allSelections.length > this.props.points) {
            allSelections.splice(0, 1);
        }

        const talents = this.props.talents.filter(t => allSelections.indexOf(t.name) >= 0);

        this.props.onSelection(talents);

        this.setState((state) => ({
            ...state,
            selectedTalents: allSelections 
        }));
    }
}