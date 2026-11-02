import React from 'react';
import { CharacterType } from '../common/characterType';
import { Navigation } from '../common/navigator';
import type { TrackModel } from '../helpers/tracks';
import { TracksHelper } from '../helpers/tracks';
import { Department } from '../helpers/department';
import Button from 'react-bootstrap/Button';
import { Dialog } from '../components/dialog';
import { ValueInput } from '../components/valueInput';
import { SkillView as DepartmentView } from '../components/skill';
import { TalentsHelper } from '../helpers/talents';
import { Header } from '../components/header';
import { CharacterCreationBreadcrumbs } from '../components/characterCreationBreadcrumbs';
import { SingleTalentSelectionList } from '../components/singleTalentSelectionList';
import { Track } from '../helpers/trackEnum';
import { randomUniqueValue } from '../solo/table/valueRandomTable';
import { useTranslation } from 'react-i18next';
import { InstructionText } from '../components/instructionText';
import ReactMarkdown from 'react-markdown';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import { store } from '../state/store';
import {
  StepContext,
  addCharacterTalent,
  setCharacterFocus,
  setCharacterValue,
} from '../state/characterActions';
import type { ICharacterProperties } from '../solo/page/soloCharacterProperties';
import { characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import {
  EducationAttributeController,
  EducationPrimaryDisciplineController,
  EducationSecondaryDisciplineController,
} from '../components/educationControllers';
import { AttributeListComponent } from '../components/attributeListComponent';
import { DisciplineListComponent } from '../components/disciplineListComponent';
import { PageIdentity } from './pageIdentity';
import { Stereotype } from '../common/construct';
import { D20IconButton } from '../solo/component/d20IconButton';
import { focusRandomTableWithHints } from '../solo/table/focusRandomTable';
import { localizedFocus } from '../components/focusHelper';
import type { SelectedTalent } from '../common/selectedTalent';
import { determineSelectedTalentExtraErrors } from '../common/selectedTalentExtraCheck';
import { isTalentSelectable } from '../helpers/talentSelection';
import { RankedTalent } from '../helpers/rankedTalent';
import { DisciplinesOrDepartments } from '../view/disciplinesOrDepartments';
import { isKlingonWarriorType } from '../helpers/klingonWarrior';
import { PageHistoryBasedPreviousButton } from '../components/pageHistoryBasedPreviousButton';

const EducationDetailsPageBase: React.FC<ICharacterProperties> = ({
  character,
}) => {
  const { t } = useTranslation();
  const track =
    character.stereotype === Stereotype.SoloCharacter
      ? TracksHelper.instance.getSoloTrack(character.educationStep?.track)
      : TracksHelper.instance.getTrack(
          character.educationStep?.track,
          character.type,
          character.version,
        );
  const attributeController = new EducationAttributeController(
    character,
    track,
  );
  const primaryDisciplineController = new EducationPrimaryDisciplineController(
    character,
    track,
  );
  const secondaryDisciplineController =
    new EducationSecondaryDisciplineController(character, track);

  const randomValue = () => {
    const value = randomUniqueValue(
      character.values,
      character.speciesStep?.species,
      character.educationStep?.primaryDiscipline,
    );
    onValueChanged(value);
  };

  const selectRandomFocus = (index: number) => {
    let done = false;
    while (!done) {
      const focus = localizedFocus(
        focusRandomTableWithHints(
          character.educationStep?.primaryDiscipline,
          track.focuses.focusSuggestions,
        ),
      );
      if (character.focuses.indexOf(focus) < 0) {
        done = true;
        store.dispatch(setCharacterFocus(focus, StepContext.Education, index));
      }
    }
  };

  const onValueChanged = (value: string) => {
    store.dispatch(setCharacterValue(value, StepContext.Education));
  };

  const renderFocuses = (track: TrackModel) => {
    let training =
      'Select three focuses for your character, at least one reflecting the time at Starfleet Academy.';
    if (isKlingonWarriorType(character.type)) {
      if (character.enlisted) {
        training =
          'Select three focuses for your character, at least one reflecting their time training.';
      } else {
        training =
          'Select three focuses for your character, at least one reflecting the time at KDF Academy.';
      }
    } else if (track.id === Track.EnlistedSecurityTraining) {
      training =
        'Select two focuses for your character. You have already gained the *Chain of Command* focus.';
    }

    return (
      <div className="col-lg-6 my-3">
        <Header level={2}>{t('Construct.other.focuses')}</Header>
        <ReactMarkdown>{training}</ReactMarkdown>

        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <InputFieldAndLabel
            id="focus1"
            labelName={t('Construct.other.focus1')}
            value={character.educationStep?.focuses[0] || ''}
            className="mt-1"
            onChange={(v) =>
              store.dispatch(setCharacterFocus(v, StepContext.Education, 0))
            }
          />
          <div style={{ flexShrink: 0 }} className="mt-1">
            <D20IconButton onClick={() => selectRandomFocus(0)} />
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <InputFieldAndLabel
            id="focus2"
            labelName={t('Construct.other.focus2')}
            value={character.educationStep?.focuses[1] || ''}
            className="mt-1"
            onChange={(v) =>
              store.dispatch(setCharacterFocus(v, StepContext.Education, 1))
            }
          />
          <div style={{ flexShrink: 0 }} className="mt-1">
            <D20IconButton onClick={() => selectRandomFocus(1)} />
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <InputFieldAndLabel
            id="focus3"
            labelName={t('Construct.other.focus3')}
            value={character.educationStep?.focuses[2] || ''}
            className="mt-1"
            onChange={(v) =>
              store.dispatch(setCharacterFocus(v, StepContext.Education, 2))
            }
            disabled={track.id === Track.EnlistedSecurityTraining}
          />
          {track.id === Track.EnlistedSecurityTraining ? undefined : (
            <div style={{ flexShrink: 0 }} className="mt-1">
              <D20IconButton onClick={() => selectRandomFocus(2)} />
            </div>
          )}
        </div>

        <div className="text-white mt-2">
          <b>Suggestions: </b>{' '}
          {track.focuses.focusSuggestions
            .map((f) => localizedFocus(f))
            .join(', ')}
        </div>
      </div>
    );
  };

  const renderAttributes = (track: TrackModel) => {
    return (
      <div className="col-lg-6 my-3">
        <Header level={2}>
          {t('Construct.other.attributes') +
            ' ' +
            t('SoloEducationDetailsPage.selectThree')}
        </Header>
        <AttributeListComponent controller={attributeController} />

        {track.attributesRule ? (
          <p>{track.attributesRule?.describe()}</p>
        ) : undefined}
      </div>
    );
  };

  const renderDisciplines = (track: TrackModel) => {
    if (track.id === Track.EnlistedSecurityTraining) {
      return (
        <div className="col-lg-6 my-3">
          <Header level={2}>
            <DisciplinesOrDepartments character={character} />
          </Header>
          <DepartmentView
            points={2}
            skill={Department.Security}
            character={character}
          />
          <DepartmentView
            points={1}
            skill={Department.Conn}
            character={character}
          />
          <DepartmentView
            points={1}
            skill={Department.Engineering}
            character={character}
          />
        </div>
      );
    } else if (track.id === Track.ShipOperations) {
      return (
        <div className="col-lg-6 my-3">
          <Header level={2}>
            <DisciplinesOrDepartments character={character} />
          </Header>
          <DepartmentView
            points={2}
            skill={Department.Conn}
            character={character}
          />
          <DepartmentView
            points={1}
            skill={Department.Engineering}
            character={character}
          />
          <DepartmentView
            points={1}
            skill={Department.Science}
            character={character}
          />
        </div>
      );
    } else if (track.id === Track.UniversityAlumni) {
      return (
        <div className="col-lg-6 my-3">
          <Header level={2}>
            <DisciplinesOrDepartments character={character} />
          </Header>
          <DepartmentView
            points={2}
            skill={Department.Science}
            character={character}
          />
          <DepartmentView
            points={1}
            skill={Department.Engineering}
            character={character}
          />
          <DepartmentView
            points={1}
            skill={Department.Command}
            character={character}
          />
        </div>
      );
    } else if (track.id === Track.ResearchInternship) {
      return (
        <div className="col-lg-6 my-3">
          <Header level={2}>
            <DisciplinesOrDepartments character={character} />
          </Header>
          <DepartmentView
            points={2}
            skill={Department.Science}
            character={character}
          />
          <DepartmentView
            points={1}
            skill={Department.Engineering}
            character={character}
          />
          <DepartmentView
            points={1}
            skill={Department.Medicine}
            character={character}
          />
        </div>
      );
    } else {
      return (
        <div className="col-lg-6 my-3">
          <Header level={2}>
            {t('SoloEducationDetailsPage.primaryDiscipline')}
          </Header>
          <DisciplineListComponent controller={primaryDisciplineController} />

          <Header level={2} className="mt-3">
            {t('SoloEducationDetailsPage.secondaryDiscipline')}
          </Header>
          <DisciplineListComponent controller={secondaryDisciplineController} />

          {track.skillsRule ? <p>{track.skillsRule?.describe()}</p> : undefined}
        </div>
      );
    }
  };

  const renderTalents = () => {
    return (
      <div>
        <SingleTalentSelectionList
          heading={t('Construct.other.talent')}
          talents={filterTalentList()}
          initialSelection={character.educationStep?.talent}
          construct={character}
          onSelection={(talent) => {
            onTalentSelected(talent);
          }}
        />
      </div>
    );
  };

  const filterTalentList = (): RankedTalent[] => {
    return TalentsHelper.getAllAvailableTalentsForCharacter(character)
      .filter((t) => isTalentSelectable(character, t, character.educationStep))
      .map((t) => {
        if (t.maxRank > 1) {
          if (character.educationStep?.talent?.talent === t.name) {
            return new RankedTalent(t, character.getRankForTalent(t.name));
          } else {
            return new RankedTalent(t, character.getRankForTalent(t.name) + 1);
          }
        } else {
          return new RankedTalent(t);
        }
      });
  };

  const onTalentSelected = (talent?: SelectedTalent) => {
    if (talent) {
      store.dispatch(addCharacterTalent(talent, StepContext.Education));
    } else {
      // ?????
      console.log('No talent? This is unpossible!?!');
    }
  };

  const navigateToNextPage = () => {
    if (character.educationStep?.attributes?.length < 3) {
      Dialog.show(t('SoloEducationDetailsPage.errorAttributes'));
    } else if (character.isEducationDisciplinesIncomplete) {
      Dialog.show(t('SoloEducationDetailsPage.errorDisciplines'));
    } else if (
      character.educationStep?.focuses?.filter((f) => !!f).length < 3
    ) {
      Dialog.show(t('SoloEducationDetailsPage.errorFocuses'));
    } else if (!character.educationStep?.value) {
      Dialog.show(t('Common.error.value'));
    } else if (character.educationStep?.talent == null) {
      Dialog.show(t('Common.error.talent'));
    } else {
      const error = determineSelectedTalentExtraErrors(
        character.educationStep?.talent,
      );
      if (error?.length) {
        Dialog.show(error);
      } else if (character.age.isChild) {
        Navigation.navigateToPage(PageIdentity.ChildCareer);
      } else if (character.type === CharacterType.Cadet) {
        Navigation.navigateToPage(PageIdentity.NoviceOrCadetExperience);
      } else {
        Navigation.navigateToPage(PageIdentity.CareerLength);
      }
    }
  };

  return (
    <div className="page container ms-0">
      <CharacterCreationBreadcrumbs pageIdentity={PageIdentity.CareerDetails} />
      <Header>{track.localizedName}</Header>
      <InstructionText text={track.localizedDescription} />
      <div className="row">
        {renderAttributes(track)}
        {renderDisciplines(track)}

        {renderFocuses(track)}

        <div className="col-lg-6 my-3">
          <Header level={2}>{t('Construct.other.value')}</Header>
          <ValueInput
            value={character.educationStep?.value ?? ''}
            onValueChanged={(value) => onValueChanged(value)}
            onRandomClicked={() => randomValue()}
            textDescription={t('Value.starfleetTraining.text')}
          />
        </div>
      </div>
      {renderTalents()}
      <div className="mt-4 d-flex justify-content-end">
        <PageHistoryBasedPreviousButton />
        <Button onClick={() => navigateToNextPage()}>
          {t('Common.button.next')}
        </Button>
      </div>
    </div>
  );
};

export const EducationDetailsPage = connect(characterMapStateToProperties)(
  EducationDetailsPageBase,
);
