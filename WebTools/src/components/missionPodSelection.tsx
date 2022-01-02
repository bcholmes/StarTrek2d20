import * as React from 'react';

import { CheckBox } from './checkBox';
import { System } from '../helpers/systems';
import { Department } from '../helpers/departments';
import { MissionPod, SpaceframeHelper } from '../helpers/spaceframes';

interface IMissionPodSelectionProperties {
    initialSelection?: MissionPod;
    onSelection: (s: MissionPod) => void;
}

class MissionPodSelection extends React.Component<IMissionPodSelectionProperties, {}> {

    render() {
        const missionProfiles = SpaceframeHelper.getMissionPods().map((p, i) => {
            const systems = p.systems.map((s, si) => {
                return (
                    <tr key={si}>
                        <td>{System[si]}</td>
                        <td>{s}</td>
                    </tr>
                );
            });

            const departments = p.departments.map((d, di) => {
                return (
                    <tr key={di}>
                        <td>{Department[di]}</td>
                        <td>{d === 0 ? "-" : `+${d}`}</td>
                    </tr>
                );
            });

            const talents = p.talents.map((t, ti) => {
                if (t === null) {
                    console.log(t.name);
                }

                return (
                    <div key={ti}>{t.name}</div>
                );
            });
            return (
                <tr key={i}>
                    <td className="selection-header">{p.name}</td>
                    <td><table><tbody>{systems}</tbody></table></td>
                    <td><table><tbody>{departments}</tbody></table></td>
                    <td style={{ verticalAlign: "top" }}>{talents}</td>
                    <td>
                        <CheckBox
                            isChecked={this.props.initialSelection === p.id}
                            text=""
                            value={p.id}
                            onChanged={(val) => { this.props.onSelection(p.id); } }/>
                    </td>
                </tr>
            );
        })

        return (
            <div>
                <table className="selection-list w-100">
                    <thead>
                        <tr>
                            <td></td>
                            <td>Systems</td>
                            <td>Departments</td>
                            <td>Talents</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {missionProfiles}
                    </tbody>
                </table>
            </div>);
    }

}

export default MissionPodSelection;