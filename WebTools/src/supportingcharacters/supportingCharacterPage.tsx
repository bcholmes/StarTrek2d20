import React, { useEffect, useState } from 'react';
import { Character } from '../common/character';
import { CharacterType, CharacterTypeModel } from '../common/characterType';
import { SpeciesHelper } from '../helpers/species';
import { DropDownElement, DropDownSelect } from '../components/dropDownInput';
import { SupportingCharacterAttributes } from './supportingCharacterAttributes';
import { SupportingCharacterDisciplines } from './supportingCharacterDisciplines';
import { Rank, RanksHelper } from '../helpers/ranks';
import { AgeHelper } from '../helpers/age';
import { Source } from '../helpers/sources';
import { Species } from '../helpers/speciesEnum';
import { store } from '../state/store';
import { hasSource, isSecondEdition } from '../state/contextFunctions';
import { Header } from '../components/header';
import { InputFieldAndLabel } from '../common/inputFieldAndLabel';
import { useTranslation } from 'react-i18next';
import type { ICharacterPageProperties } from '../common/iCharacterPageProperties';
import { connect } from 'react-redux';
import { characterMapStateToProperties } from '../solo/page/soloCharacterProperties';
import {
  StepContext,
  setCharacter,
  setCharacterAge,
  setCharacterAssignment,
  setCharacterDescription,
  setCharacterFocus,
  setCharacterName,
  setCharacterPronouns,
  setCharacterRank,
  setCharacterSpecies,
  setCharacterType,
  setCharacterValue,
  setSupportingCharacterSupervisory,
} from '../state/characterActions';
import { localizedFocus } from '../components/focusHelper';
import { focusRandomTableWithHints } from '../solo/table/focusRandomTable';
import { D20IconButton } from '../solo/component/d20IconButton';
import { CheckBox } from '../components/checkBox';
import ReactMarkdown from 'react-markdown';
import { randomUniqueValue } from '../solo/table/valueRandomTable';
import { SpeciesAbilityView } from '../components/speciesAbilityView';
import { LoadingButton } from '../common/loadingButton';
import { saveCharacterToLocalStorage } from '../state/savedConstructActions';
import { ViewButton } from '../components/viewButton';
import { STAMarkdown } from '../components/staMarkdown';
import { RichTextEditor } from '../components/richTextEditor';
import { Button } from 'react-bootstrap';

