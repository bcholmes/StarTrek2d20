import * as React from 'react';
import {Window} from '../common/window';
import {Environment, EnvironmentsHelper} from '../helpers/environments';
import {AttributesHelper} from '../helpers/attributes';
import {SkillsHelper} from '../helpers/skills';
import {Button} from './button';

interface IEnvironmentSelectionProperties {
    alternate: boolean;
    onSelection: (env: Environment, name: string) => void;
    onCancel: () => void;
}

export class EnvironmentSelection extends React.Component<IEnvironmentSelectionProperties, {}> {
    render() {
        let environments = this.props.alternate ? EnvironmentsHelper.getAlternateEnvironments() : EnvironmentsHelper.getEnvironments();
        var envs = environments.map((e, i) => {
            const attributes = e.attributes.map((a, i) => {
                return <div key={'attr-' + i}>{AttributesHelper.getAttributeName(a) }</div>;
            });

            const disciplines = e.disciplines.map((d, i) => {
                return <div key={'skill-' + i}>{SkillsHelper.getSkillName(d)}</div>;
            });

            return (
                <tr key={i}
                    onClick={() => { if (Window.isCompact()) this.props.onSelection(e.id, e.name); }}>
                    <td className="selection-header">{e.name}</td>
                    <td>{attributes}</td>
                    <td>{disciplines}</td>
                    <td className="text-right"><Button className="button-small" text="Select" onClick={() => { this.props.onSelection(e.id, e.name) } } buttonType={true} /></td>
                </tr>
            )
        });

        return (
            <div>
                <div className="header-text"><div>SELECT ENVIRONMENT</div></div>
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
                        {envs}
                    </tbody>
                </table>
                <Button text="Cancel" className="button button-cancel" onClick={() => this.props.onCancel() }/>
            </div>
        );
    }
}