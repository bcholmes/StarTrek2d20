import * as React from 'react';
import { character } from '../common/character';
import { Navigation } from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import { SpeciesHelper, SpeciesModel } from '../helpers/species';
import { TalentsHelper, TalentViewModel } from '../helpers/talents';
import { Button } from '../components/button';
import { CheckBox } from '../components/checkBox';
import { Dialog } from '../components/dialog';
import { Source } from '../helpers/sources';
import CharacterCreationBreadcrumbs from '../components/characterCreationBreadcrumbs';
import store from '../state/store';
import { setAllowCrossSpeciesTalents, setAllowEsotericTalents } from '../state/contextActions';
import { connect } from 'react-redux';
import { hasSource } from '../state/contextFunctions';
import InstructionText from '../components/instructionText';
import { Header } from '../components/header';
import { AttributeController, AttributeControllerFactory } from '../components/attributeController';
import SpeciesAttributeComponent from '../components/speciesAttributeComponent';
import { SingleTalentSelectionList } from '../components/singleTalentSelectionList';

interface ISpeciesDetailsProperties extends IPageProperties {
    allowCrossSpeciesTalents: boolean;
    allowEsotericTalents: boolean;
}

interface ISpeciesDetailsPageState {
    attributeSelectionComplete: boolean;
}

class SpeciesDetailsPage extends React.Component<ISpeciesDetailsProperties, ISpeciesDetailsPageState> {
    private _selectedTalent: TalentViewModel;
    attributesController: AttributeController;

    constructor(props) {
        super(props);
        this.attributesController = AttributeControllerFactory.create(character, done => this.attributesDone(done));
        this.state = {
            attributeSelectionComplete: this.attributesController.selections.length === 3
        };
    }

    render() {
        let species = SpeciesHelper.getSpeciesByType(character.speciesStep?.species);
        const selectDesc = species.attributes.length > 3 ? "(Select three)" : "";

        return (
            <div className="page">
                <div className="container ml-0">
                    <CharacterCreationBreadcrumbs />
                    <Header>{character.speciesName}</Header>
                    <InstructionText text={species.description} />

                    <div className="row">
                        <div className="col-12 col-lg-6 my-4">
                            <Header level={2}>ATTRIBUTES {selectDesc}</Header>
                            <div className="mt-4">
                                <SpeciesAttributeComponent controller={this.attributesController} />
                            </div>

                            <InstructionText text={this.attributesController.instructions} />
                        </div>
                        <div className="col-12 col-lg-6 my-4">
                            {this.renderTraitSection(species)}
                        </div>
                    </div>
                    {this.renderTalentsSection(species)}
                    <Button text="ENVIRONMENT" className="button-next" onClick={() => this.onNext()} />
                </div>
            </div>
        );
    }

    renderTraitSection(species: SpeciesModel) {
        let mixed = character.speciesStep?.mixedSpecies != null
            ? SpeciesHelper.getSpeciesByType(character.speciesStep?.mixedSpecies)
            : null;

        const mixedTrait = mixed != null
            ? (
                <div>
                    <div className="text-white my-3"><b>{mixed.trait}</b></div>
                    <div className="text-white">{mixed.traitDescription}</div>
                </div>
            )
            : undefined;

        return (<div>
                <Header level={2}>TRAIT</Header>
                <div className="text-white my-3"><b>{species.trait}</b></div>
                <div className="text-white">{species.traitDescription}</div>
                {mixedTrait}
            </div>);
    }

    renderTalentsSection(species: SpeciesModel) {
        let talents = [];
        talents.push(...TalentsHelper.getAllAvailableTalentsForCharacter(character));

        const esotericTalentOption = (hasSource(Source.PlayersGuide)) ? (<div>
                <CheckBox
                    isChecked={this.props.allowEsotericTalents}
                    text="Allow esoterric talents (GM's decision)"
                    value={!this.props.allowEsotericTalents}
                    onChanged={() => { store.dispatch(setAllowEsotericTalents(!this.props.allowEsotericTalents));  }} />
            </div>) : undefined;

        return talents.length > 0 && character.workflow.currentStep().options.talentSelection
            ? (<div>
                <Header level={2}>TALENTS</Header>
                <div>
                    {this.renderCrossSpeciesCheckbox()}
                </div>
                {esotericTalentOption}
                <SingleTalentSelectionList talents={talents} construct={character}
                    onSelection={talent => this.onTalentSelected(talent)} />
            </div>)
            : (<div>
                <Header level={2}>SPECIES OPTIONS</Header>
                <div>
                    {this.renderCrossSpeciesCheckbox()}
                </div>
                {esotericTalentOption}
              </div>);
    }

    private renderCrossSpeciesCheckbox() {
        return (<CheckBox
            isChecked={this.props.allowCrossSpeciesTalents}
            text="Allow cross-species talents (GM's decision)"
            value={!this.props.allowCrossSpeciesTalents}
            onChanged={() => {
                store.dispatch(setAllowCrossSpeciesTalents(!this.props.allowCrossSpeciesTalents));
            }} />);
    }

    private attributesDone(done: boolean) {
        this.setState((state) => ({...state, attributeSelectionComplete: done }))
    }

    private onTalentSelected(talent: TalentViewModel) {
        this._selectedTalent = talent;
    }

    private onNext() {
        if (!this.state.attributeSelectionComplete) {
            Dialog.show("You have not distributed all Attribute points.");
            return;
        }

        if (character.workflow.currentStep().options.talentSelection) {
            if (!this._selectedTalent) {
                Dialog.show("You have not selected a talent.");
                return;
            }

            character.addTalent(this._selectedTalent);
        }

        character.workflow.next();
        Navigation.navigateToPage(PageIdentity.Environment);
    }
}

function mapStateToProps(state, ownProps) {
    return {
        allowCrossSpeciesTalents: state.context.allowCrossSpeciesTalents,
        allowEsotericTalents: state.context.allowEsotericTalents
    };
}

export default connect(mapStateToProps)(SpeciesDetailsPage);