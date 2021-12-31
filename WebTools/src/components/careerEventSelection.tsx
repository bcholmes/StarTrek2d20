import * as React from 'react';
import {Window} from '../common/window';
import {CareerEventsHelper} from '../helpers/careerEvents';
import {AttributesHelper} from '../helpers/attributes';
import {SkillsHelper} from '../helpers/skills';
import {Button} from './button';

interface ICareerEventSelectionProperties {
    onSelection: (event: number) => void;
    onCancel: () => void;
}

export class CareerEventSelection extends React.Component<ICareerEventSelectionProperties, {}> {
    render() {
        var events = CareerEventsHelper.getCareerEvents().map((e, i) => {
            const attributes = e.attributes.map((a, i) => {
                return <div key={i}>{AttributesHelper.getAttributeName(a) }</div>
            });

            const disciplines = e.disciplines.map((d, i) => {
                return <div key={i}>{SkillsHelper.getSkillName(d) }</div>;
            });

            return (
                <tr key={i}
                    onClick={() => { if (Window.isCompact()) this.props.onSelection(e.roll); } }>
                    <td className="selection-header">{e.name}</td>
                    <td>{attributes}</td>
                    <td>{disciplines}</td>
                    <td><Button className="button-small" text="Select" onClick={() => { this.props.onSelection(e.roll) } } /></td>
                </tr>
            )
        });

        return (
            <div>
                <div className="header-text"><div>SELECT CAREER EVENT</div></div>
                <table className="selection-list">
                    <thead>
                        <tr>
                            <td></td>
                            <td><b>Attributes</b></td>
                            <td><b>Disciplines</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {events}
                    </tbody>
                </table>
                <Button text="Cancel" className="button button-cancel" onClick={() => this.props.onCancel() }/>
            </div>
        );
    }
}