import React, { useState } from 'react';
import { Character } from '../common/character';
import { CharacterType } from '../common/characterType';
import { Window } from '../common/window';
import { SpeciesHelper } from '../helpers/species';
import { Attribute } from '../helpers/attributes';
import { Button } from './button';
import { CheckBox } from './checkBox';
import { Species } from '../helpers/speciesEnum';
import { useTranslation } from 'react-i18next';
import { makeKey } from '../common/translationKey';
import { Source, SourcesHelper } from '../helpers/sources';
import InstructionText from './instructionText';
import { ICharacterProperties, characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import SplitButton from 'react-bootstrap/SplitButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { hasSource } from '../state/contextFunctions';

enum RandomMode {
    All,
    Core,
    AlphaQuadrant,
    BetaQuadrant,
    GammaQuadrant,
    DeltaQuadrant
}

interface ISpeciesSelectionProperties extends ICharacterProperties {
    onSelection: (species: Species) => void;
}

const SpeciesSelection: React.FC<ISpeciesSelectionProperties> = ({character, onSelection}) => {
    const [allowAllSpecies, setAllowAllSpecies ] = useState(false);
    const [randomSpecies, setRandomSpecies] = useState(character?.speciesStep?.species);

    const { t } = useTranslation();
    const [mode, setMode] = useState(RandomMode.All);
    const [searchTerm, setSearchTerm] = useState<string>();

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

    const determineRandomSpecies = (mode: RandomMode) => {
        if (mode === RandomMode.Core) {
            let speciesSelection = SpeciesHelper.generateSpecies();
            return speciesSelection;
        } else if (mode === RandomMode.AlphaQuadrant) {
            let speciesSelection = SpeciesHelper.generateFromAlphaQuadrantTable();
            return speciesSelection;
        } else if (mode === RandomMode.BetaQuadrant) {
            let speciesSelection = SpeciesHelper.generateFromBetaQuadrantTable();
            return speciesSelection;
        } else if (mode === RandomMode.GammaQuadrant) {
            let speciesSelection = SpeciesHelper.generateFromGammaQuadrantTable();
            return speciesSelection;
        } else if (mode === RandomMode.DeltaQuadrant) {
            let speciesSelection = SpeciesHelper.generateFromDeltaQuadrantTable();
            return speciesSelection;
        } else {
            let speciesSelection = speciesOptions[Math.floor(speciesOptions.length * Math.random())];
            return speciesSelection.id;
        }
    }

    const determineButtonLabel = (mode: RandomMode) => {
        switch (mode) {
            case RandomMode.All:
                return t('Common.button.random');
            case RandomMode.Core:
                return t('SpeciesPage.rollCoreSpecies');
            case RandomMode.AlphaQuadrant:
                return t('SpeciesPage.rollAlphaSpecies');
            case RandomMode.BetaQuadrant:
                return t('SpeciesPage.rollBetaSpecies');
            case RandomMode.GammaQuadrant:
                return t('SpeciesPage.rollGammaSpecies');
            case RandomMode.DeltaQuadrant:
            default:
                return t('SpeciesPage.rollDeltaSpecies');
        }
    }

    let species = visibleSpeciesOptions
        .filter(s =>
            searchTerm == null || searchTerm.trim().length === 0
                || s.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) >= 0
                || s.localizedName.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) >= 0 )
        .map((s, i) => {
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
                return t.isAvailableExcludingSpecies(character) ? <div key={i}>{t.localizedDisplayName}</div> : <span key={i}></span>;
            });
        const sources = SourcesHelper.getSourceName(s.sources);

        return (
            <tr key={i} onClick={() => { if (Window.isCompact()) onSelection(s.id); }}>
                <td className="selection-header">{s.localizedName}</td>
                <td>{attributes}</td>
                <td className="d-none d-md-table-cell">{sources}</td>
                <td>{talents}</td>
                <td className="text-end d-none d-sm-table-cell"><Button className="button-small"onClick={() => { onSelection(s.id) }} >{t('Common.button.select')}</Button></td>
            </tr>
        );
    });

    const buttonLabel = determineButtonLabel(mode);

    const buttonTitle = (<>
        <img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="me-1" alt={t('SpeciesPage.rollCoreSpecies')}/> {buttonLabel}
    </>);

    return (
        <div className="mt-4">
            <InstructionText text={t('SpeciesPage.text.select')} />
            {overrideCheckbox}

            <div className="row">
                <div className="col-md-6 my-4">
                {Character.isSpeciesListLimited(character) && !allowAllSpecies
                    ? (<Button className="btn btn-primary btn-sm me-3" onClick={() => setRandomSpecies( determineRandomSpecies(RandomMode.All)) }>
                            <><img src="/static/img/d20.svg" style={{height: "24px", aspectRatio: "1"}} className="me-1" alt={t('Common.button.random')}/> {t('Common.button.random')}</>
                        </Button>)
                    : (<SplitButton variant='primary' title={buttonTitle} size="sm"
                            onSelect={(eventKey) => { setMode(parseInt(eventKey) as RandomMode) }} onClick={() => setRandomSpecies(determineRandomSpecies(mode))}
                            className="me-3">
                            <Dropdown.Item eventKey={RandomMode.All}>All</Dropdown.Item>
                            <Dropdown.Item eventKey={RandomMode.Core}>Core</Dropdown.Item>
                            {hasSource(Source.AlphaQuadrant)
                                ? (<Dropdown.Item eventKey={RandomMode.AlphaQuadrant}>Alpha Quadrant</Dropdown.Item>)
                                : undefined}
                            {hasSource(Source.BetaQuadrant)
                                ? (<Dropdown.Item eventKey={RandomMode.BetaQuadrant}>Beta Quadrant</Dropdown.Item>)
                                : undefined}
                            {hasSource(Source.GammaQuadrant)
                                ? (<Dropdown.Item eventKey={RandomMode.GammaQuadrant}>Gamma Quadrant</Dropdown.Item>)
                                : undefined}
                            {hasSource(Source.DeltaQuadrant)
                                ? (<Dropdown.Item eventKey={RandomMode.DeltaQuadrant}>Delta Quadrant</Dropdown.Item>)
                                : undefined}
                        </SplitButton>)}

                {randomSpecies != null ? (<Button className="btn btn-primary btn-sm me-3" onClick={() => setRandomSpecies(null)} >{t('Common.button.showAll')}</Button>) : undefined}
                </div>
                <div className="col-md-6 text-end my-4">
                    <label className="visually-hidden" htmlFor='search'>Search</label>
                    <input type="search" id="search" onChange={(e) => { setSearchTerm(e.target.value); }} value={searchTerm} placeholder="Search..." autoComplete="off"/>
                </div>
            </div>
            <table className="selection-list">
                <thead>
                    <tr>
                        <td></td>
                        <td><b>{t('Construct.other.attributes')}</b></td>
                        <td className="d-none d-md-table-cell"><b>{t('Construct.other.sources')}</b></td>
                        <td><b>{t('Construct.other.talentOptions')}</b></td>
                        <td className="text-end d-none d-sm-table-cell"></td>
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