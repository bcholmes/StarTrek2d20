import * as React from 'react';
import {Window} from '../common/window';
import {Environment, EnvironmentsHelper} from '../helpers/environments';
import {Attribute} from '../helpers/attributes';
import {Skill} from '../helpers/skills';
import {Button} from './button';
import { withTranslation, WithTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';
import { Character } from '../common/character';
import { Species } from '../helpers/speciesEnum';
import { SpeciesHelper } from '../helpers/species';

interface IEnvironmentSelectionProperties extends WithTranslation {
    alternate: boolean;
    character: Character;
    onSelection: (env: Environment, speciesId?: Species) => void;
    onCancel: () => void;
}

class EnvironmentSelection extends React.Component<IEnvironmentSelectionProperties, {}> {
    render() {
        const { t, character } = this.props;
        let environments = this.props.alternate ? EnvironmentsHelper.getEnvironmentConditions() : EnvironmentsHelper.getEnvironments(character.type);
        var envs = environments.map((e, i) => {
            const attributes = e.getAttributesForCharacter(character).map((a, i) => {
                return <div key={'attr-' + i}>{t(makeKey('Construct.attribute.', Attribute[a])) }</div>;
            });

            const disciplines = e.disciplines.map((d, i) => {
                return <div key={'skill-' + i}>{t(makeKey('Construct.discipline.', Skill[d]))}</div>;
            });

            // this is kind of awful...
            let otherSpeciesWorldName = e.name.indexOf("(") >= 0 ? e.name.substring(e.name.indexOf("(") + 1, e.name.indexOf(")")) : undefined;
            let otherSpecies = otherSpeciesWorldName ? SpeciesHelper.getSpeciesByName(otherSpeciesWorldName) : undefined;

            return (
                <tr key={i}
                    onClick={() => { if (Window.isCompact()) this.props.onSelection(e.id, otherSpecies); }}>
                    <td className="selection-header">{e.localizedName}</td>
                    <td>{attributes}</td>
                    <td>{disciplines}</td>
                    <td className="text-right">
                        <Button className="button-small" onClick={() => { this.props.onSelection(e.id, otherSpecies) } } buttonType={true} >{t('Common.button.select')}</Button>
                    </td>
                </tr>
            )
        });

        return (
            <div>
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