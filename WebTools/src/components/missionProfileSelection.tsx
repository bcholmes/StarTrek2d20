import * as React from 'react';

import { CharacterType } from '../common/characterType';
import { CheckBox } from './checkBox';
import { Department } from '../helpers/departments';
import { MissionProfile, MissionProfileHelper } from '../helpers/missionProfiles';

interface IMissionProfileSelectionProperties {
    type: CharacterType;
    initialSelection?: MissionProfile;
    onSelection: (s: MissionProfile) => void;
}

class MissionProfileSelection extends React.Component<IMissionProfileSelectionProperties, {}> {

    render() {
        const missionProfiles = MissionProfileHelper.getMissionProfiles(this.props.type).map((m, i) => {
            const departments = m.departments.map((d, di) => {
                return (
                    <tr key={di}>
                        <td>{Department[di]}</td>
                        <td>{d}</td>
                    </tr>
                );
            });

            const talents = m.talents.map((t, ti) => {
                return (<div key={ti}>{t.name}</div>);
            });

            return (
                <tr key={i}>
                    <td className="selection-header">{m.name}</td>
                    <td className="d=none d-md-table-cell"><table><tbody>{departments}</tbody></table></td>
                    <td className="d=none d-md-table-cell" style={{ verticalAlign: "top" }}>{talents}</td>
                    <td>
                        <CheckBox
                            isChecked={this.props.initialSelection === m.id}
                            text=""
                            value={m.id}
                            onChanged={() => { this.props.onSelection(m.id); } }/>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <table className="selection-list w-100">
                    <tbody>
                        <tr>
                            <td></td>
                            <td className="d=none d-md-table-cell">Departments</td>
                            <td className="d=none d-md-table-cell">Talent options</td>
                            <td></td>
                        </tr>
                        {missionProfiles}
                    </tbody>
                </table>
            </div>);
    }

}

export default MissionProfileSelection;