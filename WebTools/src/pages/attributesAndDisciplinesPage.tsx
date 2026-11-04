import { LifepathTalentReview } from '../components/deferredTalentSelection';
import {
  supportsDeferredTalents,
  finalLifepathTalentErrors,
} from '../helpers/lifepathTalents';
import React, { useEffect } from 'react';
import { Character } from '../common/character';
import { Navigation } from '../common/navigator';
import { PageIdentity } from './pageIdentity';
import { TalentsHelper } from '../helpers/talents';
import Button from 'react-bootstrap/Button';
import { Dialog } from '../components/dialog';
import { ValueInput } from '../components/valueInput';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { CharacterType } from '../common/characterType';
import { SingleTalentSelectionList } from '../components/singleTalentSelectionList';
import { randomUniqueValue } from '../solo/table/valueRandomTable';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/header';
import { InstructionText } from '../components/instructionText';
import {
  FinishingTouchesAttributeController,
  FinishingTouchesDisciplineController,
} from '../components/finishingTouchesControllers';
import type { ICharacterProperties } from '../solo/page/soloCharacterProperties';
import { characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import { AttributeListComponent } from '../components/attributeListComponent';
import { DisciplineListComponent } from '../components/disciplineListComponent';
import { store } from '../state/store';
import {
  addCharacterTalent,
  setCharacterFinishingTouches,
  setCharacterValue,
  StepContext,
} from '../state/characterActions';
import { isSecondEdition } from '../state/contextFunctions';
import { determineSelectedTalentExtraErrors } from '../common/selectedTalentExtraCheck';
import { isTalentSelectable } from '../helpers/talentSelection';
import { RankedTalent } from '../helpers/rankedTalent';
import { isKlingonWarriorType } from '../helpers/klingonWarrior';
import { PageHistoryBasedPreviousButton } from '../components/pageHistoryBasedPreviousButton';

const AttributesAndDisciplinesPageBase: React.FC<ICharacterProperties> = ({
  character,
}) => {
  const { t } = useTranslation();

  const randomValue = () => {
    const value = randomUniqueValue(
      character.values,
      character.speciesStep?.species,
      character.educationStep?.primaryDiscipline,
    );
    store.dispatch(setCharacterValue(value, StepContext.FinishingTouches));
  };

  const filterTalentList = () => {
    return TalentsHelper.getAllAvailableTalentsForCharacter(character)
      .filter((t) => isTalentSelectable(character, t, character.finishingStep))
      .map((t) => {
        if (t.maxRank > 1) {
          if (character.finishingStep?.talent?.talent === t.name) {
            return new RankedTalent(t, character.getRankForTalent(t.name));
          } else {
            return new RankedTalent(t, character.getRankForTalent(t.name) + 1);
          }
        } else {
          return new RankedTalent(t);
        }
      });
  };

  const isTalentSelectionNeeded = () => {
    return isSecondEdition() || isKlingonWarriorType(character.type);
  };

  const navigateToNextPage = () => {
    const errors = finalLifepathTalentErrors(character);
    if (errors.length) {
      Dialog.show(errors.join('\n'));
      return;
    }
    if (character.finishingStep?.attributes.length !== attributeCount) {
      Dialog.show(
        t('SoloFinishingTouchesPage.errorAttributes', {
          count: attributeCount,
        }),
      );
    } else if (
      character.finishingStep?.disciplines.length !== disciplineCount
    ) {
      Dialog.show(
        t('SoloFinishingTouchesPage.errorDisciplines', {
          count: disciplineCount,
        }),
      );
    } else if (!character.finishingStep?.value == null) {
      Dialog.show(t('SoloFinishingTouchesPage.errorValue'));
    } else if (
      isTalentSelectionNeeded() &&
      character?.finishingStep?.talent == null
    ) {
      Dialog.show(t('Common.error.talent'));
    } else if (
      isTalentSelectionNeeded() &&
      determineSelectedTalentExtraErrors(character.finishingStep.talent) != null
    ) {
      Dialog.show(
        determineSelectedTalentExtraErrors(character.finishingStep.talent),
      );
    } else {
      Navigation.navigateToPage(PageIdentity.Finish);
    }
  };

  let attributeTotal = 0;
  character.attributes.forEach((a) => (attributeTotal += a));
  attributeTotal -= character.finishingStep?.attributes?.length ?? 0;
  const attributeCount =
    Character.totalAttributeSum(character) - attributeTotal;

  let disciplineTotal = 0;
  character.departments.forEach((a) => (disciplineTotal += a));
  disciplineTotal -= character.finishingStep?.disciplines?.length ?? 0;

  const disciplineCount =
    Character.totalDepartmentSum(character) - disciplineTotal;

  const attributeController = new FinishingTouchesAttributeController(
    character,
    attributeCount,
  );
  const disciplineController = new FinishingTouchesDisciplineController(
    character,
    disciplineCount,
  );

  const talents = supportsDeferredTalents(character) ? [] : filterTalentList();

  const talentSelection =
    !supportsDeferredTalents(character) &&
    (isKlingonWarriorType(character.type) || character.version > 1) ? (
      <div className="my-4">
        <SingleTalentSelectionList
          heading={t('Construct.other.talents')}
          talents={talents}
          construct={character}
          initialSelection={character.finishingStep?.talent}
          onSelection={(talent) => {
            store.dispatch(
              addCharacterTalent(talent, StepContext.FinishingTouches),
            );
          }}
        />
      </div>
    ) : undefined;

  const excessAttrPoints = attributeCount - 2;
  const attributeText =
    excessAttrPoints > 0 ? (
      <p>
        The point total includes {excessAttrPoints} excess{' '}
        {excessAttrPoints > 1 ? ' Points ' : ' Point '} that could not be
        automatically added to your attributes without exceeding maximum values.
      </p>
    ) : undefined;

  const excessSkillPoints = disciplineCount - 2;
  const disciplinesText =
    excessSkillPoints > 0 ? (
      <p>
        The point total includes {excessSkillPoints} excess{' '}
        {excessSkillPoints > 1 ? ' Points ' : ' Point '} that could not be
        automatically added to your dsciplines without exceeding maximum values.
      </p>
    ) : undefined;

  useEffect(() => {
    if (character.finishingStep == null) {
      store.dispatch(setCharacterFinishingTouches());
    }
  }, [character.finishingStep]);

  const value =
    character.type !== CharacterType.Child &&
    character.type !== CharacterType.Cadet ? (
      <div className="col-lg-6 mt-4">
        <Header level={2}>{t('Construct.other.value')}</Header>
        <ValueInput
          value={character.finishingStep?.value ?? ''}
          onValueChanged={(value) =>
            store.dispatch(
              setCharacterValue(value, StepContext.FinishingTouches),
            )
          }
          onRandomClicked={() => randomValue()}
          textDescription={t('Value.final.text')}
        />
      </div>
    ) : undefined;

  return (
    <div className="page container ms-0">
      <CharacterCreationBreadcrumbs
        pageIdentity={PageIdentity.AttributesAndDisciplines}
      />
      <Header>{t('Page.title.finish')}</Header>
      <InstructionText text={t('AttributesAndDisciplines.instruction')} />
      <div className="row">
        <div className="col-lg-6 my-3">
          <Header level={2} className="mb-3">
            <>
              {t('Construct.other.attribute')}{' '}
              {t('SoloFinishingTouchesPage.select', { count: attributeCount })}
            </>
          </Header>
          {attributeText}
          <AttributeListComponent controller={attributeController} />
        </div>
        <div className="col-lg-6 my-3">
          <Header level={2} className="mb-3">
            <>
              {t('Construct.other.discipline')}{' '}
              {t('SoloFinishingTouchesPage.select', { count: disciplineCount })}
            </>
          </Header>
          {disciplinesText}
          <DisciplineListComponent controller={disciplineController} />
        </div>
        {value}
      </div>

      <LifepathTalentReview character={character} />
      {talentSelection}

      <div className="mt-4 d-flex justify-content-end">
        <PageHistoryBasedPreviousButton />
        <Button onClick={() => navigateToNextPage()}>
          {t('Common.button.finish')}
        </Button>
      </div>
    </div>
  );
};

export const AttributesAndDisciplinesPage = connect(
  characterMapStateToProperties,
)(AttributesAndDisciplinesPageBase);
