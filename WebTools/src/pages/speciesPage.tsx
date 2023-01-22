import * as React from 'react';
import {Character, character, SpeciesStep} from '../common/character';
import {Navigation} from '../common/navigator';
import {PageIdentity} from './pageIdentity';
import {SpeciesHelper} from '../helpers/species';
import {Button} from '../components/button';
import SpeciesSelection from '../components/speciesSelection';
import {MixedSpeciesSelection} from '../components/mixedSpeciesSelection';
import { Source } from '../helpers/sources';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import { Species } from '../helpers/speciesEnum';
import InstructionText from '../components/instructionText';
import { Era } from '../helpers/eras';
import store from '../state/store';
import { hasSource } from '../state/contextFunctions';
import { withTranslation, WithTranslation } from 'react-i18next';

interface ISpeciesPageState {
    showSelection: boolean;
    showMixedSelection: boolean;
}

class SpeciesPage extends React.Component<WithTranslation, ISpeciesPageState> {
    constructor(props: WithTranslation) {
        super(props);

        this.state = {
            showSelection: false,
            showMixedSelection: false
        };
    }

    render() {

        const rollAlpha = hasSource(Source.AlphaQuadrant) && this.isRollAvailable()
            ? <Button className="button" text="Roll Alpha Species" onClick={() => this.rollAlphaSpecies()} />
            : undefined;

        const rollBeta = hasSource(Source.BetaQuadrant) && this.isRollAvailable()
            ? <Button className="button" text="Roll Beta Species" onClick={() => this.rollBetaSpecies()} />
            : undefined;

        const rollGamma = store.getState().context.era === Era.NextGeneration && hasSource(Source.GammaQuadrant) && this.isRollAvailable()
            ? <Button className="button" text="Roll Gamma Species" onClick={() => this.rollGammaSpecies()} />
            : undefined;

        const rollDelta = store.getState().context.era === Era.NextGeneration && hasSource(Source.DeltaQuadrant) && this.isRollAvailable()
            ? <Button className="button" text="Roll Delta Species" onClick={() => this.rollDeltaSpecies()} />
            : undefined;


        var content = !this.state.showSelection && !this.state.showMixedSelection?
            (
                <div>
                    <div className="page-text">
                        <InstructionText text={character.workflow.currentStep().description} />
                    </div>
                    <div className="row row-cols-md-2">
                        <div className="col">
                            <Button className="button" text="Select Species" onClick={() => this.showSpecies() } />
                            <Button className="button" text="Select Mixed Species" onClick={() => this.showMixedSpecies() }/>
                            <Button className="button" text="Select Custom Species" onClick={() => this.showCustomSpecies() }/>
                        </div>
                        <div className="col">
                            {this.isRollAvailable() ? (<Button className="button" text="Roll Core Species" onClick={() => this.rollSpecies()} />) : undefined }
                            {rollAlpha}
                            {rollBeta}
                            {rollGamma}
                            {rollDelta}
                        </div>
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
                <div className="container ml-0">
                    <CharacterCreationBreadcrumbs />
                    {content}
                </div>
            </div>
        );
    }

    private isRollAvailable() {
        return !Character.isSpeciesListLimited(character);
    }

    private rollSpecies() {
        var species = SpeciesHelper.generateSpecies();
        this.selectSpecies(species);
    }

    private rollAlphaSpecies() {
        var species = SpeciesHelper.generateFromAlphaQuadrantTable();
        this.selectSpecies(species);
    }

    private rollGammaSpecies() {
        let species = SpeciesHelper.generateFromGammaQuadrantTable();
        if (species != null) {
            this.selectSpecies(species);
        }
    }

    private rollDeltaSpecies() {
        let species = SpeciesHelper.generateFromDeltaQuadrantTable();
        if (species != null) {
            this.selectSpecies(species);
        }
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

    private showCustomSpecies() {
        character.speciesStep = new SpeciesStep(Species.Custom);
        Navigation.navigateToPage(PageIdentity.CustomSpeciesDetails);
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
        character.speciesStep = new SpeciesStep(species);
        if (species === Species.Kobali) {
            Navigation.navigateToPage(PageIdentity.KobaliExtraSpeciesDetails);
        } else if (species === Species.Borg) {
            Navigation.navigateToPage(PageIdentity.BorgSpeciesExtraDetails);
        } else if (species === Species.LiberatedBorg) {
            Navigation.navigateToPage(PageIdentity.LiberatedBorgSpeciesExtraDetails);
        } else if (species === Species.CyberneticallyEnhanced) {
            Navigation.navigateToPage(PageIdentity.CyberneticallyEnhancedSpeciesExtraDetails);
        } else {
            SpeciesHelper.applySpecies(species);
            Navigation.navigateToPage(PageIdentity.SpeciesDetails);
        }
    }

    private selectMixedSpecies(primary: Species, secondary: Species) {
        character.speciesStep = new SpeciesStep(primary);
        character.speciesStep.mixedSpecies = secondary;
        SpeciesHelper.applySpecies(primary, secondary);
        Navigation.navigateToPage(PageIdentity.SpeciesDetails);
    }
}

export default withTranslation()(SpeciesPage);