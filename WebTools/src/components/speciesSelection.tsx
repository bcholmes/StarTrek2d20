import React, { useState } from 'react';
import { Character, character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Window } from '../common/window';
import { SpeciesHelper } from '../helpers/species';
import { Attribute } from '../helpers/attributes';
import { Button } from './button';
import { CheckBox } from './checkBox';
import { Species } from '../helpers/speciesEnum';
import { useTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';
import { SourcesHelper } from '../helpers/sources';
import InstructionText from './instructionText';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';

interface ISpeciesSelectionProperties extends ICharacterProperties {
    onSelection: (species: Species) => void;
}

const SpeciesSelection: React.FC<ISpeciesSelectionProperties> = ({character, onSelection}) => {
    const [allowAllSpecies, setAllowAllSpecies ] = useState(false);
    const [randomSpecies, setRandomSpecies] = useState(character?.speciesStep?.species);

    const { t } = useTranslation();

    let overrideCheckbox = (Character.isSpeciesListLimited(character))
        ? (<CheckBox
            isChecked={allowAllSpecies}
            text="Allow any species (GM's decision)"
            value={!allowAllSpecies}
            onChanged={() => setAllowAllSpecies(!allowAllSpecies)} />)
        : undefined

    const speciesOptions = SpeciesHelper.getPrimarySpecies(allowAllSpecies ? CharacterType.Starfleet : character.type, false, character);
    let visibleSpeciesOptions = (randomSpecies != null)
        ? [SpeciesHelper.getSpeciesByType(randomSpecies)]
        : speciesOptions;

    const determineRandomSpecies = () => {
        if (!Character.isSpeciesListLimited(character) || allowAllSpecies) {
            let speciesSelection = SpeciesHelper.generateSpecies();
            return speciesSelection;
        } else {
            let speciesSelection = speciesOptions[Math.floor(speciesOptions.length * Math.random())];
            return speciesSelection.id;
        }
    }

    let species = visibleSpeciesOptions.map((s, i) => {
        const attributes = s.id === Species.Ktarian
            ? (
                <div key={'species-' + s.id}>
                    <div>{t('Construct.attribute.control')}</div>
                    <div>{t('Construct.attribute.reason')}</div>
                    <div>Fitness or Presence</div>
                </div>
            )
            : s.attributes.map((a, i) => {
                return <div key={i}>{t(makeKey('Construct.attribute.', Attribute[a])) }</div>;
            });

        const talents = s.id === Species.Changeling
            ? <div>Morphogenic Matrix</div>
            : s.talents.map((t, i) => {
                return t.isAvailableExcludingSpecies() ? <div key={i}>{t.name}</div> : <span key={i}></span>;
            });
        const sources = SourcesHelper.getSourceName(s.sources);

        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) onSelection(s.id); }}>
                <td className="selection-header">{s.localizedName}</td>
                <td>{attributes}</td>
                <td className="d-none d-md-table-cell">{sources}</td>
                <td>{talents}</td>
                <td className="text-right"><Button buttonType={true} className="button-small"onClick={() => { onSelection(s.id) }} >{t('Common.button.select')}</Button></td>
            </tr>
        );
    });

    return (
        <div className="mt-4">
            <InstructionText text={t('SpeciesPage.text.select')} />
            {overrideCheckbox}

            <div className="my-4">
                <Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomSpecies( determineRandomSpecies()) }>
                    <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="mr-1" alt={t('SpeciesPage.rollCoreSpecies')}/> {t('SpeciesPage.rollCoreSpecies')}</>
                </Button>
                {randomSpecies != null ? (<Button buttonType={true} className="btn btn-primary btn-sm mr-3" onClick={() => setRandomSpecies(null)} >{t('Common.button.showAll')}</Button>) : undefined}
            </div>
            <table className="selection-list">
                <thead>
                    <tr>
                        <td></td>
                        <td><b>{t('Construct.other.attributes')}</b></td>
                        <td className="d-none d-md-table-cell"><b>{t('Construct.other.sources')}</b></td>
                        <td><b>{t('Construct.other.talentOptions')}</b></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {species}
                </tbody>
            </table>
        </div>
    );
}

export default connect(characterMapStateToProperties)(SpeciesSelection);