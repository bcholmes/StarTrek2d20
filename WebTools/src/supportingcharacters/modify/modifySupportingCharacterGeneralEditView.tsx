import { useTranslation } from 'react-i18next';
import type { ICharacterPageProperties } from '../../common/iCharacterPageProperties';
import { Header } from '../../components/header';
import { STAMarkdown } from '../../components/staMarkdown';
import { Button } from 'react-bootstrap';
import { InputFieldAndLabel } from '../../common/inputFieldAndLabel';
import { RichTextEditor } from '../../components/richTextEditor';
import { useState } from 'react';
import { D20IconButton } from '../../solo/component/d20IconButton';
import { NameGenerator } from '../../npc/nameGenerator';
import { SpeciesHelper } from '../../helpers/species';
import type { SpeciesModel } from '../../helpers/speciesModel';
import { store } from '../../state/store';
import {
  setCharacterDescription,
  setCharacterName,
  setCharacterPronouns,
} from '../../state/characterActions';

interface IModifySupportingCharacterGeneralEditViewProperties extends ICharacterPageProperties {
  onNextStep: () => void;
  onPreviousStep: () => void;
}

export const ModifySupportingCharacterGeneralEditView: React.FC<
  IModifySupportingCharacterGeneralEditViewProperties
> = ({ character, onNextStep, onPreviousStep }) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState<string | undefined>(
    character.description,
  );
  const [name, setName] = useState<string | undefined>(character.name);
  const [pronouns, setPronouns] = useState<string | undefined>(
    character.pronouns,
  );

  const species = SpeciesHelper.getSpeciesByType(
    character?.speciesStep?.species,
  );

  const randomName = (species: SpeciesModel) => {
    const { name, pronouns } = NameGenerator.instance.createName(species);
    setName(name);
    setPronouns(pronouns);
  };

  const applyModification = () => {
    if (name !== character.name) {
      store.dispatch(setCharacterName(name));
    }
    if (pronouns !== character.pronouns) {
      store.dispatch(setCharacterPronouns(pronouns));
    }
    if (description !== character.description) {
      store.dispatch(setCharacterDescription(description));
    }
    onNextStep();
  };

  return (
    <>
      <div className="row">
        <STAMarkdown>
          {t('ModifySupportingCharacter.general.instruction')}
        </STAMarkdown>
        <div className="col-12 col-md-6">
          <Header level={2} className="my-4">
            {t('ModificationType.name.generalEdit')}
          </Header>

          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <InputFieldAndLabel
              labelName={t('Construct.other.name')}
              id="name"
              onChange={setName}
              value={name ?? ''}
            />
            {NameGenerator.instance.isSupported(species) ? (
              <div style={{ flexShrink: 0 }} className="mt-1">
                <D20IconButton onClick={() => randomName(species)} />
              </div>
            ) : undefined}
          </div>

          <div className="mt-3">
            <InputFieldAndLabel
              labelName={t('Construct.other.pronouns')}
              id="pronouns"
              onChange={setPronouns}
              value={pronouns ?? ''}
            />
            <div className="text-white mt-1">
              <small>
                <b>{t('Common.text.suggestions')}: </b>{' '}
                <i>she/her, they/them, etc.</i>
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 mt-4">
          <Header level={2} className="mb-3">
            {t('Construct.other.description')}
          </Header>
          <RichTextEditor
            onChange={setDescription}
            initialText={character.description}
          />
        </div>
      </div>

      <div className="mt-5 d-flex justify-content-between">
        <Button size="sm" onClick={() => onPreviousStep()}>
          {t('Common.button.previous')}
        </Button>
        <Button size="sm" onClick={() => applyModification()}>
          {t('Common.button.finish')}
        </Button>
      </div>
    </>
  );
};
