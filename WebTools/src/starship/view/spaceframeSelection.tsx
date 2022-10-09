import * as React from 'react';

import { CharacterType } from '../../common/characterType';
import formatAsDelta from '../../common/formatAsDelta';
import { CheckBox } from '../../components/checkBox';
import { Department } from '../../helpers/departments';
import { SpaceframeHelper, SpaceframeModel } from '../../helpers/spaceframes';
import { System } from '../../helpers/systems';

interface ISpaceframeSelectionProperties {
    serviceYear: number;
    type: CharacterType;
    initialSelection?: SpaceframeModel;
    onSelection: (s: SpaceframeModel) => void;
}

interface ISpaceframeSelectionState {
    allowAllFrames: boolean
}

class SpaceframeSelection extends React.Component<ISpaceframeSelectionProperties, ISpaceframeSelectionState> {

    constructor(props: ISpaceframeSelectionProperties) {
        super(props);
        this.state = {
            allowAllFrames: false
        };
    }

    render() {
        let overrideCheckbox =(<CheckBox
            isChecked={this.state.allowAllFrames}
            text="Ignore end-of-service date (GM's decision)"
            value={!this.state.allowAllFrames}
            onChanged={(e) => { this.setState({ allowAllFrames: !this.state.allowAllFrames }); }} />);

        let spaceframes = SpaceframeHelper.getSpaceframes(this.props.serviceYear, this.props.type, this.state.allowAllFrames);
        spaceframes.sort((s1, s2) => {
            if (s1.name === s2.name) {
                return s2.id - s1.id;
            } else {
                return s1.name.localeCompare(s2.name);
            }
        })
        const frames = spaceframes.map((f, i) => {
            const talents = f.talents.map((t, ti) => {
                if (t === null) {
                    console.log(f.name);
                }

                return t.talent.isAvailableForServiceYear() ? (
                    <div key={ti} style={{ padding: "2px" }}>{t.description}</div>
                ) : undefined;
            });

            return (
                <tbody key={i}>
                    <tr>
                        <td className="selection-header" rowSpan={4}>{f.name}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Comms</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{f.systems[System.Comms]}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Engines</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{f.systems[System.Engines]}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Structure</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{f.systems[System.Structure]}</td>
                        <td className="d=none d-md-table-cell" style={{ verticalAlign: "top", textAlign: "center" }} rowSpan={4}>{f.scale}</td>
                        <td className="d=none d-md-table-cell" style={{ verticalAlign: "top" }} rowSpan={4}>{talents}</td>
                        <td rowSpan={4}>
                            <CheckBox
                                isChecked={this.props.initialSelection != null && this.props.initialSelection.id === f.id}
                                text=""
                                value={f.id}
                                onChanged={(e) => { this.props.onSelection(f); } }/>
                        </td>
                    </tr>
                    <tr>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Computers</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{f.systems[System.Computer]}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Sensors</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{f.systems[System.Sensors]}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Weapons</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{f.systems[System.Weapons]}</td>
                    </tr>
                    <tr>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Command</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(f.departments[Department.Command])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Security</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(f.departments[Department.Security])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Science</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(f.departments[Department.Science])}</td>
                    </tr>
                    <tr>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Conn</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(f.departments[Department.Conn])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Engineering</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(f.departments[Department.Engineering])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Medicine</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(f.departments[Department.Medicine])}</td>
                    </tr>
                </tbody>
            );
        });

        return (
            <div>
                {overrideCheckbox}
                <table className="selection-list w-100">
                    <thead>
                        <tr>
                            <td></td>
                            <td className="d=none d-md-table-cell" colSpan={6}>Stats</td>
                            <td className="d=none d-md-table-cell">Scale</td>
                            <td className="d=none d-md-table-cell">Talents</td>
                            <td></td>
                        </tr>
                    </thead>
                    {frames}
                </table>
            </div>);
    }
}

export default SpaceframeSelection;