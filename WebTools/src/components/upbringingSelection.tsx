import * as React from 'react';
import {character} from '../common/character';
import {Window} from '../common/window';
import {Upbringing, UpbringingsHelper} from '../helpers/upbringings';
import {AttributesHelper} from '../helpers/attributes';
import {SkillsHelper} from '../helpers/skills';
import {Button} from './button';

interface IUpbringingSelectionProperties {
    onSelection: (upbringing: Upbringing) => void;
    onCancel: () => void;
}

export class UpbringingSelection extends React.Component<IUpbringingSelectionProperties, {}> {
    render() {
        var upbringings = UpbringingsHelper.getUpbringings().map((u, i) => {
            const disciplines = u.disciplines.map((d, i) => {
                return <div key={i}>{SkillsHelper.getSkillName(d) }</div>;
            });

            if (Window.isCompact()) {
                return (
                    <tr key={i} onClick={() => { this.props.onSelection(u.id); } }>
                        <td className="selection-header">{u.name}</td>
                        <td>
                            ACCEPT<br/>
                            <div>{AttributesHelper.getAttributeName(u.attributeAcceptPlus2) } +2</div>
                            <div>{AttributesHelper.getAttributeName(u.attributeAcceptPlus1) } +1</div>
                            <br/>
                            REBEL<br/>
                            <div>{AttributesHelper.getAttributeName(u.attributeRebelPlus2) } +2</div>
                            <div>{AttributesHelper.getAttributeName(u.attributeRebelPlus1) } +1</div>
                        </td>
                        <td>{disciplines}</td>
                    </tr>
                )
            }
            else {
                return (
                    <tr key={i}>
                        <td className="selection-header">{u.name}</td>
                        <td>
                            <div>{AttributesHelper.getAttributeName(u.attributeAcceptPlus2) } +2</div>
                            <div>{AttributesHelper.getAttributeName(u.attributeAcceptPlus1) } +1</div>
                        </td>
                        <td>
                            <div>{AttributesHelper.getAttributeName(u.attributeRebelPlus2) } +2</div>
                            <div>{AttributesHelper.getAttributeName(u.attributeRebelPlus1) } +1</div>
                        </td>
                        <td>{disciplines}</td>
                        <td><Button className="button-small" text="Select" onClick={() => { this.props.onSelection(u.id) } } /></td>
                    </tr>
                )
            }
        });

        const selectionHeaders = Window.isCompact()
            ? (
                <tr>
                    <td></td>
                    <td><b>Attributes</b></td>
                    <td><b>Disciplines</b></td>
                    <td></td>
                </tr>
              )
            : (
                <tr>
                    <td></td>
                    <td><b>Accept</b></td>
                    <td><b>Rebel</b></td>
                    <td><b>Disciplines</b></td>
                    <td></td>
                </tr>
              );

        var title = "Select " + character.workflow.currentStep().name;
        return (
            <div>
                <div className="header-text"><div>{title}</div></div>
                <table className="selection-list">
                    <thead>
                        {selectionHeaders}
                    </thead>
                    <tbody>
                        {upbringings}
                    </tbody>
                </table>
                <Button text="Cancel" className="button button-cancel" onClick={() => this.props.onCancel() }/>
            </div>
        );
    }
}
