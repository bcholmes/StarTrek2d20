import { recordLifepathTalentProgress } from '../state/characterActions';
import { OptionalTalentNote } from '../components/deferredTalentSelection';
import {
  supportsDeferredTalents,
  getLifepathTalentChoices,
} from '../helpers/lifepathTalents';
import React from 'react';
import { Navigation } from '../common/navigator';
import { PageIdentity } from './pageIdentity';
import { SpeciesHelper } from '../helpers/species';
import type { SpeciesModel } from '../helpers/speciesModel';
import { TalentsHelper } from '../helpers/talents';
import Button from 'react-bootstrap/Button';
import { CheckBox } from '../components/checkBox';
import { Dialog } from '../components/dialog';
import { Source } from '../helpers/sources';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { store } from '../state/store';
import {
  setAllowCrossSpeciesTalents,
  setAllowEsotericTalents,
} from '../state/contextActions';
import { connect } from 'react-redux';
import { hasSource } from '../state/contextFunctions';
import { InstructionText } from '../components/instructionText';
import { Header } from '../components/header';
import { AttributeListComponent } from '../components/attributeListComponent';
import { SingleTalentSelectionList } from '../components/singleTalentSelectionList';
import { useTranslation } from 'react-i18next';
import {
  StepContext,
  addCharacterTalent,
  setCharacterSpecies,
} from '../state/characterActions';
import type { ICharacterProperties } from '../solo/page/soloCharacterProperties';
import { SpeciesAttributeController } from '../components/speciesController';
import { Stereotype } from '../common/construct';

import ReactMarkdown from 'react-markdown';
import { SpeciesAbilityView } from '../components/speciesAbilityView';
import type { SelectedTalent } from '../common/selectedTalent';
import { determineSelectedTalentExtraErrors } from '../common/selectedTalentExtraCheck';
import { isTalentSelectable } from '../helpers/talentSelection';
import { useNavigate } from 'react-router';
import { Species } from '../helpers/speciesEnum';
import Markdown from 'react-markdown';
import { makeKey } from '../common/translationKey';
import { ModalControl } from '../components/modal';
import { SimpleSpeciesSelection } from '../components/simpleSpeciesSelection';
import { RankedTalent } from '../helpers/rankedTalent';
import { isKlingonWarriorType } from '../helpers/klingonWarrior';
import { PageHistoryBasedPreviousButton } from '../components/pageHistoryBasedPreviousButton';

interface ISpeciesDetailsProperties extends ICharacterProperties {
  allowCrossSpeciesTalents: boolean;
  allowEsotericTalents: boolean;
}

