import * as React from 'react';
import {Department} from '../helpers/departments';
import { SpaceframeViewModel } from '../helpers/spaceframes';
import {System} from '../helpers/systems';

interface IStarshipStatsProperties {
    model: SpaceframeViewModel;
    type: string;
}

class StarshipStats extends React.Component<IStarshipStatsProperties, {}> {

    render() {
        let model = this.props.model;
        return (
            <table className="stats-block">
                <tr>
                    <td><div className="stat-name purple">Comms</div></td>
                    <td><div className="stat-value purple">{model.systems[System.Comms]}</div></td>
                    <td><div className="stat-name purple">Engines</div></td>
                    <td><div className="stat-value purple">{model.systems[System.Engines]}</div></td>
                    <td><div className="stat-name purple">Structure</div></td>
                    <td><div className="stat-value purple">{model.systems[System.Structure]}</div></td>
                </tr>
                <tr>
                    <td><div className="stat-name purple">Computers</div></td>
                    <td><div className="stat-value purple">{model.systems[System.Computer]}</div></td>
                    <td><div className="stat-name purple">Sensors</div></td>
                    <td><div className="stat-value purple">{model.systems[System.Sensors]}</div></td>
                    <td><div className="stat-name purple">Weapons</div></td>
                    <td><div className="stat-value purple">{model.systems[System.Weapons]}</div></td>
                </tr>
                <tr>
                    <td><div className="stat-name purple">Command</div></td>
                    <td><div className="stat-value purple">{this.formatAsDelta(model.departments[Department.Command])}</div></td>
                    <td><div className="stat-name purple">Security</div></td>
                    <td><div className="stat-value purple">{this.formatAsDelta(model.departments[Department.Security])}</div></td>
                    <td><div className="stat-name purple">Science</div></td>
                    <td><div className="stat-value purple">{this.formatAsDelta(model.departments[Department.Science])}</div></td>
                </tr>
                <tr>
                    <td><div className="stat-name purple">Conn</div></td>
                    <td><div className="stat-value purple">{this.formatAsDelta(model.departments[Department.Conn])}</div></td>
                    <td><div className="stat-name purple">Engineering</div></td>
                    <td><div className="stat-value purple">{this.formatAsDelta(model.departments[Department.Engineering])}</div></td>
                    <td><div className="stat-name purple">Medicine</div></td>
                    <td><div className="stat-value purple">{this.formatAsDelta(model.departments[Department.Medicine])}</div></td>
                </tr>
                <tr>
                    <td><div className="stat-name red">Scale</div></td>
                    <td><div className="stat-value red">{model.scale}</div></td>
                </tr>
            </table>
        );
    }

    formatAsDelta(value: number) {
        if (value && value > 0) {
            return "+" + value;
        } else if (value && value < 0) {
            return "" + value;
        } else if (value === 0) {
            return (<span>&ndash;</span>)
        } else {
            return (<span>&nbsp;</span>)
        }
    }
}

export default StarshipStats;