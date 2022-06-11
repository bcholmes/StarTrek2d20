import * as React from 'react';
import { character } from '../common/character';
import { Navigation } from '../common/navigator';
import {IPageProperties} from './iPageProperties';
import {PageIdentity} from './pageIdentity';
import { SpeciesHelper, SpeciesModel } from '../helpers/species';
import { AttributesHelper } from '../helpers/attributes';
import { TalentsHelper, TalentViewModel, ToViewModel } from '../helpers/talents';
import { AttributeView } from '../components/attribute';
import { AttributeImprovementCollection, AttributeImprovementCollectionMode } from '../components/attributeImprovement';
import { Button } from '../components/button';
import { CheckBox } from '../components/checkBox';
import { Dialog } from '../components/dialog';
import { TalentSelection } from '../components/talentSelection';
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

interface ISpeciesDetailsProperties extends IPageProperties {
    allowCrossSpeciesTalents: boolean;
    allowEsotericTalents: boolean;
}

class SpeciesDetailsPage extends React.Component<ISpeciesDetailsProperties, {}> {
    private _selectedTalent: TalentViewModel;
    private _attributesDone: boolean;

    render() {
        let species = SpeciesHelper.getSpeciesByType(character.species);
        
        let attributes = species.attributes.length > 3
            ? <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Species} points={3} onDone={(done) => { this.attributesDone(done); }} />
            : species.attributes.map((a, i) => {
                return <AttributeView key={i} name={AttributesHelper.getAttributeName(a)} points={1} value={character.attributes[a].value} />;
            });

        const selectDesc = species.attributes.length > 3 ? "(Select three)" : "";

        if (species.id === Species.Ktarian) {
            attributes =
            (
                <div>
                    <AttributeView name={AttributesHelper.getAttributeName(species.attributes[0])} points={1} value={character.attributes[species.attributes[0]].value} />
                    <AttributeView name={AttributesHelper.getAttributeName(species.attributes[1])} points={1} value={character.attributes[species.attributes[1]].value} />
                </div>
            );
        } else if (species.id === Species.Kobali && character.originalSpecies != null) {
            let originalSpecies = SpeciesHelper.getSpeciesByType(character.originalSpecies); 
            attributes = originalSpecies.attributes.length > 3
                ? <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Species} points={3} onDone={(done) => { this.attributesDone(done); }} />
                : originalSpecies.attributes.map((a, i) => {
                    return <AttributeView key={i} name={AttributesHelper.getAttributeName(a)} points={1} value={character.attributes[a].value} />;
                });
        }

        const attributeSelection = species.id === Species.Ktarian
            ? (
                <div>
                    <SmallHeader>(Select one)</SmallHeader>
                    <AttributeImprovementCollection mode={AttributeImprovementCollectionMode.Ktarian} points={1} onDone={(done) => { this.attributesDone(done); }} />
                </div>
              )
            : undefined;

        let mixed = character.mixedSpecies != null
            ? SpeciesHelper.getSpeciesByType(character.mixedSpecies)
            : null;

        const name = mixed != null
            ? `${species.name}/${mixed.name}`
            : species.name;

        return (
            <div className="page">
                <div className="container ml-0">
                    <CharacterCreationBreadcrumbs />
                    <Header>{name}</Header>
                    <InstructionText text={species.description} />
                    <div className="panel">
                        <SmallHeader>ATTRIBUTES {selectDesc}</SmallHeader>
                        {attributes}
                        {attributeSelection}
                    </div>
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
                    <div><b>{mixed.trait}</b></div>
                    <div>{mixed.traitDescription}</div>
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
        if (species.id === Species.Changeling) {
            talents.push(ToViewModel(TalentsHelper.getTalent("Morphogenic Matrix")));
        }
        else {
            talents.push(...TalentsHelper.getAllAvailableTalents());
        }

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
                <TalentSelection talents={talents} onSelection={talents => this.onTalentSelected(talents.length > 0 ? talents[0] : undefined)} />
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
        this._attributesDone = done;
    }

    private onTalentSelected(talent: TalentViewModel) {
        this._selectedTalent = talent;
    }

    private onNext() {
        var species = SpeciesHelper.getSpeciesByType(character.species);
        if (species.attributes.length > 3) {
            if (!this._attributesDone) {
                Dialog.show("You have not distributed all Attribute points.");
                return;
            }
        }

        if (character.workflow.currentStep().options.talentSelection) {
            if (!this._selectedTalent) {
                Dialog.show("You have not selected a talent.");
                return;
            }

            character.addTalent(this._selectedTalent);

            if (this._selectedTalent.name === "The Ushaan") {
                character.addEquipment("Ushaan-tor ice pick");
            }
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