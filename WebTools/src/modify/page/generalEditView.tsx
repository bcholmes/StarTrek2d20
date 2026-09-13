import { useTranslation } from 'react-i18next';
import type { ICharacterProperties } from '../../solo/page/soloCharacterProperties';
import Markdown from 'react-markdown';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Header } from '../../components/header';
import { store } from '../../state/store';
import { FinalDetailsView } from './finalDetailsView';
import {
  addCharacterTalent,
  setCharacterAdditionalTraits,
  setCharacterDescription,
  setCharacterHouse,
  setCharacterLineage,
  setCharacterName,
  setCharacterPastime,
  setCharacterPronouns,
  StepContext,
  updateCharacterGeneralEditFocusChange,
  updateCharacterGeneralEditSpeciesAbility,
  updateCharacterGeneralEditTalentChange,
  updateCharacterGeneralEditValueChange,
} from '../../state/characterActions';
import type {
  FocusAssembly,
  TalentAssembly,
  ValueAssembly,
} from '../../common/characterAssembly';
import { AssemblyContext } from '../../common/characterAssembly';
import { SpeciesAbilityList } from '../../helpers/speciesAbility';
import { AttributesHelper } from '../../helpers/attributes';
import { AttributeView } from '../../components/attribute';
import { makeKey } from '../../common/translationKey';
import { AdditionalTalentInfo } from '../../supportingcharacters/modify/additionalTalentInfo';
import { SelectedTalentDescriptionView } from '../../components/selectedTalentDescriptionView';
import { NameGenerator } from '../../npc/nameGenerator';
import { SpeciesHelper } from '../../helpers/species';
import type { SpeciesModel } from '../../helpers/speciesModel';
import { TalentsHelper } from '../../helpers/talents';
import { ModalControl } from '../../components/modal';
import { SimpleTalentSelectionList } from '../../components/simpleTalentSelectionList';
import type { SelectedTalent } from '../../common/selectedTalent';
import { determineSelectedTalentExtraErrors } from '../../common/selectedTalentExtraCheck';
import { Dialog } from '../../components/dialog';
import { SpeciesAbilityChoiceView } from '../../components/speciesAbilityChoiceView';
import { RankedTalent } from '../../helpers/rankedTalent';
import { SingleTalentSelectionList } from '../../components/singleTalentSelectionList';
import { Species } from '../../helpers/speciesEnum';
import { Source } from '../../helpers/sources';
import { hasSource } from '../../state/contextFunctions';
import { BorgImplantSelectionView } from '../../components/borgImplantSelectionView';
import { FocusSelectionView } from '../../components/focusSelectionView';
import { ValueInputWithRandom } from '../../components/valueInputWithRandomOption';
import { RichTextEditor } from '../../components/richTextEditor';

interface IGeneralEditViewProperties extends ICharacterProperties {
  onNextStep: () => void;
  onPreviousStep: () => void;
}

enum Tab {
  Species,
  Values,
  Focuses,
  Talents,
  Final,
}

