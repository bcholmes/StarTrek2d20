import * as React from 'react';
import { character } from '../common/character';
import { Navigation } from '../common/navigator';
import {PageIdentity} from './pageIdentity';
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
import { AttributeController } from '../components/attributeController';
import AttributeComponent from '../components/attributeComponent';
import SingleTalentSelectionList from '../components/singleTalentSelectionList';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Attribute } from '../helpers/attributes';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';

interface ICustomSpeciesDetailsProperties extends WithTranslation {
    allowCrossSpeciesTalents: boolean;
    allowEsotericTalents: boolean;
}

interface ICustomSpeciesDetailsPageState {
    attributeSelectionComplete: boolean;
    speciesName: string;
}

class CustomSpeciesAttributeController extends AttributeController {

    isShown(attribute: Attribute) {
        return true;
    }
    isEditable(attribute: Attribute) {
        return true;
    }
}

class CustomSpeciesDetailsPage extends React.Component<ICustomSpeciesDetailsProperties, ICustomSpeciesDetailsPageState> {
    private _selectedTalent: TalentViewModel;
    private controller: CustomSpeciesAttributeController;

    constructor(props) {
        super(props);
        this.controller = new CustomSpeciesAttributeController(character, done => this.attributesDone(done));
        this.state = {
            attributeSelectionComplete: false,
            speciesName: ""
        };
    }

    render() {
        const { t } = this.props;
        const selectDesc = t('SpeciesDetails.selectThree');

        return (
            <div className="page">
                <div className="container ml-0">
                    <CharacterCreationBreadcrumbs />
                    <Header>{t('Page.title.customSpeciesDetails')}</Header>
                    <InstructionText text={t('CustomSpeciesDetails.instruction')} />
                    <InputFieldAndLabel labelName={t('CustomSpeciesDetails.speciesName')} id="speciesName"
                        onChange={(value) => this.setSpeciesName(value)} value={this.state.speciesName} />


                    <div className="row">
                        <div className="col-12 col-lg-6 my-4">
                            <Header level={2}>{t('Construct.other.attributes')} {selectDesc}</Header>
                            <div className="mt-4">
                                <AttributeComponent controller={this.controller} />
                            </div>

                            <InstructionText text={this.controller.instructions} />
                        </div>
                        <div className="col-12 col-lg-6 my-4">
                            <Header level={2}>{t('Construct.other.trait')}</Header>
                            <p className="mt-3"><b>{this.state.speciesName || "Custom Species"}</b></p>
                            <p>{t('CustomSpeciesDetails.speciesTrait')}</p>
                        </div>
                    </div>
                    {this.renderTalentsSection()}
                    <div className="text-right">
                        <Button text={t('Common.button.next')} className="button-next" onClick={() => this.onNext()} buttonType={true} />
                    </div>
                </div>
            </div>
        );
    }

    renderTalentsSection() {
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

    setSpeciesName(name: string) {
        character.speciesStep.customSpeciesName = name;
        this.setState((state) => ({...state, speciesName: name}));
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
        const { t } = this.props;
        if (!this.state.speciesName) {
            Dialog.show(t('CustomSpeciesDetails.speciesNameWarning'));
            return;
        }

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

export default withTranslation()(connect(mapStateToProps)(CustomSpeciesDetailsPage));