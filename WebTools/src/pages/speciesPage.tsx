import * as React from 'react';
import {character} from '../common/character';
import {CharacterType} from '../common/characterType';
import {Navigation} from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import {Species, SpeciesHelper} from '../helpers/species';
import {Button} from '../components/button';
import {SpeciesSelection} from '../components/speciesSelection';
import {MixedSpeciesSelection} from '../components/mixedSpeciesSelection';
import { Source } from '../helpers/sources';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';

interface ISpeciesPageState {
    showSelection: boolean;
    showMixedSelection: boolean;
}

export class SpeciesPage extends React.Component<IPageProperties, ISpeciesPageState> {
    constructor(props: IPageProperties) {
        super(props);

        this.state = {
            showSelection: false,
            showMixedSelection: false
        };
    }

    render() {
        const rollAlpha = character.hasSource(Source.AlphaQuadrant) && character.type !== CharacterType.KlingonWarrior
            ? <Button className="button" text="Roll Alpha Species" onClick={() => this.rollAlphaSpecies()} />
            : undefined;

        const rollBeta = character.hasSource(Source.BetaQuadrant) && character.type !== CharacterType.KlingonWarrior
            ? <Button className="button" text="Roll Beta Species" onClick={() => this.rollBetaSpecies()} />
            : undefined;

        var content = !this.state.showSelection && !this.state.showMixedSelection?
            (
                <div>
                    <div className="page-text">
                        To what species do you belong?
                        You may also create a character of mixed species, gaining benefits from both.
                        <br /><br />
                        Either select or roll your Species.
                    </div>
                    <div className="button-container">
                        <Button className="button" text="Select Species" onClick={() => this.showSpecies() } />
                        <Button className="button" text="Select Mixed Species" onClick={() => this.showMixedSpecies() }/>
                        <Button className="button" text="Roll Core Species" onClick={() => this.rollSpecies()} />
                        {rollAlpha}
                        {rollBeta}
                    </div>
                </div>
            )
            : this.state.showSelection
                ? (
                    <div>
                        <SpeciesSelection
                            onSelection={(species) => this.selectSpecies(species) }
                            onCancel={() => this.hideSpecies() } />
                    </div>
                  )
                : (
                    <div>
                        <div>
                            Select two species.
                            You will gain Traits from both species and may select from both species' Talents,
                            but only the primary species gives you attribute bonuses.
                        </div>
                        <MixedSpeciesSelection
                            onSelection={(primary, secondary) => this.selectMixedSpecies(primary, secondary) }
                            onCancel={() => this.hideSpecies() } />
                    </div>
                  );

        return (
            <div className="page">
                <CharacterCreationBreadcrumbs />
                {content}
            </div>
        );
    }

    private rollSpecies() {
        var species = SpeciesHelper.generateSpecies();
        this.selectSpecies(species);
    }

    private rollAlphaSpecies() {
        var species = SpeciesHelper.generateFromAlphaQuadrantTable();
        this.selectSpecies(species);
    }

    private rollBetaSpecies() {
        var species = SpeciesHelper.generateFromBetaQuadrantTable();
        this.selectSpecies(species);
    }

    private showSpecies() {
        this.setState({
            showSelection: true,
            showMixedSelection: false
        });
    }

    private hideSpecies() {
        this.setState({
            showSelection: false,
            showMixedSelection: false
        });
    }

    private showMixedSpecies() {
        this.setState({
            showSelection: false,
            showMixedSelection: true
        });
    }

    private selectSpecies(species: Species) {
        character.species = species;
        SpeciesHelper.applySpecies(species);
        Navigation.navigateToPage(PageIdentity.SpeciesDetails);
    }

    private selectMixedSpecies(primary: Species, secondary: Species) {
        character.species = primary;
        character.mixedSpecies = secondary;
        SpeciesHelper.applySpecies(primary, secondary);
        Navigation.navigateToPage(PageIdentity.SpeciesDetails);
    }
}
