import * as React from 'react';
import formatAsDelta from '../common/formatAsDelta';
import {Department} from '../helpers/departments';
import { MissionProfileViewModel } from '../helpers/missionProfiles';
import { MissionPodViewModel, SpaceframeViewModel } from '../helpers/spaceframes';
import {System} from '../helpers/systems';

interface IStarshipStatsProperties {
    model: SpaceframeViewModel|MissionProfileViewModel|MissionPodViewModel;
    type: string;
}

class StarshipStats extends React.Component<IStarshipStatsProperties, {}> {

    render() {
        if (this.props.type === 'spaceframe') {
            return this.renderAsSpaceframe();
        } else if (this.props.type === 'missionProfile') {
            return this.renderAsMissionProfile();
        } else if (this.props.type === 'missionPod') {
            return this.renderAsMissionPod();
        }
    }

    renderAsSpaceframe() {
        let model = this.props.model as SpaceframeViewModel;
        return (
            <div className="stats-block">
                <div className="stats-row">
                    <div className="stat">
                        <div className="stat-name purple">Comms</div>
                        <div className="stat-value purple">{model.systems[System.Comms]}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Engines</div>
                        <div className="stat-value purple">{model.systems[System.Engines]}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Structure</div>
                        <div className="stat-value purple">{model.systems[System.Structure]}</div>
                    </div>
                </div>
                <div className="stats-row">
                    <div className="stat">
                        <div className="stat-name purple">Computers</div>
                        <div className="stat-value purple">{model.systems[System.Computer]}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Sensors</div>
                        <div className="stat-value purple">{model.systems[System.Sensors]}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Weapons</div>
                        <div className="stat-value purple">{model.systems[System.Weapons]}</div>
                    </div>
                </div>
                <div className="stats-row pt-2">
                    <div className="stat">
                        <div className="stat-name purple">Command</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Command])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Security</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Security])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Science</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Science])}</div>
                    </div>
                </div>
                <div className="stats-row">
                    <div className="stat">
                        <div className="stat-name purple">Conn</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Conn])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Engineering</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Engineering])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Medicine</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Medicine])}</div>
                    </div>
                </div>
                <div className="stats-row pt-2">
                    <div className="stat">
                        <div className="stat-name red">Scale</div>
                        <div className="stat-value red">{model.scale}</div>
                    </div>
                </div>
            </div>
        );
    }

    renderAsMissionPod() {
        let model = this.props.model as MissionPodViewModel;
        return (
            <div className="stats-block">
                <div className="stats-row">
                    <div className="stat">
                        <div className="stat-name purple">Comms</div>
                        <div className="stat-value purple">{formatAsDelta(model.systems[System.Comms])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Engines</div>
                        <div className="stat-value purple">{formatAsDelta(model.systems[System.Engines])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Structure</div>
                        <div className="stat-value purple">{formatAsDelta(model.systems[System.Structure])}</div>
                    </div>
                </div>
                <div className="stats-row">
                    <div className="stat">
                        <div className="stat-name purple">Computers</div>
                        <div className="stat-value purple">{formatAsDelta(model.systems[System.Computer])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Sensors</div>
                        <div className="stat-value purple">{formatAsDelta(model.systems[System.Sensors])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Weapons</div>
                        <div className="stat-value purple">{formatAsDelta(model.systems[System.Weapons])}</div>
                    </div>
                </div>
                <div className="stats-row pt-2">
                    <div className="stat">
                        <div className="stat-name purple">Command</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Command])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Security</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Security])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Science</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Science])}</div>
                    </div>
                </div>
                <div className="stats-row">
                    <div className="stat">
                        <div className="stat-name purple">Conn</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Conn])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Engineering</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Engineering])}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Medicine</div>
                        <div className="stat-value purple">{formatAsDelta(model.departments[Department.Medicine])}</div>
                    </div>
                </div>
            </div>
        );
    }
    renderAsMissionProfile() {
        let model = this.props.model as MissionProfileViewModel;
        return (
            <div className="stats-block">
                <div className="stats-row pt-2">
                    <div className="stat">
                        <div className="stat-name purple">Command</div>
                        <div className="stat-value purple">{model.departments[Department.Command]}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Security</div>
                        <div className="stat-value purple">{model.departments[Department.Security]}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Science</div>
                        <div className="stat-value purple">{model.departments[Department.Science]}</div>
                    </div>
                </div>
                <div className="stats-row">
                    <div className="stat">
                        <div className="stat-name purple">Conn</div>
                        <div className="stat-value purple">{model.departments[Department.Conn]}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Engineering</div>
                        <div className="stat-value purple">{model.departments[Department.Engineering]}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-name purple">Medicine</div>
                        <div className="stat-value purple">{model.departments[Department.Medicine]}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StarshipStats;