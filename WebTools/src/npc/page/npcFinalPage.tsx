import { useTranslation } from 'react-i18next';
import type { ICharacterProperties } from '../../solo/page/soloCharacterProperties';
import { characterMapStateToProperties } from '../../solo/page/soloCharacterProperties';
import { LcarsFrame } from '../../components/lcarsFrame';
import { PageIdentity } from '../../pages/pageIdentity';
import { CharacterCreationBreadcrumbs } from '../../components/characterCreationBreadcrumbs';
import { connect } from 'react-redux';
import { Header } from '../../components/header';
import { Button } from 'react-bootstrap';
import { store } from '../../state/store';
import { marshaller } from '../../helpers/marshaller';
import { saveCharacterToLocalStorage } from '../../state/savedConstructActions';
import { InputFieldAndLabel } from '../../common/inputFieldAndLabel';
import {
  addNpcCharacterEquipment,
  addNpcCharacterWeapon,
  removeNpcCharacterEquipment,
  removeNpcCharacterWeapon,
  setCharacterDescription,
  setCharacterName,
  setCharacterPronouns,
} from '../../state/characterActions';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ANY_NAMES, SpeciesHelper } from '../../helpers/species';
import { IconButton } from '../../components/iconButton';
import { ModalControl } from '../../components/modal';
import { NpcAddEquipmentView } from '../view/npcAddEquipmentView';
import type { EquipmentModel } from '../../helpers/equipment';
import { EquipmentType } from '../../helpers/equipment';
import type { PersonalWeaponType } from '../../helpers/weapons';
import { NpcAddWeaponView } from '../view/npcAddWeaponView';
import { D20IconButton } from '../../solo/component/d20IconButton';
import { NameGenerator } from '../nameGenerator';
import { RichTextEditor } from '../../components/richTextEditor';

