import * as React from 'react';
import {CheckBox} from '../../components/checkBox';
import {TalentViewModel} from '../../helpers/talents';
import replaceDiceWithArrowhead from '../../common/arrowhead';
import { Construct } from '../../common/construct';

interface IStarshipTalentSelectionProperties {
    talents: TalentViewModel[]
    points: number;
    construct: Construct;
    onSelection: (talents: TalentViewModel[]) => void;
}

interface IStarshipTalentSelectionState {
    selectedTalents: string[]
}

class StarshipTalentOption {
    public talent: TalentViewModel;
    public repeat: number;

    constructor(talent: TalentViewModel, repeat: number) {
        this.talent = talent;
        this.repeat = repeat;
    }
}

export class StarshipTalentSelectionList extends React.Component<IStarshipTalentSelectionProperties, IStarshipTalentSelectionState> {

    static defaultProps = {
        points: 1
    };

    constructor(props: IStarshipTalentSelectionProperties) {
        super(props);

        this.state = {
            selectedTalents: []
        };
    }

    componentDidUpdate(prevProps: Readonly<IStarshipTalentSelectionProperties>, prevState: Readonly<IStarshipTalentSelectionState>, snapshot?: any): void {
        let temp = [...this.state.selectedTalents];
        this.props.talents.forEach(t => {
            while (temp.indexOf(t.name) >= 0) {
                temp.splice(temp.indexOf(t.name), 1);
            }
        });

        // did something get deleted?
        if (temp.length > 0 || this.state.selectedTalents.length > this.props.points) {
            let newValues = [...this.state.selectedTalents];
            temp.forEach(t => {
                while (newValues.indexOf(t) >= 0) {
                    newValues.splice(newValues.indexOf(t), 1);
                }
            });

            while (newValues.length > this.props.points) {
                newValues.splice(0, 1);
            }
    
            this.setState((state) => ({...state, selectedTalents: newValues }));
            this.invokeCallback(newValues);
        }
    }

    countSelections(talentName: string) {
        return this.state.selectedTalents.filter(t => t === talentName).length;
    }

    createTalentList() {
        let result: StarshipTalentOption[] = [];
        this.props.talents.forEach(t => {
            if (t.hasRank || this.state.selectedTalents.indexOf(t.name) >= 0 || !this.props.construct.hasTalent(t.name)) {
                result.push(new StarshipTalentOption(t, 1));

                if (t.hasRank) {
                    for (let i = 0, length = this.countSelections(t.name); i < Math.min(length, this.props.points-1); i++) {
                        result.push(new StarshipTalentOption(t, i+2));
                    }
                }
            }
        });
        return result;
    }

    isSelected(option: StarshipTalentOption) {
        let selections = this.state.selectedTalents.filter(t => t === option.talent.name);
        return selections.length > 0 && option.repeat <= selections.length;
    }

    render() {
        const talentList = this.createTalentList()

        const talents = talentList.map((t, i) => {
            let prerequisites = undefined;
            t.talent.prerequisites.forEach((p) => {
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
                    <td className="selection-header-small">{t.talent.displayName}</td>
                    <td>{replaceDiceWithArrowhead(t.talent.description)} {prerequisites}</td>
                    <td>
                        <CheckBox
                            text=""
                            value={t.talent.name}
                            isChecked={this.isSelected(t)}
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

    private selectTalent(option: StarshipTalentOption) {
        let allSelections = this.state.selectedTalents;

        if (this.isSelected(option)) {
            allSelections.splice(allSelections.indexOf(option.talent.name), 1);
        } else {
            allSelections.push(option.talent.name);
        }

        if (allSelections.length > this.props.points) {
            allSelections.splice(0, 1);
        }

        this.invokeCallback(allSelections);

        this.setState((state) => ({
            ...state,
            selectedTalents: allSelections 
        }));
    }

    invokeCallback(selections: string[]) {
        let talents: TalentViewModel[] = [];
        this.props.talents.forEach(t => {
            let count = selections.filter(s => s === t.name).length;
            for (let i = 0; i < count; i++) {
                talents.push(t);
            }
        });
        this.props.onSelection(talents);
    }
}