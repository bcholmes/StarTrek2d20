import { useTranslation } from 'react-i18next';
import { Header } from '../../components/header';
import { LcarsFrame } from '../../components/lcarsFrame';
import { PageIdentity } from '../../pages/pageIdentity';
import type { IStarshipProperties } from '../../starship/iStarshipProperties';
import { useEffect, useState } from 'react';
import { Button, Carousel } from 'react-bootstrap';
import { starshipMapStateToProperties } from '../../solo/page/soloCharacterProperties';
import { connect } from 'react-redux';
import { CharacterAdvancementType } from '../model/characterAdvancementType';
import {
  DropDownElement,
  DropDownSelect,
} from '../../components/dropDownInput';
import Markdown from 'react-markdown';
import { Link, useNavigate } from 'react-router';
import { store } from '../../state/store';
import { saveStarshipToLocalStorage } from '../../state/savedConstructActions';
import { marshaller } from '../../helpers/marshaller';
import { CharacterAdvancementChoice } from '../model/characterAdvancementChoice';
import { StarshipAdvancementChoice } from '../../common/starshipAdvancementChoice';
import { StarshipDepartmentSelector } from '../../components/simpleDepartmentSelector';
import type { Department } from '../../helpers/department';
import type { System } from '../../helpers/systems';
import { makeKey } from '../../common/translationKey';
import { modifyStarshipAddAdvancement } from '../../state/starshipActions';
import { Dialog } from '../../components/dialog';
import { SimpleSystemSelector } from '../../components/simpleSystemSelector';
import type { SelectedTalent } from '../../common/selectedTalent';
import { TalentSelector } from './talentSelector';
import { determineSelectedTalentExtraErrors } from '../../common/selectedTalentExtraCheck';
import { StarshipFreeformTalentSelectionView } from '../../components/starshipFreeformTalentSelectionView';

