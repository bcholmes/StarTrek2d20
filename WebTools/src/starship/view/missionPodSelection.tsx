import * as React from 'react';

import { CheckBox } from '../../components/checkBox';
import { System } from '../../helpers/systems';
import { Department } from '../../helpers/departments';
import formatAsDelta from '../../common/formatAsDelta';
import { Starship } from '../../common/starship';
import { MissionPodHelper, MissionPodModel } from '../../helpers/missionPods';
import { withTranslation, WithTranslation } from 'react-i18next';

interface IMissionPodSelectionProperties extends WithTranslation {
    initialSelection?: MissionPodModel;
    starship: Starship;
    onSelection: (s: MissionPodModel) => void;
}

class MissionPodSelection extends React.Component<IMissionPodSelectionProperties, {}> {

    render() {
        const { t } = this.props;
        const missionProfiles = MissionPodHelper.instance().getMissionPods(this.props.starship).map((p, i) => {
            const talents = p.talents.map((t, ti) => {
                return (
                    <div key={ti} style={{padding: "2px"}}>{t.name}</div>
                );
            });
            return (
                <tbody key={i}>
                    <tr>
                        <td className="selection-header" rowSpan={4}>{p.localizedName}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.system.comms')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.systems[System.Comms])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.system.engines')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.systems[System.Engines])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.system.structure')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.systems[System.Structure])}</td>
                        <td className="d=none d-md-table-cell" style={{ verticalAlign: "top", paddingLeft: "0.75rem" }} rowSpan={4}>{talents}</td>
                        <td rowSpan={4}>
                            <CheckBox
                                isChecked={this.props.initialSelection != null && this.props.initialSelection.id === p.id}
                                text=""
                                value={p.id}
                                onChanged={(val) => { this.props.onSelection(p); } }/>
                        </td>
                    </tr>
                    <tr>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.system.computer')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.systems[System.Computer])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.system.sensors')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.systems[System.Sensors])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.system.weapons')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.systems[System.Weapons])}</td>
                    </tr>
                    <tr>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.department.command')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.departments[Department.Command])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.department.security')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.departments[Department.Security])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.department.science')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.departments[Department.Science])}</td>
                    </tr>
                    <tr>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.department.conn')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.departments[Department.Conn])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.department.engineering')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.departments[Department.Engineering])}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "right" }}>{t('Construct.department.medicine')}</td>
                        <td className="d=none d-md-table-cell" style={{ textAlign: "center" }}>{formatAsDelta(p.departments[Department.Medicine])}</td>
                    </tr>

                </tbody>
            );
        })

        return (
            <div>
                <table className="selection-list w-100">
                    <thead>
                        <tr>
                            <td></td>
                            <td className="d=none d-md-table-cell" colSpan={6}>{t('Construct.other.stats')}</td>
                            <td className="d=none d-md-table-cell" style={{paddingLeft: "0.75rem"}}>{t('Construct.other.talents')}</td>
                            <td></td>
                        </tr>
                    </thead>
                    {missionProfiles}
                </table>
            </div>);
    }
}

export default withTranslation()(MissionPodSelection);