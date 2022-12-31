import * as React from 'react';
import {Window} from '../common/window';
import {Environment, EnvironmentsHelper} from '../helpers/environments';
import {Attribute} from '../helpers/attributes';
import {Skill} from '../helpers/skills';
import {Button} from './button';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';

interface IEnvironmentSelectionProperties extends WithTranslation {
    alternate: boolean;
    onSelection: (env: Environment, name: string) => void;
    onCancel: () => void;
}

class EnvironmentSelection extends React.Component<IEnvironmentSelectionProperties, {}> {
    render() {
        const { t } = this.props;
        let environments = this.props.alternate ? EnvironmentsHelper.getAlternateEnvironments() : EnvironmentsHelper.getEnvironments();
        var envs = environments.map((e, i) => {
            const attributes = e.attributes.map((a, i) => {
                return <div key={'attr-' + i}>{t(makeKey('Construct.attribute.', Attribute[a])) }</div>;
            });

            const disciplines = e.disciplines.map((d, i) => {
                return <div key={'skill-' + i}>{t(makeKey('Construct.discipline.', Skill[d]))}</div>;
            });

            return (
                <tr key={i}
                    onClick={() => { if (Window.isCompact()) this.props.onSelection(e.id, e.name); }}>
                    <td className="selection-header">{e.name}</td>
                    <td>{attributes}</td>
                    <td>{disciplines}</td>
                    <td className="text-right">
                        <Button className="button-small" onClick={() => { this.props.onSelection(e.id, e.name) } } buttonType={true} >{t('Common.button.select')}</Button>
                    </td>
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
                            <td><b>{t('Construct.other.attributes')} </b></td>
                            <td><b>{t('Construct.other.disciplines')}</b></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {envs}
                    </tbody>
                </table>
                <Button className="button button-cancel" onClick={() => this.props.onCancel() }>{t('Common.button.cancel')}</Button>
            </div>
        );
    }
}

export default withTranslation()(EnvironmentSelection);