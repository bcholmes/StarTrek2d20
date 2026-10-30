import { recordLifepathTalentProgress } from '../state/characterActions';
import { OptionalTalentNote } from '../components/deferredTalentSelection';
import {
  supportsDeferredTalents,
  getLifepathTalentChoices,
} from '../helpers/lifepathTalents';
import React from 'react';
import { Navigation } from '../common/navigator';
import { PageIdentity } from './pageIdentity';
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
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import { Stereotype } from '../common/construct';
import type { ICharacterProperties } from '../solo/page/soloCharacterProperties';
import {
  addCharacterTalent,
  setCharacterSpecies,
  StepContext,
} from '../state/characterActions';
import { CustomSpeciesAttributeController } from '../components/speciesController';
import type { SelectedTalent } from '../common/selectedTalent';
import { RankedTalent } from '../helpers/rankedTalent';
import { isTalentSelectable } from '../helpers/talentSelection';
import { SoloCharacterBreadcrumbs } from '../solo/component/soloCharacterBreadcrumbs';
import { isKlingonWarriorType } from '../helpers/klingonWarrior';
import { PageHistoryBasedPreviousButton } from '../components/pageHistoryBasedPreviousButton';
import { useNavigate } from 'react-router';

interface ICustomSpeciesDetailsProperties extends ICharacterProperties {
  allowCrossSpeciesTalents: boolean;
  allowEsotericTalents: boolean;
}

const CustomSpeciesDetailsPageBase: React.FC<
  ICustomSpeciesDetailsProperties
> = ({ character, allowCrossSpeciesTalents, allowEsotericTalents }) => {
  console.log('Custom Species Page');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const controller = new CustomSpeciesAttributeController(character);

  const renderTalentsSection = () => {
    if (character.stereotype !== Stereotype.SoloCharacter) {
      const talents: RankedTalent[] = [];
      talents.push(
        ...TalentsHelper.getAllAvailableTalentsForCharacter(character)
          .filter((t) =>
            isTalentSelectable(character, t, character.speciesStep),
          )
          .map((t) => {
            if (t.maxRank > 1) {
              if (character.speciesStep?.talent?.talent === t.name) {
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
          }),
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

      return talents.length > 0 && isTalentSelectionRequired() ? (
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
            <div>{renderCrossSpeciesCheckbox()}</div>
            {esotericTalentOption}
            <OptionalTalentNote
              character={character}
              context={StepContext.Species}
            />
          </SingleTalentSelectionList>
        </div>
      ) : (
        <div>
          <Header level={2}>{t('SpeciesDetails.options')}</Header>
          <div>{renderCrossSpeciesCheckbox()}</div>
          {esotericTalentOption}
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

  const onTalentSelected = (talent: SelectedTalent) => {
    store.dispatch(addCharacterTalent(talent, StepContext.Species));
  };

  const isTalentSelectionRequired = () => {
    return (
      character.stereotype !== Stereotype.SoloCharacter &&
      (!isKlingonWarriorType(character.type) || character.version > 1)
    );
  };

  const onNext = () => {
    if (!character.speciesStep.customSpeciesName) {
      Dialog.show(t('CustomSpeciesDetails.speciesNameWarning'));
      return;
    }

    if (character.speciesStep?.attributes?.length !== 3) {
      Dialog.show('You have not distributed all Attribute points.');
      return;
    }

    if (
      isTalentSelectionRequired() &&
      character.speciesStep?.talent == null &&
      !supportsDeferredTalents(character)
    ) {
      Dialog.show('You have not selected a talent.');
      return;
    }

    if (character.stereotype === Stereotype.Npc) {
      navigate('/npc/stats');
    } else {
      store.dispatch(recordLifepathTalentProgress(StepContext.Species));
      Navigation.navigateToPage(PageIdentity.Environment);
    }
  };

  const selectDesc = t('SpeciesDetails.selectThree');

  return (
    <div className="page">
      <div className="container ms-0">
        {character.stereotype === Stereotype.SoloCharacter ? (
          <SoloCharacterBreadcrumbs
            pageIdentity={PageIdentity.SoloCustomSpeciesDetails}
          />
        ) : (
          <CharacterCreationBreadcrumbs />
        )}
        <Header>{t('Page.title.customSpeciesDetails')}</Header>
        <InstructionText text={t('CustomSpeciesDetails.instruction')} />
        <InputFieldAndLabel
          labelName={t('CustomSpeciesDetails.speciesName')}
          id="speciesName"
          onChange={(value) =>
            store.dispatch(
              setCharacterSpecies(
                character.speciesStep?.species,
                character.speciesStep?.attributes,
                undefined,
                undefined,
                value,
              ),
            )
          }
          value={character.speciesStep?.customSpeciesName ?? ''}
        />

        <div className="row">
          <div className="col-12 col-lg-6 my-4">
            <Header level={2}>
              <>
                {t('Construct.other.attributes')} {selectDesc}
              </>
            </Header>
            <div className="mt-4">
              <AttributeListComponent controller={controller} />
            </div>

            <InstructionText text={controller.instructions} />
          </div>
          <div className="col-12 col-lg-6 my-4">
            <Header level={2}>{t('Construct.other.trait')}</Header>
            <p className="mt-3">
              <b>
                {character.speciesStep?.customSpeciesName || 'Custom Species'}
              </b>
            </p>
            <p>{t('CustomSpeciesDetails.speciesTrait')}</p>
          </div>
        </div>
        {renderTalentsSection()}
        <div className="mt-4 d-flex justify-content-end">
          {character.stereotype === Stereotype.MainCharacter ? (
            <PageHistoryBasedPreviousButton />
          ) : undefined}
          <Button onClick={() => onNext()}>{t('Common.button.next')}</Button>
        </div>
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

export const CustomSpeciesDetailsPage = connect(mapStateToProps)(
  CustomSpeciesDetailsPageBase,
);
