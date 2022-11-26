import * as React from 'react';
import { character } from '../common/character';
import { Navigation } from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import { SpeciesHelper, SpeciesModel } from '../helpers/species';
import { TalentsHelper, TalentViewModel, ToViewModel } from '../helpers/talents';
import { Button } from '../components/button';
import { CheckBox } from '../components/checkBox';
import { Dialog } from '../components/dialog';
import { Source } from '../helpers/sources';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { Species } from '../helpers/speciesEnum';
import store from '../state/store';
import { setAllowCrossSpeciesTalents, setAllowEsotericTalents } from '../state/contextActions';
import { connect } from 'react-redux';
import { hasSource } from '../state/contextFunctions';
import InstructionText from '../components/instructionText';
import { SmallHeader } from '../components/smallHeader';
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
        let species = SpeciesHelper.getSpeciesByType(character.species);
        const selectDesc = species.attributes.length > 3 ? "(Select three)" : "";

        return (
            <div className="page">
                <div className="container ml-0">
                    <CharacterCreationBreadcrumbs />
                    <Header>{character.speciesName}</Header>
                    <InstructionText text={species.description} />

                    <SmallHeader>ATTRIBUTES {selectDesc}</SmallHeader>
                    <div className="panel">
                        <SpeciesAttributeComponent controller={this.attributesController} />
                    </div>

                    <InstructionText text={this.attributesController.instructions} />
                    {this.renderTraitSection(species)}
                    {this.renderTalentsSection(species)}
                    <Button text="ENVIRONMENT" className="button-next" onClick={() => this.onNext()} />
                </div>
            </div>
        );
    }

    renderTraitSection(species: SpeciesModel) {
        let mixed = character.mixedSpecies != null
            ? SpeciesHelper.getSpeciesByType(character.mixedSpecies)
            : null;

        const mixedTrait = mixed != null
            ? (
                <div>
                    <div className="text-white my-3"><b>{mixed.trait}</b></div>
                    <div className="text-white">{mixed.traitDescription}</div>
                </div>
            )
            : undefined;

        return (<div className="my-4">
                <SmallHeader>TRAIT</SmallHeader>
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
                <SmallHeader>TALENTS</SmallHeader>
                <div>
                    {this.renderCrossSpeciesCheckbox()}
                </div>
                {esotericTalentOption}
                <SingleTalentSelectionList talents={talents} construct={character}
                    onSelection={talent => this.onTalentSelected(talent)} />
            </div>)
            : (<div>
                <SmallHeader>SPECIES OPTIONS</SmallHeader>
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