const SpeciesDetailsPageBase: React.FC<ISpeciesDetailsProperties> = ({
  character,
  allowCrossSpeciesTalents,
  allowEsotericTalents,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const species = SpeciesHelper.getSpeciesByType(
    character.speciesStep?.species,
  );
  const controller = SpeciesAttributeController.create(character, species);

  const selectDesc =
    species.attributes.length > 3 ? t('SpeciesDetails.selectThree') : '';

  const isTalentSelectionRequired = () => {
    if (
      character.stereotype === Stereotype.SoloCharacter ||
      character.stereotype === Stereotype.Npc
    ) {
      return false;
    } else if (
      character.version === 1 &&
      !isKlingonWarriorType(character.type)
    ) {
      return true;
    } else if (character.speciesStep?.ability == null) {
      return true;
    } else {
      return character.speciesStep.ability.talentNames?.length;
    }
  };

  const renderTraitSection = (species: SpeciesModel) => {
    const mixed =
      character.speciesStep?.mixedSpecies != null
        ? SpeciesHelper.getSpeciesByType(character.speciesStep?.mixedSpecies)
        : null;

    const mixedTrait =
      mixed != null ? (
        <div>
          <Header level={3}>
            <b>{mixed.localizedTrait}</b>
          </Header>
          <Markdown>
            {character.version > 1
              ? mixed.localizedTraitDescription2e
              : mixed.localizedTraitDescription}
          </Markdown>
        </div>
      ) : undefined;

    return (
      <div>
        <Header level={2}>{t('Construct.other.trait')}</Header>
        <Header level={3} className="text-white my-3">
          {species.localizedTrait}
        </Header>
        <Markdown>
          {character.version > 1
            ? species.localizedTraitDescription2e
            : species.localizedTraitDescription}
        </Markdown>
        {mixedTrait}
      </div>
    );
  };

  const filterTalentList = () => {
    return TalentsHelper.getAllAvailableTalentsForCharacter(character)
      .filter((t) => isTalentSelectable(character, t, character.speciesStep))
      .map((t) => {
        if (t.maxRank > 1) {
          if (character.speciesStep?.talent?.talent === t.name) {
            return new RankedTalent(t, character.getRankForTalent(t.name));
          } else {
            return new RankedTalent(t, character.getRankForTalent(t.name) + 1);
          }
        } else {
          return new RankedTalent(t);
        }
      });
  };

  const renderTalentsSection = () => {
    if (character.version === 1) {
      return renderVersion1TalentsSection();
    } else {
      return renderVersion2TalentsSection();
    }
  };

  const renderVersion2TalentsSection = () => {
    let talents = [];
    if (character.speciesStep?.ability == null) {
      const species = SpeciesHelper.getSpeciesByType(
        character.speciesStep?.species,
      );
      species.talents
        .map((t) => new RankedTalent(t))
        .forEach((t) => talents.push(t));
    } else if (character.speciesStep?.ability?.talentNames?.length) {
      character.speciesStep.ability.talentNames
        .map((t) => new RankedTalent(TalentsHelper.getTalent(t)))
        .forEach((t) => talents.push(t));
    }

    if (talents.length === 0) {
      talents = filterTalentList();
    }

    if (talents.length > 0 && isTalentSelectionRequired()) {
      return (
        <div>
          <SingleTalentSelectionList
            heading={t('Construct.other.talents')}
            talents={
              supportsDeferredTalents(character)
                ? getLifepathTalentChoices(character, StepContext.Species)
                : talents
            }
            construct={character}
            initialSelection={character.speciesStep?.talent}
            onSelection={(talent) => onTalentSelected(talent)}
          >
            <OptionalTalentNote
              character={character}
              context={StepContext.Species}
            />
          </SingleTalentSelectionList>
        </div>
      );
    } else {
      return undefined;
    }
  };

  const renderVersion1TalentsSection = () => {
    const talents: RankedTalent[] = [];
    talents.push(
      ...TalentsHelper.getAllAvailableTalentsForCharacter(character).map(
        (t) => new RankedTalent(t),
      ),
    );

    const esotericTalentOption = hasSource(Source.PlayersGuide) ? (
      <div>
        <CheckBox
          isChecked={allowEsotericTalents}
          text={t('SpeciesDetails.allowEsoteric')}
          value={!allowEsotericTalents}
          onChanged={() => {
            store.dispatch(setAllowEsotericTalents(!allowEsotericTalents));
          }}
        />
      </div>
    ) : undefined;

    if (talents.length > 0 && isTalentSelectionRequired()) {
      return (
        <div>
          <SingleTalentSelectionList
            heading={t('Construct.other.talents')}
            talents={talents}
            construct={character}
            initialSelection={character.speciesStep?.talent}
            onSelection={(talent) => onTalentSelected(talent)}
          >
            <div>{renderCrossSpeciesCheckbox()}</div>
            {esotericTalentOption}
          </SingleTalentSelectionList>
        </div>
      );
    } else {
      return (
        <div>
          <Header level={2}>{t('SpeciesDetails.options')}</Header>
          <div>{renderCrossSpeciesCheckbox()}</div>
          {esotericTalentOption}
        </div>
      );
    }
  };

  const closeModal = () => {
    ModalControl.hide();
  };

  const selectOriginalSpecies = (speciesModel: SpeciesModel) => {
    const species = character.speciesStep?.species;
    if (species === Species.CyberneticallyEnhanced) {
      store.dispatch(
        setCharacterSpecies(
          character.speciesStep?.species,
          character.speciesStep?.attributes,
          speciesModel.id,
        ),
      );
    } else if (species === Species.Kobali) {
      store.dispatch(
        setCharacterSpecies(
          character.speciesStep?.species,
          speciesModel.attributes,
          undefined,
          speciesModel.id,
        ),
      );
    } else {
      store.dispatch(
        setCharacterSpecies(
          character.speciesStep?.species,
          character.speciesStep?.attributes,
          undefined,
          speciesModel.id,
        ),
      );
    }
    closeModal();
  };

  const showOriginalSpeciesModal = () => {
    ModalControl.show(
      'xl',
      () => closeModal(),
      <SimpleSpeciesSelection
        onSelection={(species) => selectOriginalSpecies(species)}
        character={character}
        species={SpeciesHelper.getPrimarySpecies(
          character.type,
          true,
          character,
        )}
      />,
      t('SpeciesDetails.originalSpecies'),
    );
  };

  const isSpecialSpecies = () => {
    return [
      Species.Kobali,
      Species.Borg,
      Species.LiberatedBorg,
      Species.CyberneticallyEnhanced,
    ].includes(character.speciesStep?.species);
  };

  const renderExtraSpeciesDetails = () => {
    if (isSpecialSpecies()) {
      return (
        <div className="col-12 col-lg-6 my-4">
          <Header level={2}>{t('SpeciesDetails.originalSpecies')}</Header>
          <Markdown>
            {t(
              makeKey(
                'SpeciesDetails.originalSpecies.instruction.',
                Species[character.speciesStep?.species],
              ),
            )}
          </Markdown>

          <div className="d-flex flex-row-reverse justify-content-between align-items-center">
            <Button size="sm" onClick={() => showOriginalSpeciesModal()}>
              {t('Common.button.select')}
            </Button>
            {character.speciesStep?.originalSpecies != null ? (
              <p className="my-0">
                <b>
                  {
                    SpeciesHelper.getSpeciesByType(
                      character.speciesStep?.originalSpecies,
                    ).localizedName
                  }
                </b>
              </p>
            ) : undefined}
          </div>
        </div>
      );
    } else {
      return undefined;
    }
  };

  const renderCrossSpeciesCheckbox = () => {
    return (
      <CheckBox
        isChecked={allowCrossSpeciesTalents}
        text={t('SpeciesDetails.allowCrossSpecies')}
        value={!allowCrossSpeciesTalents}
        onChanged={() => {
          store.dispatch(
            setAllowCrossSpeciesTalents(!allowCrossSpeciesTalents),
          );
        }}
      />
    );
  };

  const onTalentSelected = (talent?: SelectedTalent) => {
    store.dispatch(addCharacterTalent(talent, StepContext.Species));
  };

  const onNext = () => {
    if (isSpecialSpecies() && character.speciesStep.originalSpecies == null) {
      Dialog.show(t('SpeciesDetails.error.originalSpecies'));
    } else if (!character.speciesStep?.isAttributeSelectionComplete) {
      Dialog.show(t('SpeciesDetails.error.attributes'));
    } else if (
      isTalentSelectionRequired() &&
      character.speciesStep?.talent == null &&
      !supportsDeferredTalents(character)
    ) {
      Dialog.show(t('Common.error.talent'));
    } else if (
      isTalentSelectionRequired() &&
      !supportsDeferredTalents(character) &&
      determineSelectedTalentExtraErrors(character.speciesStep?.talent) != null
    ) {
      Dialog.show(
        determineSelectedTalentExtraErrors(character.speciesStep?.talent),
      );
    } else if (
      character.speciesStep.species === Species.LiberatedBorg &&
      hasSource(Source.SpeciesSourcebook) &&
      !character.speciesStep?.abilityOptions?.implants?.length
    ) {
      Dialog.show(t('SpeciesDetails.error.implants'));
    } else if (
      character.speciesStep.ability?.isChoiceRequired &&
      character.speciesStep.abilityOptions?.choice == null
    ) {
      Dialog.show(t('SpeciesDetails.error.choice'));
    } else if (character.stereotype === Stereotype.Npc) {
      navigate('/npc/stats');
    } else {
      store.dispatch(recordLifepathTalentProgress(StepContext.Species));
      Navigation.navigateToPage(PageIdentity.Environment);
    }
  };

  return (
    <div className="page">
      <div className="container ms-0">
        <CharacterCreationBreadcrumbs
          pageIdentity={PageIdentity.SpeciesDetails}
        />
        <main>
          <Header>{character.localizedSpeciesName}</Header>
          <ReactMarkdown>
            {character.version === 2
              ? species.localizedDescription2e
              : species.localizedDescription}
          </ReactMarkdown>

          <div className="row">
            {renderExtraSpeciesDetails()}
            <div className="col-12 col-lg-6 my-4">
              <Header level={2}>
                <>
                  {t('Construct.other.attributes')} {selectDesc}
                </>
              </Header>
              {character.speciesStep?.species === Species.Kobali &&
              character.speciesStep?.originalSpecies == null ? (
                <p>{t('SpeciesDetails.attributes.instruction.kobali')}</p>
              ) : (
                <>
                  <AttributeListComponent controller={controller} />
                  <InstructionText text={controller.instructions} />
                </>
              )}

              {character.speciesStep?.ability ? (
                <div className="mt-5 mt-4">
                  <SpeciesAbilityView character={character} />
                </div>
              ) : undefined}
            </div>
            <div className="col-12 col-lg-6 my-4">
              {renderTraitSection(species)}
            </div>
          </div>
          {renderTalentsSection()}
          <div className="text-end mt-4 d-flex justify-content-end">
            {character.stereotype === Stereotype.MainCharacter ? (
              <PageHistoryBasedPreviousButton />
            ) : undefined}
            <Button onClick={() => onNext()}>{t('Common.button.next')}</Button>
          </div>
        </main>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    character: state.character?.currentCharacter,
    allowCrossSpeciesTalents: state.context.allowCrossSpeciesTalents,
    allowEsotericTalents: state.context.allowEsotericTalents,
  };
}

export const SpeciesDetailsPage = connect(mapStateToProps)(
  SpeciesDetailsPageBase,
);
