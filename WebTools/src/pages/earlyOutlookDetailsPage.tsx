import React, { useState } from 'react';
import { Navigation } from '../common/navigator';
import { AttributesHelper } from '../helpers/attributes';
import { AttributeView } from '../components/attribute';
import Button from 'react-bootstrap/Button';
import { Dialog } from '../components/dialog';
import { CheckBox } from '../components/checkBox';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { SingleTalentSelectionList } from '../components/singleTalentSelectionList';
import { InstructionText } from '../components/instructionText';
import { Header } from '../components/header';
import { useTranslation } from 'react-i18next';
import type { ICharacterProperties } from '../solo/page/soloCharacterProperties';
import {
  addCharacterTalent,
  setCharacterEarlyOutlook,
  setCharacterFocus,
  setCharacterStepNotes,
  StepContext,
} from '../state/characterActions';
import { store } from '../state/store';
import { PageIdentity } from './pageIdentity';
import { connect } from 'react-redux';
import { EarlyOutlookDiscplineController } from '../components/earlyOutlookControllers';
import { DisciplineListComponent } from '../components/disciplineListComponent';
import { CharacterType } from '../common/characterType';
import { makeKey } from '../common/translationKey';
import { DisciplinesOrDepartments } from '../view/disciplinesOrDepartments';
import { TalentSettingsView } from '../components/talentSettingsView';
import type { SelectedTalent } from '../common/selectedTalent';
import { FocusSelectionView } from '../components/focusSelectionView';
import { determineSelectedTalentExtraErrors } from '../common/selectedTalentExtraCheck';
import { getEarlyOutlookTalents } from '../helpers/earlyOutlookTalents';
import { PageHistoryBasedPreviousButton } from '../components/pageHistoryBasedPreviousButton';
import { STAMarkdown } from '../components/staMarkdown';
import { RichTextEditor } from '../components/richTextEditor';

