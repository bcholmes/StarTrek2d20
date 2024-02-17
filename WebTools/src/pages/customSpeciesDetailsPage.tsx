import React from 'react';
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
import AttributeListComponent from '../components/attributeListComponent';
import SingleTalentSelectionList from '../components/singleTalentSelectionList';
import { useTranslation } from 'react-i18next';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import { Stereotype } from '../common/construct';
import { CharacterType } from '../common/characterType';
import { ICharacterProperties } from '../solo/page/soloCharacterProperties';
import { addCharacterTalent, setCharacterSpecies, StepContext } from '../state/characterActions';
import { CustomSpeciesAttributeController } from '../components/speciesController';

interface ICustomSpeciesDetailsProperties extends ICharacterProperties {
    allowCrossSpeciesTalents: boolean;
    allowEsotericTalents: boolean;
}

const CustomSpeciesDetailsPage: React.FC<ICustomSpeciesDetailsProperties> = ({character, allowCrossSpeciesTalents, allowEsotericTalents}) => {

    const { t } = useTranslation();
    const controller = new CustomSpeciesAttributeController(character);

    const renderTalentsSection = () => {
        let talents = [];
        talents.push(...TalentsHelper.getAllAvailableTalentsForCharacter(character));

        const esotericTalentOption = (hasSource(Source.PlayersGuide)) ? (<div>
                <CheckBox
                    isChecked={allowEsotericTalents}
                    text={t('SpeciesDetails.allowEsoteric')}
                    value={!allowEsotericTalents}
                    onChanged={() => { store.dispatch(setAllowEsotericTalents(!allowEsotericTalents));  }} />
            </div>) : undefined;

        return talents.length > 0 && isTalentSelectionRequired()
            ? (<div>
                <Header level={2}>{t('Construct.other.talents')}</Header>
                <div>
                    {renderCrossSpeciesCheckbox()}
                </div>
                {esotericTalentOption}
                <SingleTalentSelectionList talents={talents} construct={character}
                    onSelection={talent => onTalentSelected(talent)} />
            </div>)
            : (<div>
                <Header level={2}>{t('SpeciesDetails.options')}</Header>
                <div>
                    {renderCrossSpeciesCheckbox()}
                </div>
                {esotericTalentOption}
              </div>);
    }

    const renderCrossSpeciesCheckbox = () => {
        return (<CheckBox
            isChecked={allowCrossSpeciesTalents}
            text={t('SpeciesDetails.allowCrossSpecies')}
            value={!allowCrossSpeciesTalents}
            onChanged={() => {
                store.dispatch(setAllowCrossSpeciesTalents(!allowCrossSpeciesTalents));
            }} />);
    }

    const onTalentSelected = (talent: TalentViewModel) => {
        store.dispatch(addCharacterTalent(talent, StepContext.Species));
    }

    const isTalentSelectionRequired = () => {
        return character.stereotype !== Stereotype.SoloCharacter && character.type !== CharacterType.KlingonWarrior;
    }

    const onNext = () => {

        if (!character.speciesStep.customSpeciesName) {
            Dialog.show(t('CustomSpeciesDetails.speciesNameWarning'));
            return;
        }

        if (character.speciesStep?.attributes?.length !== 3) {
            Dialog.show("You have not distributed all Attribute points.");
            return;
        }

        if (isTalentSelectionRequired() && character.speciesStep?.talent == null) {
            Dialog.show("You have not selected a talent.");
            return;
        }

        Navigation.navigateToPage(PageIdentity.Environment);
    }

    const selectDesc = t('SpeciesDetails.selectThree');

    return (
        <div className="page">
            <div className="container ms-0">
                <CharacterCreationBreadcrumbs />
                <Header>{t('Page.title.customSpeciesDetails')}</Header>
                <InstructionText text={t('CustomSpeciesDetails.instruction')} />
                <InputFieldAndLabel labelName={t('CustomSpeciesDetails.speciesName')} id="speciesName"
                    onChange={(value) => store.dispatch(setCharacterSpecies(character.speciesStep?.species, character.speciesStep?.attributes, undefined, undefined, value ))}
                    value={character.speciesStep?.customSpeciesName ?? ""} />


                <div className="row">
                    <div className="col-12 col-lg-6 my-4">
                        <Header level={2}><>{t('Construct.other.attributes')} {selectDesc}</></Header>
                        <div className="mt-4">
                            <AttributeListComponent controller={controller} />
                        </div>

                        <InstructionText text={controller.instructions} />
                    </div>
                    <div className="col-12 col-lg-6 my-4">
                        <Header level={2}>{t('Construct.other.trait')}</Header>
                        <p className="mt-3"><b>{character.speciesStep?.customSpeciesName || "Custom Species"}</b></p>
                        <p>{t('CustomSpeciesDetails.speciesTrait')}</p>
                    </div>
                </div>
                {renderTalentsSection()}
                <div className="text-end">
                    <Button className="button-next" onClick={() => onNext()}>{t('Common.button.next')}</Button>
                </div>
            </div>
        </div>);

}

function mapStateToProps(state, ownProps) {
    return {
        character: state.character?.currentCharacter,
        allowCrossSpeciesTalents: state.context.allowCrossSpeciesTalents,
        allowEsotericTalents: state.context.allowEsotericTalents
    };
}

export default connect(mapStateToProps)(CustomSpeciesDetailsPage);