export const GeneralEditView: React.FC<IGeneralEditViewProperties> = ({
  character,
  onNextStep,
  onPreviousStep,
}) => {
  const [tab, setTab] = useState<Tab>(Tab.Species);
  const { t } = useTranslation();

  const closeModal = () => {
    ModalControl.hide();
  };

  const showTalentSelectionModal = (talentAssembly: TalentAssembly) => {
    let talents = TalentsHelper.getAllAvailableTalentsForCharacter(character);
    if (talentAssembly.context === AssemblyContext.Career) {
      talents = TalentsHelper.getCareerLengthTalents(character);
    }

    ModalControl.show(
      'xl',
      () => closeModal(),

      <div>
        <SimpleTalentSelectionList
          construct={character}
          talents={talents}
          onSelection={(t) => onTalentChanged(talentAssembly, t)}
        />
        <div className="text-center mt-4">
          <Button size="sm" onClick={() => closeModal()}>
            {t('Common.button.ok')}
          </Button>
        </div>
      </div>,
      t('ModifySupportingCharacter.talentModal.title'),
    );
  };

  const prepareForOnNextStep = () => {
    const errorMessage = character.talentAssemblies
      .map((t) => determineSelectedTalentExtraErrors(t.talent))
      .filter((m) => m?.length)[0];
    if (
      character.version > 1 &&
      character.speciesStep?.species === Species.LiberatedBorg &&
      character.speciesStep.ability != null
    ) {
      setTab(Tab.Species);
      Dialog.show(t('SpeciesAbility.liberatedBorg.error'));
    } else if (errorMessage?.length) {
      setTab(Tab.Talents);
      Dialog.show(errorMessage);
    } else {
      onNextStep();
    }
  };

  const onTalentChanged = (
    oldTalent: TalentAssembly,
    talent: SelectedTalent,
  ) => {
    store.dispatch(updateCharacterGeneralEditTalentChange(oldTalent, talent));
  };

  const addSpeciesAbility = () => {
    store.dispatch(
      updateCharacterGeneralEditSpeciesAbility(character.speciesStep.species),
    );
  };

  const onFocusChanged = (oldFocus: FocusAssembly, focus: string) => {
    store.dispatch(updateCharacterGeneralEditFocusChange(oldFocus, focus));
  };

  const onValueChanged = (oldValue: ValueAssembly, value: string) => {
    store.dispatch(updateCharacterGeneralEditValueChange(oldValue, value));
  };

  const onNameChanged = (value: string) => {
    store.dispatch(setCharacterName(value));
  };

  const onPronounsChanged = (value: string) => {
    store.dispatch(setCharacterPronouns(value));
  };

  const onPasttimeChanged = (value: string) => {
    store.dispatch(setCharacterPastime(value));
  };

  const onDescriptionChanged = (value: string) => {
    console.log('onDescriptionChanged');
    store.dispatch(setCharacterDescription(value));
  };

  const onLineageChanged = (value: string) => {
    store.dispatch(setCharacterLineage(value));
  };

  const onHouseChanged = (value: string) => {
    store.dispatch(setCharacterHouse(value));
  };

  const onAdditionalTraitsChanged = (value: string) => {
    store.dispatch(setCharacterAdditionalTraits(value));
  };

  const randomName = (species: SpeciesModel) => {
    const { name, pronouns } = NameGenerator.instance.createName(species);
    store.dispatch(setCharacterName(name));
    store.dispatch(setCharacterPronouns(pronouns));
  };

  const renderFinalTab = () => {
    const species = SpeciesHelper.getSpeciesByType(
      character?.speciesStep?.species,
    );
    return (
      <>
        <FinalDetailsView
          character={character}
          t={t}
          showRandomName={NameGenerator.instance.isSupported(species)}
          showPastime={character.version > 1}
          showLineageAndHouse={character.isKlingonImperialCitizen}
          showAdditionalTraits={true}
          onNameChanged={(value) => onNameChanged(value)}
          onPronounsChanged={(value) => onPronounsChanged(value)}
          onPasttimeChanged={(value) => onPasttimeChanged(value)}
          onLineageChanged={(value) => onLineageChanged(value)}
          onHouseChanged={(value) => onHouseChanged(value)}
          onAdditionalTraitsChanged={(value) =>
            onAdditionalTraitsChanged(value)
          }
          onRandomName={() => randomName(species)}
        />
        <div className="col-12 mt-4">
          <Header level={2} className="mb-3">
            {t('Construct.other.description')}
          </Header>
          <RichTextEditor
            onChange={onDescriptionChanged}
            initialText={character.description}
          />
        </div>
      </>
    );
  };

  const renderSpeciesTab = () => {
    const attributes = AttributesHelper.getAllAttributes()
      .filter(
        (a) =>
          character.speciesStep.attributes.includes(a) ||
          character.speciesStep.decrementAttributes.includes(a),
      )
      .map((a) => {
        let points = character.speciesStep.attributes.filter(
          (at) => at === a,
        ).length;
        if (points === 0) {
          points = -character.speciesStep.decrementAttributes.filter(
            (at) => at === a,
          ).length;
        }
        return (
          <AttributeView
            name={t(
              makeKey(
                'Construct.attribute.',
                AttributesHelper.getAttributeName(a),
              ),
            )}
            points={points}
          />
        );
      });

    const speciesAbilityTalents = character.speciesStep?.ability
      ?.isTalentSelectionSupported
      ? character.speciesStep.ability.talentNames.map(
          (t) => new RankedTalent(TalentsHelper.getTalent(t)),
        )
      : [];
    return (
      <>
        <Header level={2} className="my-4">
          {character.speciesName}
        </Header>

        {attributes}

        {SpeciesAbilityList.instance.getBySpecies(
          character.speciesStep.species,
        ) != null ? (
          character.speciesStep?.ability != null ? (
            <>
              <p className="mt-3">
                <b>{t('Construct.other.speciesAbility')}: </b>
                <span>{character.speciesStep?.ability?.name}</span>
              </p>
              {character.speciesStep?.species === Species.LiberatedBorg &&
              hasSource(Source.SpeciesSourcebook) ? (
                <BorgImplantSelectionView character={character} />
              ) : undefined}
              {speciesAbilityTalents?.length ? (
                <SingleTalentSelectionList
                  construct={character}
                  initialSelection={character.speciesStep.talent}
                  talents={speciesAbilityTalents}
                  onSelection={(t) =>
                    store.dispatch(addCharacterTalent(t, StepContext.Species))
                  }
                />
              ) : undefined}
              {character.speciesStep?.ability?.isChoiceRequired ? (
                <SpeciesAbilityChoiceView character={character} />
              ) : undefined}
            </>
          ) : (
            <div>
              <Markdown>
                {t('GeneralEditView.speciesAbility.available')}
              </Markdown>
              <div className="mt-3">
                <Button size="sm" onClick={addSpeciesAbility}>
                  {t('Common.button.add')}
                </Button>
              </div>
            </div>
          )
        ) : undefined}
      </>
    );
  };

  const renderValuesTab = () => {
    console.log(character.valueAssemblies);
    return (
      <>
        <Header level={2} className="my-4">
          {t('Construct.other.values')}
        </Header>
        <div className="row mt-4">
          {character.valueAssemblies.map((v, i) => (
            <>
              <div className="col-12 col-md-6" key={'value-' + i}>
                <ValueInputWithRandom
                  labelName={t('Construct.other.value')}
                  id={'value' + i}
                  onValueChanged={(value) => onValueChanged(v, value)}
                  value={v?.value ?? ''}
                  character={character}
                  department={
                    v.context === AssemblyContext.Education
                      ? character.educationStep?.primaryDiscipline
                      : undefined
                  }
                />
              </div>
            </>
          ))}
        </div>
      </>
    );
  };

  const renderFocusTab = () => {
    return (
      <>
        <Header level={2} className="my-4">
          {t('Construct.other.focuses')}
        </Header>
        <div className="row mt-4">
          {character.focusAssemblies.map((f, i) => (
            <>
              <div className="col-12 col-md-6" key={'focus-' + i}>
                <FocusSelectionView
                  label={t('Construct.other.focus')}
                  id={'focus' + i}
                  addFocus={(value) => onFocusChanged(f, value)}
                  value={f.focus ?? ''}
                  character={character}
                  randomFocusDepartment={
                    f.context === AssemblyContext.Education
                      ? character.educationStep?.primaryDiscipline
                      : undefined
                  }
                />
              </div>
            </>
          ))}
        </div>
      </>
    );
  };

  const renderTalentsTab = () => {
    return (
      <>
        <div className="row mt-4">
          {character.talentAssemblies
            .filter(
              (t) =>
                t.context !== AssemblyContext.Species ||
                !character.speciesStep?.ability?.isTalentSelectionSupported,
            )
            .map((talent, i) => (
              <>
                <div className="col-12 col-md-6" key={'talent-' + i}>
                  <Header level={2} className="my-4">
                    {talent.talent.talentModel.localizedName}
                  </Header>
                  <div className="text-end">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => showTalentSelectionModal(talent)}
                    >
                      {t('Common.button.modify')}
                    </Button>
                  </div>
                  <SelectedTalentDescriptionView
                    talent={talent.talent}
                    version={character.version}
                  />
                  <AdditionalTalentInfo
                    character={character}
                    talentSelection={talent.talent}
                    setTalentSelection={(s) => onTalentChanged(talent, s)}
                    simpleHeader={true}
                  />
                </div>
              </>
            ))}
        </div>
      </>
    );
  };

  const renderTab = () => {
    if (tab === Tab.Values) {
      return renderValuesTab();
    } else if (tab === Tab.Focuses) {
      return renderFocusTab();
    } else if (tab === Tab.Species) {
      return renderSpeciesTab();
    } else if (tab === Tab.Talents) {
      return renderTalentsTab();
    } else if (tab === Tab.Final) {
      return renderFinalTab();
    } else {
      return undefined;
    }
  };

  return (
    <>
      <Markdown className="mt-4">{t('GeneralEditView.instruction')}</Markdown>

      <div className="mt-4">
        <div
          className="btn-group w-100"
          role="group"
          aria-label="Character options"
        >
          <button
            type="button"
            className={
              'btn btn-info btn-sm p-2 text-center ' +
              (tab === Tab.Species ? 'active' : '')
            }
            onClick={() => setTab(Tab.Species)}
          >
            {t('Page.title.species')}
          </button>
          <button
            type="button"
            className={
              'btn btn-info btn-sm p-2 text-center ' +
              (tab === Tab.Focuses ? 'active' : '')
            }
            onClick={() => setTab(Tab.Focuses)}
          >
            {t('Construct.other.focuses')}
          </button>
          <button
            type="button"
            className={
              'btn btn-info btn-sm p-2 text-center ' +
              (tab === Tab.Values ? 'active' : '')
            }
            onClick={() => setTab(Tab.Values)}
          >
            {t('Construct.other.values')}
          </button>
          <button
            type="button"
            className={
              'btn btn-info btn-sm p-2 text-center ' +
              (tab === Tab.Talents ? 'active' : '')
            }
            onClick={() => setTab(Tab.Talents)}
          >
            {t('Construct.other.talents')}
          </button>
          <button
            type="button"
            className={
              'btn btn-info btn-sm p-2 text-center ' +
              (tab === Tab.Final ? 'active' : '')
            }
            onClick={() => setTab(Tab.Final)}
          >
            {t('Page.title.soloFinal')}
          </button>
        </div>
      </div>

      {renderTab()}

      <div className="mt-5 d-flex justify-content-between">
        <Button size="sm" onClick={onPreviousStep}>
          {t('Common.button.previous')}
        </Button>
        <Button size="sm" onClick={prepareForOnNextStep}>
          {t('Common.button.finish')}
        </Button>
      </div>
    </>
  );
};
