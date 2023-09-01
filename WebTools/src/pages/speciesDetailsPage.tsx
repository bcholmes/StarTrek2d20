import * as React from 'react';
import { character } from '../common/character';
import { Navigation } from '../common/navigator';
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
import AttributeListComponent from '../components/attributeListComponent';
import SingleTalentSelectionList from '../components/singleTalentSelectionList';
import { withTranslation, WithTranslation } from 'react-i18next';

interface ISpeciesDetailsProperties extends WithTranslation {
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
        const { t } = this.props;
        let species = SpeciesHelper.getSpeciesByType(character.speciesStep?.species);
        const selectDesc = species.attributes.length > 3 ? t('SpeciesDetails.selectThree') : "";

        return (
            <div className="page">
                <div className="container ml-0">
                    <CharacterCreationBreadcrumbs />
                    <Header>{character.localizedSpeciesName}</Header>
                    <InstructionText text={species.localizedDescription} />

                    <div className="row">
                        <div className="col-12 col-lg-6 my-4">
                            <Header level={2}>{t('Construct.other.attributes')} {selectDesc}</Header>
                            <div className="mt-4">
                                <AttributeListComponent controller={this.attributesController} />
                            </div>

                            <InstructionText text={this.attributesController.instructions} />
                        </div>
                        <div className="col-12 col-lg-6 my-4">
                            {this.renderTraitSection(species)}
                        </div>
                    </div>
                    {this.renderTalentsSection(species)}
                    <div className="text-right mt-4">
                        <Button buttonType={true} text={t('Common.button.next')} className="btn btn-primary" onClick={() => this.onNext()} />
                    </div>
                </div>
            </div>
        );
    }

    renderTraitSection(species: SpeciesModel) {
        const { t } = this.props;
        let mixed = character.speciesStep?.mixedSpecies != null
            ? SpeciesHelper.getSpeciesByType(character.speciesStep?.mixedSpecies)
            : null;

        const mixedTrait = mixed != null
            ? (
                <div>
                    <div className="text-white my-3"><b>{mixed.localizedTrait}</b></div>
                    <div className="text-white">{mixed.localizedTraitDescription}</div>
                </div>
            )
            : undefined;

        return (<div>
                <Header level={2}>{t('Construct.other.trait')}</Header>
                <div className="text-white my-3"><b>{species.localizedTrait}</b></div>
                <div className="text-white">{species.localizedTraitDescription}</div>
                {mixedTrait}
            </div>);
    }

    renderTalentsSection(species: SpeciesModel) {
        const { t } = this.props;
        let talents = [];
        talents.push(...TalentsHelper.getAllAvailableTalentsForCharacter(character));

        const esotericTalentOption = (hasSource(Source.PlayersGuide)) ? (<div>
                <CheckBox
                    isChecked={this.props.allowEsotericTalents}
                    text={t('SpeciesDetails.allowEsoteric')}
                    value={!this.props.allowEsotericTalents}
                    onChanged={() => { store.dispatch(setAllowEsotericTalents(!this.props.allowEsotericTalents));  }} />
            </div>) : undefined;

        return talents.length > 0 && character.workflow.currentStep().options.talentSelection
            ? (<div>
                <Header level={2}>{t('Construct.other.talents')}</Header>
                <div>
                    {this.renderCrossSpeciesCheckbox()}
                </div>
                {esotericTalentOption}
                <SingleTalentSelectionList talents={talents} construct={character}
                    onSelection={talent => this.onTalentSelected(talent)} />
            </div>)
            : (<div>
                <Header level={2}>{t('SpeciesDetails.options')}</Header>
                <div>
                    {this.renderCrossSpeciesCheckbox()}
                </div>
                {esotericTalentOption}
              </div>);
    }

    private renderCrossSpeciesCheckbox() {
        const { t } = this.props;
        return (<CheckBox
            isChecked={this.props.allowCrossSpeciesTalents}
            text={t('SpeciesDetails.allowCrossSpecies')}
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

export default withTranslation()(connect(mapStateToProps)(SpeciesDetailsPage));