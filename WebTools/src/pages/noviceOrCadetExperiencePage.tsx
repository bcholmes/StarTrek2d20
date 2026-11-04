import React, { useEffect } from 'react';
import { supportsDeferredTalents } from '../helpers/lifepathTalentState';
import { Navigation } from '../common/navigator';
import Button from 'react-bootstrap/Button';
import { TalentDescription } from '../components/talentDescription';
import { ValueInput } from '../components/valueInput';
import {
  TALENT_NAME_UNTAPPED_POTENTIAL,
  TalentsHelper,
} from '../helpers/talents';
import { InstructionText } from '../components/instructionText';
import { Header } from '../components/header';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { useTranslation } from 'react-i18next';
import type { ICharacterProperties } from '../solo/page/soloCharacterProperties';
import { characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import { PageIdentity } from './pageIdentity';
import { store } from '../state/store';
import {
  StepContext,
  addCharacterTalent,
  recordLifepathTalentProgress,
  addCharacterUntappedPotentialAttribute,
  setCharacterValue,
} from '../state/characterActions';
import { CharacterType } from '../common/characterType';
import { randomUniqueValue } from '../solo/table/valueRandomTable';
import { Attribute, AttributesHelper } from '../helpers/attributes';
import { CheckBox } from '../components/checkBox';
import { makeKey } from '../common/translationKey';
import { Dialog } from '../components/dialog';
import { PageHistoryBasedPreviousButton } from '../components/pageHistoryBasedPreviousButton';

const NoviceOrCadetExperiencePageBase: React.FC<ICharacterProperties> = ({
  character,
}) => {
  const { t } = useTranslation();
  const talentModel = TalentsHelper.getTalent(TALENT_NAME_UNTAPPED_POTENTIAL);

  const onNext = () => {
    if (
      character.version > 1 &&
      !supportsDeferredTalents(character) &&
      character.careerStep?.talent?.attribute == null
    ) {
      Dialog.show(t('NoviceOrCadetExperiencePage.attribute.error'));
    } else if (character.type === CharacterType.Cadet) {
      store.dispatch(recordLifepathTalentProgress(StepContext.Career));
      Navigation.navigateToPage(PageIdentity.CadetSeniority);
    } else {
      store.dispatch(recordLifepathTalentProgress(StepContext.Career));
      Navigation.navigateToPage(PageIdentity.CareerEvent1);
    }
  };

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

  const onSelectAttribute = (attribute: Attribute) => {
    store.dispatch(addCharacterUntappedPotentialAttribute(attribute));
  };

  useEffect(() => {
    if (supportsDeferredTalents(character) && character.careerStep?.talent)
      return;
    // Initialize the fixed novice talent on entry; its attribute can be completed at review.
    store.dispatch(addCharacterTalent(talentModel, StepContext.Career));
  }, [talentModel]);

  const instruction =
    character.type === CharacterType.Cadet
      ? 'CareerLength.instruction.cadet'
      : 'CareerType.core.young.description';

  return (
    <div className="page container ms-0">
      <CharacterCreationBreadcrumbs
        pageIdentity={PageIdentity.NoviceOrCadetExperience}
      />
      <main>
        <Header>{t('Page.title.careerLength')}</Header>
        <InstructionText text={t(instruction)} />
        <div className="row">
          <div className="col-12 col-lg-6 mt-4">
            <Header level={2}>{t('Construct.other.value')}</Header>
            <ValueInput
              value={character.careerStep?.value ?? ''}
              onValueChanged={(value) => onValueChanged(value)}
              onRandomClicked={() => randomValue()}
              textDescription={t('Value.careerLength.young.text')}
            />
          </div>
          <div className="col-12 col-lg-6 mt-4">
            <Header level={2}>{t('Construct.other.talent')}</Header>
            {supportsDeferredTalents(character) && (
              <p>{t('LifepathTalentReview.fixedNovice')}</p>
            )}
            <TalentDescription
              name={talentModel.localizedDisplayName}
              description={
                character.version > 1
                  ? talentModel.localizedDescription2e
                  : talentModel.localizedDescription
              }
            />
          </div>
          {character.version === 1 ? undefined : (
            <div className="col-12 col-lg-6 mt-4">
              <Header level={2}>{t('Construct.other.attribute')}</Header>
              <InstructionText
                text={t('NoviceOrCadetExperiencePage.attribute.instruction')}
              />

              <table className="selection-list">
                <tbody>
                  {AttributesHelper.getAllAttributes().map((a, i) => {
                    return (
                      <tr key={i}>
                        <td className="selection-header-small">
                          {t(makeKey('Construct.attribute.', Attribute[a]))}
                        </td>
                        <td className="text-end">
                          <CheckBox
                            text=""
                            value={a}
                            isChecked={
                              character.careerStep?.talent?.attribute === a
                            }
                            onChanged={(val) => {
                              onSelectAttribute(a);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mt-5 d-flex justify-content-end">
          <PageHistoryBasedPreviousButton />
          <Button onClick={() => onNext()}>{t('Common.button.next')}</Button>
        </div>
      </main>
    </div>
  );
};

export const NoviceOrCadetExperiencePage = connect(
  characterMapStateToProperties,
)(NoviceOrCadetExperiencePageBase);