const EarlyOutlookDetailsPageBase: React.FC<ICharacterProperties> = ({
  character,
}) => {
  const { t } = useTranslation();
  const earlyOutlook = character.upbringingStep?.upbringing;
  const disciplineController = new EarlyOutlookDiscplineController(
    character,
    earlyOutlook,
  );

  const [showAdvanced, setShowAdvanced] = useState<boolean>(
    character?.upbringingStep?.notes?.length ? true : false,
  );

  const onNotesChanged = (value: string) => {
    store.dispatch(setCharacterStepNotes(value, StepContext.EarlyOutlook));
  };

  const changeAccepted = (accepted: boolean) => {
    store.dispatch(setCharacterEarlyOutlook(earlyOutlook, accepted));
  };

  const navigateToNextPage = () => {
    if (character.upbringingStep?.discipline == null) {
      Dialog.show(t('UpbringingDetailPage.error.discipline'));
    } else if (!character.upbringingStep?.focus) {
      Dialog.show(t('UpbringingDetailPage.error.focus'));
    } else if (character.upbringingStep?.talent == null) {
      Dialog.show(t('UpbringingDetailPage.error.talent'));
    } else {
      const error = determineSelectedTalentExtraErrors(
        character.upbringingStep?.talent,
      );
      if (error?.length) {
        Dialog.show(error);
      } else if (character.type === CharacterType.Child) {
        Navigation.navigateToPage(PageIdentity.ChildEducationPage);
      } else {
        Navigation.navigateToPage(PageIdentity.Career);
      }
    }
  };

  const onTalentSelected = (talent: SelectedTalent) => {
    store.dispatch(addCharacterTalent(talent, StepContext.EarlyOutlook));
  };

  const attributes = character.upbringingStep?.acceptedUpbringing ? (
    <div>
      <AttributeView
        name={t(
          makeKey(
            'Construct.attribute.',
            AttributesHelper.getAttributeName(
              earlyOutlook.attributeAcceptPlus2,
            ),
          ),
        )}
        points={2}
        value={character.attributes[earlyOutlook.attributeAcceptPlus2]}
      />
      <AttributeView
        name={t(
          makeKey(
            'Construct.attribute.',
            AttributesHelper.getAttributeName(
              earlyOutlook.attributeAcceptPlus1,
            ),
          ),
        )}
        points={1}
        value={character.attributes[earlyOutlook.attributeAcceptPlus1]}
      />
    </div>
  ) : (
    <div>
      <AttributeView
        name={t(
          makeKey(
            'Construct.attribute.',
            AttributesHelper.getAttributeName(earlyOutlook.attributeRebelPlus2),
          ),
        )}
        points={2}
        value={character.attributes[earlyOutlook.attributeRebelPlus2]}
      />
      <AttributeView
        name={t(
          makeKey(
            'Construct.attribute.',
            AttributesHelper.getAttributeName(earlyOutlook.attributeRebelPlus1),
          ),
        )}
        points={1}
        value={character.attributes[earlyOutlook.attributeRebelPlus1]}
      />
    </div>
  );

  const talents = getEarlyOutlookTalents(character);

  return (
    <div className="page container ms-0">
      <CharacterCreationBreadcrumbs
        pageIdentity={PageIdentity.UpbringingDetails}
      />
      <Header>{earlyOutlook.localizedName}</Header>

      <InstructionText text={earlyOutlook.localizedDescription} />

      <div className="row">
        <div className="col-lg-6 my-3">
          <p>{t('UpbringingDetailPage.text')}</p>
          <CheckBox
            isChecked={character.upbringingStep?.acceptedUpbringing}
            text={t('UpbringingDetailPage.text.accept')}
            value={1}
            onChanged={() => changeAccepted(true)}
          />
          <CheckBox
            isChecked={!character.upbringingStep?.acceptedUpbringing}
            text={t('UpbringingDetailPage.text.reject')}
            value={0}
            onChanged={() => changeAccepted(false)}
          />
        </div>
        <div className="col-md-6 my-3">
          <Header level={2}>{t('Construct.other.attributes')}</Header>
          {attributes}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 my-3">
          <Header level={2}>
            <DisciplinesOrDepartments character={character} />
            <>{' (' + t('Common.text.selectOne') + ')'}</>
          </Header>
          <DisciplineListComponent controller={disciplineController} />
        </div>
        <div className="my-3 col-lg-6">
          <Header level={2}>{t('Construct.other.focus')}</Header>
          <p>{earlyOutlook.localizedFocusDescription}</p>
          <FocusSelectionView
            value={character.upbringingStep?.focus || ''}
            character={character}
            randomFocusDepartment={character.upbringingStep?.discipline}
            addFocus={(v) =>
              store.dispatch(setCharacterFocus(v, StepContext.EarlyOutlook))
            }
            hints={earlyOutlook.focusSuggestions}
          />
        </div>
      </div>
      <div>
        <Header level={2}>{t('Construct.other.talent')}</Header>
        {character.version > 1 ? <TalentSettingsView /> : undefined}
        <SingleTalentSelectionList
          talents={talents}
          initialSelection={character.upbringingStep?.talent}
          onSelection={(talent) => {
            onTalentSelected(talent);
          }}
          construct={character}
        />
      </div>
      <div className="row">
        {showAdvanced ? (
          <div className="col-12 mt-4">
            <Header level={2} className="mb-3">
              {t('Construct.other.description')}
            </Header>
            <STAMarkdown>
              {t('UpbringingDetailPage.notes.instruction')}
            </STAMarkdown>
            <RichTextEditor
              onChange={onNotesChanged}
              initialText={character?.upbringingStep?.notes}
            />
          </div>
        ) : (
          <div className="col-12 mt-4 text-end">
            <Button
              variant="link"
              className="text-secondary px-0"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {t('Common.button.advanced')}
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 d-flex justify-content-end">
        <PageHistoryBasedPreviousButton />
        <Button onClick={() => navigateToNextPage()}>
          {t('Common.button.next')}
        </Button>
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

export const EarlyOutlookDetailsPage = connect(mapStateToProps)(
  EarlyOutlookDetailsPageBase,
);