const ModifyStarshipPageBase: React.FC<IStarshipProperties> = ({
  starship,
}) => {
  const { t } = useTranslation();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [advancementType, setAdvancementType] =
    useState<CharacterAdvancementType>(CharacterAdvancementType.Milestone);
  const navigate = useNavigate();

  const [choice, setChoice] = useState<StarshipAdvancementChoice | undefined>(
    undefined,
  );
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >(undefined);
  const [removedDepartment, setRemovedDepartment] = useState<
    Department | undefined
  >(undefined);
  const [selectedSystem, setSelectedSystem] = useState<System | undefined>(
    undefined,
  );
  const [removedSystem, setRemovedSystem] = useState<System | undefined>(
    undefined,
  );
  const [selectedTalent, setSelectedTalent] = useState<
    SelectedTalent | undefined
  >(undefined);
  const [removedTalentIndex, setRemovedTalentIndex] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (starship == null) {
      navigate('/');
    }
  }, [starship, navigate]);

  const milestoneTypesDropDownItems = () => {
    const result = [];
    result.push(
      new DropDownElement(
        CharacterAdvancementType.Milestone,
        t('CharacterAdvancementType.milestone'),
      ),
    );
    result.push(
      new DropDownElement(
        CharacterAdvancementType.CharacterArc,
        t('CharacterAdvancementType.characterArc'),
      ),
    );
    return result;
  };

  const previousStep = () => {
    setCarouselIndex(carouselIndex - 1);
  };

  const nextStep = () => {
    if (carouselIndex === 0 || carouselIndex === 1) {
      setCarouselIndex(carouselIndex + 1);
    }
  };

  const applyModification = () => {
    if (choice === StarshipAdvancementChoice.Department) {
      if (advancementType === CharacterAdvancementType.Milestone) {
        if (selectedDepartment != null && removedDepartment != null) {
          store.dispatch(
            modifyStarshipAddAdvancement(
              choice,
              selectedDepartment,
              removedDepartment,
            ),
          );
          nextStep();
        } else {
          Dialog.show(t('ModifyStarshipPage.error.twoDepartments'));
        }
      } else {
        if (selectedDepartment != null) {
          store.dispatch(
            modifyStarshipAddAdvancement(choice, selectedDepartment),
          );
          nextStep();
        } else {
          Dialog.show(t('Common.error.department'));
        }
      }
    } else if (choice === StarshipAdvancementChoice.System) {
      if (advancementType === CharacterAdvancementType.Milestone) {
        if (selectedSystem != null && removedSystem != null) {
          store.dispatch(
            modifyStarshipAddAdvancement(choice, selectedSystem, removedSystem),
          );
          nextStep();
        } else {
          Dialog.show(t('ModifyStarshipPage.error.twoSystems'));
        }
      } else {
        if (selectedSystem != null) {
          store.dispatch(modifyStarshipAddAdvancement(choice, selectedSystem));
          nextStep();
        } else {
          Dialog.show(t('Common.error.system'));
        }
      }
    } else if (choice === StarshipAdvancementChoice.Talent) {
      if (advancementType === CharacterAdvancementType.Milestone) {
        if (selectedTalent == null || removedTalentIndex == null) {
          Dialog.show(t('ModifyStarshipPage.error.twoTalents'));
        } else {
          const talentError = determineSelectedTalentExtraErrors(
            selectedTalent,
            starship,
          );
          if (talentError != null) {
            Dialog.show(talentError);
          } else {
            store.dispatch(
              modifyStarshipAddAdvancement(
                choice,
                selectedTalent,
                starship.talentsWithoutSpecialRules[removedTalentIndex],
              ),
            );
            nextStep();
          }
        }
      } else {
        if (selectedTalent == null) {
          Dialog.show(t('Common.error.talent'));
        } else if (
          determineSelectedTalentExtraErrors(selectedTalent, starship) != null
        ) {
          Dialog.show(
            determineSelectedTalentExtraErrors(selectedTalent, starship),
          );
        } else {
          store.dispatch(modifyStarshipAddAdvancement(choice, selectedTalent));
          nextStep();
        }
      }
    }
  };

  const dropDownAdvancementChoices = () => {
    const result = [];
    result.push(new DropDownElement('', ''));
    result.push(
      new DropDownElement(
        StarshipAdvancementChoice.System,
        t('Construct.other.systems'),
      ),
    );
    result.push(
      new DropDownElement(
        CharacterAdvancementChoice.Department,
        t('Construct.other.departments'),
      ),
    );
    result.push(
      new DropDownElement(
        CharacterAdvancementChoice.Talent,
        t('Construct.other.talent'),
      ),
    );
    return result;
  };

  const viewStarship = () => {
    setTimeout(() => {
      const c = store.getState().starship.starship;
      const hash = store.getState().starship.hash;
      store.dispatch(saveStarshipToLocalStorage(c, hash));
      const value = marshaller.encodeStarship(c);
      navigate('/view?s=' + value);
    }, 200);
  };

  const createFinalView = () => {
    return (
      <>
        <div className="row">
          <div className="col-12 col-md-6">
            <Header level={2} className="mt-3">
              {t('Page.title.modificationComplete')}
            </Header>
            <Markdown>{t('ModifyStarship.complete.instruction')}</Markdown>
          </div>
        </div>

        <div className="mt-5">
          <Button size="sm" onClick={() => viewStarship()}>
            {t('Common.button.view')}
          </Button>
        </div>
      </>
    );
  };

  const createDepartmentModification = () => {
    return (
      <>
        <div className="col-12">
          <Header level={2} className="my-4">
            {t('Construct.other.departments')}
          </Header>
          <Markdown>
            {t(
              makeKey(
                'ModifyStarshipPage.',
                CharacterAdvancementType[advancementType],
                '.department.instruction',
              ),
            )}
          </Markdown>
        </div>

        {advancementType === CharacterAdvancementType.Milestone ? (
          <>
            <div className="col-12 col-md-6 mt-5">
              <Header level={2}>{t('Common.text.remove')}</Header>
              <StarshipDepartmentSelector
                starship={starship}
                isChecked={(d) => removedDepartment === d}
                onSelectDepartment={(d) => {
                  setRemovedDepartment(d);
                  if (d === selectedDepartment) {
                    setSelectedDepartment(undefined);
                  }
                }}
                isUpdateable={(d) => starship.departments[d] > 1}
              />
            </div>
            <div className="col-12 col-md-6 mt-5">
              <Header level={2}>{t('Common.text.new')}</Header>
              <StarshipDepartmentSelector
                starship={starship}
                isChecked={(d) => selectedDepartment === d}
                onSelectDepartment={(d) => setSelectedDepartment(d)}
                isUpdateable={(d) =>
                  starship.departments[d] < 4 && d !== removedDepartment
                }
              />
            </div>
          </>
        ) : (
          <div className="col-12 col-md-6 mt-5">
            <Header level={2}>{t('Common.text.new')}</Header>
            <StarshipDepartmentSelector
              starship={starship}
              isChecked={(d) => selectedDepartment === d}
              onSelectDepartment={(d) => setSelectedDepartment(d)}
              isUpdateable={(d) =>
                starship.departments[d] < 5 &&
                !starship.advancementSteps.filter(
                  (s) =>
                    s.choice === StarshipAdvancementChoice.Department &&
                    s.removeValue == null &&
                    s.value === d,
                )?.length
              }
            />
          </div>
        )}
      </>
    );
  };

  const createSystemModification = () => {
    return (
      <>
        <div className="col-12">
          <Header level={2} className="my-4">
            {t('Construct.other.systems')}
          </Header>
          <Markdown>
            {t(
              makeKey(
                'ModifyStarshipPage.',
                CharacterAdvancementType[advancementType],
                '.system.instruction',
              ),
            )}
          </Markdown>
        </div>

        {advancementType === CharacterAdvancementType.Milestone ? (
          <>
            <div className="col-12 col-md-6 mt-5">
              <Header level={2}>{t('Common.text.remove')}</Header>
              <SimpleSystemSelector
                starship={starship}
                isChecked={(d) => removedSystem === d}
                onSelectSystem={(s) => {
                  setRemovedSystem(s);
                  if (s === selectedSystem) {
                    setSelectedSystem(undefined);
                  }
                }}
                isUpdateable={(d) => starship.systems[d] > 6}
              />
            </div>
            <div className="col-12 col-md-6 mt-5">
              <Header level={2}>{t('Common.text.new')}</Header>
              <SimpleSystemSelector
                starship={starship}
                isChecked={(d) => selectedSystem === d}
                onSelectSystem={(s) => setSelectedSystem(s)}
                isUpdateable={(s) =>
                  starship.systems[s] < 11 && s !== removedSystem
                }
              />
            </div>
          </>
        ) : (
          <div className="col-12 col-md-6 mt-5">
            <Header level={2}>{t('Common.text.new')}</Header>
            <SimpleSystemSelector
              starship={starship}
              isChecked={(d) => selectedSystem === d}
              onSelectSystem={(d) => setSelectedSystem(d)}
              isUpdateable={(d) =>
                !starship.advancementSteps.filter(
                  (s) =>
                    s.choice === StarshipAdvancementChoice.System &&
                    s.removeValue == null &&
                    s.value === d,
                )?.length
              }
            />
          </div>
        )}
      </>
    );
  };

  const createTalentModification = () => {
    return (
      <>
        <div className="col-12 mt-4">
          <Header level={2} className="mb-4">
            {t('Construct.other.talent')}
          </Header>
          <Markdown>
            {t(
              makeKey(
                'ModifyStarshipPage.',
                CharacterAdvancementType[advancementType],
                '.talent.instruction',
              ),
            )}
          </Markdown>
        </div>

        {advancementType === CharacterAdvancementType.Milestone ? (
          <>
            <div className="col-12 col-md-6 mt-4">
              <Header level={2}>{t('Common.text.remove')}</Header>
              <TalentSelector
                values={starship.talentsWithoutSpecialRules}
                onSelect={(s, i) => setRemovedTalentIndex(i)}
                isChecked={(s, i) => i === removedTalentIndex}
              />
            </div>
            <div className="col-12 col-md-6 mt-4">
              <Header level={2} className="mb-4">
                {t('Common.text.new')}
              </Header>
              <StarshipFreeformTalentSelectionView
                starship={starship}
                selectedTalent={selectedTalent}
                setSelectedTalent={setSelectedTalent}
              />
            </div>
          </>
        ) : (
          <div className="col-12 col-md-6 mt-4">
            <Header level={2} className="mb-4">
              {t('Common.text.new')}
            </Header>
            <StarshipFreeformTalentSelectionView
              starship={starship}
              selectedTalent={selectedTalent}
              setSelectedTalent={setSelectedTalent}
            />
          </div>
        )}
      </>
    );
  };

  const createModificationOptionsView = () => {
    let option = undefined;
    if (choice === StarshipAdvancementChoice.Department) {
      option = createDepartmentModification();
    } else if (choice === StarshipAdvancementChoice.System) {
      option = createSystemModification();
    } else if (choice === StarshipAdvancementChoice.Talent) {
      option = createTalentModification();
    }

    return (
      <div className="row">
        <div className="col-12">
          <Markdown className="mt-4">
            {t('ModifyStarship.advancementChoice.instruction')}
          </Markdown>
          <div className="my-3">
            <DropDownSelect
              items={dropDownAdvancementChoices()}
              onChange={(v) =>
                setChoice(
                  v === '' ? undefined : (v as StarshipAdvancementChoice),
                )
              }
              defaultValue={choice ?? ''}
            />
          </div>
        </div>
        {option}

        <div className="mt-5 d-flex justify-content-between">
          <Button size="sm" onClick={() => previousStep()}>
            {t('Common.button.previous')}
          </Button>
          <Button
            size="sm"
            disabled={choice === undefined}
            onClick={() => applyModification()}
          >
            {t('Common.button.finish')}
          </Button>
        </div>
      </div>
    );
  };

  const createAdvancementTypeView = () => {
    return (
      <>
        <div className="row mt-4">
          <div className="col-12 col-md-6">
            <Header level={2}>
              {t('Page.title.modificationTypeSelection')}
            </Header>
            <Markdown className="mt-4">
              {t('ModifyStarship.type.instruction')}
            </Markdown>
            <div className="mt-4">
              <DropDownSelect
                items={milestoneTypesDropDownItems()}
                onChange={(v) =>
                  setAdvancementType(v as CharacterAdvancementType)
                }
                defaultValue={advancementType}
              />
            </div>
          </div>
        </div>
        <div className="my-5 text-end">
          <Button size="sm" onClick={() => nextStep()}>
            {t('Common.button.next')}
          </Button>
        </div>
      </>
    );
  };

  return (
    <LcarsFrame activePage={PageIdentity.ModifyStarship}>
      <div id="app">
        <div className="page container ms-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/index.html">{t('Page.title.home')}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t('Page.title.modifyStarship')}
              </li>
            </ol>
          </nav>

          <Header>{t('Page.title.modifyStarship')}</Header>

          <Carousel
            controls={false}
            interval={null}
            activeIndex={carouselIndex}
            indicators={false}
          >
            <Carousel.Item>{createAdvancementTypeView()}</Carousel.Item>

            <Carousel.Item>{createModificationOptionsView()}</Carousel.Item>

            <Carousel.Item>{createFinalView()}</Carousel.Item>
          </Carousel>
        </div>
      </div>
    </LcarsFrame>
  );
};

export const ModifyStarshipPage = connect(starshipMapStateToProperties)(
  ModifyStarshipPageBase,
);
