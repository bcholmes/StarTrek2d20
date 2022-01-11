import * as React from 'react';

import { CharacterType } from '../common/characterType';
import { CheckBox } from './checkBox';
import { Department } from '../helpers/departments';
import { SpaceframeHelper, SpaceframeViewModel } from '../helpers/spaceframes';
import { System } from '../helpers/systems';

interface ISpaceframeSelectionProperties {
    serviceYear: number;
    type: CharacterType;
    initialSelection?: SpaceframeViewModel;
    onSelection: (s: SpaceframeViewModel) => void;
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

        const spaceframes = SpaceframeHelper.getSpaceframes(this.props.serviceYear, this.props.type, this.state.allowAllFrames);
        const frames = spaceframes.map((f, i) => {
            const systems = f.systems.map((s, si) => {
                return (
                    <tr key={si}>
                        <td>{System[si]}</td>
                        <td>{s}</td>
                    </tr>
                );
            });

            const departments = f.departments.map((d, di) => {
                return (
                    <tr key={di}>
                        <td>{Department[di]}</td>
                        <td>{d === 0 ? "-" : `+${d}`}</td>
                    </tr>
                );
            });

            const talents = f.talents.map((t, ti) => {
                if (t === null) {
                    console.log(f.name);
                }

                return t.isAvailableForServiceYear() ? (
                    <div key={ti}>{t.name}</div>
                ) : undefined;
            });

            return (
                <tr key={i}>
                    <td className="selection-header">{f.name}</td>
                    <td className="d=none d-md-table-cell"><table><tbody>{systems}</tbody></table></td>
                    <td className="d=none d-md-table-cell"><table><tbody>{departments}</tbody></table></td>
                    <td className="d=none d-md-table-cell" style={{ verticalAlign: "top" }}>{f.scale}</td>
                    <td className="d=none d-md-table-cell" style={{ verticalAlign: "top" }}>{talents}</td>
                    <td>
                        <CheckBox
                            isChecked={this.props.initialSelection != null && this.props.initialSelection.id === f.id}
                            text=""
                            value={f.id}
                            onChanged={(e) => { this.props.onSelection(f); } }/>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                {overrideCheckbox}
                <table className="selection-list w-100">
                    <thead>
                        <tr>
                            <td></td>
                            <td className="d=none d-md-table-cell">Systems</td>
                            <td className="d=none d-md-table-cell">Departments</td>
                            <td className="d=none d-md-table-cell">Scale</td>
                            <td className="d=none d-md-table-cell">Talents</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {frames}
                    </tbody>
                </table>
            </div>);
    }

}

export default SpaceframeSelection;