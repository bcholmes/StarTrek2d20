import React, { useEffect, useState } from 'react';
import { Navigation } from '../common/navigator';
import { PageIdentity } from './pageIdentity';
import type { CareerModel } from '../helpers/careers';
import { CareersHelper } from '../helpers/careers';
import Button from 'react-bootstrap/Button';
import { Dialog } from '../components/dialog';
import { TalentDescription } from '../components/talentDescription';
import { ValueInput } from '../components/valueInput';
import { TalentsHelper } from '../helpers/talents';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { SingleTalentSelectionList } from '../components/singleTalentSelectionList';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/header';
import { randomUniqueValue } from '../solo/table/valueRandomTable';
import { Career } from '../helpers/careerEnum';
import { store } from '../state/store';
import {
  StepContext,
  addCharacterTalent,
  setCharacterValue,
} from '../state/characterActions';
import type { ICharacterProperties } from '../solo/page/soloCharacterProperties';
import { characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import type { SelectedTalent } from '../common/selectedTalent';
import { determineSelectedTalentExtraErrors } from '../common/selectedTalentExtraCheck';
import { isTalentSelectable } from '../helpers/talentSelection';
import { hasSource, isSecondEdition } from '../state/contextFunctions';
import { Source } from '../helpers/sources';
import { RankedTalent } from '../helpers/rankedTalent';
import { PageHistoryBasedPreviousButton } from '../components/pageHistoryBasedPreviousButton';

const CareerLengthDetailsPageBase: React.FC<ICharacterProperties> = ({
  character,
}) => {
  const { t } = useTranslation();
  const [talentName, setTalentName] = useState(null);
  const career = CareersHelper.instance.getCareer(
    character.careerStep?.career,
    character,
  );
  let wroteTheBook =
    career.id === Career.Veteran
      ? TalentsHelper.getTalent('Wrote the Book')
      : undefined;
  if (
    !isSecondEdition() ||
    !hasSource(Source.TechnicalManual) ||
    !wroteTheBook?.isPrerequisiteFulfilled(character)
  ) {
    wroteTheBook = undefined;
  }
  let lifeLessons =
    career.id === Career.Veteran
      ? TalentsHelper.getTalent('Life Lessons')
      : undefined;
  if (
    !isSecondEdition() ||
    !hasSource(Source.ExplorationGuide) ||
    !lifeLessons?.isPrerequisiteFulfilled(character)
  ) {
    lifeLessons = undefined;
  }

  useEffect(() => {
    if (career.talent != null && wroteTheBook === undefined) {
      store.dispatch(addCharacterTalent(career.talent, StepContext.Career));
      setTalentName(career.talent.name);
    }
  }, [career.id, career.talent, wroteTheBook]);

  const randomValue = () => {
    const value = randomUniqueValue(
      character.values,
      character.speciesStep?.species,
      character.educationStep?.primaryDiscipline,
    );
    onValueChanged(value);
  };

  const onValueChanged = (value: string) => {
    store.dispatch(setCharacterValue(value, StepContext.Career));
  };

  const renderMainBody = (career: CareerModel) => {
    let textDescription = t('Value.careerLength.experienced.text');
    if (career.id === Career.Young) {
      textDescription = t('Value.careerLength.young.text');
    } else if (career.id === Career.Veteran) {
      textDescription = t('Value.careerLength.veteran.text');
    }

    if (career.talent != null && filterTalentList().length <= 1) {
      return (
        <div className="row">
          <div className="col-md-6 my-3">
            <Header level={2}>{t('Construct.other.value')}</Header>
            <ValueInput
              value={character.careerStep?.value ?? ''}
              onValueChanged={(value) => onValueChanged(value)}
              onRandomClicked={() => randomValue()}
              textDescription={textDescription}
            />
          </div>

          <div className="col-md-6 my-3">
            <Header level={2}>{t('Construct.other.talent')}</Header>
            <TalentDescription
              name={career.talent.localizedDisplayName}
              description={
                character.version > 1
                  ? career.talent.localizedDescription2e
                  : career.talent.localizedDescription
              }
            />
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className="row">
            <div className="col-md-6 my-3">
              <Header level={2}>{t('Construct.other.value')}</Header>
              <ValueInput
                value={character.careerStep?.value ?? ''}
                onValueChanged={(value) => onValueChanged(value)}
                onRandomClicked={() => randomValue()}
                textDescription={textDescription}
              />
            </div>
          </div>

          <div className="my-3">
            <SingleTalentSelectionList
              heading={t('Construct.other.talent')}
              talents={filterTalentList()}
              initialSelection={character.careerStep?.talent}
              construct={character}
              onSelection={(talent) => {
                onTalentSelected(talent);
              }}
            />
          </div>
        </>
      );
    }
  };

  const filterTalentList = (): RankedTalent[] => {
    if (career.id === Career.Veteran) {
      const result = [new RankedTalent(TalentsHelper.getTalent('Veteran'))];

      if (wroteTheBook != null) {
        result.push(new RankedTalent(wroteTheBook));
      }
      if (lifeLessons != null) {
        result.push(new RankedTalent(lifeLessons));
      }
      return result;
    } else {
      return TalentsHelper.getAllAvailableTalentsForCharacter(character)
        .filter((t) => isTalentSelectable(character, t, character.careerStep))
        .map((t) => {
          if (t.maxRank > 1) {
            if (character.careerStep?.talent?.talent === t.name) {
              return new RankedTalent(t, character.getRankForTalent(t.name));
            } else {
              return new RankedTalent(
                t,
                character.getRankForTalent(t.name) + 1,
              );
            }
          } else {
            return new RankedTalent(t);
          }
        });
    }
  };

  const onTalentSelected = (talent: SelectedTalent) => {
    setTalentName(talent?.talent);
    store.dispatch(addCharacterTalent(talent, StepContext.Career));
  };

  const onNext = () => {
    if (!talentName) {
      Dialog.show('You must select a Talent before proceeding.');
    } else if (
      determineSelectedTalentExtraErrors(character.careerStep?.talent) != null
    ) {
      Dialog.show(
        determineSelectedTalentExtraErrors(character.careerStep?.talent),
      );
    } else {
      Navigation.navigateToPage(PageIdentity.CareerEvent1);
    }
  };

  return (
    <div className="page container ms-0">
      <CharacterCreationBreadcrumbs />

      <Header>{career.localizedName}</Header>
      <p>{career.localizedDescription}</p>

      {renderMainBody(career)}

      <div className="mt-4 d-flex justify-content-end">
        <PageHistoryBasedPreviousButton />
        <Button onClick={() => onNext()}>{t('Common.button.next')}</Button>
      </div>
    </div>
  );
};

export const CareerLengthDetailsPage = connect(characterMapStateToProperties)(
  CareerLengthDetailsPageBase,
);