const NpcFinalPageBase: React.FC<ICharacterProperties> = ({ character }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (character == null) {
      navigate('/npc');
    }
  }, [character, navigate]);

  const showViewPage = () => {
    setTimeout(() => {
      const c = store.getState().character.currentCharacter;
      const value = marshaller.encodeCharacter(c);
      store.dispatch(saveCharacterToLocalStorage(c));
      window.open('/view?s=' + value, '_blank');
    }, 200);
  };

  const removeEquipment = (equipment: EquipmentModel) => {
    store.dispatch(
      removeNpcCharacterEquipment(
        equipment.type === EquipmentType.Other ? equipment : equipment.type,
      ),
    );
  };

  const onDescriptionChanged = (value: string) => {
    store.dispatch(setCharacterDescription(value));
  };

  const removeWeapon = (weapon: PersonalWeaponType) => {
    store.dispatch(removeNpcCharacterWeapon(weapon));
  };

  const renderEquipment = () => {
    const automaticEquipment = character.baseEquipmentModels.map((e) => e.type);
    const result = character.equipmentModels.map((e, i) => (
      <tr key={'equip-' + i}>
        {automaticEquipment.includes(e.type) ? (
          <td colSpan={2} className="py-2">
            <p className="mb-0">{e.localizedName}</p>
          </td>
        ) : (
          <>
            <td>
              <p className="mb-0">{e.localizedName}</p>
            </td>
            <td className="text-end">
              <IconButton
                icon="trash"
                variant="danger"
                onClick={() => removeEquipment(e)}
              />
            </td>
          </>
        )}
      </tr>
    ));
    return (
      <table className="selection-list">
        <tbody>{result}</tbody>
      </table>
    );
  };

  const renderWeapons = () => {
    const result = character.determineWeapons().map((w, i) => (
      <tr key={'weapon-' + i}>
        {!character.npcGenerationStep?.weapons?.includes(
          w.personalWeaponType,
        ) ? (
          <td colSpan={2} className="py-2">
            <p className="mb-0">{w.name}</p>
          </td>
        ) : (
          <>
            <td>
              <p className="mb-0">{w.name}</p>
            </td>
            <td className="text-end">
              <IconButton
                icon="trash"
                variant="danger"
                onClick={() => removeWeapon(w.personalWeaponType)}
              />
            </td>
          </>
        )}
      </tr>
    ));
    return (
      <table className="selection-list">
        <tbody>{result}</tbody>
      </table>
    );
  };

  const closeModal = () => {
    ModalControl.hide();
  };

  const showWeaponModal = () => {
    ModalControl.show(
      'lg',
      () => closeModal(),
      <NpcAddWeaponView
        character={character}
        onClose={() => closeModal()}
        addWeapon={(w) => store.dispatch(addNpcCharacterWeapon(w))}
      />,
      t('Construct.system.weapons'),
    );
  };

  const showEquipmentModal = () => {
    ModalControl.show(
      'lg',
      () => closeModal(),
      <NpcAddEquipmentView
        character={character}
        onClose={closeModal}
        addEquipment={(e) => store.dispatch(addNpcCharacterEquipment(e))}
      />,
      'Add Equipment',
    );
  };

  const species = SpeciesHelper.getSpeciesByType(
    character?.speciesStep?.species,
  );
  const nameSuggestions = species?.nameSuggestions ?? ANY_NAMES;

  const suggestions = nameSuggestions
    ?.map((n) => `${n.type}: ${n.suggestions}`)
    .map((n, i) => {
      return <div key={'name-' + i}>{`${n}`}</div>;
    });

  const randomName = () => {
    const { name, pronouns } = NameGenerator.instance.createName(species);
    store.dispatch(setCharacterName(name));
    store.dispatch(setCharacterPronouns(pronouns));
  };

  return character ? (
    <LcarsFrame activePage={PageIdentity.NpcFinal}>
      <div id="app">
        <div className="page container ms-0">
          <CharacterCreationBreadcrumbs
            character={character}
            pageIdentity={PageIdentity.NpcFinal}
          />
          <main>
            <Header>{t('Page.title.npcFinal')}</Header>

            <div className="row">
              <div className="col-lg-6 my-5">
                <Header level={2}>{t('Construct.other.name')}</Header>
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <InputFieldAndLabel
                      labelName={t('Construct.other.name')}
                      id="name"
                      onChange={(value) =>
                        store.dispatch(setCharacterName(value))
                      }
                      value={character.name ?? ''}
                    />
                    {NameGenerator.instance.isSupported(species) ? (
                      <div style={{ flexShrink: 0 }} className="mt-1">
                        <D20IconButton onClick={() => randomName()} />
                      </div>
                    ) : undefined}
                  </div>
                  <div className="text-white mt-1">
                    <small>
                      <b>{t('Common.text.suggestions')}: </b>{' '}
                      <i>{suggestions}</i>
                    </small>
                  </div>
                </div>

                <div className="mt-3">
                  <InputFieldAndLabel
                    labelName={t('Construct.other.pronouns')}
                    id="pronouns"
                    onChange={(value) =>
                      store.dispatch(setCharacterPronouns(value))
                    }
                    value={character.pronouns ?? ''}
                  />
                  <div className="text-white mt-1">
                    <small>
                      <b>{t('Common.text.suggestions')}: </b>{' '}
                      <i>she/her, they/them, etc.</i>
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 my-5">
                <Header level={2}>{t('Construct.other.equipment')}</Header>
                <div className="text-end">
                  <IconButton
                    className="mt-0"
                    onClick={() => showEquipmentModal()}
                    icon="plus-circle"
                    title="Add"
                  />
                </div>

                {renderEquipment()}
              </div>

              <div className="col-lg-6 my-5">
                <Header level={2}>{t('Construct.other.weapons')}</Header>
                <div className="text-end">
                  <IconButton
                    className="mt-0"
                    onClick={() => showWeaponModal()}
                    icon="plus-circle"
                    title="Add"
                  />
                </div>

                {renderWeapons()}
              </div>

              <div className="col-12 mt-4">
                <Header level={2} className="mb-3">
                  {t('Construct.other.description')}
                </Header>
                <RichTextEditor
                  onChange={onDescriptionChanged}
                  initialText={character.description}
                />
              </div>
            </div>

            <div className="button-container mt-4">
              <Button
                size="sm"
                className="me-2 mb-2"
                onClick={() => showViewPage()}
              >
                {t('Common.button.view')}
              </Button>
            </div>
          </main>
        </div>
      </div>
    </LcarsFrame>
  ) : undefined;
};

export const NpcFinalPage = connect(characterMapStateToProperties)(
  NpcFinalPageBase,
);
