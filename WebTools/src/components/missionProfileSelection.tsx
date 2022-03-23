import * as React from 'react';

import { CharacterType } from '../common/characterType';
import { CheckBox } from './checkBox';
import { Department } from '../helpers/departments';
import { MissionProfile, MissionProfileHelper, MissionProfileViewModel } from '../helpers/missionProfiles';

interface IMissionProfileSelectionProperties {
    type: CharacterType;
    initialSelection?: MissionProfile;
    onSelection: (s: MissionProfileViewModel) => void;
}

class MissionProfileSelection extends React.Component<IMissionProfileSelectionProperties, {}> {

    render() {
        const missionProfiles = MissionProfileHelper.getMissionProfiles(this.props.type).map((m, i) => {
            const talents = m.talents.map((t, ti) => {
                return (<div key={ti} style={{ padding: "2px"}}>{t.name}</div>);
            });

            return (
                <tbody key={i}>
                    <tr>
                        <td className="selection-header" rowSpan={2}>{m.name}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Command</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{m.departments[Department.Command]}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Security</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{m.departments[Department.Security]}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Science</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{m.departments[Department.Science]}</td>
                        <td className="d=none d-md-table-cell" style={{ verticalAlign: "top", paddingLeft: "0.75rem" }} rowSpan={2}><div style={{minHeight: "80px" }}>{talents}</div></td>
                        <td rowSpan={2}>
                            <CheckBox
                                isChecked={this.props.initialSelection === m.id}
                                text=""
                                value={m.id}
                                onChanged={() => { this.props.onSelection(m); } }/>
                        </td>
                    </tr>
                    <tr>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Conn</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{m.departments[Department.Conn]}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Engineering</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{m.departments[Department.Engineering]}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>Medicine</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{m.departments[Department.Medicine]}</td>
                    </tr>
                </tbody>
            );
        });

        return (
            <div>
                <table className="selection-list w-100">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="d=none d-md-table-cell" style={{ textAlign: "left"}} colSpan={6}>Departments</th>
                            <th className="d=none d-md-table-cell" style={{ textAlign: "left",  paddingLeft: "0.75rem"}}>Talent options</th>
                            <th></th>
                        </tr>
                    </thead>
                    {missionProfiles}
                </table>
            </div>);
    }

}

export default MissionProfileSelection;