const SupportingCharacterPageBase: React.FC<ICharacterPageProperties> = ({
  character,
}) => {
  const { t } = useTranslation();
  const [showRank, setShowRank] = useState(true);
  const [loadingExport, setLoadingExport] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(
    character?.description?.length ? true : false,
  );

  const getAges = () => {
    return AgeHelper.getAllChildAges().map(
      (a, i) => new DropDownElement(i, a.name),
    );
  };

  const selectAge = (index: number) => {
    store.dispatch(setCharacterAge(AgeHelper.getAllChildAges()[index]));
  };

  const showDialog = () => {
    setLoadingExport(true);
    import(
      /* webpackChunkName: 'export' */ '../components/characterSheetDialog'
    ).then(({ CharacterSheetDialog }) => {
      import(/* webpackChunkName: 'export' */ '../exportpdf/sheets').then(
        ({ CharacterSheetRegistry }) => {
          setLoadingExport(false);
          setTimeout(() => {
            const c = store.getState().character.currentCharacter;
            store.dispatch(saveCharacterToLocalStorage(c));
            CharacterSheetDialog.show(
              CharacterSheetRegistry.getSupportingCharacterSheet(c),
              'supporting-character',
              c,
            );
          }, 200);
        },
      );
    });
  };

  const selectSpecies = (selection: Species) => {
    if (selection !== Species.Custom) {
      const speciesModel = SpeciesHelper.getSpeciesByType(selection);
      if (speciesModel.isAttributeSelectionRequired) {
        store.dispatch(setCharacterSpecies(selection));
      } else {
        store.dispatch(
          setCharacterSpecies(
            selection,
            speciesModel.attributes,
            undefined,
            undefined,
            undefined,
            speciesModel.decrementAttributes,
          ),
        );
      }
    } else {
      store.dispatch(setCharacterSpecies(selection));
    }
  };

  const getTypes = () => {
    return CharacterTypeModel.getSupportingCharacterTypes().map(
      (t, i) => new DropDownElement(t.type, t.localizedName),
    );
  };
  const getRanks = () => {
    return RanksHelper.instance()
      .getRanksByType(character.type, character.version)
      .map((r) => new DropDownElement(r.id, r.localizedName));
  };

  const onDescriptionChanged = (value: string) => {
    store.dispatch(setCharacterDescription(value));
  };

  const selectRank = (rank: Rank) => {
    const ranks = RanksHelper.instance()
      .getRanks(character, true)
      .filter((r) => r.id === rank);
    if (ranks.length) {
      store.dispatch(setCharacterRank(ranks[0].name, ranks[0].id));
    }
  };

  const selectType = (characterType: CharacterType) => {
    store.dispatch(setCharacterType(characterType as CharacterType));

    if (
      characterType === CharacterType.Child ||
      characterType === CharacterType.AmbassadorDiplomat ||
      characterType === CharacterType.Civilian ||
      characterType === CharacterType.Tribble
    ) {
      store.dispatch(setCharacterRank(undefined));
      setShowRank(false);
    } else if (character.type === CharacterType.Cadet) {
      const rank = RanksHelper.instance().getRank(Rank.CadetFourthClass);
      store.dispatch(setCharacterRank(rank.name, rank.id));
      setShowRank(true);
    } else {
      const ranks = RanksHelper.instance().getRanksByType(
        characterType,
        character.version,
      );
      if (
        character.rank === null ||
        ranks.filter((r) => r.id === character.rank?.id).length === 0
      ) {
        if (ranks.length > 0) {
          if (characterType === CharacterType.Starfleet) {
            selectRank(Rank.Ensign);
          } else {
            const middleRank = ranks[Math.floor(ranks.length / 2)];
            selectRank(middleRank.id);
          }
        }
      }
      setShowRank(ranks.length > 0);
    }
  };

  const selectRandomFocus = (index: number) => {
    let done = false;
    while (!done) {
      const focus = localizedFocus(
        focusRandomTableWithHints(character.supportingStep?.disciplines[0]),
      );
      if (character.focuses.indexOf(focus) < 0) {
        done = true;
        store.dispatch(
          setCharacterFocus(focus, StepContext.FinishingTouches, index),
        );
      }
    }
  };

  const selectRandomValue = () => {
    const value = randomUniqueValue(
      character.values,
      character.speciesStep?.species,
      character.supportingStep?.disciplines[0],
    );
    store.dispatch(setCharacterValue(value, StepContext.FinishingTouches));
  };

  useEffect(() => {
    const character = Character.createSupportingCharacter(
      store.getState().context.era,
      isSecondEdition() ? 2 : 1,
    );
    store.dispatch(setCharacter(character));
  }, []);

  const getSpeciesList = () => {
    const speciesList = SpeciesHelper.getSpecies(CharacterType.Starfleet).map(
      (s) => {
        return new DropDownElement(s.id, s.localizedName);
      },
    );
    speciesList.push(
      new DropDownElement(Species.Custom, t('Species.other.name')),
    );

    return speciesList;
  };

  const characterAgeAsIndex = () => {
    const age = character.age;
    let result = -1;
    AgeHelper.getAllChildAges().forEach((a, i) => {
      if (a.name === age.name) {
        result = i;
      }
    });
    return result;
  };

  const onSupervisoryChange = (value: boolean) => {
    store.dispatch(setSupportingCharacterSupervisory(value));
  };

  const renderValues = () => {
    if (character?.supportingStep?.supervisory) {
      return (
        <div className="mt-4">
          <Header level={2}>{t('Construct.other.value')}</Header>
          <ReactMarkdown>
            {t('SupportingCharacter.valueInstruction')}
          </ReactMarkdown>
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
            <InputFieldAndLabel
              labelName={t('Construct.other.value')}
              value={character.supportingStep.value ?? ''}
              id="value"
              onChange={(value) => {
                store.dispatch(
                  setCharacterValue(value, StepContext.FinishingTouches),
                );
              }}
            />
            <div style={{ flexShrink: 0 }} className="mt-1">
              <D20IconButton onClick={() => selectRandomValue()} />
            </div>
          </div>
        </div>
      );
    } else {
      return undefined;
    }
  };

  const renderSpeciesAbility = () => {
    const speciesAbility = character?.speciesStep?.ability;
    if (speciesAbility) {
      return (
        <SpeciesAbilityView
          character={character}
          showInstruction={false}
          skill={character?.supportingStep?.disciplines[0]}
        />
      );
    } else {
      return undefined;
    }
  };

  const ageDiv =
    hasSource(Source.PlayersGuide) && character?.age?.isChild ? (
      <div className="mt-4">
        <div className="page-text-aligned">
          {t('SupportingCharacter.howOld')}
        </div>
        <div>
          <DropDownSelect
            items={getAges()}
            defaultValue={characterAgeAsIndex()}
            onChange={(index) => selectAge(index as number)}
          />
        </div>
      </div>
    ) : null;

  const supervisoryDiv =
    character &&
    character?.version > 1 &&
    character?.type !== CharacterType.Child ? (
      <div className="mt-4">
        <div>
          <CheckBox
            text={t('Construct.other.supervisory')}
            isChecked={character?.supportingStep?.supervisory ? true : false}
            value={'supervisor'}
            onChanged={(v) =>
              onSupervisoryChange(
                character?.supportingStep?.supervisory ? false : true,
              )
            }
          />
        </div>
        <ReactMarkdown className="markdown-sm">
          {t('SupportingCharacter.supervisoryNote')}
        </ReactMarkdown>
      </div>
    ) : null;

  return character ? (
    <div className="page container ms-0">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/index.html">{t('Page.title.home')}</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {t('Page.breadcrumb.supportingCharacterCreation')}
          </li>
        </ol>
      </nav>

      <div>
        <Header>{t('Page.title.supportingCharacter')}</Header>

        <div className="row">
          <div className="col-12 col-lg-6 my-4">
            <Header level={2}>{t('Construct.other.characterType')}</Header>
            <p>{t('SupportingCharacter.whatType')}</p>
            <div>
              <DropDownSelect
                items={getTypes()}
                defaultValue={character.type}
                onChange={(index) => selectType(index as CharacterType)}
              />
            </div>

            {ageDiv}
            {supervisoryDiv}
          </div>
          <div className="col-12 col-lg-6 my-4">
            <Header level={2}>
              {t('SupportingCharacter.purposeOrDepartment')}
            </Header>
            <p>{t('SupportingCharacter.whatPurpose')}</p>
            <InputFieldAndLabel
              labelName={t('Construct.other.purpose')}
              value={character.jobAssignment ?? ''}
              onChange={(value) => {
                store.dispatch(setCharacterAssignment(value));
              }}
              id="purpose"
            />
          </div>
        </div>
        <div className="mt-3">
          <Header level={2}>
            {t('SupportingCharacter.speciesAndAttributes')}
          </Header>
          <p>{t('SupportingCharacter.speciesAndAttributesInstruction')}</p>
          <div className="mb-2">
            <DropDownSelect
              items={getSpeciesList()}
              defaultValue={character?.speciesStep?.species}
              onChange={(index) => selectSpecies(index as Species)}
            />
          </div>
          {character.speciesStep?.species === Species.Custom ? (
            <div className="mb-2">
              <InputFieldAndLabel
                labelName={t('Construct.other.species')}
                value={character.speciesStep?.customSpeciesName ?? ''}
                id="speciesName"
                onChange={(value) => {
                  store.dispatch(
                    setCharacterSpecies(
                      character.speciesStep.species,
                      undefined,
                      undefined,
                      undefined,
                      value,
                    ),
                  );
                }}
              />
            </div>
          ) : null}
          <div className="my-3">
            <SupportingCharacterAttributes />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-6 my-3">
          <div className="mt-2 mb-5">
            <Header level={2}>{t('Construct.other.disciplines')}</Header>
            <p>{t('SupportingCharacter.disciplineInstruction')}</p>
            <SupportingCharacterDisciplines />
          </div>

          {renderValues()}
        </div>
        <div className="col-12 col-lg-6 mt-4 mb-5">
          {renderSpeciesAbility()}
          <Header level={2}>{t('Construct.other.focuses')}</Header>
          <p>{t('SupportingCharacter.focusInstruction')}</p>
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
            <InputFieldAndLabel
              labelName={t('Construct.other.focus1')}
              value={character.supportingStep?.focuses[0] ?? ''}
              id="focus1"
              onChange={(value) => {
                store.dispatch(
                  setCharacterFocus(value, StepContext.FinishingTouches, 0),
                );
              }}
            />
            <div style={{ flexShrink: 0 }} className="mt-1">
              <D20IconButton onClick={() => selectRandomFocus(0)} />
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
            <InputFieldAndLabel
              labelName={t('Construct.other.focus2')}
              value={character.supportingStep?.focuses[1] ?? ''}
              id="focus2"
              onChange={(value) => {
                store.dispatch(
                  setCharacterFocus(value, StepContext.FinishingTouches, 1),
                );
              }}
            />
            <div style={{ flexShrink: 0 }} className="mt-1">
              <D20IconButton onClick={() => selectRandomFocus(1)} />
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
            <InputFieldAndLabel
              labelName={t('Construct.other.focus3')}
              value={character.supportingStep?.focuses[2] ?? ''}
              id="focus3"
              onChange={(value) => {
                store.dispatch(
                  setCharacterFocus(value, StepContext.FinishingTouches, 2),
                );
              }}
            />
            <div style={{ flexShrink: 0 }} className="mt-1">
              <D20IconButton onClick={() => selectRandomFocus(2)} />
            </div>
          </div>

          {character?.supportingStep?.supervisory ? (
            <>
              <ReactMarkdown className="mt-4">
                {t('SupportingCharacter.additionalFocusInstruction')}
              </ReactMarkdown>
              <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                <InputFieldAndLabel
                  labelName={t('Construct.other.focus4')}
                  value={character.supportingStep.focuses[3] ?? ''}
                  id="focus4"
                  onChange={(value) => {
                    store.dispatch(
                      setCharacterFocus(value, StepContext.FinishingTouches, 3),
                    );
                  }}
                />
                <div style={{ flexShrink: 0 }} className="mt-1">
                  <D20IconButton onClick={() => selectRandomFocus(3)} />
                </div>
              </div>
            </>
          ) : undefined}
          <Header level={2} className="mt-5">
            {t('SupportingCharacter.nameAndRank')}
          </Header>
          <p>{t('SupportingCharacter.nameAndRankInstruction')}</p>
          {showRank ? (
            <div
              style={{
                borderBottom: '1px solid rgba(128, 128, 128, 0.4)',
                marginBottom: '10px',
                paddingBottom: '18px',
              }}
            >
              <DropDownSelect
                items={getRanks()}
                defaultValue={character.rank?.id}
                onChange={(rank) => selectRank(rank as Rank)}
              />
            </div>
          ) : null}
          <div className="mb-2">
            <InputFieldAndLabel
              labelName={t('Construct.other.name')}
              value={character.name ?? ''}
              id="name"
              onChange={(value) => {
                store.dispatch(setCharacterName(value));
              }}
            />
          </div>
          <div className="mb-2">
            <InputFieldAndLabel
              labelName={t('Construct.other.pronouns')}
              value={character.pronouns ?? ''}
              id="pronouns"
              onChange={(value) => {
                store.dispatch(setCharacterPronouns(value));
              }}
            />
          </div>
        </div>

        <div className="row mb-4">
          {showAdvanced ? (
            <div className="col-12 mt-4">
              <Header level={2} className="mb-3">
                {t('Construct.other.description')}
              </Header>
              <STAMarkdown>
                {t('FinishPage.descriptionInstruction')}
              </STAMarkdown>
              <RichTextEditor
                onChange={onDescriptionChanged}
                initialText={character.description}
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
      </div>
      <div className="button-container mt-4">
        <LoadingButton
          loading={loadingExport}
          className="btn-sm me-2 mb-2"
          onClick={() => showDialog()}
        >
          {t('Common.button.exportPdf')}
        </LoadingButton>
        <ViewButton className="me-2 mb-2" construct={character} />
      </div>
    </div>
  ) : undefined;
};

export const SupportingCharacterPage = connect(characterMapStateToProperties)(
  SupportingCharacterPageBase,
);
