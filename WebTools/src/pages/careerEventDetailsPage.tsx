import React, { useState } from 'react';
import { Navigation } from '../common/navigator';
import { PageIdentity } from './pageIdentity';
import { CareerEventsHelper } from '../helpers/careerEvents';
import { AttributesHelper } from '../helpers/attributes';
import Button from 'react-bootstrap/Button';
import { Dialog } from '../components/dialog';
import { AttributeView } from '../components/attribute';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { CharacterType } from '../common/characterType';
import {
  StepContext,
  setCharacterCareerEventNotes,
  setCharacterCareerEventTrait,
  setCharacterFinishingTouches,
  setCharacterFocus,
} from '../state/characterActions';
import { DisciplineListComponent } from '../components/disciplineListComponent';
import { Department } from '../helpers/department';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/header';
import { AttributeListComponent } from '../components/attributeListComponent';
import { makeKey } from '../common/translationKey';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import ReactMarkdown from 'react-markdown';
import { store } from '../state/store';
import { connect } from 'react-redux';
import type { ICharacterProperties } from '../solo/page/soloCharacterProperties';
import { characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import {
  CareerEventAttributeController,
  CareerEventDisciplineController,
} from '../components/careerEventDetailsControllers';
import { FocusSelectionView } from '../components/focusSelectionView';
import { PageHistoryBasedPreviousButton } from '../components/pageHistoryBasedPreviousButton';
import { RichTextEditor } from '../components/richTextEditor';
import { STAMarkdown } from '../components/staMarkdown';

interface ICareerEventDetailsProperties extends ICharacterProperties {
  context: StepContext;
}

const CareerEventDetailsPageBase: React.FC<ICareerEventDetailsProperties> = ({
  character,
  context,
}) => {
  const { t } = useTranslation();

  const onNotesChanged = (value: string) => {
    store.dispatch(setCharacterCareerEventNotes(value, context));
  };

  const careerEventStep =
    context === StepContext.CareerEvent1
      ? character.careerEvents[0]
      : character.careerEvents[1];

  const careerEvent = CareerEventsHelper.getCareerEvent(
    careerEventStep?.id,
    character.type,
    character.version,
  );

  const [ showAdvanced, setShowAdvanced ] = useState<boolean>(careerEventStep?.notes?.length ? true : false);

  const navigateToNextStep = () => {
    if (careerEventStep.attribute == null) {
      Dialog.show(t('CareerEventDetails.errorAttribute'));
    } else if (careerEventStep.discipline == null) {
      Dialog.show(t('CareerEventDetails.errorDiscipline'));
    } else if (!careerEventStep.focus) {
      Dialog.show(t('Common.error.focus'));
    } else {
      if (
        context === StepContext.CareerEvent2 ||
        character.type === CharacterType.Cadet
      ) {
        store.dispatch(setCharacterFinishingTouches());
        Navigation.navigateToPage(PageIdentity.AttributesAndDisciplines);
      } else {
        Navigation.navigateToPage(PageIdentity.CareerEvent2);
      }
    }
  };

  const attributeController = new CareerEventAttributeController(
    character,
    careerEventStep,
    context,
    careerEvent.attributes,
  );
  const disciplineController = new CareerEventDisciplineController(
    character,
    careerEventStep,
    context,
    careerEvent.disciplines,
  );

  return (
    <div className="page container ms-0">
      <CharacterCreationBreadcrumbs />

      <Header>{careerEvent.localizedName}</Header>
      <ReactMarkdown children={careerEvent.localizedDescription} />
      <div className="row">
        <div className="col-lg-6 my-3">
          <Header level={2} className="mb-3">
            {t('Construct.other.attribute')}
          </Header>
          {careerEvent.attributes.length === 1 ? (
            <div>
              <AttributeView
                name={t(
                  makeKey(
                    'Construct.attribute.',
                    AttributesHelper.getAttributeName(
                      careerEvent.attributes[0],
                    ),
                  ),
                )}
                points={1}
                value={character.attributes[careerEvent.attributes[0]]}
              />
            </div>
          ) : (
            <AttributeListComponent controller={attributeController} />
          )}
        </div>
        <div className="col-lg-6 my-3">
          <Header level={2} className="mb-3">
            {t('Construct.other.discipline')}
          </Header>
          {careerEvent.disciplines.length === 1 ? (
            <div>
              <AttributeView
                name={t(
                  makeKey(
                    'Construct.discipline.',
                    Department[careerEvent.disciplines[0]],
                  ),
                )}
                points={1}
                value={character.departments[careerEvent.disciplines[0]]}
              />
            </div>
          ) : (
            <DisciplineListComponent controller={disciplineController} />
          )}
        </div>
        <div className="col-lg-6 my-3">
          <Header level={2} className="mb-3">
            {t('Construct.other.focus')}
          </Header>
          <FocusSelectionView
            value={careerEventStep?.focus || ''}
            addFocus={(v) => store.dispatch(setCharacterFocus(v, context))}
            suggestions={careerEvent.localizedFocusSuggestion}
            randomFocusDepartment={careerEventStep.discipline}
            hints={careerEvent.focuses}
            character={character}
          />
        </div>
        {careerEvent.localizedTraitDescription?.length ? (
          <div className="col-lg-6 my-3">
            <Header level={2} className="mb-3">
              {t('Construct.other.trait')}
            </Header>
            <InputFieldAndLabel
              id="trait"
              labelName={t('Construct.other.trait')}
              value={careerEventStep.trait ?? ''}
              onChange={(t) =>
                store.dispatch(setCharacterCareerEventTrait(t, context))
              }
            />
            <div className="text-white mt-3">
              {careerEvent.localizedTraitDescription}
            </div>
          </div>
        ) : undefined}

        {careerEvent.special ? (
          <div className="col-lg-6 my-3">
            <Header level={2} className="mb-3">
              Special
            </Header>
            <p>{careerEvent.special}</p>
          </div>
        ) : undefined}
      </div>

      <div className='row'>
          {showAdvanced
            ?

              (<div className="col-12 mt-4">
              <Header level={2} className="mb-3">
                {t('Construct.other.description')}
              </Header>
              <STAMarkdown>{t('CareerEventDetails.notesInstructions')}</STAMarkdown>
              <RichTextEditor
                onChange={onNotesChanged}
                initialText={careerEventStep.notes}
              />
              </div>)
            :
              (<div className="col-12 mt-4 text-end">
              <Button
                variant="link"
                className="text-secondary px-0"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {t('Common.button.advanced')}
              </Button>
            </div>)
          }
      </div>

      <div className="mt-4 d-flex justify-content-end">
        <PageHistoryBasedPreviousButton />
        <Button onClick={() => navigateToNextStep()}>
          {t('Common.button.next')}
        </Button>
      </div>
    </div>
  );
};

export const CareerEventDetailsPage = connect(characterMapStateToProperties)(
  CareerEventDetailsPageBase,
);
