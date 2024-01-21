import React, { useState } from 'react';
import {Window} from '../common/window';
import {SpeciesHelper} from '../helpers/species';
import {AttributesHelper} from '../helpers/attributes';
import {CheckBox} from './checkBox';
import {Button} from './button';
import { Species } from '../helpers/speciesEnum';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { Header } from './header';
import { connect } from 'react-redux';
import store from '../state/store';
import { setCharacterSpecies } from '../state/characterActions';
import { useTranslation } from 'react-i18next';
import { Dialog } from './dialog';
import { Navigation } from '../common/navigator';
import { PageIdentity } from '../pages/pageIdentity';


const MixedSpeciesSelection: React.FC<ICharacterProperties> = ({character}) => {

    const { t } = useTranslation();
    const [primarySpecies, setPrimarySpecies] = useState(character?.speciesStep?.species === Species.Custom ? undefined : character?.speciesStep?.species as Species);
    const [secondarySpecies, setSecondarySpecies] = useState(character?.speciesStep?.mixedSpecies);

    const assignSecondarySepecies = (species: Species) => {
        setSecondarySpecies(species);

        if (primarySpecies != null) {
            let speciesModel = SpeciesHelper.getSpeciesByType(primarySpecies);
            let attributes = speciesModel.attributes?.length > 3 ? undefined : speciesModel.attributes;
            store.dispatch(setCharacterSpecies(primarySpecies, character?.speciesStep?.attributes ?? attributes, species));
        }
    }

    const assignPrimarySepecies = (species: Species) => {
        setPrimarySpecies(species);

        let speciesModel = SpeciesHelper.getSpeciesByType(species);
        let attributes = speciesModel.attributes?.length > 3 ? undefined : speciesModel.attributes;
        store.dispatch(setCharacterSpecies(species, character?.speciesStep?.attributes ?? attributes, secondarySpecies));
    }


    const primarySpeciesRows = SpeciesHelper.getPrimarySpecies(character.type, true, character).map((s, i) => {
        if (s.id === secondarySpecies) return undefined;

        const attributes = s.attributes.map((a, i) => {
            return <div>{AttributesHelper.getAttributeName(a) }</div>;
        });

        const talents = s.talents.map((t, i) => {
            return <div>{t.name}</div>;
        });

        const checkbox = !Window.isCompact()
                ? (<CheckBox
                    key={i}
                    isChecked={primarySpecies === s.id}
                    onChanged={(val) => assignPrimarySepecies(val)  }
                    value={s.id} />)
                : undefined;

        const rowBackground = Window.isCompact() && primarySpecies === s.id
            ? "#9179B7"
            : "";

        return (
            <tr key={'primary-' + s.id}
                style={{backgroundColor:rowBackground}}
                onClick={() => { if (Window.isCompact()) { assignPrimarySepecies(s.id) } } }>
                <td className="selection-header">{s.name}</td>
                <td>{attributes}</td>
                <td>{talents}</td>
                <td>{checkbox}</td>
            </tr>
        );
    });

    const secondarySpeciesRows = SpeciesHelper.getSpecies(character.type)
        .filter(s => s.id !== Species.LiberatedBorg && s.id !== Species.Borg && s.id !== Species.Kobali && s.id !== Species.CyberneticallyEnhanced)
        .map((s, i) => {
        if (s.id === primarySpecies) return undefined;

        const attributes = s.attributes.map((a, i) => {
            return <div>{AttributesHelper.getAttributeName(a) }</div>;
        });

        const talents = s.talents.map((t, i) => {
            return <div>{t.name}</div>;
        });

        const checkbox = !Window.isCompact()
            ? (<CheckBox
                key={i}
                isChecked={secondarySpecies === s.id}
                onChanged={(val) => assignSecondarySepecies(s.id) }
                value={s.id} />)
            : undefined;

        const rowBackground = Window.isCompact() && secondarySpecies === s.id
            ? "#9179B7"
            : "";

        return (
            <tr key={'secondary-' + s.id}
                style={{ backgroundColor: rowBackground }}
                onClick={() => { if (Window.isCompact()) { assignSecondarySepecies(s.id) } } }>
                <td className="selection-header">{s.localizedName}</td>
                <td>{attributes}</td>
                <td>{talents}</td>
                <td>{checkbox}</td>
            </tr>
        );
    });

    const navigateToNextPage = () => {
        if (character.speciesStep?.species == null || character.speciesStep?.mixedSpecies == null) {
            Dialog.show("Please select both a primary and secondary species");
        } else {
            Navigation.navigateToPage(PageIdentity.SpeciesDetails);
        }
    }

    return (<>
        <div className="row">
            <div className="col-lg-6 mt-3">
            <Header level={2}>SELECT PRIMARY SPECIES</Header>
            <table className="selection-list">
                <thead>
                    <tr>
                        <td></td>
                        <td><b>Attributes</b></td>
                        <td><b>Talent Options</b></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {primarySpeciesRows}
                </tbody>
            </table>
            </div>
            <div className="col-lg-6 mt-3">
            <Header level={2}>SELECT SECONDARY SPECIES</Header>
            <table className="selection-list">
                <thead>
                    <tr>
                        <td></td>
                        <td><b>Attributes</b></td>
                        <td><b>Talent Options</b></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {secondarySpeciesRows}
                </tbody>
            </table>
            </div>
        </div>
        <div className="text-end mt-4">
            <Button buttonType={true} className="btn btn-primary" onClick={() => navigateToNextPage()} >{t('Common.button.next')}</Button>
        </div>
    </>);
}

export default connect(characterMapStateToProperties)(MixedSpeciesSelection);